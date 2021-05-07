const sqlite3 = require('sqlite3').verbose();
// setup database
const db = new sqlite3.Database('./data/purchases.db', (err) => {
    if (err) {
        console.error('Error while connecting to database: ', err);
    } else {
        console.log('Connected to or created SQLite database');
    }
});
// add purchases table
db.serialize(() => {
    db.run('DROP TABLE purchases')
    db.run(`CREATE TABLE purchases(purchaseId INTEGER PRIMARY KEY,
            title TEXT, location TEXT, location_id TEXT, date TEXT, time TEXT, quantity TEXT, movie_id TEXT)`)
});
// return all purchases from table
function getAllPurchases(callback) {
    db.all('SELECT * FROM purchases', (err, purchases) => {
        if (err) {
            console.error('Error querying database: ', err);
        } else {
            callback(purchases);
        }
    });
}
// delete purchase from table
function deletePurchase(id, callback) {
    db.run('DELETE FROM purchases WHERE purchaseId = ?', id, (err) => {
        if (err) {
            console.error('Error deleting from database: ', err);
        } else {
            callback();
        }
    });
}
// add purchase to table
function addPurchase(title, location, location_id, date, time, quantity, movie_id, callback) {
    db.run('INSERT INTO purchases(title, location, location_id, date, time, quantity, movie_id) VALUES(?, ?, ?, ?, ?, ?, ?)', [title, location, location_id, date, time, quantity, movie_id], (err) => {
        if (err) {
            console.error('Error inserting into database: ', err);
        } else {
            callback();
        }
    });
}
// export functions
module.exports.getAllPurchases = getAllPurchases;
module.exports.deletePurchase = deletePurchase;
module.exports.addPurchase = addPurchase;