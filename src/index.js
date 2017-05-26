import React from 'react';
import ReactDOM from 'react-dom'
import './index.css';

function Tile(props) {
	if(props.fill)
		return <span className='tile filled'></span>;
	else
		return <span className='tile'></span>;
}

class Surface extends React.Component {
	constructor(props) {
		super(props);
		let grid = Array(20).fill([0]);
		this.state = {
			grid: grid,
			block: [0, [2,3,4]],
			blockOld: null,
		}
	}
	genBlock() {
		return [0, [4,5,6]];
	}
	moveBlock() {
		this.checkMatch();
		let gridOld = this.state.gridOld;
		let grid = this.state.grid;
		let block = this.state.block;
		let blockOld = this.state.blockOld;

		if(block[0] > 19 || this.checkCollision(grid[block[0]], block[1])) {
			block = this.genBlock();
			blockOld = null;
		} else {
			if(blockOld) {
				grid[blockOld[0] - 1] = grid[blockOld[0] - 1].filter( function( el ) {
				  return !blockOld[1].includes( el );
				});
			}
			grid[block[0]] = grid[block[0]].concat(block[1]);
			blockOld = block;
			block[0] = block[0] + 1;
		}
		this.setState({
			grid: grid,
			block: block,
			blockOld: blockOld,
		});
		setTimeout(() => this.moveBlock(), 500);
	}
	componentDidMount() {
	    document.addEventListener('keypress', (e) => this.handleKeyPress(e));
		setTimeout(() => this.moveBlock(), 500);
	}
	genRow(blocks) {
		let tiles = Array(10);
		tiles.fill(<Tile />);
		if(blocks.length > 1) {
			for(let i = 0; i < blocks.length; i++)
				tiles[blocks[i] - 1] = <Tile fill='true' />
		}
		return <span className='row'>{tiles}</span>;
	}
	checkMatch() {
		let grid = this.state.grid;
		let length = grid.length;
		let change = false;
		for(let i = 0; i < length; i++) {
			if(grid[i].length === 10) {
				grid[i] = [0];
				change = true;
			}
		}
		if(change) {
			this.setState({
				grid: grid,
			});
		}
	}
	checkCollision(grid0, grid1) {
		return grid0.some(function (v) {
	        return grid1.indexOf(v) >= 0;
	    });
	}
	genBoard() {
		let board = [];
		let grid = this.state.grid;
		for(let i = 0; i < 20; i++)
			board.push(this.genRow(grid[i]));
		return board;
	}
    handleKeyPress(e) {
	    let keycode = e.keyCode;
	    switch(keycode) {
	    	case 38: //up
	    		//rotate block
	    		break;
	    	case 40: //down
	    		//increase speed
	    		break;
	    	case 37: //left
	    		//move left
	    		break;
	    	case 38: //right
	    		//move right
	    		break;
	    	default:
	    		//nothing
	    }
	  }
	render() {
		return <div id='surface'>{this.genBoard()}</div>;
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			score: 0,
		}
	}
	render() {
		return <Surface />;
	}
}

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);
