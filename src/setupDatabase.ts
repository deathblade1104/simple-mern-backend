import bunyan from 'bunyan';
import mongoose, { ClientSession, Mongoose } from 'mongoose';
import utils from './core/utils';

//Written with Singleton Design Pattern
class SetupDatabase {
  static className: string = 'SetupDatabase';
  static logger: bunyan = utils.createLogger('database');
  private static instance: SetupDatabase;
  private mongoObjPromise: Promise<Mongoose>;

  private constructor() {
    //constructor makes sure that we have only one active connection to MongoDB Database
    this.mongoObjPromise = this.connectDatabase();
  }

  private async connectDatabase(
    databaseUrl = 'mongodb+srv://shahbaz:shahbaz123@cluster0.lpbp17n.mongodb.net/?retryWrites=true&w=majority'
  ): Promise<Mongoose> {
    try {
      const connection = await mongoose.connect(databaseUrl);
      SetupDatabase.logger.info('Connection to MongoDB is established Successfully');
      return connection;
    } catch (error) {
      utils.logErrorWithContext(
        error,
        SetupDatabase.className,
        'connectDatabase',
        ' while establishing connection to MongoDB'
      );
      throw error;
    }
  }

  //Logic to trigger singleton design pattern
  public static getInstance(): SetupDatabase {
    // if we have an already created instance we return it, else we create a new instance
    if (!this.instance) {
      this.instance = new SetupDatabase();
    }
    return this.instance;
  }

  public async databaseConnection() {
    const mongooseInstance = await this.mongoObjPromise;
    mongooseInstance.connection.on('disconnected', async () => {
      SetupDatabase.logger.info('MongoDB Disconnected, attempting to reconnect.');
      this.mongoObjPromise = this.connectDatabase();
      await this.mongoObjPromise;
    });
  }

  public async getSession(): Promise<ClientSession> {
    const mongooseInstance = await this.mongoObjPromise;
    const currSession = await mongooseInstance.startSession();
    return currSession;
  }
}

export default SetupDatabase;
