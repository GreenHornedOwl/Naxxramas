var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var autoprefixer      = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');


gulp.task('sass', function () {
  gulp.src('./app/sass/**/*.sass')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'nested'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())    
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('./_build/assets/css'))
});
gulp.task('build-css', function () {
  gulp.src('./app/sass/**/*.sass')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('./')) 
    .pipe(gulp.dest('./_compiled'))
});

gulp.task('scripts', function() {
  return gulp.src(['./app/js/**/*.js'])
  	.pipe(sourcemaps.init())    
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./_build/assets/js/'));
});
gulp.task('build-scripts', function() {
  return gulp.src('./app/js/**/*.js')
    .pipe(sourcemaps.init())    
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./_compiled'));
});

gulp.task('browser-sync', ['sass', 'scripts'], function() {
    browserSync({
        server: {
            baseDir: './_build'
        }
    });
});
gulp.task('rebuild', function () {
    browserSync.reload();
});

gulp.task('copy', function(){
  return gulp.src('./app/*.html')
  .pipe(gulp.dest('./_build'));
})
gulp.task('copyResources', function(){
 return gulp.src('./app/resources/*.*')
 .pipe(gulp.dest('./_build/resource'));
})


gulp.task('watch', function() {
  gulp.watch(['./app/sass/**/*.sass'], ['sass']);  
  gulp.watch(['./app/js/*.js'], ['scripts']);
  gulp.watch(['./app/*.html'], ['copy']);
  gulp.watch(['./app/img/*.*'],['copyResources'])
  gulp.watch(['./_build/*.html'], ['rebuild']);
});

gulp.task('default', ['copy', 'copyResources', 'scripts', 'watch', 'browser-sync' ]);  
gulp.task('build-js', ['build-scripts']); 
gulp.task('build-sass', ['build-css']);  
