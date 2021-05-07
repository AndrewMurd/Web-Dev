/*
Andrew Murdoch
100707816

This file implements the high score table.
*/

$(document).ready(function() {
    $(".navbar-burger").click(function() {
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
    });
});
// Add date and duration objects to high score table
function addScore(date, duration) {
    var table = document.getElementById("highScores");

    for (let i = 0; i < 4; i++) {
        var row = document.createElement("tr");
        var cell1 = document.createElement("td");
        var cell2 = document.createElement("td");

        table.appendChild(row);
        row.appendChild(cell1);
        row.appendChild(cell2);

        let [month, day, year]    = new Date().toLocaleDateString("en-US").split("/");
        let seconds = Math.floor(Date.now() / 1000);
        let rem = seconds % 60;
        var minutes = Math.floor(seconds / 60);
        cell1.innerHTML = year + "/" + month + "/" + day;
        cell2.innerHTML = minutes + ":" + rem;
    }
}

addScore();
