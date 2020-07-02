var express = require('express');
let bodyParser = require('body-parser');

let getAccount = require('./api/getAccount');
let test = require('./api/test');
let main = require('./api/main');
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
app.use('/',main);
// app.use('/home',main);
// app.use('/about',middlewareC);

app.listen(3000, function () {
    console.log('listen 3000...');
});