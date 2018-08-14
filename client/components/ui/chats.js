import { h, Component } from 'preact';
import api from '../../api'
import cookie_react from 'react-cookies';

export class Chat extends Component {
    
  constructor(props) {
    super(props);
    console.log('props',props)
    this.state = {
      email : "",
      message: ""
    }
    this.ErrorList = this.ErrorList.bind(this)
  }

  componentWillUpdate(props) {
    console.log('componentWillUpdate',props)
  }

  componentDidMount() {
    console.log('mounting')
    $('#pwdModal').on('hidden.bs.modal', function (e) {
      that.setState({
        email : "",
        message: ""
      })
    })
  }

  inputChange(event){
    var input = event.target
    this.setState({[input.name] : event.target.value})
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

  send_msg(){
    var data = {
      token : cookie_react.load('sowil_session'),
      _id : api.currentUser._id,
      new_message : true,
      recipient : this.state.email,
      composedMessage : this.state.message,
      username : api.currentUser.username
    }
    api.socket.emit('message',data)
  }

  render(props) {
    return (
      <div class="modal fade" id="msgModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                  <div class="content" style="padding:4%;">
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                      <h4>New Chat</h4>
                      <hr/>
                      <form id="msg_modal">
                        <div class="form-group">
                          <label>Email</label> 
                          <input type="text" class="form-control box-shadow" name="email" onChange={this.inputChange.bind(this)} value={this.state.email}/>
                        </div>
                        <div class="form-group">
                          <label>Message</label> 
                          <textarea class="form-control" name="message" onChange={this.inputChange.bind(this)} value={this.state.message}/>
                        </div>
                        <div class="ui error message">
                          { this.ErrorList(this.state.errors) }
                        </div>
                        <button type="button" class="btn btn-lg btn-primary" style="padding: 2%;margin-top: 4%;" id="send_msg" onclick={this.send_msg.bind(this)}>Send Message</button>
                      </form>
                  </div>
              </div>
          </div>
      </div>
    );
  }
}