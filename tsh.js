var express = require('express');
let bodyParser = require('body-parser');

let getAccount = require('./api/getAccount');
let getBalance = require('./api/getBalance');
let main = require('./api/mains');
// let getAccount = require('./api/getAccount');


var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");//项目上线后改成页面的地址
     
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
     
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
     
    next();
     
});


// app.use('/user',getAccount);
// app.use('/',getBalance);
app.use('/home',main);
// app.use('/about',middlewareC);

app.listen(3000, function () {
    console.log('listen 3000...');
});