import path from 'path';
import dotenv from 'dotenv';
import fastifyServer from 'fastify';
import cors from 'fastify-cors';
import RateLimit from 'fastify-rate-limit';
import fastifyStatic from 'fastify-static';
import fastifyBody from 'fastify-formbody'
import {dbInit} from './database/mongoose';
import post from './endpoints/post';
import get from './endpoints/get';

dotenv.config();

const fastify = fastifyServer();
const port = process.env.PORT || 3000;

// Setup mongoose
fastify.register(dbInit);

// Enable CORS Requests
fastify.register(cors);

// Apply rate limiter to all requests
fastify.register(RateLimit, {
  max: 10,
  timeWindow: '1 minute'
});

// Parse POST values
fastify.register(fastifyBody);

// Setup serving public files
fastify.register(fastifyStatic, {
  prefix: '/public',
  root: `${process.cwd()}/public`
});

// Setup home page
fastify.get("/", async (_, res) => {
  res.sendFile('index.html',`${process.cwd()}/views`);
});

// Post API endpoint
fastify.register(post);

// GET API endpoint
fastify.register(get);

fastify.listen(port, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Your fastify is listening on port ${address}`);
});
