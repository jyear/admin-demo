import _ from 'lodash';
import React, { useContext, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalContext from '@/context/global';
import BaseLayer from '@/layer/baseLayer';
import base from './base';
import dashbord, { menu as DashbordMenu, menu } from './dashbord';
import wallet, { menu as WalletMenu } from './wallet';

const menusConfig: MenuItem[] = [...DashbordMenu, ...WalletMenu];
const config: Array<RouteItem> = [...dashbord, ...wallet, ...base];

const genMenus = (menus, routKeyMap, permission): MenuItem[] => {
  const menuRes: MenuItem[] = [];
  if (!menus) {
    menus = _.cloneDeep(menusConfig);
  }
  menus.forEach((menu: MenuItem) => {
    if (!menu.key) return;
    const curRout = routKeyMap[menu.key.toLocaleLowerCase()];
    if (curRout && curRout.withAuth && !permission.includes(menu.key)) {
      return;
    }
    if (menu.children) {
      menu.children = genMenus(menu.children, routKeyMap, permission);
    }
    menuRes.push(menu);
  });
  return menuRes;
};

const CustomRoutes = () => {
  const [routes, setRoutes] = React.useState<Array<RouteItem>>([]);
  const globalContext = useContext(GlobalContext) as GlobalContext;

  React.useEffect(() => {
    genRoutes();
  }, []);
  React.useEffect(() => {
    genRoutes();
  }, [globalContext.permission]);

  const genRoutes = () => {
    const routesCfg: Array<RouteItem> = [];
    const routPathMap = {}; // 采用path映射
    const routKeyMap = {}; // 采用key映射

    _.cloneDeep(config).forEach(rout => {
      routPathMap[rout.path] = { ...rout };
      routKeyMap[rout.key.toLocaleLowerCase()] = { ...rout };
      //{ key: rout.key }

      const el = rout.element;
      if (typeof el === 'function') {
        const LazyCom = React.lazy(el);
        rout.element = (
          <Suspense fallback={'loading'}>
            <LazyCom></LazyCom>
          </Suspense>
        );
      }

      rout.element = rout.useLayer ? (
        <BaseLayer>{React.cloneElement(rout.element)}</BaseLayer>
      ) : (
        React.cloneElement(rout.element, { key: rout.key })
      );

      if (
        rout.withAuth &&
        rout.key &&
        !globalContext.permission.includes(rout.key)
      ) {
        return;
      }
      routesCfg.push(rout);
    });
    const useMenus = genMenus(null, routKeyMap, globalContext.permission);

    globalContext.setContext(
      (context: GlobalContext): GlobalContext => ({
        ...context,
        menus: useMenus,
        routPathMap,
        routKeyMap,
      }),
    );
    setRoutes([...routesCfg]);
  };

  return (
    <Router>
      <Routes>
        {routes.map(routItem => {
          return (
            <Route
              key={routItem.key}
              element={routItem.element as React.ReactElement}
              path={routItem.path}
            />
          );
        })}
      </Routes>
    </Router>
  );
};

export default CustomRoutes;
