import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import RateLimit from 'express-rate-limit';
import {dbInit} from './database/mongoose';
const post = require("./endpoints/post");
const get = require("./endpoints/get");

dotenv.config();


const app = express();

const port = process.env.PORT || 3000;

// Setup mongoose
dbInit();

// Enable CORS Requests
app.use(cors());

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
});

// Apply rate limiter to all requests
app.use(limiter);

// Parse POST values
app.use(bodyParser.urlencoded({ extended: false }));

// Setup seving public files
app.use("/public", express.static(`${process.cwd()}/public`));
// Setup home page
app.get("/", (_, res) => {
  res.sendFile(`${process.cwd()}/views/index.html`);
});

// Post API endpoint
post.init(app);

// GET API endpoint
get.init(app);

app.listen(port, () => {
  console.log("Node.js listening ...");
});
