import _ from 'lodash';
import React, { useContext, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import SkeletonList from '@/components/skeletionList';
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
    if (
      curRout &&
      curRout.withAuth &&
      (!permission || !permission.includes(menu.key))
    ) {
      return;
    }
    if (menu.children) {
      menu.children = genMenus(menu.children, routKeyMap, permission);
    }
    menuRes.push(menu);
  });
  return menuRes;
};

const CheckAuth = ({ rout, ...props }: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  React.useEffect(() => {
    if (
      !localStorage.getItem('token') &&
      rout.withAuth &&
      location.pathname !== '/login'
    ) {
      navigate(`/login?form=${encodeURIComponent(location.pathname)}`);
      return;
    }
  }, [location.pathname]);
  return props.children;
};

const CustomRoutes = ({ ...props }) => {
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

      let Ele = rout.element;
      if (typeof Ele === 'function') {
        const LazyCom = React.lazy(Ele);
        Ele = (
          <Suspense fallback={<SkeletonList></SkeletonList>}>
            <LazyCom {...props}></LazyCom>
          </Suspense>
        );
      }

      Ele = rout.useLayer ? (
        <BaseLayer>{React.cloneElement(Ele)}</BaseLayer>
      ) : (
        React.cloneElement(Ele, { key: rout.key })
      );

      if (
        rout.withAuth &&
        rout.key &&
        (!globalContext.permission ||
          !globalContext.permission.includes(rout.key))
      ) {
        return;
      }
      rout.element = (
        <CheckAuth rout={rout}>
          {React.cloneElement(Ele, { ...props })}
        </CheckAuth>
      );
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
