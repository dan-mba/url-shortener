import {findUrlId} from '../database/mongoose';
import {Express} from 'express';

function get(app: Express) {
  app.get(/\/api\/shorturl\/(.*)/, (req, res) => {
    const inputId = req.params[0];

    // If valid shorturl, redirect to site
    findUrlId(inputId, (err, data) => {
      if (err) {
        res.json({ error: "invalid Short URL" });
      } else {
        res.redirect(data.url);
      }
    });
  });
};
export default get;
