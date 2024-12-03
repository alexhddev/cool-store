import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

type GameIntroProps = {
    gameIdSetter: (id: string) => void
}

function GameIntro(props: GameIntroProps) {
    const gameClient = generateClient<Schema>().models.Game;

    const user = useAuthenticator().user;
    const userName = user.signInDetails?.loginId

    async function createGame() {
        const createResult = await gameClient.create({})
        const id = createResult.data?.id
        if (id) {
            props.gameIdSetter(id)
        }
    }

    async function joinGame() {
        const gameId = window.prompt('gameId')
        if (gameId) {
            props.gameIdSetter(gameId)
        }

    }

    return (
        <main>
            <h1>Welcome to the cool game {userName} !</h1><br/>
            <button onClick={createGame}>Create game</button><br/>
            <button onClick={joinGame} >Join game</button><br/>

        </main>
    )

}

export default GameIntro;