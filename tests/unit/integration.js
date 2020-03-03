const assert = require("assert");
const sinon = require("sinon");
const {installer, inAppWindow, inAppWindowContainer} = require("../../src/index.js");
const {backupWindowContainer, restoreWindowContainer} = require("../unit_fix/common.js");

const vuex = require("vuex");
const {mount, createLocalVue} = require("@vue/test-utils");

let vue, localVue, store;

const WIN_ID_PREFIX = "inapp-window_";

const root = require("../unit_fix/integrationTestSetup.vue").default;
const header1 = require("../unit_fix/header1.vue").default;
const header2 = require("../unit_fix/header2.vue").default;
const window1 = require("../unit_fix/window1.vue").default;
const window2 = require("../unit_fix/window2.vue").default;
const window3 = require("../unit_fix/window3.vue").default;
const window4 = require("../unit_fix/window4.vue").default;

suite("Integration testing");

function open(idIntSuffix, context) {
	const id = "window"+idIntSuffix;
	store.dispatch("windows/open", {id, context});

	return vue.find("#"+WIN_ID_PREFIX+id);
}

function close(idIntSuffix=null) {
	if(idIntSuffix === null) {
		store.dispatch("windows/close", "window1");
		store.dispatch("windows/close", "window2");
		store.dispatch("windows/close", "window3");
		store.dispatch("windows/close", "window4");
		return;
	}
	
	const id = "window"+idIntSuffix;
	store.dispatch("windows/close", id);
}

function setupNestedBranchedWindows() {	
	//      w2 - w3
	// w1 <
	//     w4	
	const stateWindows = store.state.windows.windows;
	const stateIndex = store.state.windows.index;
	const get = (id) => {
		const win = stateWindows[stateIndex[id]];
		assert.equal(win.id, id, "Test setup error: setupNestedBranchedWindows() failed to lookup correctly id in store index.");
		return win;
	};
	
	const win1 = open(1);
	win1.vm.openChild("window2");
	win1.vm.openChild("window4");
	
	const win4 = vue.find("#"+WIN_ID_PREFIX+"window4");
	const win2 = vue.find("#"+WIN_ID_PREFIX+"window2");
	win2.vm.openChild("window3");
	
	const win3 = vue.find("#"+WIN_ID_PREFIX+"window3");
	
	const win1State = get("window1");
	const win2State = get("window2");
	const win3State = get("window3");
	const win4State = get("window4");

	return {
		win1, win2, win3, win4,
		win1State, win2State, win3State, win4State
	};
}

before(()=>{
	backupWindowContainer(inAppWindowContainer);
	
	localVue = createLocalVue();
	localVue.use(vuex);
	store = new vuex.Store({});	
	localVue.use(installer, {
		vuex: store, 
		storeNamespace: "windows",
		componentNamespace: "$data",
		windows: [window1, window2, window3, window4],
		headers: [header1, header2]
	});			
	
	vue = mount(root, {store, localVue});
});

after(()=>{
	restoreWindowContainer(inAppWindowContainer);

	delete inAppWindow.$_inAppWindows_postInstall;
	delete inAppWindowContainer.$_inAppWindows_postInstall;	
});

afterEach(()=>{
	close();
});

test("window container present", ()=>{
	vue.contains("#plugin-wrapper-windows");
});

test("multiple windows can be opened and closed", ()=>{
	assert.ok(!vue.contains("#content1"));
	assert.ok(!vue.contains("#content2"));
	
	open(1);
	assert.ok(vue.contains("#content1"));
	assert.ok(!vue.contains("#content2"));	
	
	open(2);
	assert.ok(vue.contains("#content1"));
	assert.ok(vue.contains("#content2"));

	close(1);
	assert.ok(!vue.contains("#content1"));
	assert.ok(vue.contains("#content2"));		
	
	close(2);
	assert.ok(!vue.contains("#content1"));
	assert.ok(!vue.contains("#content2"));	
});

test("window can be minimised", ()=>{
	const win = open(2);
	const winBody = win.find(".inapp-window_body");
	const minBtn = vue.find("#toggleMin");

	const beforeBool = store.state.windows.windows[1].minimized;
	const beforeVisible = winBody.isVisible();
	
	minBtn.trigger("click");
		
	const afterBool = store.state.windows.windows[1].minimized;
	const afterVisible = winBody.isVisible();
	const minnedStyle = win.attributes("style");
	
	minBtn.trigger("click");
	
	const restoredBool = store.state.windows.windows[1].minimized;
	const restoreVisible = winBody.isVisible();
	
	assert.equal(beforeBool, false);
	assert.equal(afterBool, true);
	assert.equal(restoredBool, false);
	
	assert.equal(beforeVisible, true);
	assert.equal(afterVisible, false);
	assert.equal(restoreVisible, true);
	
	assert.ok(minnedStyle.indexOf("height: auto") > -1);
});

test("window can be maximised", ()=>{
	const expected = ["left: 0px", "top: 0px", "width: 100%", "height: 100%", "position: fixed"];
	const win = open(2);
	const maxBtn = vue.find("#toggleMax");	
	
	const beforeBool = store.state.windows.windows[1].maximized;

	maxBtn.trigger("click");	
	
	const afterBool = store.state.windows.windows[1].maximized;	
	const actual = win.attributes("style");
	
	maxBtn.trigger("click");	
	
	const restoredBool = store.state.windows.windows[1].maximized;
	
	assert.equal(beforeBool, false);
	assert.equal(afterBool, true);
	assert.equal(restoredBool, false);
	expected.forEach((item)=>{
		assert.ok(actual.indexOf(item) > -1, item+" contained in "+actual);
	});
});

test("window can have custom x,y coords", ()=>{
	const x = 9182739182;
	const y = 7123712498;

	const win = open(2);
	store.dispatch("windows/set", {id: "window2", x, y});
	
	const style = win.attributes("style");
	
	assert.equal(win.vm.top, y+"px");
	assert.equal(win.vm.left, x+"px");
	assert.ok(style.indexOf("left: 9182739182px") > -1);
	assert.ok(style.indexOf("top: 7123712498") > -1);
});

test("windows are put into foreground if they become active", async ()=>{
	function extractZ(win) {
		const z = parseInt(win.attributes("style")
							  .split(";")
							  .filter((s)=>s.indexOf("z-index") > -1)[0]
							  .replace("z-index:", "")
							  .trim()
						   );		
		if(isNaN(z)) {throw new Error("Failed to extract z index.");}		
		return z;
	}
	
	const win1 = open(1);
	const win2 = open(2);
	let win1Z, win2Z;		
	
	win1Z = extractZ(win1);
	win2Z = extractZ(win2);	
	assert.equal(win1Z + 1, win2Z);

	win1.trigger("mousedown");
	win1.trigger("mouseup");

	win1Z = extractZ(win1);
	win2Z = extractZ(win2);	
	assert.equal(win2Z + 1, win1Z);
});

test("windows have correct headers", ()=>{
	open(1);	
	assert.ok(vue.contains("#header2"));
	assert.ok(!vue.contains("#header1"));
	
	open(2);
	assert.ok(vue.contains("#header2"));
	assert.ok(vue.contains("#header1"));
});

test("minimized window with header has its body auto hidden", ()=>{
	store.dispatch("windows/set", {id: "window1", header: ""});
	
	const winWithout = open(1);
	assert.equal(vue.find("#content1").isVisible(), true);
	winWithout.vm.toggleMin();
	assert.equal(vue.find("#content1").isVisible(), true);
	
	
	winWithout.vm.toggleMin();
	close(1);
	
	const winWith = open(2);
	assert.equal(vue.find("#content2").isVisible(), true);
	winWith.vm.toggleMin();
	assert.equal(vue.find("#content2").isVisible(), false);
	
	winWith.vm.toggleMin();
	store.dispatch("windows/set", {id: "window1", header: "header2"});
});

test("window can have custom id", ()=>{
	open(1);
	assert.ok(vue.contains("#content1"));	
});

test("window can have custom title", ()=>{
	store.dispatch("windows/set", {id: "window1", header: "header1"});
	
	open(1);	
	
	const title = vue.find("#title");	
	assert.equal(title.text(), "w1_title");
	
	close(1);
	store.dispatch("windows/set", {id: "window1", header: "header2"});
});

test("window can have custom context", ()=>{
	open(1, "context of window 1");
	
	const context = vue.find("#context1");	
	assert.equal(context.text(), "context of window 1");	
});

test("window can have additional classes", ()=>{
	const win = open(1);
	const classes = win.classes();
	
	//set on window1.vue in ../unit_fix
	assert.ok(classes.indexOf("testClass1") > -1);
	assert.ok(classes.indexOf("testClass2") > -1);
});

test("window can open nested child windows", ()=>{
	const w = setupNestedBranchedWindows();

	assert.strictEqual(w.win1State.opened, true);
	assert.equal(w.win1State.parent, "");
	assert.deepEqual(w.win1State.children, ["window2", "window4"]);	
	
	assert.strictEqual(w.win2State.opened, true);
	assert.equal(w.win2State.parent, "window1");
	assert.deepEqual(w.win2State.children, ["window3"]);	
	
	assert.strictEqual(w.win3State.opened, true);
	assert.equal(w.win3State.parent, "window2");
	assert.deepEqual(w.win3State.children, []);	
	
	assert.strictEqual(w.win4State.opened, true);
	assert.equal(w.win4State.parent, "window1");
	assert.deepEqual(w.win4State.children, []);
});

	//      w2 - w3
	// w1 <
	//     w4

test("window properly cleans up after closing leaf window", ()=>{
	const w = setupNestedBranchedWindows();
	close(4);
	
	assert.strictEqual(w.win1State.opened, true);
	assert.equal(w.win1State.parent, "");
	assert.deepEqual(w.win1State.children, ["window2"]);	
	
	assert.strictEqual(w.win2State.opened, true);
	assert.equal(w.win2State.parent, "window1");
	assert.deepEqual(w.win2State.children, ["window3"]);	
	
	assert.strictEqual(w.win3State.opened, true);
	assert.equal(w.win3State.parent, "window2");
	assert.deepEqual(w.win3State.children, []);	
	
	assert.strictEqual(w.win4State.opened, false);
	assert.equal(w.win4State.parent, "");
	assert.deepEqual(w.win4State.children, []);	
});

test("window properly cleans up after closing root window", ()=>{
	const w = setupNestedBranchedWindows();
	close(1);
	
	assert.strictEqual(w.win1State.opened, false);
	assert.equal(w.win1State.parent, "");
	assert.deepEqual(w.win1State.children, []);	
	
	assert.strictEqual(w.win2State.opened, false);
	assert.equal(w.win2State.parent, "");
	assert.deepEqual(w.win2State.children, []);	
	
	assert.strictEqual(w.win3State.opened, false);
	assert.equal(w.win3State.parent, "");
	assert.deepEqual(w.win3State.children, []);	
	
	assert.strictEqual(w.win4State.opened, false);
	assert.equal(w.win4State.parent, "");
	assert.deepEqual(w.win4State.children, []);		
});

test("window properly cleans up after closing branch window", ()=>{
	const w = setupNestedBranchedWindows();
	close(2);
	
	assert.strictEqual(w.win1State.opened, true);
	assert.equal(w.win1State.parent, "");
	assert.deepEqual(w.win1State.children, ["window4"]);	
	
	assert.strictEqual(w.win2State.opened, false);
	assert.equal(w.win2State.parent, "");
	assert.deepEqual(w.win2State.children, []);	
	
	assert.strictEqual(w.win3State.opened, false);
	assert.equal(w.win3State.parent, "");
	assert.deepEqual(w.win3State.children, []);	
	
	assert.strictEqual(w.win4State.opened, true);
	assert.equal(w.win4State.parent, "window1");
	assert.deepEqual(w.win4State.children, []);		
});

test("window (close) cannot get stuck in a loop of child windows", ()=>{
	const win1 = open(1);
	win1.vm.openChild("window2");

	const win2 = vue.find("#"+WIN_ID_PREFIX+"window2");
	win2.vm.openChild("window3");
	
	const win3 = vue.find("#"+WIN_ID_PREFIX+"window3");	
	win3.vm.openChild("window1");
	
	close();
	
	assert.strictEqual(store.state.windows.windows[0].children.length, 0);
	assert.strictEqual(store.state.windows.windows[1].children.length, 0);
	assert.strictEqual(store.state.windows.windows[2].children.length, 0);
	assert.strictEqual(store.state.windows.windows[3].children.length, 0);
});