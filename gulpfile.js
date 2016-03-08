'use strict';

const gulp = require('gulp');
'use strict';

const browserSync = require('browser-sync');
const fs = require('fs');
const path = require('path');

const taskNames = [];

const taskFilenames = fs.readdirSync('./tasks');
//auto requiring tasks
taskFilenames.forEach(path => {
  const taskModule = require(`./tasks/${path}`);
  if (taskModule.autoTask) { taskNames.push(taskModule.autoTask); }
});

//default task starts subtasks
gulp.task('default', taskNames, () => {
  browserSync.create();
  browserSync.init({
    server:
    {
      baseDir: './dev/'
    },
    open: false
  });
});
