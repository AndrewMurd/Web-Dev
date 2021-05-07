// import necessary packages and files
const express = require('express');
let app = express();

const model = require('./public/scripts/showtimes_model.js');
const sqlModel = require('./model/purchases_model.js');

const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

// serve public folder statically
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

// set the port for the server
app.set('port', process.env.PORT || 3000); 
// listen on that port
app.listen(app.get('port'), function() {
    console.log(`Listening for requests on port ${app.get('port')}`);
});
// function to generate qr code image from qrcode package
function generateQRCode() {
    QRCode.toFile('./public/images/QR.png', 'QR Code', {
        width: 128,
        height: 128
    }, function (err) {
        if (err) throw err
    })
    return "./images/QR.png";
}
// handles new purchases
app.post('/buyTickets', function(request, response) {
    let data = request.body;
    // add purchase to purchases table
    sqlModel.addPurchase(data.title, data.location, data.location_id, data.date, data.time, data.quantity, data.movie_id, () => {
        // render purchase confirmed view 
        response.render("purchaseConfirmed", {
            pageTitle: "Purchase Confirmation",
            headerTitle: "Purchase Confirmed",
            headerSubtitle: "This is all there is to it!",
            num: uuidv4(),
            qrcode: generateQRCode(),
        });
    })
    // print contents of purchases table in database
    sqlModel.getAllPurchases((purchases) => {
        console.log(purchases);
    });
});
// handles buy tickets page
app.get('/buyTickets', function(request, response) {
    let data = request.query;
    // render purchase buy tickets 
    response.render("buyTickets", {
        pageTitle: "Buy Tickets",
        headerTitle: "Buy Tickets",
        headerSubtitle: "Let's do this!",
        title: data.movie_title,
        location: data.location,
        date: data.selected_date,
        time: data.start_time,
        location_id: data.location_id,
        movie_id: data.movie_id,
    });
});
// handles requests from mongodb database
app.get('/showtimes_api', function(request, response) {
    model.Movie.find(request.query).then(function (result) {
        response.send(result);
    });
});

