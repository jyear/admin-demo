///reference 'redux-actions'

declare namespace User {
  interface Apis {
    getUserInfo: () => Promise<UserInfo>;
  }

  interface State {
    userInfo: UserInfo;
  }

  interface Action {
    userLogin: ReduxActions.ActionFunction1<any, ReduxActions.Action<UserInfo>>;
  }

  interface UserInfo {
    name: string;
    token: string;
  }
}
