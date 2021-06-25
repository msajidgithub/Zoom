const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer({
  host: 'zoom-peer1.herokuapp.com',
   key: 'peerjs',
  secure : true,
  port: '9000',
  path: "/"
})
let myVideoStream;
const myVideo = document.createElement('video')
const canvas = document.createElement('canvas')
myVideo.id = "main-video";
myVideo.muted = true

function createImage(data) {
  // var blob = new Blob(["Welcome to Websparrow.org."],
  // { type: "text/plain;charset=utf-8" });
  // saveAs(blob, "static.txt");


  data.toBlob(function(blob) {
      saveAs(blob, new Date()+".png");
  });

  // var file = new File(["Hello, world!"], "image.jpeg", {type: "image/jpeg;charset=utf-8"});
  // saveAs(file);
}


// myVideo.setAttribute("width", 320);
// myVideo.setAttribute("controls", true);
const peers = {}
myPeer.on('open', id =>{
  navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    // console.log('User Connected: ' + userId)
    setTimeout(connectToNewUser,1000,userId,stream)
  })
})
  
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}


const playStop = () => {
  console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const muteUnmute = () => {
const enabled = myVideoStream.getAudioTracks()[0].enabled;
if (enabled) {
  myVideoStream.getAudioTracks()[0].enabled = false;
  setUnmuteButton();
} else {
  setMuteButton();
  myVideoStream.getAudioTracks()[0].enabled = true;
}
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}



const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}


const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}


