// angular
import { Injectable } from '@angular/core';
// rxjs
import { from, Observable, Subject, BehaviorSubject } from 'rxjs';
// Flow
import { Category, Managers, ISignal, Signal, AXStream} from '../../flow/core/fl-core';
// app
import { JwtService, ServerAPI, ServerAPIMock } from './ngt-server';
import { Operators } from './ngt-operators';
import { Task, WTask } from './ngt-states';
import * as M from './ngt-states';

@Injectable()
export class Interactions extends Category {

	constructor(
		m:Managers, 
		private operations:Operators, 
		private jwtService:JwtService,
		private serverMock:ServerAPIMock, 
		private server:ServerAPI) {
		super(m);
		this.interactions();
		this.im.connectToActions();

		// Connect to Input
		this.im.connectOneToInput(this.ui, (inActions:ISignal[]) => {

			let inputActions:ISignal[] = inActions.map((inAction:ISignal) => {
					return inAction;
				});
			
			let inputAction = inputActions[0];
			
			if(inputAction.payload._setState) {
				
				this.im.stActionsManager.setSTActions(inputAction, (stAction:any) => {
					console.log('-> In/input actions - emited sta/%s, time/%s', stAction.type, stAction.payload._timer.time, stAction.payload);
					this.im.dispatch(stAction.type, stAction.payload);
				})

				if(inputAction.payload._setState == ':stop') {
					this.im.dispatch(inputAction.type, inputAction.payload);
				}
			}
			else {
				console.log('-> In/input actions: ', inputActions);
				//this.se.dispatch(inputActions[0].type, inputActions[0].payload);
				
				this.im.dispatch(inputAction.type, inputAction.payload);
			}
		});
	}

	interactions() {
		this.interactionV1();
		//this.interactionV2();
	}

	interactionV1() {
		let stream:AXStream;

		this.al.log('AX3,App,Bo', '', 'Bootstrap - int', [], null);

		// TEST
		stream = this.im.action('[Test Init] test init', { widget:<any> null })
			.toOutput('[Test Init] test init');
		
		// CHANGE
		// --------------------------------------------------------
		stream = this.im.action('[Change] widgets data', null) // { widget:, data: } < t/A/[]
			.setState((action:Signal, p:any) => {
				switch (action.payload.widget) {
					case "w/LogIn":
						var user = action.payload.data;
						var changedState = this.sm.dm.setState(action.payload.widget, (state:any) => {
							state.user = {
								name:undefined,
								email:<string> user.email,
								password:<string> user.password,
								checkPassword:undefined,
							};
							return state;
						});
						return this.am.utils.modifyAction(action, { changedState: changedState });
					case "w/SignIn":
						var user = action.payload.data;
						var changedState = this.sm.dm.setState(action.payload.widget, (state:any) => {
							state.user = {
								name:<string> user.name,
								email:<string> user.email,
								password:<string> user.password,
								checkPassword:<string> user.checkPassword,
							};
							return state;
						});
						return this.am.utils.modifyAction(action, { changedState: changedState });
					case "w/ItemEditor":
						var itemName = action.payload.data;
						var changedState = this.sm.dm.setState(action.payload.widget, (state:any) => {
							state.itemName = itemName;
							return state;
						});
						return this.am.utils.modifyAction(action, { changedState: changedState });
					case "w/taskItem":case "w/taskGroupItem": 
						// code... // < t/Todo:
						break;
				}
			})
			.toOutput('[State] changed state', (prevAPay:any)=> { return { changedState: prevAPay.changedState } });

		// INFO
		// --------------------------------------------------------
		// [Info Change] change ukazatel - celk odp cass

		stream = this.im.action('[Info Change] change ukazatel - pocet tasks')
			.setState((a:Signal, p:any) => {
				let vTasks:any = this.sm.dm.selectOne('v/Tasks').result;
				let changedState = this.sm.dm.setState('w/PrehledItemsHeader', (state) => {
					state.createdTasks = vTasks.items.length;
					return state;
				});
				return a.addToOutput('[State] changed state', { changedState: changedState }, stream.am);
			});
		stream = this.im.action('[Info Change] change ukazatel - celk odp cas')
			.setState((a:Signal, p:any) => {
				let vTasks:any = this.sm.dm.selectOne('v/Tasks').result;
				
				let celkOdpCas = 0;
				vTasks.items.forEach((dT:any) => {
					celkOdpCas += dT.odpCas;
				});

				let changedState = this.sm.dm.setState('w/PrehledItemsHeader', (state) => {
					state.celkOdpCas = celkOdpCas;
					return state;
				});
				return a.addToOutput('[State] changed state', { changedState: changedState }, stream.am);
			});

		// UI
		// --------------------------------------------------------
		stream = this.im.action('[UI Set] set variant', { widget:<any> null, variant:<any> null });
		stream = this.im.action('[UI Switch] switch w/Loger', null)
			.setState((a:Signal, p:any) => {
				let changedState = this.sm.dm.setState('w/Loger', (loger) => {
					loger.action = loger.action == 'logIn' ? 'signIn' : 'logIn';
					return loger;
				});
				return a.addToOutput('[State] changed state', { changedState: changedState }, stream.am);
			});
			//.toOutput('[UI Switch] switch w/Loger') // < t/X

		stream = this.im.action('[UI Switch] switch element', { id:<number> undefined, widget:<any>null, element:<any>null })
			.toOutput('[UI Switch] switch element');
		stream = this.im.action('[UI Show/Hide] show', { widget:<any> null, })
			.setState((a:Signal, p:any) => {
				let changedState = this.sm.dm.setState(p.widget, (state) => { // show/hide widget
					state.show = state.show == true ? false : true;
					if(p.useCtx) { // set /use-ctx
						state.useCtx = p.useCtx;
						state.useCtxData = p.useCtxData;
					}
					return state;
				});
				return a.addToOutput('[State] changed state', { changedState: changedState }, stream.am);
			});
			//.toOutput('[UI Show/Hide] show');
		stream = this.im.action('actionC', null);
		
		// NAV
		// --------------------------------------------------------
		stream = this.im.action('[Nav] pristup (/)', null)
			.next('[Auth] authentizace');
		stream = this.im.action('[Nav] presmerovani (app/taskGroups)', { url:'app/task-groups' })	// -> Re/
			.toOutput((sig:Signal, p:any) => {
				return sig.use(sig.type, { url:'app/task-groups' } , stream.am);
			});
		stream = this.im.action('[Nav] presmerovani (app/tasks)', { url:'app/tasks' })	// -> Re/
			.setState((a:Signal) => {
				let changedState = this.sm.dm.setState('w/App', (state) => {
					state.outletTarget = 'app/tasks';
					return state;
				})
				return a.addToOutput('[State] changed state', { changedState: changedState }, stream.am);
			})
			// .toOutput((sig:Signal, p:any) => {
			// 	return sig.use(sig.type, { url:'app/tasks' } , stream.am);
			// });
		stream = this.im.action('[Nav] presmerovani (app/auth)', { url:'auth' }) // -> Re/
			.setState((a:Signal) => {
				let changedState = this.sm.dm.setState('w/App', (state) => {
					state.outletTarget = 'auth';
					return state;
				})
				return a.addToOutput('[State] changed state', { changedState: changedState }, stream.am);
			})
			// .toOutput((sig:Signal, p:any) => {
			// 	return sig.use(sig.type, { url:'auth' } , stream.am);
			// });
		
		// Info
		// --------------------------------------------------------
		// /*ok/N*/stream = this.im.action('[Info Change] change ukazatel - pocet tasks') // { X } // /ise-> ?
		// 	.operation('', (a:Signal, p:any) => {
		// 		let vTasks:any = this.sm.dm.selectOne('v/Tasks').result;
		// 		return this.am.utils.modifyAction(a, { pocetTasks: vTasks.items.length });
		// 	})
		/*N*/// this.ax.action('[Info Change] change ukazatel - celk odp cas'); // /ise-> ?			
		// 	.operation((a:Action) => {
		// 		let vTasks = this.ax.dm.select('one', VTasks);	
		// 		let celkOdpCas = 0;
		// 		vTasks.forEach((dnTask) => {
		// 			celkOdpCas += dnTask.odpCas;
		// 		});
		// 		return this.am.utils.modifyAction(a, { celkOdpCas: celkOdpCas });
		// 	})

		// AUTH
		// --------------------------------------------------------
		stream = this.im.action('[Auth] logIn') // < t/Server // < P < fa(D2/InUT,OK/In) // << R/2h15m
			.Xoperation('', (action:Signal, p:any) => { // logIn to server
				let user = action.payload.user;
				return this.im.utils.modifyAction(action, { res: this.serverMock.logIn(user, action.payload.dbg) });
			})
			.asyncOperation('', (action:Signal) => { // overeni uzivatele na serveru;
				let user = action.payload.user;
				return this.server.logIn(user, (res:any) => {
					return this.im.utils.modifyAction(action, { res: res });
				});
			})
			.operation('', (a:Signal, p:any) => { // op/save token
				if(p.res.succes) {
					let token = p.res.data.token;
					this.jwtService.saveToken(token);
				}
				return a;
			})
			.setState((a:Signal, p:any) => { // nastevní feedback messahe pro logIn
				let res = a.payload.res;
				let changedState = this.sm.dm.setState('w/LogIn', (state) => {
					state.infoMessage = res == true ? '' : 'not able to logIn';
					return state;
				});
				return a.addToOutput('[State] changed state', { changedState: changedState }, stream.am);
			})
			.next((action) => {
				let res = action.payload.res;
				switch (res.succes) {
					case true:
						this.operations.saveToken(action.payload.res.data);
						return action.use('[Auth] authentizace', {}, stream.am);
					case false:
						return action.use('[Auth] DEauthentizace', {}, stream.am);
				}
			});
		stream = this.im.action('[Auth] register') // < t/Server
			.Xoperation('', (action:Signal, p:any) => { // signIn to server
				let user = action.payload.user;
				return this.im.utils.modifyAction(action, { res: this.serverMock.register(user, action.payload.dbg) });
			})
			.asyncOperation('', (action:Signal) => { // overeni uzivatele na serveru;
				let user = action.payload.user;
				return this.server.register(user, (res:any) => {
					return this.im.utils.modifyAction(action, { res: res });
				});
			})
			.operation('', (a:Signal, p:any) => { // op/save token
				if(p.res.succes) {
					let token = p.res.data.token;
					this.jwtService.saveToken(token);
				}
				return a;
			})
			.setState((a:Signal, p:any) => { // nastevní feedback messahe pro logIn
				let res = a.payload.res;
				let changedState = this.sm.dm.setState('w/SignIn', (state) => {
					state.infoMessage = res == true ? '' : 'not able to register';
					return state;
				});
				return a.addToOutput('[State] changed state', { changedState: changedState }, stream.am);
			})
			.next((action) => {
				let res = action.payload.res;
				switch (res.succes) {
					case true:
						this.operations.saveToken(action.payload.res.data);
						return action.use('[Auth] authentizace', {}, stream.am);
					case false:
						return action.use('[Auth] DEauthentizace', {}, stream.am);
				}
			});
		stream = this.im.action('[Auth] logOut') // { X }
			.operation('', (a:Signal) => {
				this.im.stActionsManager.stopAll();
				return a;
			})
			.next('[Auth] DEauthentizace') 
		stream = this.im.action('[Auth] DEauthentizace', null) // { X }
			.operation('op/destroy user token', (action:Signal) => { // destoroy saved token
				//let userSession:any = this.sm.dm.selectOne('o/UserSession').result;
				//this.operations.destroyToken({ token: userSession.token });
				if(this.jwtService.getToken()) { 
					 this.jwtService.destroyToken()
				}
				return action;
			})
			.setState((a:Signal, p:any) => { // nastevní feedback messahe pro logIn
				let changedState = this.sm.dm.setState('w/LogIn', (state) => {
					state.infoMessage = 'odhlaseni';
					return state;
				});
				return a.addToOutput('[State] changed state', { changedState: changedState }, stream.am);
			})
			.next('[Nav] presmerovani (app/auth)');
		stream = this.im.action('[Auth] authentizace', null) // < t/Server
			.Xoperation('op/get user', (action:Signal, p:any) => { // Mock server api/getUser
				let userToken = this.jwtService.getToken();
				return this.im.utils.modifyAction(action, { res: this.serverMock.getUser(userToken, action.payload.dbg_getUser) });
			})
			.asyncOperation('op/get user', (action:Signal) => { // overeni uzivatele na serveru
				//let userSession:any = this.sm.dm.selectOne('o/UserSession').result;
				let userToken = this.jwtService.getToken();
				return this.server.getUser(userToken, (res:any) => {
					return this.im.utils.modifyAction(action, { res: res });
				});
					// .response((res) => {
					// 	return this.im.utils.modifyAction(action, { res: res });
					// });

				//return this.im.utils.asyncModifyAction(action, this.server.getUser(userToken, action.payload.dbg_getUser))
				//return this.im.utils.modifyAction(action, { res: this.server.getUser(userToken, action.payload.dbg_getUser) });
			})
			.next((action:Signal, p:any, ) => { // < var/1 // vyhodnoceni server-response
				let res = action.payload.res;
				switch (res.succes) {
					case true:
						if(action.payload.dbg) {
							switch (action.payload.dbg.url) { // < t/Dbg
								case "app/task-groups":
									return action.use('[Nav] presmerovani (app/taskGroups)', { _ctx:'user-succes' }, stream.am);
								
								case "app/tasks":
									return action.use('[Nav] presmerovani (app/tasks)', { _ctx:'user-succes' }, stream.am);
							}
						}
						else {
							return action.use('[Nav] presmerovani (app/tasks)', { _ctx:'user-succes' }, stream.am);
						}
					case false:
						return action.use('[Auth] DEauthentizace', { _ctx:'user-fail' }, stream.am);
				}
			})
			//.condition((a,p) => { return p.res == true; }).next(); // < var/2
			//.condition((a,p) => { return p.res == false; }).next();

		// CRUD (Akce)
		// --------------------------------------------------------
		/*ok/N*/stream = this.im.action('[CRUD] create') // { DNode, cfg, dbg } // /se-> // < t/Server
			.Xoperation('', (action:Signal) => {
				return this.im.utils.modifyAction(action, { res: this.serverMock.create(action.payload.DNode, action.payload.cfg, action.payload.dbg) } );
			})
			.asyncOperation('', (action:Signal) => { // overeni uzivatele na serveru;
				return this.server.create(action.payload.DNode, action.payload.cfg, (res:any) => {
					return this.im.utils.modifyAction(action, { res: res });
				});
			})
			.next('[View] change/update views', (p) => { 
				return { action:'create', view:'v/Tasks', data: p.res.data } 
			});
		/*N*/stream = this.im.action('[CRUD] delete') // { DNode, id } // < t/Server
			.Xoperation('', (action:Signal) => {
				return this.im.utils.modifyAction(action, { res: this.serverMock.delete(action.payload.DNode, action.payload.id, action.payload.dbg) } );
			})
			.asyncOperation('', (action:Signal) => { // overeni uzivatele na serveru;
				return this.server.delete(action.payload.DNode, action.payload.id, (res:any) => {
					return this.im.utils.modifyAction(action, { res: res });
				});
			})
			.operation('', (a:Signal, p:any) => { // delet action
				if(p.res.succes) {
					let stActionToDelete = this.im.stActionsManager.stActions.find((stAction:any) => {
						return stAction.id == p.id;
					})
					if(stActionToDelete){
						this.im.stActionsManager.deleteSTAction(stActionToDelete);
						window.localStorage.removeItem(p.id);
					}
				}
				return a;
			})
			.next('[View] change/update views', (p) => { 
				return { action:'delete', view:'v/Tasks', data: p.res.data } 
			})
			.se('[Info Change] change ukazatel - pocet tasks')
			.se('[Info Change] change ukazatel - celk odp cas');
		/*N*/stream = this.im.action('[CRUD] update') // { DNode, id, cfg, (dbg) } // < td/dFlow // < t/Server
			.Xoperation('', (action:Signal, p:any) => {
				let a = null;
				if(p.localy) { // local update
					let dNodeToUpdate = this.sm.dm.selectByID(action.payload.DNode, action.payload.id).result;

					let cfg = action.payload.cfg;
					Object.keys(cfg).map((cfgKey) => {
						let newValue = cfg[cfgKey];
						Object.defineProperty(dNodeToUpdate, cfgKey, { value: newValue })
					})

					a = this.im.utils.modifyAction(action, { res: { data: dNodeToUpdate }  } );
				}
				else {
					a = this.im.utils.modifyAction(action, { res: this.serverMock.update(action.payload.DNode, action.payload.id, action.payload.cfg, action.payload.dbg) } );
				}
				return a;
			})
			.asyncOperation('', (action:Signal, p:any) => { // overeni uzivatele na serveru;
				if(p.localy) {
					let dNodeToUpdate = this.sm.dm.selectByID(action.payload.DNode, action.payload.id).result;

					let cfg = action.payload.cfg;
					Object.keys(cfg).map((cfgKey) => {
						let newValue = cfg[cfgKey];
						Object.defineProperty(dNodeToUpdate, cfgKey, { value: newValue })
					})

					let a = this.im.utils.modifyAction(action, { res: { data: dNodeToUpdate }  } );
					return new BehaviorSubject(a);
				}
				else {
					return this.server.update(action.payload.DNode, action.payload.id, action.payload.cfg, (res:any) => {
						return this.im.utils.modifyAction(action, { res: res });
					});
				}
			})
			.next('[View] change/update views', (p) => { 
				return { action:'update', view:'v/Tasks', data: p.res.data } 
			})
			.se('[Info Change] change ukazatel - celk odp cas');
			// -> se/'[Info Change] change ukazatel - celk odp cass'

		// AKCE
		// --------------------------------------------------------
		stream = this.im.action('[Akce St] set odp cas')
			.operation('', (action:Signal, p:any) => {
				console.log('-> provedeni akce a/%s', action.type, action.payload);
				let a = null;

				if(p._setState == ':stop') {
					a = this.im.utils.modifyAction(action, { cfg: { odpCas: 0 } } );
				}
				else {
					window.localStorage.setItem(p._id, p._timer.time);
					a = this.im.utils.modifyAction(action, { cfg: { odpCas: p._timer.time } } );
				}

				return a;
			})
			.next('[CRUD] update', (p:any) => { return { DNode:p.DNode, id:p._id, cfg:p.cfg, localy: true } });

		// VIEW, COMPONENT, CHANGE 
		// --------------------------------------------------------
		stream = this.im.action('[View Component] init, reload data', { fromCtx:'', widget:<any> null, variant:<string> '', id:<number> 0, view:<string> '' })
			// <- ang/Comp.ngOnInit
			.setState((action:Signal, p:any) => { // set variant
				let changedState = this.sm.dm.setState(action.payload.widget.targetWStx, (state) => {
					state.variant = p.variant;  // < a/set variant
					return state;
				});
				return action.addToOutput('[State] changed state', { changedState: changedState }, stream.am); // /a-> new
			})
			.next('[View Change] init views', (p) => { 
				return p;
			});
			// .toOutput('[View Component] init, reload data')
			// .toOutput((action:Signal, p:any) => {
			// 	let dbg = 0;
			// 	return action.payload.variant
			// 		? action.use('[UI Set] set variant', { widget: p.widget, variant: p.variant }, stream.am)
			// 		: action.use(action.type, action.payload, stream.am);
			// })
			// .next('[View Change] init views');
		stream = this.im.action('[View Change] init views', { fromCtx:'', widget:<any> null, variant:<string> '', id:<number> 0, view:<string> '' })
			// {  } // < [View Component] init, reload data
			// .next('[Query Init] query', (p) => { 
			// 	return { query: p.query, viewType: p.view, targetWStx: p.widget.targetWStx  }; 
			// })
			.next((a:Signal, p:any) => {
				if(p.view) {
					return a.use('[Query Init] query', { query: p.query, viewType: p.view, targetWStx: p.widget.targetWStx }, stream.am);
				}
				else {
					return a.addToOutput(null, { _ctx:'NONE view' }, stream.am);
				}
			})
			// .operation('op/select data for views', (action:Signal) => { //  < t/X
			// 	//return this.am.utils.modifyAction(action, { res: this.serverMock.select(action.payload.query, action.payload.dbg) })
			// 	let dbg = 0;
			// 	return this.im.utils.modifyAction(action, { res: this.serverMock.select(action.payload.query.q, action.payload.dbg_opSelect) });
			// })
			// .toOutput((action:Signal, p:any) => {
			// 	let used;
			// 	let res = action.payload.res;
			// 	if(action.payload.res && action.payload.views && action.payload.views.length > 0) {
			// 		let views = action.payload.views; // < t/???
			// 		let switchedActions = views.map((view) => {
			// 			switch (view) {
			// 				case "v/TaskGroups":
			// 					//var items = this.operations.convertJSONData(res.data, TaskGroup);
			// 					used = action.use('[Query Filter] filter by /user', { items: res.data }, stream.am) // -> to DM
			// 					break;
			// 				case "v/Tasks":
			// 					//var items = this.operations.convertJSONData(res.data, Task);
			// 					used = action.use('[Query Filter] filter by /parent', { items: res.data }, stream.am) // -> to DM
			// 					break;
			// 			}
			// 		})
			// 		if(!switchedActions[0]) {  // switchedActions[0]; // < t/??? 
			// 			used = action.use(null, { _ctx:'[no (matched) views] passed' }, stream.am); 
			// 		}
			// 		console.log('-> [View Change] ini - used: ', used);
			// 		return used;
			// 	}
			// 	else {
			// 		used = action.use(null, { _ctx:'op/selection-faild'}, stream.am); // < t/???
			// 		console.log('-> [View Change] ini - used: ', used);
			// 		return used;
			// 	}
			// })
		/*ok/N*/stream = this.im.action('[View] change/update views') // {action, view, data }
			// < a/[CRUD] create, delete
			.next((a:Signal, p:any) => {
				return p.action != 'create' ? 
					a.use('[Modify View] localy', { action: p.action, viewType: p.view, widget: { targetWStx:'w/PrehledItems', Type: M.WPrehledItems }, modifiedData: p.data }, stream.am) :
					a.use('[Query Init] query', { viewType: p.view, query:{ q:{Type:'Task'} }, widget: { targetWStx:'w/PrehledItems', Type: M.WPrehledItems } }, stream.am)
			})
		/*ok/N*/stream = this.im.action('[Modify View] localy')  // { action, viewType, widget:Widget modifiedData } // /ise-> todo
			.setState((a:Signal, p:any) => {
				let vTasks:any = this.sm.dm.selectOne('v/Tasks').result;
				switch (p.action) {
					case "delete":
						vTasks.items = vTasks.items.filter((dnTask) => {
							return dnTask.id != p.modifiedData.id;
						})
						break;
					
					case "update":
						vTasks.items = vTasks.items.map((dnTask) => {
							if(dnTask.id == p.modifiedData.id) {
								
								let cfg = p.modifiedData;
								Object.keys(cfg).map((cfgKey) => {
									let newValue = cfg[cfgKey];
									Object.defineProperty(dnTask, cfgKey, { value: newValue })
								})
								return dnTask;
							}
							else {
								return dnTask;
							}
						})
						//this.sm.dm.update('v/Tasks', vTasks);
						break;
				}
				return a.addToOutput('[State] changed state', { changedState: vTasks }, stream.am);
			})
			.setState((a:Signal, p:any) => { // set widget
				let view:any  = this.sm.dm.selectOne(p.viewType).result;
				// let view = this.sm.dm.setState('v/Tasks', (state) => {
				// 	state.items = this.convertJSONData(p.res.data, Task);
				// 	return state;
				// });
				let widget:any;

				// select widget for init-veiw
				p.widget.type = p.widget.type == undefined ? 'static' : p.widget.type; // < t/Dcs
				switch (p.widget.type) {
					case "static":
						widget = this.sm.dm.selectOne(p.widget.targetWStx);
						break;
					
					case "generic":
						widget = this.sm.dm.selectByID(p.widget.Type, p.widget.id);
						break;
				}

				// init-view for wiget
				if(p.viewType == 'v/Tasks') {
					let changedState = this.sm.dm.setState('w/PrehledItems', (state) => {
						state.items = view.items.map((dT) => {
							let wT:any = this.sm.dm.createInst(WTask, {
								changedName: '',
								name: dT.name, // <-from/DTask
								id: dT.id,
								odpCas: dT.odpCas,
							}).lastCreated;

							return wT;
						})
						state.connectMany(state.items);
						return state;
					});
					return a.addToOutput('[State] changed state', { changedState: changedState }, stream.am)
				}
				else {
					return a.use(null, { _ctx:'op/no view set'}, stream.am);
				}
				// widget.items = view.items; // < X
			});
		// /Output-> actions
		stream = this.im.action('[Query Init] query') // {  query:Query, viewType:string, widget:Widget } // < t/Server
			// <- a/[View Change] init views / [View] change/update views
			.Xoperation('op/select data for views', (action:Signal) => { //  < t/X
				//return this.am.utils.modifyAction(action, { res: this.serverMock.select(action.payload.query, action.payload.dbg) })
				let dbg = 0;
				return this.im.utils.modifyAction(action, { res: this.serverMock.select(action.payload.query.q, action.payload.dbg_opSelect) });
			})
			.asyncOperation('op/select data for views', (action:Signal) => { // overeni uzivatele na serveru;
				return this.server.select(action.payload.query.q, (res:any) => {
					return this.im.utils.modifyAction(action, { res: res });
				});
			})
			.setState((a:Signal, p:any) => { // set view data
				let view = this.sm.dm.setState('v/Tasks', (state) => {
					state.items = this.convertJSONData(p.res.data, Task);
					state.items = state.items.map((dT:any) => {
						// get local
						let savedOdpCas = window.localStorage.getItem(dT.id);
						dT.odpCas = savedOdpCas ? +savedOdpCas : 0;
						return dT;
					});

					return state;
				});
				return a.addToOutput('[State] changed state', { changedState: view }, stream.am)
			})
			.setState((a:Signal, p:any) => { // set widget
				let view:any  = this.sm.dm.selectOne(p.viewType).result;
				// let view = this.sm.dm.setState('v/Tasks', (state) => {
				// 	state.items = this.convertJSONData(p.res.data, Task);
				// 	return state;
				// });
				let widget:any;

				// select widget for init-veiw
				p.widget.type = p.widget.type == undefined ? 'static' : p.widget.type; // < t/Dcs
				switch (p.widget.type) {
					case "static":
						widget = this.sm.dm.selectOne(p.widget.targetWStx);
						break;
					
					case "generic":
						widget = this.sm.dm.selectByID(p.widget.Type, p.widget.id);
						break;
				}

				// init-view for wiget
				if(p.viewType == 'v/Tasks') {
					let changedState = this.sm.dm.setState('w/PrehledItems', (state) => {
						state.items = view.items.map((dT) => {
							let wT:any = this.sm.dm.createInst(WTask, {
								changedName: '',
								name: dT.name, // <-from/DTask
								id: dT.id,
								odpCas: dT.odpCas,
							}).lastCreated;

							return wT;
						})
						state.connectMany(state.items);
						return state;
					});
					return a.addToOutput('[State] changed state', { changedState: changedState }, stream.am)
				}
				else {
					return a.use(null, { _ctx:'op/no view set'}, stream.am);
				}
				// widget.items = view.items; // < X
			})
			.next('X')
			.se('[Info Change] change ukazatel - pocet tasks');
	}

	interactionV2() {
		// let stream:AXStream;

		// this.al.log('AX3,App,Bo', '', 'Bootstrap - int', [], null);
		
		// // TEST
		// stream = this.im.action('[Test Init] test init', { widget:<any> null })
		// 	.toOutput('[Test Init] test init');
		
		// // CHANGE
		// // --------------------------------------------------------
		// stream = this.im.action('[Change] widgets data', null) // < t/A/[]
		// 	.toOutput('[Change] widgets data');

		// // UI
		// // --------------------------------------------------------
		// stream = this.im.action('[UI Set] set variant', { widget:<any> null, variant:<any> null });
		// stream = this.im.action('[UI Switch] switch w/Loger', null)
		// 	.toOutput('[UI Switch] switch w/Loger')
		// stream = this.im.action('[UI Switch] switch element', { id:<number>undefined, widget:<any>null, element:<any>null })
		// 	.toOutput('[UI Switch] switch element');
		// stream = this.im.action('[UI Show/Hide] show', { widget:<any> null, })
		// 	.toOutput('[UI Show/Hide] show');
		// stream = this.im.action('actionC', null);
		// // NAV
		// // --------------------------------------------------------
		// stream = this.im.action('[Nav] pristup (/)', null)
		// 	.next('[Auth] authentizace');
		// stream = this.im.action('[Nav] presmerovani (app/taskGroups)', { url:'app/task-groups' })	// -> Re/
		// 	.toOutput((sig:Signal, p:any) => {
		// 		return sig.use(sig.type, { url:'app/task-groups' } , stream.am);
		// 	});
		// stream = this.im.action('[Nav] presmerovani (app/tasks)', { url:'app/tasks' })	// -> Re/
		// 	.toOutput((sig:Signal, p:any) => {
		// 		return sig.use(sig.type, { url:'app/tasks' } , stream.am);
		// 	});
		// stream = this.im.action('[Nav] presmerovani (app/auth)', { url:'auth' }) // -> Re/
		// 	.toOutput((sig:Signal, p:any) => {
		// 		return sig.use(sig.type, { url:'auth' } , stream.am);
		// 	});
		
		
		// // AUTH
		// // --------------------------------------------------------
		// stream = this.am.action('X[Auth] logIn') // < P < fa(D2/InUT,OK/In) // << R/2h15m
		// 	.operation((action:Signal, p:any) => {
		// 		let user = action.payload.user;
		// 		return this.am.utils.modifyAction(action, { res: this.serverMock.logIn(user, action.payload.dbg) }) ;
		// 	})
		// 	.next((action) => {
		// 		let res = action.payload.res;
		// 		switch (res.succes) {
		// 			case true:
		// 				this.operations.saveToken(action.payload.res.data);
		// 				return action.use('[Auth] authentizace', {}, stream.am);
		// 			case false:
		// 				return action.use('[UI Info] info - fail', {}, stream.am);
		// 		}
		// 	});
		// stream = this.im.action('[Auth] DEauthentizace', null)
		// 	.operation('op/destroy user token', (action:Signal) => {
		// 		let userSession:any = this.sm.dm.selectOne('o/UserSession').result;
		// 		this.operations.destroyToken({ token: userSession.token });
		// 		return action;
		// 	})
		// 	.next('[Nav] presmerovani (app/auth)')
		// stream = this.im.action('[Auth] authentizace', null)
		// 	.operation('op/get user', (action:Signal) => {
		// 		let userSession:any = this.sm.dm.selectOne('o/UserSession').result;
		// 		return this.im.utils.modifyAction(action, { res: this.serverMock.getUser(userSession.token, action.payload.dbg_getUser) });
		// 	})
		// 	.next((action:Signal, p:any, ) => { // < var/1
		// 		let res = action.payload.res;
		// 		switch (res.succes) {
		// 			case true:
		// 				if(action.payload.dbg) {
		// 					switch (action.payload.dbg.url) {
		// 						case "app/task-groups":
		// 							return action.use('[Nav] presmerovani (app/taskGroups)', { _ctx:'user-succes' }, stream.am);
								
		// 						case "app/tasks":
		// 							return action.use('[Nav] presmerovani (app/tasks)', { _ctx:'user-succes' }, stream.am);
		// 					}
		// 				}
		// 				else {
		// 					return action.use('[Nav] presmerovani (app/taskGroups)', { _ctx:'user-succes' }, stream.am);
		// 				}
		// 			case false:
		// 				return action.use('[Auth] DEauthentizace', { _ctx:'user-fail' }, stream.am);
		// 		}
		// 	})
		// 	//.condition((a,p) => { return p.res == true; }).next(); // < var/2
		// 	//.condition((a,p) => { return p.res == false; }).next();

		// // K/VIEW, COMPONENT, CHANGE 
		// // --------------------------------------------------------
		// stream = this.im.action('[View Component] init, reload data', { fromCtx:'', widget:<any> null, variant:<string> '', id:<number> 0, view:<string> '' })
		// 	.toOutput('[View Component] init, reload data')
		// 	.toOutput((action:Signal, p:any) => {
		// 		let dbg = 0;
		// 		return action.payload.variant
		// 			? action.use('[UI Set] set variant', { widget: p.widget, variant: p.variant }, stream.am)
		// 			: action.use(action.type, action.payload, stream.am);
		// 	})
		// 	.next('[View Change] init views');
		// stream = this.im.action('[View Change] init views', { widget:<any> null, variant:<string> '', query:<any> null, views:<string[]> [] })
		// 	.operation('op/select data for views', (action:Signal) => { //  < t/X
		// 		//return this.am.utils.modifyAction(action, { res: this.serverMock.select(action.payload.query, action.payload.dbg) })
		// 		let dbg = 0;
		// 		return this.im.utils.modifyAction(action, { res: this.serverMock.select(action.payload.query.q, action.payload.dbg_opSelect) });
		// 	})
		// 	.toOutput((action:Signal, p:any) => {
				
		// 		let used;
		// 		let res = action.payload.res;
				
		// 		if(action.payload.res && action.payload.views && action.payload.views.length > 0) {
		// 			let views = action.payload.views; // < t/???
		// 			let switchedActions = views.map((view) => {
		// 				switch (view) {
		// 					case "v/TaskGroups":
		// 						//var items = this.operations.convertJSONData(res.data, TaskGroup);
		// 						used = action.use('[Query Filter] filter by /user', { items: res.data }, stream.am) // -> to DM
		// 						break;
		// 					case "v/Tasks":
		// 						//var items = this.operations.convertJSONData(res.data, Task);
		// 						used = action.use('[Query Filter] filter by /parent', { items: res.data }, stream.am) // -> to DM
		// 						break;
		// 				}
		// 			})
		// 			if(!switchedActions[0]) {  // switchedActions[0]; // < t/??? 
		// 				used = action.use(null, { _ctx:'[no (matched) views] passed' }, stream.am); 
		// 			}
		// 			console.log('-> [View Change] ini - used: ', used);
		// 			return used;
		// 		}
		// 		else {
		// 			used = action.use(null, { _ctx:'op/selection-faild'}, stream.am); // < t/???
		// 			console.log('-> [View Change] ini - used: ', used);
		// 			return used;
		// 		}
		// 	})
		// // /Output-> actions
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
						//open: data.open,
						//timeCounter: data.timeCounter,
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