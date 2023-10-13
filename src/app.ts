import express, { Express } from 'express';
import Database from './setupDatabase';
import BackendServer from './setupServer';

class Application {
  static className = 'Application';

  public async initialize(): Promise<void> {
    const dbInstance = Database.getInstance();
    await dbInstance.databaseConnection();
    const app: Express = express();
    const server: BackendServer = new BackendServer(app);
    server.start();
  }
}

const application: Application = new Application();
application.initialize();
