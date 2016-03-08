(function () {
  'use strict';

  var $ = window.Bliss;
  window.scala = window.scala || {};
  var map;

  Promise.all([scala.gmapInitiated, scala.windowLoaded]).then(function () {
    scala.InfoBox.setPrototype();
    var infowindow = new google.maps.InfoWindow();
    var infoBox = new scala.InfoBox({ template: document.getElementById('template-infobox') });

    $.fetch('assets/samples/sample-markers.json').then(function (data) {
      JSON.parse(data.responseText).markers.forEach(function (item) {
        var marker = new google.maps.Marker({
          position: item.position,
          map: map,
          title: item.title,
          icon: item.src
        });
        marker.addListener('click', function () {
          //infowindow.setContent('<a href="' + item.link + '">' + item.description + '</a>');
          //infowindow.open(map, marker);
          infoBox.setContent('<a href="' + item.link + '">' + item.description + '</a>');
          infoBox.open(map, marker);
        });
      });
    });

    document.querySelector('body').appendChild(document.getElementById('template-infobox').content.cloneNode(true));

    map = new google.maps.Map(document.getElementById('gmap'), {
      center: { lat: 46.929, lng: 2.5 },
      zoom: 6,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    });

    map.addListener('click', function () {
      infoBox.close();
    });
  });
}());
