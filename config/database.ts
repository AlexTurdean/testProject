import { ConnectionOptions, connect } from "mongoose";
const { MongoMemoryServer } = require('mongodb-memory-server');



const connectDB = async () => {
  try {
    if(process.env.NODE_ENV != 'test')
    {
        const mongoURI: string = process.env.DATABASE_URL;
        const options: ConnectionOptions = {
          useNewUrlParser: true,
          useCreateIndex: true,
          useFindAndModify: false,
          useUnifiedTopology: true,
        };
        await connect(mongoURI, options);
        console.log("MongoDB Connected...");
    }
    else
    {
        const mongod =await MongoMemoryServer.create();
        const uri = await mongod.getUri();

        const mongooseOpts = {
        useNewUrlParser: true,
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000,
        useCreateIndex: true,
        useFindAndModify: false
        };
        await connect(uri, mongooseOpts);
        console.log("MongoDB(in memory) Connected...");
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
