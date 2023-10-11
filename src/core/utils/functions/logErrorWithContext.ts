import createLogger from './createLogger';
import getErrorMessage from './getErrorMessage';

const logErrorMessages = (err: any, className: string, functionName: string, context = ''): void => {
  const errorTemplate = 'Error occurred in ${className}.${functionName}(): ${err}${context}.';
  const logger = createLogger('ErrorLogger', 'error');
  logger.error(
    errorTemplate
      .replace('${className}', className)
      .replace('${functionName}', functionName)
      .replace('${err}', getErrorMessage(err))
      .replace('${context}', context)
  );
};

export default logErrorMessages;
