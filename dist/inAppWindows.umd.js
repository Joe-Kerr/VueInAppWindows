(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["inAppWindows"] = factory();
	else
		root["inAppWindows"] = factory();
})((typeof self !== 'undefined' ? self : this), function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fae3");
/******/ })
/************************************************************************/
/******/ ({

/***/ "f6fd":
/***/ (function(module, exports) {

// document.currentScript polyfill by Adam Miller

// MIT license

(function(document){
  var currentScript = "currentScript",
      scripts = document.getElementsByTagName('script'); // Live NodeList collection

  // If browser needs currentScript polyfill, add get currentScript() to the document object
  if (!(currentScript in document)) {
    Object.defineProperty(document, currentScript, {
      get: function(){

        // IE 6-10 supports script readyState
        // IE 10+ support stack trace
        try { throw new Error(); }
        catch (err) {

          // Find the second match for the "at" string to get file src url from stack.
          // Specifically works with the format of stack traces in IE.
          var i, res = ((/.*at [^\(]*\((.*):.+:.+\)$/ig).exec(err.stack) || [false])[1];

          // For all scripts on the page, if src matches or if ready state is interactive, return the script tag
          for(i in scripts){
            if(scripts[i].src == res || scripts[i].readyState == "interactive"){
              return scripts[i];
            }
          }

          // If no match, return null
          return null;
        }
      }
    });
  }
})(document);


/***/ }),

/***/ "fae3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var getters_namespaceObject = {};
__webpack_require__.r(getters_namespaceObject);
__webpack_require__.d(getters_namespaceObject, "getArrayElWIdxByIdFactory", function() { return getArrayElWIdxByIdFactory; });
var mutations_namespaceObject = {};
__webpack_require__.r(mutations_namespaceObject);
__webpack_require__.d(mutations_namespaceObject, "setPropVal", function() { return setPropVal; });
__webpack_require__.d(mutations_namespaceObject, "setProps", function() { return setProps; });
__webpack_require__.d(mutations_namespaceObject, "setArrayElPropsByIdFactory", function() { return setArrayElPropsByIdFactory; });
var actions_namespaceObject = {};
__webpack_require__.r(actions_namespaceObject);
__webpack_require__.d(actions_namespaceObject, "passThruActionsFactory", function() { return passThruActionsFactory; });

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  if (true) {
    __webpack_require__("f6fd")
  }

  var setPublicPath_i
  if ((setPublicPath_i = window.document.currentScript) && (setPublicPath_i = setPublicPath_i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/))) {
    __webpack_require__.p = setPublicPath_i[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// CONCATENATED MODULE: ./projects/plugins/inAppWindows/node_modules/cats4vue/src/index.js
/*
Eg:
const defs = {
	prop: {
		type: "string", default: "NS", required: true
	}
};
*/
function configParser(config={}, defaults={}) {
	const result = {};
	for(const name in defaults) {
		const defProp = defaults[name];
		const actualProp = config[name];
		
		const defType = defProp.type;
		const actualType = typeof actualProp;
		
		const isRequired = defProp.required;
		const isProvided = name in config;
		
		if(typeof defType === "undefined") {throw new Error("type property on default is missing");}
		
		if(isRequired && !isProvided) {throw new Error("Config property '"+name+"' is required but not provided.");}
		
		if(isProvided && defType !== null && actualType !== defType) {throw new Error("Config property '"+name+"' must be of type '"+defType+"' but is of type '"+actualType+"'.");}
				
		result[name] = (isProvided) ? actualProp : defProp.default;
	}
	
	const mismatch = [];
	for(const name in config) {
		if(!(name in defaults)) {mismatch.push(name);}
	}
	if(mismatch.length > 0) {console.warn("The following config property was / properties were provided for which no defaults exist: "+mismatch.toString());}
	
	return result;
}

//https://vuejs.org/v2/style-guide/#Private-property-names-essential
function isValidPrivateProperty(prop) {
	return (prop[0] === "$") && (prop[1] === "_") && (prop.substring(2).indexOf("_") > -1);
}

function isValidRootProperty(prop, throwInsteadOfReturn=false) {
	if(typeof prop !== "string") {
		if(throwInsteadOfReturn === true) {
			throw new Error("Tried to write a non-string property to the object root.");
		}
		return false;
	}
	
	//https://vuejs.org/v2/api/#Options-Data (left panel)
	const reserved = [
		"data", 
		"props", 
		"propsData", 
		"computed", 
		"methods", 
		"watch", 
		"el", 
		"template", 
		"render", 
		"renderError", 
		"beforeCreate", 
		"created", 
		"beforeMount", 
		"mounted", 
		"beforeUpdate", 
		"updated", 
		"activated", 
		"deactivated", 
		"beforeDestroy", 
		"destroyed", 
		"errorCaptured", 
		"directives", 
		"filters", 
		"components", 
		"parent", 
		"mixins", 
		"extends", 
		"provide", 
		"inject", 
		"name", 
		"delimiters", 
		"functional", 
		"model", 
		"inheritAttrs", 
		"comments"	
	];
	const check = (reserved.indexOf(prop) === -1);
	
	if(check === false && throwInsteadOfReturn === true) {
		throw new Error("Adding property to object root failed. '"+prop+"' is a reserved Vue property.");
	}
	
	return check;
}

function componentOptionsWriter(component, componentOptions) {
	for(const name in componentOptions) {
		if(name in component) {
			throw new Error("Tried to write property on component that already exists: "+name);
		}
		
		if(!isValidPrivateProperty(name)) {
			throw new Error("Private property names should be in the form of: $_namespace_propertyName. This is important especially for plugins in order to avoid name collisions. See also https://vuejs.org/v2/style-guide/#Private-property-names-essential");
		}

		component[name] = componentOptions[name];
	}
}

function renameComponent(component, name) {
	if(typeof name !== "string") {
		throw new Error("'name' parameter must be of type string. Got: "+typeof name);
	}
	
	if(typeof component !== "object" || !("name" in component)) {
		throw new Error("'component' parameter must be an object with the property name.");
	}
	
	component.name = name;
}

function registerVuexModule(vuex, namespace, vuexModule) {
	if(typeof namespace !== "string") {
		throw new Error("namespace parameter must be of type string.");
	}	
	
	if(typeof vuexModule !== "object") {
		throw new Error("module parameter must be of type object.");
	}
	
	const haveAtLeastOne = ["state", "getters", "mutations", "actions", "modules"];
	let hasHowMany = 0;
	haveAtLeastOne.forEach((prop)=>{
		if(vuexModule.hasOwnProperty(prop)) {hasHowMany++}
	});
	
	if(hasHowMany === 0) {
		throw new Error("Vuex module is of unexpected structure. Expected to see at least one of: "+haveAtLeastOne.toString(","));
	}
	
	if(typeof vuex === "undefined" || typeof vuex.dispatch === "undefined") {
		throw new Error(`Plugin ${namespace} requires vuex instance as config parameter: Vue.use(${namespace}, {vuex: instanceOfVuex}).`);
	}		
	
	vuex.registerModule(namespace, vuexModule);
}

function ensureVersion(Vue, minVersion, options={}) {
	if(!("version" in Vue)) {
		throw new Error("The version property is missing on the Vue instance.");
	}
	
	if(Vue.version.replace(/[0-9\.]/g, "").length > 0) {
		throw new Error("Vue version is not in a dot-separated format. Got: "+Vue.version);
	}
		
	if((""+minVersion).replace(/[0-9\.]/g, "").length > 0) {
		throw new Error("The required version is not in a dot-separated format. Got: "+Vue.version);
	}
	
	const vueVersion = Vue.version.split(".").map((subver)=>parseInt(subver));
	const reqVersion = minVersion.split(".").map((subver)=>parseInt(subver));
	const throwInsteadOfReturn = (options.throwInsteadOfReturn !== undefined) ? options.throwInsteadOfReturn : false;
	let result = true;
	
	//Below loop can return before recognising invalid number.
	reqVersion.forEach((subver)=>{
		if(typeof subver !== "number" || isNaN(subver)) {
			throw new Error("The required version is not in the format x, x.y or x.y.z. Got: "+minVersion);
		}
	});
	
	if(reqVersion.length > 3 || reqVersion.length < 1) {
		throw new Error("The required version is not in the format x, x.y or x.y.z. Got: "+minVersion);
	}
	
	for(let i=0, ii=reqVersion.length; i<ii; i++) {
		const actual = vueVersion[i];
		const expected = reqVersion[i];
		
		if(actual === expected) {
			continue;
		}
		
		result = (actual < expected) ? false : true;
		break;
	}
	
	if(result === false && throwInsteadOfReturn === true) {
		throw new Error("You do not have the required Vue version of "+minVersion+". You have: "+Vue.version);
	}
	
	return result;
}

const cats4Vue = {
	configParser, 
	isValidPrivateProperty, 
	isValidRootProperty,
	componentOptionsWriter, 
	renameComponent, 
	registerVuexModule,
	ensureVersion
};

/* harmony default export */ var src = (cats4Vue);
// CONCATENATED MODULE: ./projects/plugins/inAppWindows/node_modules/vuex-heman/src/getters.js
function getArrayElWIdxById(container, index, noResult) {
	return (id) => {
		const idx = index[id];
		
		if(typeof idx !== "number") {
			return noResult;
		}

		return container[idx];
	}
}

const getArrayElWIdxByIdFactory = function getArrayElWIdxByIdFactory(settings={}) {
	const container = settings.container || "container";
	const index = settings.index || "index";
	const noResult = ("noResult" in settings) ? settings.noResult : null;
	
	return function generatedGetArrayElWIdxById(state) {

		if(typeof state[index] !== "object") {
			throw new Error("Name of index does not point to an object in state: "+index);
		} 
		
		if(typeof state[container] !== "object") {
			throw new Error("Name of container does not point to an object in state: "+container);
		} 	
		
		return getArrayElWIdxById(state[container], state[index], noResult);
	}
}
// CONCATENATED MODULE: ./projects/plugins/inAppWindows/node_modules/vuex-heman/src/mutations.js
const setPropVal = function setPropVal(state, data) {	
	if(typeof data === "undefined" || !("prop" in data) || !("val" in data)) {
		throw new Error("Missing property on data parameter: provide 'prop' and 'val'.");
	}
	
	if(!(data.prop in state)) {
		throw new Error("Tried to set non-existing property: "+data.prop);
	}
	
	state[data.prop] = data.val;
}

const setProps = function setProps(state, data) {
	const err = [];
	for(const prop in data) {
		if(!(prop in state)) {
			err.push(prop);
			continue;
		}
		state[prop] = data[prop];
	}

	if(err.length > 0) {
		throw new Error("Tried to set at least one non-existing property: "+err.join(","));
	}	
}

function setArrayElPropsById(container, index, props) {
	const id = props.id;
	if(typeof id === "undefined") {
		throw new Error("Missing id on data parameter.");
	}
	
	const idx = index[id]
	if(typeof idx === "undefined") {
		throw new Error("Id not found in index while setting prop/s on element: "+JSON.stringify(props));
	}

	const el = container[idx];
	const err = [];
	delete props.id;
	
	for(const p in props) {
		if(p in el)  {
			el[p] = props[p];
		}
		else {
			err.push(p);
		}
	}
	
	if(err.length > 0) {
		throw new Error("Tried to set at least one non-existing property: "+err.toString(","));
	}
}

const setArrayElPropsByIdFactory = function setArrayElPropsByIdFactory(settings={}) {
	const container = settings.container || "container";
	const index = settings.index || "index";
	
	return function generatedSetArrayElPropsById(state, data) {	
		
		if(typeof state[index] !== "object") {
			throw new Error("Name of index does not point to an object in state: "+index);
		} 
		
		if(typeof state[container] !== "object") {
			throw new Error("Name of container does not point to an object in state: "+container);
		} 		
		
		setArrayElPropsById(state[container], state[index], data);
	}	
}
// CONCATENATED MODULE: ./projects/plugins/inAppWindows/node_modules/vuex-heman/src/actions.js
function passThruAction(command, store, data) {store.commit(command, data);}

const passThruActionsFactory = function passThruActionsFactory(names) {
	
	if(typeof names === "string") {
		return function generatedPassThruAction(store, data) {
			passThruAction(names, store, data);
		}
	}
	
	if(names instanceof Array) {
		const obj = {};
		names.forEach((name)=>{			
			if(typeof name !== "string") {
				throw new Error("Expected element of array to be of type string. Got: "+typeof name);
			}
			obj[name] = function generatedPassThruAction(store, data) {
				passThruAction(name, store, data);
			}			
		});
		return obj;
	}
	
	if(typeof names === "object") {
		for(const name in names) {
			const methodName = name;
			const commandName = names[name];			
			names[methodName] = function generatedPassThruAction(store, data) {
				passThruAction(commandName, store, data);
			}
		}	
		return names;
	}
	
	throw new Error("Expected parameter to be of type string, object or array. Got: "+typeof names);
}
// CONCATENATED MODULE: ./projects/plugins/inAppWindows/node_modules/vuex-heman/src/index.js




const getters = getters_namespaceObject;
const mutations = mutations_namespaceObject;
const actions = actions_namespaceObject;

const vuexHeman = {
	getters, 
	mutations,
	actions
}

/* harmony default export */ var vuex_heman_src = (vuexHeman);





// CONCATENATED MODULE: ./projects/plugins/inAppWindows/src/IWindow.js
function IWindow() {
  return {
    id: "string",
    name: "string",
    header: "string",
    title: "string",
    context: null,
    zIndex: "number",
    x: "number",
    y: "number",
    w: null,
    h: null,
    className: "string",
    opened: "boolean",
    minimized: "boolean",
    maximized: "boolean"
  };
}
// CONCATENATED MODULE: ./projects/plugins/inAppWindows/src/store/windows.js
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



/* harmony default export */ var windows = ({
  namespaced: true,
  state: {
    init: false,
    windows: [],
    index: {},
    defaultHeader: "",
    highestZ: 40001,
    startingZ: 40001
  },
  getters: {
    windows: function windows(state) {
      return state.windows;
    }
  },
  mutations: {
    set: mutations.setArrayElPropsByIdFactory({
      container: "windows"
    }),
    setState: mutations.setPropVal,
    addWindows: function addWindows(state, data) {
      if (state.init) {
        return false;
      }

      var wins = data.windows;

      for (var i = 0, ii = wins.length; i < ii; i++) {
        if (typeof wins[i].id === "undefined" || typeof wins[i].name === "undefined") {
          throw new Error("Missing property on data. Require at least id and name. Got: " + JSON.stringify(wins[i]));
        }

        if (typeof state.index[wins[i].id] !== "undefined") {
          throw new Error("Tried to add window with existing id: " + wins[i].id);
        }

        var win = IWindow();
        win.id = wins[i].id;
        win.name = wins[i].name;
        win.title = wins[i].title || "";
        win.header = typeof wins[i].header === "undefined" ? state.defaultHeader : wins[i].header;
        win.className = wins[i].className || "";
        win.opened = false;
        win.minimized = false;
        win.maximized = false;
        win.context = null;
        win.zIndex = state.startingZ;
        win.x = 1;
        win.y = 1;
        win.w = null;
        win.h = null;
        var idx = state.windows.push(win) - 1;
        state.index[wins[i].id] = idx;
      }

      state.init = true;
      return true;
    }
  },
  actions: _objectSpread({}, actions.passThruActionsFactory(["set", "setState"]), {
    open: function open(store, data) {
      var id = typeof data === "string" ? data : data.id;
      var commit = {
        id: id,
        "opened": true
      };
      store.dispatch("moveIntoForeground", id);

      if (typeof data.context !== "undefined") {
        commit.context = data.context;
      }

      store.commit("set", commit);
    },
    close: function close(store, data) {
      store.commit("set", {
        id: data,
        opened: false,
        context: null
      });
    },
    moveIntoForeground: function moveIntoForeground(store, data) {
      var z = store.state.highestZ + 1;
      store.commit("set", {
        id: data,
        "zIndex": z
      });
      store.commit("setState", {
        prop: "highestZ",
        val: z
      });
    },
    init: function init(store, data) {
      if (store.state.init) {
        return false;
      }

      ;

      if (typeof data === "undefined") {
        return false;
      }

      store.commit("addWindows", data);
      return true;
    },
    destroy: function destroy(store) {
      var wins = store.state.windows;

      for (var i = 0, ii = wins.length; i < ii; i++) {
        store.commit("set", {
          id: wins[i].id,
          opened: false,
          context: null,
          zIndex: store.state.startingZ
        });
      }

      store.commit("setState", {
        prop: "highestZ",
        val: store.state.startingZ
      });
    }
  })
});
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"fe79d39a-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./projects/plugins/inAppWindows/src/ui/inAppWindowContainer.vue?vue&type=template&id=3f1fd746&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"plugin-wrapper-windows"}},_vm._l((_vm.listOfWindows),function(window){return _c('inapp-window',{key:window.id,attrs:{"window":window}})}),1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./projects/plugins/inAppWindows/src/ui/inAppWindowContainer.vue?vue&type=template&id=3f1fd746&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"fe79d39a-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./projects/plugins/inAppWindows/src/ui/inAppWindow.vue?vue&type=template&id=9e85df9e&
var inAppWindowvue_type_template_id_9e85df9e_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":"inapp-window_transition"}},[_c('div',{ref:'window'+_vm.window.id,class:['inapp-window' ].concat( _vm.extraClasses),style:([{zIndex: _vm.zIndex, top: _vm.top, left: _vm.left}, _vm.maxedStyles]),attrs:{"id":'inapp-window_'+_vm.window.id},on:{"!mousedown":function($event){return _vm.moveIntoForeground($event)}}},[(_vm.window.header !== '')?_c('div',{staticClass:"inapp-window_header"},[_c(_vm.window.header,{tag:"component",attrs:{"window":_vm.window,"funcs":{close: _vm.close, toggleMin: _vm.toggleMin, toggleMax: _vm.toggleMax, move: _vm.move}}})],1):_vm._e(),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.window.header === '' || _vm.window.minimized === false),expression:"window.header === '' || window.minimized === false"}],staticClass:"inapp-window_body",staticStyle:{"width":"100%","height":"100%"}},[_c(_vm.window.name,{tag:"component",attrs:{"window":_vm.window,"funcs":{close: _vm.close, toggleMin: _vm.toggleMin, toggleMax: _vm.toggleMax, move: _vm.move}}})],1)])])}
var inAppWindowvue_type_template_id_9e85df9e_staticRenderFns = []


// CONCATENATED MODULE: ./projects/plugins/inAppWindows/src/ui/inAppWindow.vue?vue&type=template&id=9e85df9e&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./projects/plugins/inAppWindows/src/ui/inAppWindow.js?vue&type=script&lang=js&
function inAppWindowvue_type_script_lang_js_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { inAppWindowvue_type_script_lang_js_defineProperty(target, key, source[key]); }); } return target; }

function inAppWindowvue_type_script_lang_js_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }



/* harmony default export */ var inAppWindowvue_type_script_lang_js_ = ({
  name: "inapp-window",
  props: {
    window: {
      type: Object,
      required: true,
      validator: function validator(actual) {
        var expected = IWindow();

        for (var prop in expected) {
          if (!(prop in actual)) {
            console.error(prop, "is not on window");
            return false;
          }

          if (expected[prop] !== null && _typeof(actual[prop]) !== expected[prop]) {
            console.error(prop, "'s value", actual[prop], "is not of type", expected[prop]);
            return false;
          }
        }

        return true;
      }
    },
    header: String,
    title: String
  },
  data: function data() {
    return {
      namespace: "inAppWindows",
      xBeforeMax: 0,
      yBeforeMax: 0,
      wBeforeMax: 0,
      hBeforeMax: 0
    };
  },
  computed: {
    zIndex: function zIndex() {
      return this.window.zIndex;
    },
    top: function top() {
      return this.window.y + "px";
    },
    left: function left() {
      return this.window.x + "px";
    },
    maxedStyles: function maxedStyles() {
      if (!this.window.maximized) {
        return {};
      }

      return {
        top: "0px",
        left: "0px",
        width: "100%",
        height: "100%",
        position: "fixed"
      };
    },
    extraClasses: function extraClasses() {
      var classes = this.window.className.trim();

      if (classes === "") {
        return [];
      }

      return classes.split(" ");
    }
  },
  methods: {
    close: function close() {
      this.$store.dispatch(this.namespace + "/close", this.window.id);
    },
    toggleMin: function toggleMin() {
      if (this.window.maximized) {
        this.toggleMax();
      }

      this.$store.dispatch(this.namespace + "/set", {
        id: this.window.id,
        minimized: !this.window.minimized
      });
    },
    toggleMax: function toggleMax() {
      var isMaxed = this.window.maximized;

      if (this.window.minimized) {
        this.toggleMin();
      }

      var rect = isMaxed ? this.deEnlarge() : this.enlarge();
      this.$store.dispatch(this.namespace + "/set", inAppWindowvue_type_script_lang_js_objectSpread({
        id: this.window.id,
        maximized: !isMaxed
      }, rect));
    },
    //https://stackoverflow.com/questions/8339377/how-to-get-screen-width-without-minus-scrollbar
    getViewportRect: function getViewportRect() {
      var scrollbarHeuristic = 20;
      var w = document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth - scrollbarHeuristic;
      var h = document.documentElement.clientHeight || document.body.clientHeight || window.innerHeight - scrollbarHeuristic;
      return {
        w: w,
        h: h
      };
    },
    //https://stackoverflow.com/questions/17688595/finding-the-maximum-scroll-position-of-a-page
    getPageRect: function getPageRect() {
      var docBo = document.body;
      var docEl = document.documentElement;
      var h = Math.max(docBo.scrollHeight, docBo.offsetHeight, docEl.clientHeight, docEl.scrollHeight, docEl.offsetHeight);
      var w = Math.max(docBo.scrollWidth, docBo.offsetWidth, docEl.clientWidth, docEl.scrollWidth, docEl.offsetWidth);
      return {
        w: w,
        h: h
      };
    },
    getContainment: function getContainment(winEl) {
      var position = winEl.style.position !== "" ? winEl.style.position : window.getComputedStyle(winEl).position;
      return position === "fixed" ? this.getViewportRect() : this.getPageRect();
    },
    enlarge: function enlarge() {
      var x = 0;
      var y = 0;

      var _this$getViewportRect = this.getViewportRect(),
          w = _this$getViewportRect.w,
          h = _this$getViewportRect.h;

      w -= 2;
      h -= 2;
      this.xBeforeMax = this.window.x;
      this.yBeforeMax = this.window.y;
      this.wBeforeMax = this.window.w;
      this.hBeforeMax = this.window.h;
      return {
        x: x,
        y: y,
        w: w,
        h: h
      };
    },
    deEnlarge: function deEnlarge() {
      var x = this.xBeforeMax;
      var y = this.yBeforeMax;
      var w = this.wBeforeMax;
      var h = this.hBeforeMax;
      this.xBeforeMax = 0;
      this.yBeforeMax = 0;
      this.wBeforeMax = 0;
      this.hBeforeMax = 0;
      return {
        x: x,
        y: y,
        w: w,
        h: h
      };
    },
    move: function move(_x, _y) {
      var container = this.getContainment(this.$refs["window" + this.window.id]); //this.getViewportRect();

      var _this$preventOutOfBou = this.preventOutOfBounds(_x, _y, this.window.w, this.window.h, container.w, container.h),
          x = _this$preventOutOfBou.x,
          y = _this$preventOutOfBou.y;

      this.$store.dispatch(this.namespace + "/set", {
        id: this.window.id,
        x: x,
        y: y
      });
    },
    preventOutOfBounds: function preventOutOfBounds(_x, _y, _w, _h, containW, containH) {
      var x = _x;
      var y = _y;
      var w = _w; //let h = _h;

      if (y < 0) {
        y = 1;
      } else if (y > containH) {
        y = containH - 10;
      }

      if (x > containW) {
        x = containW - 10;
      } else if (x + w < 0) {
        x = -1 * w + 1;
      }

      return {
        x: x,
        y: y
      };
    },
    moveIntoForeground: function moveIntoForeground() {
      this.$store.dispatch(this.namespace + "/moveIntoForeground", this.window.id);
    }
  },
  created: function created() {
    if (typeof this.window === "undefined") {
      throw new Error("Failed to provide 'window' property to window component.");
    }

    if (typeof this.$options[POSTINSTALL_OBJ_NAMESPACE].namespace !== "undefined") {
      this.namespace = this.$options[POSTINSTALL_OBJ_NAMESPACE].namespace;
    }

    if (typeof this.header !== "undefined" && this.header !== this.window.header) {
      this.$store.dispatch(this.namespace + "/set", {
        id: this.window.id,
        header: this.header
      });
    }
  },
  mounted: function mounted() {
    var key = "window" + this.window.id;
    var w = this.$refs[key].offsetWidth;
    var h = this.$refs[key].offsetHeight;
    this.$store.dispatch(this.namespace + "/set", {
      id: this.window.id,
      w: w,
      h: h
    });
  },
  destroyed: function destroyed() {
    if (this.window.maximized) {
      this.toggleMax();
    }
  }
});
// CONCATENATED MODULE: ./projects/plugins/inAppWindows/src/ui/inAppWindow.js?vue&type=script&lang=js&
 /* harmony default export */ var ui_inAppWindowvue_type_script_lang_js_ = (inAppWindowvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./projects/plugins/inAppWindows/src/ui/inAppWindow.vue





/* normalize component */

var component = normalizeComponent(
  ui_inAppWindowvue_type_script_lang_js_,
  inAppWindowvue_type_template_id_9e85df9e_render,
  inAppWindowvue_type_template_id_9e85df9e_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var inAppWindow = (component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./projects/plugins/inAppWindows/src/ui/inAppWindowContainer.js?vue&type=script&lang=js&


var components = {};
components[inAppWindow.name] = inAppWindow;
/* harmony default export */ var inAppWindowContainervue_type_script_lang_js_ = ({
  props: {
    defaultHeader: String
  },
  name: "inapp-window-container",
  components: components,
  computed: {
    listOfWindows: function listOfWindows() {
      var name = this.namespace + "/windows";
      var wins = this.$store.getters[name];
      return wins.filter(function (w) {
        return w.opened;
      });
    }
  },
  data: function data() {
    return {
      namespace: "inAppWindows"
    };
  },
  installHeaders: function installHeaders(windowComponent) {
    var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    if (headers.length === 0) {
      return false;
    }

    windowComponent.components = windowComponent.components || {};
    headers.forEach(function (h) {
      if (!("name" in h)) {
        throw new Error("Header component does not have a name property: " + JSON.stringify(h));
      }

      if (windowComponent.components[h.name] !== undefined) {
        throw new Error("Duplicate names: tried to install a header whose name already exists: " + h.name);
      }

      windowComponent.components[h.name] = h;
    });
    return true;
  },
  installWindows: function installWindows(userWindows, windowComponent, dataNamespace, compNamespace) {
    if (!(userWindows instanceof Array)) {
      throw new Error("Window container is not an array.");
    }

    windowComponent.components = windowComponent.components || {};
    userWindows.forEach(function (win) {
      if (!("name" in win)) {
        throw new Error("Window component does not have a name property: " + JSON.stringify(win));
      }

      if (windowComponent.components[win.name] !== undefined) {
        throw new Error("Duplicate names: tried to install a custom window whose name already exists: " + win.name);
      }

      windowComponent.components[win.name] = win;
      win[compNamespace] = win[dataNamespace] || {};
      delete win[dataNamespace];
    });
  },
  install: function install(userWindows) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var namespaces = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var preInstanceThis = this;
    var postInstall = preInstanceThis[namespaces.postOptions];

    if (postInstall === undefined) {
      throw new Error("Failed to install user windows to the window container. Do not call the install function of the window container component. Use the plugin installer instead.");
    }

    preInstanceThis.installHeaders(inAppWindow, options.headers);
    preInstanceThis.installWindows(userWindows, inAppWindow, namespaces.preUser, namespaces.postUser);
    postInstall.userWindows = userWindows;
    postInstall.postInstallComponentNamespace = namespaces.postUser;
    postInstall.init = false;
    postInstall.storeNamespace = namespaces.store;
    delete preInstanceThis.installHeaders;
    delete preInstanceThis.installWindows;
    delete preInstanceThis.install;
  },
  methods: {
    installNamespace: function installNamespace(objNamespace) {
      var namespace = this.$options[objNamespace].storeNamespace;

      if (typeof namespace !== "undefined") {
        this.namespace = namespace;
        return true;
      }

      throw new Error("Failed to install namespace to window container. Is the $options namespace valid: " + objNamespace);
    },
    installDefaultHeader: function installDefaultHeader(defaultHeader, storeNamespace) {
      if (typeof defaultHeader !== "undefined") {
        this.$store.dispatch(storeNamespace + "/setState", {
          prop: "defaultHeader",
          val: defaultHeader
        });
        return true;
      }

      return false;
    },
    installWindowsToStore: function installWindowsToStore(userWindows, storeNamespace, compNamespace) {
      var install = [];

      for (var win in userWindows) {
        var userData = userWindows[win][compNamespace];
        userData.name = userWindows[win].name;
        userData.id = userData.id || userData.name;
        install.push(userData);
        delete userWindows[win][compNamespace];
      }

      this.$store.dispatch(storeNamespace + "/init", {
        windows: install
      });
    },
    postInstall: function postInstall() {
      var options = this.$options[POSTINSTALL_OBJ_NAMESPACE]; //hot-reloading can cause postInstall to be called >1x

      this.installNamespace(POSTINSTALL_OBJ_NAMESPACE);

      if (options.init === true) {
        return false;
      }

      this.installDefaultHeader(this.defaultHeader, this.namespace);
      this.installWindowsToStore(options.userWindows, this.namespace, options.postInstallComponentNamespace);
      options.init = true;
      delete options.userWindows;
      delete options.postInstallComponentNamespace;
      return true;
    }
  },
  created: function created() {
    this.postInstall();
  }
});
// CONCATENATED MODULE: ./projects/plugins/inAppWindows/src/ui/inAppWindowContainer.js?vue&type=script&lang=js&
 /* harmony default export */ var ui_inAppWindowContainervue_type_script_lang_js_ = (inAppWindowContainervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./projects/plugins/inAppWindows/src/ui/inAppWindowContainer.vue





/* normalize component */

var inAppWindowContainer_component = normalizeComponent(
  ui_inAppWindowContainervue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var inAppWindowContainer = (inAppWindowContainer_component.exports);
// CONCATENATED MODULE: ./projects/plugins/inAppWindows/src/index.js




var USER_DATA_NAMESPACE = "$state";
var STORE_NAMESPACE = "inAppWindows";
var POSTINSTALL_COMP_NAMESPACE = "$_inAppWindows_state";
var POSTINSTALL_OBJ_NAMESPACE = "$_inAppWindows_postInstall";
var src_inAppWindow = inAppWindow;
var src_inAppWindowContainer = inAppWindowContainer;

function parseConfig() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var defaults = {
    storeNamespace: {
      type: "string",
      default: STORE_NAMESPACE
    },
    componentNamespace: {
      type: "string",
      default: USER_DATA_NAMESPACE
    },
    windows: {
      type: "object",
      required: true
    },
    headers: {
      type: "object",
      default: []
    },
    vuex: {
      type: null
    }
  };
  return configParser(config, defaults);
}

var installer = {
  install: function install(Vue, config) {
    ensureVersion(Vue, "2.6", {
      throwInsteadOfReturn: true
    });
    var options = parseConfig(config);
    STORE_NAMESPACE = options.storeNamespace;
    USER_DATA_NAMESPACE = options.componentNamespace;
    registerVuexModule(options.vuex, STORE_NAMESPACE, windows);
    isValidRootProperty(USER_DATA_NAMESPACE, true);
    var componentOptions = {};
    var containerOptions = {};
    componentOptions[POSTINSTALL_OBJ_NAMESPACE] = {
      namespace: STORE_NAMESPACE
    };
    containerOptions[POSTINSTALL_OBJ_NAMESPACE] = {};
    componentOptionsWriter(inAppWindow, componentOptions);
    componentOptionsWriter(inAppWindowContainer, containerOptions);
    inAppWindowContainer.install(options.windows, {
      headers: options.headers
    }, {
      postOptions: POSTINSTALL_OBJ_NAMESPACE,
      postUser: POSTINSTALL_COMP_NAMESPACE,
      preUser: USER_DATA_NAMESPACE,
      store: STORE_NAMESPACE
    });
  }
};
// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib-no-default.js
/* concated harmony reexport POSTINSTALL_OBJ_NAMESPACE */__webpack_require__.d(__webpack_exports__, "POSTINSTALL_OBJ_NAMESPACE", function() { return POSTINSTALL_OBJ_NAMESPACE; });
/* concated harmony reexport inAppWindow */__webpack_require__.d(__webpack_exports__, "inAppWindow", function() { return src_inAppWindow; });
/* concated harmony reexport inAppWindowContainer */__webpack_require__.d(__webpack_exports__, "inAppWindowContainer", function() { return src_inAppWindowContainer; });
/* concated harmony reexport installer */__webpack_require__.d(__webpack_exports__, "installer", function() { return installer; });




/***/ })

/******/ });
});