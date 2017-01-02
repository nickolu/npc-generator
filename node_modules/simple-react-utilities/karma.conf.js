module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['chai','mocha'],
    files: [
        'js/*.js',
        'test/*.js'
    ],
    exclude: [],
    preprocessors: {
        'src/**/*.js': ['coverage']
    },
    plugins : [
        'karma-mocha',
        'karma-coverage',
        'karma-chai',
        'karma-phantomjs-launcher',
        'karma-chrome-launcher'
    ],
    reporters: ['progress','coverage'],
      coverageReporter: {
          type : 'html',
          dir : 'coverage/'
      },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [
        'PhantomJS'
    ],
    singleRun: true
  });
};