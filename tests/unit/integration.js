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
		return;
	}
	
	const id = "window"+idIntSuffix;
	store.dispatch("windows/close", id);
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
		windows: [window1, window2],
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
	
	minBtn.trigger("click");
	
	const restoredBool = store.state.windows.windows[1].minimized;
	const restoreVisible = winBody.isVisible();
	
	assert.equal(beforeBool, false);
	assert.equal(afterBool, true);
	assert.equal(restoredBool, false);
	
	assert.equal(beforeVisible, true);
	assert.equal(afterVisible, false);
	assert.equal(restoreVisible, true);
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