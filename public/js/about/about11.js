$(function(){
    var infoWindowEl = $(".infonWindow").hide();
    infoWindowEl.find(".closeBtn").click(function(){
        infoWindowEl.hide();
    });
    var isFirst = true;
    var ebeLatlng = new google.maps.LatLng(storesLat,storesLng);
    var mapOptions = {
        panControl:false,
        zoomControl:false,
        overviewMapControl:false,
        zoom: 14,
        center: ebeLatlng
    };
    var map = new google.maps.Map(document.getElementById("mapCanvas"), mapOptions);
    var marker = new google.maps.Marker({
        position: ebeLatlng,
        map: map,
        title: storesTitle,
        icon: "../public/img/about/stores_pointer.png"
    });
    function showInfoWindow(latLng){
        var proj = map.getProjection();
        var mapBounds = map.getBounds();
        var topRight = proj.fromLatLngToPoint( mapBounds.getNorthEast() );
        var bottomLeft = proj.fromLatLngToPoint( mapBounds.getSouthWest() );
        var scale = Math.pow(2, map.getZoom() );
        var point = proj.fromLatLngToPoint(latLng);
        var worldPoint = proj.fromLatLngToPoint(latLng);
        var left = (worldPoint.x - bottomLeft.x) * scale;
        var top = (worldPoint.y - topRight.y) * scale;

        infoWindowEl.css({left: left - 176 + "px",top:top + 10 +"px"});
        infoWindowEl.show();
    }
    google.maps.event.addListener(marker, "click", function(e) {
        showInfoWindow( marker.getPosition() );
    });
    google.maps.event.addListener(map,"drag",function(){
        if(infoWindowEl.is(":hidden")){return;}
        showInfoWindow( marker.getPosition() );
    });
    google.maps.event.addListener(map,"projection_changed",function(){
        if(isFirst){
            isFirst = false;
            showInfoWindow( marker.getPosition());
        }
    });
    google.maps.event.addListener(map,"zoom_changed",function(){
        if(infoWindowEl.is(":hidden")){return;}
        showInfoWindow( marker.getPosition() );
    });

});