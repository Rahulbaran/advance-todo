const { ObjectId, MongoClient } = require("mongodb");

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const mongoUrl = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@netlify.hfq41ty.mongodb.net/?retryWrites=true&w=majority`;

exports.handler = event => {
  const objectID = new ObjectId(event.queryStringParameters.id);
  const updatedTodo = event.queryStringParameters.todo;

  const client = new MongoClient(mongoUrl);
};
