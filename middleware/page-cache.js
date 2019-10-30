import _ from 'lodash';
import cookieParse from 'cookie-parse';
const LRU = require('lru-cache');
// 判断是否已经登录的cookie的key，根据情况，如果需要后台校验，需要增加响应的逻辑
const TOKEN_KEY = '_user_token';

// 需要过滤掉掉的url前缀，比如api接口
const filterUrlPrefix = [
    '/api'
];
let cacheStore = new LRU({
    max: 100, // 设置最大的缓存个数
    maxAge: 60 * 1000 // 缓存时间，单位ms
});
const queues = Object.create(null);
const CACHE_KEY_ANONYMOUS = 'CACHE_KEY_ANONYMOUS';
const CACHE_KEY_REGISTERED = 'CACHE_KEY_REGISTERED';
function drainQueue(key) {
    let subscriber = null;
    while (queues[key] && queues[key].length > 0) {
        subscriber = queues[key].shift();
        process.nextTick(subscriber);
    }
    delete queues[key];
}
function cacheExecutor(req, res, next, cacheKey) {
    const value = cacheStore.get(cacheKey);
    if (value) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.end(value.body);
    }
    res.originalEnd = res.end;
    if (!queues[cacheKey]) {
        queues[cacheKey] = [];
    }
    function rawEnd(data) {
        if (res.statusCode === 200) {
            cacheStore.set(cacheKey, { body: data });
        }
        drainQueue(cacheKey);
        res.originalEnd(data);
    }
    if (queues[cacheKey].length === 0) {
        res.end = function(data) {
            rawEnd(data);
        };
        next();
    } else {
        queues[cacheKey].push(function() {
            const value = cacheStore.get(cacheKey) || {};
            res.end(value.body);
        });
    }
}
export default function(req, res, next) {
    const { url, headers } = req;
    const willFilter = filterUrlPrefix.filter(prefix => url.indexOf(prefix) >= 0);
    // 接口请求不拦截
    if (willFilter.length > 0) {
        return next();
    }
    // 针对debug时候的热更新
    if (headers.accept === 'text/event-stream') {
        return next();
    }
    const headersCookie = _.get(req.headers, 'cookie');
    let cookie;
    if (headersCookie) {
        cookie = cookieParse.parse(headersCookie);
        cookie = _.get(cookie, TOKEN_KEY);
    }
    // 已登录用户
    if (cookie) {
        return cacheExecutor(req, res, next, CACHE_KEY_REGISTERED);
    }
    return cacheExecutor(req, res, next, CACHE_KEY_ANONYMOUS);
}
