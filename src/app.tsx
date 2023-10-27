import React from 'react';
import { useSelector } from 'react-redux';
import GlobalContext from '@/context/global';
import useCustomHooks from '@/hooks/index';
import Routes from '@/routes';

// import actions from '@/store/actions';

const App = () => {
  const { changeFrameworkType, changeFrameworkSideType } = useCustomHooks();
  const { sideType, type } = useSelector(
    (state: Store.State) => state.framework,
  );
  const [globalContext, setGlobalContext] = React.useState<GlobalContext>({
    menus: [],
    routPathMap: {},
    routKeyMap: {},
    setContext: function () {} as any,
    permission: null,
  });

  React.useEffect(() => {
    // actions.user.setUserInfo();
    setTimeout(() => {
      setGlobalContext(context => ({
        ...context,
        permission: ['Wallet', 'Wallet_Platform', 'Dashbord'],
      }));
    }, 2000);
  }, []);

  React.useEffect(() => {
    doResize();
    window.addEventListener('resize', doResize);
    return () => {
      window.removeEventListener('resize', doResize);
    };
  }, [type]);

  const doResize = () => {
    const w = document.body.clientWidth;
    if (w < 900 && type === 1) {
      changeFrameworkType(2);
      if (sideType === 1) {
        changeFrameworkSideType();
      }
    }
    if (w >= 900 && type === 2) {
      changeFrameworkType(1);
    }
  };

  return (
    <GlobalContext.Provider
      value={{ ...globalContext, setContext: setGlobalContext }}
    >
      <Routes></Routes>
    </GlobalContext.Provider>
  );
};

export default App;
