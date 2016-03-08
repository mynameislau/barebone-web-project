(function () {
  'use strict';

  window.scala.documentReady.then(function () {
    var $ = window.Bliss;
    var $$ = window.Bliss.$;

    $$('[role="tab"]').forEach(function (item) {
      var tablist = item.closest('[role="tablist"]');
      var multiselectable = tablist.getAttribute('aria-multiselectable');
      item.addEventListener('click', function (event) {
        if (multiselectable)
        {
          var oldState = item.getAttribute('aria-selected');
          item.setAttribute('aria-selected', oldState === 'true' ? 'false' : 'true');
        }
        else
        {
          $$('[role="tab"]', tablist).forEach(function (item)
          {
            if (item === event.currentTarget)
            {
              item.setAttribute('aria-selected', 'true');
            }
            else
            {
              item.setAttribute('aria-selected', 'false');
            }//
          });
        }
      });
    });

    $$('[role="tab"]').forEach(function (tab) {
      var controlled = tab.getAttribute('aria-controls').split(' ');
      for (var i = 0, length = controlled.length; i < length; i += 1)
      {
        var curr = controlled[i];
        var tabPanel = $('[role="tabpanel"][id="' + curr + '"]');
        if (tabPanel) { break; }
      }
      // var tabPanel = $('[role="tab"][aria-controls~="' + tabPanel.getAttribute('id') + '"]');
      //observing selected state
      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          tabPanel.setAttribute('aria-expanded', tab.getAttribute('aria-selected') === 'true' ? 'true' : 'false');
        });
      });
      observer.observe(tab, { attributes: true, attributeFilter: ['aria-selected'] });
    });
  });
}());
