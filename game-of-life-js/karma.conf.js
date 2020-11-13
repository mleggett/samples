var loaders = require('./webpack.loaders');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      "test_index.js"
    ],
    exclude: [
    ],
    preprocessors: {
      'test_index.js': ['webpack']
    },
    webpack: {
      resolve: {
        extensions: ['.js', '.jsx']
      },
      module: {
        loaders: loaders
      },
      externals: {
        'cheerio': 'window',
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
      }
    },

    webpackMiddleware: {
      noInfo: true
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['jsdom'],
    singleRun: false,
    concurrency: Infinity
  })
};
