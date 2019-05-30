// angular
import { 
	Injectable, Component, Input, ChangeDetectorRef,
	OnInit, OnDestroy, AfterViewInit, AfterViewChecked, OnChanges, DoCheck, AfterContentChecked, AfterContentInit,
	ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
// flow
import { Category, Managers, MSignal, TInjector1 } from '../../../flow/core/fl-core';
import { ALoger } from '../../../flow/loger/loger';
// app
import { AppTests } from '../../ngt-mechanics/ngt-tests';
import { Interactions } from '../../ngt-mechanics/ngt-interactions';
import { Reducers} from '../../ngt-mechanics/ngt-redukce';
import { Selectors } from '../../ngt-mechanics/ngt-sel';
import { States } from '../../ngt-mechanics/ngt-states';
import { UIEvents } from '../../ngt-mechanics/ngt-ui';
import * as M from '../../ngt-mechanics/ngt-states';
import { Mock } from '../../ngt-mechanics/ngt-mocks';
import { IUIFUser } from '../../ngt-mechanics/ngt-in';

// WIDGETS
@Component({
	selector: 'cWidget',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	//inputs: ['instance', 'name']
})
class CWidget extends Category implements OnChanges, OnInit, OnDestroy, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked {
	
	@Input() variant:string;
	@Input('dl') // < deepLevel
	set _dl(_dl:string) { 
		if(_dl) {
			this.dl += _dl;
		}
	}

	dl:string = '';
	temp:string = 'cWidget';
	isInit:boolean = true;
	al:ALoger;

	// < ax/app, ax/tests-loger
	public _states:States;
	//public _actions:Actions;
	public _interactions:Interactions;
	public _reducers:Reducers;
	public _selectors:Selectors;
	public _uiEvents:UIEvents;
	public _tests:AppTests;

	constructor(m:Managers) {
		super(m);
		if(m) { this.al = m.al; }
	}

	// LF-HOOKS
	ngOnChanges() {
		if(this.m == undefined) {
			debugger;
		}
		this.m.al.log('Ang,lf', undefined, '[Bootstrap] %s - comp-ngOnChanges', [this.temp], null);	
	}

	ngOnInit() {
		//this.al.log('Ang,lf,Init', undefined, '[Bootstrap]  %s - comp-onInit w/app', [this.temp], null);
	}

	ngOnDestroy() {
		
	}

	ngDoCheck() {
		//this.al.log('Ang,lf', undefined, '[Bootstrap]  %s - comp-ngDoCheck', [this.temp], null);
	}

	ngAfterContentInit() {
		//this.al.log('Ang,lf', undefined, '[Bootstrap]  %s - comp-ngAfterContentInit', [this.temp], null);
	}

	ngAfterContentChecked() {
		//this.al.log('Ang,lf', undefined, '[Bootstrap]  %s - comp-ngAfterContentChecked', [this.temp], null);
	}

	ngAfterViewInit() {
		//this.al.log('Ang,lf', undefined, '[Bootstrap]  %s - comp-ngAfterViewInit', [this.temp], null);
	}

	ngAfterViewChecked() {
		//this.al.log('Ang,lf', undefined, '[Bootstrap]  %s - comp-ngAfterViewChecked -> bootstrap app', [this.temp], null);
		this.isInit = this.isInit ? false : true;
	}

	// Operace
	// Operace
	convertTaskTime(timeInS:number):string {

		let showTime = '00:00';

		if(timeInS) {
			let timeInMS = timeInS * 1000;
			let seconds = Math.floor((timeInMS % (1000 * 60)) / 1000);
			let minutes = Math.floor((timeInMS % (1000 * 60 * 60)) / (1000 * 60));
			
			let showSeconds = seconds < 10 ? '0'+seconds : ''+seconds;
			let showMinutes = minutes < 10 ? '0'+minutes : ''+minutes;

			showTime = showMinutes+':'+showSeconds;
			console.log('-> convertTaskTime odpCas/%s, s/%s, m/%s', timeInS, seconds, minutes);
		}
		
		return showTime;
	}
}


@Injectable()
export class NGTimerInj {
	
	constructor(
		public _states:States,
		//_actions:TActions,
		public _interactions:Interactions,
		public _reducers:Reducers,
		public _selectors:Selectors,
		public _uiEvents:UIEvents,
		public _tests:AppTests,
	) {
		// code...
	}
}

// APP
@Component({
	selector: 'w-app',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	//inputs: ['instance', 'name']
})
export class AppComponent extends CWidget   { 
	
	@Input('dl') _dl:string = ''; // < deepLevel
	dl:string = '';
	temp:string = 'app';
	appVar:string = 'ngTimer'; // < ax-loger-tests, ax3-flowTests, ax3-Checker

	// selectors
	se_outletTarget:string = 'x'; // < app/tasks, app/task-groups, auth	

	constructor(
		m:Managers,
		_ngTimer:NGTimerInj,
		private cdRef:ChangeDetectorRef,
	) {
		super(m);

		switch (this.appVar) {
			case "ngTimer":
				this._states = _ngTimer._states;
				this._interactions = _ngTimer._interactions;
				this._reducers =_ngTimer._reducers;
				this._selectors = _ngTimer._selectors;
				this._uiEvents = _ngTimer._uiEvents;
				this._tests = _ngTimer._tests;
				break;
		}

		//console.log = function() {}; 

		// Listeners
		this.m.se.listenToSel('w/App-outletTarget', (value) => {
			this.al.log('CP,Lis', 'cp/listen to', 'updated data/value: ', [], { data: value });
			this.se_outletTarget = value;
		});
	}

	ngOnInit() {
		//this._tests.unitTests();
		super.ngOnInit();

		// Init
		//this.im.dispatch('[Test Init] test init', { widget: 'w/App' });
		//this.im.dispatch('[Nav] pristup (/)');
		this._tests.testAppInputsInit();

		//this._testsLoger.logerTests();
		//this.m.am.dispatch('[View Component] init, reload data', { fromCtx: undefined, widget:'w/App', variant: undefined, query:{}, view:'' });
	}

	ngAfterViewChecked() {
		super.ngAfterViewChecked();
		//this._tests.unitTests();

		if(!this.isInit) {
			console.log('-> app update ended');
			this._tests.testAppInputsActions();
			this.cdRef.detectChanges();
		}

		this.isInit = false;
	}
	sampleEventsUI() {
		// this.uim.uiCheckers([ // << w/loger /5m
		// 	{ widget:'widgetA', uiElement: ['b/buttonA','b/buttonB'], event:['click'] },
		// ])
		// 	.actions((ev:any, widget:string) => {
		// 		switch (ev.type) {
		// 			case "b/switchAction>click": // <<
		// 				//this.am.dispatch('[UI] switch loger');
		// 				break; 
		// 			// press:start
		// 			case "b/vstup>click":
		// 				//this.am.dispatch('[] log as quest'); 
		// 				break; 
		// 		}

		// 		// a/[UI] switch loger
		// 		// a/[] vstup
		// 	});
	}

	// iev/Input Events
	logOut() {
		console.log('-> iev/logOut');
		this.ui.dispatch('[UI Event] click', { w:'w/App', ui:'b-logOut' });
	}
}

// WIDGETS, STATICS
@Component({
	selector: 'w-page-auth',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	//inputs: ['instance', 'name']
})
export class WPageAuth extends CWidget { 

	// - X
	temp:string = 'w/pageAuth';

	constructor(m:Managers) { // < private uiDialog:MatDialog
		super(m);
		//this.al.log('Ang,Con', undefined, '[Bootstrap Init] %s - con', [this.temp], null);
	}

	ngOnInit() {
		super.ngOnInit();
	}
}

// WIDGETS, STATICS - LOGER
@Component({
	selector: 'w-loger',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	//inputs: ['instance', 'name']
})
export class WLoger extends CWidget { 

	@ViewChild('modal') public logerModal:any;
	temp:string = 'w/loger';
	se_action:string = 'x'; // < w/logIn, signIn

	constructor(m:Managers) { // < private _sel:Selectors
		super(m);
		//this.al.log('Ang,Con', undefined, '[Bootstrap Init] %s - con', [this.temp], null);
		
		// Listeners
		this.m.se.listenToSel('w/Loger-action', (value) => {
			this.m.al.log('CP,Lis', 'cp/listen to', 'updated data/value: ', [], { data: value });
			this.se_action = value;
		});
	}

	odklad_con() {
		// Connect to selectors
		// _sel.sel.getLogerAction.subscribe((value:any) => {
		// 	if(value) {
		// 		this.al.log('App,Se,Sub', undefined, '> selected: getWLAction - value:', [value], null);
		// 		this.se_action = value;
		// 	}
		// 	else {
		// 		this.al.log('App,Se,Sub', undefined, '> selected: getWLAction - NONE selection', [], null);
		// 	}
		// })
	}

	ngOnInit() {
		super.ngOnInit();
		//this.im.dispatch('[Test Init] test init', { widget: 'w/Loger' });
		this.m.im.dispatch('[View Component] init, reload data', { fromCtx: 'component', widget: { targetWStx:'w/Loger', Type: M.WLoger }, variant: undefined, query:{}, view:'' });
	}

	click(event:any) {
		console.log('c-ev/CLICK c/%s', this.temp);
		this.im.dispatch('[UI Switch] switch w/Loger', { widget:'w/Loger' });
	}

	// ia/Input Actions
	switchAction(uiElement:string) {
		this.ui.dispatch('[UI Event] click', { w:'w/Loger', ui:uiElement });
	}

	ngOnDestroy() {
		this.logerModal.deny();
	}
}

@Component({
	selector: 'w-log-in',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	//inputs: ['instance', 'name']
})
export class WLogIn extends CWidget { 

	temp:string = 'w/logIn';
	// cmp model
	formLogIn:FormGroup;

	// selectors
	se_block:boolean = false;
	se_infoMessage:string = 'X';
	se_user: { email:string, password:string };

	constructor(m:Managers, private fb:FormBuilder) {
		super(m);
		//this.al.log('Ang,Con', undefined, '[Bootstrap Init] %s - con', [this.temp], null);
		// m.selectors.getLogerAction((value) => {
		// 	this.se_action;
		// })

		// Set-up
		this.createLogInForm();

		// Listeners
		this.m.se.listenToSel('w/LI', (dNode) => {
			this.m.al.log('CP,Lis', 'cp/listen to', 'updated data/value: ', [], { data: dNode.user });
			this.se_infoMessage = dNode.infoMessage;
			// A
			//this.se_user.email = dNode.user.email;
			//this.se_user.password = dNode.user.password;
		});

		this.m.se.listenToSel('w/LogIn-block', (value) => {
			this.m.al.log('CP,Lis', 'cp/listen to', 'updated data/value: ', [], { data: value });
			this.se_block = value;
		});

		this.m.se.listenToSel('w/LogIn-infoMessage', (value) => {
			this.m.al.log('CP,Lis', 'cp/listen to', 'updated data/value: ', [], { data: value });
			this.se_infoMessage = value;
		});
	}

	ngOnInit() {
		super.ngOnInit();
		//this.im.dispatch('[Test Init] test init', { widget: 'w/LogIn' });
		this.m.im.dispatch('[View Component] init, reload data', { fromCtx: undefined, widget: { targetWStx:'w/LogIn', Type: M.WLogIn }, variant: undefined, query:{}, view:'' });
	}

	// set up
	createLogInForm() {
		
		this.formLogIn = this.fb.group({
			email: [''],
			password: [''],
		});

		this.formLogIn.valueChanges.subscribe((formChanges:any) => {
			this.inputFormLogIn({
				name: formChanges.name,
				email: formChanges.email,
				password: formChanges.password,
				checkPassword: formChanges.password,
			})
		})
	}

	// iev/Input Events
	switchAction(uiElement:string) {
		this.ui.dispatch('[UI Event] click', { w:'w/LogIn', ui:uiElement });
	}

	inputFormLogIn(user:IUIFUser) {
		this.ui.dispatch('[UI Event] form input', { w:'w/LogIn', ui:'fo-user', 
				user: user,
			});
	}

	logIn() {
		this.ui.dispatch('[UI Event] click', { w:'w/LogIn', ui:'b-logIn', dbg: { succes: true, url:'app/tasks' } });
	}
}

@Component({
	selector: 'w-sign-in',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	//inputs: ['instance', 'name']
})
export class WSignIn extends CWidget { 

	temp:string = 'w/signIn';
	formSignIn:FormGroup;

	// selectors
	se_block:boolean = false;
	se_infoMessage:string = '';

	constructor(m:Managers, private fb:FormBuilder) {
		super(m);
		//this.al.log('Ang,Con', undefined, '[Bootstrap Init] %s - con', [this.temp], null);
		// m.selectors.getLogerAction((value) => {
		// 	this.se_action;
		// })

		// Set-up
		this.createSignInForm();

		// Listeners
		this.m.se.listenToSel('w/SI', (dNode) => {
			this.m.al.log('CP,Lis', 'cp/listen to - w/SI', 'updated data/value: ', [], { data: dNode });
			console.log('-> sel: ', dNode);
			this.se_infoMessage = dNode.infoMessage;
			//this.se_block = value;
		});

		this.m.se.listenToSel('w/SignIn-block', (value) => {
			this.m.al.log('CP,Lis', 'cp/listen to', 'updated data/value: ', [], { data: value });
			this.se_block = value;
		});

		this.m.se.listenToSel('w/SignIn-infoMessage', (value) => {
			this.m.al.log('CP,Lis', 'cp/listen to', 'updated data/value: ', [], { data: value });
			this.se_infoMessage = value;
		});
	}

	ngOnInit() {
		super.ngOnInit();
		//this.im.dispatch('[Test Init] test init', { widget: 'w/SignIn' });
		this.m.im.dispatch('[View Component] init, reload data', { fromCtx: undefined, widget:'w/SignIn', variant: undefined, query:{}, view:'' });
	}

	// set up
	createSignInForm() {
		
		this.formSignIn = this.fb.group({
			name: [''],
			email: [''],
			password: [''],
			checkPassword: [''],
		});

		this.formSignIn.valueChanges.subscribe((formChanges:any) => {
			this.inputFormSignIn({
				name: formChanges.name,
				email: formChanges.email,
				password: formChanges.password,
				checkPassword: formChanges.password,
			})
		})
	}

	// iev/Input Events
	switchAction(uiElement:string) {
		this.ui.dispatch('[UI Event] click', { w:'w/SignIn', ui:uiElement });
	}

	inputFormSignIn(user:IUIFUser) {
		this.ui.dispatch('[UI Event] form input', { w:'w/SignIn', ui:'fo-user', 
				user: user,
			});
	}

	signIn() {
		this.ui.dispatch('[UI Event] click', { w:'w/SignIn', ui:'b-register', dbg: { succes: true, url:'app/tasks' } });
	}
}

// WIDGETS, STATICS
@Component({
	selector: 'w-main-prehled',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	//inputs: ['instance', 'name']
})
export class WMainPrehled extends CWidget { 

	// - X
	temp:string = 'w/mainPrehled';

	// selectors
	se_show:boolean;

	constructor(m:Managers) {
		super(m);
		//this.al.log('Ang,Con', undefined, '[Bootstrap Init] %s - con', [this.temp], null);

		this.m.se.listenToSel('w/IE', (dNode) => {
			this.m.al.log('CP,Lis', 'cp/listen to', 'updated data/value: ', [], { data: dNode });
			this.se_show = dNode.show;
		});
	}

	ngOnInit() {
		super.ngOnInit();
		console.log('-> Comp.Init n/%s - var2/%s', this.temp, this.variant);
	}
}

@Component({
	selector: 'w-item-editor',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	//inputs: ['instance', 'name']
})
export class WItemEditor extends CWidget { 

	temp:string = 'w/itemEditor';

	// comp model
	formItem:FormControl;

	// selectors
	se_itemName:string = '';
	se_show:boolean = false;
	dNode:any;

	constructor(m:Managers, private fb:FormBuilder) {
		super(m);
		//this.al.log('Ang,Con', undefined, '[Bootstrap Init] %s - con', [this.temp], null);

		// Set-up
		this.createFormItemName();

		// Listeners
		this.m.se.listenToSel('w/IE', (dNode) => {
			this.m.al.log('CP,Lis', 'cp/listen to', 'updated data/value: ', [], { data: dNode });
			// this.se_show = dNode.show;
			// this.se_itemName = dNode.itemName;
			this.dNode = dNode;
		});
	}

	ngOnInit() {
		super.ngOnInit();
		//this.im.dispatch('[Test Init] test init', { widget: 'w/ItemEditor' });
		this.m.im.dispatch('[View Component] init, reload data', { fromCtx: undefined, widget: { targetWStx:'w/ItemEditor', Type: M.WItemEditor }, variant: undefined, query:{}, view:'' });	
	}

	createFormItemName() {
		this.formItem = new FormControl('')
		this.formItem.valueChanges.subscribe((value:any) => {
			console.log('change value: ', value);
			this.inputTextItemName(value);
		})
	}

	// ie/Input Events
	inputTextItemName(itemName:string) {
		this.ui.dispatch('[UI Event] text field input', { w:'w/ItemEditor', ui:'ti-itemName', itemName: itemName });
	}

	save(modal:any) {
		console.log('modal:', modal);
		
		if(this.dNode.useCtx == 'create'){
			this.ui.dispatch('[UI Event] click', { w:'w/ItemEditor', ui:'b-save', useCtx:'create', create: { DNode: M.Task } });
		}
		else {
			this.ui.dispatch('[UI Event] click', { w:'w/ItemEditor', ui:'b-save', useCtx:'rename', update: { DNode: M.Task, id:this.dNode.useCtxData.id } });
		}
		//this.dNode.show = false;
		this.im.dispatch('[UI Show/Hide] show', { widget:'w/ItemEditor' });
		modal.approve();
	}

	close(modal:any) {		
		
		//this.dNode.show = false;
		this.im.dispatch('[UI Show/Hide] show', { widget:'w/ItemEditor' });
		modal.deny();
	}
}

@Component({
	selector: 'w-prehled-items',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	//inputs: ['instance', 'name']
})
export class WPrehledItems extends CWidget { 

	temp:string = 'w/prehledItems';

	// selectors
	se_variant:string = 'x'; // < tasks, taskGroups
	se_taskGroupItems:any = []; // <- mock data
	se_taskItems:any = []; // <- mock data

	constructor(m:Managers) { // < , private _sel:Selectors, private mock:Mock
		super(m);
		// this.al.log('Ang,Con', undefined, '[Bootstrap Init] %s - con', [this.temp], null);
		// _sel.sel.getPrehledItemsVariant.subscribe((value) => {
			
		// 	if(value) {
		// 		this.al.log('App,Se,Sub', undefined, '-> selected: getWPI_variant - value:', [value], null);
		// 		this.se_variant = value;
		// 	}
		// 	else {
		// 		this.al.log('App,Se,Sub', undefined, '-> selected: getWPI_variant - NONE selection', [], null);
		// 	}
		// })

		// _sel.sel.getVTaskGroupsItems.subscribe((data) => {
		// 	if(data) {
		// 		this.al.log('App,Se,Sub', undefined, '-> selected: getVTG_items - value:', [], { data: data });
		// 		this.se_taskGroupItems = data;
		// 	}
		// 	else {
		// 		this.al.log('App,Se,Sub', undefined, '-> selected: getVTG_items - NONE selection', [], null);
		// 	}
		// })

		// _sel.sel.getVTasksItems.subscribe((data) => {
			
		// 	if(data) {
		// 		this.al.log('App,Se,Sub', undefined, '-> selected: getVT_items - value:', [], { data: data });
		// 		this.se_taskItems = data;
		// 	}
		// 	else {
		// 		this.al.log('App,Se,Sub', undefined, '-> selected: getVT_items - NONE selection', [], null);
		// 	}
		// })
		//this.setMocData();

		// Listeners
		this.m.se.listenToSel('w/PI-variant', (value) => {
			this.m.al.log('CP,Lis', 'cp/listen to', 'updated data/value: ', [], { data: value });
			this.se_variant = value;
		});
		this.m.se.listenToSel('w/PI-items', (value) => {
			this.m.al.log('CP,Lis', 'cp/listen to', 'updated data/value: ', [], { data: value });
			this.se_taskGroupItems = value;
			this.se_taskItems = value;
		});


		// this.m.se.listenToSel('v/T-items', (value) => {
		// 	this.m.al.log('CP,Lis', 'cp/listen to', 'updated data/value: ', [], { data: value });
		// 	this.se_taskGroupItems = value;
		// });

		// this.m.se.listenToSel('v/TG-items', (value) => {
		// 	this.m.al.log('CP,Lis', 'cp/listen to', 'updated data/value: ', [], { data: value });
		// 	this.se_taskItems = value;
		// });
	}

	setMocData() {
		// this.se_taskGroupItems  = this.mock.taskGroups('many', 3);
		// this.se_taskItems  =  this.mock.tasks('many', 6);
	}

	ngOnInit() {
		super.ngOnInit();
		console.log('-> Comp.Init n/%s - var2/%s', this.temp, this.variant);
		//this.im.dispatch('[Test Init] test init', { widget: 'w/PrehledItems' });
		this.m.im.dispatch('[View Component] init, reload data', { 
			fromCtx: undefined, widget: { targetWStx:'w/PrehledItems', Type: M.WPrehledItems }, variant: this.variant, query:{ q:this.setQuery(this.variant)}, view:this.setViews(this.variant),
			//dbg_opSelect: { succes: true, dataType:'taskGroups' },
			dbg_opSelect: { succes: true, dataType:'tasks' }
		});
	}

	// SETTING FOR VARIANTS
	private setQuery(variant:string):any {
		switch (variant) {
			case "taskGroups":
				return { q:'TG,byUser' };
			case "tasks":
				return { Type: 'Task' };
			default:
				return undefined;
		}
	}

	private setViews(variant:string):string {
		switch (variant) {
			case "taskGroups":
				return 'v/TaskGroups';
			case "tasks":
				return 'v/Tasks';
			default:
				return '';
		}
	}

	ngOnChanges() {
		console.log('-> Comp.Init n/%s - var2/%s', this.temp, this.variant);
	}
}

@Component({
	selector: 'w-prehled-items-header',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	//inputs: ['instance', 'name']
})
export class WPrehledItemsHeader extends CWidget { 
	
	temp:string = 'w/prehledItemsHeader';
	
	se_variant:string = 'x'; // < tasks, taskGroups
	se_createdTasks:number = 0;
	se_celkOdpCas:string = '0:00';

	constructor(m:Managers) {
		super(m);
		// this.al.log('Ang,Con', undefined, '[Bootstrap Init] %s - con', [this.temp], null);
		// _sel.sel.getPrehledItemsHeaderVariant.subscribe((value) => {
		// 	if(value) {
		// 		this.al.log('App,Se,Sub', undefined, '-> selected: getWPIH_variant - value:', [value], null);
		// 		this.se_variant = value;
		// 	}
		// 	else {
		// 		this.al.log('App,Se,Sub', undefined, '-> selected: getWPIH_variant - NONE selection', [], null);
		// 	}
		// })
		this.m.se.listenToSel('w/PIH', (dNode) => {
			this.m.al.log('CP,Lis', 'cp/listen to', 'updated data/value: ', [], { data: dNode });
			this.se_createdTasks = dNode.createdTasks;
			this.se_celkOdpCas = this.convertTaskTime(dNode.celkOdpCas);
		});

		this.m.se.listenToSel('w/PIH-variant', (value) => {
			this.m.al.log('CP,Lis', 'cp/listen to', 'updated data/value: ', [], { data: value });
			this.se_variant = value;
		});
	}

	ngOnInit() {
		super.ngOnInit();
		//this.im.dispatch('[Test Init] test init', { widget: 'w/PrehledItemsHeader' });
		this.m.im.dispatch('[View Component] init, reload data', 
			{ fromCtx: undefined, widget: { targetWStx:'w/PrehledItemsHeader', Type: M.WPrehledItemsHeader }, variant: this.variant, query:{}, view:'' 
		});
	}

	showWItemEditor() {
		this.ui.dispatch('[UI Event] click', { w:'w/PrehledItemsHeader', ui:'b-create', showTarget:'w/ItemEditor', setUseCtx:'create', });
	}
}

// WIDGETS, GENERIC
@Component({
	selector: 'w-task-group-item',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	//inputs: ['instance', 'name']
})
export class WTaskGroupItem extends CWidget { 

	@Input() taskGroup:any;

	temp:string = 'w/taskGroupItem';
	se_switchState:boolean = false;
	se_celkOdpCas:number = 0;

	constructor(m:Managers) {
		super(m);
		//this.al.log('Ang,Con', undefined, '[Bootstrap Init] %s - con', [this.temp], null);
		// Create DataModel
		// this.m.sm.createInst('w/taskGroupItem', { // < t/Dcs
		// 	variant:<string> '',
		// 	changedName:<string> '',
		// 	open:<boolean> false,
		// })
		// 	.connect(this.m.sm.createInst('el/et-name'), {
		// 		switchState:<boolean> false,
		// 	});

		// Connect to selectors
		// m.selectors.getTaskGroupEtName((value) => {
		// 	this.se_switchState  = value;
		// })

		this.m.se.listenToSel('w/tgi', (dNode) => {
			if(dNode.id == this.taskGroup.id) {
				this.m.al.log('CP,Lis', 'cp/listen to', 'updated data/value: ', [], { data: dNode });
				this.se_switchState = dNode.ui_etName.switchState;
			}
		});
	}

	ngOnInit() {
		super.ngOnInit();
		// -> dispatch - init X
	}
}

@Component({
	selector: 'w-task-item',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	//inputs: ['instance', 'name']
})
export class WTaskItem extends CWidget { 

	@Input() task:any;

	temp:string = 'w/taskItem';
	se_switchState:boolean = false;
	se_open:boolean = false;
	se_odpCas:number = 0;

	// 
	dNode:any;
	odpCas:number = 0;

	constructor(m:Managers) {

		super(m);
		//this.al.log('Ang,Con', undefined, '[Bootstrap Init] %s - con', [this.temp], null);
		// Create DataModel
		// m.sm.createInst('w/taskItem', {
		// 	odpCas:<number> 0,
		// 	variant:<string> '',
		// 	changedName:<string> '',
		// 	open:<boolean> false,
		// })
		// 	.connect(this.m.sm.createInst('el/et-name'), {
		// 		switchState:<boolean> false,
		// 	});

		// Connect to selectors
		// m.selectors.getTaskEtName((value) => {
		// 	this.se_switchState = value;
		// })

		// m.selectors.getTaskOdpCas((value) => {
		// 	this.se_odpCas = value;
		// })

		// m.selectors.getTaskOpen((value) => {
		// 	this.se_open = value;
		// })

		this.m.se.listenToSel('w/ti', (dNode) => {
			if(dNode.id == this.task.id) {
				this.m.al.log('CP,Lis', 'cp/listen to', 'updated data/value: ', [], { data: dNode });
				this.se_switchState = dNode.ui_etName.switchState;
				this.se_odpCas = this.dNode.odpCas;
				this.dNode = dNode;
			}
		});
	}

	ngOnInit() {
		super.ngOnInit();
		this.odpCas = this.task.id;
		// -> dispatch - init X
	}

	// iev/Input Events
	showWItemEditor() {
		this.ui.dispatch('[UI Event] click', { w:'w/taskItem', ui:'t-name', showTarget:'w/ItemEditor', setUseCtx:'rename', useCtxData: { id:this.task.id } });
	}

	delete() {
		this.ui.dispatch('[UI Event] click', { w:'w/taskItem', ui:'b-delete', delete: { DNode:M.Task, id: this.task.id } });
	}

	startTimer() { // < start-pause-resume
		this.ui.dispatch('[UI Event] click', { w:'w/taskItem', ui:'b-start-pause-resume', action: { DNode:M.Task, id:this.task.id }, 
			dbg: { succes: true }
		});
	}

	resetTimer() {
		this.ui.dispatch('[UI Event] click', { w:'w/taskItem', ui:'b-reset', action: { DNode:M.Task, id:this.task.id }, 
			dbg: { succes: true }
		});
	}
}

@Component({
	selector: 'w-time-counter',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	//inputs: ['instance', 'name']
})
export class WTimeCounter extends CWidget { 

	@Input() counter:any;

	temp:string = 'w/timeCounter';
	se_odpCas:number = 0;

	constructor(m:Managers) {
		super(m);
		//this.al.log('Ang,Con', undefined, '[Bootstrap Init] %s - con', [this.temp], null);
		// Create DataModel
		// this.sm.createInst('w/timeCounter', {
		// 	odpCas:<number> 0,
		// })
		// 	.connect(this.create('el/b-start/stop'), {
		// 		switchState:<boolean> false,
		// 	});

		// Connect to selectors
		// m.selectors.getTCounterOdpCas((value) => {
		// 	this.se_odpCas = value;
		// })
	}

	// LF-HOOKS
	ngOnInit() {
		super.ngOnInit();
		// -> dispatch - init X
	}
}