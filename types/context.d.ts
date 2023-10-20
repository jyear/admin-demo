///references d:/nxm/wallet/node_modules/@types/react/index

interface GlobalContext {
  routPathMap: Record<string, RouteItem>;
  routKeyMap: Record<string, RouteItem>;
  menus: MenuItem[];
  permission: string[] | null;
  setContext: (
    fn: (p: GlobalContext) => GlobalContext,
  ) => GlobalContext | ((context: GlobalContext) => void);
}
