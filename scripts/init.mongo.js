db.customers.remove({});

const waitListDB = [
    {
      id: 1, name: "Lei Jiang", mobile: "18918341412",
      created: new Date('2021-10-25'),
    },
    {
      id: 2, name: "Xiaotian Yang", mobile: "1779078283",
      created: new Date('2021-10-25'),
    },
];

db.customers.insertMany(waitListDB);
const count = db.customers.count();
print('Inserted', count, 'customers');

db.counters.remove({ _id: 'customers' });
db.counters.insert({ _id: 'customers', current: count });

db.issues.createIndex({ id: 1 }, { unique: true });
db.issues.createIndex({ name: 1 });
db.issues.createIndex({ mobile: 1 });
db.issues.createIndex({ created: 1 });