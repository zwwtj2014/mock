/*
 * @Author: clam
 * @Date: 2017-11-12 00:20:18
 * @Last Modified by: clam
 * @Last Modified time: 2017-11-18 00:01:09
 */
'use strict'
const Layer = require('./layer');
const Route = require('./route');
const http = require('http');

class Router {

    constructor() {
        // let commonLayer = new Layer('*', (req, res) => {
        //     res.writeHead(200, {
        //         'Content-Type': 'text/plain'
        //     });
        //     res.end('404');
        // });
        this.stack = [];

        http.METHODS.forEach(method => {
            method = method.toLowerCase();
            Router.prototype[method] = (path, fn) => {
                let route = this.route(path);
                route[method].call(route, fn);
                return this;
            };
        });
    }

    handle(req, res, done) {
        let method = req.method;
        let idx = 0;

        /**
         * 这里的next函数起到遍历router里的stack的作用
         * => 即找同一个Route匹配的path的情况
         */
        let next = (err) => {
            let layerError = (err === 'route' ? null : err);

            // 跳过路由系统
            if (layerError === 'router') {
                return done(null);
            }

            if (idx >= this.stack.length || layerError) {
                return done(layerError);
            }

            let layer = this.stack[idx++];
            if (layer.match(req.url) && layer.route && layer.route.handlesMethod(method)) {
                return layer.handleReq(req, res, next);
            } else {
                next(layerError);
            }
        };

        next();

        // this.stack.forEach(router => {
        //     if (router.match(req.url) && router.route && router.route.handlesMethod(method)) {
        //         return router.handleReq(req, res);
        //     }
        // });
        // return this.stack[0].handleReq(res, res);
    }

    route(path) {
        let route = new Route(path);
        let layer = new Layer(path, route.dispatch.bind(route)); // router里的layer
        layer.route = route;
        this.stack.push(layer);
        return route;
    }
}

exports = module.exports = Router;