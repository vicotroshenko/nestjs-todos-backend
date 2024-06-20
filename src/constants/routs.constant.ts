export const enum TODO_ROUTS {
  TODOS = 'api/todos',
  ALL = '/',
  CREATE = '/',
  GET_BY_ID = '/:id',
  PUT_BY_ID = '/:id',
  DELETE_BY_ID = '/:id',
}

export const enum USER_ROUTS {
  AUTH = 'api/user',
  REGISTER = 'register',
  LOGIN = 'login',
  LOGOUT = 'logout',
  RESET_PASSWORD = 'reset-password',
  CHANGE_PASSWORD = 'password',
  VERIFY = 'verify/:token',
}