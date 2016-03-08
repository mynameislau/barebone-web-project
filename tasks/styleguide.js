'use strict';

const gulp = require('gulp');
const rename = require('gulp-rename');
const handlebars = require('handlebars');
const browserSync = require('browser-sync');
const del = require('del');
const YAML = require('js-yaml');
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const templating = require('./templating');
const colors = require('colors/safe');

let previousData = undefined;

const rebuildLinks = () => {
  const data = {};

  glob('dev/*.html', (error, filenames) => {
    //const filenames.map(filepath => {

    //path.basename(path, path.extname(path))
    const data = { pages: filenames.map(filename => ({ url: path.basename(filename) })) };
    if (!previousData || data.pages.length !== previousData.pages.length)
    {
      console.log(colors.yellow('recreating styleguide links'));
      fs.writeFile('styleguide/dist/links.html', handlebars.compile('<ul>{{#each pages}}<li><a target="_blank" href="http://localhost:3000/{{url}}">{{url}}</a></li>{{/each}}</ul>')(data), () => console.log(colors.yellow('done creating links')));
    }
    previousData = data;
  });
};

templating.emitter.on('pagesCreated', rebuildLinks);

gulp.task('styleguide', () => {
  rebuildLinks();
  browserSync.create().init({
    server:
    {
      baseDir: 'styleguide/dist/'
    },
    open: false,
    port: 7777,
    ui: {
      port: 7778
    }
  });
});

module.exports = {
  autoTask: 'styleguide'
};

