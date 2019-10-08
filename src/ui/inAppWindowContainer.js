import inappWindow from "./inAppWindow.vue";
import {POSTINSTALL_OBJ_NAMESPACE} from "../index.js";

const components = {};
components[inappWindow.name] = inappWindow;

export default {
	props: {defaultHeader: String},
	
	name: "inapp-window-container",
	
	components,
	
	computed: {
		listOfWindows: function() {			
			const name = this.namespace+"/windows";
			const wins = this.$store.getters[name];		
			return wins.filter(w=>w.opened);
		}
	},
	
	data() {
		return {
			namespace: "inAppWindows"
		}
	},
	
	installHeaders(windowComponent, headers=[]) {
		if(headers.length === 0) {
			return false;
		}
		
		windowComponent.components = windowComponent.components || {};
		headers.forEach((h)=>{
			if(!("name" in h)) {
				throw new Error("Header component does not have a name property: "+JSON.stringify(h));
			}
			
			if(windowComponent.components[h.name] !== undefined) {
				throw new Error("Duplicate names: tried to install a header whose name already exists: "+h.name);
			}
			windowComponent.components[h.name] = h; 
		});			
		return true;
	},	
	
	installWindows(userWindows, windowComponent, dataNamespace, compNamespace) {
		if(!(userWindows instanceof Array)) {
			throw new Error("Window container is not an array.");
		}
		
		windowComponent.components = windowComponent.components || {};
		userWindows.forEach((win)=>{					
			if(!("name" in win)) {
				throw new Error("Window component does not have a name property: "+JSON.stringify(win));
			}
			
			if(windowComponent.components[win.name] !== undefined) {
				throw new Error("Duplicate names: tried to install a custom window whose name already exists: "+win.name);
			}

			windowComponent.components[win.name] = win;
			
			win[compNamespace] = win[dataNamespace] || {};
			delete win[dataNamespace];
		});		
	},
	
	install(userWindows, options={}, namespaces={}) {
		const preInstanceThis = this;
		const postInstall = preInstanceThis[namespaces.postOptions];
		
		if(postInstall === undefined) {
			throw new Error("Failed to install user windows to the window container. Do not call the install function of the window container component. Use the plugin installer instead.");
		}		
		
		preInstanceThis.installHeaders(inappWindow, options.headers);
		preInstanceThis.installWindows(userWindows, inappWindow, namespaces.preUser, namespaces.postUser);
		
		postInstall.userWindows = userWindows;
		postInstall.postInstallComponentNamespace = namespaces.postUser;
		postInstall.init = false;
		postInstall.storeNamespace = namespaces.store;
		
		delete preInstanceThis.installHeaders;
		delete preInstanceThis.installWindows;
		delete preInstanceThis.install;
	},
	
	methods: {
		installNamespace(objNamespace) {
			const namespace = this.$options[objNamespace].storeNamespace;
			if(typeof namespace !== "undefined") {				
				this.namespace = namespace;
				return true;
			}				
			throw new Error("Failed to install namespace to window container. Is the $options namespace valid: "+objNamespace);
		},
		
		installDefaultHeader(defaultHeader, storeNamespace) {
			if(typeof defaultHeader !== "undefined") {
				this.$store.dispatch(storeNamespace+"/setState", {prop: "defaultHeader", val: defaultHeader});
				return true;
			}			
			return false;
		},
		
		installWindowsToStore(userWindows, storeNamespace, compNamespace) {
			const install = [];
			for(let i=0, ii=userWindows.length; i<ii; i++) {
				const win = userWindows[i];
				const userData = win[compNamespace];
				
				userData.name = win.name;
				userData.id = userData.id || userData.name;				
				
				install.push(userData);				
				delete win[compNamespace];
			}		
			
			this.$store.dispatch(storeNamespace+"/init", {windows: install});		
		},
		
		postInstall() {		
			const options = this.$options[POSTINSTALL_OBJ_NAMESPACE];
			
			//hot-reloading can cause postInstall to be called >1x
			this.installNamespace(POSTINSTALL_OBJ_NAMESPACE);
			
			if(options.init === true) {
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
	
	created() {
		this.postInstall();
	}
};
