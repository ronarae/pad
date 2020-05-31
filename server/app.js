/**
 * Server application - contains all server config and api endpoints
 *
 * @author Pim Meijer
 */
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const db = require("./utils/databaseHelper");
const cryptoHelper = require("./utils/cryptoHelper");
const corsConfig = require("./utils/corsConfigHelper");
const app = express();

//logger lib  - 'short' is basic logging info
app.use(morgan("short"));

//init mysql connectionpool
const connectionPool = db.init();

//parsing request bodies from json to javascript objects
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//CORS config - Cross Origin Requests
app.use(corsConfig);

// ------ ROUTES - add all api endpoints here ------
const httpOkCode = 200;
const badRequestCode = 400;
const authorizationErrCode = 401;

app.post("/user/login", (req, res) => {
    const username = req.body.username;

    //TODO: We shouldn't save a password unencrypted!! Improve this by using cryptoHelper :)
    const password = req.body.password;

    db.handleQuery(connectionPool, {
        query: "SELECT user_id, username, password FROM user WHERE username = ? AND password = ?",
        values: [username, password]
    }, (data) => {
        if (data.length === 1) {
            //return just the username for now, never send password back!
            res.status(httpOkCode).json({"username": data[0].username, "user_id": data[0].user_id});
        } else {
            //wrong username
            res.status(authorizationErrCode).json({reason: "Wrong username or password"});
        }

    }, (err) => res.status(badRequestCode).json({reason: err}));
});



//Gebruiker toevoegen aan DB
app.post("/register", (req, res) => {

    db.handleQuery(connectionPool, {
            query: "SELECT username, emailaddress FROM user WHERE username = ? AND emailaddress = ?",
            values: [req.body.username, req.body.password]
        }, (data) => {
            if (data.length === 0) {
                db.handleQuery(connectionPool, {
                        query: "INSERT INTO user(username, emailaddress, password) VALUES (?, ?, ?)",
                        values: [req.body.username, req.body.emailaddress, req.body.password]
                    }, (data) => {
                        if (data.insertId) {
                            res.status(httpOkCode).json({id: data.insertId});
                        } else {
                            res.status(badRequestCode).json({reason: "Something went wrong, no record inserted"})
                        }
                    }, (err) => res.status(badRequestCode).json({reason: err})
                );
            } else {
                res.status(authorizationErrCode).json({reason: "Already exist username or password"});
            }
        }, (err) => res.status(badRequestCode).json({reason: err})
    );
});

//Contact toevoegen aan DB
app.post("/contact", (req, res) => {

    db.handleQuery(connectionPool, {
        query: "INSERT INTO contact(firstname, surname, address, emailaddress, phonenumber, user_id) VALUES (?, ?, ?, ?, ?, ?)",
        values: [req.body.firstname, req.body.surname, req.body.address, req.body.emailaddress, req.body.phonenumber, req.body.user_id]
    }, (data) => {
            if(data.insertId) {
                res.status(httpOkCode).json({id: data.insertId});
            } else {
                res.status(badRequestCode).json({reason: "Something went wrong, no record inserted"})
            }
        }, (err) => res.status(badRequestCode).json({reason: err})
    );
});
// Groep toevoegen aan DB

app.post("/group", (req, res) => {
    db.handleQuery(connectionPool, {
        query: "INSERT INTO pad_bsc_8_dev.`group` (name, user_id) VALUES (?,?)",
        values: [req.body.name, req.body.user_id]
    }, (data) => {
            if (data.insertId) {
                res.status(httpOkCode).json({id: data.insertId});
            } else {
                res.status(badRequestCode).json({reason: "Something went wrong, no record inserted"})
            }
        }, (err) => res.status(badRequestCode).json({reason: err})
    );
    });


//Haal contacten op
app.post("/group/get", (req, res) => {

    db.handleQuery(connectionPool, {
            query: "SELECT * FROM contact WHERE user_id = ?",
            values: [req.body.user_id]
        }, (data) => {
            //just give all data back as json
        console.log("succesfull data");
            res.status(httpOkCode).json(data);
        }, (err) => res.status(badRequestCode).json({reason: err})
    );
});
//Contact wijzigen in groep
app.post("/group/update", (req, res) => {

    db.handleQuery(connectionPool, {
            query: "UPDATE contact SET group_id = ? WHERE contact_id = ?",
            values: [req.body.group_id, req.body.user_id]
        }, (data) => {
            //just give all data back as json
            res.status(httpOkCode).json(data);
        }, (err) => res.status(badRequestCode).json({reason: err})
    );
});




// Contacten weergeven
app.post("/contactPage", (req, res) => {

    db.handleQuery(connectionPool, {
            query: "SELECT * FROM contact WHERE user_id = ?",
            values: [req.body.user_id]
        }, (data) => {
            //just give all data back as json
            res.status(httpOkCode).json(data);
        }, (err) => res.status(badRequestCode).json({reason: err})
    );
});

//Contact wijzigen
app.post("/contactPage/update", (req, res) => {

    db.handleQuery(connectionPool, {
            query: "UPDATE contact SET firstname = ?, surname = ? , address =?, emailaddress = ? , phonenumber = ? WHERE contact_id = ?",
            values: [req.body.firstname,req.body.surname,req.body.address,req.body.emailaddress,req.body.phonenumber, req.body.id]
        }, (data) => {
            //just give all data back as json
            res.status(httpOkCode).json(data);
        }, (err) => res.status(badRequestCode).json({reason: err})
    );
});


//Contact verwijderen
app.post("/contactPage/delete", (req, res)=>{

    db.handleQuery(connectionPool, {
            query: "DELETE FROM contact WHERE contact_id = ?",
            values: [req.body.contact_id]
        }, (data) =>{
            res.status(httpOkCode).json(data);
        }, (err) => res.status(badRequestCode).json({reason:err})
    );
});

// Groepen weergeven
app.post("/groupPage", (req, res) => {

    db.handleQuery(connectionPool, {
            query: "SELECT * FROM pad_bsc_8_dev.`group` WHERE user_id = ?",
            values: [req.body.user_id]
        }, (data) => {
            //just give all data back as json
            res.status(httpOkCode).json(data);
        }, (err) => res.status(badRequestCode).json({reason: err})
    );
});

// Groep verwijderen

app.post("/groupPage/delete", (req, res) => {

    db.handleQuery(connectionPool, {
            query: "DELETE FROM pad_bsc_8_dev.`group` WHERE groupId = ?",
            values: [req.body.groupId]
        }, (data) => {
            //just give all data back as json
            res.status(httpOkCode).json(data);
        }, (err) => res.status(badRequestCode).json({reason: err})
    );
});

// Groep wijzigen
app.post("/groupPage/update", (req, res) => {

    db.handleQuery(connectionPool, {
            query: "UPDATE pad_bsc_8_dev.`group` SET name = ? WHERE groupId = ?",
            values: [req.body.groupName, req.body.groupId]
        }, (data) => {
            //just give all data back as json
            res.status(httpOkCode).json(data);
        }, (err) => res.status(badRequestCode).json({reason: err})
    );
});


//------- END ROUTES -------

module.exports = app;

