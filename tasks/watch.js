module.exports = function(gulp, options, plugins) {

    gulp.task('watch', function() {
        gulp.watch(['plugins/*.js','client/*.js','client/**/*.js','client/**/**/*.js'], ['webpack'])
        gulp.watch(['./*.html'], ['copy'])
        //gulp.watch(['.tmp/*.js','.tmp/src/*.js','.tmp/src/**/*.js'], ['webpack'])
        gulp.watch(['less/*.less','less/**/*.less','less/**/**/*.less'],['styles'])
        plugins.livereload.listen();
    });

};