/*global BirdSighting _config*/

var BirdSighting = window.BirdSighting || {};
BirdSighting.map = BirdSighting.map || {};

(function rideScopeWrapper($) {
    var authToken;
    BirdSighting.authToken.then(function setAuthToken(token) {
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
        var species = $('#species').val();
        var quantity = $('#quantity').val();
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/sighting',
            headers: {
                Authorization: authToken
            },
            dataType: 'json',
            data: JSON.stringify({
                SightingLocation: {
                    Latitude: sightingLocation.latitude,
                    Longitude: sightingLocation.longitude
                },
                species: species,
                quantity: quantity
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
        $('#species').val('');
        $('#quantity').val('');
        console.log(result)
        number = result.numberOfRecordsUpdated
        alert('Success! ' + number + 'sighting added');
        console.log('Response received from API: ', result);
        window.location.href = 'index.html';

    }

    // Register click handler for #request button
    $(function onDocReady() {
        $('#request').click(handleRequestClick);
        $(BirdSighting.map).on('pickupChange', handleSightingChanged);

        BirdSighting.authToken.then(function updateAuthMessage(token) {
            if (token) {
                //displayUpdate('You are authenticated. Click to see your <a href="#authTokenModal" data-toggle="modal">auth token</a>.');
                $('.authToken').text(token);
            }
        });

        if (!_config.api.invokeUrl) {
            $('#noApiMessage').show();
        }
    });

    function handleSightingChanged() {
        var requestButton = $('#request');
        requestButton.text('Log Sighting');
        requestButton.prop('disabled', false);
    }

    function handleRequestClick(event) {
        var sightingLocation = BirdSighting.map.selectedPoint;
        event.preventDefault();
        logSighting(sightingLocation);
    }

    

    function displayUpdate(text) {
        $('#updates').append($('<li>' + text + '</li>'));
    }
}(jQuery));
