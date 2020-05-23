const _error = (message = 'Unknown', status = 500): ClientError => {
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

export const alreadyExists = (message = 'Already exists') => {
  return _error(message, 409);
}

type ClientError = {
  stack: string;
  status: number;
  message: string;
};
