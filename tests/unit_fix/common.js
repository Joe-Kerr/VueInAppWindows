const _backup = {};

const _windowContainerBackupKeys = ["install", "installHeaders", "installWindows"];

export function backupWindowContainer(container) {
	_windowContainerBackupKeys.forEach((key)=>{
		_backup[key] = container[key];
	});
}

export function restoreWindowContainer(container) {
	for(const p in _backup) {
		container[p] = _backup[p];
		_backup[p] = null;
	}	
}

export function writeMockWindowDataToSStoretate(state) {
	state.init = false;
	state.windows = [{
		 "id": "unitTestWindow",
		 "name": "unit-test-window",
		 "opened": false,
		 "zIndex": state.startingZ,
		 "x": 44,
		 "y": 41,
		 "w": 250,
		 "h": 150,
		 "context": null,
		 "header": "",
		 "maximized": false,
		 "minimized": false,
		 "title": "something",
		 "className": "",
		 "children": [],
		 "parent": ""
		 
	}];
	state.index = {"unitTestWindow": 0}	
}