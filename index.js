const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/isrunning', (request, response) => {
    response.send("<center><h2>Hello...!</br> Server is running...!</h2></center>");
})

app.post('/get-employees', async (request, response) => {
    const client = new MongoClient("mongodb://localhost:27017");

    try {
        await client.connect();
        const dbs = client.db("demodb");
        const coll = dbs.collection("employees");

        const cur = coll.find({}, {});

        let items = [];
        await cur.forEach(function (doc) {
            items.push(doc);
        });
        response.status(200).json(JSON.parse(JSON.stringify(items)));
    } catch (err) {
        console.warn("ERROR: " + err);
    } finally {
        await client.close();
    }
});

app.post('/create-employee', async (request, response) => {
    const client = new MongoClient("mongodb://localhost:27017");
    async function run() {

        try {
            await client.connect();
            const dbs = client.db("demodb");
            const coll = dbs.collection("employees");
            const rest = await coll.insertOne(request.body);

            response.status(201).json(JSON.parse(JSON.stringify(request.body)));

        } catch (err) {
            console.warn("ERROR: " + err);
        } finally {
            await client.close();
        }
    }
    run().catch(console.dir);
});

app.use((req, res, next) => {
    const error = new Error("route not found");
    error.status = 404;
    next(error);
})

app.use((error, ewq, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})

module.exports = app;



/*

RUN PROJECT: npm start

BackEnd URL: http://localhost:8081




*/