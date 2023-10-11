import { useSelector } from 'react-redux';
import './index.less';

const Header = () => {
  const user = useSelector((state: State) => state.user.name);
  return <div className="main-header">header{user}</div>;
};
export default Header;
