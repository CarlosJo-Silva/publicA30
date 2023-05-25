$().ready(function () {
});

class Wrk {
    constructor() {

    }


    showPosition(position, callback) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        $.ajax({
            url: `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`,
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                
                callback(data);
            },
            error: function (error) {
                alert("Error: couldn't get your location");
            }
        });
    }

    processImageIn64(file, callback) {
        var reader = new FileReader();
        reader.onloadend = function () {
            var base64Image = reader.result;
            callback(base64Image);
        }
        reader.readAsDataURL(file);

    }

    sendDish(firstname, lastname, dishname, location, img64) {


            var headers = new Headers();
            headers.append("Content-Type", "application/x-www-form-urlencoded");
            headers.append("x-collection-access-token", "9c70be1b-5e9c-4f4e-b451-46daf3ffd9dd");

            var urlencoded = new URLSearchParams();
            urlencoded.append("jsonData", `{"firstName": "${firstname}", "lastName": "${lastname}", "dishName": "${dishname}", "location": "${location}", "photo": "${img64}"}`);
            urlencoded.append("collectionId", "fb589799-c4d3-4995-8dfd-4bb4757fdb9e");

            var requestOptions = {
                method: 'POST',
                headers: headers,
                body: urlencoded,
                redirect: 'follow'
            };

            fetch("https://api.myjson.online/v1/records", requestOptions)
                .then(response => response.json())
                .then(result => {
                    setTimeout(function() {
                        alert("Your dish has been registered!");
                    }, 3000);
                }

                )
                .catch(error => alert("error : couldn't register your dish"));



    }
    getUserDishes(successCallback, errorCallback) {
        var myHeaders = new Headers();
        myHeaders.append("x-collection-access-token", "9c70be1b-5e9c-4f4e-b451-46daf3ffd9dd");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("https://api.myjson.online/v1/collections/fb589799-c4d3-4995-8dfd-4bb4757fdb9e/records", requestOptions)
            .then(response => response.json())
            .then(result => {
                successCallback(result);
            })
            .catch(error => {
                console.log('error', error);
                errorCallback("error:", error);
            });
    }
    getRandomRecipe(successCallback, errorCallback) {
        $.ajax({
            url: 'https://www.themealdb.com/api/json/v1/1/random.php',
            type: 'GET',
            dataType: 'json',
            success: successCallback,
            error: errorCallback
        });
    }


}