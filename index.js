const { MongoClient, ServerApiVersion } = require('mongodb'); //1

const express = require('express')
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 9000

const app = express()

const coreOption = {
    origin :['http://localhost:5173'],
        credentials : true,
        optionSuccessStatus : 200,
}

app.use(cors(coreOption))
app.use(express.json)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@database.1mmgb.mongodb.net/?retryWrites=true&w=majority&appName=DataBase`;
 //2
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  async function run() {
    try {

        const jobsCollection = client.db('LoneOrbit').collection('jobs')
        const jobsCollection = client.db('LoneOrbit').collection('jobs')
        
      //getting data from MongoDB

        app.get('/jobs', async (req, res) =>{

        })


      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } 
    
    finally {
      
    }
  }
  run().catch(console.dir); //3

app.get('/',(req, res ) => {
    res.send ('Hello prof Server')
})

app.listen(port,()=>console.log(`Run on ${port}`))