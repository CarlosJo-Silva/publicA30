$().ready(function () {
});
var token = "";
var collectionId = "";
const timeToGetApiKeys = 100;

class Wrk {
    constructor() {
    }

    getApiKeys() {
        $.ajax({
            url: 'keys.php',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                token = data.token;
                collectionId = data.collectionId;
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    showPosition(position, successCallback, errorCallback) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        $.ajax({
            url: `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`,
            method: 'GET',
            dataType: 'json',
            success: successCallback,
            error: errorCallback
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

    sendDish(firstName, lastName, dishName, location, img64, successCallback, errorCallback) {
        this.getApiKeys();

        setTimeout(function () {

            var headers = new Headers();
            headers.append("Content-Type", "application/x-www-form-urlencoded");
            headers.append("x-collection-access-token", token);

            var urlencoded = new URLSearchParams();
            urlencoded.append("jsonData", `{"firstName": "${firstName}", "lastName": "${lastName}", "dishName": "${dishName}", "location": "${location}", "photo": "${img64}"}`);
            urlencoded.append("collectionId", collectionId);

            var requestOptions = {
                method: 'POST',
                headers: headers,
                body: urlencoded,
                redirect: 'follow'
            };

            fetch("https://api.myjson.online/v1/records", requestOptions)
                .then(response => response.json())
                .then(result => {
                        successCallback();
                    }
                )
                .catch(error => errorCallback());
        }, timeToGetApiKeys);


    }

    getUserDishes(successCallback, errorCallback) {
        this.getApiKeys();
        setTimeout(function () {
            var myHeaders = new Headers();
            myHeaders.append("x-collection-access-token", token);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
            fetch("https://api.myjson.online/v1/collections/" + collectionId + "/records", requestOptions)
                .then(response => response.json())
                .then(result => {
                    successCallback(result);

                })
                .catch(error => {
                    errorCallback(error);

                });
        }, timeToGetApiKeys);
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