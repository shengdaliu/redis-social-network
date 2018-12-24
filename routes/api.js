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
      client.hget(uid, reply, function (err, res) {
        console.log("   " + reply + ": " + res);
      });
    });
  });

  client.hgetall(uid, function (err, obj) {
    res.send(JSON.stringify(obj));
  });
});
// Get friend invitation sent list of a user
router.get('/user/:uid/sentList', (req, res) => {

  var uid = req.params.uid;

  // Check Redis is running without error
  client.on("error", function (err) {
    console.log("Error " + err);
  });

  client.lrange("user:" + uid + ":sentList", 0, -1, function (err, reply) {
    console.log(reply);
    res.send(JSON.stringify(reply));
  });
});
// Get received friend invitation list of a user
router.get('/user/:uid/receivedList', (req, res) => {

  var uid = req.params.uid;

  // Check Redis is running without error
  client.on("error", function (err) {
    console.log("Error " + err);
  });

  client.lrange("user:" + uid + ":receivedList", 0, -1, function (err, reply) {
    console.log(reply);
    res.send(JSON.stringify(reply));
  });
});
// Get friend list of a user
router.get('/user/:uid/friendList', (req, res) => {

  var uid = req.params.uid;

  // Check Redis is running without error
  client.on("error", function (err) {
    console.log("Error " + err);
  });

  client.lrange("user:" + uid + ":friendList", 0, -1, function (err, reply) {
    console.log(reply);
    res.send(JSON.stringify(reply));
  });
});
// Get status post list of a user
router.get('/user/:uid/postList', (req, res) => {

  var uid = req.params.uid;

  // Check Redis is running without error
  client.on("error", function (err) {
    console.log("Error " + err);
  });

  client.lrange("user:" + uid + ":postList", 0, -1, function (err, reply) {
    console.log(reply);
    res.send(JSON.stringify(reply));
  });
});
// Get comment list of a specific post of a specific user
router.get('/user/:uid/post/:postId/commentList', (req, res) => {

  var uid = req.params.uid;
  var postId = req.params.postId;

  // Check Redis is running without error
  client.on("error", function (err) {
    console.log("Error " + err);
  });

  client.keys("user:" + uid + ":post:" + postId + ":comment:*", function (err, comments) {
    if (err) return console.log(err);
    console.log(comments);
    comments.forEach(function (commentId) {
      console.log("Comment : " + commentId.toString());
    });
    res.send(JSON.stringify(comments));
  });
});

////////////////////// POST ////////////////////////////
// Request for adding a user as friend
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
// Accept a friend request
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
// Delete a friend
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
// Create a status post
router.post('/user/:uid/addPost', (req, res) => {

  var uid = req.params.uid;
  var post = {
    postId: "user:" + uid + ":post:",
    message: req.query.message
  };

  // Check Redis is running without error
  client.on("error", function (err) {
    console.log("Error " + err);
  });

  client.llen("user:" + uid + ":postList", function (err, reply) {
    if (err) {
      console.log("Error " + err);
    }
    post.postId += reply

    client.multi()
      // Create the post using HSET with a specific message and datetime
      .hmset(post.postId, ["message", post.message, "datetime", Date.now()], function (err, reply) {
        if (err) {
          console.log("Error " + err);
        }
      })
      // Add the post to user's post list
      .rpush("user:" + uid + ":postList", post.postId, function (err, reply) {
        if (err) {
          console.log("Error " + err);
        }
      })
      // Add the post to all friends' updates list
      .lrange("user:" + uid + ":friendList", 0, -1, function (err, friends) {
        // console.log(friends);
        friends.forEach(function (friend) {
          client.rpush("user:" + friend + ":updateList", post.postId, function (err, reply) {
            if (err) {
              console.log("Error " + err);
            }
          })
        });
      })
      .exec(function (err, replies) {
        console.log("MULTI got " + replies.length + " replies");
        replies.forEach(function (reply, index) {
          console.log("Reply " + index + ": " + reply.toString());
        });
      });
  })

  res.send("Status update posted");
});
// Add a comment on a specific post of a specific user
router.post('/user/:uid/addComment', (req, res) => {

  var uid = req.params.uid;
  var comment = {
    commentId: req.query.postId + ":comment:",
    message: req.query.message
  };

  // Check Redis is running without error
  client.on("error", function (err) {
    console.log("Error " + err);
  });

  // Every post has a comment list, every comment of the list is associated to a user
  client.keys(comment.commentId + "*", function (err, replies) {
    if (err) {
      console.log("Error " + err);
    }

    comment.commentId += replies.length

    client.multi()
      // Create the comment using HSET with a specific message, id of original user and datetime
      .hmset(comment.commentId, ["message", comment.message, "user", uid, "datetime", Date.now()], function (err, reply) {
        if (err) {
          console.log("Error " + err);
        }
      })
      // Add the comment to user's comment list
      .rpush("user:" + uid + ":commentList", comment.commentId, function (err, reply) {
        if (err) {
          console.log("Error " + err);
        }
      })
      .exec(function (err, replies) {
        console.log("MULTI got " + replies.length + " replies");
        replies.forEach(function (reply, index) {
          console.log("Reply " + index + ": " + reply.toString());
        });
      });
  })

  res.send("Comment posted");
});

///////////////////// PUT /////////////////////////////
// Create a new user
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

  client.hmset(uid, ["name", name, "age", age, "gender", gender, "email address", email, "postal address", postal, "location", location], redis.print);
  client.hkeys(uid, function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
      client.hget("user1", reply, function (err, res) {
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
