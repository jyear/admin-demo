import { handleActions, Action } from 'redux-actions';
import { CHANGE_TYPE, CHANGE_SIDE_TYPE } from './types';

const defaultState = {
  type: 1,
  sideType: 1,
};

export const Framework = handleActions<any>(
  {
    [CHANGE_TYPE]: (state, { payload }: Action<Framework.FrameworkType>) => {
      return { ...state, type: payload };
    },
    [CHANGE_SIDE_TYPE]: state => {
      return { ...state, sideType: state.sideType === 1 ? 2 : 1 };
    },
  },
  defaultState,
);
