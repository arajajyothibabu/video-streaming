/**
 *
 */
(() => {
    const pipSupported = document.pictureInPictureEnabled;
    document.addEventListener("DOMContentLoaded", (event) => {
        let roomName, webrtc;
        const hash = window.location.hash;
        if(hash && hash.length > 0){
            roomName = hash;
        }
        const getRoomName = () => {
            return document.getElementById("roomName").value;
        };
        const localVideo = document.getElementById("localVideo");
        const remoteVideos = document.getElementById("remoteVideos");

        const requestPIP = (el) => {
            if (!document.pictureInPictureElement) {
                el.requestPictureInPicture()
                    .catch(error => {
                        console.error(error);
                    });
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
                    });
            }
        };

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
                    video.onclick = function () {
                        video.style.width = video.videoWidth + 'px';
                        video.style.height = video.videoHeight + 'px';
                    };
                    d.appendChild(vol);
                    remoteVideos.appendChild(d);
                }
            });

            webrtc.on('videoRemoved', function (video, peer) {
                console.log('video removed ', peer);
                const el = document.getElementById('container_' + webrtc.getDomId(peer));
                if (remoteVideos && el) {
                    remoteVideos.removeChild(el);
                }
            });

        }
    });
})();