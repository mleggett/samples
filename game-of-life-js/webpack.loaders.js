module.exports = [
	{
		test: /\.jsx?$/,
		exclude: /(node_modules|bower_components)/,
		use: [ 'babel-loader' ],
	},

	{
		test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
	},
	{
		test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
		use: [ 'file-loader' ]
	},
	{
		test: /\.(woff|woff2)$/,
		use: [
		    {
                loader: 'url-loader',
                options: {
                    prefix: 'font',
                    limit: 5000
                }
            }
        ]
	},
	{
		test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
		use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'application/octet-stream'
                }
            }
        ]
	},
	{
		test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'image/svg+xml'
                }
            }
        ]
	},
	{
		test: /\.gif/,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'image/gif'
                }
            }
        ]
	},
	{
		test: /\.jpg/,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'image/jpg'
                }
            }
        ]
	},
	{
		test: /\.png/,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'image/png'
                }
            }
        ]
	}
];
