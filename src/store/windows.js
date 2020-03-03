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
				win.children = [];
				win.parent = "";
				
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
		
		openWithChild(store, data) {
			const {parentId, params} = data;
			const childId = (typeof params === "string") ? params : params.id;
			
			const window = store.state.windows[ store.state.index[childId] ];
			
			if(window.opened) {
				return;
			}
			
			store.dispatch("open", params);			
			store.commit("set", {id: parentId, children: childId, arrOp: "push"});
			store.commit("set", {id: childId, parent: parentId});			
		},
		
		//#todo reset zIndex
		close(store, data) {		
			const rootWindow = store.state.windows[ store.state.index[data] ];
			
			if(typeof rootWindow === "undefined") {
				throw new Error("Tried to close a window with an undefined id: "+data);
			}			
			
			const operations = [];
			const walk = (window, result) => {				
				const parent = store.state.windows[ store.state.index[window.parent] ];

				result.push({parent, window});

				if(window.children.length > 0) {
					window.children.forEach((childId)=>{
						const child = store.state.windows[ store.state.index[childId] ];

						walk(child, result)
					});
				}
			};
			walk(rootWindow, operations);			

			operations.forEach((op)=>{
				if(typeof op.parent !== "undefined") {
					store.commit("set", {id: op.parent.id, children: op.window.id, arrOp: "delete"});
				}
				store.commit("set", {id: op.window.id, opened: false, parent: "", context: null});
			});
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
		
		//#todo call close action?
		destroy(store) {
			const wins = store.state.windows;
			for(let i=0, ii=wins.length; i<ii; i++) {		
				store.commit("set", {id: wins[i].id, opened: false, context: null, zIndex: store.state.startingZ});
			}
			
			store.commit("setState", {prop: "highestZ", val: store.state.startingZ});		
		}	
	}
};