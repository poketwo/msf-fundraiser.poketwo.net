import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.DATABASE_URI as string);

const connect = async () => {
  try {
    await client.connect();
    return client.db(process.env.DATABASE_NAME as string);
  } catch (err) {
    throw err;
  }
};

export const dbPromise = connect();

export const fetchValue = async () => {
  const db = await dbPromise;
  const coll = db.collection("fundraiser");
  const doc = await coll.findOne<{ value?: number }>({
    _id: "thanksgiving-2021",
  });
  return doc?.value ?? 0;
};
