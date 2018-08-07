require('dotenv').config()
var gulp = require('gulp');
var minimist =require('minimist');
var gulpTasks =require('load-gulp-tasks');
var runSequence =require('run-sequence');
var pkg =require('./package.json');

const options = {
    pattern: ['tasks/**/*.js', '!tasks/**/dev-*.js'],
    argv: minimist(process.argv),
    sequence: runSequence,
    pkg: pkg
}


process.env.NOW = (new Date()).getTime();

gulpTasks(gulp, options)


gulp.task('default', ['clean-copy', 'styles'], function() {
    gulp.start('webpack');
})


var server = ['default', 'serve', 'watch']

var development = ['copy','serve', 'watch']

gulp.task('server', server);
gulp.task('development', development);