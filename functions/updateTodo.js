const { ObjectId, MongoClient } = require("mongodb");

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const mongoUrl = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@netlify.hfq41ty.mongodb.net/?retryWrites=true&w=majority`;

exports.handler = async event => {
  const parameters = event.queryStringParameters;
  const [objectID, updatedTodo] = [new ObjectId(parameters.id), parameters.todo];

  const client = new MongoClient(mongoUrl);

  try {
    const db = client.db("advance-todo");
    await db
      .collection("todos")
      .findOneAndUpdate({ _id: objectID }, { $set: { item: updatedTodo } });

    return {
      statusCode: 200,
      body: "todo has been updated"
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
