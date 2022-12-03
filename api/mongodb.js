import { MongoClient } from 'mongodb';
import config from './config.js';

const uri = `mongodb://${config.mongodb.username}:${config.mongodb.password}@${config.mongodb.host}:${config.mongodb.port}`;
const client = new MongoClient(uri, {});

const connection = await client.connect();
const data = await connection.db('asd');
const res = await data.collection('asd').insertOne({ name: 'asd', gate: 13 });
// .close();

// console.log(res);
// console.log(data.collection('paok').find({ gate: { $gt: 3 } }));

export default client;
