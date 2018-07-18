/**
 * Created by Administrator on 2/18.
 */
import React, {Component} from 'react'
import './style.css'
// import Head from '../../components/Head'
import Main2 from './main.js'


class Canvas extends Component {

	constructor(props){
		super(props);
	}

	shouldComponentUpdate(){
		return false;
	}

	componentDidMount() {
    window.canvas = document.getElementById('canv_f')
    Main2()
	}

	componentWillMount() {
	}

	render() {
		return (
			<div>
				{/*<Head title="Tetris" />*/}
				<div style={{paddingTop: 0}} className="box">
					<canvas className="canv" id="canv_f"></canvas>
				</div>
        <div>
          <button style={{margin: 'auto', display: 'block'}} id="gameStart" >gameStart</button>
        </div>
			</div>
		)
	}
}

export default Canvas
