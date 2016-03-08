(function () {
  'use strict';

  var $ = window.Bliss;
  var $$ = window.Bliss.$;

  var carousel = {
    init: function (element) {
      var inst = Object.create(carousel);
      inst.element = element;
      inst.itemsWrapper = $('.carousel__items-wrapper', element);
      var player = window.scala.player.init(inst.itemsWrapper.children.length, 4000, true);
      inst.setExpanded(0);

      player.dispatcher.on('indexChanged', function ()
      {
        inst.setExpanded(player.currentIndex, player.decrementing);
      });

      element.addEventListener('click', function ()
      {
        player.autoPlay = false;
        player.pause();
      });

      $('.carousel__prev-btn').addEventListener('click', function () {
        player.prev();
      });

      $('.carousel__next-btn').addEventListener('click', function () {
        player.next();
      });

      return inst;
    },

    setExpanded: function (index, decrementing)
    {
      var items = this.itemsWrapper.children;
      if (decrementing) { this.element.classList.add('carousel--left'); }
      else { this.element.classList.remove('carousel--left'); }

      for (var i = 0, length = items.length; i < length; i += 1)
      {
        var curr = items[i];
        curr.classList.remove('carousel__current-item');
        curr.classList.remove('carousel__previous-item');
        curr.classList.remove('carousel__next-item');
        curr.setAttribute('aria-expanded', index === i ? 'true' : 'false');
      }

      var active = items[index];
      active.classList.add('carousel__current-item');
      var prev = index === 0 ? items[items.length - 1] : items[index - 1];
      var next = index === items.length - 1 ? items[0] : items[index + 1];
      if (prev) { prev.classList.add('carousel__previous-item'); }
      if (next) { next.classList.add('carousel__next-item'); }
    }
  };

  $$('.carousel').forEach(function (carouselElement) {
    carousel.init(carouselElement);
  });
}());
