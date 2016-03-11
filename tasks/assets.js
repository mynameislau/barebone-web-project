'use strict';

const gulp = require('gulp');
const del = require('del');
const browserSync = require('browser-sync');
// const vinylPaths = require('vinyl-paths');
// const changed = require('gulp-changed');

gulp.task('assets', ['copyAssets'], () => {
  gulp.watch('src/assets/**/*.*', ['copyAssets']);
});

const copyAssets = dist => new Promise((resolve, reject) => {
  const dir = dist ? 'dist' : 'dev';
  del(`${dir}/assets`).then(() =>
  {
    gulp.src('src/assets/**/*.*')
    .pipe(gulp.dest(`${dir}/assets/`))
    .on('end', () => {
      browserSync.reload();
      resolve();
    });
    // mapSVG();
  }).catch(reason => {
    console.error(reason);
    reject(reason);
  });
});

//copying assets
gulp.task('copyAssets', () => copyAssets());
gulp.task('copyAssetsDist', () => copyAssets(true));

module.exports = {
  autoTask: 'assets',
  distTask: 'copyAssetsDist'
};
