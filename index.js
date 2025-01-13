const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 9000;

const app = express();

const coreOption = {
  origin: ["http://localhost:5173"],
  credentials: true,
  optionSuccessStatus: 200,
};

// Middleware
app.use(cors(coreOption));
app.use(express.json()); // Added parentheses to correctly invoke the middleware

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@database.1mmgb.mongodb.net/?retryWrites=true&w=majority&appName=DataBase`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const jobsCollection = client.db("LoneOrbit1").collection("jobs");
    const bidsCollection = client.db("LoneOrbit1").collection("bids");

    // Fetch data from MongoDB
    app.get("/jobs", async (req, res) => {
      try {
        const jobsData = await jobsCollection.find().toArray();
        res.send(jobsData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).send({ error: "Failed to fetch jobs data" });
      }
    });

    //get a single job data from db using mongodb
    app.get("/job/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await jobsCollection.findOne(query);

      res.send(result);
    });

    //set/save bid data in MOngoDB
    app.post("/bid", async (req, res) => {
      const bidData = req.body;
      console.log(bidData);
      // just to check the data is sending on nor
      const result = await bidsCollection.insertOne(bidData);
      res.send(result);
    });

    //set/save job data in MOngoDB
    app.post("/job", async (req, res) => {
      const JobData = req.body;
      console.log(JobData);
      // just to check the data is sending on nor
      const result = await jobsCollection.insertOne(JobData);
      res.send(result);
    });

    //get all jobs posted by specif USER --> my posted jobs
    app.get("/jobs/:email", async (req, res) => {
      const email = req.params.email;
      const query = { "buyer.email": email };
      const result = await jobsCollection.find(query).toArray();
      res.send(result);
    });

    // Delete job data
    // app.delete("/jobs/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id)};
    //   const result = await jobsCollection.deleteOne(query);
    //   res.send(result);
    // });

    app.delete("/job/:id", async (req, res) => {
      const id = req.params.id;
      console.log(`Request received to delete job with id: ${id}`);

      try {
        const query = { _id: new ObjectId(id) };
        const result = await jobsCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount > 0) {
          res.status(200).json({ message: "Job deleted successfully" });
        } else {
          res.status(404).json({ message: "Job not found" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    //Update job in MOngoDB
    app.put("/job/:id", async (req, res) => {
      const id = req.params.id;
      const jobData = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          ...jobData,
        },
      };
      const result = await jobsCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Error in run function:", error);
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello prof Server");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
