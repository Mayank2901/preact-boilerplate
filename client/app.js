import { h, render } from 'preact';
import { Router, browserHistory } from 'react-router'
const rootRoute = {
  childRoutes: [ 
    {
      path: '/',
      component: require('./components/Home'),
      // childRoutes: [
      //     require('./routes/NewEvent'),
      // ]
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