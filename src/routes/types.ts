export interface IRoute {
  path: string;
  component: React.FunctionComponent;
  isPublic: boolean;
  adminOnly: boolean;
  redirectTo?: string;
}
