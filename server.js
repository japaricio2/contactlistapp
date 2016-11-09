//import modules
var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
//make the app an instance of the express class
var app = express();
//specify which db to use
var db = mongojs("contactlist", ["contactlist"]);
//calls app(instance of Express) to run it's use() for every request
//serves static content from the public directory
app.use(express.static(__dirname + "/public"));
//uses the bodyParser module to read json on every request
app.use(bodyParser.json());
//for every get request...
app.get('/contactlist', function(req, res) {
    console.log("I recieved a get request");
    //connect with mongo,View respond with all documents
    //in a json format object
    db.contactlist.find(function(err, docs) {
        console.log(docs);
        res.json(docs);
    });
})
//for every post request let's do this
app.post('/contactlist', function(req, res) {
    console.log(req.body);
    //lets connect to mongo and try to insert
    db.contactlist.insert(req.body, function(err, doc) {
        res.json(doc);
    })
});
//for every delete request lets do this
app.delete('/contactlist/:id', function(req, res) {
    //get id from req object parameter named 'id'
    var id = req.params.id;
    console.log(id);
    //connect to db remove query the object with the matching id
    db.contactlist.remove({
        _id: mongojs.ObjectId(id)
    }, function(err, doc) {
        //respond with the new document
        res.json(doc);
    })
});

app.get('/contactlist/:id', function(req, res) {
    var id = req.params.id;
    console.log(id);
    db.contactlist.findOne({
        _id: mongojs.ObjectId(id)
    }, function(err, doc) {
        res.json(doc);
    });
});

app.put('/contactlist/:id', function(req, res) {
    var id = req.params.id;
    console.log(req.body.name);
    db.contactlist.findAndModify({
        query: {
            _id: mongojs.ObjectId(id)
        },
        update: {
            $set: {
                name: req.body.name,
                email: req.body.email,
                number: req.body.number
            }
        },
        new: true
    }, function(err, doc) {
        res.json(doc);
    });
});

app.listen(3000);
console.log("Server running on port 3000");
