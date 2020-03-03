const assert = require("assert");
const sinon = require("sinon");
const sample = require("../../src/ui/inAppWindow.js").default;
const IWindow = require("../../src/IWindow.js").IWindow;

suite("ui/inappWindow.js");

function getWindowWithProperValues() {
	const window = IWindow();
	for(const p in window) {
		const val = window[p];
		if(val === null || val === "string") {continue;}
		if(val === "number") {window[p] = 123}
		else if(val === "boolean") {window[p] = true}
		else if(val === "object") {window[p] = {}}
		else {throw new Error("Test setup error: getWindowWithProperValues() encounted an undefined type: "+val)}
	}	
	return window;
}

test("props.window.validator returns false if missing an expected property", ()=>{
	const window = getWindowWithProperValues();
	const backup = console.error;
	console.error = ()=>{};
	
	delete window.opened	
	assert.equal( sample.props.window.validator(window), false);
	
	console.error = backup;
});

test("props.window.validator returns false if non-null value is not of expected type", ()=>{
	const window = getWindowWithProperValues();
	const backup = console.error;
	console.error = ()=>{};
	
	window.opened = "true";
	assert.equal( sample.props.window.validator(window), false);
	
	console.error = backup;
});

test("props.window.validator ignores unknown props on window", ()=>{
	const window = getWindowWithProperValues();
	window.who = "r u?";
	assert.equal( sample.props.window.validator(window), true);
});

test("computed.[*simple styles*] properties convert their values into CSS format", ()=>{
	const context = {
		window: {
			zIndex: 1,
			y: 2,
			x: 3,
		}
	};
	const result = {zIndex:0, top:0, left:0};	
	for(const p in result) { result[p] = sample.computed[p].call(context); }
	
	assert.equal(result.zIndex, 1);
	assert.equal(result.top, "2px");
	assert.equal(result.left, "3px");

});

test("computed.minnedStyles switches on if window is minimized", ()=>{
	const context = {
		window: {minimized: null}
	};
	
	context.window.minimized = false;
	assert.deepEqual(sample.computed.minnedStyles.call(context), {});	
	
	context.window.minimized = true;
	assert.deepEqual(sample.computed.minnedStyles.call(context), {height: "auto"});
});	

test("computed.maxedStyles switches on if window is maximized", ()=>{
	const context = {
		window: {maximized: null}
	};
	
	context.window.maximized = false;
	assert.deepEqual(sample.computed.maxedStyles.call(context), {});

	
	context.window.maximized = true;
	assert.deepEqual(sample.computed.maxedStyles.call(context), {top: "0px", left: "0px", width: "100%", height: "100%", position: "fixed"});	
});

test("computed.extraClasses returns array of strings from className", ()=>{
	const context = {
		window: {className: "a b c"}
	};	
	assert.deepEqual(sample.computed.extraClasses.call(context), ["a", "b", "c"]);
});

test("computed.extraClasses returns empty string if className is empty", ()=>{
	const context = {
		window: {className: ""}
	};	
	assert.deepEqual(sample.computed.extraClasses.call(context), []);	
});

test("computed.extraClasses treats spaces-only as empty", ()=>{
	const context = {
		window: {className: " "}
	};	
	assert.deepEqual(sample.computed.extraClasses.call(context), []);	
	
	context.window.className += "  ";
	assert.deepEqual(sample.computed.extraClasses.call(context), []);	
});


test("created throws if window prop not provided", ()=>{
	assert.throws(()=>{ sample.created.call({}) }, {message: /provide 'window' property/});
});

test("created writes namespace to data if on $options", ()=>{
	const context = {window: null, namespace: "default", $options: {$_inAppWindows_postInstall: {}}};
	sample.created.call(context);
	assert.equal(context.namespace, "default");
	
	context.$options.$_inAppWindows_postInstall = {namespace:"override"};
	sample.created.call(context);
	assert.equal(context.namespace, "override");
});

test("created dispatches, namespaced, non-undefined header to store", ()=>{
	const context = {
		$store: {dispatch: new sinon.fake()},
		window: {id:123, header: "defaultHeader"}, 
		namespace: "NS",
		$options: {$_inAppWindows_postInstall: {}}
	};
	
	sample.created.call(context);
	assert.equal(context.$store.dispatch.callCount, 0);	
	
	context.header = "customHeader";
	sample.created.call(context);
	assert.equal(context.$store.dispatch.callCount, 1);
	assert.equal(context.$store.dispatch.firstCall.args[0], "NS/set");
	assert.equal(context.$store.dispatch.firstCall.args[1].id, 123);
	assert.equal(context.$store.dispatch.firstCall.args[1].header, "customHeader");
	
	context.window.header = "customHeader";
	sample.created.call(context);
	assert.equal(context.$store.dispatch.callCount, 1);
});

test("mounted dispatches width and height to store", ()=>{
	const context = {
		$store: {dispatch: new sinon.fake()},
		window: {id:123}, 
		namespace: "NS",
		$refs: {"window123": {offsetWidth: 44, offsetHeight: 99}}
	};	
	
	sample.mounted.call(context);
	const data = context.$store.dispatch.lastCall.args[1];
	
	assert.equal(data.w, 44);
	assert.equal(data.h, 99);
});

test("destroyed un-maximises window if maximised", ()=>{
	const context = {
		toggleMax: new sinon.fake(),
		window: {maximized: null}
	};
	
	context.window.maximized = false;
	sample.destroyed.call(context);
	assert.equal(context.toggleMax.callCount, 0);
	
	context.window.maximized = true;
	sample.destroyed.call(context);
	assert.equal(context.toggleMax.callCount, 1);
});