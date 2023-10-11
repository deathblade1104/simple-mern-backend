import mongoose from 'mongoose';
import utils from './core/utils';

export default async () => {
  const logger = utils.createLogger('database');
  const connect = async () => {
    try {
      const databaseUrl = 'mongodb+srv://shahbaz:shahbaz123@cluster0.lpbp17n.mongodb.net/?retryWrites=true&w=majority';
      await mongoose.connect(databaseUrl);
      logger.info('Connection to MongoDB is established Successfully');
    } catch (err) {
      utils.logErrorWithContext(err, 'SetupDatabase', 'connect', ' while establishing connection to MongoDB');
      return process.exit(1);
    }
  };
  await connect();
  mongoose.connection.on('disconnected', async () => {
    logger.info('MongoDB Disconnected , attempting to reconnect.');
    await connect();
  });
};
