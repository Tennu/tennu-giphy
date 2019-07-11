const assert = require('assert');
const should = require('should');
const plugin = require('../plugin.js').init({
  config: () => {
    var configDefaults = require('../plugin.js').configDefaults.giphy;
    return configDefaults;
  }
});

function createCommand(message) {
  var splitMessages = message.split(/ +/);
  return {
    nick: 'testuser',
    message: message,
    command: splitMessages.shift().toLowerCase(), // https://github.com/Tennu/tennu/blob/master/src/plugin/commands.sjs#L10
    args: splitMessages // https://github.com/Tennu/tennu/blob/master/src/plugin/commands.sjs#L9
  }
}

function getNotice(message) {
  return {
    intent: 'notice',
    query: true,
    message: message
  }
}

describe('Giphy', function() {

  describe('#giphy()', function() {

    var giphyHandler = plugin.handlers['!giphy'];

    it('Should get a random URL', function(done) {

      var command = createCommand('!giphy');
      giphyHandler(command)
        .then(function(res){
          console.debug(res);
          assert.equal(res.indexOf('https') > -1, true, 'Response did not seem to be a URL.');
          done();
        });

    });

    it('Should accept a rating argument', function(done) {

      var command = createCommand('!giphy -g');
      giphyHandler(command)
        .then(function(res){
          console.debug(res);
          assert.equal(res.indexOf('https') > -1, true, 'Response did not seem to be a URL.');
          done();
        });

    });

    it('Should return URL after search', function(done) {

      var command = createCommand('!giphy test');
      giphyHandler(command)
        .then(function(res){
          console.debug(res);
          assert.equal(res.indexOf('https') > -1, true, 'Response did not seem to be a URL.');
          done();
        });

    });

    it('Should not return URL after bogus search', function(done) {

      var command = createCommand('!giphy sdasdfasdq323rsfsgvt2');
      giphyHandler(command)
        .then(function(res){
          console.debug(res);
          assert.equal(res.message.indexOf('No gifs found matching your search.') > -1, true, 'Response did not seem to be a URL.');
          done();
        });

    });

  });


});
