const express = require('..');
const app = express();
const router = express.Router();

// app.get('/', function(req, res, next) {
//     next();
// })

// .get('/', function(req, res, next) {
//     next(new Error('error'));
// })

// .get('/', function(req, res) {
//     res.send('third');
// });

// app.listen(3000, function () {
//     console.log('Example app listening on port 3000!')
// })

app.use(function (req, res, next) {
    console.log('Time：', Date.now());
    next();
});

app.get('/', function (req, res, next) {
    res.send('first');
});


router.use(function (req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.use('/', function (req, res, next) {
    res.send('second');
});

app.use('/user', router);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});