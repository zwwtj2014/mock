const http = require('http');
const Layer = require('./layer');

class Route {
    constructor(path) {
        this.path = path;
        this.stack = [];
        this.methods = {};

        /** 生成GET/PUT/POST/DELETE/... 方法 */
        http.METHODS.forEach(method => {
            method = method.toLowerCase();
            Route.prototype[method] = (fn) => {
                let layer = new Layer('/', fn);
                layer.method = method;
                this.methods[method] = true;
                this.stack.push(layer);

                return this;
            };
        });
    }

    handlesMethod(method) {
        let name = method.toLowerCase();
        return Boolean(this.methods[name]);
    }

    dispatch(req, res, done) {
        let method = req.method.toLowerCase();
        let idx = 0;

        let next = (err) => {
            // 跳过route
            if (err && err === 'route') {
                return done();
            }

            // 跳过整个路由系统
            if (err && err === 'router') {
                return done(err);
            }

            // 越界
            if (idx >= this.stack.length) {
                return done(err);
            }

            // 不相等则枚举下一个
            let layer = this.stack[idx++];
            if (method !== layer.method) {
                return next(err);
            }

            if (err) {
                layer.handleError(err, req, res, next);
            } else {
                layer.handleReq(req, res, next);
            }
        };

        next();

    }
}

exports = module.exports = Route;