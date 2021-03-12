
var lat, lon;

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

$(function(){

    step(1);
    $('#step-1').click(function() {
        step(2);
    });
    $('#step-2 button').click(function() {
        navigator.geolocation.getCurrentPosition(function(position) {
            $('.position').text("Latitude: " + position.coords.latitude +
                                  "<br>Longitude: " + position.coords.longitude);
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

