import React, { Component } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import styles from './App.css';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import url from 'url';
import { withRouter } from 'react-router-dom';
import reactListKey from './utils/reactListKey';

import Home from './routes/home';
import Maps from './routes/maps';
import Videos from './routes/videos';

import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import HomeIcon from '@material-ui/icons/Home';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';

class App extends Component {

    state = {
        value: 0
    }

    getPathAtTab(tab) {
        let { views } = this.props;
        if (tab < 0 ||
            tab >= views.length) {
            throw new Error(`Invalid tab index ${tab}`);
        }
        const { path } = views[tab];
        return path;
    }

    handleOnClick = (tab) => () => {
        let { dispatch } = this.props;
        const hrefParsed = url.parse(window.location.href);
        const path = this.getPathAtTab(tab);
        if (hrefParsed.pathname === path) {
            return;
        }
        this.setState({
            tab: tab
        });
        dispatch(push(path));
    }

    actionTabInit = () => {
        let { views } = this.props;
        const hrefParsed = url.parse(window.location.href);
        for (let tab = 0; tab < views.length; tab++) {
            const { path } = views[tab];
            if (hrefParsed.pathname === path) {
                this.setState({
                    tab: tab
                });
                return;
            }
        }
    }

    render() {
        const { tab } = this.state;
        const { views } = this.props;
        return (
            <div className="App" style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', position: 'fixed' }}>
                <main style={{ position: 'relative', flex: '1 1 auto', overflowY: 'auto', overflowX: 'hidden' }}>
                    <Switch>
                        {
                            views.map((v, i) => (
                                <Route key={reactListKey('route', i.toFixed(0))} exact path={v.path} render={(props) => v.render} />
                            ))
                        }
                        <Route path="/" render={() => <Redirect to={this.getPathAtTab(0)}/>} />
                    </Switch>
                </main>
                <BottomNavigation
                    value={tab}
                    onChange={this.handleChange}
                    showLabels
                    style={{ width: '100%', flex: '0 0 auto' }}
                >
                    {
                        views.map((v, i) => (
                            <BottomNavigationAction key={reactListKey('bottom-navigation', i.toFixed(0))} label={v.label} icon={v.icon} onClick={this.handleOnClick(i)} />
                        ))
                    }
                </BottomNavigation>
            </div>
        );
    }

    componentDidMount() {
        this.actionTabInit();
    }
}

const withViews = views => App => (props) => <App {...props} views={views} />;

const views = [
    {
        path: '/home',
        label: 'Home',
        icon: <HomeIcon />,
        render: <Home />
    },
    {
        path: '/maps',
        label: 'Map',
        icon: <LocationOnIcon />,
        render: <Maps />
    },
    {
        path: '/videos',
        label: 'Videos',
        icon: <OndemandVideoIcon />,
        render: <Videos />
    }
]

export default withRouter(connect()(withStyles(styles)(withViews(views)(App))));