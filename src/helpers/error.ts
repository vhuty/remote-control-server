const _error = (message = 'unknown', status = 500): ClientError => {
  return { stack: Error().stack, status, message };
};

export const badRequest = (message = 'Bad request') => {
  return _error(message, 400);
};

export const unauthorized = (message = 'Unauthorized') => {
  return _error(message, 401);
};

export const forbidden = (message = 'Forbidden') => {
  return _error(message, 403);
};

type ClientError = {
  stack: string;
  status: number;
  message: string;
};
