import React from 'react';
import './app.less';

const App = () => {
  const [name, setName] = React.useState<string>('张三丰');

  return (
    <div className="main">
      <div>11111112323111{name}</div>
      <div>11111112323111{name}</div>
    </div>
  );
};

export default App;
