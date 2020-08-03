import React from 'react';
import Header from './Header';
import Login from './Login';
import Lobby from './Lobby';
import Countdown from './Countdown';
import Game from './Game';
import CPUGame from './CPUGame';
import Join from './Join';
import Scoreboard from './Scoreboard';
import Popup from './Popup';

class App extends React.Component {
    state = {
        isJoined: false, // false
        isLoggedIn: false, // false
        isRunning: false, // false
        isLocked: true, // true
        numCPUs: 0,
        CPUdiff: 1,
        countdown: undefined,
        countdownTimeout: [],
        popup: false,
        name: undefined,
        users: [],
        lake: [],
        lastLake: 0,
        lastNertz: 13,
        lastCPULake: [],
        lastCPUNertz: [],
        scores: {},
        scoreUpdate: {},
        gameCount: 0
    }
    componentDidMount() {

    }

    componentWillUnmount() {
        for(let timeout of this.state.countdownTimeout) {
            clearTimeout(timeout);
        }
    }

    endGame = () => {
        const text = <><span>Nertz!</span><br /><br /><span>Click OKAY to view the results.</span></>;
        let scoreUpdate = {};
        scoreUpdate[this.state.name] = {
            lake: this.state.lastLake,
            nertz: this.state.lastNertz
        };
        for(let i=0; i<this.state.numCPUs; i++) {
            const name = "CPU "+String(i);
            scoreUpdate[name] = {
                lake: this.state.lastCPULake[i],
                nertz: this.state.lastCPUNertz[i]
            };
        }
        let newScores1 = {...this.state.scores};
        Object.keys(scoreUpdate).forEach((user, i) => {
            newScores1[user] += Number(scoreUpdate[user].lake)-2*Number(scoreUpdate[user].nertz);
        });
        this.setState({
            isLocked: true,
            popup: text,
            scoreUpdate: scoreUpdate,
            scores: {...newScores1},
            gameCount: this.state.gameCount+1
        });
    }

    updateScore = (newValue) => {
        this.setState({lastLake: newValue});
    }

    updateNertz = (newValue) => {
        this.setState({lastNertz: newValue}, () => {
            if(this.state.lastNertz === 0) {
                this.endGame();
            }
        });
    }

    updateCPUScore = (id, newValue) => {
        let newCPULake = this.state.lastCPULake;
        newCPULake[id] = newValue;
        this.setState({lastCPULake: newCPULake});
    }

    updateCPUNertz = (id, newValue) => {
        let newCPUNertz = this.state.lastCPUNertz;
        newCPUNertz[id] = newValue;
        this.setState({lastCPUNertz: newCPUNertz}, () => {
            for(let cpu of this.state.lastCPUNertz) {
                if(cpu === 0) {
                    this.endGame();
                    break;
                }
            }
        });
    }

    handleCreate = (numCPUs,diff) => {
        let users = [];
        let scores = {};
        for(let i=0; i<numCPUs; i++) {
            const name = "CPU "+String(i);
            users.push(name);
            scores[name] = 0;
        }
        this.setState({
            numCPUs: numCPUs,
            CPUdiff: diff,
            users: [...users],
            scores: {...scores},
            isJoined: true
        });
    }

    handleLogin = (name) => {
        if(this.state.users.indexOf(name) === -1) {
            let users = [...this.state.users];
            const scores = {...this.state.scores};
            users.push(name);
            scores[name] = 0;
            this.setState({
                isLoggedIn: true,
                name: name,
                users: [...users],
                scores: {...scores}
            });
        } else {
            alert("That username is already taken. Please type another and join again.");
        }
    }

    handleReady = (isReady) => {
        this.setState({isRunning: true, countdown: 5});
        for(let i=4; i>-1; i--) {
            const newTimeout = setTimeout(() => this.setState({"countdown":Number(i)}), 1000*(5-Number(i)) );
            let timers = [...this.state.countdownTimeout];
            timers.push(newTimeout);
            this.setState({countdownTimeout: timers});
        }
        const newTimeout = setTimeout(() => {
            //new game -> reset variables
            const blank0Arr = Array.from(Array(this.state.numCPUs), () => 0);
            const blank13Arr = Array.from(Array(this.state.numCPUs), () => 13);
            this.setState({
                isLocked: false,
                countdown: undefined,
                lake: [],
                lastLake: 0,
                lastNertz: 13,
                readyUsers: [],
                lastCPULake: blank0Arr,
                lastCPUNertz: blank13Arr
            });
        }, 4950);
        let timers = [...this.state.countdownTimeout];
        timers.push(newTimeout);
        this.setState({countdownTimeout: timers});
    }

    newLake = (lake) => {
        this.setState({lake: lake});
    }

    render() {
        return (
            <>
                <Header name={this.state.name} />
                {this.state.isJoined
                    ? this.state.isLoggedIn
                        ? this.state.isRunning
                            ? this.state.isLocked
                                ? this.state.countdown
                                    ? <Countdown text={this.state.countdown} />
                                    : <Scoreboard scoreUpdate={this.state.scoreUpdate} scores={this.state.scores} handleReady={this.handleReady} gameCount={this.state.gameCount} />
                                : <>
                                    <Game lake={this.state.lake} newLake={this.newLake} name={this.state.name} updateScore={this.updateScore} updateNertz={this.updateNertz} />
                                    {[...Array(Number(this.state.numCPUs))].map((n,i) =>
                                            <CPUGame id={i} key={i} get_lake={() => [...this.state.lake]} newLake={this.newLake} updateCPUScore={this.updateCPUScore} updateCPUNertz={this.updateCPUNertz} difficulty={this.state.CPUdiff} />
                                     )}
                                  </>
                            : <Lobby handleReady={this.handleReady} users={this.state.users} />
                        : <Login handleLogin={this.handleLogin} />
                    : <Join handleCreate={this.handleCreate} throwPopup={(text) => this.setState({popup: text})} />
                }
                {this.state.popup
                    ? <Popup text={this.state.popup} handleClose={() => this.setState({popup: false})} />
                    : null
                }
            </>
        )
    }
}

export default App;
