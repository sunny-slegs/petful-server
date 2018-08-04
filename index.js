'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Queue = require('./queue');

const { PORT, CLIENT_ORIGIN } = require('./config');
// const { dbConnect } = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');

const app = express();

const catQueue = new Queue();
const dogQueue = new Queue();


app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

const cat = [
  {
    imageURL:'https://assets3.thrillist.com/v1/image/2622128/size/tmg-slideshow_l.jpg',
    imageDescription: 'Orange bengal cat with black stripes lounging on concrete.',
    name: 'Fluffy',
    sex: 'Female',
    age: 2,
    breed: 'Bengal',
    story: 'Thrown on the street'
  },
  {
    imageURL:'https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&h=350',
    imageDescription: 'Grey and white cat with orange eyes',
    name: 'Tammy',
    sex: 'Female',
    age: 3,
    breed: 'American',
    story: 'family moved'
  }
];

const dog = [ {
  imageURL: 'http://www.dogster.com/wp-content/uploads/2015/05/Cute%20dog%20listening%20to%20music%201_1.jpg',
  imageDescription: 'A smiling golden-brown golden retreiver listening to music.',
  name: 'Zeus',
  sex: 'Male',
  age: 3,
  breed: 'Golden Retriever',
  story: 'Owner Passed away'
},
{
  imageURL: 'https://www.pets4homes.co.uk/images/articles/4229/large/pugs-and-eye-disorders-recognising-theres-a-problem-595b4a467850f.jpg',
  imageDescription: 'a pug!',
  name: 'Alex',
  sex: 'Male',
  age: 2,
  breed: 'Pug',
  story: 'got lost'
}
];

cat.forEach(cat => catQueue.enqueue(cat));
dog.forEach(dog => dogQueue.enqueue(dog));

app.get('/api/cat', (req, res) => {
  if (catQueue.peek()) {
    const cat = catQueue.peek();
    res.json(cat);
  } else {
    const err = new Error();
    err.message = 'All cats have been adopted';
    err.status = 400;
  }
});

app.get('/api/dog', (req, res) => {
  if (dogQueue.peek()) {
    const dog = dogQueue.peek();
    res.json(dog);
  } else {
    const err = new Error();
    err.message = 'All dogs have been adopted';
    err.status = 400;
  }
});

app.delete('/api/dog', (req,res) => {
  dogQueue.dequeue();
  res.sendStatus(204);
});

app.delete('/api/cat', (req,res) => {
  catQueue.dequeue();
  res.sendStatus(204);
});

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  //dbConnect();
  runServer();
}

module.exports = { app };
