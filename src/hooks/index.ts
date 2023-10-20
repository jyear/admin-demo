import actions from '@/store/actions';

const useCustomHooks = function (): Hooks {
  return {
    userLogin: actions.user.userLogin,
  };
};

export default useCustomHooks;
