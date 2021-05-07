var mongoose = require('mongoose');

/// create a connection to the DB    
// var connection = mongoose.createConnection('mongodb://localhost:27017/movieD', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }, function(error) {
//     if (error) {
//         console.error('Unable to connect: ', error);
//     } else {
//         console.log('Connected to MongoDB');
//     }
// });
// connection.on('open', function() {
//     // connection established
//     new Admin(connection.db).listDatabases(function(err, result) {
//         console.log('listDatabases succeeded');
//         // database list stored in result.databases
//         var allDatabases = result.databases; 
//         console.log(allDatabases);   
//     });
// });


// setup mongodb database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/movieD', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function(error) {
    if (error) {
        console.error('Unable to connect: ', error);
    } else {
        console.log('Connected to MongoDB');
    }
});
mongoose.set('useCreateIndex', true);

// setup schema for database
let Schema = mongoose.Schema;
let movieSchema = new Schema({
    id: String,
    title: String,
    location: Number,
    date: String,
    times: [String],
}, {
    collection: 'movieD'
});
// export schema
module.exports.Movie = mongoose.model('movieD', movieSchema);



