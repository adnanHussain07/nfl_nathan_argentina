import { lazy } from 'react';

const TwoFASecurityConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: true,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  routes: [
    {
      path: '/nfl/dataextract',
      component: lazy(() => import('./twoFASecurity')),
    },
  ],
};

export default TwoFASecurityConfig;
