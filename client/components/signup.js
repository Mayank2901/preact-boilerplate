import { h, Component } from 'preact';
import {Link,IndexLink,browserHistory} from 'react-router';
import all from './../api'

var cookie_monster = require('cookie-monster');
var that;
// function validateEmail(email) {
//   var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   return re.test(email);
// }

class Signup extends Component {

  constructor() {
    super()
    
  }

    render(){
          return (
            <div class="container">
              <div class="row align-items-center" style="margin-top: 15%;">
                <div class="col">
                </div>
                <div class="col">
                  <h3 class="title is-3">SignUp</h3>
                  <form>
                    <div class="form-group">
                      <label for="exampleInputEmail1">Email address</label>
                      <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
                    </div>
                    <div class="form-group">
                      <label for="exampleInputPassword1">Password</label>
                      <input type="password" class="form-control" name="password" id="password" placeholder="Password"/>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width:100%;">Submit</button>
                  </form>
                </div>
                <div class="col">
                </div>
              </div>
            </div>
          );
    }
}

module.exports = Signup
