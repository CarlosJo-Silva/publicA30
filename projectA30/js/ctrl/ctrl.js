/*
Author : Carlos Silva
Version : 1.0
Date : 16.06.2023
Purpose : Project A30's Ctrl
 */
$().ready(function () {
    window.ctrl = new Ctrl();
    wrk = new Wrk();
});

class Ctrl {
    /**
     * Constructor of the class Ctrl. It registers the service-worker.
     */
    constructor() {

        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("../../projectA30/serviceWorker.js")

        }
    }

    /**
     * Retrieves the user's location.
     * If successful, it calls showPosition() from the class Wrk that will display the user's location.
     * If unsuccessful, displays an error message.
     */
    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                    wrk.showPosition(position, (data) => {
                        $('#location').val(data.address.state);
                    }, this.errorShowPosition);
                }, (error) => {
                    alert("Error:  couldn't get your location, please check your internet connection");
                }
            );
        } else {
            alert("Error: your browser doesn't support geolocation");
        }
    }

    /**
     * Registers a dish. It checks if all the fields are filled and if the file size is less than 3.5MBy.
     * If all the fields are filled and the file size is less than 3.5MB, it calls processImageIn64() from the class Wrk.
     * After processing the image, we send the dish to the Wrk, and it displays a loading spinner.
     * If the image is too big and / or the fields are not filled, it displays an error message.
     */
    register() {
        if ($("#firstName").val() == "" || $("#lastName").val() == "" || $("#dishName").val() == "" || $("#location").val() == "" || $("#photo").val() == "") {
            alert("Fill all the fields.");
            return;
        } else {
            var firstName = $("#firstName").val();
            var lastName = $("#lastName").val();
            var dishName = $("#dishName").val();
            var location = $("#location").val();
            var fileInput = document.getElementById("photo");
            var file = fileInput.files[0];
            if (file && file.size > 3.5 * 1024 * 1024) {
                alert("File size exceeds the limit of 3.5MB.");
                return;
            }
            wrk.processImageIn64(file, (img64) => {
                var img64 = img64;
                wrk.sendDish(firstName, lastName, dishName, location, img64, this.successSendFish, this.errorSendDish);
                var loading = $('<div class="spinner-border text-secondary" role="status"></div>');
                $('#loadingContainer').append(loading);


            });
        }
    }

    /**
     * Display a success message after sending a user dish.
     * After displaying the message, it empties the fields, empties the loading container and collapses the form.
     */
    successSendFish() {
        alert("Dish successfully registered.");
        ctrl.emptyFields();
        $('#loadingContainer').empty();
        $("#collapseForm").collapse('hide');
    }

    /**
     * Empties the loading container first, then it displays a new loading spinner and calls getUserDishes() from the class Wrk.
     */
    getUserDish() {
        $('#loadingContainer').empty();
        var loading = $('<div class="spinner-border text-success" role="status"></div>');
        $('#loadingContainer').append(loading);
        wrk.getUserDishes(this.successUserDish, this.errorUserDish);
    }

    /**
     * Create cards with the user's dishes informations and displays it in the data container.
     * It empties the dataContainer and the loadingContainer first to display the cards.
     * @param  data - The data containing the user's dishes.
     */
    successUserDish(data) {
        $('#dataContainer').empty();
        $('#loadingContainer').empty();
        data.records.forEach(function (item) {
            var card = $('<div class="card mb-3"></div>');
            var cardBody = $('<div class="card-body"></div>');
            var dishName = $('<h5 class="card-title"></h5>').text('Dish Name: ' + item.data.dishName);
            var name = $('<p class="card-text"></p>').text(item.data.firstName + ' ' + item.data.lastName);
            var location = $('<p class="card-text"></p>').text('Location: ' + item.data.location);
            var photo = $('<img class="card-img-top dish-photo" alt="Dish Photo">').attr('src', item.data.photo);

            cardBody.append(dishName);
            cardBody.append(name);
            cardBody.append(location);

            card.append(photo);
            card.append(cardBody);

            $('#dataContainer').append(card);
        });
    }

    /**
     * Empty all the form fields.
     */
    emptyFields() {
        $("#firstName").val("");
        $("#lastName").val("");
        $("#dishName").val("");
        $("#location").val("");
        $("#photo").val("");
    }

    /**
     * Gets a random recipe from the API. Empties the loading container and append a loading spinner in the data container.
     * Then it calls getRandomRecipe() from the class Wrk.
     */
    getRandomRecipe() {
        $('#loadingContainer').empty();
        var loading = $('<div class="spinner-border text-danger" role="status"></div>');
        $('#loadingContainer').append(loading);
        wrk.getRandomRecipe(this.successRandomDish, this.errorRandomDish);
    }

    /**
     * Create a card with a random recipe from the API and displays it in the data container.
     * It empties the dataContainer and the loadingContainer first to display the card.
     * @param data : data of the random recipe
     */
    successRandomDish(data) {
        $('#dataContainer').empty();
        $('#loadingContainer').empty();
        var recipe = data.meals[0];
        var card = $('<div class="card"></div>');
        var cardBody = $('<div class="card-body"></div>');
        var title = $('<h5 class="card-title"></h5>').text(recipe.strMeal);
        var image = $('<img class="card-img-top" alt="Recipe Photo">').attr('src', recipe.strMealThumb);
        var category = $('<p class="card-text"></p>').text('Category: ' + recipe.strCategory);
        var area = $('<p class="card-text"></p>').text('Origin: ' + recipe.strArea);
        var ingredients = $('<h6 class="card-subtitle mb-2"></h6>').text('Ingredients');
        var instructions = $('<h6 class="card-subtitle mb-2"></h6>').text('Instructions');
        var ingredientList = $('<ul></ul>');
        for (var i = 1; i <= 20; i++) {
            var ingredient = recipe['strIngredient' + i];
            var measure = recipe['strMeasure' + i];
            if (ingredient) {
                var listItem = $('<li></li>').text(measure + ' ' + ingredient);
                ingredientList.append(listItem);
            }
        }
        var instructionsText = $('<p class="card-text"></p>').text(recipe.strInstructions);
        cardBody.append(title);
        cardBody.append(image);
        cardBody.append(category);
        cardBody.append(area);
        cardBody.append(ingredients);
        cardBody.append(ingredientList);
        cardBody.append(instructions);
        cardBody.append(instructionsText);

        card.append(cardBody);

        $('#dataContainer').append(card);
    }


    /*=====================================*/
    /*           ERRORS CALLBACKS          */
    /*=====================================*/

    /**
     * Displays an error message and empties the loading container
     */
    errorUserDish() {
        $('#loadingContainer').empty();
        alert("Error: couldn't retrieve the user dishes. \nCheck your internet connection or try again later");
    }

    /**
     * Displays an error message and empties the loading container
     */
    errorRandomDish() {
        $('#loadingContainer').empty();
        alert("Error: couldn't retrieve the random dish. \nCheck your internet connection or try again later");
    }

    /**
     * Displays an error message.
     */
    errorShowPosition() {
        alert("Error:  couldn't get your location. \nCheck your internet connection or try again later");

    }

    /**
     * Displays an error message.
     */
    errorSendDish() {
        $('#loadingContainer').empty();
        alert("Error: couldn't send your dish. \nCheck your internet connection or try again later");

    }

}
