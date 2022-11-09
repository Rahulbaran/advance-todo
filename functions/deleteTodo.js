const { ObjectId, MongoClient } = require("mongodb");

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const mongoUrl = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@netlify.hfq41ty.mongodb.net/?retryWrites=true&w=majority`;

exports.handler = async function (event) {
  const objectID = new ObjectId(event.queryStringParameters.id);
  const client = new MongoClient(mongoUrl);

  try {
    const db = client.db("advance-todo");
    await db.collection("todos").findOneAndDelete({
      _id: objectID
    });

    return {
      statusCode: 200,
      body: "todo item has been deleted"
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
