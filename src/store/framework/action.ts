import { createAction } from 'redux-actions';
import { CHANGE_TYPE, CHANGE_SIDE_TYPE } from './types';

export const changeFrameworkType = createAction(CHANGE_TYPE, type => {
  return type;
});
export const changeFrameworkSideType = createAction(CHANGE_SIDE_TYPE, () => {
  return {};
});
