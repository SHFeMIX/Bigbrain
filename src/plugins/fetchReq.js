export default function(app, options) {
    app.config.globalProperties.$fetchReq = async (url, method, body, token) => {
        console.log('\n')
        console.log('******************************')
        console.log('*                            *')
        console.log(options.port)
        console.log(url, method, body, token)
        
        const response = await fetch(`http://localhost:${options.port}/` + url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            },
            body: body ? JSON.stringify(body) : null
        })
        const data = await response.json()
        console.log(data)
        
        console.log('*                            *')
        console.log('******************************')
        console.log('\n')
        return data;
    }
}
