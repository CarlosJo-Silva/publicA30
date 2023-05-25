$().ready(function () {
    window.ctrl = new Ctrl();
    wrk = new Wrk();

});

var image = "";

class Ctrl {
    constructor() {

        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("../../projetA30/serviceWorker.js")

        }
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                wrk.showPosition(position, (data) => {
                    $('#location').val(data.address.state);

                });

            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    register() {
        if ($("#firstname").val() == "" || $("#lastname") == "" || $("#dishname") == "" || $("#location") == "" || $("#photo") == "") {
            alert("Fill all the fields.");
            return;
        } else {
            var firstname = $("#firstname").val();
            var lastname = $("#lastname").val();
            var dishname = $("#dishname").val();
            var location = $("#location").val();

            var fileInput = document.getElementById("photo");
            wrk.processImageIn64(fileInput.files[0], (img64) => {
                var img64 = img64;
                wrk.sendDish(firstname, lastname, dishname, location, img64);
                $("#collapseForm").collapse('hide');
                $("#firstname").val("");
                $("#lastname").val("");
                $("#dishname").val("");
                $("#location").val("");
                $("#photo").val("");


            });
        }
    }

    getUserDish() {
        var loading = $('<div class="spinner-border text-primary" role="status"></div>');
        $('#loadingContainer').append(loading);
        wrk.getUserDishes(this.successUserDish, this.errorUserDish);



    }

    successUserDish(data) {
        $('#dataContainer').empty();
        $('#loadingContainer').empty();
        data.records.forEach(function (item) {
            console.log(item.data.firstName);
            console.log(item.data.lastName);
            console.log(item.data.dishName);
            console.log(item.data.location);
            console.log(item.data.photo);

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

    errorUserDish() {
        $('#loadingContainer').empty();
        alert("Error, couldn't retrieve the user's dishes");
        return;

    }
    getRandomRecipe() {
        var loading = $('<div class="spinner-border text-primary" role="status"></div>');
        $('#loadingContainer').append(loading);
        wrk.getRandomRecipe(this.successRandomDish, this.errorRandomDish);
    }
    successRandomDish(data) {
        $('#dataContainer').empty();
        $('#loadingContainer').empty();
        console.log(data);

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
    errorRandomDish() {
        $('#loadingContainer').empty();
        alert("Error, couldn't retrieve the random dish");
        return;
    }
}
