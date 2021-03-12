
var lat, lon;
var test = true;

function step(i, setHistory) {
    if (typeof(setHistory) == 'undefined') {
        setHistory = true;
    }
    $('.section').hide();
    $('#step-' + i).show();
    if (setHistory) {
        history.pushState({step: i}, 'step ' + i, '#step-' + i);
    }
}

function getRandomPosition(lat, lon, distance) {
    var R = 6378.1;
    var brng = 2 * Math.PI * Math.random();
    var d = distance * (1 + (0.2 * Math.random() - 0.1));
    console.error(d);
    var lat1 = lat / 180. * Math.PI;
    var lon1 = lon / 180. * Math.PI;

    var lat2 = Math.asin( Math.sin(lat1)*Math.cos(d/R) +
         Math.cos(lat1)*Math.sin(d/R)*Math.cos(brng))

    var lon2 = lon1 + Math.atan2(Math.sin(brng)*Math.sin(d/R)*Math.cos(lat1),
                 Math.cos(d/R)-Math.sin(lat1)*Math.sin(lat2))

    var lat2 = lat2 / Math.PI * 180.;
    var lon2 = lon2 / Math.PI * 180.;
    
    return [lat2, lon2];
}

function getPosition(callback) {
    if (test) {
        callback(20.0, 21.2);
    }else {
        navigator.geolocation.getCurrentPosition(function(position) {
            callback(position.coords.latitude, position.coords.longitude);
        });
    }
}

$(function(){

    step(1);
    $('#step-1').click(function() {
        step(2);
    });
    $('#step-2 button').click(function() {
        getPosition(function(lat, lon) {
            $('.position').html("Latitude: " + lat +
              "<br>Longitude: " + lon);
            var target = getRandomPosition(lat, lon, $('#distance').val())
              $('.target').html("Latitude: " + target[0] +
                            "<br>Longitude: " + target[1]);
        });
        step(3);
    });
    $('#step-3 button.back').click(function() {
        history.back();
    });
    window.addEventListener('popstate', function(e){
        if(e.state) {
            step(e.state.step, false);
        }
      }
    );
});

