$().ready(function () {
    window.ctrl = new Ctrl();
    wrk = new Wrk();

});

class Ctrl {
    constructor() {

        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("../../projectA30/serviceWorker.js")

        }
    }

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

    register() {
        if ($("#firstName").val() == "" || $("#lastName") == "" || $("#dishName") == "" || $("#location") == "" || $("#photo") == "") {
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
    successSendFish() {
        alert("Dish successfully registered.");
        ctrl.emptyFields();
        $('#loadingContainer').empty();
        $("#collapseForm").collapse('hide');
    }
    getUserDish() {
        var loading = $('<div class="spinner-border text-success" role="status"></div>');
        $('#loadingContainer').append(loading);
        wrk.getUserDishes(this.successUserDish, this.errorUserDish);
    }

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

    emptyFields() {
        $("#firstName").val("");
        $("#lastName").val("");
        $("#dishName").val("");
        $("#location").val("");
        $("#photo").val("");
    }

    getRandomRecipe() {
        var loading = $('<div class="spinner-border text-danger" role="status"></div>');
        $('#loadingContainer').append(loading);
        wrk.getRandomRecipe(this.successRandomDish, this.errorRandomDish);
    }

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

    errorUserDish() {
        $('#loadingContainer').empty();
        alert("Error: couldn't retrieve the user dishes\n check your internet connection or try again later");
    }

    errorRandomDish() {
        $('#loadingContainer').empty();
        alert("Error: couldn't retrieve the random dish\n check your internet connection or try again later");
    }
    errorShowPosition() {
        alert("Error:  couldn't get your location\n check your internet connection or try again later");

    }
    errorSendDish() {
        alert("Error: couldn't send your dish\n check your internet connection or try again later");

    }





}
