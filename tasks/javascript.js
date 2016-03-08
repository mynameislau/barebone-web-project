'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync');
const fs = require('fs');
const del = require('del');
// const Events = require('events');

const jsSourceOrderPath = 'src/data/javascript_source_order.json';
// const emitter = new Events();

let sourceOrder;

const copyJSFiles = () => new Promise((resolve, reject) =>
{
  del('dev/js/**/*.*').then(() =>
    gulp.src('src/js/**/*.js')
    .pipe(gulp.dest('dev/js'))
    .on('end', () => {
      resolve();
    })
  );
});

const createJSFilesArray = () => new Promise((resolve, reject) =>
{
  fs.readFile(jsSourceOrderPath, (err, data) =>
  {
    try {
      sourceOrder = JSON.parse(data);
      resolve();
    }
    catch (error)
    {
      console.log(error);
      reject();
    }
  });
});

gulp.task('createJSFilesArray', createJSFilesArray);
gulp.task('copyJSFiles', cb =>
{
  copyJSFiles().then(() => {
    cb();
    // emitter.emit('JSFilesCopied');
    browserSync.reload();
  });
});
gulp.task('rebuildJS', ['createJSFilesArray'], cb =>
{
  copyJSFiles().then(() => {
    cb();
    // emitter.emit('JSRebuilt');
  });
});

gulp.task('javascript', ['rebuildJS'], () => {
  gulp.watch(jsSourceOrderPath, ['rebuildJS']);
  gulp.watch('src/js/**/*.*', ['copyJSFiles']);
});

module.exports = Object.create(Object.prototype, {
  // emitter: { value: emitter },
  sourceOrderPath: { value: jsSourceOrderPath },
  sourceOrder: {
    get: () => sourceOrder
  },
  autoTask: { value: 'javascript' }
});
