const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

let Url = null;

exports.init = () => {
  /* Initialize DB */
  // connect to mongoDB database using mongoose. URL is in .env file for security purposes
  mongoose.connect(process.env.MONGO_URI,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

  // Initialize Mongoose auto increment plugin
  autoIncrement.initialize(mongoose.connection);

  // Setup Mongoose Schema
  const { Schema } = mongoose;
  const urlSchema = new Schema({
    url: String,
  });

  // Configure Mongoose auto increment plugin to manage urlId field
  urlSchema.plugin(autoIncrement.plugin, {
    model: "Url",
    field: "urlId",
    startAt: 1,
  });
  Url = mongoose.model("Url", urlSchema);
};

exports.createAndSaveUrl = (inputUrl, done) => {
  const url = new Url({ url: inputUrl });
  url.save((err, data) => {
    if (err) {
      done(err);
    } else {
      done(null, data);
    }
  });
};

exports.findUrl = (inputUrl, done) => {
  Url.findOne({ url: inputUrl }, (err, data) => {
    if (err) {
      done(err);
    } else {
      done(null, data);
    }
  });
};

exports.findUrlId = (inputId, done) => {
  Url.findOne({ urlId: inputId }, (err, data) => {
    if (err) {
      done(err);
    } else {
      done(null, data);
    }
  });
};
