import { h, Component } from 'preact';
import {Link,IndexLink,browserHistory} from 'react-router';
import api from './../api'
import cookie from 'react-cookies';
import {Menu} from './menu'
import {FullScreenLoader} from './loader'
import {Password} from './ui/password'
var that;

class Dashboard extends Component {

  constructor() {
    super()
    that = this
    this.state = {
      modal_email: "",
      email: "",
      password: "",
      errors: [],
      show_msg: false,
      patients: [],
      doctors: [],
      loading: true,
      active: "Patients",
      small_loader: false
    }
  }

  componentDidMount(){
    this.update_pass = this.update_pass.bind(this)
    api.checkSession((valid) => {
      console.log('valid',valid)
      if(valid) {
          if(api.currentUser.type == 0){
              api.api.custom('users/all/1')
              .get('')
              .then((response)=>{
                console.log('response',response.body().data(),response.body().data().data.user)
                this.setState({
                  patients: response.body().data().data.user,
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

  update_pass(i){
    if(this.state.active == "Patients"){
      console.log('username',this.state.patients[i].username)
      this.setState({modal_email: this.state.patients[i].username})
    }
    else{
      console.log('username',this.state.doctors[i].username)
      this.setState({modal_email: this.state.doctors[i].username})
    }
    $('#pwdModal').modal('show')
  }

  update_user(i){
    $('#' + i + "update").html("Updating...")
    $('#' + i + "update").prop("disabled", true)
    var update;
    if(this.state.active == "Patients"){
      update = {
        email : this.state.patients[i].username,
        type : "Doctor"
      }
    }
    else{
      update = {
        email : this.state.doctors[i].username,
        type : "Patient"
      } 
    }
    api.api.custom('users/modify')
    .put(update)
    .then((response)=>{
      this.setState({show_msg : false})
      $('#' + i + "update").html("Change Type")
      $('#' + i + "update").prop("disabled", false)
      var arr = (this.state.active == "Patients" ? this.state.patients : this.state.doctors)
      arr.splice(i,1)
      if(this.state.active == "Patients"){
        this.setState({patients: arr})
      }
      else{
        this.setState({doctors: arr})
      }
    })
    .catch((err)=>{
      $('#' + i + "update").html("Change Type")
      $('#' + i + "update").prop("disabled", false)
      console.log('err',err)
      var error = [{ msg: err.response.data.userMessage }]
      this.setState({errors: error})
      this.setState({show_msg : true})
    })
  }

  delete_user(i){
    $('#' + i).html("Deleting...")
    $('#' + i).prop("disabled", true)
    var del;
    if(this.state.active == "Patients"){
      del = {
        "id": this.state.patients[i]._id
      }
    }
    else{
      del = {
        "id": this.state.doctors[i]._id
      } 
    }
    api.api.custom('users/modify').delete(del)
    .then((response)=>{
      this.setState({show_msg : false})
      $('#' + i).html("Delete")
      $('#' + i).prop("disabled", false)
      var arr = (this.state.active == "Patients" ? this.state.patients : this.state.doctors)
      arr.splice(i,1)
      if(this.state.active == "Patients"){
        this.setState({patients: arr})
      }
      else{
        this.setState({doctors: arr})
      }
    })
    .catch((err)=>{
      $('#' + i).html("Delete")
      $('#' + i).prop("disabled", false)
      console.log('err',err)
      var error = [{ msg: err.response.data.userMessage }]
      this.setState({errors: error})
      this.setState({show_msg : true})
    })
  }

  load_doctors(){
    this.setState({active : "Doctors",small_loader: true})
    api.api.custom('users/all/2')
    .get('')
    .then((response)=>{
      console.log('response',response.body().data(),response.body().data().data.user)
      this.setState({
        doctors: response.body().data().data.user,
        small_loader: false
      })
    })
    .catch((err)=>{
        console.log('err',err)
    })
  }

  load_patients(){
    this.setState({active : "Patients"})
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
            <div class="col-2">
              <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                <a class={this.state.active == "Patients" ? "nav-link active" : "nav-link"} onclick={this.load_patients.bind(this)}>Patients</a>
                <a class={this.state.active == "Doctors" ? "nav-link active" : "nav-link"} onclick={this.load_doctors.bind(this)}>Doctor</a>
              </div>
            </div>
            {
              this.state.small_loader ? 
                <div class="col-10">
                  <div style="margin:0 auto;">
                    <h1 class="title is-1" style="padding-top: 25%;text-align: center;">Loading your contents...</h1>
                  </div>
                </div>
                :
                <div class="col-10">
                  {
                    this.state.active == "Patients" ?
                      <div class="tab-content" id="v-pills-tabContent">
                        <div class="tab-pane fade show active" id="v-pills-Patients" role="tabpanel" aria-labelledby="v-pills-Patients-tab">
                          <table class="table">
                            <thead>
                              <tr>
                                <th scope="col">#</th>
                                <th scope="col">Patient's Email</th>
                                <th scope="col">Change Password</th>
                                <th scope="col">Change Type</th>
                                <th scope="col"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                this.state.patients.map((patient,i)=>{
                                  return <tr>
                                    <th scope="row">{i+1}</th>
                                    <td>{patient.username}</td>
                                    <td><button type="button" class="btn btn-primary" onclick={function(){that.update_pass(i)}} id={i + "pass"}>Change Password</button></td>
                                    <td><button type="button" class="btn btn-primary" onclick={function(){that.update_user(i)}} id={i + "update"}>Change Type</button></td>
                                    <td><button type="button" class="btn btn-primary" onclick={function(){that.delete_user(i)}} id={i}>Delete</button></td>
                                  </tr>
                                })
                              }
                            </tbody>
                          </table>
                          {this.state.patients.length == 0 ? <p>No patients found....</p> : ""}
                        </div>
                      </div>
                      :
                      <div class="tab-content" id="v-pills-tabContent">
                        <div class="tab-pane fade show active" id="v-pills-Patients" role="tabpanel" aria-labelledby="v-pills-Patients-tab">
                          <table class="table">
                            <thead>
                              <tr>
                                <th scope="col">#</th>
                                <th scope="col">Doctor's Email</th>
                                <th scope="col">Change Password</th>
                                <th scope="col">Change Type</th>
                                <th scope="col"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                this.state.doctors.map((patient,i)=>{
                                  return <tr>
                                    <th scope="row">{i+1}</th>
                                    <td>{patient.username}</td>
                                    <td><button type="button" class="btn btn-primary" onclick={function(){that.update_pass(i)}} id={i + "pass"}>Change Password</button></td>
                                    <td><button type="button" class="btn btn-primary" onclick={function(){that.update_user(i)}} id={i + "update"}>Change Type</button></td>
                                    <td><button type="button" class="btn btn-primary" onclick={function(){that.delete_user(i)}} id={i}>Delete</button></td>
                                  </tr>
                                })
                              }
                            </tbody>
                          </table>
                          {this.state.doctors.length == 0 ? <p>No doctors found....</p> : ""}
                        </div>
                      </div>
                    }
                </div>
            }
            <Password email={this.state.modal_email}/>
          </div>
        </div>
      );
    }
  }
}

module.exports = Dashboard
