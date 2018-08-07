var path = require('path');
var minimist = require('minimist');
var webpack = require('webpack');
var fs = require('fs');

const BabiliPlugin = require('babili-webpack-plugin');

const URL = "http://route-to-production"

const API = (process.env.NODE_ENV == 'production' ? "http://route-to-production" : "http://another-route")

let knownOptions = {
    string: 'min',
    default: {
        'min': false
    }
};

const options = minimist(process.argv.slice(2), knownOptions),
    pkg = JSON.parse(fs.readFileSync('./package.json')),
    currentYear = (new Date()).getFullYear();

let plugins = [
    new webpack.optimize.CommonsChunkPlugin({
        name:"vendor",
        filename: "[name].bundle.min.js",
        chunkFilename: "[id].bundle.min.js",
        minChunks: Infinity,
    }),
    new webpack.DefinePlugin({
        'ENVIRONMENT': JSON.stringify((process.env.NODE_ENV || 'development')),
        'VERSION': JSON.stringify(require('./package.json').version),
        'API': JSON.stringify(API),
        'URL': JSON.stringify(URL)
    }),
    new webpack.ProvidePlugin({
        page: 'page'
    })
]


let config = {

    module: {

        loaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,

                query: {
                    presets:["es2015","stage-0","preact"],
                    plugins: ["transform-es2015-template-literals"]
                }
            },
            { test: /\.css$/, loader: "css-to-string-loader!css-loader" },
            { test: /\.png$/, loader: "url-loader?limit=100000" },
            { test: /\.jpg$/, loader: "file-loader" },


            // required to write "require('./style.css')"
            //{ test: /\.css$/,    loader: "style-loader!css-loader" },

            // required for bootstrap icons
            // { test: /\.woff$/, loader: "url-loader?prefix=public/font/&limit=10000&mimetype=application/font-woff" },
            // { test: /\.ttf$/, loader: "file-loader?prefix=public/font/" },
            // { test: /\.eot$/, loader: "file-loader?prefix=public/font/" },
            // { test: /\.svg$/, loader: "file-loader?prefix=public/font/" },


            {
                test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
                loader: 'url-loader'
            }
            // required for react jsx
            //, { test: /\.jsx$/, loader: "msx-loader" },
            //,{ test: /\.jsx$/,   loader: "msx-loader?insertPragma=React.DOM" },
        ]
    },
    resolve: {
        extensions: ['.json','.js', '.jsx'],
        alias: {
            'react': 'preact-compat',
            'react-dom': 'preact-compat',
            'create-react-class': 'preact-compat/lib/create-react-class',
		    'public': path.join(__dirname, "public"),
            'app':path.join(__dirname, "client/app"),
		    'api':path.join(__dirname, "client/api"),
            //'preact-router':path.join(__dirname, "plugins/preact-router.js"),
        },
    },
    plugins: plugins
};


if (options.min !== false) {
    if(process.env.NODE_ENV!=='production'){
        plugins.push((new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false
            },
            minimize: true
        })))
    } else{
        plugins.push(new BabiliPlugin())
    }

}




let app_config = Object.assign({}, config, {
    entry: {
        app:["app"],
        vendor: ["api"],
    },
    output: {
        path: path.join(__dirname, "public"),
        publicPath: "/",
        filename: "[name].bundle.min.js",
        chunkFilename: "[id].bundle.min.js",
        libraryTarget: "var",
        library: ""
    },
});
module.exports = app_config
