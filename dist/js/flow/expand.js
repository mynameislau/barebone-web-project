!function(){"use strict";var e=(window.Bliss,window.Bliss.$),t={init:function(a,s){var l=Object.create(t);l.controlled=a,l.controlledID=a.getAttribute("id"),l.controllers=e('[aria-controls="'+l.controlledID+'"]'),l.classHolder=a.closest(a.getAttribute("data-expand-class-holder")),l.classBaseName=s.classBaseName||l.controlledID,"basic"===a.getAttribute("data-expand-controls")&&l.controllers.forEach(function(e){e.addEventListener("click",function(e){l.setExpanded()})});var r=new MutationObserver(function(e){l.updateClassHolder()});return r.observe(l.controlled,{attributes:!0,attributeFilter:["aria-expanded"]}),l.updateClassHolder(),l},setExpanded:function(){var e="true"===this.controlled.getAttribute("aria-expanded"),t=!e;this.controlled.setAttribute("aria-expanded",t?"true":"false"),this.updateClassHolder()},updateClassHolder:function(){var e="true"===this.controlled.getAttribute("aria-expanded");this.classHolder&&(this.classHolder.classList.remove(this.classBaseName+(e?"--collapsed":"--expanded")),this.classHolder.classList.add(this.classBaseName+(e?"--expanded":"--collapsed")))}};e("[data-expand]").forEach(function(e){t.init(e,{classBaseName:e.getAttribute("data-expand-class-name")})})}();