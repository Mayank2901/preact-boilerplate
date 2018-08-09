import { h, render } from 'preact';
import { Router, browserHistory } from 'react-router'
require('jquery-form-validator')
require('modal')
const rootRoute = {
  childRoutes: [ 
    {
      path: '/',
      component: require('./components/Home'),
    },
    {
      path: '/dashboard',
      component: require('./components/dashboard'),
    },
    {
      path: '/addusers',
      component: require('./components/add_users'),
    },
    {
      path: '/chats',
      component: require('./components/chats'),
    },
  ]
  
}

render((
  <div class="wrapper">
    <Router
      history={browserHistory}
      routes={rootRoute}
    />
  </div>
), document.body)

require('preact/devtools');