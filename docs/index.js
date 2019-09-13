(function() {	
	const windowContainer = inAppWindows.inAppWindowContainer;
	const store = new Vuex.Store({});
	
	Vue.use(inAppWindows.installer, {vuex: store, storeNamespace: "windows", windows: [win1, win2, win3, winX], headers: [header1, header2]});	  
		
	window.v = new Vue({
		el: "#v",
		store,
		template: `
		<div>	
			<article id="infoContainer">
				<section id="infoContainer_btn-bar">
					<div class="infoContainer_btn" @click="open('w2')">The $state property and window functions.</div>
					<div class="infoContainer_btn" @click="open('demo-window-1')">This is not a window! <br>Or is it?</div>					
					<div class="infoContainer_btn" @click="open('w3')">Entirely customised window.</div>
					<div class="infoContainer_btn" @click="open('wx', $event)">One to rule them all: the context property</div>
				</section>
				<section id="infoContainer_code">
					<pre>{{code}}</pre>
				</section>		
				
				<section id="further_reading">
					<h3>Further info</h3>
					<p><a href="./demoWindowComponents.js" target="_blank">See entire source of windows used in this demo.</a></p>
					<p><a href="./index.js" target="_blank">See source of how windows are set up / used.</a></p>
				</section>
			</article>
			
			<inapp-window-container 
				defaultHeader="default-header"
			/>	
		</div>
		`,
		data() {
			return {
				code: ""
			}
		},
		methods: {
			open(id, context) {
				this.$store.dispatch("windows/open", {id, context});
				this.$store.dispatch("windows/set", {id, x: 200, y: 230});
				
				const code = document.getElementById("for_win"+id[id.length-1]);
				this.code = code.textContent.trim();
			}
		},

		components: {"inapp-window-container": windowContainer}
	
	});
})();