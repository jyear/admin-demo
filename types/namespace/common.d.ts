declare namespace Common {
  interface Apis {
    getPermission: () => Promise<string[]>;
  }
}
