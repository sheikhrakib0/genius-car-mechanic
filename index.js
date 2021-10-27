const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();


const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('runing genius car');
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a4uru.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    // console.log('connected to database'); //to chack connectivity
    const database = client.db('geniusCar');
    const servicesCollection = database.collection('services');

    //get api
    app.get('/services', async(req, res)=>{
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);

    });
    
    //get signle api
    app.get('/services/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const service = await servicesCollection.findOne(query);
      res.json(service);
    })

    // post api 
    app.post('/services', async (req, res) => {
      const service = req.body;

      const result = await servicesCollection.insertOne(service);
      // console.log(result);
      res.json(result);
    })

  }
  finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log('running genius car on ', port);
})