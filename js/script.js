/**
 *
 */
(() => {
    const pipSupported = document.pictureInPictureEnabled;
    document.addEventListener("DOMContentLoaded", (event) => {
        let roomName, webrtc;
        const hash = window.location.hash;
        const localVideo = document.getElementById("localVideo");
        const remoteVideos = document.getElementById("remoteVideos");
        const form = document.querySelector("form");
        const loading = document.getElementById("loading");
        const fab = document.querySelector(".fixed-action-btn");

        if(hash && hash.length > 0){
            roomName = hash;
        } else {
            localVideo.hidden = true;
            fab.hidden = true;
        }

        const copyToClipboard = (text) => {
            const input = document.createElement('input');
            input.setAttribute('value', text);
            document.body.appendChild(input);
            input.select();
            const result = document.execCommand('copy');
            document.body.removeChild(input);
            return result;
        };

        const requestPIP = (el) => {
            if (!document.pictureInPictureElement) {
                el.requestPictureInPicture()
                    .catch(error => {
                        console.error(error);
                        el.hidden = false;
                    });
                el.hidden = true;
            } else {
                document.exitPictureInPicture()
                    .catch(error => {
                        console.error(error);
                    });
            }
        };

        const removePIP = (el) => {
            if(el === document.pictueInPictureElement){
                document.exitPictureInPicture()
                    .catch(error => {
                        console.error(error);
                        el.hidden = true;
                    });
                el.hidden = false;
            }
        };

        const toggleClasses = (el) => {
            el.classList.toggle("thumbnail");
            el.classList.toggle("fullscreen");
        };

        const initWebRTC = (roomName) => {
            localVideo.hidden = false;
            fab.hidden = false;
            if(roomName){
                webrtc = new SimpleWebRTC({
                    // the id/element dom element that will hold "our" video
                    localVideoEl: 'localVideo',
                    // the id/element dom element that will hold remote videos
                    remoteVideosEl: '',
                    // immediately ask for camera access
                    autoRequestMedia: true,
                    debug: true,
                    detectSpeakingEvents: true,
                    /*localVideo: {
                        autoplay: true,
                        mirror: true,
                        muted: true
                    }*/
                });

                webrtc.on('readyToCall', function () {
                    webrtc.joinRoom(roomName);
                });

                webrtc.on('videoAdded', function (video, peer) {
                    console.log('video added', peer, video);
                    if (remoteVideos) {
                        let d = document.createElement('div');
                        d.className = 'videoContainer';
                        d.id = 'container_' + webrtc.getDomId(peer);
                        d.appendChild(video);
                        let vol = document.createElement('div');
                        vol.id = 'volume_' + peer.id;
                        vol.className = 'volume_bar';
                        d.appendChild(vol);
                        remoteVideos.appendChild(d);
                        //requestPIP(localVideo);
                        video.classList.add("thumbnail");
                        toggleClasses(localVideo);
                        toggleClasses(video);
                    }
                });

                webrtc.on('videoRemoved', function (video, peer) {
                    console.log('video removed ', peer);
                    const el = document.getElementById('container_' + webrtc.getDomId(peer));
                    if (remoteVideos && el) {
                        remoteVideos.removeChild(el);
                    }
                    toggleClasses(localVideo);
                });

                M.FloatingActionButton.init(document.querySelectorAll('.fixed-action-btn'), {});

                document.getElementById("copy").onclick = () => {
                    copyToClipboard(window.location.href);
                };
                document.getElementById("exit").onclick = () => {
                    hideContent();
                };

            }
        };

        if(roomName){
            initWebRTC(roomName);
        } else {
            form.onsubmit = (e) => {
                /*e.preventDefault();
                roomName = getRoomName();
                window.history.pushState({}, "", "#" + roomName);
                initWebRTC(roomName);
                hideContent(true);*/
                window.location.href = window.location.host + window.location.pathname +  "#" + getRoomName();
            };
        }

        const getRoomName = () => {
            return document.getElementById("roomName").value;
        };

        const hideContent = (controls) => {
            if(controls){
                form.hidden = true;
            } else {
                window.location.href = "";
            }
        };

    });
})();