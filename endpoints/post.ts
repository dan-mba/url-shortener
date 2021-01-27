import validUrl from 'valid-url';
import dns from 'dns';
import { URL } from 'url';
import {findUrl, createAndSaveUrl} from '../database/mongoose';
import {Express} from 'express';

export function init(app: Express) {
  // POST API endpoint...
  app.post("/api/shorturl/new", (req, res) => {
    // Verify URL is valid format
    if (validUrl.isWebUri(req.body.url)) {
      const myURL = new URL(req.body.url);
      // Verify host is valid
      dns.lookup(myURL.hostname,
        (err) => {
          if (err) {
            res.json({ error: "invalid URL" });
          } else {
            // See if URL is already in DB
            findUrl(req.body.url, (err, data) => {
              if (err) { return; }
              if (data) {
                res.json({ original_url: req.body.url, new_url: data.urlId });
              } else {
                createAndSaveUrl(req.body.url, (err, data) => {
                  if (err) {
                    console.log(err);
                    return;
                  }
                  res.json({ original_url: req.body.url, new_url: data.urlId });
                });
              }
            });
          }
        });
    } else {
      res.json({ error: "invalid URL" });
    }
  });
}

export default init;
