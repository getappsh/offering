const { merge } = require("webpack-merge")
const path = require('path');
// TypeScript compilation option
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
// Don't try to replace require calls to dynamic files
const IgnoreDynamicRequire = require('webpack-ignore-dynamic-require');

const { NODE_ENV = 'production' } = process.env;

console.log(`-- Webpack <${NODE_ENV}> build for TypeORM CLI --`);

const BASE_CONFIG = {
  target: 'node',
  mode: NODE_ENV,
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.build.json' })],
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  },
  output: {
    path: path.resolve(__dirname, '../dist/apps/typeorm'),
    filename: '[name].js',
  },
}

const TYPEORM_CONFIG = {
  entry: {
    'data-source': {
      // Are you ready? You must provide a data source as TypeORM cli >= 0.3
      // But this will be a dynamic require(), so Webpack can't know how to handle it
      // in TypeORM code. Instead, export this data source as a library.
      // BUT, TypeORM expect it to be at the top level instead of a module variable, so
      // we MUST remove the library name to make webpack export each variable from data source into the module
      import: './libs/common/src/database/config/ormconfig.ts',
      library: {
        type: 'commonjs2'
      }
    },
    typeorm: './node_modules/typeorm/cli.js'
  },
  externals: [
    {
      'pg-native': 'commonjs2 pg-native',
    }
  ],
  plugins: [
    new IgnoreDynamicRequire(),
  ],
  module: {
    rules: [
      { test: /\.[tj]s$/i, loader: 'shebang-loader' }
    ],
  },
}

const withPlugins = (config) => (runtimeConfig) => ({
  ...config,
  plugins: [
    ...runtimeConfig.plugins,
    ...(config.plugins || [])
  ]
})

const config = merge(BASE_CONFIG, TYPEORM_CONFIG)
module.exports = withPlugins(config)
