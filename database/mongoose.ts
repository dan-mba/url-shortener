import mongoose from 'mongoose';
import sequence from 'mongoose-sequence';
const autoIncrement = sequence(mongoose as unknown as mongoose.Schema);

let Url: mongoose.Model<mongoose.Document<any>>;

export function dbInit()  {
  /* Initialize DB */
  // connect to mongoDB database using mongoose. URL is in .env file for security purposes
  mongoose.connect(process.env.MONGO_URI!,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

  // Setup Mongoose Schema
  const urlSchema = new mongoose.Schema({
    url: String,
  });

  // Configure Mongoose auto increment plugin to manage urlId field
  // ignore type conversion issue from @types/mongoose-sequence
  // @ts-ignore
  urlSchema.plugin(autoIncrement, {
    inc_field: "urlId",
    startAt: 1,
  });
  Url = mongoose.model("Url", urlSchema);
};

export function createAndSaveUrl(inputUrl: string, done: (...args: any[]) => any) {
  const url = new Url({ url: inputUrl }!);
  url.save((err, data) => {
    if (err) {
      done(err);
    } else {
      done(null, data);
    }
  });
};

export function findUrl(inputUrl: string, done: (...args: any[])=> any)  {
  Url.findOne({ url: inputUrl }, (err: any, data: any) => {
    if (err) {
      done(err);
    } else {
      done(null, data);
    }
  });
};

export function findUrlId(inputId: any, done: (...args: any[])=> any) {
  Url.findOne({ urlId: inputId }, (err: any, data: any) => {
    if (err) {
      done(err);
    } else {
      done(null, data);
    }
  });
};
