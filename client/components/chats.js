import { h, Component } from 'preact';
import {Link,IndexLink,browserHistory} from 'react-router';
import api from './../api'
import cookie from 'react-cookies';
import {Menu} from './menu'
import {FullScreenLoader} from './loader'
import {Chat} from './ui/chats'
var that;

class Chats extends Component {

  constructor() {
    super()
    that = this
    this.state = {
      chats: [],
      active_chat: -1,
      loading: true,
      small_loader: false,
      message: "",
    }
  }

  componentDidMount(){
    this.load_chat = this.load_chat.bind(this)
    api.socket.on('msg_success', function(data){
      console.log('msg_success',data)
      var chat = that.state.chats
      console.log('chat',chat)
      chat[that.state.active_chat].chats.unshift(data.data);
      that.setState({
        chats : chat
      })
    });
    api.checkSession((valid) => {
      console.log('valid',valid)
      if(valid) {
          if(api.currentUser.type == 0){
              api.api.custom('chats')
              .get('')
              .then((response)=>{
                console.log('response',response.body().data())
                this.setState({
                  chats : response.body().data().data.conversations,
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

  open_msg_modal(){
    $('#msgModal').modal('show')
  }

  load_chat(i){
    console.log('i',i,this.state.chats[i].conversation._id)
    api.api.custom('chat/' + this.state.chats[i].conversation._id)
    .get('')
    .then((response)=>{
      console.log('response',response.body().data())
      var chat = this.state.chats
      console.log('chat',chat)
      chat[i].chats = response.body().data().data.conversations;
      this.setState({
        chats : chat,
        active_chat: i,
      })
    })
    .catch((err)=>{
        console.log('err',err)
    })
  }

  inputChange(event){
    var input = event.target
    this.setState({[input.name] : event.target.value})
  }

  send_msg(){
    var data = {
      token : cookie.load('sowil_session'),
      composedMessage : this.state.message,
      conversationId : this.state.chats[this.state.active_chat].conversation._id,
    }
    api.socket.emit('message',data)
  }

  render(){
    if(this.state.loading){
      return <FullScreenLoader/>
    }
    else{
      return (
        <div class="container-fluid" style="padding: 0% 0%;">
          <Menu active="chats"/>
          <div class="row" style="margin-top: 2%;margin-left: 1%;margin-right:2%;">
            <div class="col-12" style="padding-left: 0%;">
              <h2>Chats <button type="button" class="btn btn-primary" style="float:right;" onclick={this.open_msg_modal.bind(this)}>New Chat</button></h2>
              <hr/>
            </div>
            <div class="col-3" style="border: 1px solid #dee2e6;">
              <table class="table table-borderless">
                {
                  this.state.chats.map((chat,i)=>{
                    if(i==0){
                      return <a onclick={()=>{this.load_chat(i)}}><tbody>
                        <tr>
                          <td style="border-top: 0px">{chat.conversation.participants[0]._id==api.currentUser._id ? chat.conversation.participants[1].username : chat.conversation.participants[0].username}</td>
                        </tr>
                        <tr>
                          <td style="border-top: 0px">{chat.body}</td>
                        </tr>
                      </tbody></a>
                    }
                    else{
                      return <a onclick={()=>{this.load_chat(i)}}><tbody>
                        <tr>
                          <td>{chat.conversation.participants[0]._id==api.currentUser._id ? chat.conversation.participants[1].username : chat.conversation.participants[0].username}</td>
                        </tr>
                        <tr>
                          <td style="border-top: 0px">{chat.body}</td>
                        </tr>
                      </tbody></a>
                    }
                  })
                }
              </table>
            </div>
            <div class="col-9">
              {
                this.state.active_chat >=0 ?
                  <div>
                    <h3>{this.state.chats[this.state.active_chat].conversation.participants[0]._id==api.currentUser._id ? this.state.chats[this.state.active_chat].conversation.participants[1].username : this.state.chats[this.state.active_chat].conversation.participants[0].username}</h3> 
                    <div style="height:600px;overflow:scroll;">
                    {
                      this.state.chats[this.state.active_chat].chats.slice(0).reverse().map((chat)=>{
                        return(
                          <div>
                            <p style="font-weight: bold;">{chat.author==this.state.chats[this.state.active_chat].conversation.participants[1]._id ? this.state.chats[this.state.active_chat].conversation.participants[1].username : this.state.chats[this.state.active_chat].conversation.participants[0].username}</p>
                            <p>{chat.body}</p>
                          </div>
                        )
                      })
                    }
                    </div>
                    <div style="height:110px;width:100%;">
                      <textarea class="form-control" name="message" onChange={this.inputChange.bind(this)} value={this.state.message}></textarea>
                      <button type="button" class="btn btn-primary" style="float:right;margin-top:1%;" onclick={this.send_msg.bind(this)}>Send</button>
                    </div>
                  </div>
                :
                  ""
              }
            </div>
          </div>
          <Chat/>
        </div>
      );
    }
  }
}

module.exports = Chats