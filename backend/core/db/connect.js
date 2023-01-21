import Mongoose from 'mongoose';
import config from '../config';

Mongoose.Promise = global.Promise;

const connectToDb = () => {
  const { dbHost, dbPort, dbName } = config;

  Mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`).then(
    () => {
      console.log('Database successfully connected!');
    },
    (error) => {
      console.error(`Could not connect to database : ${error}`);
    },
  );
};

export default connectToDb;
