import { handleActions, Action } from 'redux-actions';
import { SET_USER } from './types';

const defaultState = {
  name: '张三丰',
  token: '123',
};

export const User = handleActions<any>(
  {
    [SET_USER]: (state, { payload }: Action<User.UserInfo>) => {
      return { ...state, ...payload };
    },
  },
  defaultState,
);
