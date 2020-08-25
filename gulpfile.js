'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglifycss = require('gulp-uglifycss'),
    rename = require('gulp-rename'),
    del = require('del'),
    flatten = require('gulp-flatten');



gulp.task('build-js-prod', function () {
   return gulp.src([
        'projects/esigndoccontrol/src/assets/js/*.js'
    ]).pipe(gulp.dest('dist/esigndoccontrol/resources/js'));
});


gulp.task('images', function () {
    return gulp.src(['projects/esigndoccontrol/src/assets/img/*.png', 'projects/esigndoccontrol/src/assets/img/*.jpg'])
        .pipe(flatten())
        .pipe(gulp.dest('dist/esigndoccontrol/resources/img'));
});

gulp.task('build-scss-prod', function () {
    return gulp.src([
        'projects/esigndoccontrol/src/assets/style.scss'
    ]).pipe(concat('doceditor.scss'))
        .pipe(gulp.dest('dist/esigndoccontrol/resources/css'))
        .pipe(uglifycss({ "uglyComments": true }))
        .pipe(rename('doceditor.min.scss'))
        .pipe(gulp.dest('dist/esigndoccontrol/resources/css'));
});

gulp.task('build-css-prod', function () {
    return gulp.src([
        'projects/esigndoccontrol/src/assets/css/context.css'
    ]).pipe(concat('doceditor.css'))
        .pipe(gulp.dest('dist/esigndoccontrol/resources/css'))
        .pipe(uglifycss({ "uglyComments": true }))
        .pipe(rename('doceditor.min.css'))
        .pipe(gulp.dest('dist/esigndoccontrol/resources/css'));
});

//Cleaning previous gulp tasks from project
gulp.task('clean', function () {
    return del(['dist/esigndoccontrol/resources']);
});
gulp.task('build-assets', ['clean', 'build-js-prod', 'build-scss-prod','build-css-prod']);