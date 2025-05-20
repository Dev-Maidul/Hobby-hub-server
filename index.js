const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.to037gz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const groupCollection = client.db('hobbyDB').collection('hobbies');
       // Create or Post
    app.post('/groups',async(req,res)=>{
        const newGroup=req.body;
        // console.log(newGroup);
        const result=await groupCollection.insertOne(newGroup);
        res.send(result);

    });
    // get all data 
    app.get('/groups', async (req,res)=>{
      const result=await groupCollection.find().toArray();
      res.send(result);
    })
    // get group by id 
    app.get('/groups/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await groupCollection.findOne(query);
  res.send(result); 
});

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send("Hobby-hub server is running");
});

app.listen(port, () => {
  console.log(`Hobby-hub server running on port: ${port}`);
});
