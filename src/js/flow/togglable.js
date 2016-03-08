(function () {
  'use strict';

  var $ = window.Bliss;
  var $$ = window.Bliss.$;

  window.scala = window.scala || {};
  window.scala.Togglable = function (properties)
  {
    var self = this;
    this.ID = this.toggleID;
    this.toggleID += 1;
    this.element = properties.element;
    this.togglingNodes = properties.togglingNodes.length > 0 ? properties.togglingNodes : [this.element];
    this.name = properties.name;
    this.classHolder = properties.classHolder || this.element;//(properties.classHolder && properties.classHolder.length > 0) ? properties.classHolder : this.element;
    this.defaultState = properties.defaultState || 'off';
    this.enablingNodes = properties.enablingNodes || [];
    if (properties.enablingNodesInside) { this.enablingNodes = this.enablingNodes.push(properties.enablingNodesInside); }
    this.disablingNodes = properties.disablingNodes || [];
    if (properties.disablingNodesInside) { this.disablingNodes = this.disablingNodes.push(properties.disablingNodesInside); }
    this.preventingNodes = properties.preventingNodes || [];

    console.log(this.togglingNodes);

    this.togglingNodes.forEach(function (item) {
      item.addEventListener('click', function (event) {
        if (!self.shouldPrevent(event.target, item))
        {
          event.preventDefault();
          self.toggle();
        }
      });
    });

    if (this.disablingNodes.length > 0)
    {
      this.disablingNodes.forEach(function (item) {
        item.addEventListener('click', function (event)
        {
          if (!self.shouldPrevent(event.target, this)
            && !self.isInEnablingNodes(event.target)
            && !self.isInTogglingNodes(event.target))
          {
            self.toggle('off');
          }
        });
      });
    }

    if (this.enablingNodes.length > 0)
    {
      this.enablingNodes.forEach(function (item) {
        item.addEventListener('click', function (event)
        {
          if (!self.shouldPrevent(event.target, this) && !self.isInTogglingNodes(event.target))
          {
            self.toggle('on');
          }
        });
      });
    }

    this.toggle(this.defaultState);
  };

  window.scala.Togglable.toggleID = 0;

  window.scala.Togglable.prototype.isInEnablingNodes = function (eventTarget)
  {
    this.enablingNodes.forEach(function (item) {
      if (item.contains(eventTarget) || item === eventTarget) { return true; }
    });
    return false;
  };

  window.scala.Togglable.prototype.isInTogglingNodes = function (eventTarget)
  {
    this.togglingNodes.forEach(function (item) {
      if (item.contains(eventTarget) || item === eventTarget) { return true; }
    });
    return false;
  };

  window.scala.Togglable.prototype.shouldPrevent = function (eventTarget, initiator)
  {
    // if it is in a preventing group, prevent it
    this.preventingNodes.forEach(function (item) {
      if (item.contains(eventTarget) || item === eventTarget)
      {
        if (this.preventingNodes.find(initiator).length === 0) { return true; }
        //unless the initiator is a children of the preventing node
        else { return false; }
      }
    });

    // if deepest clicked element is not in a group preventing toggling then don't prevent it
    return false;
  };

  window.scala.Togglable.prototype.toggle = function (toggle)
  {
    if (toggle === 'on')
    {
      this.classHolder.classList.remove(this.name + '--untoggled');
      this.classHolder.classList.add(this.name + '--toggled');
    }
    else if (toggle === 'off')
    {
      this.classHolder.classList.remove(this.name + '--toggled');
      this.classHolder.classList.add(this.name + '--untoggled');
    }
    else
    {
      this.classHolder.classList.toggle(this.name + '--toggled');
      this.classHolder.classList.toggle(this.name + '--untoggled');
    }
  };

  //parsing page and creating togglable elements from data attributes
  $$('[data-tgl]').forEach(function (item) {
    var classHolder = item.closest(item.getAttribute('data-tgl-class-holder'));
    classHolder = classHolder || item;
    var name = item.getAttribute('data-tgl');
    var preventingNodes = $$('[data-tgl-prevent="' + name + '"]', classHolder);
    var togglingNodes = $$(item.getAttribute('data-tgl-togglers'), item);

    var enablingNodes = $$(item.getAttribute('data-tgl-on'));
    var enablingNodesInside = $$(item.getAttribute('data-tgl-on-inside'), item);
    var disablingNodes = $$(item.getAttribute('data-tgl-off'));
    var disablingNodesInside = $(item.getAttribute('data-tgl-off-inside'), item);

    //if there is no value for the togglers and the getAttributeibute hasn't been specified,
    // we assume the element itself is supposed to toggle the class
    //if the attribute has been explicitly specified it means there are no togglers
    if (togglingNodes.length <= 0 && item.getAttribute('data-tgl-togglers') === undefined
    && enablingNodes.length <= 0 && item.getAttribute('data-tgl-on') === undefined)
    {
      togglingNodes = item;
    }

    var togglable = new window.scala.Togglable({
      element: item,
      togglingNodes: togglingNodes,
      name: name,
      classHolder: classHolder,
      defaultState: item.getAttribute('data-tgl-default'),
      enablingNodes: enablingNodes,
      disablingNodes: disablingNodes,
      enablingNodesInside: enablingNodesInside,
      disablingNodesInside: disablingNodesInside,
      preventingNodes: preventingNodes
    });
  });
}());
