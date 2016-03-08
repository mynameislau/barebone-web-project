'use strict';

const gulp = require('gulp');
const del = require('del');
const browserSync = require('browser-sync');
// const vinylPaths = require('vinyl-paths');
// const changed = require('gulp-changed');

gulp.task('assets', ['copyAssets'], () => {
  gulp.watch('src/assets/**/*.*', ['copyAssets']);
});

//copying assets
gulp.task('copyAssets', cb => {
  del('dev/assets').then(() =>
  {
    gulp.src('src/assets/**/*.*')
    .pipe(gulp.dest('dev/assets/'))
    .on('end', () => {
      browserSync.reload();
      cb();
    });
    // mapSVG();
  }).catch(reason => console.error(reason));
});

module.exports = {
  autoTask: 'assets'
};
