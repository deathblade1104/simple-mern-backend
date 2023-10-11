import compression from 'compression';
import { Application, NextFunction, Request, Response, json, urlencoded } from 'express';
import http from 'http';
import HTTP_STATUS from 'http-status-codes';
import CustomError from './core/errors/abstractClasses/CustomError';
import IErrorResponse from './core/errors/interfaces/IErrorResponse.interface';
import utils from './core/utils/index';
import appRoutes from './routes';

const serverPort = 4040;

class BackendServer {
  static className = 'BackendServer';
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
  }

  private routesMiddleware(app: Application): void {
    appRoutes(app);
  }

  private globalErrorHandler(app: Application): void {
    app.all('*', (req: Request, res: Response) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: `${req.originalUrl} was not found` });
    });

    app.use((error: IErrorResponse, req: Request, res: Response, next: NextFunction) => {
      utils.logErrorWithContext(error, BackendServer.className, 'globalErrorHandler');
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(error.serializationErrors());
        return;
      }
      next();
    });
  }

  private startServer(app: Application): void {
    try {
      const httpServer = new http.Server(app);
      this.startHttpServer(httpServer);
    } catch (error) {
      utils.logErrorWithContext(error, BackendServer.className, 'startServer');
      throw error;
    }
  }

  private startHttpServer(httpServer: http.Server): void {
    httpServer.listen(serverPort, () => {
      const logger = utils.createLogger('setupServer');
      logger.info('Server Started!');
      logger.info(`Visit :  http://localhost:${serverPort}/`);
    });
  }

  public start(): void {
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }
}

export default BackendServer;
