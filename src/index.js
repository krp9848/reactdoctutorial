import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

// this is a controlled component (since all the props are being passed
// down to it from Board component)
// It has no independent state of its own so this can be changed to function component
function Square(props) {
  return (
    <button className="square" onClick={props.click}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        click={() => this.props.handleClick(i)}
      />
    )
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
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick = (i) => {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const squares = history[this.state.stepNumber].squares.slice()

    if (calculateWinner(squares) || squares[i]) return
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    const newHistory = history.concat({ squares })
    this.setState({
      history: newHistory,
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    })
  }

  goToMove = (step) => {
    console.log(`Going to move# : ${step}`)
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const squares = current.squares
    let status
    const winner = calculateWinner(squares)

    const moves = history.map((step, move) => {
      const desc = move ? `Go to move #: ${move}` : `Go to game start`
      return (
        <li key={move}>
          <button onClick={() => this.goToMove(move)}>{desc}</button>
        </li>
      )
    })

    if (winner) {
      status = `Winner: ${winner}`
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={squares} handleClick={this.handleClick} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    )
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'))

// function to calculate the winner
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}
