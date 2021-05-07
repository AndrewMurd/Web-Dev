
// hide the movie info
$("#contentDiv").addClass("hide");
// hold locations for client
let locations = ["Oshawa Cinemas"]

$.ajax({
    type: 'GET',
    url: '/showtimes_api',
    dataType: "JSON",
    success: function(response) {
        populateLocations(response)
    }
});

// dynamically populate the select menu with locations for movies
function populateLocations(data) {
    let set = []
    for (let i = 0; i < data.length; i++) {
        if (set.indexOf(data[i].location) == -1) {
            set.push(data[i].location);
        }
    }
    for (let i = 0; i < set.length; i++) {
        $('#loc').append($('<option>', {
            value: set[i],
            text: locations[i]
        }));
    }
}
// get showtimes for a movie theatre
$("#pink").click(function(event) {
    event.preventDefault();

    let location_id = document.getElementById("loc").value;

    let date = $("#date").val().split('-');
    let year = date[0];
    let month = date[1];
    let day = date[2];
    let selected_date = [year, month, day].join('/');

    $.ajax({
        type: "GET",
        url: './showtimes_api',
        data: {
            "location": location_id,
            "date": selected_date
        },
        dataType: "JSON",
        success: function(response) {
            displayShowtimes(response);
        }
    });
});

// create table to display showtimes
function displayShowtimes(data) {
    let tableDiv = document.getElementById("tableDiv");
    let table = document.createElement("table");

    $(table).addClass("table");

    $(tableDiv).empty();

    // loop over each movie
    for (let i = 0; i < data.length; i++) {
        let tr = document.createElement("tr");
        // create two cells for each row
        for (let j = 0; j < 2; j++) {
            let td = document.createElement("td");
            tr.appendChild(td);
            if (j == 0) {
                let a = document.createElement("a");
                td.appendChild(a);
                $(a).addClass('link');
                $(a).html(data[i].title);
            } else {
                // loop over each movie start time an create a hidden form of data
                for (let k = 0; k < (data[i].times).length; k++) {
                    let p = document.createElement("p");
                    td.appendChild(p);
                    $(p).html((data[i].times)[k]);
                    let cart = document.createElement("button");
                    $(cart).addClass("button");
                    cart.setAttribute("type", "submit");  
                    let img = $("<img>");
                    $(img).attr('src', "images/buy.png");
                    $(cart).append(img);

                    let form = $("<form>");
                    let movie_id = $("<input>");
                    let movie_title = $("<input>");
                    let location_id = $("<input>");
                    let location = $("<input>");
                    let selected_date = $("<input>");
                    let start_time = $("<input>");

                    $(form).attr('action', '/buyTickets');
                    $(form).attr('method', 'get');

                    $(movie_id).attr('type', 'hidden');
                    $(movie_id).attr('name', 'movie_id');
                    $(movie_title).attr('type', 'hidden');
                    $(movie_title).attr('name', 'movie_title');
                    $(location_id).attr('type', 'hidden');
                    $(location_id).attr('name', 'location_id');
                    $(location).attr('type', 'hidden');
                    $(location).attr('name', 'location');
                    $(selected_date).attr('type', 'hidden');
                    $(selected_date).attr('name', 'selected_date');
                    $(start_time).attr('type', 'hidden');
                    $(start_time).attr('name', 'start_time');

                    $(movie_id).val(data[i].id);
                    $(movie_title).val(data[i].title);
                    $(location_id).val(data[i].location);
                    $(location).val(locations[data[i].location - 1]);
                    $(selected_date).val(data[i].date);
                    $(start_time).val((data[i].times)[k]);

                    $(form).append(movie_id);
                    $(form).append(movie_title);
                    $(form).append(location_id);
                    $(form).append(location);
                    $(form).append(selected_date);
                    $(form).append(start_time);
                    $(form).append(cart);

                    $(td).append(form);
                }
            }
            
        }
        table.appendChild(tr);
    }
    tableDiv.appendChild(table);
    
    // call display data if movie link is clicked
    $(".link").click(function(event) {
        $("#contentDiv").removeClass("hide");
        let movie = event.currentTarget.innerHTML;
        $.ajax({
            type: 'GET',
            url: '/showtimes_api',
            data: {
                "title": movie,
            },
            dataType: "JSON",
            success: function(response) {
                displayData(response);
            }
        });
    });    
}

// get movie info from omdb api
function displayData(data, movie) {
    let apiKey = "32a0eff0";
    let movieid = data[0].id;

    fetch(`http://www.omdbapi.com/?i=${movieid}&apikey=${apiKey}`)
    .then((response) => response.json())
    .then((json) => {
        setElements(json);
    });
}
// create display of data
function setElements(data) {

    let ratingDiv = document.getElementById("ratings");
    ratingDiv.textContent = '';

    document.getElementById("cover").setAttribute("src", data.Poster);
    document.getElementById("title").value = data.Title;
    document.getElementById("year").value = data.Year;
    document.getElementById("genre").value = data.Genre;
    document.getElementById("runtime").value = data.Runtime;
    document.getElementById("director").value = data.Director;
    document.getElementById("writer").value = data.Writer;
    $("#actor").html(data.Actors);
    $("#plot").html(data.Plot);

    let rating = data.Ratings[0].Value.charAt(0);
    for (let i = 0; i < rating; i++) {
        let trophy = document.createElement("img");
        $(trophy).addClass("trophy");
        trophy.setAttribute("src", "images/trophy.png");
        document.getElementById("ratings").appendChild(trophy);
    }
}

