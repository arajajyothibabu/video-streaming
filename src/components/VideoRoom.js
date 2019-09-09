import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Video from "./Video";
import SimpleWebRTC from 'simplewebrtc';

function initWebRTC(room = "jyothi") {
    const webrtc = new SimpleWebRTC({
        // the id/element dom element that will hold "our" video
        localVideoEl: 'localVideo',
        // the id/element dom element that will hold remote videos
        remoteVideosEl: 'remoteVideo',
        // immediately ask for camera access
        autoRequestMedia: true,
        debug: true,
        detectSpeakingEvents: true
    });

    webrtc.on('readyToCall', function () {
        // you can name it anything
        webrtc.joinRoom(room);
    });

    webrtc.on('videoAdded', function (video, peer) {
        document.getElementById("remoteVideo").appendChild(video);
    });

}

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

export default function VideoRoom() {
    const classes = useStyles();

    useEffect(() => {
        const room = window.location.hash;
        initWebRTC(room);
        console.log(document.getElementById("localVideo"));
    }, []);

    return (
        <div className={classes.root}>
            <Grid container spacing={0}>
                <Grid item xs={6}>
                    <Video id="localVideo"/>
                </Grid>
                <Grid item xs={6}>
                    <Video id="remoteVideo"/>
                </Grid>
            </Grid>
        </div>
    );
}