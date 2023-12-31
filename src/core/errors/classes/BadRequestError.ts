import HTTP_STATUS from 'http-status-codes';
import CustomError from '../abstractClasses/CustomError';

export default class BadRequestError extends CustomError {
  statusCode = HTTP_STATUS.BAD_REQUEST;
  status = 'Known Bad Request Error';

  constructor(message: string) {
    super(message);
  }
}
