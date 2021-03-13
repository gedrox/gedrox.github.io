
var lat, lon;
var test = true;
var targetBrng = 0;
var target;

function step(i, setHistory) {
    if (typeof(setHistory) == 'undefined') {
        setHistory = true;
    }
    $('.section').hide();
    $('#step-' + i).show();
    if (setHistory) {
        history.pushState({step: i}, 'step ' + i, '#step-' + i);
    }
    if (i == 2) {
        $('button.resume').toggle(!!target);
    }
}

function getRandomPosition(lat, lon, distance) {
    var R = 6378.1;
    var brng = 2 * Math.PI * Math.random();
    var d = distance * (1 + (0.2 * Math.random() - 0.1));
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

function toRadians(degrees) {
  return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
function toDegrees(radians) {
  return radians * 180 / Math.PI;
}


function bearing(startLat, startLng, destLat, destLng){
  var startLat = toRadians(startLat);
  var startLng = toRadians(startLng);
  var destLat = toRadians(destLat);
  var destLng = toRadians(destLng);

  var y = Math.sin(destLng - startLng) * Math.cos(destLat);
  var x = Math.cos(startLat) * Math.sin(destLat) -
        Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
  var brng = Math.atan2(y, x);
  var brng = toDegrees(brng);
  return (brng + 360) % 360;
}

function getPosition(callback) {
    if (test) {
        callback(20.0 + Math.random() / 1000.0, 21.2 + Math.random() / 1000.0);
    }else {
        navigator.geolocation.getCurrentPosition(function(position) {
            callback(position.coords.latitude, position.coords.longitude);
        });
    }
}

function distance(lat1, lon1, lat2, lon2) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		dist = dist * 1.609344;
		return dist;
	}
}

function refreshInfo() {
    if (!target) {
        return;
    }
    getPosition(function(lat, lon) {
        var d = distance(lat, lon, target[0], target[1]);
        targetBrng = bearing(lat, lon, target[0], target[1]);

        $('.position').html("Latitude: " + lat +
          "<br>Longitude: " + lon);
        $('.target').html("Latitude: " + target[0] +
                        "<br>Longitude: " + target[1] +
                        "<br>Bearing: " + targetBrng);

        if (d < 1.0) {
            d = Math.round(1000 * d) + " meters";
        } else {
            d = Math.round(100 * d) / 100.0 + " km";
        }
        $('.kms').text(d);
    });
}

$(function(){
    var txt = $('.timestamp').text();
    var ts = txt.split('=')[1];
    $('.timestamp').text(ts == '' ? 'TEST' : new Date(ts * 1000));

    var now = Math.floor(Date.now() / 1000);
    if (window.location.search == '') {
        window.location.search = '?t=' + now;
    } else {
        var old = window.location.search.split('=')[1];
        if (now - old > 60) {
            window.location.search = '?t=' + now;
        }
    }

    step(2);
    $('#step-1').click(function() {
        step(2);
    });
    $('#step-2 button.resume').click(function() {
        refreshInfo();
        step(3);
    });
    $('#step-2 button.run').click(function() {
        if (target) {
            if (!confirm('Are you sure you want to reset the position?')) {
                return;
            }
        }
        getPosition(function(lat, lon) {
            target = getRandomPosition(lat, lon, $('#distance').val());
            refreshInfo();
        });
        step(3);
    });
    $('#step-3 button.back').click(function() {
        history.back();
    });
    $('#step-3 button.refresh').click(function() {
        refreshInfo();
    });
    window.addEventListener("deviceorientationabsolute", function(e) {
        $('#compass .direction').css('transform', 'rotate(' + (targetBrng + e.alpha) + 'deg)')
    }, true);
    window.addEventListener('popstate', function(e){
        if(e.state) {
            step(e.state.step, false);
        }
      }
    );
});

