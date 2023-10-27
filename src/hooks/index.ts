import actions from '@/store/actions';

const useCustomHooks = function (): Hooks {
  return {
    userLogin: actions.user.userLogin,
    changeFrameworkType: actions.framework.changeFrameworkType,
    changeFrameworkSideType: actions.framework.changeFrameworkSideType,
  };
};

export default useCustomHooks;
