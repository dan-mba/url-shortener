import mongoose, {Model, Schema} from 'mongoose';
import sequence from 'mongoose-sequence';

const autoIncrement = sequence(mongoose as unknown as Schema);

let Url: Model<{ url?: string | undefined; }, {}, {}, {},
  Schema<any, Model<any, any, any, any, any>, {}, {}, any, {}, any, { url?: string | undefined; }>>;

export async function dbInit()  {
  /* Initialize DB */
  // connect to mongoDB database using mongoose. URL is in .env file for security purposes
  await mongoose.connect(process.env.MONGO_URI!);

  // Setup Mongoose Schema
  const urlSchema = new Schema({
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
  url.save((err: any, data: any) => {
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
