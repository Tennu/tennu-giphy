# tennu-gihpy

A plugin for the [tennu](https://github.com/Tennu/tennu) irc framework.

Add a slack-like Giphy command to your Tennu IRC bot.

### Commands

- **!giphy (or !gif, !giph) [<search query>]**: Get a random gif, or search for a single gif.

### Configuration

`{ "giphy": { .... `
- api-key: (can use env GIPHY_API_KEY instead)

### Installing Into Tennu

See Downloadable Plugins [here](https://tennu.github.io/plugins/).

### Tests

Set an API key and run `npm test`.