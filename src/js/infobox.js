(function () {
  'use strict';

  window.scala = window.scala || {};

  /* An InfoBox is like an info window, but it displays
   * under the marker, opens quicker, and has flexible styling.
   * @param {GLatLng} latlng Point to place bar at
   * @param {Map} map The map on which to display this scala.InfoBox.
   * @param {Object} opts Passes configuration options - content,
   *   offsetVertical, offsetHorizontal, className, height, width
   */
  scala.InfoBox = function (opts) {
    google.maps.OverlayView.call(this);
    this.template = opts.template;
    this.offsetVertical_ = 0;//-195;
    this.offsetHorizontal_ = 0;
    //this.height_ = 165;
    //this.width_ = 266;
  };

  /* InfoBox extends GOverlay class from the Google Maps API
   */
  scala.InfoBox.setPrototype = function () {
    scala.InfoBox.prototype = new google.maps.OverlayView();
    /* Creates the DIV representing this scala.InfoBox
     */
    scala.InfoBox.prototype.setContent = function (value) {
      this.content = value;
    };

    scala.InfoBox.prototype.open = function (map, marker) {
      this.latlng_ = marker.getPosition();
      this.map_ = map;
      // Once the properties of this OverlayView are initialized, set its map so
      // that we can display it.  This will trigger calls to panes_changed and
      // draw.
      this.setMap(this.map_);
      var self = this;
      this.boundsChangedListener_ =
        google.maps.event.addListener(this.map_, 'bounds_changed', function () {
          return self.panMap.apply(self);
        });
    };

    scala.InfoBox.prototype.remove = function () {
      this.removeDiv();
      this.div_ = null;
    };
    /* Redraw the Bar based on the current projection and zoom level
     */
    scala.InfoBox.prototype.draw = function () {
      // Creates the element if it doesn't exist already.
      this.createElement();
      if (!this.div_) { return; }
      // Calculate the DIV coordinates of two opposite corners of our bounds to
      // get the size and position of our Bar
      var pixPosition = this.getProjection().fromLatLngToDivPixel(this.latlng_);
      if (!pixPosition) { return; }
      // Now position our DIV based on the DIV coordinates of our bounds
      //this.div_.style.width = this.width_ + 'px';
      this.div_.style.left = (pixPosition.x + this.offsetHorizontal_) + 'px';
      //this.div_.style.height = this.height_ + 'px';
      this.div_.style.top = (pixPosition.y + this.offsetVertical_) + 'px';
      this.div_.style.display = 'block';
    };
    /* Creates the DIV representing this scala.InfoBox in the floatPane.  If the panes
     * object, retrieved by calling getPanes, is null, remove the element from the
     * DOM.  If the div exists, but its parent is not the floatPane, move the div
     * to the new pane.
     * Called from within draw.  Alternatively, this can be called specifically on
     * a panes_changed event.
     */
    scala.InfoBox.prototype.createElement = function () {
      var panes = this.getPanes();
      var div = this.div_;
      if (!div) {
        // This does not handle changing panes.  You can set the map to be null and
        // then reset the map to move the div.
        div = this.div_ = document.createElement('div');
        div.appendChild(this.template.content.cloneNode(true));
        div.classList.add('info-window');
        div.style.position = 'absolute';
        //div.style.width = this.width_ + 'px';
        //div.style.height = this.height_ + 'px';
        var contentDiv = div.querySelector('.info-window__content');
        contentDiv.innerHTML = this.content;
        var removeInfoBox = function (ib) {
          return function () {
            ib.setMap(null);
          };
        };

        //google.maps.event.addDomListener(closeImg, 'click', removescala.InfoBox(this));
        //div.appendChild(topDiv);
        // div.appendChild(contentDiv);
        //div.style.display = 'none';
        panes.floatPane.appendChild(div);
        this.panMap();
      }
      else if (div.parentNode != panes.floatPane) {
        // The panes have changed.  Move the div.
        this.removeDiv();
        panes.floatPane.appendChild(div);
      }
    };
    scala.InfoBox.prototype.removeDiv = function () {
      if (this.div_ && this.div_.parentNode) { this.div_.parentNode.removeChild(this.div_); }
    };

    scala.InfoBox.prototype.close = function () {
      this.removeDiv();
    };
    /* Pan the map to fit the scala.InfoBox.
     */
    scala.InfoBox.prototype.panMap = function () {
      // if we go beyond map, pan map
      var map = this.map_;
      var bounds = map.getBounds();
      if (!bounds) { return; };
      // The position of the infowindow
      var position = this.latlng_;
      // The dimension of the infowindow
      var iwWidth = this.div_.offsetWidth;
      var iwHeight = this.div_.offsetHeight;
      // The offset position of the infowindow
      var iwOffsetX = -iwWidth / 2;//this.offsetHorizontal_;
      var iwOffsetY = -iwHeight;//this.offsetVertical_;
      // Padding on the infowindow
      var padX = 10;//40;
      var padY = 10;//40;
      // The degrees per pixel
      var mapDiv = map.getDiv();
      var mapWidth = mapDiv.offsetWidth;
      var mapHeight = mapDiv.offsetHeight;
      var boundsSpan = bounds.toSpan();
      var longSpan = boundsSpan.lng();
      var latSpan = boundsSpan.lat();
      var degPixelX = longSpan / mapWidth;
      var degPixelY = latSpan / mapHeight;
      // The bounds of the map
      var mapWestLng = bounds.getSouthWest().lng();
      var mapEastLng = bounds.getNorthEast().lng();
      var mapNorthLat = bounds.getNorthEast().lat();
      var mapSouthLat = bounds.getSouthWest().lat();
      // The bounds of the infowindow
      var iwWestLng = position.lng() + (iwOffsetX - padX) * degPixelX;
      var iwEastLng = position.lng() + (iwOffsetX + iwWidth + padX) * degPixelX;
      var iwNorthLat = position.lat() - (iwOffsetY - padY) * degPixelY;
      var iwSouthLat = position.lat() - (iwOffsetY + iwHeight + padY) * degPixelY;
      // calculate center shift
      var shiftLng =
          (iwWestLng < mapWestLng ? mapWestLng - iwWestLng : 0) + (iwEastLng > mapEastLng ? mapEastLng - iwEastLng : 0);
      var shiftLat =
          (iwNorthLat > mapNorthLat ? mapNorthLat - iwNorthLat : 0) + (iwSouthLat < mapSouthLat ? mapSouthLat - iwSouthLat : 0);
      // The center of the map
      var center = map.getCenter();
      // The new map center
      var centerX = center.lng() - shiftLng;
      var centerY = center.lat() - shiftLat;
      // center the map to the new shifted center
      map.panTo(new google.maps.LatLng(centerY, centerX));
      // Remove the listener after panning is complete.
      google.maps.event.removeListener(this.boundsChangedListener_);
      this.boundsChangedListener_ = null;
    };
  };
}());
