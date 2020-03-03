# In-app windows for Vue

Operating System-like windows for the browser. 

>"Your content first" philosophy. 

Once set up, you will hardly even notice that you use the plugin. No tight coupling of your content and the plugin (by default).


## Features

- OS-like windows right in your app
- Multiple windows can be opened
- z-index managed (active window in foreground)
- Minimize, maximize, close, move
- Reusable: put anything inside a window
- No requires / imports in your custom windows
- Define default headers to have even less work
- Open nested windows that get closed automatically


## Demo

[See it in action.](https://joe-kerr.github.io/VueInAppWindows/)


## Requirements

- Vue >= 2.6 (v-slot)
- Vuex


# Install

## Overview

```
npm install @joe_kerr/vue-in-app-windows
```

```html
<template>
   <!-- This will render all windows. -->
   <inapp-window-container default defaultHeader="default-header" />
</template>
```

```javascript
import * as windowPlugin from "@joe_kerr/vue-in-app-windows";

const myHeader = {
	name: "default-header",
	props: ["window", "funcs"],
	template: `
		<div>
			<span>{{window.title}} | </span> 
			<button @click="funcs.toggleMin()">_</button>
			<button @click="funcs.toggleMax()">[]</button>
			<button @click="funcs.close()">x</button>
		</div>`
};

const myWindow = {
	name: "my-custom-window",
	$state: {
		id: "win1",
		title: "The title of window 1",
		header: "header3",
		className: "windows dark"
	},
	props: ["window", "funcs"],
	template: `<p>Window body.</p>`
};

const someButton = {
	name: "btn1",
	template: `<button @click="$store.dispatch('windows/open', 'win1')">Open window</button>`
};

Vue.use(windowPlugin.installer, {
	windows: [myWindow],
	headers: [myHeader],
	storeNamespace: "windows", 
	componentNamespace: "$state",
	vuex: store
});

```


## Install dependency

**1)** 
```
npm install @joe_kerr/vue-in-app-windows
```

**2)**
```javascript
import * as windowPlugin from "@joe_kerr/vue-in-app-windows"; //Requires a dev environment.
```

or

```javascript
const windowPlugin = require("./where_you_put_it/dist/inAppWindows.common.min.js");
```

or

```html
<html> <script src=""./where_you_put_it/dist/inAppWindows.umd.min.js""></script>
```

## Install plugin

```javascript
import * as windowPlugin from "@joe_kerr/vue-in-app-windows";

Vue.use(windowPlugin.installer, {
	windows: [window1, window2],
	headers: [headerWin, headerMac, headerLin],
	storeNamespace: "windows", 
	componentNamespace: "$state",
	vuex: store
});

```

### windows< array > (required)

Array of components you want to use as windows. 



### headers< array >

Array of components you want to use as headers. 


### storeNamespace< string >

The namespace you want to use for store calls; e.g. this.$store.dispatch("**namespace**/open", "window1")

Default: "inAppWindows"


### componentNamespace< string >

You can provide optional custom state parameters to each of your window components such as id or title. This option determines the name of the container that holds these parameters. [See below.](#setup-window)

Default: "$state"


### vuex< object > (required)

A reference to your vuex store.


## Setup window container


```html
<template>
   <inapp-window-container default defaultHeader="default-header" />
</template>
```

The window container takes the following properties:


### defaultHeader< string >

The component name of the default header. If set, will use this component as the header for every custom window. Can be overriden by each window.

Default: none


## Setup window

This step is optional. All components provided to the "windows" config property of the installer are available as windows.

On your window components you can set some meta data via the "$state" object property as well as have two props available for querying and controlling your windows.


Notice that the $state config data will be removed by the installer and not enter the Vue instance but rather will later be available under props as "window". 


```javascript
export default {
	name: "particular-window",
	$state: {
		id: "win1",
		title: "The title of window 1",
		header: "header3",
		className: "particularWindow lightTheme"
	},
	props: ["window", "funcs"]
};
```

### $state.id< string >

The id you want this particular window to be opened with:  this.$store.dispatch("namespace/open", "**id**");

Default: name of component


### $state.title< string >

The window title.

Default: ""


### $state.header< string >

Use this header component, you have installed previously, for this window. Provide an empty string if you want to provide an individual header within your window component.

Default: use default header


### $state.className< string >

Add this class (for multiple, separate with space) to the outer window, i.e. the div that contains your window's body and header.

Default: ""


### window (read-only)
- window.id< string >
- window.title< string >
- window.className< string >
- window.header< string >
- window.minimized< bool >
- window.maximized< bool >
- window.x< int >
- window.y< int >
- window.w< int >
- window.h< int >


### funcs.close()< function >

Close this window.


### funcs.move(x< int >, y< int >)< function >

Move window to these coordinates. 


### funcs.toggleMax()< function >

Toggles window.maximized and makes this window fill the screen or resets it to the previous dimensions.


### funcs.toggleMin()< function >

Toggles window.minimized. If the window has a header, toggleMin will hide its body.


### funcs.openChild(id< string|object >)< function >

Opens a child window from the window the function is called in. Windows can be nested. Closing any parent window automatically closes all child windows.

The function parameters are the same as in the [store call](#control-windows) for opening a regular window.


# Use

## Control windows

Windows are controlled via Vuex store calls.

### ...dispatch("namespace/open", "windowId")
### ...dispatch("namespace/open", {id: "windowId", context: someData, x: xPosition, y: yPosition)

Open a window.

The context property will be made available to your particular window component to the "window" props property.


### ...dispatch("namespace/close", "windowId")

Close a window.



## Style

A few inline styles are necessary (such as top or left) to make the window behave as such.

The available classes are:

- #inapp-window_{{windowId}}
- .inapp-window 
- .inapp-window_header 
- .inapp-window_body 
- .inapp-window_transition


# Notes

- The functions ensuring that a window stays within the viewport or page are going to be outsourced at some point. It is a cross-concern feature for everything "moving" and has grown enough to justify it as own module. The feature will likely be removed entirely and might be made available as injectable service as a plugin config option.


# Versions

### 1.0.2
- Changed: Some minor package changes.
- Changed: Added further tests for store mutation.
- Fixed: If a height was applied to the window, it was not properly minimized.

### 1.0.1
- Fixed: Replaced for-in loop with for loop.

### 1.0.0
- Public release.


# Copyright

MIT (c) Joe Kerr 2019


