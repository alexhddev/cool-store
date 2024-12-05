import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";
import GameTable from "./GameTable";

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
    const [updatedCells, setUpdatedCells] = useState<cell[]>([])

    const userName = useAuthenticator().user.signInDetails?.loginId

    useEffect(() => {
        const handleData = async () => {
            // const game = await client.models.Game.get({
            //     id: props.gameId
            // })
            // if (game.data) {
            //     setGame(game.data)
            // }

            // subscribe for game updates
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
                    console.log('received data:')
                    console.log(data)
                    if (data.moves) {
                        setUpdatedCells(parseUpdates(data.moves))
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

        window.alert(`You chose ${arg}`)
        setSide(arg)
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

    function parseUpdates(moves: Array<string | null>): cell[] {
        return moves.map((cell: string | null) => {
            return {
                row: parseInt(cell![0]) as allowedNumbers,
                col: parseInt(cell![1]) as allowedNumbers,
                side: cell![2] as Xor0
            }
        })
    }

    function renderGameTable() {
        if (game?.player0 && game.playerX && side !== 'notSetYet') {
            return <GameTable side={side} sendUpdate={updateCell} updatedCells={updatedCells} />
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