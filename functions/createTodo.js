const { MongoClient } = require("mongodb");

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const mongoUrl = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@netlify.hfq41ty.mongodb.net/?retryWrites=true&w=majority`;

exports.handler = async function (event) {
  const todo = event.queryStringParameters.todo;
  const client = new MongoClient(mongoUrl);

  try {
    const db = client.db("advance-todo");
    const response = await db.collection("todos").insertOne({
      item: todo
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.insertedId)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  } finally {
    await client.close();
  }
};
