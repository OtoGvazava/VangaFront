import React from "react";
import Answer from "./Answer";

const Play = ({gameId, profileImage, playerName, playerId, contextType}) => {
    return (
        <Answer profileImage={profileImage} playerName={playerName}/>
    )
}

export default Play;