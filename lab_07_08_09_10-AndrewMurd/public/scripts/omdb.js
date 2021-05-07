
let apiKey = "32a0eff0";
let movieid = "tt0059113";

fetch(`http://www.omdbapi.com/?i=${movieid}&apikey=${apiKey}`)
    .then((response) => response.json())
    .then((json) => {
        displayData(json);
    });

function displayData(data) {

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

