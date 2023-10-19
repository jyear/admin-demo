///references d:/nxm/wallet/node_modules/@types/react/index

interface GlobalContext {
  // routPathMap: Record<string, RouteItem>;
  routPathMap: Record<string, RouteItem>;
  routKeyMap: Record<string, RouteItem>;
  menus: MenuItem[];
  permission: string[];
  setContext: (
    fn: (p: GlobalContext) => GlobalContext,
  ) => GlobalContext | ((context: GlobalContext) => void);
}

interface MenuItem {
  label: string;
  children?: MenuItem[];
  path?: string;
  icon?: string | React.ReactElement;
  key?: string;
}
