const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  remotes: {
    "dashboard": "http://localhost:4200/remoteEntry.js",
    "configAndDesign": "http://localhost:4200/remoteEntry.js",    
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
    '@angular/animations': {singleton: true},
    '@angular/material': {singleton: true},
    '@ngrx/store': {singleton: true, strictVersion: true},
    '@ngrx/effects': {singleton: true, strictVersion: true},
    '@angular/cdk': { singleton: true },
  },
  
});
