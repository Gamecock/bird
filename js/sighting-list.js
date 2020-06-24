/*global WildRydes _config*/

var WildRydes = window.WildRydes || {};
console.log(WildRydes);
(function listScopeWrapper($) {
    var authToken;
    WildRydes.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
            console.log("Sending Request")
            getSightings();
        } else {
            window.location.href = '/signin.html';
        }
    }).catch(function handleTokenError(error) {
        alert(error);
        window.location.href = '/signin.html';
    });
    function getSightings() {
        $.ajax({
            method: 'GET',
            url: _config.api.invokeUrl + '/sighting',
            headers: {
                Authorization: authToken
            },
            dataType: 'json',
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
        console.log(result);
    }
}(jQuery));



