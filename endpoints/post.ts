import {promisify} from 'util';
import validUrl from 'valid-url';
import {lookup} from 'dns';
import { URL } from 'url';
import {findUrl, createAndSaveUrl} from '../database/mongoose';
import {FastifyInstance} from 'fastify';

const lookupAsync = promisify(lookup);

async function post(app: FastifyInstance) {
  // POST API endpoint...
  app.post<{
    Body: {
      url: string
    }
  }>("/api/shorturl/new", async function (req) {
    // Verify URL is valid format
    if (!validUrl.isWebUri(req.body.url)) {
      return{ error: "invalid URL" };
    }
    const myURL = new URL(req.body.url);
    // Verify host is valid
    try {
      await lookupAsync(myURL.hostname);
    } catch(err) {
      return { error: "invalid URL" };
    }
    // See if URL is already in DB
    const found = await findUrl(req.body.url);
    if (found) {
        return { original_url: req.body.url, new_url: found.urlId };
    }

    const saved = await createAndSaveUrl(req.body.url);
    if (!saved) {
      return;
    }
    return { original_url: req.body.url, new_url: saved.urlId };
  });
}

export default post;
