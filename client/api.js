//have been implemented in vendor.js as seperate module
import 'whatwg-fetch';
import restful, { fetchBackend } from 'restful.js';
import cookie_react from 'react-cookies';
const api = restful(API, fetchBackend(fetch));

var all = {
	api:api,
}

all.loggedIn = false;

all.checkSession = (cb) => {
    var cookie = cookie_react.load('sowil_session')
    console.log('cookie',cookie)
    if (!cookie)
        return cb(false);

    all.api.header('Authorization','Bearer ' + cookie)
    let user = api.custom('ping');
    user.get().then((response) => {
        let body = response.body(false);
        all.currentUser = body.data.user;
        let loggedIn = body.error ? false : true;
        all.loggedIn = loggedIn;
        console.log('href',window.location.pathname,all.currentUser)
        // if(all.currentUser.user_type == 2 || all.currentUser.user_type == 1){
        //     console.log('here')
        //     if(all.currentUser.companyId == ""){
        //         console.log('here1')
        //         if(window.location.pathname != '/user/type'){
        //             console.log('here2')
        //             browserHistory.push('/user/type')
        //         }
        //     }
        // }
        // console.log('all',all)
        return cb(loggedIn);

    }, (response) => {
        //some error occured
        return cb(false)
    })
}

all.User = api.all('users');// call to users
api.addErrorInterceptor((error, config) => {
    const { message, response,status=response.statusCode } = error;
    // all args had been modified
    return {
        status,
        message,
        response,
    };
});
module.exports = all
