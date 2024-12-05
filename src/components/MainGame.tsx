import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";

export type Xor0 = 'X' | '0'
export type allowedNumbers = 0 | 1 | 2
export type cell = {
    row: allowedNumbers,
    col: allowedNumbers,
    side: Xor0
}

function MainGame(props: { gameId: string }) {

    const client = generateClient<Schema>();
    const [game, setGame] = useState<Schema['Game']['type']>();
    const [side, setSide] = useState<Xor0 | 'notSetYet'>('notSetYet');
    const [gameState, setGameState] = useState([
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ])

    const userName = useAuthenticator().user.signInDetails?.loginId

    useEffect(() => {
        const handleData = async () => {

            const sub = client.models.Game.onUpdate({
                filter: {
                    id: {
                        eq: props.gameId
                    },
                    lastMoveBy: {
                        ne: side
                    }
                }
            }).subscribe({
                next: (data) => {
                    setGame(data)
                    if (data.moves) {
                        updateCells(data.moves)
                    }
                },
                error: (err) => {
                    console.log('error: ' + err)
                }
            });
            return () => sub.unsubscribe();
        }
        handleData()
    }, [])

    function updateCells(moves: Array<string | null>){
        const cells = parseUpdates(moves)
        const newGameState = [...gameState]
        cells.forEach((cell: cell) => {
            newGameState[cell.row][cell.col] = cell.side
        })
        setGameState(newGameState)
    }

    function parseUpdates(moves: Array<string | null>): cell[] {
        const parsedCells: cell[] = []
        for (const move of moves) {
            if (move) {
                if (move[2] !== side) {
                    parsedCells.push({
                        row: parseInt(move[0]) as allowedNumbers,
                        col: parseInt(move[1]) as allowedNumbers,
                        side: move[2] as Xor0
                    }) 
                }           
            }
        }
        return parsedCells
    }

    async function chooseSide(arg: 'X' | '0') {
        if (arg === 'X') {
            await client.models.Game.update({
                id: props.gameId,
                playerX: userName
            })
            setGame({
                ...game!,
                playerX: userName
            })
        }
        if (arg === '0') {
            await client.models.Game.update({
                id: props.gameId,
                player0: userName
            })
            setGame({
                ...game!,
                player0: userName
            })
        }
        setSide(arg)
        window.alert(`You chose ${arg}`)
    }

    function renderSideChooser() {
        if (side !== 'notSetYet') {
            return null
        }
        function renderChooseX() {
            if (game?.playerX == undefined) {
                return <button onClick={() => chooseSide('X')}>Choose X</button>
            }
        }
        function renderChooseO() {
            if (game?.player0 == undefined) {
                return <button onClick={() => chooseSide('0')}>Choose O</button>
            }
        }
        return (
            <div>
                {renderChooseX()}
                <br />
                {renderChooseO()}
                <br />
            </div>
        )
    }

    async function updateCell(cell: cell) {
        const gameMoves = game!.moves ? game!.moves : []
        await client.models.Game.update({
            id: props.gameId,
            moves: [...gameMoves, `${cell.row}${cell.col}${cell.side}`],
            lastMoveBy: side
        })
    }

    async function clickCell(row: allowedNumbers, col: allowedNumbers) {
        if (gameState[row][col] !== '') {
            return
        }
        const newGameState = [...gameState]
        newGameState[row][col] = side
        setGameState(newGameState)
        if (side !== 'notSetYet') {
            await updateCell({ row, col, side })
        }
    }

    function renderGameTable() {
        if (game?.player0 && game.playerX && side !== 'notSetYet') {
            return <div>
            <button onClick={() => clickCell(0, 0)}>{gameState[0][0]}</button> <button onClick={() => clickCell(0, 1)}>{gameState[0][1]}</button> <button onClick={() => clickCell(0, 2)}>{gameState[0][2]}</button><br />
            <button onClick={() => clickCell(1, 0)}>{gameState[1][0]}</button> <button onClick={() => clickCell(1, 1)}>{gameState[1][1]}</button> <button onClick={() => clickCell(1, 2)}>{gameState[1][2]}</button><br />
            <button onClick={() => clickCell(2, 0)}>{gameState[2][0]}</button> <button onClick={() => clickCell(2, 1)}>{gameState[2][1]}</button> <button onClick={() => clickCell(2, 2)}>{gameState[2][2]}</button><br />
        </div>
        }

    }

    return (
        <div>
            <h1>Main Game</h1>
            <p>Game ID: {props.gameId}</p>
            {renderSideChooser()}
            <br />
            {renderGameTable()}

        </div>
    );



}




export default MainGame;