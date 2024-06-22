const enum HttpResponse {
  SUCCESS = 'Success',
  CREATED = 'Created',
  UNAUTHORIZED = 'Unauthorized',
  NOT_FOUND = 'Element was not Found',
  BAD_ID = 'Unexpected id',
  BAD_EMAIL = 'Not valid email',
  BAD_TOKEN = 'Credentials got old',
  BAD_REQUEST = 'Bad requst',
  LOGOUT = 'Logout is successful',
  DELETED = 'Element was deleted successful',
  VERIFIED = 'Your account was verified',
}

export default HttpResponse;
