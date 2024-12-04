import {  useState } from "react";




function GameTable(props: {side: 'X' | '0'}) {

    const [gameState, setGameState] = useState([
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ])

    function clickCell(row: number, col: number) {
        const newGameState = [...gameState]
        newGameState[row][col] = props.side
        setGameState(newGameState)
    }



    return <div>
        <button onClick={()=>clickCell(0, 0)}>{gameState[0][0]}</button> <button onClick={()=>clickCell(0, 1)}>{gameState[0][1]}</button> <button onClick={()=>clickCell(0, 2)}>{gameState[0][2]}</button><br/>
        <button onClick={()=>clickCell(1, 0)}>{gameState[1][0]}</button> <button onClick={()=>clickCell(1, 1)}>{gameState[1][1]}</button> <button onClick={()=>clickCell(1, 2)}>{gameState[1][2]}</button><br/>
        <button onClick={()=>clickCell(2, 0)}>{gameState[2][0]}</button> <button onClick={()=>clickCell(2, 1)}>{gameState[2][1]}</button> <button onClick={()=>clickCell(2, 2)}>{gameState[2][2]}</button><br/>
    </div>
}

export default GameTable