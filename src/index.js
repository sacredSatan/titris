import React from 'react';
import ReactDOM from 'react-dom'
import './index.css';

function Score(props) {
  if(props.over)
    return <div className='score'>Game Over! Final Score: {props.score}</div>;
  else
    return <div className='score'>Score: {props.score}</div>;
}

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
			block: [
				[0, [6,7]],
				[-1, [6]],
				[-2, [6]],
				[-2, [6]],
			],
			blockOld: null,
			keyEvent: false,
			speed: 500,
		}
	}
	genBlock() {
		let blockShapes = [
			[
				[0, [7]],
				[-1, [6,7,8]]
			], // triangle
			[
				[0, [6,7,8]]
			], // line
			[
				[0, [6,7]],
				[-1,[6,7]]
			], // square
			[
				[0, [6,7]],
				[-1, [6]],
				[-2, [6]],
				[-2, [6]],
			] // L shape
		]
		let index = Math.floor(blockShapes.length * Math.random());
		return blockShapes[index];
	}
	moveBlock() {
		let grid = this.state.grid;
		let block = this.state.block;
		let blockOld = this.state.blockOld;


		if(block[0][0] > 19 || this.checkCollision(grid[block[0][0]], block[0][1])) {
			this.checkMatch();
			if(block[0][0] < 1) {
				console.log('over');
				this.props.onGameOver();
			}
			block = this.genBlock();
			blockOld = null;
			this.setState({
				speed: 500,
			})
		} else {
			if(blockOld) {
				if(blockOld.length > 1) {
					for(let i = 0; i < blockOld.length; i++) {
						if(blockOld[i][0] > 0) {
							grid[blockOld[i][0] - 1] = grid[blockOld[i][0] - 1].filter( function( el ) {
							  return !blockOld[i][1].includes( el );
							});
						}
					}
				} else {
					grid[blockOld[0][0] - 1] = grid[blockOld[0][0] - 1].filter( function( el ) {
					  return !blockOld[0][1].includes( el );
					});
				}
			}
			for(let i = 0; i < block.length; i++) {
				if(block[i][0] >= 0)
					grid[block[i][0]] = grid[block[i][0]].concat(block[i][1]);
				blockOld = block;
				block[i][0] = block[i][0] + 1;
			}
		}
		this.setState({
			grid: grid,
			block: block,
			blockOld: blockOld,
			keyEvent: false,
		});
		if(!this.props.over)
			setTimeout(() => this.moveBlock(), this.state.speed);
	}
	componentDidMount() {
	    document.addEventListener('keydown', (e) => this.handleKeyPress(e));
		setTimeout(() => this.moveBlock(), this.state.speed);
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
		let totalChange = 0;
		for(let i = 0; i < length; i++) {
			if(grid[i].length === 11) {
				grid.pop();
				grid.unshift([0]);
				change = true;
				totalChange++;
			}
		}
		if(change) {
			this.setState({
				grid: grid,
			});
			this.props.onScoreChange(totalChange);
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
	    let block = this.state.block;
	    let blockOld = JSON.parse(JSON.stringify(block));
	    let change = false;
	    if(this.state.keyEvent)
	    	return;
	    switch(keycode) {
	    	case 38: //up
	    		//rotate block
	    		break;
	    	case 40: //down
	    		//increase speed
	    		this.setState({
	    			speed: 100,
	    		})
	    		break;
	    	case 37: //left
	    		//move left
	    		for(let i = 0; i<block.length; i++) {
	    			if(block[i][1][0] > 1) {
	    				for(let j = 0; j < block[i][1].length; j++)
		    				block[i][1][j] -= 1;
	    				change = true;
	    			} else {
	    				change = false;
	    				break;
	    			}
	    		}
	    		if(change) {
	    			console.log(block, blockOld);
	    			this.setState({
	    				block: block,
	    				blockOld: blockOld,
	    				keyEvent: true,
	    			})
    			}
	    		break;
	    	case 39: //right
	    		//move right
	    		for(let i = 0; i<block.length; i++) {
	    			if(block[i][1][block[i][1].length - 1] < 10) {
	    				for(let j = 0; j < block[i][1].length; j++)
		    				block[i][1][j] += 1;
	    				change = true;
	    			} else {
	    				change = false;
	    				break;
	    			}
	    		}
	    		if(change) {
	    			console.log(block, blockOld);
	    			this.setState({
	    				block: block,
	    				blockOld: blockOld,
	    				keyEvent: true,
	    			})
    			}
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
			over: false,
		}
		this.handleScoreChange = this.handleScoreChange.bind(this);
		this.handleGameOver = this.handleGameOver.bind(this);
	}
	handleScoreChange(score) {
		let oldScore = this.state.score;
		score += oldScore;
		this.setState({
			score: score,
		});
	}
	handleGameOver() {
		this.setState({
			over: true,
		});
	}
	render() {
		return <div><Score score={this.state.score} over={this.state.over} /><Surface over={this.state.over} onGameOver={this.handleGameOver} onScoreChange={this.handleScoreChange} /></div>;
	}
}

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);
