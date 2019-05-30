// angular
import { Injectable } from '@angular/core';
// flow
import { Category, Managers, DataModel2 } from '../../flow/core/fl-core';
import { Utils } from '../../flow/core/fl-core-utils';
import { StateManager, DNode } from '../../flow/model-manager/fl-model';
// app
import { IUser, IUIFUser } from './ngt-in';
import * as M from './ngt-model';
import { Mock } from './ngt-mocks';

/* Struktura:
	- data types - model
	- states
*/

const utils = new Utils();

// DATA TAYPES - MODEL
// - WIDGETS, ELEMENTS
export class Widget extends DNode {
	
	name:string;

	constructor(cfg:any) {
		super(cfg);
	}
}

export class WidgetA extends Widget {
	
	constructor(cfg:any) {
		super(cfg);
	}
}

export class WidgetB extends Widget {
	
	constructor(cfg:any) {
		super(cfg);
	}
}

export class AXElement extends DNode {
	
	name:string;

	constructor(cfg:any) {
		super(cfg);
	}
}

export class ElementA extends AXElement {
	
	constructor(cfg:any) {
		super(cfg);
	}
}

export class ElementB extends AXElement {
	
	constructor(cfg:any) {
		super(cfg);
	}
}

export class ElementC extends AXElement {
	
	constructor(cfg:any) {
		super(cfg);
	}
}

export class ElementD extends AXElement {
	
	constructor(cfg:any) {
		super(cfg);
	}
}

export class WApp extends Widget {
	
	targetOutlet:string;

	constructor(cfg:any) {
		super(cfg);
	}
}

export class WLoger extends Widget {
	
	constructor(cfg:any) {
		super(cfg);
	}
}

export class WLogIn extends Widget {
	
	constructor(cfg:any) {
		super(cfg);
	}
}

export class WSignIn extends Widget {
	
	constructor(cfg:any) {
		super(cfg);
	}
}

export class WMainPrehled extends Widget {
	
	constructor(cfg:any) {
		super(cfg);
	}
}

export class WItemEditor extends Widget {
	
	constructor(cfg:any) {
		super(cfg);
	}
}

export class WPrehledItems extends Widget {
	
	constructor(cfg:any) {
		super(cfg);
	}
}

export class WPrehledItemsHeader extends Widget {
	
	constructor(cfg:any) {
		super(cfg);
	}
}

export class WTaskGroup extends Widget {
	
	constructor(cfg:any) {
		super(cfg);
	}
}

export class WTask extends Widget {
	
	constructor(cfg:any) {
		super(cfg);
	}
}

export class WTimeCounter extends Widget {
	
	constructor(cfg:any) {
		super(cfg);
	}
}

// - DATA
export class Data extends DNode {
	
	constructor(cfg:any) {
		super(cfg)
	}
}

export class User extends Data {
	
	name:string;
	email:string;
	password:string;
	checkPassword:string;
	token:string;

	constructor(cfg:any) {
		super(cfg)
	}
}

export class Task extends Data {
	
	name:string;
	odpCas:number = 0;

	constructor(cfg:any) {
		super(cfg)
	}
}

// - VIEWS
export class TaskGroup extends Data {
	
	constructor(cfg:any) {
		super(cfg)
	}
}

export class View extends DNode {
	
	constructor(cfg:any) {
		super(cfg)
	}
}

export class VTaskGroups extends View {

	constructor(cfg:any) {
		super(cfg)
	}
}

export class VTasks extends View {
	
	constructor(cfg:any) {
		super(cfg)
	}
}

export class AXObject extends DNode {
	
	constructor(cfg:any) {
		super(cfg)
	}
}

// OBJECTS
export class AXNavigator extends AXObject {
	
	url:string;

	constructor(cfg:any) {
		super(cfg)
	}
}

export class OUserSession extends AXObject {
	
	user:User;
	token:string;

	constructor(cfg:any) {
		super(cfg)
	}
}

// - WIDGETS
// STATES - CONSTRUCTIONS, TESTS
@Injectable()
export class States extends Category {
	
	//sm:StateManager;
	dm:StateManager;

	constructor(m:Managers, private mock:Mock) {
		super(m);
		this.dm = this.sm.dm;
		this.al.log('AX,Bo', undefined, '[Bootstrap Init] init /states', [], null);
		//this.states()
		//this.sm = new StateManager();
		//this.testsDMConnect();
		this.dm.defineConstructors([
			// < static
			{al:'v', name:'View', Type: View},
			{al:'vtg', name:'TaskGroups', Type: VTaskGroups},
			{al:'vta', name:'Tasks', Type: VTasks},

			{al:'o', name:'Object', Type: AXObject},
			{al:'n', name:'Navigator', Type: AXNavigator},
			{al:'us', name:'UserSession', Type: OUserSession},

			{al:'tg', name:'TaskGroup', Type: TaskGroup},
			{al:'ta', name:'Task', Type: Task},

			{al:'a', name:'App', Type: WApp},
			{al:'lo', name:'Loger', Type: WLoger},
			{al:'si', name:'SignIn', Type: WSignIn},
			{al:'li', name:'LogIn', Type: WLogIn},
			{al:'ie', name:'ItemEditor', Type: WItemEditor},
			{al:'pi', name:'PrehledItems', Type: WPrehledItems},
			{al:'pih', name:'PrehledItemsHeader', Type: WPrehledItemsHeader},
			// < generic
			{al:'w', name:'Widget', Type: Widget},
			{al:'w-tg', name:'WTaskGroup', Type: WTaskGroup},
			{al:'w-t', name:'WTask', Type: WTask},
			{al:'wtc', name:'WTimeCounter', Type: WTimeCounter},
			{al:'el', name:'Element', Type: AXElement},
		]);

		// Set model variant
		//this.statesVariantV2('default');
		this.statesVariant('default');
		
		//this.statesVariant('noUser:logIn');
		//this.statesVariant('noUser:register');
		
		//this.statesVariant('user:taskGroups');
		//this.statesVariant('user:taskGroups:create');
		//this.statesVariant('user:tasks');
		//this.statesVariant('user:tasks:create');
		
		//this.statesVariant('user:tasks:open:stoped');
		//this.statesVariant('user:tasks:open:paused');

		//this.statesVariant('user:tasks:open:running');
	}	

	statesVariantV2(ctx:string) {

		if(ctx.includes('default')) {

			let dm = new DataModel2({

				// Others
				oUserSession: new M.OUserSession({
					user: null,
					token:<string> '',
				}),
				oNavigator: new M.ONavigator({
					url:<string> '',
				}),

				// Widgets
				wApp: new M.WApp({
					outletTarget:<string> '',
					wPageAuth: new M.WPageAuth({
						outlerTarget:<string> '',
						wLoger: new M.WLoger({
							action:<string> 'logIn',
							
							wLogIn: new M.WLogIn({ 
								infoMessage:<string> 'none', user: null,
								ui_bRegister: new M.UIElement({ name: 'b-register', block:true }),
							}),
							
							wSignIn: new M.WSignIn({ 
								infoMessage:<string> 'none', user: null,
								ui_bLogIn: new M.UIElement({ name: 'b-logIn', block:true }),
							}),
						}),
					}),
					wMainPrehled: new M.WMainPrehled({
						wItemEditor: new M.WItemEditor({ newItemName:<string> '', show:<boolean> false }),
						prehledItems: new M.WPrehledItems({
							variant:<string> 'tasks',
							header: new M.WPrehledItemsHeader({ variant:<string> 'tasks', }),
							items: [],
						}),
					}),
				}, 'checker2')
			})
		}
	}

	statesVariant(ctx:string) {

		if(ctx.includes('default')) {
			// Model
			// ---------------------------------------------------------------------
			this.dm.create('o/UserSession', {
				user: null,
				token:<string> '',
			});
			this.dm.create('o/Navigator', {
				url:<string> '',
			});
			// w/page-auth
			this.dm.create('w/App', {
				outletTarget: 'x', // < auth, app/task-groups // <-from/presmoravni (/)
			});

			// AUTH
			// w/loger
			this.dm.create('w/Loger', {
					action: 'logIn', // <-from/ a/switch loger  // < logIn,signIn
				});

			// w/logIn
			let wLogIn = this.dm.create('w/LogIn', {
				infoMessage:'none',
				user: null,
			}).lastCreated;
			
			wLogIn.connect(
				this.dm.createInst(AXElement, {
					name: 'b-logIn',
					block: true,
				}).lastCreated
			, 'element', 'con/ref');

			// w/signIn
			let wSignIn = this.dm.create('w/SignIn', {
				infoMessage:'none',
			}).lastCreated;
			wSignIn.connect(
				this.dm.createInst(AXElement, {
					name: 'b-register',
					block: true,
				}).lastCreated
			, 'element', 'con/ref');
			
			// App
			this.dm.create('w/ItemEditor', {
				itemName: '',
				useCtx:<string> '',
				useCtxData:<string> '',
				show:false, 
			});

			this.dm.create('v/TaskGroups', {
				items: [], //this.mock.taskGroups('many', 3),
			});

			this.dm.create('v/Tasks', {
				items:  [], //this.mock.tasks('many', 3),
			});

			// w/main prehled - X
			let wPI:any = this.dm.create('w/PrehledItems', {
				variant: 'x', // <-temp/by[App.outletTarget]
				// nodes
				header:null,
				items: [], // <-from/ ...
			}).lastCreated;
			
			wPI.header = this.dm.create('w/PrehledItemsHeader', {
				variant: 'x', // <-temp/by[App.outletTarget] 
				createdTasks:<number> 0,
				celkOdpCas:<number> 0,
			}).lastCreated;

			wPI.connect(wPI.header);
		}
		else if(ctx.includes('noUser')) {

			// Model
			// ---------------------------------------------------------------------
			this.dm.create('o/UserSession', {
				user: null,
				token:<string> '',
			});
			this.dm.create('o/Navigator', {
				url:<string> '',
			});
			// w/page-auth
			this.dm.create('w/App', {
				outletTarget: 'auth', // < auth, app/task-groups
			});

			if(ctx == 'noUser:logIn') { //  < OK
				// Model
				// ---------------------------------------------------------------------
				this.dm.create('w/Loger', {
					action: 'logIn',
				});

				let wLogIn = this.dm.create('w/LogIn', {
					infoMessage:'none',
				}).lastCreated;
				
				wLogIn.connect(
					this.dm.createInst(AXElement, {
						name: 'b-logIn',
						block: true,
					}).lastCreated
				, 'element', 'con/ref');
			}

			if(ctx == 'noUser:register') { // < OK
				// Model
				// ---------------------------------------------------------------------
				this.dm.create('w/Loger', {
					action: 'signIn',
				});

				let wSignIn = this.dm.create('w/SignIn', {
					infoMessage:'none',
				}).lastCreated;
				wSignIn.connect(
					this.dm.createInst(AXElement, {
						name: 'b-register',
						block: true,
					}).lastCreated
				, 'element', 'con/ref');
			}
		}
		else if(ctx.includes('user')) { 
			// Model
			// ---------------------------------------------------------------------
			this.dm.create('o/UserSession', {
				user: <IUser>{ name: 'user1', email:'user1@emil.com', token:'tokenUser1' },
				token:<string> 'tokenUser1', // <-pr/User.toke
			});
			this.dm.create('o/Navigator', { // < t/X
				url:<string> 'app/task-groups',
			});
			

			if(ctx.includes('user:taskGroups:create') || ctx.includes('user:tasks:create')) {
				// Model
				// ---------------------------------------------------------------------
				this.dm.create('w/ItemEditor', {
					newItemName: '',
					show:true,
				});
			}
			else {
				// Model
				// ---------------------------------------------------------------------
				this.dm.create('w/ItemEditor', {
					newItemName: '',
					show:false,
				});	
			}

			if(ctx.includes('user:taskGroups')) { // < OK

				// Model
				// ---------------------------------------------------------------------
				this.dm.create('v/TaskGroups', {
					items:  [], //this.mock.taskGroups('many', 3),
				});

				this.dm.create('w/App', {
					outletTarget: 'app/task-groups', // < auth, app/task-groups
				});

				// w/main prehled - X
				let wPI:any = this.dm.create('w/PrehledItems', {
					variant: 'taskGroups',
					// nodes
					header:null,
					items: [ // < t/Pz. neni napojeno na parent node
						this.dm.createInst(Widget, {
							changedName: '',
							name: 'tg1', // <-from/DTaskGroup
							id: 0,
							celkOdpCas: 10,
						}).lastCreated,
						this.dm.createInst(Widget, {
							changedName: '',
							name: 'tg2',
							id: 1,
							celkOdpCas: 20,
						}).lastCreated,
					],
				}).lastCreated;
				
				wPI.header = this.dm.create('w/PrehledItemsHeader', {
					variant: 'taskGroups',
				}).lastCreated;

				wPI.connect(wPI.header);

				// this.mock.tasks('many', 6)
				// .map((taskMock, index) => {
				// 	if(index == 3) {
				// 		return {
				// 			...taskMock,
				// 			open: true,
				// 		}
				// 	}
				// 	else {
				// 		return taskMock;
				// 	}
				// })
			}


			if(ctx.includes('user:tasks')) { // < L5
				// Model
				// ---------------------------------------------------------------------
				this.dm.create('w/App', {
					outletTarget: 'app/tasks', // < auth, app/task-groups
				});

				this.dm.create('v/Tasks', {
					items: [], //this.mock.tasks('many', 6),
				});

				let wPI:any = this.dm.create('w/PrehledItems', {
					variant: 'tasks',
					// nodes
					header:null,
					items: [ // < t/Pz. neni napojeno na parent node
						
					],
				}).lastCreated;
				
				wPI.header = this.dm.create('w/PrehledItemsHeader', {
					variant: 'tasks',
				}).lastCreated
				wPI.connect(wPI.header);

				if(ctx.includes('user:tasks:open')) {

					// Model
					// ---------------------------------------------------------------------
					wPI.items = [
						this.dm.createInst(Widget, {
							changedName: '',
							name: 't1', // <-from/DTask
							id: 0,
							odpCas: 10,
							// nodes
							timeCounter: null,
							open: false,
						}).lastCreated,
						this.dm.createInst(Widget, {
							changedName: '',
							name: 't2',
							id: 1,
							odpCas: 20,
							timeCounter: null,
							open: true,
						}).lastCreated,
						this.dm.createInst(Widget, {
							changedName: '',
							name: 't3',
							id: 1,
							odpCas: 20,
							timeCounter: null,
							open: true,
						}).lastCreated,
					];

					wPI.connectMany(wPI.items, 'items');

					if(ctx.includes('user:tasks:open:stoped') || ctx.includes('user:tasks:open:paused')) {
						let wT2:any = this.dm.selectByName(Widget, 't2').result;
						wT2.timeCounter = this.dm.createInst(WTimeCounter, { name:'tc-t1', state:'stoped', odpCas:0 }).lastCreated;
						wT2.connect(wT2.timeCounter);

						let wT3:any = this.dm.selectByName(Widget, 't3').result;
						wT3.timeCounter = this.dm.createInst(WTimeCounter, { name:'tc-t1', state:'paused', odpCas:10 }).lastCreated;
						wT3.connect(wT3.timeCounter);
					}
					else if(ctx.includes('user:tasks:open:running') ) {
						
						let wT2:any = this.dm.selectByName(Widget, 't2').result;
						wT2.timeCounter = this.dm.createInst(WTimeCounter, { name:'tc-t1', state:'stoped', odpCas:0 }).lastCreated;
						wT2.connect(wT2.timeCounter);

						let wT3:any = this.dm.selectByName(Widget, 't3').result;
						wT3.timeCounter = this.dm.createInst(WTimeCounter, { name:'tc-t1', state:'running', odpCas:20 }).lastCreated;
						wT3.connect(wT3.timeCounter);
					}
				}
				else {
					wPI.items = [
						this.dm.createInst(Widget, {
							changedName: '',
							name: 't1', // <-from/DTask
							id: 0,
							odpCas: 10,
							// nodes
							timeCounter: null,
							open: false,
						}).lastCreated,
						this.dm.createInst(Widget, {
							changedName: '',
							name: 't2',
							id: 1,
							odpCas: 20,
							timeCounter: null,
							open: false,
						}).lastCreated,
						this.dm.createInst(Widget, {
							changedName: '',
							name: 't3',
							id: 1,
							odpCas: 20,
							timeCounter: null,
							open: false,
						}).lastCreated,
					];
					wPI.connectMany(wPI.items, 'items');
				}
			}
		}

		//console.log('-> vychozi dm/:', this.dm.source.nodes);
	}

	private newMethod() {
		return this;
	}

	// VARIANTY VISUALU
	statesForSubModelA() { // < noUser:logIn
		this.al.log('AX3,App,Bo', '', 'Bootstrap - states A', [], null);

		
		
		// Views
		// ---------------------------------------------------------
		
		
		// Widgets
		// ---------------------------------------------------------
		this.dm.create('w/Loger', {
			action: 'logIn', // < signIn
		});
		
		// this.dm.create('w/SignIn', {
		// 	infoMessage:'',
		// })
		// 	.connect(this.createInst('el/b-register'), 'element')
		
		// - w/SignIn - X

		// - w/logIn
		
		
		// < t/Dbg
		//let dbg1_se_bLogInBlock = this.dm.path(['w/LogIn', 'el/b-logIn']).result;
		//let dbg2_se_bLogInBlock = this.dm.selectByInst(wLogIn).selectByName(AXElement, 'b-logIn');
		//console.log('-> dbg1_se_bLogInBlock: ', dbg1_se_bLogInBlock);
		
		// this.dm.create('w/itemEditor', {
		// 	show:<boolean> false,
		// 	newItemName:<string> '',
		// });
		
		// w/prehledItems - X

		this.al.log('CP,AppSt', 'cp/app state', 'state: ', [], { state: this.dm.source.nodes });

		// Napojeni na modul -> viz/ang-Components
	}

	statesForSubModelB() { // < noUser:signIn 
		this.al.log('AX3,App,Bo', '', 'Bootstrap - states B', [], null);

		// Obejcts
		// ---------------------------------------------------------
		this.dm.create('w/App', {
			outletTarget: 'auth', // < auth, app/task-groups
		});

		// Widgets
		// ---------------------------------------------------------
		// - w/loger
		this.dm.create('w/Loger', {
			action: 'signIn', // < signIn
		});

		// - w/signIn
		

		// - w/logIn - X
	}

	statesForSubModelC() { // < user:taskGroups
		this.al.log('AX3,App,Bo', '', 'Bootstrap - states C', [], null);

		// Obejcts
		// ---------------------------------------------------------
		this.dm.create('w/App', {
			outletTarget: 'app/task-groups', // < auth, app/task-groups
		});

		// Views
		// ---------------------------------------------------------
		this.dm.create('v/Tasks', {
			items: []
		});

		this.dm.create('v/TaskGroups', {
			items: 0, //this.mock.taskGroups('many', 3)
		});

		// Widgets
		// ---------------------------------------------------------
		// w/prehledItems
		this.dm.create('w/PrehledItems', {
			variant:<string> 'taskGroups',
			items: 0, //this.mock.taskGroups('many', 3),

		});
	}

	statesForSubModelD() { // < user:tasks
		this.dm.create('w/App', {
			outletTarget: 'app/task-groups', // < auth, app/task-groups
		});

		// Widgets
		// ---------------------------------------------------------
		// w/prehledItems
		this.dm.create('w/PrehledItems', {
			variant:<string> 'taskGroups',
		});
	}

	statesForSubModelE() {
	}

	statesForSubModelF() {
	}

	statesForSubModelG() {
	}

	statesForSubModelX() {
		
		// this.al.log('AX3,App,Bo', '', 'Bootstrap - states A', [], null);

		// this.dm.defineConstructors([
		// 	// < static
		// 	{al:'v', name:'View', Type: View},
		// 	{al:'vtg', name:'TaskGroups', Type: VTaskGroups},
		// 	{al:'vta', name:'Tasks', Type: VTasks},

		// 	{al:'o', name:'Object', Type: AXObject},
		// 	{al:'n', name:'Navigator', Type: AXNavigator},
		// 	{al:'us', name:'UserSession', Type: OUserSession},

		// 	{al:'tg', name:'TaskGroup', Type: TaskGroup},
		// 	{al:'ta', name:'Task', Type: Task},

		// 	{al:'a', name:'App', Type: WApp},
		// 	{al:'lo', name:'Loger', Type: WLoger},
		// 	{al:'si', name:'SignIn', Type: WSignIn},
		// 	{al:'li', name:'LogIn', Type: WLogIn},
		// 	{al:'ie', name:'ItemEditor', Type: WItemEditor},
		// 	{al:'pi', name:'PrehledItems', Type: WPrehledItems},
		// 	{al:'pih', name:'PrehledItemsHeader', Type: WPrehledItemsHeader},
		// 	// < generic
		// 	{al:'w', name:'Widget', Type: Widget},
		// 	{al:'el', name:'Element', Type: AXElement},
		// ])

		// // Obejcts
		// // ---------------------------------------------------------
		// this.dm.create('w/App', this.vc.switchCfg((visual) => {
		// 	switch (visual) {
		// 		default:
		// 			return {
		// 				outletTarget: 'x', // < auth, app/task-groups
		// 			}
		// 	}
		// }));
		// this.dm.create('o/UserSession', this.vc.switchCfg((visual) => {
		// 	switch (visual) {
		// 		case 'logIn': // < L6
		// 			return {
		// 				user: { name: 'user1', email: 'user1@email.com' },
		// 				token:<string> 'tokenUser1',
		// 			}
		// 		case 'logOut': // < L6
		// 			return {
		// 				user: null,
		// 				token:<string> '',
		// 			}
		// 		default: // < L6
		// 			return {
		// 				user: null,
		// 				token:<string> '',
		// 			}
		// 	}
		// }));
		// this.dm.create('o/Navigator', this.vc.switchCfg((visual) => {
		// 	switch (visual) {
		// 		default: // < L6
		// 			return {
		// 				url:<string> '',
		// 			}
		// 	}
		// }));
		
		// // Views
		// // ---------------------------------------------------------
		// this.dm.create('v/TaskGroups', this.vc.switchCfg((visual) => {
		// 	switch (visual) {
		// 		default: // < L6
		// 			return {
		// 				items: this.mock.taskGroups('many', 3),
		// 			}
		// 	}
		// }));
		// this.dm.create('v/Tasks', this.vc.switchCfg((visual) => {
		// 	switch (visual) {
		// 		default: // < L6
		// 			return {
		// 				items: this.mock.tasks('many', 6),
		// 			}
		// 	}
		// }));
		
		// // Widgets
		// // ---------------------------------------------------------
		// this.dm.create('w/Loger', this.vc.switchCfg((visual) => {
		// 	switch (visual) {
		// 		case 'logIn': // < L6
		// 			return {
		// 				action: 'logIn', // < signIn
		// 			}
		// 		case 'signIn': // < L6
		// 			return {
		// 				action: 'signIn', // < signIn
		// 			}
		// 		default: // < L6
		// 			return {
		// 				action: 'signIn', // < signIn
		// 			}
		// 	}
		// }));
		// // this.dm.create('w/SignIn', {
		// // 	infoMessage:'',
		// // })
		// // 	.connect(this.createInst('el/b-register'), 'element')
		// // this.dm.create('w/logIn', {
		// // 	infoMessage:'',
		// // })
		// // 	.connect(this.createInst('el/b-logIn'), 'element')
		// // this.dm.create('w/itemEditor', {
		// // 	show:<boolean> false,
		// // 	newItemName:<string> '',
		// // });
		// this.dm.create('w/PrehledItems', {
		// 	variant:<string> 'taskGroups',
		// });
		// this.dm.create('w/PrehledItems', this.vc.switchCfg((visual) => {
		// 	switch (visual) {
		// 		case 'tasks': // < L6
		// 			return {
		// 				variant:<string> 'tasks',
		// 			}
		// 		case 'taskGroups': // < L6
		// 			return {
		// 				variant:<string> 'taskGroups',
		// 			}
		// 		default: // < L6
		// 			return {
		// 				variant:<string> 'taskGroups',
		// 			}
		// 	}
		// }));

		// this.al.log('CP,AppSt', 'cp/app state', 'state: ', [], { state: this.dm.source.nodes });

		// // Napojeni na modul -> viz/ang-Components
	}

	// VARIANTY VISUALU - KONSTRUKCE
	setModelVariants() {
		// this.model.
		// 	.use([
		// 		{ use:false, id:'noUser:Register' } // < visualA
		// 	])
		// 	.set('o/UserSession', {
		// 		user: null,
		// 		token:<string> '',
		// 		next: [
		// 			this.model.node('').set('w/App', { outletTarget: 'auth',
		// 				next: [
		// 					this.set('w/loger', {  })
		// 				]
		// 			}, 'logIn'),
		// 			this.model.set('w/App', { outletTarget: 'app/task-groups' })
		// 			this.model.set('w/App', { outletTarget: 'app/tasks:id' })
		// 		]
		// 	}, 'noUser')
		// 	.set('o/UserSession', {
		// 		user: { user:'user1', email: 'user1@email.com' },
		// 		token:<string> '',
		// 		next: [

		// 		]
		// 	})
		// 	.set('o/Navigator')
		// 	.set('v/TaskGroups')
		// 	.set('v/Tasks')
		// 	.set('w/Loger')
		// 	.set('w/LogIn')
		// 	.set('w/SignIn')
		// 	.set('w/PrehledItems')
		// 	.set('w/taskItem')
		// 	.set('w/taskGroupItem')
		// 	.use(

		// 	)
	}

	// ...
	testsDMConnect() { // < (4/16te)

		/* // < ZMENY (2)
			- DN.createDNode()
			- DN.deleteDNode()
		*/

		this.dm.defineConstructors([
			{ al:'w', Type: Widget},
			{ al:'wA', name:'WidgetA', Type: WidgetA},
			{ al:'wB', name:'WidgetB', Type: WidgetB},
			{ al:'el', Type: AXElement},
			{ al:'elA', name:'ElementA', Type: ElementA},
			{ al:'elB', name:'ElementB', Type: ElementB},
			{ al:'elC', name:'ElementC', Type: ElementC},
			{ al:'elD', name:'ElementD', Type: ElementD}
		]);
		/* < poz/kontroluje se oproti jiz axistujici sade ale ne v ramci, pridavane sady */
		
		// // - fu/CRUD operace s nody (5/5te,4api)
			// // < OK/test/1 /4h50m
			// let dNode1 = this.dm.create('w/widgetA').getLastCreated();
			// let dNode2 = this.dm.create('w/widgetB').getLastCreated();
			//console.log('tests1 - surce: ', this.dm.source.nodes);
		
			// // < OK/test/1.1 /30m
			// let dNode = this.dm.createMany('w/widgetA', [
			// 	this.dm.create('w/widgetA').getLastCreated(),
			// 	this.dm.create('w/widgetB').getLastCreated()
			// ]);
			// console.log('test1.1 - source: ', this.dm.source.nodes);

			// // < OK/test/2 /1h15m
			// let dNode1 = this.dm.create('w/widgetA').getLastCreated();
			// let dNode2 = this.dm.create('w/widgetB').getLastCreated();
			
			// let deletedDNode1 = this.dm.delete('w/widgetA', dNode1.id);
			// let deletedDNode2 = this.dm.delete('w/widgetB', dNode2.id);
			// console.log('test2 - source: ', this.dm.source.nodes);
		
			// // < OK/test/2.1 /30m
			// let dNode1 = this.dm.create('w/widgetA').getLastCreated();
			// let dNode2 = this.dm.create('w/widgetB').getLastCreated();

			// let deletedDNodes = this.dm.deleteMany(Widget, [ dNode1.id, dNode2.id ]);
			// console.log('test2.1 - source: ', this.dm.source.nodes);

			// // < OK/test/3 /45m
			// let type = this.dm.createType('w/widgetA', {
			// 	name:<string> 'name',
			// 	valueA:<number> 1,
			// 	valueB:<number> 2,
			// });
			// let dNode = this.dm.createFromType('w/widgetA', {
			// 	name: 'widgetA',
			// });
			// console.log('test3 - source: ', this.dm.source.nodes);
		// // - fu[1]/CRUD operace s nody - propagování oparecí skrze connections // (1/1te)
			// // < OK/test 1 /1h30m
			// let dNode1 = this.dm.create('w/widgetA', {
			//	name:<string> 'widgetA'
			// }).getLastCreated()
				// .connect( // < var/1 /Ok
				// 	this.dm.create('el/elementA', { name: 'elementA'}).getLastCreated()
				// 	, 'elements', 'con/ref')
				// .connect( // < var/2
				// 	this.create('el/elementA', {
				// 		name: 'elementA'
				// 	}).getLastCreated(), 'elements,tagB', 'con/ref')
				// .connectMany( // var 3 /Ok
				// 	[
				// 		this.dm.create('el/elementA').getLastCreated(),
				// 		this.dm.create('el/elementB').getLastCreated(),
				// 	],
				// 	'elements', 'con/ref',  
				// ) 
			
			//let conTo = dNode1.connectedTo() //  var 1 /Ok
			//let connected = dNode1.connected()
			// //let conFrom = dNode1.connectedFrom() // t/Todo:

			// let conTo = dNode1.connectedTo('con/ref'); //  var 2
			// let connected = dNode1.connected('con/ref');
			// //let conFrom = dNode1.connectedFrom('con/ref') // t/Todo:
			// console.log('test3 - source: ', this.dm.source.nodes)
		// // - fu/manage connections betwen nodes // (1/1te)
			// // < OK/test 1 /40m
			// let dNode1 = this.dm.create('w/widgetA', {
			// 	name:<string> 'widgetA'
			// }).getLastCreated()
			// 	.connectMany(
			// 		[
			// 			this.dm.create('el/elementA').getLastCreated(),
			// 			this.dm.create('el/elementB').getLastCreated(),
			// 		],
			// 		'elements', 'con/ref',  
			// 	);

			// let elementA = this.dm.selectOne('el/elementA').result;
			// elementA.disconect( // < var/1 /OK
			// 	this.dm.selectOne('w/widgetA').result
			// , 'con/ref');
			// elementA.disconect( // < var/2
			// 	this.selectOne('w/widgetA'), 'con/ref'
			// )
			// console.log('test3 - source: ', this.dm.source.nodes);
		// // ---
		// // - fu/manage connections betwen nodes - agregace connections -> propagovávní/providing /connections
		// // -- fu/agregace, propagování -> instancí typů // < responsivní kolekce konkrétního typu // <- [1] // (1/1te)
			// // < OK/test 1 /2h5m
			// let dNode1 = this.dm.create('w/widgetA', {
			// 	name:<string> 'widgetA',
			// }).getLastCreated()
			// 	.connectMany( // var 3
			// 		[
			// 			this.dm.create('el/elementA').getLastCreated(),
			// 			this.dm.create('el/elementB').getLastCreated(),
						
			// 		],
			// 		'elements', 'con/inst',  
			// 	) 
			// let dNode2 = this.dm.create('w/widgetB', {
			// 	name:<string> 'widgetA',
			// }).getLastCreated()
			// 	.connectFromType(this.dm.selectOne('w/widgetA').result);

			// let elC = this.dm.create('el/elementC').getLastCreated();
			// dNode1.connect(elC, '', 'con/inst');
			// let elD = this.dm.create('el/elementD').getLastCreated();
			// dNode1.connect(elD, '', 'con/inst');
			// console.log('test3 - source: ', this.dm.source.nodes);

		// // ---
		// // - fu/selekce dat,nodů z dm/datového modelu // (0/1te)
			// < >> OK/test 1 /15m
			// let wA = this.dm.create('w/widgetA', { name: 'widgetA' }).getLastCreated()
			// 	.connect(
			// 		this.dm.create('el/elementA').getLastCreated(), '', 'elements'
			// 	)
			// let last = this.dm.getLast();

			// let wB = this.dm.create('w/widgetB', { name: 'widgetB' })
			// 	.connect(
			// 		this.dm.create('el/elementC', { name:'elementC' }), '', 'elements'
			// 	)
			// let lastCreated = this.dm.getLastCreated();
			// console.log('test3 - source: ', this.dm.source.nodes);

		// // -- fu/selekce - řetezení /výběrů
		// // -- fu/selekce - operace na /výberů
		// // --- fu/selekce podle - základní, podle[Typu,Instance,Jmena] // (4te)
			// // < test 1 OK/R/1h7m
			// let wA = this.dm.create('w/widgetA', {
			// 		name: 'widgetA'
			// 	}).getLastCreated()
			// 	.connectMany([
			// 		this.dm.create('el/elementA').getLastCreated(),
			// 		this.dm.create('el/elementB').getLastCreated(),
			// 		this.dm.create('el/elementC').getLastCreated(),
			// 	], '', 'con/ref')

			// let seElementA = this.dm.selectOne('el/elementA')
			// 	.operation((selection) => {
			// 		return selection;
			// 	})
			// 	// .set({ // < var/1
			// 	// 	name: 'elementAA'
			// 	// })
			// 	.setMany({ // < var/2
			// 		name: 'elementAAA'
			// 	})
			// console.log('test1 - source: ', this.dm.source.nodes);

			// let seWidegtA = this.dm.selectByInst(wA)
			// 	.operation((selection) => {
			// 		return selection;
			// 	})
			// 	.set({ // < var/1
			// 		name: 'widgetBB'
			// 	})
			// 	.setMany({ // < var/2
			// 		name: 'widgetBBB'
			// 	})
			// console.log('test1 - source: ', this.dm.source.nodes)
			
			// let seWidegtA = this.dm.selectByName(Widget, 'widgetA')
			// 	.operation((selection) => {
			// 		return selection;
			// 	})
			// 	.set({ // < var/1
			// 		name: 'widgetAA'
			// 	})
			// 	.setMany({ // < var/2
			// 		name: 'widgetAAA'
			// 	})
			// console.log('test1 - source: ', this.dm.source.nodes)

			// let seElementC = this.selectByName(AXElement, 'elementC') // < X
			// 	.operation((selection) => {
			// 		return selection;
			// 	})
			// 	.set({ // < var/1
			// 		name: 'elementCC'
			// 	})
			// 	.setMany({ // < var/2
			// 		name: 'elementCC'
			// 	})

			// // < OK/test 1.1 /30m
			// let sesWidegtA = this.dm.selectOne('w/widgetA')
			// 	.set({ name: 'set-name' })
			// 	.getDataElement('name')
			// let seWidegtAbyInst_name = this.dm.selectByInst(wA)
			// 	.set({ name: 'set-name' })
			// 	.getDataElement('name')
			// wA.name = 'widgetA';
			// let seWidegtAbyName_name = this.dm.selectByName(Widget, 'widgetA')
			// 	.set({ name: 'set-name' })
			// 	.getDataElement('name')
			// console.log('test1 - source: ', this.dm.source.nodes)

			// // < OK/test 2.1 /1h25m
			// let seElementC = this.dm.selectOne('el/elementC').result;
			// let seElementA = this.dm.selectOne('el/elementA').result;

			// let elements = this.dm.select(AXElement)
			// 	.containes({
			// 		data: [seElementA, seElementC]
			// 	});
			// console.log('test1 - source: ', this.dm.source.nodes);

			// // < D1,OK/test 2.2 /20m
			// let elements = this.dm.select(AXElement)
			// 	.containesType({ Type: AXElement })
		
		// // --- fu/selekce podle - vazeb - path // (2te)
			// < D1,OK/test 1.1 /15m
			// let wA = this.dm.create('w/widgetA', {
			// 		name: 'widgetA'
			// 	}).getLastCreated()
			// 	.connectMany([
			// 		this.dm.create('el/elementA').getLastCreated(),
			// 		this.dm.create('el/elementB').getLastCreated(),
			// 		this.dm.create('el/elementC', { name: 'elementC' }).getLastCreated(),
			// 	], '', 'con/ref');

			// let seElementC = this.dm.path(['w/widgetA', 'el/elementC']);
			// console.log('test1 - source: ', this.dm.source.nodes);

			// < test D2,OK/1.2 // <- dm/[t1.1]
			// let seElementC = this.dm.getDNodeForPath(['w/widgetA', 'el/elementC']);
		
		// // --- fu/selecke podle - rules -> dat na nodu // (1te)
			// < D2,OK/test 1 /20m // <- dm/[t1.1]
			// let se_elementC = this.dm.select(AXElement, { name: 'elementC' });
			// let se_widgetA = this.dm.select(Widget, { name: 'widgetA' })
			// 	.operation((selection) => { 
			// 		return selection;
			// 	})
			// 	.set({
			// 		name: 'widgetAA'
			// 	})

		// // - //fu/selekce dat,nodů z dm/datového modelu - modifikace -> non-mutable update /dm
		// // ---
		// // -- //fu/uložení předchozích stavů -> krokování historie app
		// // - //fu/odeslání dat ve výstupním streamu -> states
	}
	
	states3() {
		// DM - CONSTRUCTORS, TYPES
		// this.dm.defineConstructors([  // fa(I)
		// 	{ al:'w', name:'widget', Type: Widget },
		// 	{ al:'v', name:'view', Type: View },
		// 	{ al:'o', name:'object', Type: AXObject },
		// 	{ al:'us', name:'userSession', Type: UserSession },
		// 	{ al:'el', name:'element', Type: AXElement }
		// ]);

		// Obejcts
		// --------------------------------------------------------------
		//this.dm.create('o/Navigator', {  // fa(I)
			// url:<string> '',
		//});
		//this.dm.create('o/UserSession', {  // fa(I)
			// active:<boolean> false,
			// token:<string> '',

			// user:<DNode> null,
		//});
		
		// Views
		// --------------------------------------------------------------
		//this.dm.create('v/TaskGroups', { // fa(I)
			// name:<string> '',
			// id:<string> '',
			// filters:<any[]> [ { type:'dn/TaskGroup' } ],
			// sorting:<any> {},

			// items:<DNode>[]: [],
		//});
		//this.dm.create('v/Tasks', { // fa(I)
			// name:<string> '',
			// id:<string> '',
			// filters:<any[]> [ { type:'dn/Task' } ],
			// sorting:<any> [],

			// items:<DNode>[]: [],
		//});

		// Widgets
		// --------------------------------------------------------------
		//this.dm.create('w/loger', { // N/fa(I) /30m
			// action: [ // < ds/stateMachine
			// 	{active: true, name: 'logIn' },
			// 	{active: false, name: 'register'}
			// ],
		//})
			//.connect(this.dm.createInst('el/b-vstup', { block: false }), '', 'con/ref')
		//this.dm.create('w/logIn', { // N/fa(I)
			// form: { // < ds/
			// 	email: { placeHolder: 'name', value: undefined},
			// 	password: { placeHolder: 'password', value: undefined},
			// }
			// infoMessage: ''
		//})
			//.connect(this.dm.createInst('el/b-logIn', { block: false }), '', 'con/ref')
		//this.dm.create('w/signIn', { // N/fa(I)	 
			// form: { // < ds/
			// 	email: { placeHolder: 'name', value: undefined},
			// 	password: { placeHolder: 'password', value: undefined},
			// 	checkPassword: { placeHolder: 'check password', value: undefined},

			// },
			// infoMessage: ''
		//})
			//.connect(this.dm.createInst('el/b-register', { block: false }), '', 'con/ref')
		//this.dm.create('w/mainPrehled')
		//this.dm.create('w/prehledItems', { // N/fa(I) /48m
			// varinat: [
			// 	{active: true, name: 'taskGroups'},
			// 	{active: false, name: 'tasks'},
			// ],
		//}).getLastCreated()
			//.connect(this.dm.selectOne('v/taskGroups'), 'taskGroups', 'con/ref')
			//.connect(this.dm.selectOne('v/tasks'), 'tasks', 'con/ref')
		//this.dm.create('w/prehledHeader', { // N/fa(I)
			// varinat: [
			// 	{active: true, name: 'taskGroups'},
			// 	{active: true, name: 'tasks'},
			// ]
		//})
		//this.dm.create('w/itemEditor', { // N/fa(I)
			// varinat: [
			// 	{active: true, name: 'taskGroups'},
			// 	{active: true, name: 'tasks'},
			// ],
			// show:<boolean> false, 
			// newItemName:<string> '',
			// type:<any> null,
		//})
		//this.dm.create('w/timeCounter', { // N/fa(I)
			// odpCas:<number> 0,
		//}),
		//this.dm.create('w/taskGroupItem', { // N/fa(I)
			// open:<boolean> false, // < state
			// odpCas:<number> 0,
			// name:<string> '',
			// changedName:<string> '',
		//}).getLastCreated()
			//.connect(this.dm.createInst('el/et-name', { switchState:<boolean> false, }), 'el_name', 'con/ref')
		//this.dm.create('w/taskItem', { // N/fa(I)
			// ui_etName: {
			// 	edited:<boolean> false,
			// },
			// open:<boolean> false,
			// odpCas:<number> 0,
			// name:<string> '',
			// stateWork:<boolean> false,
			// chnagedName:<string> '',
		//}).getLastCreated()
			//.connect(this.dm.createInst('el/et-name', { switchState:<boolean> false, }), 'el_name', 'con/ref')
		// this.dm.create('widgets', { // N/fa(I) // < X
		// 	loger: this.dm.connect(this.dm.create('w/loger'))
		// });

		// App
		// --------------------------------------------------------------
		//this.dm.create('app', {  // fa(I)
			// userSession: this.dm.connect('o/UserSession'),
			// widgets: null,
			// dNodes: null,
			// objects: null,
			// views: this.dm.connectFromType('View') // < t/aut,gen
			// testA: this.dm.connectFromStream([ // < t/aut,gen
			// 	this.dm.utils.createStreamFilter([{}]),
			// 	this.dm.utils.createStreamFilter([{}]),
			// ])
		//}).getLastCreated()
			// .connect('o/userSession', 'userSession', 'con/ref')
			// .connectMany([
			// 	this.dm.selectOne('v/taskGroups').result,
			// 	this.dm.selectOne('v/tasks').result
			// ], 'views', 'con/ref')
	}

	states2() {

		/* // Schéma

			- o/User
			- dn/Task
			- dn/TaskGroup
		*/

		/* // Connections
			- ref // < default
			- prirazeni
		*/

		// Examples - Instances
		// this.dm.create('dn/Task', { // fa(I)
		// 	name:<string> '',
		// 	odpCas:<number> 0,
		// });

		// // DM - CONSTRUCTORS, TYPES
		// this.dm.defineConstructors([  // fa(I)
		// 	{ al:'w', name:'widget', Type: Widget },
		// 	{ al:'dn', name:'data', Type: Data },
		// 	{ al:'ta', name:'task', Type: Task },
		// 	{ al:'tg', name:'taskGroup', Type: TaskGroup },
		// 	{ al:'v', name:'view', Type: View },
		// 	{ al:'o', name:'object', Type: AXObject },
		// 	{ al:'us', name:'userSession', Type: UserSession },
		// 	{ al:'el', name:'element', Type: AXElement }
		// ]);

		// this.dm.createType('dn/Task', {  // fa(I)
		// 	name:<string> '',
		// 	odpCas:<number> 0,
		// });
		
		// this.dm.createType('dn/TaskGroup', {  // fa(I)
		// 	name:<string> '',
		// 	odpCas:<number> 0,
		// 	tasksTodoCount:<number> 0,
		// 	tasksDoneCount:<number> 0,
		// 	taskGroup:<any> null, // < parent
		// 	tasks:<any> null,
		// });

		// DM - STRUCTURE // Node instances
		
		// DataNodes
		// --------------------------------------------------------------
		// this.dm.createMany('dn/Task', [  // fa(I)
		// 	/*N*/this.createInst('ta/task1').getLastCreated(),
		// 	/*N*/this.createInst('ta/task2').getLastCreated(),
		// 	/*N*/this.createInst('ta/task3').getLastCreated(),
		// ]);

		// this.dm.createMany([  // dn/TaskGroups,Tasks fa(I)
		// 	/*N*/this.dm.createInstFromType('dn/taskGroup', { name: 'taskGroup1', 
		// 		// tasks: this.dm.connectMany('dn/Task', [
		// 		// 	this.dm.connect('dn/Task', { name: 'task1' }, 'cn/child'), 
		// 		// 	this.dm.connect('dn/Task', { name: 'task2' }, 'cn/child')
		// 		// ])
		// 		//this.dm.selectManyByName('dn/Task', [ 'task1', 'task2' ]), // < var2
		// 	})
		// 		.connectMany([
		// 			this.dm.createInstFromType('dn/Task', { name: 'task1' }, 'con/ref-child'), 
		// 			this.dm.createInstFromType('dn/Task', { name: 'task2' }, 'con/ref-child')
		// 		])
		// 	this.dm.createInstFormType('dn/TaskGroup', { name: 'taskGroup2' // < connectTo
		// 		// tasks: tasks: this.dm.connectMany('dn/Task', [
		// 		// 	this.dm.connect('dn/Task', { name: 'task3' }, , 'cn/child');
		// 		// ])
		// 	})
		// 		.connectMany('dn/Task', [
		// 			this.dm.createInstFromType('dn/Task', { name: 'task3' }, , 'con/ref-child');
		// 		])

		// 	// this.dm.createFormType('dn/TaskGroup', { name: 'taskGroup 2' // < var2
		// 	// 	tasks: tasks: this.dm.connectFromStream('dn/Task', [
		// 	// 		this.dm.utils.createStreamFilter([{ parent: this.dm.utils.this('id') }]),
		// 	// 	])
		// 	// }),

		// 	// this.dm.createFormType('dn/TaskGroup', { name: 'taskGroup 2' // < var3, connectFrom
		// 	// 	tasks: tasks: this.dm.connectFromStream('dn/Task', [
		// 	// 		this.dm.utils.createStreamSelector( connectionFrom: 'cn/parent' ), // < filter[Selector]
		// 	// 	])
		// 	// }),
		// ])

		// this.dm.createInst('dn/user1', {  // R/
		// 	name:<string> 'user1',
		// 	email:<string> 'email1@email.cz',
		// 	password:<string> '1234',
		// }).getLastCreated()
		// 	.connectMany([
		// 		this.selectOne('dn/takGroup1'), // < select inst
		// 		this.selectOne('dn/takGroup2'), // < select inst
		// 	], 'taskGroups', 'con/ref')

		// this.dm.createInst('dn/user2', {  // R/
		// 	name:<string> 'user2',
		// 	email:<string> 'email2@email.cz',
		// 	password:<string> '1234',
		// }).getLastCreated()
		// 	.connect(this.selectOne('dn/takGroup3'), 'taskGroups', 'con/ref') // < select inst
		// Obejcts
		// --------------------------------------------------------------
		// this.dm.create('o/Navigator', {  // fa(I)
		// 	url:<string> '',
		// });
		// this.dm.create('o/UserSession', {  // fa(I)
		// 	active:<boolean> false,
		// 	token:<string> '',
		// }).getLastCreated()
		// 	.connect('o/User', 'user', 'con/ref')
		// Views
		// --------------------------------------------------------------
		// this.dm.create('v/TaskGroups', { // fa(I)
		// 	name:<string> '',
		// 	id:<string> '',
		// 	filters:<any[]> [ { type:'dn/TaskGroup' } ],
		// 	sorting:<any> {},

		// 	items: this.dm.connectFromType('dn/TaskGroup'),
		// 	// items: this.dm.connectMany([
		// 	// 	this.dm.create('dn/Task', { name: 'task1' }),
		// 	// 	this.dm.create('dn/Task', { name: 'task2' }),
		// 	// ], 'cn/prirazeni'),
		// }).getLastCreated()
		// 	//.connectFromType(TaskGroup, 'items', 'con/ref')
		// 	.connectFromNode('dn/user1', [
		// 		this.createDNSelector('dn/TaskGroup')
		// 	])
		// 	.connectFromStream([
		// 		this.dm.createSFilterConnection('dn/TaskGroup', {
		// 			connectedTo: 'o/user1'
		// 		}, '', 'con/ref', 'secondary')
		// 	])
		// this.dm.create('v/Tasks', { // fa(I)
		// 	name:<string> '',
		// 	id:<string> '',
		// 	filters:<any[]> [ { type:'dn/Task' } ],
		// 	sorting:<any> [],

		// 	items: this.dm.connectFromType()
		// }).getLastCreated()
		// 	//.connectFromType(Task, 'items', 'con/ref')
		// 	.connectFromNode('dn/user1', [
		// 		this.createDNSelector([ 'dn/taskGroup1', 'dn/Task' ]).filter([
		// 			this.createSFilter({ name:'nameA', data: '1-2' }),
		// 			this.createSFilter({ name:'nameA', data: '1-2' }),
		// 		])
		// 	])
		// 	.connectFromStream('dn/user2', [
		// 		this.dm.createSFilterConnection('dn/Task', 
		// 			connectedTo: ['o/user1', 'dn/taskGroup1']
		// 		'', 'con/ref')
		// 	])
		// 	.connectFromStream([
		// 		this.dm.createSFilterConnection('dn/Task', {
		// 			connectedTo: 'o/user1'
		// 		}, '', 'con/ref', 'secondary')
		// 	])
		// Widgets
		// --------------------------------------------------------------
		// this.dm.create('w/loger', { // N/fa(I) /30m
		// 	action: [ // < ds/stateMachine
		// 		{active: true, name: 'logIn' },
		// 		{active: false, name: 'register'}
		// 	],
		// })
		// 	.connect(this.dm.createInst('el/b-vstup', { block: false }), '', 'con/ref')
		// this.dm.create('w/logIn', { // N/fa(I)
		// 	form: { // < ds/
		// 		email: { placeHolder: 'name', value: undefined},
		// 		password: { placeHolder: 'password', value: undefined},
		// 	}
		// 	infoMessage: ''
		// })
		// 	.connect(this.dm.createInst('el/b-logIn', { block: false }), '', 'con/ref')
		// this.dm.create('w/signIn', { // N/fa(I)	 
		// 	form: { // < ds/
		// 		email: { placeHolder: 'name', value: undefined},
		// 		password: { placeHolder: 'password', value: undefined},
		// 		checkPassword: { placeHolder: 'check password', value: undefined},

		// 	},
		// 	infoMessage: ''
		// })
		// 	.connect(this.dm.createInst('el/b-register', { block: false }), '', 'con/ref')
		// //this.dm.create('w/mainPrehled')
		// this.dm.create('w/prehledItems', { // N/fa(I) /48m
		// 	varinat: [
		// 		{active: true, name: 'taskGroups'},
		// 		{active: false, name: 'tasks'},
		// 	],

		// 	// view: this.connect('v/taskGroups') // nebo v/tasks
		// 	// items: this.connectSwitch(() => { // < var2 // < t/logic
		// 	// 	let variantTaskGroup =  this.dm.utils.parent('variant').filter((v) => { 
		// 	// 			return v.name == 'taskGroup' 
		// 	// 		})
		// 	// 		.find((v) => { 
		// 	// 			return v.active == true 
		// 	// 		})
		// 	// 	if(variantTaskGroup) {
		// 	// 		this.connect('v/taskGroups');
		// 	// 	}
		// 	// 	else {
		// 	// 		this.connect('v/tasks');
		// 	// 	}
		// 	// })
		// }).getLastCreated()
		// 	.connect(this.dm.selectOne('v/taskGroups'), 'taskGroups', 'con/ref')
		// 	.connect(this.dm.selectOne('v/tasks'), 'tasks', 'con/ref')
		// this.dm.create('w/prehledHeader', { // N/fa(I)
		// 	varinat: [
		// 		{active: true, name: 'taskGroups'},
		// 		{active: true, name: 'tasks'},
		// 	]
		// })
		// this.dm.create('w/itemEditor', { // N/fa(I)
		// 	varinat: [
		// 		{active: true, name: 'taskGroups'},
		// 		{active: true, name: 'tasks'},
		// 	],
		// 	show:<boolean> false, 
		// 	newItemName:<string> '',
		// 	type:<any> null,
		// })
		// this.dm.create('w/timeCounter', { // N/fa(I)
		// 	odpCas:<number> 0,
		// }),
		// this.dm.create('w/taskGroupItem', { // N/fa(I)
		// 	open:<boolean> false, // < state
		// 	odpCas:<number> 0,
		// 	name:<string> '',
		// 	changedName:<string> '',
		// }).getLastCreated()
		// 	.connect(this.dm.createInst('el/et-name', { switchState:<boolean> false, }), 'el_name', 'con/ref')
		// this.dm.create('w/taskItem', { // N/fa(I)
		// 	ui_etName: {
		// 		edited:<boolean> false,
		// 	},
		// 	open:<boolean> false,
		// 	odpCas:<number> 0,
		// 	name:<string> '',
		// 	stateWork:<boolean> false,
		// 	chnagedName:<string> '',
		// }).getLastCreated()
		// 	.connect(this.dm.createInst('el/et-name', { switchState:<boolean> false, }), 'el_name', 'con/ref')
		// this.dm.create('widgets', { // N/fa(I) // < X
		// 	loger: this.dm.connect(this.dm.create('w/loger'))
		// });

		// App
		// --------------------------------------------------------------
		// this.dm.create('app', {  // fa(I)
		// 	// userSession: this.dm.connect('o/UserSession'),
		// 	// widgets: null,
		// 	// dNodes: null,
		// 	// objects: null,
		// 	// views: this.dm.connectFromType('View') // < t/aut,gen
		// 	// testA: this.dm.connectFromStream([ // < t/aut,gen
		// 	// 	this.dm.utils.createStreamFilter([{}]),
		// 	// 	this.dm.utils.createStreamFilter([{}]),
		// 	// ])
		// }).getLastCreated()
		// 	.connect('o/userSession', 'userSession', 'con/ref')
		// 	.connectMany([
		// 		this.dm.selectOne('v/taskGroups').result,
		// 		this.dm.selectOne('v/tasks').result
		// 	], 'views', 'con/ref')
	}

	states() {
		console.log('[Bootstrap Init] init /states');
		// Data
		// Visual
		// this.dm.create(Models.WLoger, {
		// 	name: 'loger',
		// 	action: [
		// 		{ name:'logIn', active: true },
		// 		{ name:'register', active: false },
		// 	],
		// 	elements: this.dm.createSubCollection(Models.AXElement, [ // < static
		// 		{ name:'name', siwtchState: false },
		// 		{ name:'name', siwtchState: false },
		// 	], 'el/elements')
		// })
		// this.dm.create(Models.WidgetA, {
		// 	name: 'widgetA',
		// 	value: 0,
		// })
		// console.log('dm.collections: ', this.dm.dm.collections);
	}
}