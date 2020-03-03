import {IWindow} from "../IWindow.js";
import {POSTINSTALL_OBJ_NAMESPACE} from "../index.js";

export default {
	name: "inapp-window",
	
	props: {
		window: {
			type: Object,
			required: true,
			validator: function(actual) {
				const expected = IWindow();
				for(const prop in expected) {
					if( !(prop in actual) ) {
						console.error(prop, "is not on window");
						return false;
					}
					if(expected[prop] !== null && typeof actual[prop] !== expected[prop]) {
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
	data: function() {
		return {
			namespace: "inAppWindows",
			xBeforeMax: 0,
			yBeforeMax: 0,
			wBeforeMax: 0,
			hBeforeMax: 0
		}
	},

	computed: {	
		zIndex() {return this.window.zIndex;},
		top() {return this.window.y+"px";},
		left() {return this.window.x+"px";},
		
		minnedStyles() {
			if(!this.window.minimized) {return {};}
			
			return {height: "auto"}
		},		
		
		maxedStyles() {
			if(!this.window.maximized) {return {};}
			
			return {top: "0px", left: "0px", width: "100%", height: "100%", position: "fixed"};
		},
		
		extraClasses() {
			const classes = this.window.className.trim();
			if(classes === "") {
				return [];
			}
			return classes.split(" ");
		}
	},
	
	methods: {
		close() {this.$store.dispatch(this.namespace+"/close", this.window.id);},
		
		toggleMin() {
			if(this.window.maximized) {
				this.toggleMax();
			}
			this.$store.dispatch(this.namespace+"/set", {id: this.window.id, minimized: !this.window.minimized}); 
		},
		
		toggleMax() {
			const isMaxed = this.window.maximized;

			if(this.window.minimized) {
				this.toggleMin();
			}		
			
			const rect = (isMaxed) ? this.deEnlarge() : this.enlarge();	
			this.$store.dispatch(this.namespace+"/set", {id: this.window.id, maximized: !isMaxed, ...rect});
		},
		
		//https://stackoverflow.com/questions/8339377/how-to-get-screen-width-without-minus-scrollbar
		getViewportRect() {
			const scrollbarHeuristic = 20;
			let w = document.documentElement.clientWidth || document.body.clientWidth || (window.innerWidth - scrollbarHeuristic);
			let h = document.documentElement.clientHeight || document.body.clientHeight || (window.innerHeight - scrollbarHeuristic); 

			return {w, h}
		},
		
		//https://stackoverflow.com/questions/17688595/finding-the-maximum-scroll-position-of-a-page
		getPageRect() {
			const docBo = document.body;
			const docEl = document.documentElement;
			
			const h = Math.max(docBo.scrollHeight, docBo.offsetHeight, docEl.clientHeight, docEl.scrollHeight, docEl.offsetHeight);
			const w = Math.max(docBo.scrollWidth, docBo.offsetWidth, docEl.clientWidth, docEl.scrollWidth, docEl.offsetWidth);
			
			return {w, h};
		},
		
		getContainment(winEl) {
			const position = (winEl.style.position) !== "" ? winEl.style.position : window.getComputedStyle(winEl).position;		
			return (position === "fixed") ? this.getViewportRect() : this.getPageRect();
		},
		
		enlarge() {
			const x = 0;
			const y = 0;
			let {w, h} = this.getViewportRect();
			w -= 2;
			h -= 2;
			this.xBeforeMax = this.window.x;
			this.yBeforeMax = this.window.y;
			this.wBeforeMax = this.window.w;
			this.hBeforeMax = this.window.h;

			return {x,y,w,h};			
		},
		
		deEnlarge() {
			const x = this.xBeforeMax;
			const y = this.yBeforeMax;
			const w = this.wBeforeMax;
			const h = this.hBeforeMax;
							
			this.xBeforeMax = 0;
			this.yBeforeMax = 0;
			this.wBeforeMax = 0;
			this.hBeforeMax = 0;

			return {x,y,w,h};
		},
		
		move(_x, _y) {
			const container = this.getContainment(this.$refs["window"+this.window.id]);//this.getViewportRect();
			const {x, y} = this.preventOutOfBounds(_x, _y, this.window.w, this.window.h, container.w, container.h);
			this.$store.dispatch(this.namespace+"/set", {id: this.window.id, x, y});
		},
		
		preventOutOfBounds(_x,_y, _w, _h, containW, containH) {
			let x = _x;
			let y = _y;
			let w = _w;
			//let h = _h;
			
			if(y < 0) {
				y = 1;
			}			
			else if(y > containH) {
				y = containH - 10;
			}
			
			if(x > containW) {
				x = containW - 10;
			}
			else if(x + w < 0) {
				x = -1 * w + 1;
			}			
			return {x, y};
		},
		
		moveIntoForeground: function() {
			this.$store.dispatch(this.namespace+"/moveIntoForeground", this.window.id);
		},
		
		openChild(windowInit) {
			const parentId = this.window.id;
			this.$store.dispatch(this.namespace+"/openWithChild", {parentId, params: windowInit});
		}
	},
	
	created() {
		if(typeof this.window === "undefined") {
			throw new Error("Failed to provide 'window' property to window component.");
		}
		
		if(typeof this.$options[POSTINSTALL_OBJ_NAMESPACE].namespace !== "undefined") {
			this.namespace = this.$options[POSTINSTALL_OBJ_NAMESPACE].namespace;
		}
				
		if(typeof this.header !== "undefined" && this.header !== this.window.header) {
			this.$store.dispatch(this.namespace+"/set", {id: this.window.id, header: this.header});
		}
	},
	
	mounted() {
		const key = "window"+this.window.id;
		const w = this.$refs[key].offsetWidth;
		const h = this.$refs[key].offsetHeight;
		
		this.$store.dispatch(this.namespace+"/set", {id: this.window.id, w, h});
	},
	
	destroyed() {
		if(this.window.maximized) {
			this.toggleMax();
		}
	}
};

