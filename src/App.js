import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    Redirect,
    withRouter
} from "react-router-dom";
import logo from './images/logo.jpg';
import './App.css';
import Home from './routes/home';
import Videos from './routes/videos';

import MapViewer from './components/MapViewer';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

class App extends Component {

    handleRoute = async e => {

    }

    onClick(event) {
        switch (event) {
        case 'home':
            window.location.href='/home';
            break;
        case 'map':
            window.location.href='/map';
            break;
        case 'videos':
            window.location.href='/videos';
            break;
        }
    }

    render() {
        return (
            <Router>
                <div className="App">
                    <AppBar position="fixed" title="Minecraft Server">
                        <Tabs>
                            <Tab label="Users" onClick={this.onClick.bind(this, 'home')} />
                            <Tab label="Map" onClick={this.onClick.bind(this, 'map')} />
                            <Tab label="Videos" onClick={this.onClick.bind(this, 'videos')} />
                        </Tabs>
                    </AppBar>
                    <main style={{position: 'fixed', width: '100%', height: '100%', padding: '48px 0px 0px 0px', top: '0px', zIndex: '-1'}}>
                            <Switch>
                                <Route path="/home" component={Home} />
                                <Route path="/map" render={(props) => <MapViewer size="128" style={{ width: '100%', height: '100%', position: 'absolute'}} />} />
                                <Route path="/videos" component={Videos} />
                                <Redirect path="/" to="/home" />
                            </Switch>
                    </main>
                    {/* <div>
                        <Card>
                            <CardMedia
                                style={{height: '270px'}}
                                image={logo}
                                title="LZM Server"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="headline" component="h2">
                                    Minecraft Server
                                </Typography>
                                <Typography component="div">
                                    <Home />
                                </Typography>
                            </CardContent>
                        </Card>
                    </div> */}

                    {/* <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo" />
                    </header>
                    <main>
                    </main> */}
                </div>
            </Router>
        );
    }
}

export default App;
