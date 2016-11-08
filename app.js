require('@mohayonao/web-audio-api-shim/light');
var request = require('basic-browser-request');
// var sb = require('standard-bail')();
var handleError = require('./handle-error');
var waterfall = require('async-waterfall');
var callNextTick = require('call-next-tick');

var audioContext;

((function go() {
  audioContext = new AudioContext();

  waterfall(
    [
      getAudio,
      decode,
      startLoops
    ],
    handleError
  );
})());

function getAudio(done) {
  getAudioBuffer('http://localhost:9966/itsgonnarain.mp3', done);
}

function decode(buffer, done) {
  audioContext.decodeAudioData(buffer, weirdCallback);

  function weirdCallback(decoded) {
    done(null, decoded);
  }
}

function startLoops(decodedBuffer, done) {
  play(decodedBuffer, -1, 1);
  play(decodedBuffer, 1, 1.002);
  callNextTick(done);
}

function play(decodedBuffer, pan = 0, rate = 1) {
  var sourceNode = audioContext.createBufferSource();
  var pannerNode = audioContext.createStereoPanner();

  pannerNode.connect(audioContext.destination);
  sourceNode.connect(pannerNode);

  pannerNode.pan.value = pan;

  sourceNode.buffer = decodedBuffer;
  sourceNode.loop = true;
  sourceNode.loopStart = 2.98;
  sourceNode.loopEnd = 3.80;
  sourceNode.playbackRate.value = rate;

  sourceNode.start(0, 2.98);
}

function getAudioBuffer(url, done) {
  var opts = {
    url: url,
    method: 'GET',
    binary: true
  };
  request(opts, done);
}
