import { h, Component } from 'preact';
import {Link,IndexLink,browserHistory} from 'react-router';
import all from './../api'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

var cookie_monster = require('cookie-monster');
var that;
// function validateEmail(email) {
//   var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   return re.test(email);
// }

class Home extends Component {

  constructor() {
    super()
    this.state.crop = {
      x: 20,
      y: 10,
      width: 30,
      height: 10
    }
  }

    render(){
          return (
            <div>
              <h1 class="title is-1">Home</h1>
              <p>This is the Home component.</p>
            </div>
          );
    }
}

module.exports = Home
