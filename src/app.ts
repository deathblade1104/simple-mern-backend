import express, { Express } from 'express';
import databaseConnection from './setupDatabase';
import BackendServer from './setupServer';

class Application {
  static className = 'Application';

  public async initialize(): Promise<void> {
    await databaseConnection();
    const app: Express = express();
    const server: BackendServer = new BackendServer(app);
    server.start();
  }
}

const application: Application = new Application();
application.initialize();
