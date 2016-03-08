(function () {
  'use strict';

  window.scala = window.scala || {};

  window.scala.player =
  {
    init: function (length, delay, auto)
    {
      var inst = Object.create(window.scala.player);
      inst.currentIndex = 0;
      inst.slideLength = length;
      inst.timerID;
      inst.delay = delay;
      inst.dispatcher = window.scala.dispatcher.init();
      inst.autoPlay = auto || false;
      inst.isPlaying = false;
      this.incrementing = false;
      this.decrementing = false;
      if (inst.autoPlay) { inst.play(); }
      return inst;
    },

    play: function ()
    {
      this.pause();
      var self = this;
      this.timerID = window.setTimeout(function ()
      {
        self.next();
      }, this.delay);
      this.isPlaying = true;
    },

    pause: function ()
    {
      window.clearTimeout(this.timerID);
      this.isPlaying = false;
    },

    toggle: function ()
    {
      if (this.isPlaying) { this.pause(); }
      else { this.play(); }
    },

    setIndex: function (index)
    {
      this.currentIndex = parseInt(index);
      this.pause();
      this.dispatcher.emit('indexChanged', index);
      if (this.autoPlay) { this.play(); }
    },

    next: function ()
    {
      this.incrementing = true;
      this.decrementing = false;
      var nextIndex = this.currentIndex === this.slideLength - 1 ? 0 : this.currentIndex + 1;
      this.setIndex(nextIndex);
    },

    prev: function ()
    {
      this.incrementing = false;
      this.decrementing = true;
      var prevIndex = this.currentIndex === 0 ? this.slideLength - 1 : this.currentIndex - 1;
      this.setIndex(prevIndex);
    }
  };
})();
