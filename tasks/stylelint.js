'use strict';

const beep = require('beepbeep');
const gulp = require('gulp');
const colors = require('colors/safe');
const stylelint = require('stylelint');
const fs = require('fs');

const glob = ['src/scss/**/*.scss', '!src/scss/vendors/**/*.scss'];

gulp.task('checkStyle', cb => {
  stylelint.lint({
    files: glob,
    formatter: 'string',
    syntax: 'scss'
  }).then(data => {
    if (data.output.length) {
      console.log(colors.red(data.output));
    }
    fs.writeFile('src/log/style-errors.log', data.output, error => {
      if (error) { console.error(error); }
      cb();
    });
  });
});

gulp.task('stylelint', ['checkStyle'], () => {
  gulp.watch(glob, ['checkStyle']);
});

module.exports = {
  autoTask: 'stylelint'
};
