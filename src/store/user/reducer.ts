import { handleActions, Action } from 'redux-actions';
import { SET_USER } from './types';

const defaultState: User.UserInfo = {
  accessToken: '',
  avatar: '',
  expiredTime: null,
  mobile: '',
  nickName: '',
  refreshExpiredTime: null,
  refreshToken: '',
  userCode: '',
  userId: '',
  userType: '',
  username: '',
};

export const User = handleActions<any>(
  {
    [SET_USER]: (state, { payload }: Action<User.UserInfo>) => {
      return { ...state, ...payload };
    },
  },
  defaultState,
);
