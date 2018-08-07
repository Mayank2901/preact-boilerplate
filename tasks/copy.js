module.exports = function(gulp, options, plugins) {

    gulp.task('clean', function() {
        return gulp.src('public/*')
            .pipe(plugins.clean());
    });

    // Copy all other files to dist directly
    gulp.task('copy', function() {
        // Copy html
        gulp.src(['*.html'], { cwd: './' })
            .pipe(gulp.dest('public/'))
            .pipe(plugins.livereload());

        gulp.src(['fonts/*'], { cwd: './' })
            .pipe(gulp.dest('public/fonts/'));
        

        gulp.src(['images/*','images/*/*'], { cwd: './' })
            .pipe(gulp.dest('public/img/'));
    });

    gulp.task('clean-copy', function(done) {
        options.sequence('clean', 'copy', function() {
            done();
        });
    });


};