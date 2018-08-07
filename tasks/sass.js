module.exports = function(gulp, options, plugins) {
    var less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    gulpif = require('gulp-if'),
    banner = require('gulp-banner'),
    gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    notify = require('gulp-notify'),
    cleanCSS = require('gulp-clean-css')
    // styles
    gulp.task('styles', function() {



        var srcThing = gulp.src(['sass/pure.scss']);
        console.log(options.argv.min)
        return srcThing
        .pipe(plugins.sass())
        .pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(plugins.rename({ basename:'app',suffix: '.min' }))



        .pipe(gulpif((options.min !== false),cleanCSS({keepSpecialComments : 0,compatibility: 'ie8',debug: true},
                function(details) {
                    console.log(details.name + ': ' + details.stats.originalSize);
                    console.log(details.name + ': ' + details.stats.minifiedSize);
                }
        )))

        // .pipe(banner(comment, {
        //     pkg: options.pkg
        // }))
        .pipe(gulp.dest('./public/'))
        .pipe(livereload())
        .pipe(notify({ message: 'Styles task complete' }));
    });


};
