// const request = require('supertest');
// const assert = require('assert');
const express = require('express');
const app = express();
// You have been given an express server which has a few endpoints.
// Your task is to create a global middleware (app.use) which will
// rate limit the requests from a user to only 5 request per second
// If a user sends more than 5 requests in a single second, the server
// should block them with a 404.
// User will be sending in their user id in the header as 'user-id'
// You have been given a numberOfRequestsForUser object to start off with which
// clears every one second

app.use(express.json())

let numberOfRequestsForUser = {};
setInterval(() => {
  numberOfRequestsForUser = {};
}, 3000)

const calculateRate = (req, res, next) => {
  const userid = req.headers.userid
  if (numberOfRequestsForUser[userid]) {
    if (numberOfRequestsForUser[userid] > 2) {
      res.status(404).send('No entry')
    } else {
      numberOfRequestsForUser[userid] = numberOfRequestsForUser[userid] + 1
      next()
    }
  } else {
    numberOfRequestsForUser[userid] = 1
    next()
  }
}

app.use(calculateRate)

app.get('/user', function (req, res) {
  res.status(200).json({ name: 'john' });
});

app.post('/user', function (req, res) {
  res.status(200).json({ msg: 'created dummy user' });
});

app.listen(3000)

module.exports = app;