import { Skeleton } from 'antd';
import './index.less';

const SkeletonList = () => {
  const menuSkeletion = [1, 2, 3, 4, 5, 6, 7, 8];
  const active = true;

  return (
    <div className="main-container-plane">
      <div className="skeletion-filter-box">
        {menuSkeletion.map(item => {
          return (
            <div key={item} className="skeletion-filter">
              <div className="skeletion-filter-name">
                <Skeleton.Input active={active} size={'small'} block={true} />
              </div>
              <div className="skeletion-filter-input">
                <Skeleton.Input active={active} block={true} />
              </div>
            </div>
          );
        })}
        <div style={{ marginRight: 'auto' }}></div>
      </div>
      <div className="skeletion-list">
        {menuSkeletion.map(item => {
          return (
            <div key={item} className="skeletion-row">
              <Skeleton.Input active={active} size={'small'} block={true} />
            </div>
          );
        })}
        {menuSkeletion.map(item => {
          return (
            <div key={item} className="skeletion-row">
              <Skeleton.Input active={active} size={'small'} block={true} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default SkeletonList;
