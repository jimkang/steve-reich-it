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
      play
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

function play(decodedBuffer, done) {
  var sourceNode = audioContext.createBufferSource();
  sourceNode.buffer = decodedBuffer;
  sourceNode.connect(audioContext.destination);
  sourceNode.start();  
  callNextTick(done);
}

function getAudioBuffer(url, done) {
  var opts = {
    url: url,
    method: 'GET',
    binary: true
  };
  request(opts, done);
}
