// angular
import { Injectable } from '@angular/core';
// rxjs
import { from, Observable, Subject } from 'rxjs';
import {
	map,
	filter,
 	merge,
 	mergeMap
} from 'rxjs/operators';
// Flow
import { ALoger } from '../loger/loger';
import { StateManager} from '../model-manager/fl-model';
import { AXUtils as AX, Utils } from './fl-core-utils';

@Injectable()
export class TInjector1 {
	
	name:string = 'inj1';
	
	constructor() {
		// code...
	}
}

interface IANodeLogerFormatA {
	
	// < aNode
	aNode:string;
	anType:string;
	ctx:string;
	tags:string;
	formANode:string;
	formANFeParent:string;
	
	// // < check /payload
	payloadDElements?:string|number[];
	payload?:any[];

	// // < check /operations
	// // < check /dataModel
	dm_con:any; // < Subject, BehaviorSubject
}

interface IState {
}

// ...

class ANOperation  { // < t/Todo:
	
	name:string;
	resultData:any;

	constructor() {
		
	}
}

class ANode {

	// < aNode
	name:string;
	type:string; // < em,sub,em/sub
	prevType:string;
	ctx:string;
	feParent:string;
	tags:string;
	operations:ANOperation[];
	prev:ANode;
	log:string;
	
	// < check /payload
	payloadDElements:string|number[];
	payload:any[];

	// < check /payload
	dm_con:any;

	constructor() {
		// code...
	}
}

class ANodeLoger  {
	
	logFormat:string = 'A';
	lgr:ALoger = new ALoger();

	constructor(logFormat?:string) {
		//this.logFormat = logFormat ? logFormat : this.logFormat;
		this.setLoger();
	}

	setLoger() {
		this.lgr = new ALoger();
		this.lgr.setLogRules([
			//{ tags:'X', name:undefined, params: null, include: true },
		]);
	}

	logANode(signal:Signal) { // ok/
		switch (this.logFormat) {
			case "A":
				this.constructANodeLogFormatA(signal);
				break;
			case "B":
				this.constructANodeLogFormatB(signal);
				break;
			default:
				this.constructANodeLogFormatA(signal);
				break;
		}
	}

	// FORMAT A
	private constructANodeLogFormatA(signal:Signal) { // ok/
		
		let currentSignal = signal.stackSignals[signal.stackSignals.length-1];
		let prevSignal = signal.stackSignals[signal.stackSignals.length-2];

		// < log setting		
		if(currentSignal.aNode.type && currentSignal.aNode.type == 'em' || currentSignal.aNode.type &&  currentSignal.aNode.type == 'sub/em') {

			// ...
			var logSettingCurrentANode = this.setANodeLogFromANode(signal, currentSignal.aNode);
			this.lgr.log(logSettingCurrentANode.tags, 'logANode', '', [], null, () => {
				this.logForFormatA(signal, logSettingCurrentANode);
			});

			if(currentSignal.aNode.type == 'sub/em') {
				
				// ...
				var logSettingPrevANode = this.setANodeLogFromANode(signal, prevSignal.aNode);
				this.lgr.log(logSettingCurrentANode.tags, 'logPrevANode', '', [], null, () => {
					this.logForFormatA(signal, logSettingPrevANode);
				});
			}
		}
	}

	private setANodeLogFromANode(sig:Signal, aNode:ANode):IANodeLogerFormatA { // ok/
		
		let setting:IANodeLogerFormatA = {
			
			// < aNode
			aNode: aNode.name,
			anType: aNode.type,
			ctx: aNode.ctx,
			formANode: aNode.prev ? aNode.prev.name : 'NONE',
			formANFeParent: aNode.prev ? aNode.prev.feParent : 'NONE',
			tags: aNode.tags,
			// < check dm
			dm_con: aNode.dm_con
		};

		return setting;
	}

	private logForFormatA(signal:Signal, ls:IANodeLogerFormatA) { // ok/
		console.groupCollapsed('- %s > an[%s]/(%s:ctx/%s) <-from/(%s<-p/%s) - t/[%s]', 
			signal.amName, ls.anType, ls.aNode, ls.ctx ? ls.ctx : 'x', ls.formANode, ls.formANFeParent ? ls.formANFeParent : 'x', ls.tags ? ls.tags : 'x'
		);
			console.log('/ - check/payload:', signal.payload);
			console.log('/ - check/stack of /signals:', 
				signal.stackSignals.map((sig) => {
					return sig;
				})
			);
			console.log('/ - check/operations:' , signal.stackOperations);
			// console.log('/ - check/operations on /signal:') // < t/Todo:
			// console.groupCollapsed('sig.op/%s', ls.opName)
			// 	console.log('sig.op/->'); // < gen...
			// console.groupEnd();
			
			console.log('/ - check/dataModel:')
			console.log('dm/aNode-connections', ls.dm_con);
		console.groupEnd();
	}

	// FORMAT B
	private constructANodeLogFormatB(signal:Signal) { // < t/Todo:
		// ...
	}

	private logForFormatB(signal:Signal, ls:IANodeLogerFormatA) {
		console.groupCollapsed('- an[%s]/(%s:ctx/%s) <-from/(%s<-p/%s) - t/[%s] // < def/%s', 
			ls.anType, ls.aNode, ls.ctx ? ls.ctx : 'x', ls.formANode, ls.formANFeParent ? ls.formANFeParent : 'x', ls.tags ? ls.tags : 'x',
			signal.name
		);
			console.groupCollapsed('/ - check/payload:')
				console.dir(signal.payload);
			console.groupEnd();
			

			console.groupCollapsed('/ - check/operations on /signal:')
				signal.stackSignals.map((sig) => {
					console.log('- signal:', sig);
				});
			console.groupEnd();

			// console.log('/ - check/operations on /signal:') // < t/Todo:
			// console.groupCollapsed('sig.op/%s', ls.opName)
			// 	console.log('sig.op/->'); // < gen...
			// console.groupEnd();
			
			console.log('/ - check/dataModel:')
			console.log('dm/aNode-connections', ls.dm_con);
		console.groupEnd();
	}
}

export class Signal {
	
	name:string = 'signal';
	type:string;
	payload:any;
	subStreamEndType:string; // < next, NONE
	useCtx:string;
	stackSignals:Signal[] = [];
	aNodeLoger:ANodeLoger = new ANodeLoger();
	aNode:ANode;
	amName:string;
	stackOperations:Signal[] = [];
	
	constructor(type:string, payload?:any) {
		this.type = type;
		this.payload = payload;
	}

	/**/emit(type:string, payload?:any, amName?:string):Signal { // < OK/

		let nextSignal = new Signal(type, payload);
		nextSignal.name = payload._anode && payload._anode.def ? payload._anode.def : 'NO _anode OR _anode.def';

		if(this.stackSignals.length == 0) { // initial state
			nextSignal.stackSignals.push(nextSignal);
			nextSignal.amName = amName;
		}
		else { // ...
			let updatedStackSignals = nextSignal.stackSignals.concat(this.stackSignals);
			nextSignal.stackSignals = updatedStackSignals;
			nextSignal.stackSignals.push(nextSignal);
			nextSignal.amName = this.stackSignals[this.stackSignals.length - 1].amName;

			if(payload._anode.op) { // < t/Dcs
				this.stackOperations.push(nextSignal);
			}
		}

		// let prevSignal = this.stackSignals.length > 0 ? this.stackSignals[this.stackSignals.length-1] : null;
		
		// if(!prevSignal) { 
			 
		// }
		// else {
		// 	// /else-> initial signal
		// }
		
		// log aNode for current signal
		this.logANode(nextSignal);
		return nextSignal;
	}

	private logANode(nextSignal:Signal){
		
		let logSetting = nextSignal.payload._anode.log;
		
		if(logSetting) {
			if(logSetting != 'X' && logSetting != 'next') { // next>next

				// loguj odlezene logy signalů
				nextSignal.stackSignals
					.filter((sig:Signal) => {
						return sig.payload._anode.log == 'next';
					})
					.map((prevSigToLog:Signal) => {
						this._logANode(prevSigToLog);
					})

				// loguj akt. signal
				this._logANode(nextSignal);
			}
		}
		else {
			this._logANode(nextSignal);
		}
	}

	private _logANode(sig:Signal) {
		let signalForLog = this.setSignalForLog(sig); // < t/Dcs
		this.aNodeLoger.logANode(signalForLog);
	}

	use(type, payload, am:MActions) {
		switch (this.useCtx) { // < this.payload._subStreamEndType
			case "next":
				var emitedSig =  this.useNext(type, { ...payload, ...this.payload });
				emitedSig.payload = { ...emitedSig.payload, _subStreamEndType: 'next' };
				return emitedSig;
			
			case "toOutput":
				var emitedSig =  this.useToOutput(type, { ...payload, ...this.payload }, am);
				emitedSig.payload = { ...emitedSig.payload, _subStreamEndType: 'toOutput' };
				return emitedSig;
		}
	}

	useNext(type, payload):any {
		let emitedSig = this.emit(type,  { ...payload, _anode: { ...this.payload._anode, log:'X', def: AX.str.sub('sop/next/%s', [type]) } } );
		return emitedSig;
	}

	useToOutput(type, payload, am:MActions):any { // /a-> new,modify
		am.stackOutputActions.push({ type:type, payload: payload });
		let emitedSig = this.emit(type,  { ...payload, _subStreamEndType: 'toOutput', _anode: { ...this.payload._anode, log:'X', def: AX.str.sub('sop/toOutput/%s', [type]) } } );
		return emitedSig;
	}

	addToOutput(type, payload, am:MActions) { // /a-> modify,new
		am.stackOutputActions.push({ type:type, payload: payload });
		let emitedSig = this.emit(type,  { ...this.payload, _subStreamEndType: 'toOutput', _anode: { ...this.payload._anode, log:'X', def: AX.str.sub('sop/toOutput/%s', [type]) } } );
		return emitedSig;
	}

	useSe(type:string, payload:any, am:MActions) {  // n,D1,OK
		am.stackNextActions.push({ type:type, payload: payload });
		let emitedSig = this.emit(this.type, { ...payload, _anode: { ...this.payload._anode, log:'X', def: AX.str.sub('sop/toNextStack/%s', [type]) } } );
		return emitedSig;
	}

	// Operations types
	/**/op(def:string, toReturn?:{ v:any }, log?:string):any { // /OK // < operation
		let emitedSig = this.emit(this.type,  { ...this.payload, _anode: { ...this.payload._anode, log:log, def: def, op:true } } );
		return toReturn ? toReturn.v : emitedSig;
	}

	// /**/next(def:string, payload:any):Signal { // OK/ // < X
	// 	return this.emit(type, { ...this.payload, _anode: { ...this.payload._anode, def: def } });
	// }

	private /**/addToStack(prevSignal:Signal) {
		this.stackSignals.push(prevSignal);
	}

	private setSignalForLog(sig:Signal):Signal {
		sig.aNode = this.setSignalANDataForLog(sig);
		return sig;
	}

	private setSignalANDataForLog(sig:Signal):ANode {
		let aNodeCfg = sig.payload._anode;
		
		let aNode = this.parseAnodeStx(sig, aNodeCfg.def);
		aNode.dm_con = aNodeCfg.dm_con;
		aNode.tags = aNodeCfg.tags;
		aNode.log = aNodeCfg.log;
		return aNode;
	}

	// PARSE STXs
	private parseAnodeStx(sig:Signal, stxANode:string, ctx:string = 'default'):ANode { // R/
		// < ctx/ default, forPrev, 
		/* stx/Exampes:	
			- em,/sDispatch,:ctx/?,<-pf/MA.dispatch()
			- sub/em/,sDispatch,:ctx/?,<-pf/MA.dispatch()
			- em,/sAction>sActionA,:ctx/?,<-pf/MA.dispatch()

			< stx-paten/ 
				- sub(1)/em(1,2)/(3)
				---
				- 1/primaryType
				- 2/secundaryType
				- 3/name
				- 4/ctx
				- 5/ANFeParent
		*/
		let aNode = new ANode();

		let stxDefinitionBlocks = stxANode.split(',');
		stxDefinitionBlocks.map((defBlock, index) => {
			switch (index) {
				case 0: // < parse - primaryType,secundaryType // < L5
					if(defBlock.split('/')[1] != '') {
						if(ctx == 'default') { 
							aNode.type = defBlock.split('/')[1];
							let prevANode = this.setPrevANodeWithinParser(sig, defBlock.split('/')[0]);
							aNode.prev = prevANode;
						}
						else if(ctx == 'forPrev') {
							aNode.type = defBlock.split('/')[1];
							aNode.prev = null;
						}
					}
					else {
						aNode.type = defBlock.split('/')[0];
					}
					break;
				case 1: // < parse - name
					aNode.name = defBlock;
					break;
				case 2: // < parse - ctx
					aNode.ctx = defBlock.split('/')[1];
					break;
				case 3: // < parse - ANFeParent
					aNode.feParent = defBlock.split('/')[1];
					break;;
			}
		});

		return aNode;
	}

	private parseANodeStxPrimANDSecType() { // t/Todo:
	}

	private setPrevANodeWithinParser(sig:any, type:string):ANode { // OK/
		switch (type) {
			case "sub":
				var prevSig = sig.stackSignals[sig.stackSignals.length - 2];
				let prevANode = this.parseAnodeStx(sig, prevSig.payload._anode.def, 'forPrev')
				return prevANode;
			default:
				return null;
		}
	}
}

@Injectable()
export class MSignal extends Signal {

	constructor() {
		super('manager');
	}
}

export class AXStream {
	
	name:string;
	subStreamEndType:string;
	stream:any = new Subject<any>();
	am:MActions;
	
	constructor(name:string, am:MActions) {
		this.name = name;
		this.am = am;
	}

	public /**/operation(name:string, clbOperation:any) { // OK/ 
		//sig.anode('MA.opeartion()');
		//console.log('construct -> sop/cop>%s', name);
		this.stream = this.stream.pipe(
			map((sig:Signal) => {
				console.log('-> op/for %s', sig.type);
				let _sig = clbOperation(sig, sig.payload);
				//console.log('-> operation');
				return _sig.op(AX.str.sub('sop-cop/,%s,:ctx/x,<-/operation()', [name]), null, 'X'); // < 
			})
		)

		return this;
	}

	public /**/Xoperation(name:string, clbOperation:any) { 

		this.stream = this.stream.pipe(
			map((sig:Signal) => {
				return sig;
			})
		);

		return this;
	}

	public /**/asyncOperation(name:string, clbOperation:any) { // OK/ 
		//sig.anode('MA.opeartion()');
		//console.log('construct -> sop/cop>%s', name);
		this.stream = this.stream.pipe(
			mergeMap((sig:Signal) => {
				let result = clbOperation(sig, sig.payload);
				return result;
			}),
			map((sig:Signal) => {
				return sig;
			})
		);

		return this;
	}

	public XasyncOperation(name:string, clbOperation:any) {
		
		this.stream = this.stream.pipe(
			map((sig:Signal) => {
				return sig;
			})
		);

		return this;
	}

	// Stream operatos
	public setState(clbStateSetter:any) {
		this.stream = this.stream.pipe(
			map((sig:Signal) => {
				console.log('-> ss/for %s', sig.type);
				let emittedSig = clbStateSetter(sig, sig.payload);
				let opResult = sig.op(AX.str.sub('sop-ss/,x,:ctx/x,<-/setState()', []));
				return emittedSig;
			})
		);
		return this;
	}

	public /**/check(name:string, clbCheck:any, log?:string) { // /OK
		//sig.anode('MA.check()');
		//console.log('-> construct check/%s', name);
		this.stream = this.stream.pipe(
			filter((sig:Signal) => {
				let checkByClb:boolean = clbCheck(sig, sig.payload);
				let logSetting = log == 'IF' ? checkByClb ? 'OK' : 'X' : log;
				let opResult = sig.op(AX.str.sub('sop-cop/,%s,:ctx/x,<-/check()', [name]), { v:checkByClb }, logSetting );
				//console.log('-> check-filter: res/%s', opResult, sig.payload);
				return opResult;
			})
		)
		return this;
	}

	public /**/next(typeORlogic:string|any, clbPayloadSet?:any) { // /OK /<<
		//sig.anode('MA.next()');

		if((typeof typeORlogic) == 'string') {
			this.stream = this.stream.pipe(
				map((sig:Signal) => {
					let type = typeORlogic;
					let p = clbPayloadSet ? clbPayloadSet(sig.payload, sig) : sig.payload;
					//sig.subStreamEndType = 'next'; // < X
					p = { ...p, _subStreamEndType: 'next' };
					let emitedSig = sig.useNext(type, p);
					return emitedSig;
				})
			)
		}
		else {
			this.stream = this.stream.pipe(
				map((sig:Signal) => {
					let logic = typeORlogic;
					//sig.subStreamEndType = 'next'; // < X
					// sig.payload = { ...sig.payload, _subStreamEndType: 'next' }; // < X
					sig.useCtx = 'next';
					let emitedSig =  logic(sig, sig.payload, this);
					return emitedSig;
				})
			)
		}
		return this;
	}

	/**/toOutput(typeORlogic:string|any, clbPayloadSet?:any) { // R/
		if((typeof typeORlogic) == 'string') {
			this.stream = this.stream.pipe(
				map((sig:Signal) => {
					let type = typeORlogic;
					let p = clbPayloadSet ? clbPayloadSet(sig.payload, sig) : sig.payload;

					p = { ...p, _subStreamEndType: 'toOutput' };
					let emitedSig = sig.useToOutput(type, p, this.am);
					return emitedSig;
				})
			);
		}
		else {
			this.stream = this.stream.pipe(
				map((sig:Signal) => {
					let logic = typeORlogic;
					
					//sig.payload = { ...sig.payload, _subStreamEndType: 'toOutput' }; // < X
					sig.useCtx = 'toOutput';
					let emitedSig = logic(sig, sig.payload, this);
					return emitedSig;
				})
			)
		}
		return this;
	}

	/**/se(typeORlogic:string|any, clbPayloadSet?:any) { // /n,D1,OK
		if((typeof typeORlogic) == 'string') {
			this.stream = this.stream.pipe(
				map((sig:Signal) => {
					let type = typeORlogic;
					let p = clbPayloadSet ? clbPayloadSet(sig.payload, sig) : sig.payload;

					let emitedSig = sig.useSe(type, p, this.am);
					return emitedSig;
				})
			);
		}
		else {
			this.stream = this.stream.pipe(
				map((sig:Signal) => {
					let logic = typeORlogic;
					
					//sig.payload = { ...sig.payload, _subStreamEndType: 'toOutput' }; // < X
					sig.useCtx = 'toNextStack';
					let emitedSig = logic(sig, sig.payload, this);
					return emitedSig;
				})
			)
		}
		return this;
	}
}

class MAUtils  {
	
	constructor() {
		// code...
	}

	modifySig(sig:Signal, addData:any) {
		sig.payload = { ...sig.payload, ...addData };
		return sig;
	}

	modifyAction(action:any, addData:any) {
		return this.modifySig(action, addData);
	}
}

export interface ISignal {
	type:string, 
	payload?:any, 
	ctx?:string,
}

// TIMER
export class BTimer { // /zb.pa/0 <- (fa/impl-pa,[11/11pa,todo:0]) 
	
	
	// data
	name:string;
	time: number;
	timeDelta:number;
	limit: number;
	active: boolean;
	limitPassed: boolean;
	_reset: boolean;
	utils:Utils;
	
	private intervalID:any;
	private clbUpdate:Function;

	constructor(name:string, prms?:any) { // Ok/impl

		this.name = name;
		this.utils = new Utils();
		this.setTimerPrms(prms);
		//this.intervalID = setInterval(this.update.bind(this), 1000);
	}

	/**/delete() { // Ok/impl
		clearInterval(this.intervalID);
	}

	/**/start(limit:number = 0) { // Ok/impl
		this.intervalID = setInterval(() => {
			this.update.apply(this);
		}, 1000);
		this.active = true;
      
	    this.time = 0;
	    this.limit = limit;
	    this.limitPassed = false;
	}

	/**/stop() { // < pause // Ok/impl
		this.active = false;
	}

	/**/resume() { // Ok/impl
		this.active = true;
	}

	/**/reset(limit:number = 0) { // Ok/impl
		this.time = 0;
	    this.limit = 0;
	    this.active = false;
	}

	/**/update() { // Ok/impl

		if (this.active) {
          
          	if (this.time == this.limit && this.limit != null)
          	{
          	  this.limitPassed = true;
          	  this.reset();
          	  
          	}
          	
          	this.clbUpdate()
          	let prevTime = this.time;
          	this.time++;
          	this.timeDelta = this.setTimeDelta(prevTime, this.time);
        }
        else {
          	if (this.limitPassed){
            	this.limitPassed = false;
          	} 
        }
	}

	/**/private setTimeDelta(prevTime:number, currentTime:number):number { // Ok/impl
		let timeLimit = currentTime - prevTime;
		return timeLimit;
	}

	/**/setUpdate(clUpdate:Function) { // Ok/impl
		this.clbUpdate = clUpdate;
	}

	/**/private setTimerPrms(prms:any) { // Ok/impl
		this.utils.set(this, prms);
	}
}

class STAction { // < (0/4api)

	type:string;
	payload:any;
	timer:BTimer;
	id:string|number;
	stam:STActionsManager;
	state:string; // < paused,running <-from/start,resume,pause,reset

	constructor(type:string, payload:any, stam:STActionsManager) {
		this.type = type;	
		this.stam = stam;
		this.start();
		this.payload =  { ...payload, _timer:this.timer } ;
	}

	start() {
		this.state = 'running';
		this.createActionTimer();
	}

	pause() { // OK
		this.state = 'paused';
		this.timer.stop();
	}

	resume() { // OK
		this.state = 'running';
		this.timer.resume();
	}

	delete() { // OK/
		this.timer.delete();
	}

	// Actions - Timer
	/**/private createActionTimer() { // OK/ /7m
		this.timer = new BTimer('timer_' + this.type);
		this.timer.start(3600000);

		this.timer.setUpdate(() => {
			this.stam.clbSTActionEmiter(this);
		});
	}
}

@Injectable()
export class STActionsManager { // < (2/10api)

	stActions:STAction[] = [];
	am:MActions;
	clbSTActionEmiter:any;

	/**/constructor(am:MActions) {
		this.am = am;
	}

	/**/handleSTActions(inputAction:any):any { // /OK < User public input

		switch (inputAction.payload._setState) {
	    	case ":start": //case '':
	    		return this.startAction(inputAction);
	    	case ":stop":
	    		return this.stopAction(inputAction);
	    	case ":pause":
	    		return this.pauseAction(inputAction);
	    }
	}

	// Acctions
	/**/private startAction(action):any { // OK  < resume

		let stAction = this.getSTAction(action);

		if(!stAction) { // < st/stoped
			this.createSTAction(action);
		}
		else if(stAction && stAction.state == 'paused') { // < st/paused
			stAction.resume();
		}
		// < st/running - X
	}

	/**/private stopAction(action) { // < OK/ /15m // < odstraneni akce
		let stActinon = this.getSTAction(action);

		if(stActinon) {
			if(stActinon.state == 'paused' || stActinon.state == 'running') {
				return this.deleteSTAction(stActinon);
			}
		}
		// < st/stoped - X
	}

	/**/private pauseAction(action) { // < OK/ /5m
		let stActinon = this.getSTAction(action);

		if(!stActinon || stActinon && stActinon.state == 'paused') { // < st/stoped,paused
			return null;
		}
		else { // < st/running
			stActinon.pause();
		}
	}

	stopAll() {
		this.stActions.forEach((stAction:STAction) => {
			stAction.pause();
		})
	}

	// ...
	createSTAction(action:any) { // OK/13m

		let stAction = new STAction(action.type, action.payload, this);
		stAction.id = action.payload._id ? action.payload._id : this.stActions.length;
		this.stActions.push(stAction);
	}

	deleteSTAction(action:any) { // OK/5m

		let stActionToDelete = action;
		stActionToDelete.delete();
		this.stActions.splice(this.stActions.indexOf(stActionToDelete), 1);
	}

	getSTAction(action:any):STAction { // N/OK
		return this.stActions.find((stAction:STAction) => {
			return stAction.id == action.payload._id;
		});
	}

	// ...
	setSTActions(inputAction:any, clbSTActionEmiter:any) { // /OK
		this.handleSTActions(inputAction);
		this.clbSTActionEmiter = clbSTActionEmiter;
	}
}

// A-MODULE
@Injectable()
export class MActions {
	
	name:string = 'Ac';
	sig:Signal;
	al:ALoger;
	utils:MAUtils = new MAUtils();
	stActionsManager:STActionsManager;

	// sOutputActions:Subject<any> = new Subject<any>();
	sActionsAGR:Subject<any> = new Subject<any>();
	sDispatcher:Subject<any> = new Subject<any>();
	
	stackSAction:AXStream[] = [];
	stackOutputActions:any[] = [];
	stackToDispatch:ISignal[] = [];
	stackNextActions:ISignal[] = [];

	sOutputActions:Subject<any> = new Subject<any>();
	// // < chaining helpers
	currentStream:any;

	constructor(sig:MSignal, al:ALoger) { // < public sig:Signal
		this.sig = sig;
		this.al = al;
		this.stActionsManager = new STActionsManager(this);
	}
	public /**/connectOneToInput(mActions:MActions, clbConnect:any) {
		mActions.sOutputActions
			.pipe(
				map((ouActions) => {
					return ouActions.filter((oua:ISignal) => {
						return oua.type != null;
					});
				}),
			)
			.subscribe((ouActions) => {
				this.al.log('AX3,Te,fu5', '', 'input actions: ', [], { iAction: ouActions });
				clbConnect(ouActions);
				//console.log('am/%s - reset output actions: ', this.name, this.stackOutputActions); // < t/Dcs
				//this.dispatch(ouAction.type, ouAction.payload, 'fromOneToInput' );
			});
	}
	public /**/connectManyToInput() { // < t/Todo:
		// ...
	}
	public /**/dispatch(type, payload?:any, ctx?:string) { // /OK /1h+
		//sig.anode('MA.dispatch()'); // < t/Dcs
		console.groupCollapsed(type);
		let _ctx = ctx ? ctx : 'fromOustside';
		//this.sDispatch.next(this.sig.emit(type, { _anode: { def:AX.str('em/sDispatch:ctx/?<-MA.dispatch()'), dm_con:   }, [_ctx]) }));
		this.sDispatcher.next(this.sig.emit(type,
			{ 
				...payload,
				_subStreamEndType: undefined,
				_anode: { log:'OK', def: AX.str.sub('em/,sDispatch,:ctx/x,<-/MA.dispatch()', []), dm_con:this.sDispatcher } 
			}, 
			this.name
		));
		console.groupEnd();
	}

	/**/dispatchMany(sgs:ISignal[]) {
		
		this.stackToDispatch = sgs.map((sig) => sig);

		let firstSig = this.stackToDispatch[0];
		this.dispatch(firstSig.type, firstSig.payload, 'stack:first');
	}

	/**/dispatchNext(sig:Signal) {
		//this.sDispatch.next(this.sig.emit(sig.type, sig.paylaod, { _anode: { def:AX.str('em/sDispatch:ctx/next<-MA.dispatch()'),  },[]) }));
		this.sDispatcher.next(this.sig.emit(sig.type,
			{ 
				...sig.payload,
				_subStreamEndType: undefined,
				_anode: { log:'X', def: AX.str.sub('em/,sDispatch,:ctx/next,<-/MA.dispatch()', []), dm_con:this.sDispatcher } 
			},
			this.name
		));
	}

	dispatchNextInQuee(stackToDispatch:any[]):boolean {
		stackToDispatch.splice(0, 1);

		if(stackToDispatch.length > 0) {
			let nextInQuee = stackToDispatch[0];
			this.dispatch(nextInQuee.type, nextInQuee.payload, 'stack:next');
			return false;
		}
		else {
			return true;
		}
	}

	dispatchSideEffects(stackToDispatch:any[]):boolean {
		
		if(stackToDispatch.length > 0) {
			let nextInQuee = stackToDispatch[0];
			this.dispatch(nextInQuee.type, nextInQuee.payload, 'stack:next');
			stackToDispatch.splice(0, 1);
			if(stackToDispatch.length > 0) {
				return false;
			}
			else {
				return true;
			}	
		}
		else {
			return true;
		}
	}

	// Constructors
	public /**/action(type:string|string[], payload?:any, log?:string) { // /OK /1h+
		// sig.anode('MA.action()');
		//console.log('-> constrcut actions: a/%s', type);
		let sAction:any = new AXStream(AX.str.sub('a/%s', [type]), this);

		// < Subscribe, Emit
		this.sDispatcher.subscribe((sig) => { // < gen...
			// let action = new Action(type, payloadSet); // < tDcs
			if(type instanceof Array) {
				let index = type.indexOf(sig.type);
				if(index >= 0) {
					let es = sig.emit(sig.type, { ...sig.payload, _anode: { log:log, def:AX.str.sub('sub/em/,sAction>%s,:ctx/x,<-/x',[sig.type]), dm_con:sAction  } });
					sAction.stream.next(es);
				}
			}
			else { 
				if(sig.type == type || type == 'ANY') {
					let es = sig.emit(sig.type, { ...sig.payload, _anode: { log:log, def:AX.str.sub('sub/em/,sAction>%s,:ctx/x,<-/x',[sig.type]), dm_con:sAction  } });
					sAction.stream.next(es);
				}
			}
		});

		// < Opration
		// sAction.stream = sAction.stream.pipe(
		// 	filter((sig:Signal) => {
		// 		// sig.op('op/filter')
		// 		return sig.type == type || type == 'ANY' ? sig.op('fil/filter-succes', { v:true }) : sig.op('fil/filter-fail', { v:false });
		// 	}),
		// )

		this.stackSAction.push(sAction);
		return sAction;	
	}
	public /**/connectToActions() {
		//console.log('-> connect to /actions')
		let createdSActionStreams:Subject<any>[] = this.stackSAction.map((sAction:AXStream) => {
			return sAction.stream
		})

		this.sActionsAGR.pipe(
			merge(...createdSActionStreams),
		)
		.subscribe((sig) => {
			//sig.node('.connectToActions()'); // < t/Dcs

			let sendToOutput:boolean = false;
			
			while(!sendToOutput) {
				sendToOutput = this.manageActions(sig); // < t/Dcs
				console.log('end manage action cycle - type/%s, ctx/%s, output/%s', sig.type, sig.payload._subStreamEndType, sendToOutput);
			}
			
			if(sendToOutput) {
				this.pushToOutput();
			}
		});
	}
	/**/pushToOutput() { // /R /<<
		
		// from(this.stackOutputActions) // <
		// 	.subscribe((ouAction) => {
		// 		this.sOutputActions.next(ouAction);
		// 	})

		let ouActions = this.stackOutputActions.map(oua => oua);

		if(ouActions && ouActions.length > 0) {
			this.al.log('AX3,Te,fu1,fu2,t1,CP,Ou', 'output actions', '-- akce->output:', [], { ou: this.stackOutputActions});
			this.stackOutputActions = [];
			this.sOutputActions.next(ouActions);
		}
	}
	/**/manageActions(sig:Signal):boolean { // /OK 
		//sig.node('manageActions') // < t/Todo:

		if(sig.payload._subStreamEndType == 'next') {
			this.dispatchNext(sig);
			
			if(this.stackNextActions.length > 0) {
				sig.payload._subStreamEndType = 'sideEffect';
				return false;
			}
			else {
				return true;
			}
		}
		else if(sig.payload._subStreamEndType == 'sideEffect') {
			let endQuee = this.dispatchSideEffects(this.stackNextActions);
			return true;
		}
		else if(sig.payload._subStreamEndType == 'toOutput') {
			let endQuee = this.dispatchNextInQuee(this.stackToDispatch);
			return endQuee;
		}
		else {
			console.log('NO output for /interaction');
			return true;
		}
	}
	/**/listenTo(type:string, clbListener:any) {
		this.sOutputActions.subscribe((outputs:any) => {
				let matchedOutput = outputs.find((output:ISignal) => {
					output.type == type;
				});

				if(matchedOutput) {
					clbListener(matchedOutput);
				}
				else {
					//console.log('-> no matched outputs')
				}
			})
	}

	// listenToOuput() { // < X
	// 	this.sOutputActions
	// }

	public /**/actionToOutput(type:string, payload?:any) {
		//sig.anode('MA.actionToOutput()'); // < X
		this.action(type, payload)
			.toOutput(type, (p) => { return p });
	}
	// ...
	private /**/emit() { // < t/Todo:
	}
	private /**/subscribe() { // < t/Todo:
	}
}

// SECONDARY /A-MODULES
@Injectable()
export class MInteractions extends MActions {
	
	name:string = 'In';

	constructor(sig:MSignal, al:ALoger) {
		super(sig, al);
	}

	interaction(type:string, payloadSet:any) { // /R

		// this.sAction = this.sAction.filter((sig) => {
		// 	return ;
		// });
	}
}

@Injectable()
export class MStates extends MActions {
	
	name:string = 'Re';

	constructor(sig:MSignal, public dm:StateManager, im:MInteractions, al:ALoger, ) {
		super(sig, al);
	}

	/**/reducer(type:string|string[]):AXStream { // /
		
		return this.action(type);
		// if(type instanceof Array) { // < var/1
		// 	let types = type;
		// 	return this.action('ANY').check('check types group', (action:Signal) => {
		// 		let matchedAction = types.find((aType) => {
		// 			return action.type == aType;
		// 		});
		// 		let check = matchedAction == undefined ? false : true;
		// 		console.log('-> check/%s', check);
		// 		return check;
		// 	});
		// }
		// else {
		// 	return this.action(type);
		// }

		// this.reducer(type); // < var/2
	}

	private reducer_streamImpl(type:string|string[]) {
		// this.action('ANY')
		// .operation('check by types', (p,ac,acs) => {
		// 	if(type instanceof Array) {
		// 		acs.check((action) => {
		// 			let matchedAction = types.find((aType) => {
		// 				return action.type == aType;
		// 			})
		// 			return matchedAction != undefined ? true : false;
		// 		});
		// 	}
		// 	else {
		// 		acs.check((action) => { return action.type == type ? true : false })
		// 	}
		// })
	}
}

@Injectable()
export class MSelectors extends MActions {
	
	name:string = 'Se';

	constructor(sig:MSignal, private dm:StateManager, al:ALoger, private sm:MStates) {
		//this.connectOneToInput(sm.outputStates)
		super(sig, al);
	}

	// /**/connectToOneToInput(outputStates:Observable<any>) { // < X
	// 	outputStates.subscribe((ouDNode:any) => {
	// 		this.dispatch('[Select] select', { dNode:ouDNode })
	// 	})
	// }

	/**/selector(name:string, clbSelectOprations:any, seName:string) {
		this.action('[Select] select', {}, 'next').check('select by type', (action:Signal) => { // < { dNode:DNode }
				let Type = this.dm.utils.getTypeFor(name);
				return action.payload.dNode instanceof Type;
			}, 'IF')
			.operation('selection operations', (action:Signal) => {
				let currentSelection = action.payload.dNode;

				// < op/handle operations
				let operators:any[] = clbSelectOprations(this);

				operators.map((clbSelectOperation:any) => {
					if(currentSelection) {
						currentSelection = clbSelectOperation(currentSelection);
					}
				})
				return this.utils.modifyAction(action, { selection: currentSelection });
			})
			.toOutput('[Selection] selection', (p) => { return { name:seName, selection: p.selection } });
	}

	/**/listenToSel(name:string, clbListener:any) {

		//console.log('-> construct - listener to selection n/%s', name);

		this.sOutputActions.subscribe((outputs:any) => {
				let matchedOutput = outputs.find((output:ISignal) => {
					return output.payload.name == name;
				});

				if(matchedOutput) {
					clbListener(matchedOutput.payload.selection);
				}
				else {
					//console.log('-> no matched ou/selection for se/%s', name)
				}
			})
	}

	public /**/operator(clbSel:any) {
		return clbSel;
	}
}

@Injectable()
export class MUIEvents extends MActions {
	
	name:string = 'UIEv';

	constructor(sig:MSignal, al:ALoger) {
		super(sig, al);
	}

	uiEvent(type:string, payload?:any):AXStream {
		return this.action(type, payload);
	}
}

// DATA MODEL
export class AXNode  {
	
	name:string;
	id:number|string;
	parent:AXNode;
	childsToOutput:AXNode[] = [];
	childs:AXNode[] = [];
	utils:Utils = new Utils();

	constructor(cfg:any) {
		
		this.childs = this.setChilds(cfg);
		this.childsToOutput = this.setChildsToOutput();

		this.utils.set(this, cfg);
	}

	setChilds(cfg:any):AXNode[] {
		let childs = this.getChildNodes(cfg);
		return childs;
	}

	setChildsToOutput():AXNode[] {
		// < ctx/1,2,3,
		if(this.childs.length > 0) {
			
			let childsToOutputDeep:any[] = this.childs.map((child) => {
				if(child.childsToOutput) {
					return child.childsToOutput;
				}
				else {
					return child;
				}
			});
			return childsToOutputDeep;
		}
		else {
			return [];
		}

		// < X
		// this.childs = this.getChildNodes(cfg); 
		// //this.childsToOutput = this.childs.map(ch => ch);

		// let childsWithChilds:any[] = this.childs
		// 	.map((child:AXNode) => {
				
		// 		child.parent = this;
				
		// 		if(child.childs.length > 0) {
		// 			return [child, ...child.childs];
		// 		}
		// 		else {
		// 			return child;
		// 		}
		// 	});

		// this.childsToOutput = childsWithChilds.flat();

		// // if(childsWithChilds.length > 0) {
		// // 	return this.childsToOutput =  this.childsToOutput.map((child) => {
		// // 		let matchedChild = ;
		// // 		return ;
		// // 	})	
		// // }
		// // else {
		// // 	return this.childsToOutput;
		// // }
	}

	getChildNodes(cfg:any):AXNode[] {

		let childs:AXNode[] = Object.keys(cfg)
			.filter((key) => {
				return cfg[key] instanceof AXNode;
			})
			.map((key) => {
				return cfg[key];
			})

		childs = childs ? childs : [];
		return childs;
	}
}

export class DataModel2 extends AXNode  {
	
	dNodes:AXNode[] = [];

	constructor(cfg:any) {
		super(cfg);
		this.dNodes = this.childsToOutput;
	}

	select(type:string, Type:any, id?:number|string) {
		switch (type) {
			case "one":
				return this.selectOne(Type);
			
			case "byID":
				return this.selectByID(Type, id);
		}
	}

	private selectOne(Type:any) {
		let matched = this.dNodes.find((dNode) => {
				return dNode instanceof Type;
			});
	}

	private selectByID(Type:any, id?:number|string) {
		let matched = this.dNodes.filter((dNode) => {
				return dNode instanceof Type;
			})
			.find((dNode) => {
				return dNode.id == id;
			})
	}
}

// CONSTRUCTION AREAS
@Injectable()
export class Managers {

	constructor(
		public am:MActions,
		public im:MInteractions,
		public sm:MStates,
		public ui:MUIEvents,
		public se:MSelectors,
		public al:ALoger,
	) {
		// code...
	}
}

export class Category {
	
	public am:MActions;
	public im:MInteractions;
	public sm:MStates;
	public ui:MUIEvents;
	public se:MSelectors;
	public al:ALoger;
	public m:Managers;

	constructor(m:Managers) {
		
		if(m) {
			this.m = m;
			this.am = m.am;
			this.im = m.im;
			this.sm = m.sm;
			this.ui = m.ui;
			this.se = m.se;
			this.al = m.al;
		}
	}
}