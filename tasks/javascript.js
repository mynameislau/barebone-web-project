'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync');
const sourcemaps = require('gulp-sourcemaps');
const fs = require('fs');
const path = require('path');
const del = require('del');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const YAML = require('yamljs');
// const Events = require('events');

const jsSourceOrderPath = 'src/data/javascript_source_order.yaml';
// const emitter = new Events();

let sourceOrder;

const copyJSFiles = dist => new Promise((resolve, reject) =>
{
  const dir = dist ? 'dist' : 'dev';

  del(`${dir}/js/*`).then(() => {
    //all entries
    const entries = [];
    for (var name in sourceOrder) { entries.push(...sourceOrder[name]); }

    const localEntries = entries.filter(entry => !isExternal(entry));

    //copying local entries
    Promise.all(localEntries.map(entry => new Promise((resolve, reject) => {
      let stream;
      let dest;

      if (entry.bundle)
      {
        const gulpSRC = entry.bundle.map(entry => `src/${entry.src}`);
        stream = gulp.src(gulpSRC)
        .pipe(sourcemaps.init())
        .pipe(concat(entry.src));
        dest = dir;
      }
      else
      {
        stream = gulp.src(`src/${entry.src}`)
        .pipe(sourcemaps.init())
        .on('error', error => console.error(error));
        dest = path.dirname(`${dir}/${entry.src}`);
      }

      if (dist) { stream = stream.pipe(uglify()); }

      stream.pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(dest))
      .on('end', resolve)
      .on('error', error => {
        console.error(error);
        reject(error);
      });
    }))).then(resolve);
  }).catch(error => console.error(error));
});

const isExternal = function (entry) {
  return entry.src.startsWith('http://') || entry.src.startsWith('https://');
};

const getSourceOrder = function (data) {
  const src = {};
  const parsed = YAML.parse(data);
  for (var name in parsed)
  {
    src[name] = [];
    const srcGroup = src[name];
    let bundleNumber = 0;
    let bundling = false;
    for (var i = 0, length = parsed[name].length; i < length; i += 1)
    {
      var curr = parsed[name][i];
      //if current file is bundlable
      if (!isExternal(curr) && !curr.async && !curr.ie) {
        //if not yet created, create bundle
        if (!bundling) {
          bundling = true;
          bundleNumber += 1;
          srcGroup.push({ src: `js/bundles/${name}-bundle-${bundleNumber}.js`, bundle: [] });
        }
        //add file to bundle
        srcGroup[srcGroup.length - 1].bundle.push(Object.assign({}, curr));
      }
      //if not bundlable
      else
      {
        bundling = false;
        srcGroup.push(Object.assign({}, curr));
      }
    }
  }
  return src;
};

const createJSFilesArray = () => new Promise((resolve, reject) =>
{
  fs.readFile(jsSourceOrderPath, (err, data) =>
  {
    try {
      sourceOrder = getSourceOrder(data.toString());
      resolve();
    }
    catch (error)
    {
      reject(error);
    }
  });
});

gulp.task('createJSFilesArray', createJSFilesArray);

gulp.task('compileJSDist', ['createJSFilesArray'], () => copyJSFiles(true));

gulp.task('copyJSFiles', cb =>
{
  copyJSFiles().then(() => {
    cb();
    // emitter.emit('JSFilesCopied');
    browserSync.get('dev').reload();
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
  autoTask: { value: 'javascript' },
  distTask: { value: 'compileJSDist' }
});
