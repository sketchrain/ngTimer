import { Injectable } from '@angular/core';
import { AXUtils } from '../core/fl-core-utils'; // < t/Dcs

@Injectable()
export class ALoger { // < /30m (9/9api) /15m
	
	rules:ALRule[] = [];

	// chaining helpers
	actionToLog:any;
	toLog:Log;

	constructor() { // < R

		this.setLogRules([
			// < L
			// AX3 - Tests
				{ tags:'AX3,Te,Bo', name:undefined, params: null, include: true },
				{ tags:'AX3,Te,fu1', name:undefined, params: null, include: true },
				{ tags:'AX3,Te,fu2', name:undefined, params: null, include: true },
				{ tags:'AX3,Te,fu3', name:undefined, params: null, include: true },
				{ tags:'AX3,Te,fu4', name:undefined, params: null, include: true },
				{ tags:'AX3,Te,fu5', name:undefined, params: null, include: true },
				{ tags:'AX3,Te,fu6', name:undefined, params: null, include: true },
				{ tags:'AX3,Te,fu7', name:undefined, params: null, include: true },
			// < AX3 App
				{ tags:'AX3,App,Bo', name:undefined, params: null, include: true },
				{ tags:'App,In,Sv', name:undefined, params: null, include: true },
			// NEZARAZENE
				// < A/Angular init
					//{ tags:'Ang,lf,Init', name:undefined, params: null, include: true },

				// AX3 - Tests - fu

				// -------------------------------------------------------------
				// < A/...
				//{ tags:'X', name:undefined, params: null, include: true },
				
				

				// < A/AX, Bootstrap
				//{ tags:'AX,Bo', name:undefined, params: null, include: true },

				// < B/Testy Info 
				//{ tags:'AX,Te,Info', name:undefined, params: null, include: true },
				
				// < A/AX,Flow
				//{ tags:'AX,Flow,Di,fDis', name:undefined, params: null, include: true },
				//{ tags:'AX,Flow,Di', name:undefined, params: null, include: true },
				//{ tags:'AX,Flow,In,Str', name:undefined, params: null, include: true },
				//{ tags:'AX,Flow,In', name:undefined, params: null, include: true },
				//{ tags:'AX,Flow,Re', name:undefined, params: null, include: true },
				//{ tags:'AX,Flow,Se', name:undefined, params: null, include: true },
				
				// < A/App,Flow
				//{ tags:'AX,Flow,Di', name:undefined, params: null, include: true },
				//{ tags:'App,Re', name:undefined, params: null, include: true },
				//{ tags:'App,Se', name:undefined, params: null, include: true },
				//{ tags:'App,Re', name:undefined, params: null, include: true },
				//{ tags:'App,Se', name:undefined, params: null, include: true },
				//{ tags:'App,Se,Sub', name:undefined, params: null, include: true },
				// <
				// { tags:'', name:'', params: { widget:'A',  element: 'B' } },
				// { tags:'', name:'', params: { widget:'A',  element: 'B' } },
		]);
	}

	// SETTING
	setLogRules(logSettings:ILRule[]) { // OK /5m
		this.rules = logSettings.map((setting) => {
			return new ALRule(setting);
		});
	}

	// PUBLIC API
	log(tags:string, name:string, message:string, messageData:any[], payload?:any, clbLog?:any) { // Z,/OK
		
		if(this.rules.length > 0) {
			if(tags) {
				this.toLog = this.checkRules(new Log(name, message, messageData, payload, tags, clbLog));
			}
			else {
				this.toLog = null;
			}	
		}
		else {
			this.toLog = new Log(name, message,  messageData, payload, tags, clbLog);
		}

		if(this.toLog) {
			this.toLog.log()
		}
		
		return this; 
	}

	action(type:string, payload?:any, ctx?:string) { // Z/OK 

		// if(this.rules.length > 0) {
		// 	this.actionToLog = this.checkRules(type, payload);
		// }
		// else {
		// 	this.actionToLog = new ALAction({ type:type, payload:payload});
		// }
		return this;
	}

	actionCheck(message:string, type:string, payload?:any, stateChange?:{ prev:any, current:any }) {
		this.actionToLog = new ALAction({message: message , type:type, payload:payload, stateChange: stateChange});
		this.actionToLog.checkLog();
	}

	operation(type:string, payload?:any, ctx?:string) { // /OK /15m

		this.action(type, payload);
		return this;
	}

	note(note) { // /OK
		this.actionToLog.note = note;
		this.actionToLog.log()
	}

	// CHECK BY RULES
	private checkRules(log:Log):Log { // Z,OK /13m

		let checkedRulesForLog = this.rules.map((rule) => {
			return this.checkRulesForLog(log, rule);
		});

		// let faildRule = checkedRulesForLog.find((checkRule) => { return checkRule == false });
		// return faildRule == undefined ? log : null;

		let faildRule = checkedRulesForLog.find((checkRule) => { return checkRule == true });
		return faildRule == undefined ? null : log;
	}

	private checkParams(payload:any, params:any):boolean { // /OK /40m
		// zp/vrati true pokud aleson jedny definove params rule maji komplet stejnou hodnotu se ztotoznenymi params payload akce
		let payloadKeys = Object.keys(payload);
		let paramsKeys = Object.keys(params);

		let matchedKeysResults = payload
			.filter((payloadKey) => {
				let matchedKey = paramsKeys.find((paramsKey) => {
					return payloadKey == paramsKey;
				})

				return matchedKey ? true : false;
			})
			.map((matchedKey) => {
				return payloadKeys[matchedKey] == paramsKeys[matchedKey] ? true : false;	
			})

		return matchedKeysResults.find((result) => {
			return result == false;
		});
	}

	private checkName(logName:string, ruleName:string) { // Z/OK /5m
		// zp/vrati true pokud jmeno akce odpovida aleson jednomu jmenu z rules
		return (logName == ruleName) ? true : false;
	}

	public checkRulesForLog(log:Log, rule:ALRule):boolean { // Z/OK // < private

		if(rule.tags) {
			if( rule.include && this.checkIncludedTagsForLog(log, rule) ||
				rule.exclude && this.checkExcludedTagsForLog(log, rule)) {
				if(rule.name) {
					if(this.checkNameForLog(log, rule)) {
						return true;
					}
					else {
						return false;
					}
				}
				else if(rule.params) {
					if(this.checkParamsForLog(log, rule)) {
						return true;
					}
					else {
						return false;
					}
				}
				else {
					return true;
				}
			}
			else {
				return false;
			}
		}
		else {
			return true;
		}
	}

	private checkIncludedTagsForLog(log:Log, rule:ALRule):boolean { // < N

		if(this.checkIncludedTags(log.tags, rule.tags)) {
			if(rule.name) {
				if(this.checkNameForLog(log, rule)) {
					return true;
				}
				else {
					return false;
				}
			}
			else if(rule.params) {
				if(this.checkParamsForLog(log, rule)) {
					return true;
				}
				else {
					return false;
				}
			}
			else {
				return true;
			}
		}
		else {
			return false;
		}
	}

	public  checkExcludedTagsForLog(log:Log, rule:ALRule):boolean { // < N // < private 

		if(this.checkIncludedTags(log.tags, rule.tags)) { // < obshauje zakazane tagy
			return false;
		}
		else { // neobsahuje
			if(rule.name) {
				if(this.checkNameForLog(log, rule)) {
					return true;
				}
				else {
					return false;
				}
			}
			else if(rule.params) {
				if(this.checkParamsForLog(log, rule)) {
					return true;
				}
				else {
					return false;
				}
			}
			else {
				return true;
			}
		}
	}

	private checkNameForLog(log:Log, rule:ALRule):boolean { // < N
		if(this.checkName(log.name, rule.name)) {
			if(rule.params) {
				if(this.checkParamsForLog(log, rule)) {
					return true;
				}
				else {
					return false;
				}
			}
			else {
				return true;
			}
		}
		else {
			return false;
		}
	}

	private checkParamsForLog(log:Log, rule:ALRule):boolean { // < N
		if(this.checkParams(log.payload, rule.params)) {
			if(rule.name) {
				if(this.checkNameForLog(log, rule)) {
					return true;
				}
				else {
					return false;
				}
			}
			else {
				return true;
			}
		}
		else {
			return false;
		}
	}

	// ...

	private checkIncludedTags(logTags:string, ruleTags:string):boolean { // < N,OK/
		
		let ruleTagsArr = this.parseTagsCfgToArray(ruleTags);
		let logTagsArr = this.parseTagsCfgToArray(logTags);

		let macthedRuleTags = ruleTagsArr.filter((ruleTag) => {
				return logTagsArr.find((logTag) => {
					return ruleTag == logTag ? true : false;
				})
			});
		
		let check = ruleTagsArr.map((ruleTag) => {
				let _check = macthedRuleTags.find((mrTag) => {
					return mrTag == ruleTag ? true : false;
				});
				return _check ? true : false;
			})
			.find((check) => {
				return check == false;
			}) 

		// return macthedRuleTags === ruleTagsArr ? true : false;
		return check == undefined ? true : false;
	}

	private checkExcludedTags(logTags:string, ruleTags:string):boolean { // < N,OK/
		
		let ruleTagsArr = this.parseTagsCfgToArray(ruleTags);
		let logTagsArr = this.parseTagsCfgToArray(logTags);

		let macthedRuleTags = ruleTagsArr.filter((ruleTag) => {
				return logTagsArr.find((logTag) => {// < matchedTags, onToMany
					return ruleTag == logTag ? true : false;
				})
			});
		
		let check = ruleTagsArr.map((ruleTag) => {
				let _check = macthedRuleTags.find((mrTag) => {
					return mrTag == ruleTag ? true : false;
				});
				return _check ? true : false;
			})
			.find((check) => {
				return check == false;
			}) 

		// return macthedRuleTags === ruleTagsArr ? true : false;
		return check == undefined ? true : false;
	}

	private parseTagsCfgToArray(tags:string) { // < N,OK/
		let tagsArr = tags.split(',');
		return tagsArr;
	}

	private checkMatchedTags(actionType:string, tags:string):boolean { // OK /30m
		// zp/vrati true pokud tagy logovane akce se komplet shoduji s ruleTagy
		let actionTags:string[] = actionType.split(']')[0].split('[')[1].split('')
			
		let matchedTags:boolean[] = tags.split(' ').map((tag) => {
			let matchedTag = actionTags.find((aTag) => {
				return aTag == tag;
			});

			return matchedTag ? true : false;
		});

		let checkMatched = matchedTags.find((macthedTag) => {
			return macthedTag == false;
		});

		return checkMatched;
	}
}

interface ILRule {
	tags:string, 
	name?:string, 
	params?:any, 
	include?:boolean, 
	exclude?:boolean
}

export class ALRule { // /OK  
	
	tags:string;
	name:string;
	params:any;
	include:boolean;
	exclude:boolean;

	constructor(logSetting:ILRule) {
		this.tags = logSetting.tags;
		this.name = logSetting.name;
		this.params = logSetting.params;
		this.include = logSetting.include ? logSetting.include : true;
		this.exclude = logSetting.exclude ? logSetting.exclude : false;
	}
}

export class Log {
	
	name:string;
	message:string;
	messageData:any[];
	payload:any;
	tags:string;
	clbLog:any;

	constructor(name:string, message:string, messageData:any[], payload?:any, tags?:string, clbLog?:any) {
		this.name = name;
		this.message = message;
		this.messageData = messageData;
		this.payload = payload;
		this.tags = tags;
		this.clbLog = clbLog;
	}

	log() { // N/OK

		if(this.clbLog) {
			this.logClb();
		}
		else {
			this.logMessage();
		}
	}

	private logClb() {
		this.clbLog();
	}

	private logMessage() {
		let messageToLog = AXUtils.str.sub(this.message, this.messageData);
		console.groupCollapsed(messageToLog + ' - t/[%s]', this.tags);
			if(this.payload){ this.logData(this.payload); } else { console.log('NONE data'); }
		console.groupEnd();
	}

	private logData(payload:any) { // N/OK /30m

		let payloadKeys = Object.keys(payload);

		payloadKeys.forEach((payloadKey) => {
			console.log(payloadKey, payload[payloadKey]);
			//console.log('static - ' + payloadKey, JSON.stringify(payload[payloadKey]));
		});
	}
}

class ALAction { //  /OK /(2/2api) /30m
	
	type:string;
	payload:any;
	note:string;
	message:string;
	stateChange: {
		prev:any,
		current:any,
	}

	constructor(cfg:any) {

		if(cfg) {
			this.type = cfg.type;
			this.payload = cfg.payload;
			this.note = cfg.note;
			this.message = cfg.message;
			this.stateChange = cfg.stateChange;
		}
	}

	// LOG
	log() { // /OK /5m
		// console.groupCollapsed(this.type + ' ' + this.note);
		// 	this.logData(this.payload);
		// console.groupEnd();
	}

	checkLog() {
		if(this.type == '[Nav] presmerovani (app/auth)') {
			debugger;
		}

		// console.groupCollapsed(this.message + ' ' + this.type);
		// 	if(this.payload) { this.logData(this.payload); }
		// 	if(this.stateChange) { this.logStates(this.stateChange) }
		// console.groupEnd();
	}

	private logData(payload:any) { // /OK /30m

		let payloadKeys = Object.keys(payload);

		// payloadKeys.forEach((payloadKey) => {
		// 	console.log(payloadKey, payload[payloadKey]);
		// 	//console.log('static - ' + payloadKey, JSON.stringify(payload[payloadKey]));
		// });
	}

	private logStates(stateChange:{ prev:any, current:any }) {
		//console.log('state-current:', stateChange.current);
		//console.log('state-prev:', stateChange.prev);
	}
}