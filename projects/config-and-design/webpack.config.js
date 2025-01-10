const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  name: 'configAndDesign',

  exposes: {
    './Component': './projects/config-and-design/src/app/app.component.ts',
    './CreateChartConfigComponent': './projects/config-and-design/src/app/components/create-chart-config/create-chart-config.component.ts',
    './CreatChartDesignComponent': './projects/config-and-design/src/app/components/create-chart-design/create-chart-design.component.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});
