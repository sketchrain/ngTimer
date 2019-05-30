import { AXNode } from '../../flow/core/fl-core';
import * as MI from './ngt-in';

// OTHERS
export class OUserSession extends AXNode { // MI.IOUserSession

	constructor(cfg:any, name?:string) {
		super(cfg);
	}
}

export class ONavigator extends AXNode { // MI.IONavigator

	constructor(cfg:any, name?:string) {
		super(cfg);
	}
}

// VIEWS
export class VTasks extends AXNode { // MI.IVTask
	
	constructor(cfg:any, name?:string) {
		super(cfg);
	}
}

// D-NODES
export class DTask extends AXNode { // MI.IDTask
	
	constructor(cfg:any, name?:string) {
		super(cfg);
	}
}

export class DUser extends AXNode { // MI.IDUser

	constructor(cfg:any, name?:string) {
		super(cfg);
	}
}

// WIDGETS
export class UIElement extends AXNode {

	constructor(cfg:any, name?:string) { // MI.IWApp
		super(cfg);
	}
}

export class WApp extends AXNode {

	constructor(cfg:any, name?:string) { // MI.IWApp
		super(cfg);
	}
}

export class WPageAuth extends AXNode { // /d-> X
	
	constructor(cfg:any, name?:string) { // MI.IWPageAuth
		super(cfg);
	}
}

export class WLoger extends AXNode { 
	
	constructor(cfg:any, name?:string) { // MI.IWLoger
		super(cfg);
	}
}

export class WLogIn extends AXNode {
	
	constructor(cfg:any, name?:string) { // MI.IWLogIn
		super(cfg);
	}
}

export class WSignIn extends AXNode {
	
	constructor(cfg:any, name?:string) { // MI.IWSignIn
		super(cfg);
	}
}

export class WMainPrehled extends AXNode {  // /d-> X 
	
	constructor(cfg:any, name?:string) {
		super(cfg);
	}
}

export class WItemEditor extends AXNode {
	
	constructor(cfg:any, name?:string) { // MI.IWPrehledItems
		super(cfg);
	}
}

export class WPrehledItems extends AXNode {
	
	constructor(cfg:any, name?:string) { // MI.IWPrehledItems
		super(cfg);
	}
}

export class WPrehledItemsHeader extends AXNode {
	
	constructor(cfg:any, name?:string) { // MI.IWPrehledItemsHeader
		super(cfg);
	}
}

export class WTaskItem extends AXNode {
	
	constructor(cfg:any, name?:string) { // MI.IWTask
		super(cfg);
	}
}