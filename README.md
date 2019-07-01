# tennu-gihpy

A plugin for the [tennu](https://github.com/Tennu/tennu) irc framework.

Add a slack-like Giphy command to your Tennu IRC bot.

- Docs https://developers.giphy.com/docs/api/
- Client https://www.npmjs.com/package/giphy-api

### Commands

- **!giphy (or !gif, !giph) [<search query>]**: Get a random gif, or search for a single gif.

### Configuration

`{ "giphy": { .... `
- api-key: (can use env GIPHY_API_KEY instead)

### Installing Into Tennu

See Downloadable Plugins [here](https://tennu.github.io/plugins/).

### Tests

Set an API key and run `npm test`.


### TODO

- Add support for rating in the config.