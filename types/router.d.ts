interface RouteItem {
  useLayer: boolean;
  key: string;
  element: React.ReactElement | Function;
  path: string;
  meta?: {
    title?: string;
  };
  withAuth?: boolean;
}
