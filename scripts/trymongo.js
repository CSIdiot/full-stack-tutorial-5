const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost/customers';

// Atlas URL  - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb+srv://UUU:PPP@cluster0-XXX.mongodb.net/issuetracker?retryWrites=true';

// mLab URL - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb://UUU:PPP@XXX.mlab.com:33533/issuetracker';

function testWithCallbacks(callback) {
  console.log('\n--- testWithCallbacks ---');
  const client = new MongoClient(url, { useNewUrlParser: true });
  client.connect(function(err, client) {
    if (err) {
      callback(err);
      return;
    }
    console.log('Connected to MongoDB');

    const db = client.db();
    const collection = db.collection('customers');

    const customer = { id: 1, name: 'LeiJiang', mobile: '18918341412' };
    collection.insertOne(customer, function(err, result) {
      if (err) {
        client.close();
        callback(err);
        return;
      }
      console.log('Result of insert:\n', result.insertedId);
      collection.find({ _id: result.insertedId})
        .toArray(function(err, docs) {
        if (err) {
          client.close();
          callback(err);
          return;
        }
        console.log('Result of find:\n', docs);
        client.close();
        callback(err);
      });
    });
  });
}

async function testWithAsync() {
  console.log('\n--- testWithAsync ---');
  const client = new MongoClient(url, { useNewUrlParser: true });
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db();
    const collection = db.collection('customers');

    const customer = { id: 2, name: 'Xiaotian', mobile: "13584716966"};
    const result = await collection.insertOne(customer);
    console.log('Result of insert:\n', result.insertedId);

    await collection.updateOne({ _id: result.insertedId }, { $set: {mobile: "18918341412"} });
    console.log('Result of update:\n', result.insertedId);

    const docs = await collection.find({ _id: result.insertedId })
      .toArray();
    console.log('Result of find:\n', docs);

    const result_3 = await collection.find().toArray();
    console.log('Result before deletion:\n', result_3);
    await collection.deleteOne({ name: 'LeiJiang' });
    const result_4 = await collection.find().toArray();
    console.log('Result after deletion:\n', result_4);



  } catch(err) {
    console.log(err);
  } finally {
    client.close();
  }
}

testWithCallbacks(function(err) {
  if (err) {
    console.log(err);
  }
  testWithAsync();
});