(function () {
  'use strict';

  var $ = window.Bliss;
  window.scala = window.scala || {};
  var map;

  scala.gmapInitiated.then(function () {
    $.fetch('assets/samples/sample-markers.json').then(function (data) {
      JSON.parse(data.responseText).markers.forEach(function (item) {
        var marker = new google.maps.Marker({
          position: item.position,
          map: map,
          title: item.title,
          icon: 'assets/marker-dark.svg'
        });
        marker.addListener('click', function () {
        });
      });
    });

    document.querySelector('body').appendChild(document.getElementById('template-infobox').content.cloneNode(true));

    map = new google.maps.Map(document.getElementById('gmap'), {
      center: { lat: 46.929, lng: 2.5 },
      zoom: 6,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    });
  });
}());
