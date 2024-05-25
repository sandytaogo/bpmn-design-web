
import axios from 'axios'

const RemoteService = axios.create({
    baseURL: '',
    // 超时时间
    timeout: 5000,
    headers: { "X-Custom-Header": "foobar" , 'Content-Type':'application/x-www-form-urlencoded'}
})
//3.添加请求拦截器
RemoteService.interceptors.request.use((config) => {
        // 在发送请求之前做些什么.
        config.headers.Authorization = localStorage.getItem("cms-token");
        return config;
    },
    (error) => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
)
// 4.添加响应拦截器
RemoteService.interceptors.response.use((response) => {
        // 2xx 范围内的状态码都会触发该函数。
        // 手动清除 Toast
        return response.data;
    },
    (error) => {
        // 超出 2xx 范围的状态码都会触发该函数。
        // 对响应错误做点什么
        return Promise.reject(error);
    }
)

export default RemoteService