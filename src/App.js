import { useState } from "react";
import "./styles.css";

// 3 x 3 보드를 만들기 위한 함수
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    // 1. 값이 있으면 true 반환, 값이 없으면 false 반환하는 원리를 이용 => 이미 사용된 칸은 재사용하지 못하게 하는 로직
    // 2. 승리자가 있는 경우 승리자를 반환하고 함수 종료
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    // 호출될 때 마다 squares 배열을 복제하여 해당 순서 시점으로 돌아가기 가능
    const nextSquares = squares.slice();

    // 다음 순서가 "X"인지 아닌지("O"인지)를 판단하는 조건으로 번갈아 표기하는 로직
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares); // 변경된 Board 상태
  }

  // 승리 여부 확인 함수. 승리자가 있는 경우 메시지 출력, 승리자가 없는 경우 다음 차례를 보여주는 메시지 출력
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  // handleClick(index) 함수를 통해 인덱스에 맞는 호출
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    // lines는 n by n 에서 무조건 2n + 2 가 됨
    [0, 1, 2], // 1행 완성
    [3, 4, 5], // 2행 완성
    [6, 7, 8], // 3행 완성
    [0, 3, 6], // 1열 완성
    [1, 4, 7], // 2열 완성
    [2, 5, 8], // 3열 완성
    [0, 4, 8], // 좌상-우하 대각선 완성
    [2, 4, 6], // 우상-좌하 대각선 완성
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // 1. a번째 칸이 비어있는지 아닌지 판단하는 것을 첫번째 조건으로 함
    // 2. a번째 칸과 b번째 칸의 값이 일치하는지 판단
    // 3. a번째 칸과 c번째 칸의 값이 일치하는지 판단 => 2, 3의 조건은 결국 a, b, c번째 값들이 모두 동일한지를 통해
    //    승리조건을 충족하는지 판단하는 것임
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // 모든 조건을 만족하면 a번재 칸의 값을 출력("X" 혹은 "O")하여 승리자를 알려주는 용도
      return squares[a];
    }
  }
  // 승리자가 없을 경우 null 값을 반환
  return null;
}

export default function Game() {
  // 게임 진행 기록을 저장하는 배열 history는 9개의 칸을 null 값들로 채운 것이 초기값
  const [history, setHistory] = useState([Array(9).fill(null)]);

  // 현재 턴이 몇번째인지 currentMove로 나타냄
  const [currentMove, setCurrentMove] = useState(0);

  // 다음 차례가 "X" 인 경우 = 현재 짝수 번째임을 나타냄
  const xIsNext = currentMove % 2 === 0;

  // 현재 턴의 보드 상태를 가져오는 변수
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // 현재 시점보다 이전 시점으로 돌아갈 수 있는 시간여행 함수
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <p>당신은 {currentMove}번째 순서에 있습니다...</p>{" "}
        {/* 현재 순서를 알려주는 기능 */}
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
