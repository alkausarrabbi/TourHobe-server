require('dotenv').config()
const express=require("express");
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app=express();

app.use(cors());
app.use(express.json());

const port= process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mviji.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('TourHobe');
        const packagesData = database.collection('Packages');
        const bookingData = database.collection('Booking');

        // API CALL or GET PACKAGES DATA FROM DB
        app.get('/packages',async(req,res)=>{
            const cursor=packagesData.find({});
            const packages=await cursor.toArray();
            res.json(packages);
        })

        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const Package = await packagesData.findOne(query);
            res.send(Package);
        })
        app.get('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const data = await bookingData.findOne(query);
            res.send(data);
        })
        app.get('/booking', async (req, res) => {
            const cursor=bookingData.find({});
            const bookings=await cursor.toArray();
            res.json(bookings)
        })

        // post

        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const result = await bookingData.insertOne(booking);
            res.json(result);
            res.send(result);
           
            
        });

        app.post('/packages', async (req, res) => {
            const newPack = req.body;
            const result = await packagesData.insertOne(newPack);
            console.log('got new user', req.body);
            console.log('added user', result);
            res.json(result);
        });


        //UPDATE API
        app.put('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const updatedbooking = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    order:updatedbooking.order
                },
            };
            const result = await bookingData.updateOne(filter, updateDoc, options)
            console.log(result)
            res.json(result)
        })


        
           // DELETE API
        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            console.log(query);
            const result = await bookingData.deleteOne(query);

            console.log('deleting user with id ', result);

            res.json(result);
        })
    


       
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir)

app.get('/',(req,res)=>{
    res.send("welcome to Tour Hobe , live server link by Herku");
})

app.listen(port,()=>{
    console.log("listening Loction is ",port);
})