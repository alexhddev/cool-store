import { useState, useEffect } from "react";
import { Xor0, allowedNumbers, cell } from "./MainGame";

function GameTable(props: {
    side: Xor0,
    sendUpdate: (update: cell) => void
    updatedCells: cell[]
}) {
    const [gameState, setGameState] = useState([
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ])

    useEffect(() => {
        // console.log('updatedCells: ' + JSON.stringify(props.updatedCells))      
        props.updatedCells.forEach((cell: cell) => {
            if (cell.side !== props.side) {
                const newGameState = [...gameState]
                newGameState[cell.row][cell.col] = props.side
                setGameState(newGameState)
            }
        })
    })



    function clickCell(row: allowedNumbers, col: allowedNumbers) {
        if (gameState[row][col] !== '') {
            return
        }
        const newGameState = [...gameState]
        newGameState[row][col] = props.side
        setGameState(newGameState)
        props.sendUpdate({ row, col, side: props.side })
    }

    return <div>
        <button onClick={() => clickCell(0, 0)}>{gameState[0][0]}</button> <button onClick={() => clickCell(0, 1)}>{gameState[0][1]}</button> <button onClick={() => clickCell(0, 2)}>{gameState[0][2]}</button><br />
        <button onClick={() => clickCell(1, 0)}>{gameState[1][0]}</button> <button onClick={() => clickCell(1, 1)}>{gameState[1][1]}</button> <button onClick={() => clickCell(1, 2)}>{gameState[1][2]}</button><br />
        <button onClick={() => clickCell(2, 0)}>{gameState[2][0]}</button> <button onClick={() => clickCell(2, 1)}>{gameState[2][1]}</button> <button onClick={() => clickCell(2, 2)}>{gameState[2][2]}</button><br />
    </div>
}

export default GameTable