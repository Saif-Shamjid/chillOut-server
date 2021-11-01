const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 3030;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.68bgv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{

        await client.connect();
        const database = client.db('chill_out');
        const planCollection = database.collection('plans');
        const orderCollection = database.collection('all_order');

        // const orderCollection = database.collection('orders');

        //GET plans
        app.get('/plans',async(req,res)=>{
            const cursor = planCollection.find({});
            const plans = await cursor.toArray();
            res.json(plans);
        })

        



        //POST api to get data by keys
        app.post('/plan/byKeys', async(req,res)=>{
            const keys = req.body.key;
            const query = {_id: ObjectId(keys)}
            const plan = await planCollection.findOne(query);
            res.json(plan);
        })

        // Add order api
        app.post('/addplan', async(req,res)=>{
            const order = req.body;
            console.log('order ', order);

            const result = await planCollection.insertOne(order);
            res.json(result);

        })

        //Post api for store order
        app.post('/setorder', async(req,res)=>{
            // res.json(req.body);
            const email = req.body.email;

            const query = {email: email};
            const options = { upsert: true };
            const userData = await orderCollection.findOne(query);

            // const newOrder = [...userData.order,...req.body.order];
            // res.json(newOrder)

            if(userData){
                const newOrder = {order: [...userData.order,...req.body.order]};
                const newmdOrder = {
                    $set: newOrder
                }
                const result = await orderCollection.updateOne(query,newmdOrder, options);
                res.json(result)
            }
            else{
                const newOrder = {order: [...req.body.order]};
                const newmdOrder = {
                    $set: newOrder
                }
                const result = await orderCollection.updateOne(query,newmdOrder, options);
                res.json(result)

            }
        })

        //Post for set same to same order
        app.post('/setorderex',async(req,res)=>{
            const email = req.body.email;

            const query = {email: email};
            const options = { upsert: true };

            const newOrder = {order: [...req.body.order]};
                const newmdOrder = {
                    $set: newOrder
                }
            const result = await orderCollection.updateOne(query,newmdOrder, options);
            res.json(result)

        })

        //Post single user orders
        app.post('/singleuserorders/',async(req,res)=>{
            const email = req.body.email;
            const query = {email: email};

            const result = await orderCollection.findOne(query);
            res.json(result);
        })

        //Get orderdelails
        app.get('/orderinfo/:id',async(req,res)=>{
            const id = req.params.id;

            const query = {_id: ObjectId(id)}
            const plan = await planCollection.findOne(query);
            res.json(plan);
        })

        //Get all user
        app.get('/alluserinfo',async(req,res)=>{
            const cursor = orderCollection.find({});
            const users = await cursor.toArray();
            res.json(users);
        })

        //Delete user all orders
        app.delete('/deleteuserorder',async(req,res)=>{
            const email = req.body.email;
            const query = { email: email };
            const result = await orderCollection.deleteOne(query);

            const cursor = orderCollection.find({});
            const users = await cursor.toArray();
            res.json(users);
        })

    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir)

app.get('/',(req,res)=>{
    res.send('server is running');
})


app.listen(port,()=>{
    console.log('server is lising on port ',port);
})