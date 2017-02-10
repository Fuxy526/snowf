var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var connect = require('gulp-connect');

gulp.task('server', function() {
	connect.server({
		port: 3000,
		livereload: true,
	});
});

gulp.task('html', function() {
	gulp.src('demo/*.html')
		.pipe(connect.reload());
});

gulp.task('script', function() {
	gulp.src('snowf.js')
		.pipe(uglify())
		.pipe(rename('snowf.min.js'))
		.pipe(gulp.dest('./'))
		.pipe(connect.reload());
});

gulp.task('watch', function() {
	gulp.watch('demo/snowf.html', ['html']);
	gulp.watch('snowf.js', ['script']);
});

gulp.task('default', ['server', 'watch']);