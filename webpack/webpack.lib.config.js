const path = require("path")
const autoprefixer = require('autoprefixer')
const fs = require('fs')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const config = require('../config.json')

const getExternals = require('./utils').getExternals

module.exports = {
    entry: getEntries(),

    output: {
        filename: '[name]/index.js',
        publicPath: "/lib/",
        path: path.resolve(__dirname, "../lib"),
        library: '@fs/cc-ui-[name]',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader'
            },
            {
                test: /\.(css|less)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: require.resolve('css-loader'),
                            options: {
                                importLoaders: 1,
                            },
                        },
                        {
                            loader: require.resolve('postcss-loader'),
                            options: {
                                // Necessary for external CSS imports to work
                                // https://github.com/facebookincubator/create-react-app/issues/2677
                                ident: 'postcss',
                                plugins: () => [
                                    require('postcss-flexbugs-fixes'),
                                    autoprefixer({
                                        browsers: [
                                            '>1%',
                                            'last 4 versions',
                                            'Firefox ESR',
                                            'not ie < 9', // React doesn't support IE8 anyway
                                        ],
                                        flexbox: 'no-2009',
                                    }),
                                ],
                            },
                        },

                        {
                            loader: require.resolve('less-loader')
                        }
                    ]
                })
            },
            // 加载图片
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: require.resolve('url-loader'),
                options: {
                    limit: 10000,
                    name: '[name]/images/[name].[hash:8].[ext]',
                },
            }
        ]
    },
    devtool: 'source-map',

    plugins: [
        new ExtractTextPlugin({
            filename: '[name]/index.css'
        }),
    ],

    externals: getExternals(config.libNames)
}

/**
 * 生成所有的入口键值对
 * {
 *  a: '/src/a/index.jsx'
 * }
 */
function getEntries() {
    const allFileNames = fs.readdirSync(path.resolve(__dirname, '../src'))
    const entries = {}
    const externals = require('./dir-external')

    allFileNames.forEach((dirname) => {
        if (externals.indexOf(dirname) > -1) return

        entries[dirname] = path.resolve(__dirname, '../src', dirname, 'index.jsx')
    })

    return entries
}
