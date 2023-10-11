import HTTP_STATUS from 'http-status-codes';
import utils from '../../utils';
import CustomError from '../abstractClasses/CustomError';

export default class UnauthorizedError extends CustomError {
  statusCode = HTTP_STATUS.UNAUTHORIZED;
  status = 'error';

  constructor(message: string = '') {
    let errorMessage = 'User Unauthorized.';
    if (!utils.isUndefined(message, true)) errorMessage += message;
    super(errorMessage);
  }
}
