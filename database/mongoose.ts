import mongoose, {Schema} from 'mongoose';
import {AutoIncrementID} from '@typegoose/auto-increment';

interface IUrl {
  url: string;
  urlId?: number;
}
// Setup Mongoose Schema
const urlSchema = new Schema<IUrl>({
  url: String,
  urlId: Number
});

// Configure Mongoose auto increment plugin to manage urlId field
urlSchema.plugin(AutoIncrementID, {
  field: "urlId",
});
const Url = mongoose.model<IUrl>("Url", urlSchema);

export async function dbInit()  {
  /* Initialize DB */
  // connect to mongoDB database using mongoose. URL is in .env file for security purposes
  await mongoose.connect(process.env.MONGO_URI!, {family: 4});
}

export async function createAndSaveUrl(inputUrl: string) {
  const url = new Url({ url: inputUrl });
  try {
    const data = await url.save();
    return data;
  } catch(err) {
    console.error(err);
    return null;
  }
}

export async function findUrl(inputUrl: string)  {
  try {
    const data = await Url.findOne({ url: inputUrl });
    return data;
  } catch(err) {
    console.error(err);
    return null;
  }
}

export async function findUrlId(inputId: number) {
  try {
    const data = await Url.findOne({ urlId: inputId });
    return data;
  } catch(err) {
    console.error(err);
    return null;
  }
}
