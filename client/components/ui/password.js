import { h, Component } from 'preact';
import api from '../../api'
var that;
export class Password extends Component {
    
  constructor(props) {
    super(props);
    console.log('props',props)
    this.state = {
      password : "",
      props : props,
      success : false,
    }
    that = this
    this.ErrorList = this.ErrorList.bind(this)
    this.Success = this.Success.bind(this)
  }

  componentWillUpdate(props) {
    console.log('componentWillUpdate',props)
    this.setState({props: props})
  }

  componentDidMount() {
    console.log('mounting')
    $('#pwdModal').on('hidden.bs.modal', function (e) {
      that.setState({
        password : ""
      })
    })
  }

  inputChange(event){
    var input = event.target
    this.setState({[input.name] : event.target.value})
  }

  Success(sucess){
    if(sucess){
      return <div class="alert alert-success" role="alert">
        Password Changed successfully.
      </div>
    }
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

  change_pass(props){
    if(this.state.password != "" ){
      $('#password').html("Updating...")
      $('#password').prop("disabled", true)
      api.api.custom('users/modify')
      .put({
        email : this.state.props.email,
        password : this.state.password
      })
      .then((response)=>{
        this.setState({show_msg : false,success: true})
        $('#password').html("Password")
        $('#password').prop("disabled", false)
      })
      .catch((err)=>{
        $('#password').html("Password")
        $('#password').prop("disabled", false)
        console.log('err',err)
        var error = [{ msg: err.response.data.userMessage }]
        this.setState({errors: error})
        this.setState({show_msg : true})
      })
    }
  }

  render(props) {
    return (
      <div class="modal fade" id="pwdModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                  <div class="content" style="padding:4%;">
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                      <h4>Change Password</h4>
                      <hr/>
                      <form id="pwd">
                        <div class="form-group">
                          <label>New Password</label> 
                          <input type="password" class="form-control box-shadow field_grey" name="password" placeholder="Password" onChange={this.inputChange.bind(this)} value={this.state.password}/>
                        </div>
                        <div class="ui error message">
                          { this.ErrorList(this.state.errors) }
                        </div>
                        {this.Success(this.state.sucess)}
                        <button type="button" class="btn btn-lg btn-primary" style="padding: 2%;margin-top: 4%;" id="password" onclick={this.change_pass.bind(this)}>Change Password</button>
                      </form>
                  </div>
              </div>
          </div>
      </div>
    );
  }
}