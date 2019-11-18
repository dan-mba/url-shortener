const mongoose = require("../database/mongoose");

exports.init = (app) => {
  app.get(/\/api\/shorturl\/(.*)/, (req, res) => {
    const inputId = req.params[0];

    // If valid shorturl, redirect to site
    mongoose.findUrlId(inputId, (err, data) => {
      if (err) {
        res.json({ error: "invalid Short URL" });
      } else {
        res.redirect(data.url);
      }
    });
  });
};
