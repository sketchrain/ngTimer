// angular
import { Injectable } from '@angular/core';
// flow
import { Signal, ISignal, AXStream, Category, Managers } from '../../flow/core/fl-core';
// app
import { Operators } from './ngt-operators';
import { Task, TaskGroup, WTask, WTaskGroup, Widget, WTimeCounter } from './ngt-states';

@Injectable()
export class Reducers extends Category {
	
	constructor(m:Managers, private operations:Operators) {
		super(m);

		// Set modul interaction
		this.reducers();
		this.sm.connectToActions()

		// Connect to Input
		// this.sm.connectOneToInput(this.im, (inActions:ISignal[]) => {

		// 	let inputActions:ISignal[] = inActions.map((inAction:ISignal) => {
		// 			return inAction;
		// 		});
			
		// 	console.log('-> Re/input actions: ', inputActions);
		// 	//this.se.dispatch(inputActions[0].type, inputActions[0].payload);
		// 	this.sm.dispatchMany(inputActions);
		// });

		/* Output Actions -> to dm/
			- a/[UI Switch] switch w/loger
			- a/[Nav] presmerovani ...
			- a/[UI Set] ser variant
			- a/[View Change] modifiy view
			- a/[Query Filter] filter by /user
			- a/[Query Filter] filter by /parent
		*/
	}

	reducers() {
		this.reducersV1();
		//this.reducersV2();
	}

	reducersV1() {
		this.al.log('AX3,App,Bo', '', 'Bootstrap - reducers - v1', [], null);
		
		let stream:AXStream;
		
		// TEST
		// --------------------------------------------------------
		stream = this.sm.reducer('[Test Init] test init') // < w/A,B, ...
			.toOutput((action:Signal, p:any) => {
				let targetWidget = action.payload.widget;
				let changedState = this.sm.dm.setState(targetWidget, (state) => {
					return state;
				});
				return action.use('[State] changed state', { changedState: changedState }, stream.am);
			})
		// UI
		// --------------------------------------------------------
		stream = this.sm.reducer('[UI Set] set variant') // < w/A,B, ...
			.toOutput((action:Signal, p:any) => {
				let targetWidget = action.payload.widget;
				let changedState = this.sm.dm.setState(targetWidget, (state) => {
					// return {
					// 	...state,
					// 	variant: action.payload.variant,
					// };
					state.variant = action.payload.variant;
					return state;
				});
				return action.use('[State] changed state', { changedState: changedState }, stream.am);
			})
		stream = this.sm.reducer('[UI Switch] switch w/Loger')
			.toOutput((action:Signal, p:any) => {
				let changedState = this.sm.dm.setState('w/Loger', (loger) => {
					loger.action = loger.action == 'logIn' ? 'signIn' : 'logIn';
					return loger;
				});
				return action.use('[State] changed state', { changedState: changedState }, stream.am);
			})
		stream = this.sm.reducer('[UI Show/Hide] show')
			.toOutput((action:Signal, p:any) => {
				let changedState = this.sm.dm.setState(action.payload.widget, (state) => {
					state.show = state.show == false ? true : false;
					return state;
				});
				return action.use('[State] changed state', { changedState: changedState }, stream.am);
			})
		stream = this.sm.reducer('[UI Switch] switch element')
			.toOutput((action:Signal, p:any) => {

				let a = this.sm.dm.source.nodes.filter((dNode) => {
					if(dNode instanceof WTaskGroup) {
						return true;
					}
				});

				let b = this.sm.dm.selectByID(WTaskGroup, 0);
				let gt = this.sm.dm.utils.getTypeFor(p.widget);
				let c = this.sm.dm.selectByID(gt, 0);

				let changedState = this.sm.dm.setState(this.sm.dm.selByID({ t:p.widget, id:p.id}), (state) => {
					state[p.elToSwitch].switchState = state[p.elToSwitch].switchState == true ? false : true;
					return state;
				});
				return action.use('[State] changed state', { changedState: changedState }, stream.am);
			})

		// CHANGE
		// --------------------------------------------------------
		stream = this.sm.reducer('[Change] widgets data') // < w/Loger
			.toOutput((action:Signal, p:any) => {
				switch (action.payload.widget) {
					case "w/LogIn":
						var user = action.payload.data;
						var changedState = this.sm.dm.setState(action.payload.widget, (state) => {
							state.user = {
								name:undefined,
								email:<string> user.email,
								password:<string> user.password,
								checkPassword:undefined,
							};
							return state;
						});
						return action.use('[State] changed state', { changedState: changedState }, stream.am);
					case "w/SignIn":
						var changedState = this.sm.dm.setState(action.payload.widget, (state) => {
							return state.user = {
								name:<string> action.payload.user.name,
								email:<string> action.payload.user.email,
								password:<string> action.payload.user.password,
								checkPassword:<string> action.payload.user.checkPassword,
							};
						});
						return action.use('[State] changed state', { changedState: changedState }, stream.am);
					case "w/taskItem":case "w/taskGroupItem": 
						// code... // < t/Todo:
						break;
				}
			})
		// ...
		stream = this.sm.reducer('[View Component] init, reload data') // < w/Loger
			.toOutput((action:Signal, p:any) => {
				let changedState = this.sm.dm.setState(action.payload.widget, (state) => {
					// return {
					// 	...state,
					// 	variant: action.payload.variant,
					// };
					return state;
				});
				return action.use('[State] changed state', { changedState: changedState }, stream.am);
			})
		// NAV
		// --------------------------------------------------------
		stream = this.sm.reducer(['[Nav] presmerovani (app/auth)', '[Nav] presmerovani (app/taskGroups)', '[Nav] presmerovani (app/tasks)'])
			.toOutput((action:Signal, p:any) => {
				let changedState = this.sm.dm.setState('w/App', (state) => {
					// return { outletTarget: action.url }; // < t/Dcs
					state.outletTarget = action.payload.url;
					return state;
				});
				//this.al.log('App,Re', undefined, '-> model changed: w/app', [this.sm.source.nodes], null); // < t/Dcs
				return action.use('[State] changed state', { changedState: changedState }, stream.am);
			})
		// QUERY, FILTER
		// --------------------------------------------------------
		stream = this.sm.reducer(['[Query Filter] filter by /user', '[Query Filter] filter by /parent'])
			.operation('convert server data', (action:Signal, p:any) => { // convert selected server data
				switch (action.type) {
					case "[Query Filter] filter by /user":
						return this.im.utils.modifyAction(action, { view:'v/Tasks', items: this.convertJSONData(p.items, Task) });
					default:
						return action;
				}
			})
			.toOutput((action:Signal, p:any) => { // set Views
				let changedState = this.sm.dm.setState(p.view, (state) => {
					state.items = action.payload.items;
					return state;
				});
				return action.use('[State] changed state', { changedState: changedState }, stream.am);
			})
			.toOutput((action:Signal, p:any) => { // set Widgets by viewes data

				// var tragetView = action.payload.target; < X
				if(p.view  == 'v/TaskGroups') {
					let changedState = this.sm.dm.setState('w/PrehledItems', (state) => {
						state.items = p.items.map((dTG) => {
							let wTG:any = this.sm.dm.createInst(WTaskGroup, {
								changedName: '',
								name: dTG.name, // <-from/DTask
								id: dTG.id,
								celkOdpCas: dTG.odpCas,
								ui_etName:{ switchState: false },
								// nodes - X
							}).lastCreated;
							return wTG;
						})
						state.connectMany(state.items);
						return state;
					});
					return action.use('[State] changed state', { changedState: changedState }, stream.am);
				}
				else if('v/Tasks') { // < v/Tasks
					let changedState = this.sm.dm.setState('w/PrehledItems', (state) => {
						state.items = p.items.map((dT) => {
							let wT:any = this.sm.dm.createInst(WTask, {
								changedName: '',
								name: dT.name, // <-from/DTask
								id: dT.id,
								odpCas: dT.odpCas,
								ui_etName:{ switchState: false },
								// nodes
								timeCounter: null,
								open: dT.open,
							}).lastCreated;

							wT.timeCounter = this.sm.dm.createInst(WTimeCounter, { name:'tc-'+dT.name, state:dT.timeCounter.state, odpCas:dT.odpCas }).lastCreated;
							wT.connect(wT.timeCounter);
							return wT;
						})
						state.connectMany(state.items);
					});
					return action.use('[State] changed state', { changedState: changedState }, stream.am);
				}
				else {
					return action.use(null, { _ctx:'op/no view to set'}, stream.am); // < t/???
				}
			});
		// /Output-> chanched /States by actions
	}

	reducersV2() {
		this.al.log('AX3,App,Bo', '', 'Bootstrap - reducers - v2', [], null);
		
		let stream:AXStream;
		
		// TEST
		// --------------------------------------------------------
		stream = this.sm.reducer(['[Test Init] test init']) // < w/A,B, ...
			.toOutput((action:Signal, p:any) => {
				let targetWidget = action.payload.widget;
				let changedState = this.sm.dm.setState(targetWidget, (state) => {
					return state;
				});
				return action.use('[State] changed state', { changedState: changedState }, stream.am);
			})
		// UI
		// --------------------------------------------------------
		stream = this.sm.reducer(['[UI Set] set variant']) // < w/A,B, ...
			.toOutput((action:Signal, p:any) => {
				let targetWidget = action.payload.widget;
				let changedState = this.sm.dm.setState(targetWidget, (state) => {
					// return {
					// 	...state,
					// 	variant: action.payload.variant,
					// };
					state.variant = action.payload.variant;
					return state;
				});
				return action.use('[State] changed state', { changedState: changedState }, stream.am);
			})
		stream = this.sm.reducer(['[UI Switch] switch w/Loger'])
			.toOutput((action:Signal, p:any) => {
				let changedState = this.sm.dm.setState('w/Loger', (loger) => {
					loger.action = loger.action == 'logIn' ? 'signIn' : 'logIn';
					return loger;
				});
				return action.use('[State] changed state', { changedState: changedState }, stream.am);
			})
		stream = this.sm.reducer(['[UI Show/Hide] show'])
			.toOutput((action:Signal, p:any) => {
				let changedState = this.sm.dm.setState(action.payload.widget, (state) => {
					state.show = state.show == false ? true : false;
					return state;
				});
				return action.use('[State] changed state', { changedState: changedState }, stream.am);
			})
		stream = this.sm.reducer(['[UI Switch] switch element'])
			.toOutput((action:Signal, p:any) => {

				let a = this.sm.dm.source.nodes.filter((dNode) => {
					if(dNode instanceof WTaskGroup) {
						return true;
					}
				});

				let b = this.sm.dm.selectByID(WTaskGroup, 0);
				let gt = this.sm.dm.utils.getTypeFor(p.widget);
				let c = this.sm.dm.selectByID(gt, 0);

				let changedState = this.sm.dm.setState(this.sm.dm.selByID({ t:p.widget, id:p.id}), (state) => {
					state[p.elToSwitch].switchState = state[p.elToSwitch].switchState == true ? false : true;
					return state;
				});
				return action.use('[State] changed state', { changedState: changedState }, stream.am);
			})

		// CHANGE
		// --------------------------------------------------------
		stream = this.sm.reducer('[Change] widgets data') // < w/Loger
			.toOutput((action:Signal, p:any) => {
				switch (action.payload.widget) {
					case "w/LogIn":
						var changedState = this.sm.dm.setState(action.payload.widget, (state) => {
							return state.user = {
								name:undefined,
								email:<string> action.payload.user.email,
								password:<string> action.payload.user.password,
								checkPassword:undefined,
							};
						});
						return action.use('[State] changed state', { changedState: changedState }, stream.am);
					case "w/SignIn":
						var changedState = this.sm.dm.setState(action.payload.widget, (state) => {
							return state.user = {
								name:<string> action.payload.user.name,
								email:<string> action.payload.user.email,
								password:<string> action.payload.user.password,
								checkPassword:<string> action.payload.user.checkPassword,
							};
						});
						return action.use('[State] changed state', { changedState: changedState }, stream.am);
					case "w/taskItem":case "w/taskGroupItem": 
						// code... // < t/Todo:
						break;
				}
			})
		// ...
		stream = this.sm.reducer(['[View Component] init, reload data']) // < w/Loger
			.toOutput((action:Signal, p:any) => {
				let changedState = this.sm.dm.setState(action.payload.widget, (state) => {
					// return {
					// 	...state,
					// 	variant: action.payload.variant,
					// };
					return state;
				});
				return action.use('[State] changed state', { changedState: changedState }, stream.am);
			})
		// NAV
		// --------------------------------------------------------
		stream = this.sm.reducer(['[Nav] presmerovani (app/auth)', '[Nav] presmerovani (app/taskGroups)', '[Nav] presmerovani (app/tasks)'])
			.toOutput((action:Signal, p:any) => {
				let changedState = this.sm.dm.setState('w/App', (state) => {
					// return { outletTarget: action.url }; // < t/Dcs
					state.outletTarget = action.payload.url;
					return state;
				});
				//this.al.log('App,Re', undefined, '-> model changed: w/app', [this.sm.source.nodes], null); // < t/Dcs
				return action.use('[State] changed state', { changedState: changedState }, stream.am);
			})
		// QUERY, FILTER
		// --------------------------------------------------------
		stream = this.sm.reducer(['[Query Filter] filter by /user', '[Query Filter] filter by /parent'])
			.operation('convert server data', (action:Signal, p:any) => { // convert selected server data
				switch (action.type) {
					case "[Query Filter] filter by /user":
						return this.im.utils.modifyAction(action, { view:'v/TaskGroups', items: this.convertJSONData(p.items, TaskGroup) });
					case "[Query Filter] filter by /parent":
						return this.im.utils.modifyAction(action, { view:'v/Tasks', items: this.convertJSONData(p.items, Task) });
					default:
						return action;
				}
			})
			.toOutput((action:Signal, p:any) => { // set Views
				let changedState = this.sm.dm.setState(p.view, (state) => {
					state.items = action.payload.items;
					return state;
				});
				return action.use('[State] changed state', { changedState: changedState }, stream.am);
			})
			.toOutput((action:Signal, p:any) => { // set Widgets by viewes data

				// var tragetView = action.payload.target; < X
				if(p.view  == 'v/TaskGroups') {
					let changedState = this.sm.dm.setState('w/PrehledItems', (state) => {
						state.items = p.items.map((dTG) => {
							let wTG:any = this.sm.dm.createInst(WTaskGroup, {
								changedName: '',
								name: dTG.name, // <-from/DTask
								id: dTG.id,
								celkOdpCas: dTG.odpCas,
								ui_etName:{ switchState: false },
								// nodes - X
							}).lastCreated;
							return wTG;
						})
						state.connectMany(state.items);
						return state;
					});
					return action.use('[State] changed state', { changedState: changedState }, stream.am);
				}
				else if('v/Tasks') { // < v/Tasks
					let changedState = this.sm.dm.setState('w/PrehledItems', (state) => {
						state.items = p.items.map((dT) => {
							let wT:any = this.sm.dm.createInst(WTask, {
								changedName: '',
								name: dT.name, // <-from/DTask
								id: dT.id,
								odpCas: dT.odpCas,
								ui_etName:{ switchState: false },
								// nodes
								timeCounter: null,
								open: dT.open,
							}).lastCreated;

							wT.timeCounter = this.sm.dm.createInst(WTimeCounter, { name:'tc-'+dT.name, state:dT.timeCounter.state, odpCas:dT.odpCas }).lastCreated;
							wT.connect(wT.timeCounter);
							return wT;
						})
						state.connectMany(state.items);
					});
					return action.use('[State] changed state', { changedState: changedState }, stream.am);
				}
				else {
					return action.use(null, { _ctx:'op/no view to set'}, stream.am); // < t/???
				}
			});
		// /Output-> chanched /States by actions
	}

	// CONVERZE DAT ZE SERVERU
	private convertJSONData(JSONData:any[], Type:any) {
		return JSONData.map((data:any) => { // < tDcs
			
			let newInst = null;

			switch (Type) {
				case Task:
					newInst = this.sm.dm.createInst(Type, {
						name: data.name, // <-from/DTaskGroup
						id: data.id,
						odpCas: data.odpCas,
						open: data.open,
						timeCounter: data.timeCounter,
					}).lastCreated;
					break;
				
				// case TaskGroup: // < t/v2.0
				// 	newInst = this.sm.dm.createInst(Type, {
				// 		name: data.name, // <-from/DTaskGroup
				// 		id: data.id,
				// 		celkOdpCas: data.celkOdpCas,
				// 	}).lastCreated;
				// 	break;
				default:
					return null;
			}
			return newInst;
		});
	}
}