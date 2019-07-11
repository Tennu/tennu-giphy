const Promise = require('bluebird');
const URL = require('url').URL;
const yargs = require('yargs');

// The name of the environment variable to check for the giphy API key
const API_KEY_ENV_VAR_NAME = 'GIPHY_API_KEY';

var TennuGiphy = {
    configDefaults: {
        'giphy': {
            // https://developers.giphy.com/docs/optional-settings/#rating
            // See also https://www.npmjs.com/package/giphy-api#phrase-search
            "minRating": "pg-13"
        },
    },
    init: function(client, imports) {

        var config = client.config("giphy");

        if (!config['api-key'] && !process.env[API_KEY_ENV_VAR_NAME]) {
            throw Error("API Key not found. config: giphy.api-key or environment variable GPIHY_API_KEY");
        }

        const apiKey = config['api-key'] || process.env[API_KEY_ENV_VAR_NAME];
        const minRating = config['minRating'];

        const giphy = require("giphy-api")(apiKey);

        const giphyHelp = '{{!}}giphy,giph,gif [-g|-pg|-pg13|-r] [<search phrase>]';
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
            
            const parsedArgs = yargs.parse(command.message);
            const hasSearchQuery = command.args.length === 0;
            
            let rating = minRating;
            if(parsedArgs.g) {
                rating = "g";
            } else if (parsedArgs.pg) {
                rating = "pg";
            } else if (parsedArgs.pg13) {
                rating = "pg13";
            } else if (parsedArgs.r) {
                rating = "r";
            }

            return Promise.try(function() {
                if (hasSearchQuery) {
                    console.debug(`Fetching '${rating}' rated random giphy`);
                    return giphy.random({
                        rating: rating
                    }).then(function(res) {
                        const urlStr = clearParams(res.data.images.original.url)
                        return formatResponse(res.data, urlStr);
                    });
                } else {
                    console.debug(`Fetching '${rating}' rated giphy search`);
                    return giphy.search({
                        q: command.args.join(' '),
                        rating: rating,
                        limit: 1
                    }).then(function(res) {
                        const urlStr = clearParams(res.data[0].images.original.url)
                        return formatResponse(res.data[0], urlStr);
                    });
                }
            })
            .catch(function(err) {
                return getErrorResponse(err.message);
            });
        }

        /**
         * Clear params from a URL instance and return as a string.
         * @param {string} url A url
         * @return {string} A url as a string.
         */        
        function clearParams(url) {
            new URL(url);
            url.search = "";
            return url.toString();
        }

        /**
         * Takes an image data object from giphy and returns a formatted string with the URL and rating.
         * @param {Object} data https://developers.giphy.com/docs/api/schema/#gif-object
         * @param {string} url A url as a string.
         * @return {String} human readable response
         */        
        function formatResponse(data, url) {
            const rating = data.rating || "unrated";
            return `Rated '${rating}' - ${url}`;
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