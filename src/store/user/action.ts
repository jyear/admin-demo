import { createAction } from 'redux-actions';
import Apis from '@/apis';
import { SET_USER } from './types';

export const userLogin = createAction(SET_USER, params => {
  return Apis.User.login(params);
});

export const setUserInfo = createAction(SET_USER, params => {
  const userinfo = localStorage.getItem('userinfo');
  if (!userinfo) return {};
  return JSON.parse(userinfo);
});
