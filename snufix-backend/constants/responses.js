export const API_RESPONSES = {
  SUCCESS: { success: true },
  ERROR: { success: false },
  NOT_FOUND: { success: false, message: 'Resource not found' },
  UNAUTHORIZED: { success: false, message: 'Unauthorized' },
  FORBIDDEN: { success: false, message: 'Forbidden' },
  BAD_REQUEST: { success: false, message: 'Bad request' },
  SERVER_ERROR: { success: false, message: 'Server error' }
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};
