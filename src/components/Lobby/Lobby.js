import React, { useState } from 'react';
import './Lobby.css';
import LobbyUser from './LobbyUser';

export default function Lobby(props) {
    const [isReady, setIsReady] = useState(false);
    const handleReady = () => {
        props.handleReady(!isReady);
        setIsReady(!isReady);
    }

    return (
        <div id="lobby-container">
            <div id="lobby-announcement">
                <p>We're waiting to get started!</p>
            </div>
            <div id="lobby-user-container">
                {props.users.map((u,i) => <LobbyUser key={i} name={u} />)}
            </div>
            <div id="lobby-ready-container">
                <div id="lobby-ready-button" className={isReady ? "ready" : "unready"} onClick={() => handleReady()}>
                    <p>{isReady ? "CANCEL" : "READY"}</p>
                </div>
            </div>
        </div>
    )
}
