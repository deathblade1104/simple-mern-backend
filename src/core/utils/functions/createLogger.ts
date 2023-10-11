import bunyan, { LogLevel } from 'bunyan';

const createLogger = (name: string = 'info', level: LogLevel = 'info'): bunyan => {
  return bunyan.createLogger({ name, level });
};

export default createLogger;
