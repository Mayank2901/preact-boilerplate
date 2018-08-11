import { h, Component } from 'preact';
import {Link,IndexLink,browserHistory} from 'react-router';
import api from './../api'
import cookie from 'react-cookies';
import {Menu} from './menu'
import {FullScreenLoader} from './loader'
var that;

class Users extends Component {

  constructor() {
    super()
    that = this
    this.state = {
      errors: [],
      show_msg: false,
      data: [],
      loading: true,
    }
  }

  componentDidMount(){
    api.checkSession((valid) => {
      console.log('valid',valid)
      var user_type;
      if(valid) {
          if(api.currentUser.type == 0){
            browserHistory.push("/dashboard")
          }
          else if(api.currentUser.type == 1){
            user_type = 2
          }
          else{
            user_type = 1
          }
          api.api.custom('users/type/' + user_type)
          .get('')
          .then((response)=>{
            console.log('response',response.body().data())
            this.setState({
              data: response.body().data().data.user,
              loading: false
            })
          })
          .catch((err)=>{
              console.log('err',err)
          })
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

  render(){
    if(this.state.loading){
      return <FullScreenLoader/>
    }
    else{
      return (
        <div class="container-fluid" style="padding: 0% 0%;">
          <Menu active="home"/>
          <div class="row" style="margin-top: 2%;margin-left: 1%;">
            <div class="col-12">
              {this.ErrorList(this.state.errors) }
            </div>
            <div class="col-12">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Patient's Email</th>
                    <th scope="col">Joined</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.data.map((user,i)=>{
                      return <tr>
                        <th scope="row">{i+1}</th>
                        <td>{user.username}</td>
                        <td>{user.created.substring(0,user.created.indexOf('T'))}</td>
                        </tr>
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }
  }
}

module.exports = Users
