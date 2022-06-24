import { MongoClient } from "mongodb";
export default async function handler(req, res) {
  const client = await MongoClient.connect(
    "mongodb+srv://admin:santur9292@vito-mohagheghian-portf.nciqc.mongodb.net/portfolio?retryWrites=true&w=majority"
  );
  const db = client.db();
  const postsCollection = db.collection("blog_page");

  const postDocuments = await postsCollection.find({}).toArray();
  console.log(postDocuments);
  res.status(200).json(JSON.stringify(postDocuments));
}
