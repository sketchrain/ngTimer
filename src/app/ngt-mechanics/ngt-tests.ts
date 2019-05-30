// angular
import { Injectable } from '@angular/core';
// flow
import { Managers, Category } from '../../flow/core/fl-core';
// app
import { Mock } from './ngt-mocks';
//import { WApp, WLoger, WSignIn, WLogIn, WPrehledItems, WPrehledItemsHeader, VTasks, VTaskGroups } from './ax3-states';
import { Task } from './ngt-states';



// @Injectable()
// export class VisualCFG {
	
// 	visual:{
// 		oUserSession:string,
// 		wLoger:string,
// 		wTaskGroups:string,
// 		wTasks:string,
// 		wPrehledItems:string,
// 	};

// 	constructor() {
// 		this.setVisual(1);
// 	}
	
// 	setVisual(visID:number) {
// 		switch (visID) {
// 			case 0:
// 				this.visual = {
// 					oUserSession: 'logOut',
// 					wLoger: 'logIn',
// 					wTasks: ,
// 				};
// 				break;
// 			case 1:
// 				this.visual = 'logOut';
// 				break;
// 		}
// 	}
// }

@Injectable()
export class AppTests extends Category {

	constructor(m:Managers, private mock:Mock) {
		super(m);
		this.al.log('AX3,App,Bo', '', 'Bootstrap - app tests', [], null);
		// Tests
		//this.unitTests()
		//this.testAppInputsInit();
		//this.testAppInputsActions();
	}

	// APP TESTS - APP INPUTS
	// //////////////////////////////////////////////////////////////////////////////////////////////
	testAppInputsInit() { // // < t/Deactive 
		this.al.log('AX,Te,Info', undefined, '-> I-T/appInputsInit > X', [], null);
		
		// V1.0
		/////////////////////////////////////////////////////////////////////////////////////
			this.im.dispatch('[Nav] pristup (/)', { dbg_getUser: { succes: false }, dbg: { url:'app/tasks' } }); // < ctx/user 
			//this.im.dispatch('[Nav] pristup (/)', { dbg_getUser: { succes: true }, dbg: { url:'app/tasks' } });
		// V2.0
		/////////////////////////////////////////////////////////////////////////////////////
			// URL-PRISTUPY
			//this.im.dispatch('[Nav] pristup (/)', { dbg_getUser: { succes: true } }); // < vcx/user
			//this.im.dispatch('[Nav] pristup (/)', { dbg_getUser: { succes: true }, dbg: { url:'app/tasks' } }); // < vcx/user
			//this.im.dispatch('[Nav] pristup (/)', { dbg_getUser: { succes: false } }); // < vcx/noUser // <<
			
			// UI - AUTH
			// - w/loger
			// this.uim.dispatch('[UI Event] click', { widget: 'loger', element:'b/switchAction', evType:'click' });
			// this.uim.dispatch('[UI Event] click', { widget: 'loger', element:'b/vstup', evType:'click' });
			
			// UI - APP
			// - w/

			// STARE
			//this.uim.dispatch('[UI Event] click', { widget: 'widgetB', element:'b/buttonB', evType:'click' });

			// a/switch loger -> w/loger
			// this.uim.dispatch('[UI Event] click', { widget: 'loger', element:'b/switchAction', evType:'click' });
			
			// ...
			//this.uim.dispatch('[UI Event] click', { widget: 'loger', element:'b/vstup', evType:'click' });
	}

	testAppInputsActions() { // // < t/Deactive
		this.al.log('AX,Te,Info', undefined, '-> I-T/appInputsActions >', [], null);
		
		this.testIA_UIAkceV1();
		this.testIA_UIAkceV2();
		this.testAkceChanges();
		this.testAuth();
		this.testNavigace();
		this.testAkaceCRUD();
		this.testAkacePA_CRUD();
	}

	testIA_UIAkceV1() {

		// V1.0
		/////////////////////////////////////////////////////////////////////////////////////
		// w/Loger
		// ---------------------------------------------------------------------------------
			//this.ui.dispatch('[UI Event] click', { w:'w/Loger', ui:'b-switchAction' }); // < Z
		// w/logIn
		// ---------------------------------------------------------------------------------
			// this.ui.dispatch('[UI Event] form input', { w:'w/LogIn', ui:'fo-user',  // < Z
			// 	user: {
			// 		name: 'user1',
			// 		email: undefined,
			// 		password: 'user1-1234',
			// 		checkPassword: undefined,
			// 	}
			// });
			//this.ui.dispatch('[UI Event] click', { w:'w/LogIn', ui:'b-register' }); // < Z

		// w/itemEditor
		// ---------------------------------------------------------------------------------
			//this.ui.dispatch('[UI Event] click', { w:'w/PrehledItemsHeader', ui:'b-create', showTarget:'w/ItemEditor' });

		// w/signIn
		// ---------------------------------------------------------------------------------
			// this.ui.dispatch('[UI Event] form input', { w:'w/SignIn', ui:'fo-user', 
			// 	user: {
			// 		name: 'user1',
			// 		email: 'user1@emial.com',
			// 		password: 'user1-1234',
			// 		checkPassword: 'user1-1234',
			// 	}
			// });
			//this.ui.dispatch('[UI Event] click', { w:'w/SignIn', ui:'b-logIn' }); // < Z
			

		// w/taskItem
		// ---------------------------------------------------------------------------------
			//this.ui.dispatch('[UI Event] click', { w:'w/taskItem', ui:'b-edit', showTarget:'w/ItemEditor' });

		//this.testIA_logIn(); // < w/LogIn
		//this.testIA_register(); // < w/SignIn
		//this.testIA_logOut(); // < w/MainPrehled
		//this.testIA_changeItemName('taskA'); // < w/ItemEditor
		//this.testIA_Create('task');
		//this.testIA_Delete('task');
		//this.testIA_Update('task');
		//this.testIA_ShowHide('w/ItemEditor'); // < w/ItemEditorm ui/b-close

		//this.testIA_St_SetOdpCas('start', { type: Task, id:0, });  // < w/taskItem, ui/b-(s,p,r)
		//this.testIA_St_SetOdpCas('start', { type: Task, id:1, });  // < w/taskItem, ui/b-(s,p,r)
	}

	private testIA_logIn() {
		console.log('-> test IA/LogIn')
		// < set state
		console.log('-> test IA/LogIn - set state');
		this.ui.dispatch('[UI Event] form input', { w:'w/LogIn', ui:'fo-user',  // < Z
			user: {
				name: 'user1',
				email: undefined,
				password: 'user1-1234',
				checkPassword: undefined,
			}
		});
		// < emit action
		console.log('-> test IA/LogIn - emit');
		//this.ui.dispatch('[UI Event] click', { w:'w/LogIn', ui:'b-logIn', dbg: { succes: true } }); // < ctx/user
		this.ui.dispatch('[UI Event] click', { w:'w/LogIn', ui:'b-logIn', dbg: { succes: false } }); // < ctx/noUser
	}

	private testIA_register() {
		console.log('-> test IA/register')
		// < set state
		console.log('-> test IA/register - set state');
		this.ui.dispatch('[UI Event] form input', { w:'w/SignIn', ui:'fo-user',  // < Z
			user: {
				
				name: 'user1',
			 	email: 'user1@emial.com',
			 	password: 'user1-1234',
			 	checkPassword: 'user1-1234',
			}
		});
		// < emit action
		console.log('-> test IA/register - emit');
		this.ui.dispatch('[UI Event] click', { w:'w/SignIn', ui:'b-register', dbg: { succes: true, url:'app/tasks' } }); // < ctx/user
		//this.ui.dispatch('[UI Event] click', { w:'w/SignIn', ui:'b-register', dbg: { succes: false } }); // < ctx/noUser
	}

	private testIA_logOut() {
		console.log('-> test IA/logOut')
		// < set state - vcx/user:tasks
		// < emit action
		console.log('-> test IA/logOut - emit');
		this.ui.dispatch('[UI Event] click', { w:'w/MainPrehled', ui:'b-logOut' }); // < ctx/user
		//this.ui.dispatch('[UI Event] click', { w:'w/SignIn', ui:'b-register', dbg: { succes: false } }); // < ctx/noUser
	}

	private testIA_changeItemName(name:string) {

		console.log('-> test IA/change item name');
		// < set state - vcx/user:tasks:create
		// < emit action
		console.log('-> test IA/change item name - emit');
		this.ui.dispatch('[UI Event] text field input', { w:'w/ItemEditor', ui:'ti-itemName', itemName: name }); // < ctx/user
		//this.ui.dispatch('[UI Event] click', { w:'w/SignIn', ui:'b-register', dbg: { succes: false } }); // < 
	}

	// UI
	private testIA_ShowHide(target:string) {
		switch (target) {
			case "w/ItemEditor":
				console.log('-> test IA/show/hide target/%s', target)
				// < set state - vcx/user:tasks:create
				//this.testIA_changeItemName('newTaskA');
				// < emit action
				console.log('-> test IA/show/hide - emit target/%s', target)
				this.ui.dispatch('[UI Event] click', { w:'w/ItemEditor', ui:'b-close', showTarget:'w/ItemEditor' }); // < ctx/user
				break;
			default:
				// code...
				break;
		}
	}

	// RUZNE
	private testIA_St_SetOdpCas(aSetState:string, target:{ type:any,  id:number}) {
		console.log('-> test IA/set odp. cas')
		// < set state - vcx/user:tasks
		// < emit action
		console.log('-> test IA/set odp. cas - emit - st/%s', aSetState)
		switch (aSetState) {
			case "start": case "pause": case "resume":
				this.ui.dispatch('[UI Event] click', { w:'w/taskItem', ui:'b-start-pause-resume', action: { DNode:target.type, id:target.id }, 
					dbg: { succes: true }
				}); // < ctx/user
				break;
			case "reset":
				this.ui.dispatch('[UI Event] click', { w:'w/taskItem', ui:'b-reset', action: { DNode:target.type, id:target.id }, 
					dbg: { succes: true }
				}); // < ctx/user
				break;
			default:
				// code...
				break;
		}
	}

	// CRUD
	private testIA_Create(dNode:string) {
		switch (dNode) {
			case "task":
				console.log('-> test IA/create dNode/%s', dNode)
				// < set state - vcx/user:tasks:create
				this.testIA_changeItemName('newTaskA');
				// < emit action
				console.log('-> test IA/create - emit dNode/%s', dNode)
				this.ui.dispatch('[UI Event] click', { w:'w/ItemEditor', ui:'b-save', create: { DNode: Task } }); // < ctx/user
				break;
			default:
				// code...
				break;
		}
	}

	private testIA_Delete(dNode:string) {
		switch (dNode) {
			case "task":
				console.log('-> test IA/delete dNode/%s', dNode)
				// < set state - vcx/user:tasks
				// < emit action
				console.log('-> test IA/delete - emit dNode/%s', dNode)
				this.ui.dispatch('[UI Event] click', { w:'w/taskItem', ui:'b-delete', delete: { DNode: Task, id:0 } }); // < ctx/user
				break;
			default:
				// code...
				break;
		}
	}

	private testIA_Update(dNode:string) {
		switch (dNode) {
			case "task":
				console.log('-> test IA/update dNode/%s', dNode)
				// < set state - vcx/user:tasks:create
				this.testIA_changeItemName('newTaskA');
				// < emit action
				console.log('-> test IA/update - emit dNode/%s', dNode)
				this.ui.dispatch('[UI Event] click', { w:'w/ItemEditor', ui:'b-save', useCtx:'rename', update: { DNode: Task, id:0 } }); // < ctx/user
				break;
			default:
				// code...
				break;
		}
	}

	testIA_UIAkceV2() {
		// V2.0
		/////////////////////////////////////////////////////////////////////////////////////
			// ia/1
			// ---------------------------------------------------------------------------
				//this.ui.dispatch('[UI Event] click', { w:'w/Loger', el:'el/b-switchAction' });
				// a/
				//this.im.dispatch('[UI Switch] switch w/Loger', { widget:'w/Loger' });
			// ia/2
			// ---------------------------------------------------------------------------
				//this.ui.dispatch('[UI Event] click', { w:'w/PrehledItemsHeader', el:'el/b-create' });
				// - a/
				//this.im.dispatch('[UI Show/Hide] show', { widget:'w/ItemEditor', });
			// ia/3
			// ---------------------------------------------------------------------------
				//this.im.dispatch('[UI Show/Hide] show', { widget:'w/ItemEditor', }); /* -> set UI*/
				//this.ui.dispatch('[UI Event] click', { w:'w/ItemEditor', el:'ui/b-close' }); /* -> emit ia/input action*/
			// ia/4
			// ---------------------------------------------------------------------------
				//this.im.dispatch('[UI Show/Hide] show', { widget:'w/ItemEditor', }); /* -> set UI*/
				//this.ui.dispatch('[UI Event] click', { w:'w/ItemEditor', el:'ui/b-save' }); /* -> emit ia/input action*/
			// ia/5
			// ---------------------------------------------------------------------------
				//this.im.dispatch('[UI Show/Hide] show', { widget:'w/ItemEditor', }); /* -> set UI*/
				//this.ui.dispatch('[UI Event] click', { w:'w/ItemEditor', el:'ui/b-cancle' }); /* -> emit ia/input action*/
			
			// ia/6 < st/user:taskGroups
			// ---------------------------------------------------------------------------
				//this.ui.dispatch('[UI Event] click', { w:'w-tg/any', id:0, el:'ui/t-name', elToSwitch:'ui_etName' });

			// ia/7 < st/user:tasks
			// ---------------------------------------------------------------------------
				//this.ui.dispatch('[UI Event] click', { w:'w-t/any', id:0, el:'ui/t-name', elToSwitch:'ui_etName' });
	}

	testAkceChanges() {
		// ia/e/[UI Event] input - (w/logIn, form/User)
		// ---------------------------------------------------------------------------
			// this.ui.dispatch('[UI Event] form input', { w:'w/LogIn', el:'ui/fo-user' 
			// 	data: { name:'user1', email:'user1@email.com', password:'user1_1234' }
			// });

		// ia/e/[UI Event] input - (w/signIn, form/User)
		// ---------------------------------------------------------------------------
			// this.ui.dispatch('[UI Event] form input', { w:'w/SignIn', el:'ui/fo-user' 
			// 	data: { name:'user1', email:'user1@email.com', password:'user1_1234', checkPassword:'user1_1234' }
			// });
	}

	testAuth() {
	}

	testNavigace() {
	}

	testAkaceCRUD() {
	}

	testAkacePA_CRUD() {
	}

	// APP UNIT TEST
	// //////////////////////////////////////////////////////////////////////////////////////////////
	unitTests() { // < t/Deactive
		this.al.log('AX,Te,Info', undefined, '-> I-T/unitTests > X', [], null);
		this.unitTestReducers();
		//this.unitTestSelectors();
		// this.unitTestVisual();
		// this.testAppInputs();
	}

	// - Actions
	unitTestActions2() {
		//this.testsEventsUI();
		//this.eventsUI();
		// ---
		//this.testUIEvents();
		//this.testActions();
		
		// ACTIONS - TESTS (/1)

		// - NAV
		// -------------------------------------------------------------------------------------
			///*P*/this.am.dispatch('[Nav] pristup (/)'); // <<
			//this.am.dispatch('[Nav] navigate to (/app/task-groups)');
			//this.am.dispatch('[Nav] navigate to (/app/tasks)');
			//this.am.dispatch('[Nav] presmerovani (/auth)');
			//this.am.dispatch('[Nav] presmerovani (/app/taskGroups)', { url: 'app/task-groups' }); // < 
			//this.am.dispatch('[Nav] presmerovani (/app/tasks)', { url:'app/tasks', taskGroupID:1 });
		// - AUTH 
		// -------------------------------------------------------------------------------------
			// < L4
			// a/[Auth] logIn // 
			// this.am.dispatch('[Auth] logIn', { user: { // < ctx/succes
			// 		email:<string> 'user1@email.com',
			// 		password:<string> '1234',		
			// 	}
			// });
			// this.am.dispatch('[Auth] logIn', { user: { // < ctx/failure
			// 		email:<string> 'user1@email.com',
			// 		password:<string> '1234',		
			// 	},
			// 	dbg: { succes: false }
			// });

			// a/[Auth] register //
			// this.am.dispatch('[Auth] register', { user:  // < ctx/succes 
			// 	{
			// 		name:<string> 'user1',
			// 		email:<string> 'user1@email.com',
			// 		password:<string> '1234',		
			// 	}
			// });
			// < ctx/failure // < t/Todo:
			// ---
			// this.am.dispatch('[Auth] DEauthentizace');
			// ---
			// a/[Auth] authentizace
			//this.am.dispatch('[Auth] authentizace');  // < ctx/succes
			// < ctx/failure  // < t/Todo:
			//this.am.dispatch('[Auth] logOut');
			
			// a/[View Component] init, reload data
			// let widgetA = this.sm.createInst(Widget, { name: 'widgetA' }).getLastCreated();
			// this.am.dispatch('[View Component] init, reload data', {from:'ctx/A' , widget: widgetA, variant:'varA', id:1}) // 

			// a/[View Change] init/reload views
			// < ctx/from component-single-view-tasks
			// let widgetA = this.sm.createInst(Widget, { name: 'widgetA' }).getLastCreated();
			// this.am.xdispatch('[View Change] init views', { widget:widgetA, variant:'varA',  
			// 	query: null, 
			// 	views: ['v/tasks'],
			// 	dbg: { dataType: 'taskGroups', succes: true }
			// }) 
			// < ctx/from component-single-view-tasksGroups
			// < ctx/from component- ...
			// < ctx/fromW router-outlet

			// a/[View Change] update view
			// this.am.xdispatch('[View Change] update view', { type:'localy', action:'update', // < ctx/localy(update) // type(localy(delete,upate),reloade)
			// 	views: ['v/tasks'],
			// 	updateData: [
			// 		// < task
			// 		{ name:'task1-change', odpCas: 0 }, 
			// 		{ name:'task2-change', odpCas: 0 },
			// 		{ name:'task3-change', odpCas: 0 },
			// 	]
			// });
			// < ctx/localy(delete)
			// < ctx/reloade
			
			// a/[View Change] modify view
			// this.am.xdispatch('[View Change] modify view', { type:'reload', action:'update', // < ctx/localy(update) 
			// 	views: ['v/tasks'],
			// 	data: [
			// 		{ name:'task1-change', odpCas: 0 }, 
			// 		{ name:'task2-change', odpCas: 0 },
			// 		{ name:'task3-change', odpCas: 0 },
			// 	]
			// });
			// < ctx/localy(delete)
			// < ctx/reloade 
			// a/
			// this.am.xdispatch('[Change] item name');
			// a/
			// this.am.xdispatch('[Change] new item name');
			// a/
			// this.am.xdispatch('[Change Save/Cancle] new item name', { widget:'widgetA', variant:'task', newItemName: 'newItemName'}); // < ctx/crea-Task
			// < ctx/crea-TaskGroup
			// a/
			// this.am.xdispatch('[Akce CRUD] create', { DNode:TaskGroup, cfg: { name: 'new taskGroup1' }, // < ctx/crea-TaskGroup 
			// 	dbg: {dataType:'taskGroups', succes: true}
			// });
			// < ctx/crea-Task
			// a/
			// this.am.xdispatch('[Akce CRUD] delete', { DNode:TaskGroup, id:1, // < ctx/crea-TaskGroup 
			// 	dbg: {dataType:'taskGroups', succes: true}
			// });
			// < ctx/crea-Task 
			// a/
			// this.am.xdispatch('[Akce CRUD Update] rename', { DNode:TaskGroup, cfg: { name: 'taskGroup1-updated' }, // < ctx/crea-TaskGroup 
			// 	dbg: {dataType:'taskGroups', succes: true}
			// });
			// a/
			// this.am.xdispatch('X');
			// a/
			// this.am.xdispatch('[Akce CRUD Update] rename', { DNode:TaskGroup, cfg: { name: 'taskGroup1-updated' }, // < ctx/crea-TaskGroup 
			// 	dbg: {dataType:'taskGroups', succes: true}
			// });
			// PRUBEHOVE
			// a/
			// < test1/1 akce
			// let actionA = this.am.xdispatch('[PA CRUD Update] set /odpCas',  {
			// 	dbg: {dataType:'tasks', succes: true}
			// }, ':start'); // < ctx/start
			// let stopTimer = new BTimer('stopTimer'); // < ctx/stop
			// stopTimer.start(1000);
			// stopTimer.setUpdate(() => {
			// 	this.am.xdispatch('[PA CRUD Update] set /odpCas',  actionA.payload, ':stop', actionA.id);
			// 	stopTimer.delete();
			// });
			// < ctx/pause
			// let pauseTimer = new BTimer('pauseTimer');
			// pauseTimer.start(3000);
			// pauseTimer.setUpdate(() => {
			// 	this.am.dispatch('[PA CRUD Update] set /odpCas]',  {}, ':pause', actionA.id);
			// 	pauseTimer.delete();
				
			// 	// < ctx/resume
			// 	let resumeTimer = new BTimer('resumeTimer');
			// 	resumeTimer.start(4000);
			// 	resumeTimer.setUpdate(() => {
			// 		this.am.dispatch('[PA CRUD Update] set /odpCas]',  {}, ':start', actionA.id);
			// 		resumeTimer.delete();
			// 	})
			// });

			// < test2/vice akci
			// this.am.dispatch('[PA CRUD Update] set /odpCas]',  {}, ':start');
			// this.am.dispatch('[PA CRUD Update] set /odpCas]',  {}, ':start');

			// a/
			// this.am.xdispatch('[PA CRUD Update] set /odpCas - start', { widget:'elementA', element:'elementA' }); // < ctx/...
			// a/
			// this.am.xdispatch('[PA CRUD Update] set /odpCas - stop', { widget:'elementA', element:'elementA' }); // < ctx/...
			// a/
			// this.am.dispatch('[PA CRUD Update] set /odpCas - reset'); // < ctx/...
	}

	unitTestActions() {

		//this.am.dispatch('[Action A] action A', { interaction:<string> ''});
		//this.am.dispatch('[Action A] action C', {});
		//this.tests.dispatchEv('w/loger', 'b/switchAction', 'ev/click'); // < X
		//this.tests.dispatchEv('w/loger', 'b/switchAction', 'ev/click') // < Docas
		//.wait()
		//.disptachEv()

		//this.am.dispatch('[UI Switch] switch element', { parent: , elName:, elID:'' })
	}

	// - Reducers
	unitTestReducers() {

		// AX3 - APP
		// ------------------------------------------------------------

		// 1
		// this.se.listenToSel('w/App-outletTarget', (selection) => { //
		// 	console.log('-> select - w/App-outletTarget: ', selection);
		// });
		//this.sm.dispatch('[Nav] presmerovani (app/auth)', { url: 'app/auth' });
		//this.sm.dispatch('[Nav] presmerovani (app/taskGroups)', { url: 'app/task-groups'});

		// 2
		// this.sm.dispatchMany([
		// 	{ type:'[Nav] presmerovani (app/auth)',  payload: { url: 'app/auth' }  },
		// 	{ type:'[Nav] presmerovani (app/taskGroups)', payload: { url: 'app/task-groups' } }
		// ]);

		// AX - APP
		// ------------------------------------------------------------
		
		// a/A
		// -> ctx/
		// this.am.actions.stream.next(new Action({ type:'[Nav] presmerovani (app/taskGroups)', payload: { url: 'app/task-groups' } }));
		// -> ctx/
		// this.am.actions.stream.next(new Action({ type:'[Nav] presmerovani (app/tasks)', payload: { url: 'app/tasks' } }));
		// ---
		
		// a/B
		// -> ctx/a/[View Change] init views 
		// this.am.actions.stream.next(new Action({ type:'[UI Set] set variant', payload: { target:'w/PrehledItems', variant: 'task' } }));
		
		// a/C
		// this.am.actions.stream.next(new Action({ type:'[Query Filter] filter by /user', payload: { target:'v/TaskGroups', 
		//	items: [
		// 		{ name: 'tg1', odpCas: 10 },
		// 		{ name: 'tg2', odpCas: 20 },
		// 		{ name: 'tg3', odpCas: 30 },
		// 	] } 
		// })); // <- ctx/1
		// this.am.actions.stream.next(new Action({ type:'[Query Filter] filter by /parent', payload: { target:'v/Tasks', 
		// 	items: [
		// 		{ name: 't1', odpCas: 10 },
		// 		{ name: 't2', odpCas: 20 },
		// 		{ name: 't3', odpCas: 30 },
		// 	] } 
		// })); // <- ctx/2
	}

	// Selectors
	unitTestSelectors() { // < t/Deactive
		
		// this.al.log('AX,Te,Info', undefined, '-> I-TU/selectors > X', [], null);
		// se/1
		// this.sm.states.stream.next(new WApp({ data: { outletTarget: 'app/task-groups' }  })); // < ctx/1
		// this.sm.states.stream.next(new WApp({ outletTarget: 'app/tasks' })); // < ctx/2
		// this.sm.states.stream.next(new WApp({ data: { outletTarget: 'auth' }  })); // < ctx/2
		// se/2
		// this.sm.states.stream.next(new WPrehledItems({ data: { variant: 'taskGroups'} })); // < ctx/1
		//this.sm.states.stream.next(new WPrehledItems({ variant: 'tasks' })); // < ctx/2
		// se/3
		// this.sm.states.stream.next(new WPrehledItemsHeader({ data: {variant: 'taskGroups'} })); // < ctx/1
		// this.sm.states.stream.next(new WPrehledItemsHeader({ variant: 'tasks' })); // < ctx/2
		// se/4
		// this.sm.states.stream.next(new VTaskGroups({ 
		// 	data: { items: [
		// 		{ name: 'tg1', odpCas: 10 },
		// 		{ name: 'tg2', odpCas: 20 },
		// 		{ name: 'tg3', odpCas: 30 },
		// 	]} 
		// }));  // < ctx/1
		// this.sm.states.stream.next(new VTasks({ // < ctx/2 
		// 	data: { items: [
		// 		{ name: 'tg1', odpCas: 10 },
		// 		{ name: 'tg2', odpCas: 20 },
		// 		{ name: 'tg3', odpCas: 30 },
		// 	]}
		// }));
	}

	// Selectors
	unitTestVisual() { // < t/Deactive
		// this.al.log('AX,Te,Info', undefined, '-> I-TU/visual > X', [], null);
		// this.initVisualState1();
		// this.initVisualState2();
		// this.initVisualState3();
		// this.initVisualState4();  // <<
	}

	private initVisualStateSchema() {
		// Visual state/1
		// this.sm.states.stream.next(new WApp({ data: { outletTarget: 'auth' }  })); // < vs/1
		// 	this.sm.states.stream.next(new WLoger({ data: { action: 'logIn' }  })); // < vs/1.1
		// 	this.sm.states.stream.next(new WLoger({ data: { action: 'signIn' }  })); // < vs/1.1
		
		// this.sm.states.stream.next(new WApp({ data: { outletTarget: 'app/task-groups' }  })); // < vs/2
		// 	this.sm.states.stream.next(new WPrehledItemsHeader({ data: { variant: 'taskGroups' }  })); // < vs/1.1
		// 	this.sm.states.stream.next(new WPrehledItems({ data: { variant: 'taskGroups' }  })); // < vs/1.1
		// 	this.sm.states.stream.next(new VTaskGroups({ data: { items: this.mock.taskGroups('many', 2) }  })); // < vs/1.1
		
		// this.sm.states.stream.next(new WApp({ data: { outletTarget: 'app/tasks' }  })); // < vs/2
		// 	this.sm.states.stream.next(new WPrehledItemsHeader({ data: { variant: 'tasks' }  })); // < vs/1.1
		// 	this.sm.states.stream.next(new WPrehledItems({ data: { variant: 'tasks' }  })); // < vs/1.1
		// 	this.sm.states.stream.next(new VTasks({ data: { items: this.mock.tasks('many', 3) }  })); // < vs/1.1
	}

	private initVisualState1() { // auth,logIn
		// this.sm.states.stream.next(new WApp({ data: { outletTarget: 'auth' }  })); // < vs/1
		// 	this.sm.states.stream.next(new WLoger({ data: { action: 'logIn' }  })); // < vs/1.1
	}

	private initVisualState2() { 
		// this.sm.states.stream.next(new WApp({ data: { outletTarget: 'auth' }  })); // < vs/1
		// 	this.sm.states.stream.next(new WLoger({ data: { action: 'signIn' }  })); // < vs/1.1
	}

	private initVisualState3() { 
		// this.sm.states.stream.next(new WApp({ data: { outletTarget: 'app/task-groups' }  })); // < vs/2
		// 	this.sm.states.stream.next(new WPrehledItemsHeader({ data: { variant: 'taskGroups' }  })); // < vs/1.1
		// 	this.sm.states.stream.next(new WPrehledItems({ data: { variant: 'taskGroups' }  })); // < vs/1.1
		// 	this.sm.states.stream.next(new VTaskGroups({ data: { items: this.mock.taskGroups('many', 2) }  })); // < vs/1.1
	}

	private initVisualState4() {
		// this.sm.states.stream.next(new WApp({ data: { outletTarget: 'app/tasks' }  })); // < vs/2
		// 	this.sm.states.stream.next(new WPrehledItemsHeader({ data: { variant: 'tasks' }  })); // < vs/1.1
		// 	this.sm.states.stream.next(new WPrehledItems({ data: { variant: 'tasks' }  })); // < vs/1.1
		// 	this.sm.states.stream.next(new VTasks({ data: { items: this.mock.tasks('many', 3) }  })); // < vs/1.1
	}
}