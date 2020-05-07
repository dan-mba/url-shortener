const validUrl = require("valid-url");
const dns = require("dns");
const { URL } = require("url");

const mongoose = require("../database/mongoose");

exports.init = (app) => {
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
            mongoose.findUrl(req.body.url, (err, data) => {
              if (err) { return; }
              if (data) {
                res.json({ original_url: req.body.url, new_url: data.urlId });
              } else {
                mongoose.createAndSaveUrl(req.body.url, (err, data) => {
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
};
