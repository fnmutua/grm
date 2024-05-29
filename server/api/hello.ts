import clientPromise from '../utils/mongodb';

export default defineEventHandler(async (event) => {
  const client = await clientPromise;
  const db = client.db('ussd');

  const data = await db.collection('grievances').find({}).toArray();

  return {
    data,
  };
});
