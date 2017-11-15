/*
 * @Author: clam
 * @Date: 2017-11-12 00:20:57
 * @Last Modified by: clam
 * @Last Modified time: 2017-11-16 00:10:02
 */

/**
 * Layer: 将路径一样的路由整合成一组，提高匹配路由的效率
 * @example
 *
 * //=> GET books/1 PUT books/1 DELETE books/1
 *
 * 每隔Layer含有三个变量: path/handle/route
 * -------------------------------------------------
 * |     0     |     1     |     2     |     3     |
 * ------------------------------------------------
 * | Layer     | Layer     | Layer     | Layer     |
 * |  |- path  |  |- path  |  |- path  |  |- path  |
 * |  |- handle|  |- handle|  |- handle|  |- handle|
 * |  |- route |  |- route |  |- route |  |- route |
 * -------------------------------------------------
 */

class Layer {

    constructor(path, fn) {
        this._path = path;
        this._name = fn.name || '<anonymous>';
        this._handle = fn;
    }

    handleReq(req, res, next) {
        let fn = this._handle;
        try {
            fn(req, res, next);
        } catch (err) {
            next(err);
        }
    }

    /**
     * 匹配路由
     */
    match(path) {
        return path === this._path || this._path === '*';
    }

    handleError(error, req, res, next) {
        let fn = this.handle;

        //如果函数参数不是标准的4个参数，返回错误信息
        if (fn.length !== 4) {
            return next(error);
        }

        try {
            fn(error, req, res, next);
        } catch (err) {
            next(err);
        }
    }
}

exports = module.exports = Layer;