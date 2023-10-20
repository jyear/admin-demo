import React from 'react';
import GlobalContext from '@/context/global';
import Routes from '@/routes';

const App = () => {
  const [globalContext, setGlobalContext] = React.useState<GlobalContext>({
    menus: [],
    routPathMap: {},
    routKeyMap: {},
    setContext: function () {} as any,
    permission: null,
  });

  React.useEffect(() => {
    setTimeout(() => {
      setGlobalContext(context => ({
        ...context,
        permission: ['Wallet', 'Wallet_Platform', 'Dashbord'],
      }));
    }, 2000);
  }, []);

  return (
    <GlobalContext.Provider
      value={{ ...globalContext, setContext: setGlobalContext }}
    >
      <Routes></Routes>
    </GlobalContext.Provider>
  );
};

export default App;
