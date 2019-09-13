import {mutations, actions} from "vuex-heman";
import {IWindow} from "../IWindow.js";

export default {	
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
		windows(state) { return state.windows; }		
	},
	
	mutations: {			
		set: mutations.setArrayElPropsByIdFactory({container: "windows"}),
		
		setState: mutations.setPropVal,
		
		addWindows(state, data) {	
			if(state.init) {
				return false;
			}
		
			const wins = data.windows;
			for(let i=0, ii=wins.length; i<ii; i++) {
				if(typeof wins[i].id === "undefined" || typeof wins[i].name === "undefined") {
					throw new Error("Missing property on data. Require at least id and name. Got: "+JSON.stringify(wins[i]));
				}
				
				if(typeof state.index[wins[i].id] !== "undefined") {
					throw new Error("Tried to add window with existing id: "+wins[i].id);
				}
				
				const win = IWindow();
				win.id = wins[i].id;
				win.name = wins[i].name;
				win.title = wins[i].title || "";
				
				win.header = (typeof wins[i].header === "undefined") ? state.defaultHeader : wins[i].header;
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
				
				const idx = state.windows.push(win) - 1;
				state.index[wins[i].id] = idx;
			}
			
			state.init = true;
			return true;
		}
	},
	
	actions: {
		...actions.passThruActionsFactory(["set", "setState"]),
		
		open(store, data) {
			const id = (typeof data === "string") ? data : data.id;
			const commit = {id, "opened": true};
			
			store.dispatch("moveIntoForeground", id);
			
			if(typeof data.context !== "undefined") {
				commit.context = data.context;
			}
			
			store.commit("set", commit);
		},
		
		close(store, data) {
			store.commit("set", {id: data, opened: false, context: null});
		},
		
		moveIntoForeground(store, data) {
			const z = store.state.highestZ + 1;
			store.commit("set", {id: data, "zIndex": z});
			store.commit("setState", {prop: "highestZ", val: z});
		},

		init(store, data) {
			if(store.state.init) {
				return false;
			};
			
			if(typeof data === "undefined") {
				return false;
			}
			
			store.commit("addWindows", data);
			return true;
		},
		
		destroy(store) {
			const wins = store.state.windows;
			for(let i=0, ii=wins.length; i<ii; i++) {		
				store.commit("set", {id: wins[i].id, opened: false, context: null, zIndex: store.state.startingZ});
			}
			
			store.commit("setState", {prop: "highestZ", val: store.state.startingZ});		
		}	
	}
};