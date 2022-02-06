import React, {useState, useEffect} from 'react';


function App() {
    return (
        <Board/>
    )
}


const P1 = 'A';
const P2 = 'B';
const DEFAULT = '.';

// storage item

const WINNER = "winner";
const CURRENT_PLAYER = "current_player";
const SQUARES = "squares";
const HISTORIES = "histories";


function Board() {
    const [winner, setWinner] = useState(getInitialWinnerState());
    const [currentPlayer, setCurrentPlayer] = useState(getInitialCurrentPlayerState());
    const [squares, setSquares] = useState(getInitialSquaresState());

    const [histories, setHistories] = useState(getInitialHistoriesState());


    // initializers

    function getInitialWinnerState() {
        if (localStorage.getItem(WINNER))
            return JSON.parse(localStorage.getItem(WINNER));
        return null;
    }

    function getInitialCurrentPlayerState() {
        if (localStorage.getItem(CURRENT_PLAYER))
            return JSON.parse(localStorage.getItem(CURRENT_PLAYER));
        return P1;
    }

    function getInitialSquaresState() {
        if (localStorage.getItem(SQUARES))
            return JSON.parse(localStorage.getItem(SQUARES));
        return Array(9).fill(null);

    }

    function getInitialHistoriesState() {
        if (localStorage.getItem(HISTORIES))
            return JSON.parse(localStorage.getItem(HISTORIES));
        return Array(9).fill(null);

    }


    useEffect(function () {
        if (squares) localStorage.setItem(SQUARES, JSON.stringify(squares));
        if (histories) localStorage.setItem(HISTORIES, JSON.stringify(histories));
        if (currentPlayer) localStorage.setItem(CURRENT_PLAYER, JSON.stringify(currentPlayer));
        localStorage.setItem(WINNER, JSON.stringify(winner));

    }, [squares, histories, winner, currentPlayer])




    function handleSquareClick(i) {
        setSquares(squares => {

            if (squares[i] || winner) {
                return squares;
            }


            squares[i] = currentPlayer;
            nextPlayer();


            addHistory(squares);
            setWinner(getTheWinner());
            return squares;

        })

    }


    function getTheWinner() {
        const win_lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],

            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],

            [0, 4, 8],
            [2, 4, 6]
        ]

        for (let line of win_lines) {
            const [a, b, c] = line;

            if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) return squares[a];
        }
        return null;
    }

    function nextPlayer() {
        currentPlayer !== P2 ? setCurrentPlayer(P2) : setCurrentPlayer(P1);
    }


    function isFinished() {
        if (winner) return true;

        for (let i = 0; i < squares.length; i++) if (squares[i] === null) return false
        return true
    }


    function backToHistory(position) {

        if (position === 0) restart();

        if (histories && histories[position - 1]) {

            setSquares(Array.from(histories[position - 1]));

            position % 2 === 0 ? setCurrentPlayer(P1) : setCurrentPlayer(P2);

            setHistories(histories => {
                for (let i = (position); i < histories.length; i++)
                    histories[i] = null;
                return histories;
            })
            setWinner(null);

        }

    }

    function addHistory(squares) {
        const position = histories.indexOf(null);
        if (position !== -1) {
            setHistories(histories => {
                histories[position] = [...squares];
                return histories;
            })
        }
    }

    function restart() {
        setSquares(Array(9).fill(null));
        setWinner(null);
        setCurrentPlayer(P1);
        setHistories(Array(9).fill(null));
    }


    // render
    function renderSquare(position) {
        return (
            <button className="square" onClick={() => handleSquareClick(position)}>
                {squares[position] === null ? DEFAULT : squares[position]}
            </button>
        )
    }

    function renderHistories() {
        const historyEl = [];
        for (let i = 0; i < histories.length; i++) {
            if (histories[i]) historyEl.push(renderHistory(i));
        }
        return historyEl;
    }

    function renderHistory(position) {
        return (
            <button key={position} className="btn history-btn" onClick={() => backToHistory(position)}>
                {position}
            </button>
        )
    }

    function renderFeedBack() {
        if (isFinished())
            return winner ? <h1>Winner: Player {winner} <br/>🎉🥳</h1> : <h1>Nobody won</h1>
        return <h1>Player {currentPlayer} it's your turn !</h1>
    }


    return (

        <React.Fragment>
            <div className="board">
                {renderFeedBack()}
                <div className="board-row">
                    {renderSquare(0)}
                    {renderSquare(1)}
                    {renderSquare(2)}
                </div>
                <div className="board-row">
                    {renderSquare(3)}
                    {renderSquare(4)}
                    {renderSquare(5)}
                </div>
                <div className="board-row">
                    {renderSquare(6)}
                    {renderSquare(7)}
                    {renderSquare(8)}
                </div>
            </div>
            <div className="btn-wrapper">
                {renderHistories()}
            </div>
            <div className="btn-wrapper">
                <button className="btn restart-btn" onClick={restart}>Restart</button>
            </div>
        </React.Fragment>

    )
}


export default App;