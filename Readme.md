# Cute files

This is a node.js command line utility that turns the current working directory into a pretty online file browser, available to all computers in the local network. It is an easy way to share a folder with your office buddies.

## Design and inspiration

It is based on [tutorialzine's file browser tutorial](http://tutorialzine.com/2014/09/cute-file-browser-jquery-ajax-php/). See a live demo [here](http://demo.tutorialzine.com/2014/09/cute-file-browser-jquery-ajax-php/).


[![Cute files preview](http://cdn.tutorialzine.com/wp-content/uploads/2014/09/file-and-folder-grid.jpg)](http://tutorialzine.com/2014/09/cute-file-browser-jquery-ajax-php/)


**Features:**

* Beautiful css-only design.
* Responsive and retina-ready.
* Instant file search.
* Easy to install and use.

## Installation

This utility is available on npm, so installation is a breeze. Use the **-g** flag:

```bash
npm install -g cute-files
```

## Usage

To use it, `cd` into a directory, and run `cute-files` with an optional port.

### Examples

Make the current folder available on `<yourip>:3000` on the local network:

```bash
cute-files
```

Make the current folder available on `<yourip>:12345` on the local network:

```bash
cute-files --port 12345
```

### Notes

Files starting with a dot are assumed to be private and are not served.