/*
 * @Author: clam
 * @Date: 2017-11-12 00:20:39
 * @Last Modified by: clam
 * @Last Modified time: 2017-11-18 00:23:57
 */
'use strict'
const http = require('http');
const Router = require('./router');

class App {

    constructor() {
        this._router = new Router();

        http.METHODS.forEach(method => {
            method = method.toLowerCase();
            App.prototype[method] = (path, fn, ...args) => {
                this._router[method].call(this._router, path, fn, ...args);
                return this;
            };
        });
    }

    use(fn, ...args) {
        let path = '/';

        /**
         * 因为Application.use支持可选路径，所以需要增加处理路径的重载代码
         *
         * 路径挂载
         */
        if (typeof fn !== 'function') {
            path = fn;
            fn = args[0];
        }
        this._router.use(path, fn);
        return this;
    }

    listen(port, cb, ...args) {
        const server = http.createServer((req, res) => {
            this.handle(req, res);
        });

        /**
         * return server.listen(port, cb);
         *
         * 使用下面这种方式主要是因为能够重载server.listen的多种参数
         * 下面的方式是使用Proxy的方式将方法转嫁到node的原生listen方法
         */
        return server.listen.apply(server, [port, cb, ...args]);
    }

    handle(req, res) {
        if (!res.send) {
            res.send = (body) => {
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end(body);
            };
        }
        let done = (err) => {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            if (err) {
                res.end(`404: ${err}`);
            } else {
                var msg = `Cannot ${req.method} ${req.url}`;
                res.end(msg);
            }
        };
        return this._router.handle(req, res, done);
    }
}
exports = module.exports = App;