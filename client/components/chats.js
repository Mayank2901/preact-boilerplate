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

  update_msgs(arr){
    api.api.custom('chats')
    .put({
      msgs : arr
    })
    .then((response)=>{
      console.log('response',response.body().data())
    })
    .catch((err)=>{
        console.log('err',err)
    })
  }

  componentDidMount(){
    this.load_chat = this.load_chat.bind(this)
    this.update_msgs = this.update_msgs.bind(this)
    api.socket.on('msg_recieved', function(data){
      console.log('msg_recieved',data,window.location.pathname,window.location.pathname == "/chats",that.state.chats.length,api.currentUser._id,data.data.recipient == api.currentUser._id,data.data.recipient)
      if(data.data.recipient == api.currentUser._id){
        console.log('new message')
        if(window.location.pathname == "/chats"){
          for(var i=0;i<that.state.chats.length;i++){
            console.log('i',data.data.conversationId,that.state.chats[i].conversationId)
            if(data.data.conversationId == that.state.chats[i].conversationId){
              var val = i
              var chat = that.state.chats
              console.log('chat',chat,that.state.active_chat,i)
              chat[i].body = data.data.body;
              that.setState({
                chats : chat
              })
              if(that.state.active_chat == i){
                chat[i].chats.unshift(data.data);
                setTimeout(()=>{
                  var objDiv = document.getElementById("msg");
                  objDiv.scrollTop = objDiv.scrollHeight;
                },500);
                setTimeout(function(){
                  console.log('timeout',val)
                  console.log('that',that.state.chats[val].chats.length)
                  var arr = [];
                  for(var j=0;j<that.state.chats[val].chats.length;j++){
                    console.log('read',that.state.chats[val].chats[j].read)
                    if(!that.state.chats[val].chats[j].read){
                      arr.push(that.state.chats[val].chats[j]._id)
                      that.state.chats[val].chats[j].read = true
                      console.log('chat',that.state.chats[val].chats[j])
                    }
                    if((j+1) == that.state.chats[val].chats.length){
                      that.forceUpdate()
                    }
                  }
                  that.update_msgs(arr)
                },10000);
              }
            }
          }
        }
      }
      else{
        var chat = that.state.chats
        console.log('chat',chat,data)
        for(var i=0;i<that.state.chats.length;i++){
          console.log('i',data.data.conversationId,that.state.chats[i].conversationId,data.data.conversationId == that.state.chats[i].conversationId)
          if(data.data.conversationId == that.state.chats[i].conversationId){
            //chat[that.state.active_chat].chats[i].read = true
            chat[i].body = data.data.body;
            if(chat[i].chats){
              chat[i].chats.unshift(data.data);
              setTimeout(()=>{
                var objDiv = document.getElementById("msg");
                objDiv.scrollTop = objDiv.scrollHeight;
              },500);
            }
            that.setState({
              chats : chat
            })
          }
        }
      }
      if(that.state.chats.length == 0){
        var chat = that.state.chats
        chat.push(data.data.message);
        that.setState({
          chats : chat
        })
      }
    });
    api.checkSession((valid) => {
      console.log('valid',valid)
      if(valid) {
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
      setTimeout(()=>{
        var arr = [];
        for(var j=0;j<that.state.chats[i].chats.length;j++){
          if(!that.state.chats[i].chats[j].read){
            arr.push(that.state.chats[i].chats[j]._id)
            that.state.chats[i].chats[j].read = true
          }
        }
        that.update_msgs(arr)
      },10000);
      this.setState({
        chats : chat,
        active_chat: i,
      })
      setTimeout(()=>{
        var objDiv = document.getElementById("msg");
        objDiv.scrollTop = objDiv.scrollHeight;
      },500);
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
      recipient : this.state.chats[this.state.active_chat].conversation.participants[0]._id==api.currentUser._id ? this.state.chats[this.state.active_chat].conversation.participants[1]._id : this.state.chats[this.state.active_chat].conversation.participants[0]._id,
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
            {
              this.state.chats.length == 0 ?
              <div class="col-3">
                <p>NO CHATS FOUND...</p>
              </div>
              :
              <div class="col-3" style="border: 1px solid #dee2e6;padding-top: 1%;">
                <div>
                  {
                    this.state.chats.map((chat,i)=>{
                      if(i==0){
                        return <a onclick={()=>{this.load_chat(i)}}>
                          <p style="font-weight: bold;">{chat.conversation.participants[0]._id==api.currentUser._id ? chat.conversation.participants[1].username : chat.conversation.participants[0].username}</p>
                          <p style="border-top: 0px">{chat.body}<span style="float: right;color: #1579f6;">{chat.chats ? (chat.chats[0].author == api.currentUser._id ? "" : (chat.chats[0].read ? "" : "New Message")) : (chat.author._id == api.currentUser._id ? "" : (chat.read ? "" : "New Message"))}</span></p>
                          <hr/>
                          <br/>
                        </a>
                      }
                      else{
                        return <a onclick={()=>{this.load_chat(i)}}>
                          <p style="font-weight: bold;">{chat.conversation.participants[0]._id==api.currentUser._id ? chat.conversation.participants[1].username : chat.conversation.participants[0].username}</p>
                          <p style="border-top: 0px">{chat.body}<span style="float: right;color: #1579f6;">{chat.chats ? (chat.chats[0].author == api.currentUser._id ? "" : (chat.chats[0].read ? "" : "New Message")) : (chat.author._id == api.currentUser._id ? "" : (chat.read ? "" : "New Message"))}</span></p>
                          <hr/>
                          <br/>
                        </a>
                      }
                    })
                  }
                </div>
              </div>
            }
            <div class="col-9">
              {
                this.state.active_chat >=0 ?
                  <div>
                    <h3>{this.state.chats[this.state.active_chat].conversation.participants[0]._id==api.currentUser._id ? this.state.chats[this.state.active_chat].conversation.participants[1].username : this.state.chats[this.state.active_chat].conversation.participants[0].username}</h3> 
                    <div id="msg" style="height:600px;overflow:scroll;">
                    {
                      this.state.chats[this.state.active_chat].chats.slice(0).reverse().map((chat)=>{
                        return(
                          <div>
                            <p style="font-weight: bold;">
                              {chat.author==this.state.chats[this.state.active_chat].conversation.participants[1]._id ? this.state.chats[this.state.active_chat].conversation.participants[1].username : this.state.chats[this.state.active_chat].conversation.participants[0].username}
                              {chat.author==api.currentUser._id ? "" : <span style="float: right;color: #1579f6;">{chat.read ? "" : "New"}</span>}
                            </p>
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