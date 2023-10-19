import { useSelector } from 'react-redux';
import './index.less';

const Header = () => {
  const user = useSelector((state: State) => state.user.name);
  return (
    <div className="main-header">
      <div className="main-header-logo"></div>
      <div className="main-header-center"></div>
      <div className="main-header-right">header{user}</div>
    </div>
  );
};
export default Header;
