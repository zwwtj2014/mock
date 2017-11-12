/*
 * @Author: clam
 * @Date: 2017-11-12 00:20:39
 * @Last Modified by: clam
 * @Last Modified time: 2017-11-12 22:19:31
 */
'use strict'
const http = require('http');
const Router = require('./router');

class App {

    constructor() {
        this._router = new Router();
    }

    get(path, fn) {
        return this._router.get(path, fn);
    }

    listen(port, cb, ...args) {
        const server = http.createServer((req, res) => {
            if (!res.send) {
                res.send = (body) => {
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });
                    res.end(body);
                };
            }
            return this._router.handle(req, res);
        });

        /**
         * return server.listen(port, cb);
         *
         * 使用下面这种方式主要是因为能够重载server.listen的多种参数
         * 下面的方式是使用Proxy的方式将方法转嫁到node的原生listen方法
         */
        return server.listen.apply(server, [port, cb, ...args]);
    }
}
exports = module.exports = App;