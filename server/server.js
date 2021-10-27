const fs = require('fs');                                                                                                                                                                                                                             
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost/customers';

let db;

let aboutMessage = "Hotel California Waitlist v1.0";

const GraphQLDate = new GraphQLScalarType({
  name: 'GraphQLDate',
  description: 'A Date() type in GraphQL as a scalar',
  serialize(value) {
    return value.toISOString();
  },
  parseValue(value) {
    const dateValue = new Date(value);
    return isNaN(dateValue) ? undefined : dateValue;
  },
  parseLiteral(ast) {
    if (ast.kind == Kind.STRING) {
      const value = new Date(ast.value);
      return isNaN(value) ? undefined : value;
    }
  },
});


const resolvers = {
  Query: {
    about: () => aboutMessage,
    waitList,
  },
  Mutation: {
    setAboutMessage,
    AddCustomer,
    deleteCustomer

  },
  GraphQLDate,
};

function setAboutMessage(_, { message }) {
  return aboutMessage = message; 
}

async function waitList() {
  const customers = await db.collection("customers").find({}).toArray();
  return customers;
}

async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  return result.value.current;
}


async function AddCustomer(_, { customer }) {
  customer.created = new Date();
  customer.id = await getNextSequence('customers');
  const result = await db.collection('customers').insertOne(customer);
  const savedCustomer = await db.collection('customers').findOne({ _id: result.insertedId });
  return savedCustomer;
}

async function deleteCustomer(_, { customer }) {
  const result = await db.collection('customers').deleteOne(customer);
  return result
}

async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
  resolvers,
  formatError: error => {
    console.log(error);
    return error;
  },
});

const app = express();

app.use(express.static('public'));

server.applyMiddleware({ app, path: '/graphql' });

(async function () {
  try {
    await connectToDb();
    app.listen(3000, function () {
      console.log('App started on port 3000');
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
})();