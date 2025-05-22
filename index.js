const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASS}@sajjadjim15.ac97xgz.mongodb.net/?retryWrites=true&w=majority&appName=SajjadJim15`;

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const usersCollection = client.db('ClientDB').collection('users')

        // Add users Data new here Logic Write 
        app.post('/users', async (req, res) => {
            const newUser = req.body
            console.log(newUser)
            const result = await usersCollection.insertOne(newUser)
            res.send(result)
        })

        // ----------------------------------------------------------------------------------------------------------
        //  ALL users taken from Database 
        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result)
        })

        //----------------------------------------------------------------------------------------------------------------
        // Task Part Here 
        //--------------------------------------------------------------------------------------------------------------
        const tasksCollection = client.db('TaskDB').collection('tasks')

        // Add Task Data new here Logic Write 
        app.post('/tasks', async (req, res) => {
            const newUser = req.body
            // console.log(newUser)
            const result = await tasksCollection.insertOne(newUser)
            res.send(result)
        })
        //  single Task Taken code Here 
        app.get('/tasks/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await tasksCollection.findOne(query)
            res.send(result)
        })
        // Update data single Task 
        app.put('/tasks/:id', async (req, res) => {
            const id = req.params.id
            const filterData = { _id: new ObjectId(id) }
            const options = { upsert: true };
            // Full object Taken Here 
            const updatedTask = req.body

            const updatedDoc = {
                $set: updatedTask
            }
            const result = await tasksCollection.updateOne(filterData, updatedDoc, options)
            res.send(result)
        })
        //  ALL Task taken from Database 
        app.get('/tasks', async (req, res) => {
            const result = await tasksCollection.find().toArray();
            res.send(result)
        })
        //Delete Task Items
        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await tasksCollection.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send(`<div>
        <h1>All Users Are running !!!</h1>
        <P>User Server and Task Server Running ......</P>
        <p>This is a Frelancer server .Here user can add Task and Update Task and User can create Account Here.</p>
        </div>
        `)
})

app.listen(port, () => {
    console.log(`All server is running on port ${port}`)
})