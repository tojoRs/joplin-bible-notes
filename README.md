# Joplin Bible Notes Plugin

This plugin scans your notes to find where you specified a Bible reference.

## Why ?

As I realized I had a lot of notes referencing Bible verses and passages, I wanted an easy way to find where in my notes I mentioned a particular Book or verse of the Bible. Yeah, the search function could have done it, but it didn't give me an overall view in the Bible of what I have already treated and what not.

# Development

## Project Structure

-   `src/BibleNotes.ts` Main plugin functionality
-   `src/index.ts` Plugin bootstrap
-   `src/manifest.json`, which is the plugin manifest. It contains information such as the plugin a name, version, etc.
	`test`, This is where you'll find the test files

## Building the plugin

The plugin is built using Webpack, which creates the compiled code in `/dist`. A JPL archive will also be created at the root, which can use to distribute the plugin.

To build the plugin, simply run `npm run dist`.
To run the tests, it's `npm run test`.

The project is setup to use TypeScript, although you can change the configuration to use plain JavaScript.

## Updating the plugin framework

To update the plugin framework, run `npm run update`.

In general this command tries to do the right thing - in particular it's going to merge the changes in package.json and .gitignore instead of overwriting. It will also leave "/src" as well as README.md untouched.

The file that may cause problem is "webpack.config.js" because it's going to be overwritten. For that reason, if you want to change it, consider creating a separate JavaScript file and include it in webpack.config.js. That way, when you update, you only have to restore the line that include your file.

## Licensing

MIT License

***

For now, this plugin uses [Bible Passage Reference Parser](https://github.com/openbibleinfo/Bible-Passage-Reference-Parser) to scan the notes for Bible references. Thanks to the author !
