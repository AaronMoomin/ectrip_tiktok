// const api = 'http://192.168.4.146:8888'
// const api = 'http://192.168.4.19:8888'
const api = 'https://dyxcxtest.ectrip.com'
function myRequest(url, data = {}, method = 'GET',
                   content= "application/json") {
    // new Promise 初始化Promise实例的状态为pending
    return new Promise((resolve, reject) => {
        tt.request({
            url: api + url,
            data,
            method,
            header:{
                "content-type": content,
            },
            success: (res) => {
                // console.log('请求成功', res);
                resolve(res)//resolve修改promise的状态为成功状态resolved
            },
            fail: (err) => {
                console.log('请求失败', err);
                reject(err);// reject修改promise的状态为失败状态rejected
            }
        })
    })
}
module.exports = {
    myRequest
}