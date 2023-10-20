declare namespace Store {
  interface State {
    user: User.State;
  }
  interface Action {
    user: User.Action;
  }
}
