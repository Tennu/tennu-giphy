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
  splitMessages.shift();
  return {
    nick: 'testuser',
    message: message,
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
          assert.equal(res.indexOf('https://giphy.com/gifs/') > -1, true, 'Response did not have expetced URL components.');
          done();
        });

    });

    it('Should return URL after search', function(done) {

      var command = createCommand('!giphy hello');
      giphyHandler(command)
        .then(function(res){
          assert.equal(res.indexOf('https') > -1, true, 'Response did not seem to be a URL.');
          done();
        });

    });

  });


});
