(function () {
  'use strict';

  window.scala.documentReady.then(function () {
    var $ = window.Bliss;
    var $$ = window.Bliss.$;

    $$('[role="tooltip"]').forEach(function (item) {
      var controller = $('[aria-controls="' + item.getAttribute('id') + '"]');
      controller.addEventListener('click', function () {
        var isHidden = item.getAttribute('aria-hidden') === 'true';
        item.setAttribute('aria-hidden', isHidden ? 'false' : 'true');
      });
      /*
        // deactivate on body click
        document.documentElement.addEventListener('click', function (event) {
        console.log(controller.contains(event.target));
        if (!controller.contains(event.target)) { item.setAttribute('aria-hidden', 'true'); }
        else {
          var isHidden = item.getAttribute('aria-hidden') === 'true';
          item.setAttribute('aria-hidden', isHidden ? 'false' : 'true');
        }
      });*/
    });
  });
}());
