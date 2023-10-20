import { createAction } from 'redux-actions';
import { SET_USER } from './types';

export const userLogin = createAction(SET_USER, () => {
  return {};
  // return Apis.User.Login(params);
});
