//have been implemented in vendor.js as seperate module
import 'whatwg-fetch';
import restful, { fetchBackend } from 'restful.js';
var cookie_monster = require('cookie-monster');
const api = restful(API, fetchBackend(fetch));

var all = {
	api:api,
}

// api.header('Authorization','Bearer ' + cookie_monster.get("trivia_session"))

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
