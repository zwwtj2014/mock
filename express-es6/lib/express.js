/*
 * @Author: clam
 * @Date: 2017-11-12 00:20:43
 * @Last Modified by: clam
 * @Last Modified time: 2017-11-18 01:03:09
 */
const App = require('./application');
const Router = require('./router');

function Express() {
    Express['Router'] = () => {
        return new Router();
    }
    return new App();
}



// class Express {
//     constructor() {
//         return new App();
//     }

//     router() {
//         return new Router();
//     }
// }
// function createApplication() {
//     return new App();
// }

// createApplication.Router = Router;

exports = module.exports = Express;



/**
 *  ----- -----------        -------------
    |     | Layer     | ----> | Layer     |
    |  0  |   |-path  |       |  |- method|   route
    |     |   |-route |       |  |- handle|
    |-----|-----------|       -------------
    |     | Layer     |       -------------
    |  1  |   |-path  | ----> | Layer     |
    |     |   |-route |       |  |- method|   route
    |-----|-----------|       |  |- handle|
    |     | Layer     |       -------------
    |  2  |   |-path  |       -------------
    |     |   |-route | ----> | Layer     |
    |-----|-----------|       |  |- method|   route
    | ... |   ...     |       |  |- handle|
    ----- -----------        -------------
        router


    目前(第三次迭代完):

    一个App 对应一个 Router

    ===> Router会根据path创建Layer(主要包含path和Route), 存储在Router的stack属性中,
    Router中的next函数会根据请求遍历stack匹配相应的处理, 然后通过Route的dispatch方法分发下去

    ===> 目前一个Route会对应一个新的Layer实例(主要包含method和handle), 存储在Route的stack属性中
    Route中的next函数会根据Router中的匹配到的Route去进行匹配(主要是method), 匹配到之后, 动态调用handle

 *
 */