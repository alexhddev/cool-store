import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";


function MainGame(props: { gameId: string }) {

    const client = generateClient<Schema>();
    const [game, setGame] = useState<Schema['Game']['type']>();
    const [sideChosen, setSideChosen] = useState(false);

    const userName = useAuthenticator().user.signInDetails?.loginId

    useEffect(() => {
        const handleData = async () => {
            const game = await client.models.Game.get({
                id: props.gameId
            })
            if (game.data) {
                setGame(game.data)
            }

            // subscribe for game updates
            const sub = client.models.Game.onUpdate({
                filter: {
                    id: {
                        eq: props.gameId
                    }
                }
            }).subscribe({
                next: (data) => {
                    setGame(data)
                    console.log('received data: ' + JSON.stringify(data))
                },
                error: (err) => {
                    console.log('error: ' + err)
                }
            });
            return () => sub.unsubscribe();
        }
        handleData()
    }, [])

    async function chooseSide(arg: 'X' | 'O') {
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
        if (arg === 'O') {
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
        setSideChosen(true)
    }

    function renderSideChooser() {
        if (sideChosen) {
            return null
        }
        function renderChooseX() {
            if (game?.playerX == undefined) {
                return <button onClick={() => chooseSide('X')}>Choose X</button>
            }
        }
        function renderChooseO() {
            if (game?.player0 == undefined) {
                return <button onClick={() => chooseSide('O')}>Choose O</button>
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

    return (
        <div>
            <h1>Main Game</h1>
            <p>Game ID: {props.gameId}</p>
            {renderSideChooser()}
        </div>
    );



}




export default MainGame;