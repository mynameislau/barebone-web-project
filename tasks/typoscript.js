'use strict';

const gulp = require('gulp');
const rename = require('gulp-rename');
const handlebars = require('gulp-compile-handlebars');
const del = require('del');
const YAML = require('js-yaml');
const fs = require('fs');
// const cache = require('gulp-cached');
const Emitter = require('events');
var prettify = require('gulp-jsbeautifier');

const beautifyOptions = { indent_size: 2, preserve_newlines: true, max_preserve_newlines: 0 };

const emitter = new Emitter();

const templateDataPath = 'src/data/typo-template-data.yaml';

let templateData;

const buildTypoTemplates = cb =>
{
  //special typo
  console.log('building typo templates'.grey);
  del('../output-test/*.html', { force: true }).then(() => {
    const stream = gulp.src('src/templates/typo-pages/*.hbs')
    .pipe(handlebars(templateData, {
      batch: ['src/templates/typo-partials', 'src/templates/partials', 'src/templates/pages'],
      partials: {
        'layout-std': 'blakerkjgkrejgkrje',
        testo: 'blreglrejglerjglorejogijeroigjeroijgoreijge'
      },
      helpers: require('../src/templates/helpers/helpers.js')
    }))
    .on('error', error =>
    {
      console.log('templating error', error);
      stream.emit('end');
    })
    .pipe(rename(path => path.extname = '.html'))
    .pipe(prettify(beautifyOptions))
    .pipe(gulp.dest('../output-test/'))
    .on('error', error =>
    {
      console.log('here is the problem', error);
      stream.emit('end');
    })
    .on('end', () => {
      cb();
      console.log('typo templates created'.grey);
    });
  }).catch(reason => console.error(reason));
};

gulp.task('setTypoTemplateData', ['createJSFilesArray'], cb =>
{
  fs.readFile(templateDataPath, (error, data) =>
  {
    templateData = YAML.load(data.toString());
    cb();
  });
});

gulp.task('typoscript', ['buildTypoTemplates'], () => {
  gulp.watch('src/templates/**/*.hbs', ['rebuildTypoTemplates']);
  gulp.watch(templateDataPath, ['buildTypoTemplates']);
});

gulp.task('buildTypoTemplates', ['setTypoTemplateData'], buildTypoTemplates);
gulp.task('rebuildTypoTemplates', buildTypoTemplates);

module.exports = {
  emitter: emitter
};
