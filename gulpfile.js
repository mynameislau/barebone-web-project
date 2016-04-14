'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync');
const fs = require('fs');
const path = require('path');

let autoTasksNames;
let distTasksNames;

browserSync.create('dist');
browserSync.create('dev');

const taskFilenames = fs.readdirSync('./tasks');
const taskModules = [];
//auto requiring tasks
taskFilenames.forEach(path => {
  taskModules.push(require(`./tasks/${path}`));
  autoTasksNames = taskModules.filter(module => module.autoTask).map(module => module.autoTask);
  distTasksNames = taskModules.filter(module => module.distTask).map(module => module.distTask);
});

//default task starts subtasks
gulp.task('default', autoTasksNames, () => {
  browserSync.get('dev').init({
    server:
    {
      baseDir: './dev/'
    },
    open: false
  });
});

gulp.task('dist', distTasksNames, () => {
  browserSync.get('dist').init({
    server:
    {
      baseDir: './dist/'
    },
    open: false
  });
});
