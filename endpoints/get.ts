import {findUrlId} from '../database/mongoose';
import {FastifyInstance} from 'fastify';

async function get(app: FastifyInstance) {
  app.get<{
    Params: {
      inputId: number
    }
  }>('/api/shorturl/:inputId', async function (req, reply) {
    const inputId = req.params['inputId'];

    // If valid shorturl, redirect to site
    const data = await findUrlId(inputId)
    if (!data) {
      return { error: "invalid Short URL" };
    } else {
      reply.redirect(data.url);
    }
  });
}

export default get;
