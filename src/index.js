import {configParser, ensureVersion, registerVuexModule, isValidRootProperty, componentOptionsWriter} from "cats4vue";

import store from "./store/windows.js";
import windowContainer from "./ui/inAppWindowContainer.vue";
import windowComponent from "./ui/inAppWindow.vue";

let USER_DATA_NAMESPACE = "$state";
let STORE_NAMESPACE = "inAppWindows";
const POSTINSTALL_COMP_NAMESPACE = "$_inAppWindows_state";
export const POSTINSTALL_OBJ_NAMESPACE = "$_inAppWindows_postInstall";

export const inAppWindow = windowComponent;
export const inAppWindowContainer = windowContainer;

function parseConfig(config={}) {
	const defaults = {
		storeNamespace: {type: "string", default: STORE_NAMESPACE},
		componentNamespace: {type: "string", default: USER_DATA_NAMESPACE},
		
		windows: {type: "object", required: true},
		headers: {type: "object", default: []},
		vuex: {type: null}
	};	
	
	return configParser(config, defaults);	
}

export const installer = {install: function(Vue, config) {
	ensureVersion(Vue, "2.6", {throwInsteadOfReturn: true});
	
	const options = parseConfig(config);
	
	STORE_NAMESPACE= options.storeNamespace;
	USER_DATA_NAMESPACE = options.componentNamespace;
	
	registerVuexModule(options.vuex, STORE_NAMESPACE, store);
	isValidRootProperty(USER_DATA_NAMESPACE, true);
	
	const componentOptions = {};
	const containerOptions = {};
	componentOptions[POSTINSTALL_OBJ_NAMESPACE] = {namespace: STORE_NAMESPACE};
	containerOptions[POSTINSTALL_OBJ_NAMESPACE] = {};	
	componentOptionsWriter(windowComponent, componentOptions);
	componentOptionsWriter(windowContainer, containerOptions);
	
	windowContainer.install(options.windows, {
			headers: options.headers
		}, {
			postOptions: POSTINSTALL_OBJ_NAMESPACE,
			postUser: POSTINSTALL_COMP_NAMESPACE,
			preUser: USER_DATA_NAMESPACE,
			store: STORE_NAMESPACE
	});
}};