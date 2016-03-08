'use strict';

let incrementalIndex = -1;

module.exports = {
  getIndex: function ()
  {
    incrementalIndex += 1;
    return incrementalIndex;
  },
  capitals: function (str)
  {
    return str.toUpperCase();
  }
};
