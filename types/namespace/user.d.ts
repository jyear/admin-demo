///reference 'redux-actions'

declare namespace User {
  interface Apis {
    getUserInfo: () => Promise<UserInfo>;
  }

  interface State extends UserInfo {}

  interface Action {
    userLogin: ReduxActions.ActionFunction0<ReduxActions.Action<UserInfo>>;
  }

  interface UserInfo {
    name: string;
    token: string;
  }
}
