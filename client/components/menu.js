import {
    h,
    Component
} from 'preact';
import api from './../api'
import cookie_react from 'react-cookies';
import {Link,IndexLink,browserHistory} from 'react-router';

export class Menu extends Component {

	logout(event){
	    event.preventDefault()
	    event.target.innerHTML = " Logging Out.."
	    api.api.custom('users/session').delete()
	    .then((response) => {
	      console.log('response',response.body().data())
	      cookie_react.remove("sowil_session");
	      api.currentUser = null
	      event.target.innerHTML = 'Logout'
	      browserHistory.push('/')
	    })
	    .catch((err) => {
	      console.log('err:',err.response)
	      cookie_react.remove("sowil_session");
	      api.currentUser = null
	      event.target.innerHTML = 'Logout'
	      browserHistory.push('/')
	    })
	}

    render(props) {
    	console.log('props',props.active,props.active == "users")
        return <nav class="navbar navbar-expand-lg navbar-light bg-light justify-content-center">
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
              <ul class="navbar-nav">
                <li class={props.active == "home" ? "nav-item active" : "nav-item"}>
                  <a class="nav-link" href="/dashboard">Home</a>
                </li>
                {
                	api.currentUser.type == 0 ?
		                <li class={props.active == "users" ? "nav-item active" : "nav-item"}>
		                  <a class="nav-link" href="/addusers">Add Users</a>
		                </li>
		            :
		            	""
		        }
                <li class={props.active == "chats" ? "nav-item active" : "nav-item"}>
                  <a class="nav-link" href="/chats">Chats</a>
                </li>
              </ul>
              <button type="button" class="btn btn-primary" style="position:absolute;right:  7px;" onClick={this.logout.bind(this)}>Logout</button>
            </div>
        </nav>
    }
}