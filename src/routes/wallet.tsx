import { WalletOutlined } from '@ant-design/icons';

const config: Array<RouteItem> = [
  {
    element: () => import('@/pages/wallet'),
    path: '/wallet/platform',
    meta: {
      title: 'Home',
    },
    useLayer: true,
    key: 'Wallet_Platform',
    withAuth: true,
  },
  {
    element: () => import('@/pages/wallet'),
    path: '/wallet/platform1',
    meta: {
      title: 'Home',
    },
    useLayer: true,
    key: 'Wallet_Platform2',
    withAuth: true,
  },
  {
    element: () => import('@/pages/walletSet'),
    path: '/wallet/platform/walletset',
    meta: {
      title: 'Home',
    },
    useLayer: true,
    key: 'Wallet_Platform_WalletSet',
    withAuth: true,
  },
];

export const menu: MenuItem[] = [
  {
    label: '钱包管理',
    key: 'Wallet',
    icon: <WalletOutlined />,
    children: [
      {
        label: '平台管理',
        key: 'Wallet_Platform',
        path: '/wallet/platform',
      },
      {
        label: '平台管理1',
        key: 'Wallet_Platform2',
        path: '/wallet/platform1',
      },
    ],
  },
];

export default config;
