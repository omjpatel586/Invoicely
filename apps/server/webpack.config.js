const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');
const { compilerOptions } = require('../../tsconfig.base.json');

const workspaceRoot = join(__dirname, '../..');

const sharedLibraryAliases = Object.fromEntries(
  Object.entries(compilerOptions.paths).map(([alias, [target]]) => [
    alias,
    join(workspaceRoot, target),
  ])
);

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/server'),
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  resolve: {
    alias: sharedLibraryAliases,
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
      sourceMaps: true,
    }),
  ],
};
