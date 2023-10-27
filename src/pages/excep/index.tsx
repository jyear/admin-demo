import { Skeleton, Result, Button } from 'antd';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import SkeletonList from '@/components/skeletionList';
import GlobalContext from '@/context/global';
import './index.less';

const ExcepPage = () => {
  const location = useLocation();
  const globalContext = useContext(GlobalContext) as GlobalContext;
  const { type } = useSelector((state: Store.State) => state.framework);
  const active = true;
  const menuSkeletion = [1, 2, 3, 4, 5, 6, 7, 8];

  if (!globalContext.routPathMap[location.pathname]) {
    return (
      <div className="excep-page">
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={<Button type="primary">Back Home</Button>}
        />
      </div>
    );
  }

  if (!globalContext.permission) {
    return (
      <div className="main">
        <div className="main-header"></div>
        <div className="main-container">
          {type === 1 && (
            <div
              className="main-container-side"
              style={{ width: '240px', padding: '10px' }}
            >
              {menuSkeletion.map(item => {
                return (
                  <div key={item} className="skeletion-menu">
                    <Skeleton.Input active={active} block={true} />
                  </div>
                );
              })}
            </div>
          )}
          <SkeletonList></SkeletonList>
        </div>
      </div>
    );
  }

  const curRout = globalContext.routPathMap[location.pathname];
  if (
    curRout &&
    curRout.withAuth &&
    !globalContext.permission.includes(curRout.key)
  ) {
    return (
      <div className="excep-page">
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page."
          extra={<Button type="primary">Back Home</Button>}
        />
      </div>
    );
  }
  return null;
};

export default ExcepPage;
