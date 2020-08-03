import React from 'react';
import './Countdown.css';

export default function Countdown(props) {
    return (
        <div id="countdown-container">
            <div id="countdown-circle">
                <h1 id="countdown-text">{props.text}</h1>
            </div>
        </div>
    )
}
