$().ready(function () {
});
    class Wrk {
        constructor() {
        }
        getApiKeys(callback) {
            $.ajax({
                url: 'keys.php',
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    callback(data);
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
