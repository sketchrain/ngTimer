// angular
import { Injectable } from '@angular/core';
// flow
import { Category, Managers, Signal, ISignal, AXStream } from '../../flow/core/fl-core';

@Injectable()
export class UIEvents extends Category {
	
	currentStream:AXStream;
	currentAction:any;
	currentSTAction:STAction;

	constructor(m:Managers) {
		super(m);
		this.UIEvents();
		this.ui.connectToActions();
	}

	UIEvents() {
		this.UIEventsV1();
		//this.UIEventsV2();
	}

	UIEventsV1() {
		// o/UserSession
		// o/Navigator
		// v/Tasks
		// dn/Task
		// dn/User
		// App
		// K/Auth
		// w/Widget
		// w/loger
		this.ia('[UI Switch] switch w/Loger', (evp:any)=> { return {} }) // {X} // ok/
			.evs([ 
				{ type:'[UI Event] click', ctx: { w:'w/Loger', ui:'b-switch' } }, // OK /21m
				{ type:'[UI Event] click', ctx: { w:'w/LogIn', ui:'b-register' } }, // OK /10m
				{ type:'[UI Event] click', ctx: { w:'w/SignIn', ui:'b-logIn' } }, // OK/5m
			]);
		// w/logIn,w/signIn,itemEditor
		this.ia('[Change] widgets data',  (evp:any) => {  // ok/
			console.log('---> se payload from ev [Change] widgets data', evp);
			return { widget: evp.w, data: evp.user } 
		}) // { widegt:, data: }
			.evs([
				{ type: '[UI Event] form input', ctx: { w:'w/LogIn', ui:'fo-user'} }, // OK /2h
				{ type: '[UI Event] form input', ctx: { w:'w/SignIn', ui:'fo-user'} }, // OK /45m
				{ type: '[UI Event] text field input', ctx: { w:'w/ItemEditor', ui:'ti-itemName'} }, // /OK /15m
			]);
		this.ia('[Auth] logIn',  (evp:any) => {  // { widegt:, data: } // ok/
			console.log('---> se payload from ev [Auth] logIn', evp);
			return { user: this.getUser('w/LogIn'), dbg: evp.dbg } 
		}) 
			.evs([
				{ type: '[UI Event] click', ctx: { w:'w/LogIn', ui:'b-logIn'} } // OK /40m
			]);
		// w/signIn
		// this.ia('[Change] widgets data',  (evp:any) => { return { widget:'w/LogIn', data: evp.user } }) // { widegt:, data: }
		// 	.ev('[UI Event] form input', { w:'w/LogIn', ui:'fo-user' });
		this.ia('[Auth] register',  (evp:any) => {  // { widegt:, data: }  // ok
			console.log('---> se payload from ev [Auth] register', evp);
			return { user: this.getUser('w/SignIn'), dbg: evp.dbg } 
		}) 
			.evs([
				{ type: '[UI Event] click', ctx: { w:'w/SignIn', ui:'b-register'} } // OK /5m
			]);
		// w/pageAuth
		// w/mainPrehled
		this.ia('[Auth] logOut', (evp:any) => { return {} } ) // ok
			.evs([
				{ type: '[UI Event] click', ctx: {w:'w/App', ui:'b-logOut'} } // OK /25m
			]);
		// w/prehledItems
		// w/itemEditor
		this.ia('[UI Show/Hide] show', (evp:any) => { // ok  // {X}
			console.log('---> se payload from ev [UI Show/Hide] show', evp);
			return { widget:evp.showTarget, useCtx:evp.setUseCtx, useCtxData:evp.useCtxData } 
		})
			.evs([ 
				//{ type:'[UI Event] click', ctx: { w:'w/PrehledItemsHeader', ui:'b-create' } },
				{ type:'[UI Event] click', ctx: { w:'w/taskItem', ui:'t-name' } }, // OK
				{ type:'[UI Event] click', ctx: { w:'w/PrehledItemsHeader', ui:'b-create' } }, // OK
				{ type:'[UI Event] click', ctx: { w:'w/ItemEditor', ui:'b-close' } }, // X 
			]);
		this.ia('[CRUD] create', (evp:any) => {   // {X} //ok
			console.log('---> se payload from ev [CRUD] create', evp);
			return { DNode: evp.create.DNode, cfg: { name: this.getItemName('w/ItemEditor') } } 
		})
			.evs([
				//{ type:'[UI Event] click', ctx: { w:'w/PrehledItemsHeader', ui:'b-create' } },
				{ type:'[UI Event] click', ctx: { w:'w/ItemEditor', ui:'b-save', useCtx:'create' } }, // D1,OK /30m
			]);
		this.ia('[CRUD] update', (evp:any) => {   // {X} //ok
			console.log('---> se payload from ev [CRUD] update', evp);
			return { DNode: evp.update.DNode, id:evp.update.id, cfg: { name: this.getItemName('w/ItemEditor') } } 
		})
			.evs([ 
				//{ type:'[UI Event] click', ctx: { w:'w/PrehledItemsHeader', ui:'b-create' } },
				{ type:'[UI Event] click', ctx: { w:'w/ItemEditor', ui:'b-save', useCtx:'rename' } }, // /D1,OK /10m
				// <- ev/[Akce St] set odp cas
			]);
		this.ia('[Change] widgets data',  (evp:any) => { 
			console.log('---> se payload from ev [Change] widgets data', evp);
			return { widget: evp.w, data: evp.itemName } 
		}) // { widegt:, data: }
			.evs([
				{ type: '[UI Event] text field input', ctx: { w:'w/ItemEditor', ui:'ti-itemName'} }, // /D1,X
			]);
		// w/taskItem
		//this.ia('[UI Show/Hide] show', (evp:any) => { return { widget: evp.showTarget, } });
		this.ia('[CRUD] delete', (evp:any) => { // ok/
			console.log('---> se payload from ev [CRUD] delete', evp);
			return { DNode: evp.delete.DNode, id:  evp.delete.id } 
		}) // {X}
			.evs([ 
				{ type:'[UI Event] click', ctx: { w:'w/taskItem', ui:'b-delete' } }, // D2,OK /15m
			]);
		this.sia('[Akce St] set odp cas', (evp:any) => { 
			console.log('---> se payload from ev [Akce St] set odp cas', evp);
			return { DNode:evp.action.DNode, _id:evp.action.id  };
		}) // {X}
			.evs([
				{ type:'[UI Event] click', ctx: { w:'w/taskItem', ui:'b-start-pause-resume' }, aSetState:':start' }, // D2,OK /20m
				{ type:'[UI Event] click', ctx: { w:'w/taskItem', ui:'b-reset' }, aSetState:':stop' } // D2,OK /40m
			])
			// .statesEvs((sia:any) => { // < t/Dcs
			// 	sia.startEvs([ { type:'[UI Event] click', ctx: { w:'w/taskItem', ui:'b-start-pause-resume' } } ]);
			// 	sia.stopEvs([ { type:'[UI Event] click', ctx: { w:'w/taskItem', ui:'b-reset' } } ]);

			// });
	}

	private getUser(fromTargetWidget:string):any {
		let wLogIn:any = this.sm.dm.selectOne(fromTargetWidget).result;
		return wLogIn.user;
	}

	private getItemName(fromTargetWidget:string) {
		let wItemEditor:any = this.sm.dm.selectOne(fromTargetWidget).result;
		return wItemEditor.itemName;
	}

	UIEventsV2() {
		this.al.log('AX3,App,Bo', '', 'Bootstrap - UIEvents - v2.0', [], null);
		// UI AKCE
		this.ui.action('[UI Event] click', { w:<any> null, el:<any> null})
		.check('', (a:Signal, p:any) => { return p.w == 'w/Loger' && p.el == 'el/b-switchAction' })
			.toOutput('[UI Switch] switch w/Loger', (p:any) => { return {} });
		// ev/
		this.ui.action('[UI Event] click', { w:<any> null, el:<any> null })
		.check('', (a:Signal, p:any) => { return p.w == 'w/PrehledItemsHeader' && p.el == 'el/b-create' })
			.toOutput('[UI Show/Hide] show', (p:any) => { return { widget:'w/ItemEditor' } });
		// ev/
		// this.ui.action('[UI Event] form input', { target:<any> null, data:<any> null })
		// .check('', (a:Signal, p:any) => { return p.w == 'w/LogIn' && p.el == 'ui/fo-user' })
		// 	.toOutput('[Change] widgets data', (p:any) => { return { target: p.w, data: p.data } });
		// ev/
		// this.ui.action('[UI Event] form input', { target:<any> null, data:<any> null })
		// .check('', (a:Signal, p:any) => { return p.w == 'w/SignIn' && p.el == 'ui/fo-user' })
		// 	.toOutput('[Change] widgets data', (p:any) => { return { target: p.w, data: p.data } });
		// ev/
		this.ui.action('[UI Event] click', { w:<any> null, el:<any> null })
		.check('', (a:Signal, p:any) => { return p.w == 'w/ItemEditor' && p.el == 'ui/b-close' })
			.toOutput('[UI Show/Hide] show', (p:any) => { return { widget:'w/ItemEditor' } });
		// ev/ -> show/hide
		this.ui.action('[UI Event] click', { w:<any> null, el:<any> null })
		.check('', (a:Signal, p:any) => { return p.w == 'w/ItemEditor' && p.el == 'ui/b-save' })
			.toOutput('[UI Show/Hide] show', (p:any) => { return { widget:'w/ItemEditor' } });
		// ev/ -> show/hide
		this.ui.action('[UI Event] click', { w:<any> null, el:<any> null })
		.check('', (a:Signal, p:any) => { return p.w == 'w/ItemEditor' && p.el == 'ui/b-cancle' })
			.toOutput('[UI Show/Hide] show', (p:any) => { return { widget:'w/ItemEditor' } });
		// ev/  -> a/switch ...
		this.ui.action('[UI Event] click', { w:<any> null, el:<any> null }) //
		.check('', (a:Signal, p:any) => { 
			return p.w == 'w-tg/any' && p.el == 'ui/t-name' 
		})
			.toOutput('[UI Switch] switch element', (p:any) => { return { widget:p.w, id:p.id, elToSwitch:p.elToSwitch } });
		// ev/  -> a/switch ..	
		this.ui.action('[UI Event] click', { w:<any> null, el:<any> null }) // -> a/switch ...
		.check('', (a:Signal, p:any) => { 
			return p.w == 'w-t/any' && p.el == 'ui/t-name' 
		})
			.toOutput('[UI Switch] switch element', (p:any) => { return { widget:p.w, id:p.id, elToSwitch:p.elToSwitch } });
		// APP < 
		// ...
	}

	// ...
	ia(type:string, clbSetPayload?:any) {
		this.currentAction = { type: type, clbSetPayload: clbSetPayload };
		return this;
	}

	sia(type:string, clbSetPayload?:any) {
		this.ia(type, clbSetPayload);
		return this;
	}

	ev(type:string, evCtxDef:IEvCtxDef, aSetState?:string) {

		let action_clbSetPayload = this.currentAction.clbSetPayload;
		let action_type = this.currentAction.type; 

		this.ui.action(type) // < ev
			.check('check event - ctx', (ev:Signal) => {

				// if(action_type == '[UI Show/Hide] show') { // < X // < [CRUD] update, [Akce St] set odp cas
				// 	debugger;
				// }

				console.log('-> sop/check - w/%s, ui/%s, st/%s', evCtxDef.w, evCtxDef.ui, ev, aSetState)
				if(aSetState) {
					ev.payload = { ...ev.payload, _setState:aSetState };
				}

				if(ev.payload.useCtx) {
					return ev.payload.useCtx == evCtxDef.useCtx && ev.type == type && ev.payload.w == evCtxDef.w && ev.payload.ui == evCtxDef.ui;
				}
				else {
					return ev.type == type && ev.payload.w == evCtxDef.w && ev.payload.ui == evCtxDef.ui;
				}
			})
			.toOutput(action_type, (evp:any) => { 
				console.log('--> sop/toOutput - w/%s, ui/%s', evCtxDef.w, evCtxDef.ui, evp)
				let actionPayload = action_clbSetPayload(evp);
				actionPayload = { ...actionPayload, _setState: evp._setState }
				return actionPayload;
			});
	}

	evs(events:{ type:string, ctx:IEvCtxDef, aSetState?:string }[]) {
		events.map((event) => {
			this.ev(event.type, event.ctx, event.aSetState);
		});
	}
	
	// ---
	// sia(type:string, clbSetPayload?:any) { // OK // < t/Dcs
	// 	this.currentSTAction = new STAction(type, clbSetPayload);
	// 	return this;
	// }
	// stateEvs(clbSetStateEVs:any) { // R/
	// 	// set events
	// 	let currentSTAction = this.currentSTAction;
	// 	clbSetStateEVs(currentSTAction);
	// 	// construction
	// 	this.ui.action() // < ev
	// 		.check('check event - ctx', (ev:Signal) => {
	// 			// if(action_type == '[CRUD] create') { // < X
	// 			// 	debugger;
	// 			// }
	// 			console.log('-> sop/check - w/%s, ui/%s', evCtxDef.w, evCtxDef.ui, ev)
	// 			if(ev.payload.useCtx) {
	// 				return ev.payload.useCtx == evCtxDef.useCtx && ev.type == type && ev.payload.w == evCtxDef.w && ev.payload.ui == evCtxDef.ui;
	// 			}
	// 			else {
	// 				return ev.type == type && ev.payload.w == evCtxDef.w && ev.payload.ui == evCtxDef.ui;
	// 			}
	// 		})
	// 		.toOutput(action_type, (evp:any) => { 
	// 			console.log('--> sop/toOutput - w/%s, ui/%s', evCtxDef.w, evCtxDef.ui, evp)
	// 			return action_clbSetPayload(evp) 
	// 		});
	// }
}

class STAction {
	
	type:string;
	clbSetPayload:any;
	_startEvs:any[];
	_stopEvs:any[];

	constructor(type:string, clbSetPayload?:any) {
		// code...
	}

	startEvs(events:{ type:string, ctx:IEvCtxDef }[]) {

	}

	stopEvs(events:{ type:string, ctx:IEvCtxDef }[]) {

	}
}

interface IEvCtxDef {
	w:string;
	ui:string;
	useCtx?:string;
}