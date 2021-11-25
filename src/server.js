var express = require('express');
var app = express();
var mcache = require('memory-cache');
const requestproc = require('./requestproc');

// app.set('view engine', 'jade');

var cache = (duration) => {
    return (req, res, next) => {
        let key = '__express__' + req.originalUrl || req.url
        let cachedBody = mcache.get(key)
        if (cachedBody) {
            res.send(cachedBody)
            return
        } else {
            res.sendResponse = res.send
            res.send = (body) => {
                mcache.put(key, body, duration * 1000);
                res.sendResponse(body)
            }
            next()
        }
    }
}

app.get('/', cache(10), (req, res) => {
    var urlRequest = req.originalUrl != undefined ? req.originalUrl.replace('/?url=', '') : '';

    if (urlRequest.indexOf('infoaqui.net.br') > -1) {
        const pageContent = requestproc.request(urlRequest).then(function (response) {
            // console.log('response:' + response.content);
            res.send(response.content)
        }).catch((err) => {
            throw new Error(err);
        });
    }
})

app.use((req, res) => {
    res.status(404).send('') //not found
})

app.listen(4000, function () {
    console.log(`Example app listening on port 4000!`)
})