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
        console.log("Sending put");
        $.ajax({
            method: 'PUT',
            url: _config.api.invokeUrl + '/sighting',
            headers: {
                Authorization: authToken
            },
            contentType: 'application/json',
            success: completeRequest,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error getting sightings: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when getting your sightings:\n' + jqXHR.responseText);
            }
        });
    }

    function completeRequest(result) {
        console.log(result);
        loadTable(result);
    }
    
    function loadTable(response){
        response.records.forEach(element => {
            record = element[0]["stringValue"].slice(1,-1)
            appendToTable(record);
        })
    }

    function appendToTable(record){
        data_array = record.split(',')
        data_array[0] = data_array[0].slice(1,-1);
        markup = "<tr>";
        data_array.forEach(element => {
            markup = markup+"<td>"+element+"</td>";
        });
        markup += "</tr>";
        table_body = $('#birdlist tbody');
        table_body.append(markup);
    }

    /**
    //Remove Block Quotes for local testing//
    response = {
        "numberOfRecordsUpdated": 0,
        "records": [
            [ { "stringValue": "(\"2020-06-25 01:54:45\",parrot,5,25.7586,-80.1957)"}],
            [{"stringValue": "(\"2020-06-25 01:40:14\",duck,2,25.7519,-80.2033)"}],
            [{ "stringValue": "(\"2020-06-25 01:39:29\",duck,2,25.7519,-80.2033)" }]
        ]}
    
    loadTable(response);
    **/
}(jQuery));



