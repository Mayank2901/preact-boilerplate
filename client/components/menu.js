import {
    h,
    Component
} from 'preact';

export class Menu extends Component {

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
                <li class={props.active == "users" ? "nav-item active" : "nav-item"}>
                  <a class="nav-link" href="/addusers">Add Users</a>
                </li>
                <li class={props.active == "chats" ? "nav-item active" : "nav-item"}>
                  <a class="nav-link" href="/chats">Chats</a>
                </li>
              </ul>
            </div>
        </nav>
    }
}