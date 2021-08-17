import {findUrlId} from '../database/mongoose';
import {FastifyInstance} from 'fastify';

async function get(app: FastifyInstance) {
  app.get<{
    Params: {
      inputId: string
    }
  }>('/api/shorturl/:inputId', async (req, res) => {
    const inputId = req.params['inputId'];

    // If valid shorturl, redirect to site
    findUrlId(inputId, (err, data) => {
      if (err) {
        res.send({ error: "invalid Short URL" });
      } else {
        res.redirect(data.url);
      }
    });
  });
}

export default get;
