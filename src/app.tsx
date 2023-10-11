import React from 'react';
import Routes from '@/routes';
import './app.less';

const App = () => {
  const [name, setName] = React.useState<string>('张三丰');
  return <Routes></Routes>;
};

export default App;
