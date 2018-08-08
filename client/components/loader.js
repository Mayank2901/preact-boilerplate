import {
    h,
    Component
} from 'preact';

export class FullScreenLoader extends Component {

    render() {
        return <section style="width: 100%;height: 1000px;">
			<div style="margin:0 auto;">
				<h1 class="title is-1" style="padding-top: 25%;text-align: center;">Loading your contents...</h1>
			</div>
		</section>
    }
}