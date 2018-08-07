import { h, Component } from 'preact';

export class Modal extends Component {
    
  constructor(props) {
    super(props);
    this.state.active = props.isOpen || false;
    this.state.modalClass = "animation-target"
    this.state.modalBGClass = "modalss"
  }

  close(){
      this.setState({ active: false }) 
  }

  componentWillUpdate(props){
      this.setState({ active: false })
      this.setState({ active: props.isOpen });
  }

  render() {
      if(this.state.active){
          return (
            <div className={`modal ${this.state.active ? "is-active" : ""}`}>
                
                {this.state.active ?
                    ( <div>
                        <div class={`modal-background ${this.state.modalBGClass}`}></div>
                            <div class={`modal-card ${this.state.modalClass}`}>
                                <div class="modal-card-head">
                                    <p class="modal-card-title">{this.props.title}</p>
                                    <button class="delete" onClick={this.close.bind(this)}></button>
                                </div>
                                <div class="modal-card-body">
                                    {this.props.body}
                                </div>
                                
                                {
                                    this.props.footer?(
                                        <div class="modal-card-foot">
                                            <a class="button is-primary">Save changes</a>
                                            <a class="button is-light">Cancel</a>
                                        </div>
                                    ):(<div class="modal-card-foot">
                                        <a href="/" >read more</a>
                                    </div>)
                                }
                            </div>
                    </div>
                    ) : null
                }
            </div>);
        }
        else{
            return;
        }
    }
}