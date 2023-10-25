///reference 'redux-actions'

declare namespace User {
  interface Apis {
    getUserInfo: () => Promise<UserInfo>;
    login: (p: LoginParams) => Promise<UserInfo>;
  }

  interface State extends UserInfo {}

  interface Action {
    userLogin: ReduxActions.ActionFunction1<LoginParams, UserInfo>;
    setUserInfo: ReduxActions.ActionFunction0<UserInfo | {}>;
  }

  interface UserInfo {
    accessToken: string;
    avatar: string;
    expiredTime: number | null;
    mobile: string;
    nickName: string;
    refreshExpiredTime: number | null;
    refreshToken: string;
    userCode: string;
    userId: string;
    userType: string;
    username: string;
  }

  interface LoginParams {
    mobile: string;
    code: string;
  }
}
