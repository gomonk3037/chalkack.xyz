/* eslint-disable */
module.exports = {
    entry: './public/index.js',
 
    output: {
        path: __dirname + '/public/',
        filename: 'bundle.js'
    },
 
    devServer: {
        inline: true,
        port: 7777,
        contentBase: __dirname + '/public/'
    },
 
    module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel',
                    exclude: /node_modules/,
                    query: {
                        cacheDirectory: true,
                        presets: ['es2015', 'react']
                    }
                },
				{
				   test: /\.scss$/, 
					loader: 'style!css!sass' 
				}
            ]
        }
};