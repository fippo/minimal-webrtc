/*
 *  Copyright (c) 2014 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

var localConnection;
var sendChannel;
var receiveChannel;
var pcConstraint;
var dataConstraint;
var dataChannelSend = document.querySelector('textarea#dataChannelSend');
var dataChannelReceive = document.querySelector('textarea#dataChannelReceive');
var startButton = document.querySelector('button#startButton');
var sendButton = document.querySelector('button#sendButton');
var answerButton = document.querySelector('button#answerButton');
var closeButton = document.querySelector('button#closeButton');
var paste = document.getElementById('pasteit');
var send = document.getElementById('sendit');

startButton.onclick = createConnection;
answerButton.onclick = setAnswer;
sendButton.onclick = sendData;
closeButton.onclick = closeDataChannels;

function enableStartButton() {
  startButton.disabled = false;
}

function disableSendButton() {
  sendButton.disabled = true;
}

function createConnection() {
  dataChannelSend.placeholder = '';
  var servers = {
    iceServers: [
      {username: "1427391317", credential: "yaRtZa0/GJOmOHy4ONLI3kHCJ6E=", url: "turn:104.130.195.95"}
    ],
    iceTransports: 'relay'
  };
  pcConstraint = null;
  dataConstraint = null;
  trace('Using SCTP based data channels');
  // SCTP is supported from Chrome 31 and is supported in FF.
  // No need to pass DTLS constraint as it is on by default in Chrome 31.
  // For SCTP, reliable and ordered is true by default.
  // Add localConnection to global scope to make it visible from the browser console.
  window.localConnection = localConnection =
      new RTCPeerConnection(servers, pcConstraint);
  trace('Created local peer connection object localConnection');

  sendChannel = localConnection.createDataChannel('sendDataChannel',
      dataConstraint);
  trace('Created send data channel');

  localConnection.onicecandidate = iceCallback1;
  localConnection.ondatachannel = receiveChannelCallback;
  sendChannel.onopen = onSendChannelStateChange;
  sendChannel.onclose = onSendChannelStateChange;

  if (!pasteit.value) {
    localConnection.createOffer(gotDescription1, onCreateSessionDescriptionError);
  } else {
    localConnection.setRemoteDescription(new RTCSessionDescription(expand(pasteit.value)),
      function () {
        console.log('yay');
        localConnection.createAnswer(gotDescription2,
                                     onCreateSessionDescriptionError);
      },
      function (err) {
        console.log('nay', err);
      }
    );
  }
  startButton.disabled = true;
  closeButton.disabled = false;
}

function setAnswer() {
  answerButton.disabled = true;
  localConnection.setRemoteDescription(new RTCSessionDescription(expand(paste.value)));
}

function onCreateSessionDescriptionError(error) {
  trace('Failed to create session description: ' + error.toString());
}

function sendData() {
  var data = dataChannelSend.value;
  sendChannel.send(data);
  trace('Sent Data: ' + data);
}

function closeDataChannels() {
  trace('Closing data channels');
  sendChannel.close();
  trace('Closed data channel with label: ' + sendChannel.label);
  receiveChannel.close();
  trace('Closed data channel with label: ' + receiveChannel.label);
  localConnection.close();
  localConnection = null;
  trace('Closed peer connections');
  startButton.disabled = false;
  sendButton.disabled = true;
  closeButton.disabled = true;
  dataChannelSend.value = '';
  dataChannelReceive.value = '';
  dataChannelSend.disabled = true;
  disableSendButton();
  enableStartButton();
}

function gotDescription1(desc) {
  localConnection.setLocalDescription(desc);
}

function gotDescription2(desc) {
  localConnection.setLocalDescription(desc);
}

function iceCallback1(event) {
  trace('local ice callback');
  if (!event.candidate) {
    answerButton.disabled = !(localConnection.localDescription.type === 'offer');
    var min = reduce(localConnection.localDescription);
    console.log('offer', min.length, min);
    send.innerText = min;
  }
}

function onAddIceCandidateSuccess() {
  trace('AddIceCandidate success.');
}

function onAddIceCandidateError(error) {
  trace('Failed to add Ice Candidate: ' + error.toString());
}

function receiveChannelCallback(event) {
  trace('Receive Channel Callback');
  receiveChannel = event.channel;
  receiveChannel.onmessage = onReceiveMessageCallback;
  receiveChannel.onopen = onReceiveChannelStateChange;
  receiveChannel.onclose = onReceiveChannelStateChange;
}

function onReceiveMessageCallback(event) {
  trace('Received Message');
  dataChannelReceive.value = event.data;
}

function onSendChannelStateChange() {
  var readyState = sendChannel.readyState;
  trace('Send channel state is: ' + readyState);
  if (readyState === 'open') {
    dataChannelSend.disabled = false;
    dataChannelSend.focus();
    sendButton.disabled = false;
    closeButton.disabled = false;
  } else {
    dataChannelSend.disabled = true;
    sendButton.disabled = true;
    closeButton.disabled = true;
  }
}

function onReceiveChannelStateChange() {
  var readyState = receiveChannel.readyState;
  trace('Receive channel state is: ' + readyState);
}
