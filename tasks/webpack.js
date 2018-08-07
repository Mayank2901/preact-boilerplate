var webpackStream = require('webpack-stream');
var webpack2 = require('webpack');

var webpackConfig =require( './../webpack.config.babel');

module.exports = function(gulp, options, plugins) {

    gulp.task('webpack',function() {
        
        return gulp.src(['client/**/*.jsx'])
            .pipe(webpackStream(webpackConfig,webpack2))
            .pipe(gulp.dest('public'))
            .pipe(plugins.notify({ message: 'webpack task complete' }))
            .pipe(plugins.livereload())
    });
};