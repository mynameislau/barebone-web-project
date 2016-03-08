(function () {
  'use strict';

  var $ = window.Bliss;
  var $$ = window.Bliss.$;

  var expand = {
    init: function (controlled, options) {
      var inst = Object.create(expand);
      inst.controlled = controlled;
      inst.controlledID = controlled.getAttribute('id');
      inst.controllers = $$('[aria-controls="' + inst.controlledID + '"]');
      inst.classHolder = controlled.closest(controlled.getAttribute('data-expand-class-holder'));
      inst.classBaseName = options.classBaseName || inst.controlledID;

      if (controlled.getAttribute('data-expand-controls') === 'basic') {
        inst.controllers.forEach(function (item) {
          item.addEventListener('click', function (event) {
            inst.setExpanded();
          });
        });
      }

      //observing expanded state
      var observer = new MutationObserver(function (mutations) {
        inst.updateClassHolder();
      });
      observer.observe(inst.controlled, { attributes: true, attributeFilter: ['aria-expanded'] });

      inst.updateClassHolder();

      return inst;
    },

    setExpanded: function () {
      var oldState = this.controlled.getAttribute('aria-expanded') === 'true';
      var newState = !oldState;
      this.controlled.setAttribute('aria-expanded', newState ? 'true' : 'false');

      this.updateClassHolder();
    },

    updateClassHolder: function () {
      var state = this.controlled.getAttribute('aria-expanded') === 'true';
      if (this.classHolder) {
        this.classHolder.classList.remove(this.classBaseName + (state ? '--collapsed' : '--expanded'));
        this.classHolder.classList.add(this.classBaseName + (state ? '--expanded' : '--collapsed'));
      }
    }
  };

  $$('[data-expand]').forEach(function (item) {
    expand.init(item, {
      classBaseName: item.getAttribute('data-expand-class-name')
    });
  });
}());
