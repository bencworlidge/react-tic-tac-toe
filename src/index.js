import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/* TO DO:
1 - Make AI?!!?
2 - Bigger and nicer
*/

function Square(props) {
    return (
    <button 
        className="square" 
        // Calls receives props when clicked
        onClick={props.squareClick}>
        {props.value}
    </button>
    );
    
  }
  
class Board extends React.Component {

    // Takes integer and renders square with value of integer received. When Square is clicked, calls handleClick with integer clicked.
    renderSquare(i) {
      return <Square 
      value={this.props.squares[i]} 
      squareClick={() => {this.props.onClick(i)}}    
      />;
    }

    render() {
        return (
            <div>
            <div className="board-row">
                {this.renderSquare(0)}
                {this.renderSquare(1)}
                {this.renderSquare(2)}
            </div>
            <div className="board-row">
                {this.renderSquare(3)}
                {this.renderSquare(4)}
                {this.renderSquare(5)}
            </div>
            <div className="board-row">
                {this.renderSquare(6)}
                {this.renderSquare(7)}
                {this.renderSquare(8)}
            </div>
            </div>
        );
    }
  }
 
class Game extends React.Component {
    // Sets initial Board states to empty array of 9 and starts with X
    constructor() {
        super()
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
        }
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1)
        const current = history[history.length - 1];
        // Creates clone of array
        const squares = current.squares.slice();
        // Check if someone has won or square has value and returns early so no value is changed
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        // Makes [i] either 'X' or 'O' depending on xIsNext state
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            // Adds current play to history array
            history: history.concat([{
                squares: squares,
            }]),
            // Updates stepNumber
            stepNumber: history.length,
            // Flips xIsNext Boolean state
            xIsNext: !this.state.xIsNext,
        })
    }

    render() {
        // Logs previous plays in new array 'history'
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        // If value 'X' or 'O', announce winner... 
        const winner = calculateWinner(current.squares);

        // Cycle through moves 
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })

        let status
        if (winner) {
            status = 'Winner: ' + winner
        } else {
            // ...If null, continues games
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
            <div className="game-board">
                <Board 
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
            </div>
      );
    }
  }
  
  // ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function calculateWinner(squares) {
    // All possible winning combinations using square value
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    // Loops through all winning combinations
    for (let i = 0; i < lines.length; i++) {
      // Takes each square value as a, b or c
      const [a, b, c] = lines[i];
      // Checks if all three are either 'X' or 'O'
      if (squares[a] === squares[b] && squares[a] === squares[c]) {
        // returns 'X' or 'O'
        return squares[a];
      }
    }
    // Otherwise returns null
    return null;
  }
  