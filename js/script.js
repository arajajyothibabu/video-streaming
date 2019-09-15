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

        const toggleBackground = (flag = true) => {
            document.body.classList.toggle("radient", flag);
        };

        if(hash && hash.length > 0){
            roomName = hash;
            toggleBackground();
        } else {
            localVideo.hidden = true;
            fab.hidden = true;
            document.getElementById("roomName").value = Math.random().toString(36).slice(-8);
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
                    copyToClipboard(window.location.href);
                    M.toast({html: 'Share this link to invite.'});
                    hideContent(true);
                });

                webrtc.on('videoAdded', function (video, peer) {
                    console.log('video added', peer, video);
                    if (remoteVideos) {
                        while (remoteVideos.firstChild){
                            remoteVideos.removeChild(remoteVideos.firstChild);
                        }
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
                        if(localVideo.classList.contains("fullscreen")){
                            toggleClasses(localVideo);
                        }
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

                if(!navigator.share){
                    const actions = document.getElementById("actions");
                    actions.removeChild(actions.getElementsByTagName("li")[0]);
                } else {
                    document.getElementById("share").onclick = () => {
                        if(navigator.share){
                            let url = document.location.href;
                            navigator.share({url: url});
                        }
                    }
                }

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
                e.preventDefault();
                window.location.href = window.location.href +  "#" + getRoomName();
                window.location.reload();
            };
        }

        const getRoomName = () => {
            return document.getElementById("roomName").value;
        };

        const hideContent = (controls) => {
            if(controls){
                form.hidden = true;
                toggleBackground();
            } else {
                window.location.href = "";
                form.hidden = false;
                toggleBackground(false);
            }
        };

    });
})();