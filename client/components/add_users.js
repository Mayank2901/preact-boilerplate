import { h, Component } from 'preact';
import {Link,IndexLink,browserHistory} from 'react-router';
import api from './../api'
import {FullScreenLoader} from './loader'
import {Menu} from './menu'
var that;

class AddUser extends Component {

  constructor() {
    super()
    that = this
    this.state = {
      email: "",
      password: "",
      type: "Patient",
      errors: [],
      show_msg: false,
      loading: true,
      success: false
    }
  }

  componentDidMount(){
    console.log('test')
    api.checkSession((valid) => {
      console.log('valid',valid,api.currentUser)
      if(valid) {
          if(api.currentUser.type == 0){
              this.setState({
                loading: false,
              })
          }
          else{
              browserHistory.push("/")
          }
      }
      else{
          browserHistory.push("/")
      }
    })
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

  componentWillMount(){
    this.Success = this.Success.bind(this)
    this.add_user = this.add_user.bind(this)
  }

  componentDidUpdate(){
    $.validate({
      form: "#add_user",
      onSuccess : that.add_user
    });
  }

  inputChange(event){
    var input = event.target
    this.setState({[input.name] : event.target.value})
  }

  Success(success){
    if(success){
      return <div class="alert alert-success" role="alert">
        User successfully added.
      </div>
    }
  }

  add_user(){
    $('#login_btn').html("Loading...")
    $('#login_btn').prop("disabled", true)
    api.api.custom('users/modify').post({
      "email": this.state.email,
      "password": this.state.password,
      "type": this.state.type
    })
    .then((response)=>{
      this.setState({show_msg : false,success: true})
      $('#login_btn').html("Login")
      $('#login_btn').prop("disabled", false)
      //api.currentUser = response.body().data().data.user
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

  select_type(e){
    this.setState({type: e.target.value})
  }

  render(){
    if(this.state.loading){
      return <FullScreenLoader/>
    }
    else{
      return (
        <div class="container-fluid" style="padding: 0% 0%;">
          <Menu active="users"/>
          <div class="row align-items-center" style="margin-top: 8%;">
            <div class="col">
            </div>
            <div class="col">
              <h3 class="title is-3">Add User</h3>
              <form id="add_user">
                <div class="form-group">
                  <label>Email address</label>
                  <input type="text" class="form-control" id="email" onChange={this.inputChange.bind(this)} name="email" aria-describedby="emailHelp" placeholder="Enter email"/>
                </div>
                <div class="form-group">
                  <label>Password</label>
                  <input type="password" class="form-control" name="password" onChange={this.inputChange.bind(this)} id="password" placeholder="Password"/>
                </div>
                <div class="form-group">
                  <label>Select User Type</label>
                  <select class="form-control" onchange={this.select_type.bind(this)}>
                    <option value="Patient">Patient</option>
                    <option value="Doctor">Doctor</option>
                  </select>
                </div>
                {this.ErrorList(this.state.errors) }
                {this.Success(this.state.success)}
                <button type="submit" class="btn btn-primary" id="login_btn" style="width:100%;">Add User</button>
              </form>
            </div>
            <div class="col">
            </div>
          </div>
        </div>
      );
    }
  }
}

module.exports = AddUser
