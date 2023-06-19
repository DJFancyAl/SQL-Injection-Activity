// Dependencies
const http = require('http'),
path = require('path'),
express = require('express'),
bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();


// App
const app = express();
app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


//Database
const db = new sqlite3.Database(':memory:');
db.serialize(function () {
 db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
 db.run("INSERT INTO user VALUES ('privilegedUser', 'privilegedUser1', 'Administrator')");
});


// Routes
app.get('/', (req,res) => {
    res.sendFile('index.html')
})

app.post('/login', (req, res) => {
    const {username, password} = req.body
    const query = `SELECT title FROM user WHERE username = '${username}' AND password = '${password}';`
    console.log(`username: ${username}`)
    console.log(`password: ${password}`)
    console.log(`query: ${query}`)

    db.get(query, function (err, row) {
        if (err) {
            console.log('ERROR', err);
            res.redirect('/index.html#error');
        } else if (!row) {
            console.log('unauthorized')
            res.redirect('index.html#unauthorized');
        } else {
            res.send('Hello <b>' + row.title + '!</b><br />This file contains all your secret data: <br /><br />SECRETS <br /><br /> MORE SECRETS <br /><br /><a href="/index.html">Go back to login</a>');
        }
    });
})

app.listen(3000, () => {
    console.log(`Server Running on port 3000...`)
})
