const express = require('..')
const app = express()

app.put('/', function (req, res) {
    res.send('put Hello World!');
});

app.get('/', function (req, res) {
    res.send('get Hello World!');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})