import path         from 'path';
import merge        from 'webpack-merge';

import packageJson  from './package.json'

import baseConfig   from './webpack.config.base';
import babelLoader  from './builder/loaders/babel';


export default merge(
    baseConfig,
    {
        entry: './src/index.js',

        output: {
            path: path.resolve(__dirname, "lib"),
            library: packageJson.name,
            libraryTarget: 'umd',
            umdNamedDefine: true
        },
    },
    babelLoader
);