const assert = require("assert");
const master = require("../../src/store/windows.js").default;
const {writeMockWindowDataToSStoretate} = require("../unit_fix/common.js");
const sample = {};

Object.assign(sample, master);

suite("store/windows.js/mutations");

sample.dispatch = ()=>{};
let commitCallCount = 0;
sample.commit = (cmd, data)=>{commitCallCount++; sample.mutations[cmd](sample.state, data)};

beforeEach(()=>{
	writeMockWindowDataToSStoretate(sample.state);
	commitCallCount = 0;
});

test("mutations.set was assigned the right function", ()=>{
	assert.equal(sample.mutations.set.name, "generatedSetArrayElPropsById");
});


test("mutations.setState was assigned the right function", ()=>{
	assert.equal(sample.mutations.setState.name, "setPropVal");
});


test("mutations.addWindows pushes new windows and updates index", ()=>{
	const install = [
		{id: "newWin1", name: "new-win-one"},
		{id: "newWin2", name: "new-win-two"}
	];
	const expectedKeys = Object.keys(sample.state.windows[0]).sort();

	sample.mutations.addWindows(sample.state, {windows: install});
	assert.equal(sample.state.windows.length, 3);
	
	assert.equal(sample.state.windows[1].id, "newWin1");
	assert.equal(sample.state.windows[1].name, "new-win-one");
	assert.equal(sample.state.windows[2].id, "newWin2");
	assert.equal(sample.state.windows[2].name, "new-win-two");
	
	assert.deepEqual(Object.keys(sample.state.windows[1]).sort(), expectedKeys);
	assert.deepEqual(Object.keys(sample.state.windows[2]).sort(), expectedKeys);

	assert.deepEqual(sample.state.index, {"unitTestWindow":0, "newWin1":1, "newWin2":2});
});

test("mutations.addWindows writes expected default values to window", ()=>{
	const state = {
		init: false,
		windows: [],
		index: {},
		defaultHeader: "abc",
		startingZ: 123
	};
	const defaults = {
		title: "",
		header: state.defaultHeader,
		className: "",
		zIndex: state.startingZ
	};
	const installWindow = [{
		id: "winId",
		name: "winName"
	}];
	
	sample.mutations.addWindows(state, {windows: installWindow});
	
	const window = state.windows[0];
	for(const prop in defaults) {
		assert.strictEqual(window[prop], defaults[prop], "Unexpected default value for: "+prop);
	}
});

test("mutations.addWindows writes system and user values to window", ()=>{
	const state = {
		init: false,
		windows: [],
		index: {},
	};	
	const systemProps = {		
		name: "winName"
	};
	const userProps = {
		id: "winId",
		title: "winTitle",
		header: "winHeader",
		className: "winClass"
	};
	const props = Object.assign({}, systemProps, userProps);
	const installWindow = [props];
	
	sample.mutations.addWindows(state, {windows: installWindow});

	const window = state.windows[0];
	for(const prop in props) {
		assert.strictEqual(window[prop], props[prop], "Unexpected value for: "+prop);
	}	
});

test("mutations.addWindows only works if init false", ()=>{
	assert.equal(sample.state.init, false);
	assert.equal(sample.state.windows.length, 1);
	
	sample.mutations.addWindows(sample.state, {windows: [{id: "newWin1", name: "new-win-one"}]});
	assert.equal(sample.state.init, true);
	assert.equal(sample.state.windows.length, 2);
	
	sample.mutations.addWindows(sample.state, {windows: [{id: "newWin2", name: "new-win-one2"}]});
	assert.equal(sample.state.windows.length, 2);
});

test("mutations.addWindows throws if missing window id or name", ()=>{
	assert.throws(()=>{ sample.mutations.addWindows(sample.state, {windows: [{name: "new-win-one"}]}); }, {message: /Missing property on data/});
	assert.throws(()=>{ sample.mutations.addWindows(sample.state, {windows: [{id: "newWin1"}]}); }, {message: /Missing property on data/});
});

test("mutations.addWindows throws if duplicate window id", ()=>{
	assert.throws(()=>{ sample.mutations.addWindows(sample.state, {windows: [{id: "unitTestWindow", name: "unit-test-window"}] }); }, {message: /window with existing id/});
});