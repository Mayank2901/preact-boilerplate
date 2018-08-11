import { h, Component } from 'preact';
import {Link,IndexLink,browserHistory} from 'react-router';
import api from './../api'
import cookie from 'react-cookies';
var that;

class Home extends Component {

  constructor() {
    super()
    that = this
    this.state = {
      email: "",
      password: "",
      errors: [],
      show_msg: false,
    }
  }

  componentDidMount(){
    this.login = this.login.bind(this)
    api.checkSession((valid) => {
      console.log('valid',valid)
      var user_type;
      if(valid) {
        if(api.currentUser.type == 0){
          browserHistory.push("/dashboard")
        }
        if(api.currentUser.type == 1 || api.currentUser.type == 2){
          browserHistory.push("/dashboard/user")
        }
      }
      else{
          browserHistory.push("/")
      }
    })
  }

  componentDidUpdate(){
    $.validate({
      form: "#login",
      onSuccess : that.login
    });
  }

  ErrorList(errors){
    return this.state.show_msg?(
      <div class="alert alert-danger" role="alert">
        {
          errors.map(function(error,i){
              return (<li> {error.msg} </li>);
          })
        }
      </div>
    ):null;
  }

  inputChange(event){
    var input = event.target
    this.setState({[input.name] : event.target.value})
  }

  login(){
    $('#login_btn').html("Loading...")
    $('#login_btn').prop("disabled", true)
    api.api.custom('users/session').post({
      "email": this.state.email,
      "password": this.state.password
    })
    .then((response)=>{
      console.log('response',response.body().data().data)
      this.setState({show_msg : false})
      $('#login_btn').html("Login")
      $('#login_btn').prop("disabled", false)
      document.cookie = 'sowil_session=;expires=Thu, 01 Jan 1970 00:00:01 GMT;'
      document.cookie = "sowil_session=" + response.body().data().data.token
      api.api.header('Authorization','Bearer ' + cookie.load("sowil_session"))
      if(response.body().data().data.user.type == 0){
        browserHistory.push('/dashboard')
      }
      if(response.body().data().data.user.type == 1 || response.body().data().data.user.type == 2){
        browserHistory.push('/dashboard/user')
      }
    })
    .catch((err)=>{
      $('#login_btn').html("Login")
      $('#login_btn').prop("disabled", false)
      console.log('err',err)
      var error = [{ msg: err.response.data.userMessage }]
      this.setState({errors: error})
      this.setState({show_msg : true})
    })
    return false
  }

  render(){
    return (
      <div class="container">
        <div class="row align-items-center" style="margin-top: 15%;">
          <div class="col">
          </div>
          <div class="col">
            <h3 class="title is-3">Login</h3>
            <form id="login">
              <div class="form-group">
                <label>Email address</label>
                <input type="text" class="form-control" id="email" onChange={this.inputChange.bind(this)} name="email" aria-describedby="emailHelp" placeholder="Enter email"/>
              </div>
              <div class="form-group">
                <label>Password</label>
                <input type="password" class="form-control" name="password" onChange={this.inputChange.bind(this)} id="password" placeholder="Password"/>
              </div>
              { this.ErrorList(this.state.errors) }
              <button type="submit" class="btn btn-primary" id="login_btn" style="width:100%;">Login</button>
            </form>
          </div>
          <div class="col">
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Home
