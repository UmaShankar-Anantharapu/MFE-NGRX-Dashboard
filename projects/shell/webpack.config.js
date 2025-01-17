const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  remotes: {
    "dashboard": "http://localhost:4201/remoteEntry.js",
    "configAndDesign": "http://localhost:4202/remoteEntry.js",    
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
    '@angular/animations': {singleton: true},
    '@angular/material': {singleton: true},
    '@ngrx/store': {singleton: true, strictVersion: true},
    '@ngrx/effects': {singleton: true, strictVersion: true},
    '@angular/forms' : {singleton: true, strictVersion: true},
    '@angular-architects/module-federation' : {singleton: true, strictVersion: true},
    '@angular/cdk': { 
      singleton: true,   // Ensure single instance
      strictVersion: true, // Use the exact version across all apps
      requiredVersion: '^18.0.0', // Adjust to your version of Angular CDK
    },
  },

});
