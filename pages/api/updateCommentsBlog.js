import { MongoClient, ObjectId } from "mongodb";
async function Handler(req, res) {
  const data = req.body;
  const client = await MongoClient.connect(
    "mongodb+srv://admin:santur9292@vito-mohagheghian-portf.nciqc.mongodb.net/portfolio?retryWrites=true&w=majority"
  );
  const db = client.db();

  const postsCollection = db.collection("blog_page");

  const result = postsCollection.updateOne(
    { _id: ObjectId(data._id) },
    { $set: { comments: data.comments } },
    function () {
      client.close();
    }
  );
  
  res.status(200).json({ PostMessage: "successful" });
}
export default Handler;
