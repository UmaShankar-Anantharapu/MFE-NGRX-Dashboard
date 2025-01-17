const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  name: 'dashboard',

  exposes: {
    './Component': './projects/dashboard/src/app/app.component.ts',
    './ChartComponent': './projects/dashboard/src/app/chart/chart.component.ts',
    './DashboardComponent': './projects/dashboard/src/app/dashboard/dashboard.component.ts'
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});
