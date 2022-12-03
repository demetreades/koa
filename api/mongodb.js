import { MongoClient } from 'mongodb';
import config from './config.js';

const uri = `mongodb://${user}:${pass}@${url}`;
const client = new MongoClient(uri, {});

const connection = await client.connect();
console.log(
  await connection
    .db('main-collection')
    .collection('paok')
    .insertOne({ name: 'paok', gate: 4 })
);
await connection.db('main-collection');

export default client;
