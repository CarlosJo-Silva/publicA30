/*
Author : Carlos Silva
Version : 1.0
Date : 16.06.2023
Purpose : Project A30's Wrk
 */
$().ready(function () {
});
    class Wrk {
        /**
         * Constructor of the class Wrk.
         */
        constructor() {
        }

        /**
         * Retrieves the API keys. It does a GET request to the API.
         * @param callback - The callback that will be called when the API keys are retrieved.
         */
        getApiKeys(callback) {
            $.ajax({
                url: 'keys.php',
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    callback(data);
                },
                error: function () {
                    alert("Error: Check your internet connection");
                    $('#loadingContainer').empty();
                }
            });
        }

        /**
         * Retrieves the user's location using his latitude and longitude. It does a GET request to the API.
         * @param position The user's position
         * @param successCallback The callback that will be called when the user's location is retrieved.
         * @param errorCallback The callback function that will be called when the user's location is not retrieved.
         */
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

        /**
         *  Process an image file in base64.
         * @param file The image file
         * @param callback The callback that will be called when the image is processed.s
         */
        processImageIn64(file, callback) {
            var reader = new FileReader();
            reader.onloadend = function () {
                var base64Image = reader.result;
                callback(base64Image);
            }
            reader.readAsDataURL(file);

        }

        /**
         * Sends a dish to the API. First, it retrieves the API keys, then it prepares its headers with the token.
         * After that, it prepares the body request with the dish's data and the collectionId and prepares the requestOptions.
         * Does a POST request to the API with the requestOptions and finally sends the dish to the API.
         * If successful, it calls the successCallback, if not, it calls the errorCallback.
         * @param firstName first name of the user.
         * @param lastName last name of the user.
         * @param dishName name of the dish.
         * @param location location of the user.
         * @param img64 image of the dish in base64.
         * @param successCallback The callback that will be called when the dish is sent to the API.
         * @param errorCallback The callback that will be called when the dish is not sent to the API.
         */
        sendDish(firstName, lastName, dishName, location, img64, successCallback, errorCallback) {
            this.getApiKeys(function (data) {
                var headers = new Headers();
                headers.append("Content-Type", "application/x-www-form-urlencoded");
                headers.append("x-collection-access-token", data.token);

                var urlencoded = new URLSearchParams();
                urlencoded.append("jsonData", `{"firstName": "${firstName}", "lastName": "${lastName}", "dishName": "${dishName}", "location": "${location}", "photo": "${img64}"}`);
                urlencoded.append("collectionId", data.collectionId);

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
            });
        }

        /**
         * Retrieves the user's dishes. First, it retrieves the API keys, then it prepares its headers with the token.
         * After that, it prepares the requestOptions. Does a GET request to the API with the requestOptions and finally
         * retrieves the user's dishes. If successful, it calls the successCallback, if not, it calls the errorCallback.
         * @param successCallback The callback that will be called when the user's dishes are retrieved.
         * @param errorCallback The callback that will be called when the user's dishes are not retrieved.
         */
        getUserDishes(successCallback, errorCallback) {
            this.getApiKeys(function (data) {
                var myHeaders = new Headers();
                myHeaders.append("x-collection-access-token", data.token);

                var requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };
                fetch("https://api.myjson.online/v1/collections/" + data.collectionId + "/records", requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        successCallback(result);

                    })
                    .catch(error => {
                        errorCallback(error);

                    });
            });


        }

        /**
         * Retrieves a random recipe from the API. Does a GET request to the API and retrieves a random recipe.
         * @param successCallback The callback that will be called when the random recipe is retrieved.
         * @param errorCallback The callback that will be called when the random recipe is not retrieved.
         */
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
