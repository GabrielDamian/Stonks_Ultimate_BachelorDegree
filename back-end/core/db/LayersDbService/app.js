const express = require('express');
const mongoose = require('mongoose');
const nodesRoutes = require('./routes/layersRoutes');
const cookieParser = require('cookie-parser');
var cors = require('cors');
const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: [
  [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:3004",
    "http://localhost:3005",
    "http://localhost:3006",
  ]
]}))
// view engine

// database connection
const dbURI = 'mongodb://localhost:27017/nodes';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3007))
  .catch((err) => console.log(err));

// routes
app.use(nodesRoutes);