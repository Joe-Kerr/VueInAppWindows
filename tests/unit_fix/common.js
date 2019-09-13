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