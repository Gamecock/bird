/*global WildRydes _config*/

var WildRydes = window.WildRydes || {};
WildRydes.map = WildRydes.map || {};
console.log("Wild Rides", WildRydes);
(function rideScopeWrapper($) {
    var authToken;
    WildRydes.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
        } else {
            window.location.href = '/signin.html';
        }
    }).catch(function handleTokenError(error) {
        alert(error);
        window.location.href = '/signin.html';
    });
    function logSighting(sightingLocation) {
        var species = $('#species').val()
        var quantity = $('#quantity').val();
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/sighting',
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
                sightingLocation: {
                    Latitude: sightingLocation.latitude,
                    Longitude: sightingLocation.longitude
                },
                species:species,
                quantiy: quantity
            }),
            contentType: 'application/json',
            success: completeRequest,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error logging sighting: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when recording your sighting:\n' + jqXHR.responseText);
            }
        });
    }

    function completeRequest(result) {
        var unicorn;
        var pronoun;
        console.log('Response received from API: ', result);
    }

    // Register click handler for #request button
    $(function onDocReady() {
        $('#request').click(handleRequestClick);
        $(WildRydes.map).on('pickupChange', handlePickupChanged);

                WildRydes.authToken.then(function updateAuthMessage(token) {
            if (token) {
                displayUpdate('You are authenticated. Click to see your <a href="#authTokenModal" data-toggle="modal">auth token</a>.');
                $('.authToken').text(token);
            }
        });

        if (!_config.api.invokeUrl) {
            $('#noApiMessage').show();
        }
    });

    function handlePickupChanged() {
        var requestButton = $('#request');
        requestButton.text('Log Sighting');
        requestButton.prop('disabled', false);
    }

    function handleRequestClick(event) {
        var sightingLocation = WildRydes.map.selectedPoint;
        event.preventDefault();
        logSighting(sightingLocation);
    }


}(jQuery));
