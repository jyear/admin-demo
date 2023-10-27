///reference 'redux-actions'

declare namespace Framework {
  interface State {
    type: FrameworkType;
    sideType: FrameworkSideType;
  }
  interface Action {
    changeFrameworkType: ReduxActions.ActionFunction1<
      FrameworkType,
      FrameworkType
    >;
    changeFrameworkSideType: ReduxActions.ActionFunction0<any>;
  }

  type FrameworkType = 1 | 2;
  type FrameworkSideType = 1 | 2;
}
