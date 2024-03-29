import React, { useState } from 'react';
import './Join.css';

export default function Join(props) {
    const [numCPUs, setNumCPUs] = useState('');

    return (
        <div id="join">
            <div>
                <div>
                    <p id="create-announcement">CONFIGURE YOUR GAME</p>
                    <div>
                        <input id="create-cpu-count" type="text" placeholder="# CPUs" value={numCPUs} onChange={(evt) => setNumCPUs(evt.target.value.replace(/\D/g,''))} />
                        <select id="create-cpu-difficulty">
                            <option value="">SELECT DIFFICULTY</option>
                            <option value="1">EASY</option>
                            <option value="2">MEDIUM</option>
                            <option value="3">HARD</option>
                            <option value="4">EXPERT</option>
                        </select>
                    </div>
                    <input id="create-button" type="button" onClick={() => {
                        if(!Number(numCPUs) || Number(numCPUs) > 8) {
                            console.log(Number(numCPUs),Number(numCPUs) > 8);
                            const text = <><span>Please enter a valid number of computers opponents</span><br /><span>(MIN 0, MAX 8)</span></>;
                            props.throwPopup(text);
                        } else if(document.getElementById('create-cpu-difficulty').value === '') {
                            const text = <span>Please select a difficulty for the computer opponents</span>;
                            props.throwPopup(text);
                        } else {
                            const diff = document.getElementById('create-cpu-difficulty').value;
                            props.handleCreate(numCPUs,diff);
                        }
                    }} value="CREATE" />
                </div>
            </div>
        </div>
    )
}
