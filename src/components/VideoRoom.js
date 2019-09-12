import React, { useEffect, useCallback, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Video from "./Video";
import SimpleWebRTC from 'simplewebrtc';
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider/Divider";

function initWebRTC(room = "jyothi") {
    if(!window._webrtc){
        const peers = new Set();
        const webrtc = window._webrtc = new SimpleWebRTC({
            // the id/element dom element that will hold "our" video
            localVideoEl: 'localVideo',
            // the id/element dom element that will hold remote videos
            remoteVideosEl: 'remoteVideo',
            // immediately ask for camera access
            autoRequestMedia: true,
            debug: true,
            detectSpeakingEvents: true,
            localVideo: {
                autoplay: true,
                mirror: false,
                muted: true
            }
        });

        webrtc.on('readyToCall', function () {
            // you can name it anything
            webrtc.joinRoom(room);
        });

        const remoteVideosContainer = document.getElementById("remoteVideos");

        if(!remoteVideosContainer){
            return;
        }

        let inPIP = false;

        webrtc.on('videoAdded', function (video, peer) {
            if(!peers.has(peer.id)){
                video.setAttribute("controls", "");
                remoteVideosContainer.appendChild(video);
                peers.add(peer.id);
            }

            const localVideo = document.getElementById("localVideo");



            if ('pictureInPictureEnabled' in document) {
                if(!inPIP){
                    try {
                        if (localVideo !== document.pictureInPictureElement) {
                            localVideo.requestPictureInPicture();
                        }
                    } catch(error) {
                        console.error(`> Argh! ${error}`);
                    }
                    if(localVideo === document.pictureInPictureElement){
                        inPIP = true;
                        localVideo.hidden = true;
                    }
                }
            }

        });

        webrtc.on('videoRemoved', function (video, peer) {
            if(peers.has(peer.id)){
                remoteVideosContainer.removeChild(video);
                peers.delete(peer.id);
            }

            const localVideo = document.getElementById("localVideo");

            if(localVideo && inPIP){
                try {
                    if (localVideo === document.pictureInPictureElement) {
                        document.exitPictureInPicture();
                        localVideo.hidden = false;
                    }
                } catch(error) {
                    console.error(`> Argh! ${error}`);
                }
                if(localVideo !== document.pictureInPictureElement){
                    inPIP = false;
                    localVideo.hidden = false;
                }
            }
        });
    }
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
    localVideo: {

    }
}));

export default function VideoRoom() {
    const classes = useStyles();
    let hasPeer = false;

    useEffect(() => {
        const room = window.location.hash;
        initWebRTC(room);
        const remoteVideos = document.getElementById("remoteVideos");
        hasPeer = !!remoteVideos.firstChild;
    }, []);

    return (
        <div className={classes.root}>
            <Grid container spacing={0}>
                <Grid item xs>
                    <SourceVideo hasPeer classes={classes}/>
                    <Divider />
                    <div id="remoteVideos"/>
                </Grid>
            </Grid>
        </div>
    );
}

function SourceVideo({classes, hasPeer = false}) {

    useEffect(() => {
        const log = console.log;
        let pipWindow;

        const togglePipButton = document.getElementById("pipButton");
        const video = document.getElementById("localVideo");

        log(togglePipButton, video);

        if(!video || !togglePipButton){
            return;
        }

        video.addEventListener('enterpictureinpicture', function(event) {
            log('> Video entered Picture-in-Picture');

            pipWindow = event.pictureInPictureWindow;
            log(`> Window size is ${pipWindow.width}x${pipWindow.height}`);

            pipWindow.addEventListener('resize', onPipWindowResize);
        });

        video.addEventListener('leavepictureinpicture', function(event) {
            log('> Video left Picture-in-Picture');

            pipWindow.removeEventListener('resize', onPipWindowResize);
        });

        function onPipWindowResize(event) {
            log(`> Window size changed to ${pipWindow.width}x${pipWindow.height}`);
        }

        /* Feature support */
    });



    return(
        <div>
            <video className={classes.localVideo} id="localVideo" autoPlay controls/>
        </div>
    )
}