export interface IUser {
	name:string;
	email:string;
	token:string;
}

export interface ITask {
}

export interface ITaskGroup {
}

// RUZNÉ
export interface Action { // < t/Todo:
}

export interface IQuery {
	Type:any;

	limit?: 0;
	offset?: 0;

	filter?:any;
	sorting?:any;
}

// SERVER API - RESPONSES
export interface SRSelect {
}

export interface SRSelect {
}

// EVENTS
export interface UIEvFormInput {

	w:any;
	el:any;
	data:any;
}

export interface UIEvTextFiledInput {
	w:any;
	el:any;
	data:any;
}

// ACTIONS 
export interface APristupRoot extends Action {

	dbg: {
		url: '' // auth, app/task-groups, app/tasks:id
	}
}

export interface AInitReloadData extends Action {

	dbg_opSelect: {
		succes:boolean,
		dataType:string;
	}
}

// OBJECTS
export interface IOUserSession {
	user:IDUser;
	token:string;
}

export interface IONavigator {
	url:string;
}

// VIEWS
export interface IVTask {
	items:any[];
}

export interface IVTaskGroup {
	items:any[];
}

export interface IUIFUser {
	name:string;
	email:string;
	password:string;
	checkPassword:string;
}

// D-NODES (DATA)
export interface IDUser {
	name:string;
	email:number;
	token:string;
}

export interface DNode {
	name:string;
	id:number|string;
}

export interface IDTask extends DNode {
	
	odpCas:number;
	open:boolean;
	state:string;
}

export interface IDTaskGroup extends DNode {
	celkOdpCas:number;
	// <-/Tasks
}

// WIDGETS (VISUAL,UI)
export interface IWApp {
	outletTarget:string;
	wPageAuth:IWPageAuth,
	wMainPrehled:IWMainPrehled,
}

// Auth
export interface IWPageAuth {
	// None
}

export interface IWLoger {
	action:string; // < logIn,SignIn
}

export interface IWLogIn {
	inforMessage:string;
	bLogIn:IUIButton,
}

export interface IWSignIn {
	inforMessage:string;
	bLogIn:IUIButton,
}

// ...
export interface IWItemEditor {
	itemName:string;
	useCtx:string;
	show:boolean;
}

export interface IWMainPrehled {

	wItemEditor:IWItemEditor,
	wPrehledItems:IWItemEditor,
}

export interface IWPrehledItems {
	variant:string;
	// nodes
	header:IWPrehledItemsHeader;
	items:string;
}

export interface IWPrehledItemsHeader {
	variant:string;
}

export interface IWTask {
	changedName:string;
	name:string;
	odpCas:number;
	id:number|string;
	// nodes
	timeCounter:IWTimeCounter; // < t/v2.0
}

export interface IWTimeCounter {
	state:string; // < started, stoped, running, paused
	odpCas:number;
}

export interface IWTaskGroup {
	changedName:string;
}

// ELEMENTS - UI
export interface IUIButton {
	block:boolean,
}