const express = require('express');
const router = express.Router();
var redis = require("redis"),
    client = redis.createClient();


////////////////////// GET /////////////////////////
/* GET users listing. */
router.get('/', (req, res) => {
    res.send('respond with hello');
});

// Test get user
router.get('/user', (req, res) => {
    res.send('Pls give an uid');
});

// Test get user
router.get('/user/:uid', (req, res) => {
    var uid = "user:" + req.params.uid;
    console.log(uid)

    // Check Redis is running without error
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

router.get('/user/:uid/sentList', (req, res) => {

    var uid = req.params.uid;

    // Check Redis is running without error
    client.on("error", function (err) {
        console.log("Error " + err);
    });

    client.lrange("user:" + uid + ":sentList", 0, -1, function(err, reply) {
        console.log(reply);
        res.send(JSON.stringify(reply));
    });
});

router.get('/user/:uid/receivedList', (req, res) => {

    var uid = req.params.uid;

    // Check Redis is running without error
    client.on("error", function (err) {
        console.log("Error " + err);
    });

    client.lrange("user:" + uid + ":receivedList", 0, -1, function(err, reply) {
        console.log(reply);
        res.send(JSON.stringify(reply));
    });
});

router.get('/user/:uid/friendList', (req, res) => {

    var uid = req.params.uid;

    // Check Redis is running without error
    client.on("error", function (err) {
        console.log("Error " + err);
    });

    client.lrange("user:" + uid + ":friendList", 0, -1, function(err, reply) {
        console.log(reply);
        res.send(JSON.stringify(reply));
    });
});

////////////////////// POST ////////////////////////////

router.post('/user/:uid/addFriend', (req, res) => {

    var uid = req.params.uid;
    var friendId = req.query.friendId;

    // Check Redis is running without error
    client.on("error", function (err) {
        console.log("Error " + err);
    });

    client.rpush("user:" + uid + ":sentList", friendId);
    client.rpush("user:" + friendId + ":receivedList", uid);

    res.send("Request sent");
});

router.post('/user/:uid/acceptRequest', (req, res) => {

    var uid = req.params.uid;
    var friendId = req.query.friendId;

    // Check Redis is running without error
    client.on("error", function (err) {
        console.log("Error " + err);
    });

    client.lrem("user:" + uid + ":receivedList", 1, friendId);
    client.lrem("user:" + friendId + ":sentList", 1, uid);
    client.rpush("user:" + uid + ":friendList", friendId);
    client.rpush("user:" + friendId + ":friendList", uid);

    res.send("Request accepted");
});

router.post('/user/:uid/deleteFriend', (req, res) => {

    var uid = req.params.uid;
    var friendId = req.query.friendId;

    // Check Redis is running without error
    client.on("error", function (err) {
        console.log("Error " + err);
    });

    client.lrem("user:" + uid + ":friendList", 1, friendId);
    client.lrem("user:" + friendId + ":friendList", 1, uid);

    res.send("friend deleted");
});

router.post('/user/:uid/addPost', (req, res) => {

    var uid = req.params.uid;
    var post = {
        postId : "user:" + uid + ":post:",
        description: req.query.description
    };

    // Check Redis is running without error
    client.on("error", function (err) {
        console.log("Error " + err);
    });

    // client.rpush("user:" + uid + ":postList", friendId);

    res.send("posted");
});

///////////////////// PUT /////////////////////////////
// Test create usere
router.put('/createUser/:uid', (req, res) => {
    var uid = "user:" + req.params.uid;
    var name = req.query.name;
    var age = req.query.age;
    var gender = req.query.gender;
    var email = req.query.email;
    var postal = req.query.postal;
    var location = req.query.location;

    client.on("error", function (err) {
        console.log("Error " + err);
    });

    client.hmset(uid, ["name", name, "age", age, "gender", gender, "email address", email, "postal address", postal,"location", location], redis.print);
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

module.exports = router;
