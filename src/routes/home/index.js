import url from 'url';

import React, { Component } from 'react';
import fetchClient from '../../utils/fetchClient';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Face from '@material-ui/icons/Face';
import CancelableTimer from '../../utils/CancelableTimer';
import RemoveCircleOutline from '@material-ui/icons/RemoveCircleOutline';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import logo from '../../images/logo.jpg';
import Typography from '@material-ui/core/Typography';
// import styles from './style.css';
import reactListKey from '../../utils/reactListKey';

export default class Home extends Component {

    state = {
        users: null,
        userCache: {}
    }

    async getUsers() {
        try {
            const users = await fetchClient('/users');
            const userCache = this.state.userCache;
            for (const { id } of users) {
                if (!userCache[id]) {
                    try {
                        const uuid_uri = url.resolve('https://api.minetools.eu/uuid/', id);
                        const { id: uuid, name } = await (await fetch(uuid_uri)).json();
                        // const textures_uri = url.resolve('https://sessionserver.mojang.com/session/minecraft/profile/', uuid);
                        // const { properties } = await (await fetch(textures_uri)).json();
                        // let textures = null;
                        // for (const { name, value } of properties) {
                        //     if (name === 'textures') {
                        //         textures = JSON.parse(value);
                        //         break;
                        //     }
                        // }
                        // if (textures === null) {
                        //     throw new Error(`Unable to retrieve texture for user.`);
                        // }
                        userCache[id] = {
                            uuid,
                            name
                        }
                    } catch (e) {

                    }
                }
            }
            this.setState({
                users,
                userCache
            });
        } catch (e) {
            this.setState({
                users: e
            });
        }
    }

    componentDidMount() {
        const that = this;
        const cancelableTimer = this.cancelableTimer = new CancelableTimer();
        void async function () {
            try {
                for (; ;) {
                    that.getUsers();
                    await cancelableTimer.delay(1000);
                }
            } catch (e) {
                void e;
            }
        }();
    }

    componentWillUnmount() {
        if (this.cancelableTimer !== null) {
            this.cancelableTimer.cancel();
        }
    }

    async removeUser(id) {
        const result = window.confirm("Do you really want to kick this player?");
        if (result !== true) {
            return;
        }
        try {
            const kick = await fetchClient('/user/' + id + '/kick');
            if (kick.result_code !== 0 ||
                kick.result_code !== 0) {
                throw new Error(`There was an error kicking player.`);
            }
            alert(`This player was kicked successfully.`);
        } catch (e) {
            alert(`There was an error kicking player.`);
        } finally {
            this.getUsers();
        }
    }

    render() {
        let content = null;
        if (this.state.users === null) {
            content = (
                <Typography variant="headline" gutterBottom>
                    Loading online users...
                </Typography>
            );
        } else if (this.state.users instanceof Error) {
            content = (
                <Typography variant="headline" gutterBottom>
                    Error loading online users.
                </Typography>
            );
        } else if (this.state.users.length === 0) {
            content = (
                <Typography variant="headline" gutterBottom>
                    There are no online users.
                </Typography>
            );
        } else {
            content = (
                <div>
                    <Typography variant="headline" gutterBottom>
                        Online users
                    </Typography>
                    <List component="nav">
                        {
                            this.state.users.map(({ id, afk }) => {
                                if (afk !== true) {
                                    return (
                                        <ListItem button key={reactListKey(null)}>
                                            <ListItemIcon>
                                                <Face />
                                            </ListItemIcon>
                                            <ListItemText primary={this.state.userCache[id] ? this.state.userCache[id].name : id} secondary='Online' />
                                        </ListItem>
                                    );
                                }
                                return (
                                    <ListItem button key={reactListKey(null)}>
                                        <ListItemIcon>
                                            <Face />
                                        </ListItemIcon>
                                        <ListItemText primary={this.state.userCache[id] ? this.state.userCache[id].name : id} secondary='AFK' />
                                        <ListItemSecondaryAction>
                                            <IconButton aria-label="Kick" onClick={this.removeUser.bind(this, id)}>
                                                <RemoveCircleOutline />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                );
                            })
                        }
                    </List>
                </div>
            )
        }

        return (
            <div>
                <img src={logo} style={{ width: '100%' }} alt='Minecraft Server Logo' />
                {
                    content
                }
            </div>
        );
    }

};