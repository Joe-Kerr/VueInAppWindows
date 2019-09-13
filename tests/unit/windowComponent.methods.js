const assert = require("assert");
const sinon = require("sinon");
const sample = require("../../src/ui/inAppWindow.js").default;

suite("ui/inappWindow.js/methods");

test("methods.close dispatches, namespaced, window id to store", ()=>{
	const context = {$store: {dispatch: new sinon.fake()}, namespace: "NS", window: {id: 123}};
	sample.methods.close.call(context);
	
	assert.equal(context.$store.dispatch.firstCall.args[0], "NS/close");
	assert.equal(context.$store.dispatch.firstCall.args[1], 123);
});

test("methods.toggleMin dispatches, namespaced, inverse of minimized state to store", ()=>{
	const context = {
		$store: {dispatch: new sinon.fake()}, 
		namespace: "NS", 
		window: {id: 123, maximized: false, minimized: false}
	};
	
	sample.methods.toggleMin.call(context);	
	assert.equal(context.$store.dispatch.firstCall.args[1].minimized, true);
	assert.equal(context.$store.dispatch.firstCall.args[0], "NS/set");
	
	context.window.minimized = true;
	sample.methods.toggleMin.call(context);
	assert.equal(context.$store.dispatch.lastCall.args[1].minimized, false);
});

test("methods.toggleMin de-enlarges the window if it is maximized", ()=>{
	const context = {
		$store: {dispatch: ()=>{}}, 
		namespace: "NS", 
		window: {id: 123, maximized: false, minimized: false},
		toggleMax: new sinon.fake()
	};	
	
	sample.methods.toggleMin.call(context);	
	assert.equal(context.toggleMax.callCount, 0);	
	
	context.window.maximized = true;
	sample.methods.toggleMin.call(context);	
	assert.equal(context.toggleMax.callCount, 1);
});

test("methods.toggleMax dispatches, namespaced, inverse of maximized state and rect to store", ()=>{
	const context = {
		$store: {dispatch: new sinon.fake()},
		namespace: "NS", 
		window: {id: 123, maximized: false, minimized: false},
		enlarge: ()=>{return {x:1, y: 2, w: 3, h: 4}},
		deEnlarge: ()=>{return {x:10, y: 20, w: 30, h: 40}}
	};
	let data;
	
	sample.methods.toggleMax.call(context);	
	data = context.$store.dispatch.firstCall.args[1];
	assert.deepEqual(data, {maximized: true, x:1, y: 2, w: 3, h: 4, id:123});
	assert.equal(context.$store.dispatch.firstCall.args[0], "NS/set");

	context.window.maximized = true;
	sample.methods.toggleMax.call(context);	
	data = context.$store.dispatch.lastCall.args[1];
	assert.deepEqual(data, {maximized: false, x:10, y: 20, w: 30, h: 40, id:123});
});

test("methods.toggleMax calls enlarge or deEnlarge depending on max'ed state", ()=>{
	const context = {
		$store: {dispatch: ()=>{}},
		namespace: "NS", 
		window: {id: 123, maximized: false, minimized: false},
		enlarge: new sinon.fake(),
		deEnlarge: new sinon.fake()
	};

	sample.methods.toggleMax.call(context);
	assert.equal(context.enlarge.callCount, 1);
	assert.equal(context.deEnlarge.callCount, 0);
	
	context.window.maximized = true;
	sample.methods.toggleMax.call(context);
	assert.equal(context.enlarge.callCount, 1);
	assert.equal(context.deEnlarge.callCount, 1);
});

test("methods.toggleMax un-minimizes the window if it is minimized", ()=>{
	const context = {
		$store: {dispatch: ()=>{}},
		namespace: "NS", 
		window: {id: 123, maximized: false, minimized: false},
		enlarge: ()=>{},
		deEnlarge: ()=>{},
		toggleMin: new sinon.fake()
	};	
	
	sample.methods.toggleMax.call(context);
	assert.equal(context.toggleMin.callCount, 0);
	
	context.window.minimized = true;
	sample.methods.toggleMax.call(context);
	assert.equal(context.toggleMin.callCount, 1);
});

test("methods.getViewportRect tries document.documentElement.clientWidth|Height first", ()=>{
	//jsdom requirement
	Object.defineProperty(global.document.documentElement, "clientWidth", { value: 11, configurable: true });
	Object.defineProperty(global.document.documentElement, "clientHeight", { value: 22, configurable: true });

	assert.deepEqual(sample.methods.getViewportRect(), {w: 11, h: 22});
});

test("methods.getViewportRect tries document.body.clientWidth|Height second", ()=>{
	//jsdom requirement
	Object.defineProperty(global.document.documentElement, "clientWidth", { value: null, configurable: true });
	Object.defineProperty(global.document.documentElement, "clientHeight", { value: null, configurable: true });
	Object.defineProperty(global.document.body, "clientWidth", { value: 33, configurable: true });
	Object.defineProperty(global.document.body, "clientHeight", { value: 44, configurable: true });
	
	assert.deepEqual(sample.methods.getViewportRect(), {w: 33, h: 44});
});

test("methods.getViewportRect tries window.innerWidth|Height third", ()=>{
	//jsdom requirement
	Object.defineProperty(global.document.documentElement, "clientWidth", { value: null, configurable: true });
	Object.defineProperty(global.document.documentElement, "clientHeight", { value: null, configurable: true });
	Object.defineProperty(global.document.body, "clientWidth", { value: null, configurable: true });
	Object.defineProperty(global.document.body, "clientHeight", { value: null, configurable: true });
	Object.defineProperty(global.window, "innerWidth", { value: 55, configurable: true });
	Object.defineProperty(global.window, "innerHeight", { value: 66, configurable: true });
	
	const scrollbar = 20;
	
	assert.deepEqual(sample.methods.getViewportRect(), {w: 55-scrollbar, h: 66-scrollbar});
});

test("methods.getPageRect chooses the max of available document widths/heights", ()=>{
	//jsdom requirement
	Object.defineProperty(global.document.documentElement, "clientWidth", { value: 10, configurable: true });
	Object.defineProperty(global.document.documentElement, "clientHeight", { value: 100, configurable: true });		
	Object.defineProperty(global.document.documentElement, "scrollWidth", { value: 20, configurable: true });
	Object.defineProperty(global.document.documentElement, "scrollHeight", { value: 200, configurable: true });		
	Object.defineProperty(global.document.documentElement, "offsetWidth", { value: 30, configurable: true });
	Object.defineProperty(global.document.documentElement, "offsetHeight", { value: 300, configurable: true });	
	
	Object.defineProperty(global.document.body, "scrollWidth", { value: 40, configurable: true });
	Object.defineProperty(global.document.body, "scrollHeight", { value: 400, configurable: true });		
	Object.defineProperty(global.document.body, "offsetWidth", { value: "", configurable: true });
	Object.defineProperty(global.document.body, "offsetHeight", { value: "", configurable: true });

	assert.deepEqual(sample.methods.getPageRect(), {w: 40, h: 400});	
});

test("methods.getContainment translates el's position into a containment viewport or page rect", ()=>{
	const el = {style: {position: ""}};
	const context = {
		getViewportRect: ()=>2,
		getPageRect: ()=>3
	};
	
	el.style.position = "fixed";
	assert.equal( sample.methods.getContainment.call(context, el), 2 );
	
	
	el.style.position = "not-fixed";
	assert.equal( sample.methods.getContainment.call(context, el), 3 );
});

test("methods.getContainment handles element with empty position", ()=>{
	const backup = window.getComputedStyle;
	const el = {style: {position: ""}};
	const context = {
		getViewportRect: ()=>2,
		getPageRect: ()=>3
	};
	
	let fallbackPos = "";
	window.getComputedStyle = ()=>{return {position: fallbackPos}};
	
	fallbackPos = "fixed";
	assert.equal( sample.methods.getContainment.call(context, el), 2 );	
	
	fallbackPos = "not-fixed";
	assert.equal( sample.methods.getContainment.call(context, el), 3 );
	
	window.getComputedStyle = backup;
});


test("methods.enlarge caches current window rect and returns new rect", ()=>{
	const context = {
		xBeforeMax: 0,
		yBeforeMax: 0,
		wBeforeMax: 0,
		hBeforeMax: 0,
		window: {x:1, y:2, w:3, h:4},
		getViewportRect: ()=>{return {w:9, h:8}}
	};	
	const res = sample.methods.enlarge.call(context);
	
	assert.deepEqual(res, {x:0, y:0, w:7, h: 6});
	assert.equal(context.xBeforeMax, 1);
	assert.equal(context.yBeforeMax, 2);
	assert.equal(context.wBeforeMax, 3);
	assert.equal(context.hBeforeMax, 4);
	
});

test("methods.deEnlarge clears cache and returns previous window rect", ()=>{
	const context = {
		xBeforeMax: 1,
		yBeforeMax: 2,
		wBeforeMax: 3,
		hBeforeMax: 4
	};
	const res = sample.methods.deEnlarge.call(context);
	
	assert.deepEqual(res, {x:1, y:2, w:3, h: 4});
	assert.equal(context.xBeforeMax, 0);
	assert.equal(context.yBeforeMax, 0);
	assert.equal(context.wBeforeMax, 0);
	assert.equal(context.hBeforeMax, 0);
});

test("methods.move dispatches, namespaced, new x,y to store", ()=>{
	const context = {
		namespace: "NS", 
		window: {id: 123},		
		$store: {dispatch: new sinon.fake()},
		preventOutOfBounds: (x,y)=>{return {x,y}},
		getContainment: ()=>{return {w:null,h:null}},
		$refs: {}
	}
	sample.methods.move.call(context, 1, 2);
	assert.equal(context.$store.dispatch.firstCall.args[0], "NS/set");
	assert.equal(context.$store.dispatch.firstCall.args[1].id, 123);
	assert.equal(context.$store.dispatch.firstCall.args[1].x, 1);
	assert.equal(context.$store.dispatch.firstCall.args[1].y, 2);
});

test("methods.preventOutOfBounds prevents window edges from going out of viewport", ()=>{
	const viewportX = 800;
	const viewportY = 600;
	const winW = 200;
	const winH = 100;
	const f = sample.methods.preventOutOfBounds;
	
	assert.deepEqual(f(10, 10, winW, winH, viewportX, viewportY), {x: 10, y: 10}, "Well within bounds");
	
	assert.deepEqual(f(10, 0, winW, winH, viewportX, viewportY), {x: 10, y: 0}, "Exactly on top bound");
	assert.deepEqual(f(10, -1, winW, winH, viewportX, viewportY), {x: 10, y: 1}, "Leaves top");
	assert.deepEqual(f(10, 600, winW, winH, viewportX, viewportY), {x: 10, y: 600}, "Exactly on bottom bound");
	assert.deepEqual(f(10, 601, winW, winH, viewportX, viewportY), {x: 10, y: 590}, "Leaves bottom bound");
	
	assert.deepEqual(f(-5, 10, winW, winH, viewportX, viewportY), {x: -5, y: 10}, "Leaves left bound within tolerance");
	assert.deepEqual(f(-200, 10, winW, winH, viewportX, viewportY), {x: -200, y: 10}, "Leaves left bound within max tolerance");
	assert.deepEqual(f(-201, 10, winW, winH, viewportX, viewportY), {x: -199, y: 10}, "Leaves left bound");
	assert.deepEqual(f(800, 10, winW, winH, viewportX, viewportY), {x: 800, y: 10}, "Exactly on right bound");
	assert.deepEqual(f(801, 10, winW, winH, viewportX, viewportY), {x: 790, y: 10}, "Leaves right bound");

	assert.deepEqual(f(801, 601, winW, winH, viewportX, viewportY), {x: 790, y: 590}, "Leaves bottom right bounds");
});

test("methods.moveIntoForeground dispatches, namespaced, window id to store", ()=>{
	const context = {$store: {dispatch: new sinon.fake()}, namespace: "NS", window: {id: 123}};
	sample.methods.moveIntoForeground.call(context);
	
	assert.equal(context.$store.dispatch.firstCall.args[0], "NS/moveIntoForeground");
	assert.equal(context.$store.dispatch.firstCall.args[1], 123);	
});