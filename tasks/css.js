'use strict';

const sourcemaps = require('gulp-sourcemaps');
const gulp = require('gulp');
const sass = require('gulp-sass');
const beep = require('beepbeep');
const del = require('del');
const fs = require('fs');
const browserSync = require('browser-sync');
const stylelint = require('stylelint');

gulp.task('css', ['compileSass'], () => {
  gulp.watch(['src/scss/**/*.scss'], ['compileSass']);
});

gulp.task('compileSass', cb =>
{
  del('dev/css').then(() =>
  {
    const glob = ['src/scss/*.scss', '!src/scss/_*.scss'];
    const stream = gulp.src(glob);

    stream.pipe(sourcemaps.init())
    .pipe(sass())
    .on('error', error => {
      console.error(error);
      beep(4);
      cb();
    })
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dev/css'))
    .on('end', cb)
    .pipe(browserSync.stream());
  }).catch(error => console.error(error));
});

module.exports = {
  autoTask: 'css'
};
