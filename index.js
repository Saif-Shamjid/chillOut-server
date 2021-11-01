const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

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
        // const orderCollection = database.collection('orders');

        //GET plans
        app.get('/plans',async(req,res)=>{
            const cursor = planCollection.find({});
            const plans = await cursor.toArray();
            res.json(plans);
        })

        //GET Products
        // app.get('/products', async(req,res)=>{
            
        //     const cursor = productCollection.find({});
        //     const page = req.query.page;
        //     const size = 10;
        //     let products;
        //     const count = await cursor.count();
        //     if(page){
        //         products = await cursor.skip(page*size).limit(size).toArray()
        //     }
        //     else{
        //         const products = await cursor.toArray();
        //     }

        //     res.json({products,count})
        // })



        //POST api to get data by keys
        // app.post('/products/byKeys', async(req,res)=>{
        //     const keys = req.body;
        //     const query = {key: {$in: keys}}
        //     const products = await productCollection.find(query).toArray();
        //     res.json(products);
        // })

        //Add order api
        // app.post('/orders', async(req,res)=>{
        //     const order = req.body;
        //     console.log('order ', order);

        //     const result = await orderCollection.insertOne(order);
        //     res.json(result);

        // })

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