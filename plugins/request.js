import PACKAGE from '@/package.json';
import axios from 'axios';
const isServer = process.server;
const baseUrl = isServer ? PACKAGE.serverApiBaseUrl : '/api';
const service = axios.create({
    baseURL: baseUrl, // api的base_url
    timeout: 120000 // 请求超时时间
});
export default service;
