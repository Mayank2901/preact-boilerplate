//have been implemented in vendor.js as seperate module
import 'whatwg-fetch';
import restful, { fetchBackend } from 'restful.js';
import cookie_react from 'react-cookies';
import io from 'socket.io-client';
const api = restful(API, fetchBackend(fetch));

var all = {
	api:api,
}

all.loggedIn = false;
var connectionOptions =  {
    "force new connection" : true,
    "reconnection": true,
    "reconnectionDelay": 2000,                  //starts with 2 secs delay, then 4, 6, 8, until 60 where it stays forever until it reconnects
    "reconnectionDelayMax" : 60000,             //1 minute maximum delay between connections
    "reconnectionAttempts": "Infinity",         //to prevent dead clients, having the user to having to manually reconnect after a server restart.
    "timeout" : 10000,                           //before connect_error and connect_timeout are emitted.
    "transports" : ["websocket"],                //forces the transport to be only websocket. Server needs to be setup as well/
    "upgrade": false
}
all.socket = io('http://localhost:8080', connectionOptions);

all.socket.on('connect', function(){
	console.log('connected')
});

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
