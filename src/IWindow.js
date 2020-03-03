export function IWindow() {
	return {
		id: "string",
		name: "string",
		header: "string",
		title: "string",
		context: null,
		
		zIndex: "number",
		x: "number",
		y: "number",
		w: null,
		h: null,
		
		className: "string",
		
		opened: "boolean",
		minimized: "boolean",
		maximized: "boolean",
		children: "object",
		parent: "string"
	}
}