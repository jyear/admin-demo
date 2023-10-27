declare namespace Store {
  interface State {
    user: User.State;
    framework: Framework.State;
  }
  interface Action {
    user: User.Action;
    framework: Framework.Action;
  }
}
