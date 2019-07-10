const Promise = require('bluebird');
const URL = require('url').URL;

// The name of the environment variable to check for the giphy API key
const API_KEY_ENV_VAR_NAME = 'GIPHY_API_KEY';

var TennuGiphy = {
    configDefaults: {
        'giphy': {},
    },
    init: function(client, imports) {

        var config = client.config("giphy");

        if (!config['api-key'] && !process.env[API_KEY_ENV_VAR_NAME]) {
            throw Error("API Key not found. config: giphy.api-key or environment variable GPIHY_API_KEY");
        }

        const apiKey = config['api-key'] || process.env[API_KEY_ENV_VAR_NAME];

        const giphy = require("giphy-api")(apiKey);

        const giphyHelp = '{{!}}giphy,giph,gif [<search phrase>]';
        const helps = {
            'giphy': [
                giphyHelp
            ],
            'giph': [
                giphyHelp
            ],
            'gif': [
                giphyHelp
            ]
        };

        function getErrorResponse(message) {
            return {
                intent: 'notice',
                query: true,
                message: message
            };
        }

        var giphyCommand = function(command) {
            return Promise.try(function() {
                if (command.args.length === 0) {
                    return giphy.random().then(function(res) {
                        return res.data.url;
                    });
                }
                else {
                    return giphy.search({
                        q: command.args.join(' '),
                        limit: 1
                    }).then(function(res) {
                        const url = new URL(res.data[0].images.original.url);
                        url.search = ""; // Clear all query string params
                        return url.toString();
                    });
                }
            })
            .catch(function(err) {
                return getErrorResponse(err.message);
            });
        }

        return {

            handlers: {
                '!giphy': giphyCommand,
                '!giph': giphyCommand,
                '!gif': giphyCommand
            },

            help: helps,

            commands: ['giphy', 'giph', 'gif']
        }
    }
};

module.exports = TennuGiphy;
