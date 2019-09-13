const draggableHandle = {
	name: "draggable-handle",
	props: ["window", "funcs"],
	template: `<div v-on:mousedown="minIfMaxed($event), poorMansDragging($event)"><slot></slot></div>`,
	methods: {
		minIfMaxed(event) {
			if(this.window.maximized) {
				this.funcs.toggleMax();
				this.funcs.move(event.pageX-parseInt(this.window.w/2), event.pageY-parseInt(this.window.h/2));
			}
		},
		poorMansDragging(event) {			

			//Note 1: Be wary of sending store updates during mousemove. While this is the "Vue way", it might not be the performance way... 
			//Note 2: Be warned that out of viewport
			const _this = this;
			let draggableClone = null;
			
			const startX = event.pageX;
			const startY = event.pageY;
			let elX = this.window.x + window.pageXOffset; //use offset if position absolute
			let elY = this.window.y + window.pageYOffset;
			let dX = elX;
			let dY = elY;
			
			function setupClone() {
				//Don't touch the original! This will mess up Vue's rendering. 
				draggableClone = document.getElementById("inapp-window_"+_this.window.id).cloneNode(true);
				draggableClone.id = "_clone_"+draggableClone.id;
				draggableClone.style.opacity = 0.5;
				document.body.appendChild(draggableClone);				
			}
			
			function inlinemove(event2) {
				if(draggableClone === null) {setupClone();}
				
				dX = elX + event2.pageX - startX
				dY = elY + event2.pageY - startY;
				
				draggableClone.style.left = dX+"px";
				draggableClone.style.top = dY+"px";						
			}				
			
			document.addEventListener("mousemove", inlinemove);
			
			document.addEventListener("mouseup", function inlineup() {					
				document.removeEventListener("mousemove", inlinemove);
				document.removeEventListener("mouseup", inlineup);
				if(draggableClone !== null) document.body.removeChild(draggableClone);
				
				_this.funcs.move(dX, dY);
				document.body.style.userSelect = "";
			});	
			
			document.body.style.userSelect = "none";
		}			
	}
};

const header1 = {
	name: "different-header",
	props: ["window", "funcs"],
	template: `
		<div class="inapp-window_header--default">
			<draggable-handle :window="window" :funcs="funcs" class="inapp-window_handle inapp-window_handle--left">
				{{window.title || "Window"}}
			</draggable-handle>

			<div class="inapp-window_button-bar">
				<div class="inapp-window_button inapp-window_button--min inapp-window_button--right" v-on:click="funcs.toggleMin()">
					<span class="inapp-window_button--icon icon_minimise"></span>
				</div>				
				
				<div class="inapp-window_button inapp-window_button--max inapp-window_button--right" v-on:click="funcs.toggleMax()">
					<span class="inapp-window_button--icon icon_improvised_max"></span>
				</div>
				
				<div class="inapp-window_button inapp-window_button--close inapp-window_button--right" v-on:click="funcs.close()">
					<span class="inapp-window_button--icon icon_close"></span> 
				</div>	
			</div>
		</div>		
	`,
	components: {"draggable-handle": draggableHandle}
};

const header2 = {
	name: "default-header",
	props: ["window", "funcs"],
	template: `
		<div>
			<div class="inapp-window_button inapp-window_button--min inapp-window_button--left" v-on:click="funcs.toggleMin()">
				<span class="inapp-window_button--icon icon_minimise"></span>
			</div>
			
			<div class="inapp-window_button inapp-window_button--close inapp-window_button--left" v-on:click="funcs.close()">
				<span class="inapp-window_button--icon icon_close"></span> 
			</div>	

			<draggable-handle :window="window" :funcs="funcs" class="inapp-window_handle inapp-window_handle--right">
				{{window.title || "Window"}}
			</draggable-handle>		
		</div>			
	`,
	components: {"draggable-handle": draggableHandle}
};

const win1 = {
	name: "demo-window-1",
	template: `
		<div style="background-color: white; border: 1px solid grey; padding: 2px;">
			<p>This is a window with all defaults unchanged. So it comes down to just writing a window body.</p>
			<p>Additionally, if you move all the 'windowy' functionality (close, min, max, window data, etc.) into the header, you will completely decouple this 'window' component from the window plugin. </p>
			<p>You <strong>open</strong> this window with the component name.</p>
		</div>
	`
};

const win2 = {
	$state: {id: "w2", title: "Window 2", header: "different-header", className: "inapp-window--shadowed"},	
	name: "demo-window-2",
	props: ["window", "funcs"],
	template: `
		<div>
			<p>The $state property (name can be chosen) controls things like what header to render.</p>
			<p>Or add a class name so that this window has also a drop shadow.</p>
			<p><a href="#" @click.prevent="funcs.close()">Closing {{window.title}} from here works too.</a> This is done via the "funcs" props property.</p>
		</div>
	`	
};

const win3 = {
	$state: {id: "w3", header: "", title: "Win. 3 - Some header"},
	name: "demo-window-3",
	props: ["window", "funcs"],
	template: `
		<div style="background: url(media/custom.jpg) no-repeat; margin: 0; padding: 0; width: 560px; height: 400px;">
			<draggable-handle class="custom-inapp-window_header" :window="window" :funcs="funcs">
				<h2>{{window.title}}</h2>
			</draggable-handle>
			
			<h3 class="custom-inapp-window_subheader">As easy as <code>header: ""</code></h3>
			
			<div class="custom-inapp-window_body">
				<p>Need an entirely customised window? Just disable the header and the window body becomes the window container. </p>
				<p><a href="#" @click.prevent="funcs.close()">Sweet! What else? (close)</a></p> 
				
				<p><i>Background image (c) <a href="https://sceef.itch.io/2d-gui-asset-legacyretro" target="_blank">sceef</a></i></p>
			
			</div> 
		</div>
	`,
	components: {"draggable-handle": draggableHandle}
};


const winX = {
	$state: {id: "wx", title: "Window X"},
	name: "demo-window-x",
	props: ["window"],
	template: `
		<div style="background-color: #d0d0d0">
			<p>Provide anything to a window with the context property, e.g. a mouse event: </p> 
			<p>This window was opened by clicking at {{window.context.pageX}}, {{window.context.pageY}}</p>
			<p>You can of course also dynamically render other components!</p>
		</div>`
}
