const express = require('express');
const router = express.Router();
var redis = require("redis"),
    client = redis.createClient();

/* GET users listing. */
router.get('/', (req, res) => {
    res.send('respond with a resource');
});

// Test create usere
router.put('/createUser/:uid', (req, res) => {

    var uid = req.params.uid;
    var name = req.query.name;
    var age = req.query.age;
    var gender = req.query.gender;
    var email = req.query.email;
    var location = req.query.location;

    client.on("error", function (err) {
        console.log("Error " + err);
    });

    client.hmset(uid, ["name", name, "age", age, "gender", gender, "email", email, "location", location], redis.print);
    client.hkeys(uid, function (err, replies) {
        console.log(replies.length + " replies:");
        replies.forEach(function (reply, i) {
            client.hget("user1", reply, function(err, res) {
                // reply is null when the key is missing
                console.log("   " + reply + ": " + res);
            });
        });
        // client.hgetall("user1", function (err, obj) {
        //     console.dir(obj);
        // });
    });
    res.send('user created');
});


// Test get user
router.get('/user', (req, res) => {
    res.send('Pls give an uid');
});

// Test get user
router.get('/user/:uid', (req, res) => {
    var uid = req.params.uid;

    client.on("error", function (err) {
        console.log("Error " + err);
    });

    client.hkeys(uid, function (err, replies) {
        console.log(replies.length + " replies:");
        replies.forEach(function (reply, i) {
            client.hget(uid, reply, function(err, res) {
                console.log("   " + reply + ": " + res);
            });
        });
    });

    client.hgetall(uid, function (err, obj) {
        res.send(JSON.stringify(obj));
    });
});

module.exports = router;
