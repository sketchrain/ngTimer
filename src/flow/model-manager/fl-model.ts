// angular
import  { Injectable } from '@angular/core';
// rxjs
import { Subject } from 'rxjs';
import {
  filter,
  merge,
  map
} from 'rxjs/operators';
// flow
import  { ALoger } from '../loger/loger';

/* Struktrua

	- Objects
	- Managers
*/

class AXProvider { // T(0/0)

	dNode:DNode;

	constructor(dNode:DNode) {
		this.dNode = dNode;	
	}
}

class TypeProvider extends AXProvider  { // T(0/0)
	
	conID:'con/inst';
	stream$:Subject<any> = new Subject<any>();
	Type:any;

	constructor(dNode:DNode) {
		super(dNode);
		this.Type = dNode.Type;
	}
}

interface IConnection { // T(0/0)
	dir:string;
	id:string|number;
	sub:any;
	target?:DNode;
	source?:DNode;
	stream?: Subject<any>;
	dNode: DNode;
}

class DEvent { // T(0/0)
	
	type:string;
	payload:any;
	conID:any;
	target:DNode;
	source:DNode;
	utils:Utils;

	constructor(cfg:{type:string, target?:DNode, conID?:string, payload?:any, source?:DNode}) {

		this.utils = new Utils();
		this.utils.set(this, cfg);
	}
}

// // DATA MODEL
export class DNode { // t/OK T(14/16)
	
	genIDs:number = 0;

	Type:any;
	id:string|number;
	nodes:DNode[] = [];
	data:any;
	connections$:Subject<any> = new Subject<any>();
	connections:IConnection[] = [];
	utils:Utils;
	dNodeType:string;

	// con - providers,streams
	typeProvider:TypeProvider;

	constructor(cfg?:{ Type:any, name?:string, data?:any, dNodeType:string }) {

		this.utils = new Utils();

		if(cfg) {
			this.Type = cfg.Type;
			this.dNodeType = cfg.dNodeType;
			this.typeProvider = new TypeProvider(this);
			this.utils.set(this, cfg.data);
		}
	}

	/* Struktura:
		- factories, destructors
		- Connections 
		- Connections - modifiers
		- Connections - providers 
		- Connections - selectors
		- Events handleres // < network events
		- Utils, Helpers
		- Nezarazene
	*/

	// X/createType /D1,OK

	// FACTORIES, DESTRUCTORS (3)
	/*T,x*/createDNode(Type:any, dNodeType:string, constructionCfg?:any):DNode { // OK /15m/18m

		// ...
		let dNode = new Type({Type: Type, data: constructionCfg, dNodeType:dNodeType });
		//dNode.id = dNode.id == undefined ? this.generateID() : dNode.id;
		if(dNode.id == undefined) {
			dNode.id = this.generateID();
		}

		let dNodeExist = this.checkDNodeExist(dNode);
		
		// Add DNode to structure
		if(!dNodeExist) {
			this.nodes.push(dNode);
			return dNode;
		}
		else {
			if(dNode.dNodeType == 'st-inst' || dNode.dNodeType == 'type') {
				return this.selectDNodeByType(Type, dNode.dNodeType) as DNode; // cm/selectType
			}
			else {
				return this.selectDNodeByID(Type, dNode.id) as DNode;
			}
		}
		
		// cm/crateType // < X
		// let collection = new TCollection(Type, constructionCfg);
		// let collectionExist = this.checkTypeExist(collection);

		// if(!collectionExist) {
		// 	this.nodes.push(collection);
		// 	return collection;
		// }
		// else {
		// 	return this.slectType(Type); // cm/selectType
		// }

		// return null;	
	}

	/*Z,T,x*/selectDNodeByType(Type:any, dNType:string = 'st-inst'):DNode|DNode[] { // OK
		let matchedDNode:DNode = this.nodes.find((node) => { // < cm/slect[DNode]
				switch (dNType) {
					case "st-inst": case "gen-inst":
						return node.dNodeType == 'st-inst' && node.Type == Type || node.dNodeType == 'gen-inst' && node.Type == Type;
					case "type":
						return node.dNodeType == 'type' && node.Type == Type;
				}
			})

		return matchedDNode;
	}

	/**/selectDNodeByID(Type:any, id:string|number):DNode {
		// t/Todo:
		return null;
	}

	/**/selectDNodeByPTypeORType(PTypeORType:any):DNode|DNode[] {

		let matchedDNodes:DNode[] = this.nodes.filter((node) => { // < cm/slect[DNode]
				switch (node.dNodeType) {
					case "st-inst": case "gen-inst":
						return node.Type == PTypeORType || node instanceof PTypeORType;
				}
			});

		if(matchedDNodes.length > 0) {
			if(matchedDNodes[0].dNodeType == 'st-inst') {
				return matchedDNodes[0];
			}
			else {
				// let PType = PTypeORType; // < X
				// let matchedDNodesWithoutPType = matchedDNodes.filter((mDNode:DNode) => {
				// 		return mDNode.Type !== PType;
				// 	});
				// return matchedDNodesWithoutPType;
				return matchedDNodes;
			}
		}
		else {
			return null;
		}
	}

	/*T,x*/deleteDNode(Type:any, id:string|number):DNode { //  OK /42m

		let nodeToDelete = this.nodes.filter((node:DNode) => { // < cm/slect[DNode]
				if(node.Type == Type) {
					return true;
				}
				else if(node instanceof Type) {
					return true;
				}
				else {
					return false;
				}
				//return node.Type == Type || (node instanceof Type);
			})
			.find((node:DNode) => {
				return node.id == id;
			})

		nodeToDelete.connections$.next(new DEvent({ type: '[ModifyCon] delete connections', source: nodeToDelete })); // < cm/disconectMany[Connections]	 
		this.nodes.splice(this.nodes.indexOf(nodeToDelete), 1); // < cm/delete[DNode]
		return nodeToDelete;
	}

	// CONNECTIONS
	// CONNECTIONS - MODIFIERS (5)
	/*T,t*/connect(cmdResult:any, tags:string, connection?:string):DNode { // create connection /OK /25m
		// < cR(NodeToConnect)
		let sourceDNodeToConnect = this._connect(cmdResult, connection);
		this.nodes.push(sourceDNodeToConnect);

		// this.connections = this.connections.subscribe((dEvent:any) => { // < X
		// })
		return this;
	}

	private /*T*/_connect(sourceDNode:DNode, connection?:string):DNode { // /OK
		let conID = connection ? connection : 'con/DEF';
		let sub$ = sourceDNode.connections$
			.pipe(
				filter((dEvent:any) => { return ( dEvent.target ? dEvent.target === this : true) }),
				filter((dEvent:any) => { return ( dEvent.conID ? dEvent.conID == conID : true) }),
			)
			.subscribe((dEvent:any) => {
				this.handelDEvents(dEvent);
			})

		sourceDNode.connections.push({ dir:'from', id: conID, sub: sub$, dNode: this });
		this.connections.push({ dir:'to', id: conID, sub: sub$, dNode: sourceDNode  });

		// Providers/agrgators
		this.provideDNodesFromType(sourceDNode, connection);

		return sourceDNode;
	}

	/*T,t*/connectMany(cmdResults:any[], tags:string, connection?:string):DNode { // OK
		let connecteDNodes:DNode[] = cmdResults.map((cResult) => {
			let sourceDNodeToConnect = this._connect(cResult, connection);
			this.nodes.push(sourceDNodeToConnect)
			return sourceDNodeToConnect;

		})

		return this;
	}

	/*T,t*/connectFromType(sourceType:DNode) { // OK /45m
		// X/ < cR(NodeToConnect.provider)
		// let Type = this.utils.parseStxTargetDNode(targetDNode, this.constructors).Type;
		// let dNodeToConnect = this.selectDNodeByType(Type);
		
		// Connect existing /source connections
		let connectedToDNodes = sourceType.connections.filter((conToSorce) => {
				return conToSorce.dir == 'to' && conToSorce.id == 'con/inst';
			})
			.map((conToSorce) => {
				return this.connect(conToSorce.dNode, '', 'con/inst');
			})

		// Connect to /source provieder
		let providerToConnect = sourceType.typeProvider;

		providerToConnect.stream$.subscribe((providedDNodeToConnect:DNode) => {
			let sourceDNodeToConnect = this.connect(providedDNodeToConnect, '', 'con/inst');
		})
	}

	/*T,t*/disconect(cmdResult:any, connection?:any) { // delet connection /OK /25m
		// < cR(NodeToDisconect)
		this.connections$.next(new DEvent({ type:'[ModifyCon] delete connection', source: this, target: cmdResult, conID: connection ? connection : 'con/DEF', payload: null }));
	}

	// CONNECTIONS - PROVIDERS (1)
	private /*T*/provideDNodesFromType(sourceDNode:DNode, connection?:any):TypeProvider { // OK /10m
		
		// let matchedTypeProvider = this.typeProviders.filter((tProvider:TypeProvider) => { // < X
		// 		return dEvent.conID == 'con/inst' && (sourceDNode instanceof sourceDNode.Type);
		// 	})
		// 	.map((tProvider) => {
		// 		tProvider.stream$.next(sourceDNode);
		// 		return tProvider;
		// 	})[0];

		if(connection == 'con/inst' || sourceDNode instanceof this.Type) {
			this.typeProvider.stream$.next(sourceDNode);
		}

		return this.typeProvider;
	}

	// CONNECTIONS - SELECTORS (3)
	/*T,t*/connected(connection?:string):DNode[] { // OK

		let connected = this.connectedTo(connection);
		return connected;
	}

	/*T,t*/connectedTo(connection?:string):DNode[] { // OK /25m
		let connectedTo = this.connections.filter((con) => {
				return con.dir == 'to';
			})
			.filter((con) => {
				return connection ? con.id == connection :  true;
			})
			.map((con) => {
				return con.dNode;
			})

		return connectedTo;
	}

	/*t*/connectedFrom(connection?:string):DNode[] { // OK
		let connectedFrom = this.connections.filter((con) => {
				return con.dir == 'from';
			})
			.filter((con) => {
				return connection ? con.id == connection :  true;
			})
			.map((con) => {
				return con.dNode;
			})

		return connectedFrom;
	}

	// EVENTS HANDLERS (1)
	/*T*/handelDEvents(dEvent:any) { // D3,OK /15m
		
		let macthedConnection;
		let macthedConnections = [];

		switch (dEvent.type) {
			case "[ModifyCon] delete connection":
				macthedConnection = this.connections.find((con) => {
						return con.dir == 'to' && dEvent.source === con.dNode;
						//return dEvent.dir == 'to' && dEvent.conID == con.id && this === dEvent.target;
					})
				this.connections.splice(this.connections.indexOf(macthedConnection), 1);
				break;
			case "[ModifyCon] delete connections":
				macthedConnections = this.connections.filter((con) => {
						return con.dir == 'to' && dEvent.source === con.dNode;
					})
				macthedConnections.forEach((con) => {
					this.connections.splice(this.connections.indexOf(con), 1);
				})
				break;
		}
	}

	// UTILS, HELPERS (3)
	/*T*/private checkDNodeExist(newDNode:DNode):boolean { // OK /20m
		let findedDNode = this.nodes.find((dNode) => {
			if(newDNode.dNodeType == 'type') {
				return dNode.dNodeType == 'type' && dNode.Type == newDNode.Type;
			}
			else if(newDNode.dNodeType == 'st-inst') {
				return dNode.dNodeType == 'st-inst' && dNode.Type == newDNode.Type;
			}
			else {
				return dNode.dNodeType == 'gen-inst' && dNode.Type instanceof newDNode.Type && dNode.id == newDNode.id;
			}
		});

		return findedDNode != undefined ? true : false;
	}

	/*X*/selectType(Type:any):any { // OK,
		// t/??? proc find vraci DCollectio | undefined
		// let matchedCollection:TCollection = this.nodes.find((collection) => {
		// 		return collection.type == Type;
		// 	});
		// 	return matchedCollection;
		// }
		return null;
	}

	/*T*/generateID():number {
		return this.genIDs++;
	}
}

export class AXSelector {
	
	type:string; // < byID,
	target:any;
	id:number|string;

	constructor(type:string, target:string, id:number|string) {
		this.type = type;
		this.target = target;
		this.id = id;
	}
}

@Injectable()
export class DataModel { // t/OK T(11/25)
	
	source:DNode;
	utils:Utils;
	constructors:IConstructors[] = [];
	types:{ al:string, PType:any, Type:any, cfg:any }[] = [];
	lastCreated:DNode;

	// for /DMQuery
	results:DNode[];
	result:DNode;

	// // Chaining - helpers
	currentDNode:DNode;

	constructor() {
		this.source = new DNode();
		this.utils = new Utils(this);
	}

	// /* Struktura:
	// 	- factories, destructors
	// 	- selectors
	// 	- selectors - primary
	// 	- selectors - secundary
	// 	- selectors - helpers
	// 	- selectors - rules
	// 	- operations
	// 	- modificators
	// 	- utils, helpers
	// 	---
	// 	/ - Selector inputs
	// 		- stx-tragetDNode (w/widgetA->secundaryType/primaryType)
	// 		- instace
	// 		- Type
	// */

	selByID(cfg:{ t:string, id:number|string }):AXSelector {
		return new AXSelector('byID', cfg.t, cfg.id);
	}

	// FACTORIES, DESTRUCTORS  (9)
	/*T,t*/defineConstructors(constructors:IConstructors[]) { // OK /35m/47m // < registerTypes
		let cntToCreate = constructors.filter((cnt:any) => {
				let d_check = this.checkExistConstructor(cnt);
				return d_check;
			})
			.map((cnt) => {
				return cnt;
			});

		this.constructors = this.constructors.concat(cntToCreate);
	}
	
	/*T*/private checkExistConstructor(cntToCheck:any):boolean { // OK /30m
		let cntExist = this.constructors.find((cnt:any) => {
			return (cnt.Type == cntToCheck.Type || cnt.al == cntToCheck.al);
		})

		return cntExist ? false : true;
	}
	
	/*T,t*/createType(targetDNode:string, constructionCfg:any, al?:any):any { // OK /15m/25m // 

		let Type = this.utils.parseStxTargetDNode(targetDNode, this.constructors).Type;
		let PType = this.utils.parseStxTargetDNode(targetDNode, this.constructors).PType; // < cmd

		let typeExist = this.checkExistType({ PType: PType, Type: Type });

		if(!typeExist) {
			return this.types.push({ PType: PType, Type: Type, al: al, cfg: constructionCfg });
		}
		else {
			return null;
		}
	}
	
	/*T*/private checkExistType(typeToCheck:any):boolean { // OK /7m
		let typeExist = this.types.filter((type) => {
				return type.al == typeToCheck.al;
			})
			.filter((type) => {
				return type.PType == typeToCheck.PType;
			})
			.find((type) => {
				return type.Type == typeToCheck.Type;
			})

		return typeExist ? true : false;
	}
	
	/*T,t*/create(targetDNode:any, cfg?:any):this { // OK /28m/1h45m // tagret(stx,Type,)
		
		let Type = this.utils.parseStxTargetDNode(targetDNode, this.constructors).Type;
		let PType = this.utils.parseStxTargetDNode(targetDNode, this.constructors).PType; // ParentType

		this.lastCreated = this.source.createDNode(Type, 'st-inst', cfg);
		this.currentDNode = this.source.createDNode(PType, 'type')
			.connect(this.lastCreated, 'cn/ext');

		return this;

		// // ...
		// let type = this.source.createType(Type) // < cmd/
		// let dNode = type ? type.createDNode(cfg) : null; // < cmd/

		// this.source.cmd( // < var2 comnads
		// 	this.source.createType(Type)
		// 	// ...
		// )
		// let node = this.source.createDNode({ type:Type, data:this.createData(Type, cfg) });
		// return null;
	}

	/**/createInst(targetDNode:any, cfg?:any) {
		// < targetDNode (stx: parentType/name, ParentType)

		if((typeof targetDNode) == 'string') {
			// t/Todo:
		}
		else {

			let Type = targetDNode;
			let PType = targetDNode;

			this.lastCreated = this.source.createDNode(Type, 'gen-inst',cfg);
			this.currentDNode = this.source.createDNode(PType, 'type')
				.connect(this.lastCreated, 'inst', 'cn/ext');
		}
		return this;

	}
	
	/*T,t*/createFromType(targetDNode:string, cfg:any):this { // OK /10m/15m

		let Type = this.utils.parseStxTargetDNode(targetDNode, this.constructors).Type;
		let PType = this.utils.parseStxTargetDNode(targetDNode, this.constructors).PType;

		let type = this.types.filter((type) => {
				return type.PType == PType;
			})
			.find((type) => {
				return type.Type == Type;
			});

		this.lastCreated = this.source.createDNode(type.Type, 'st-inst', {...type.cfg, ...cfg} );

		let dNode = this.source.createDNode(type.PType, 'type').connect(
			this.lastCreated
		, 'cn/ext');

		return this;
	}
	
	/*T,t*/delete(targetDNode:any, selectorOR_ID?:any) { // OK

		let Type = this.utils.parseStxTargetDNode(targetDNode, this.constructors).Type

		if((typeof selectorOR_ID) == 'string' || (typeof selectorOR_ID) == 'number') {
			this.source.deleteDNode(Type, selectorOR_ID);
		}
		else {
			// t/Todo:
		}
	}
	
	/*T,t*/createMany(targetDNonde:any, cfgORcmds:any[], usage?:string):DNode[] { // OK /20m
		
		// < cmdResults(DNode...)
		let createdDNodes = null;

		if(!usage || usage == 'cmds') { // from/comnads
			let cmdResults = cfgORcmds;
			createdDNodes = cmdResults.map((result) => {
				return result;
			});
		}
		else if(usage == 'cfg') { // from/config 
			// t/Todo:
		}

		return createdDNodes;
	}
	
	/*T,t*/deleteMany(Type:any, ids:any[]):DNode[] { // D1,OK
		
		let deletedDNodes = ids.map((id) => {
			return this.source.deleteDNode(Type, id);
		});

		return deletedDNodes;
	}
	
	// SELECTORS
	// SELECTORS - PRIMARY  (6)
	/*t*/path(path:string[]):DMQuery { // D1/OK /40m // < w/widgetA>el/elementB

		let Type = this.utils.parseStxTargetDNode(path[0], this.constructors).Type;
		let target = this.source.selectDNodeByType(Type) as DNode;

		let nextPaths = path.filter((step, index) => { return index > 0 });

		let selectedNodesForPath = nextPaths.map((step) => {

			//let stepType = this.utils.parseStxTargetDNode(step, this.constructors).Type;
			let stepPType = this.utils.parseStxTargetDNode(step, this.constructors).PType;
			let stepInstName = this.utils.parseStxTargetDNode(step, this.constructors).name;

			let d_connectedTo = target.connectedTo('con/ref');
			target = d_connectedTo.filter((dNode) => {
					return dNode instanceof stepPType; // < dNode.PType == stepType.PType && 
				})
				.find((dNode:any) => {
					return dNode.name == stepInstName;
				})

			return target;
		});

		return new DMQuery({
			result: selectedNodesForPath[0],
			results: null,
		});
	}
	
	/*t*/getDNodeForPath(path:string[]):DNode { // D3,OK
		let selectedNodeForPath = this.path(path).result;
		return selectedNodeForPath;
	}

	/*t*/select(Type:any = null, rules?:any):DMQuery { // D1,OK/ /25m

		//let Type = this.utils.parseStxTargetDNode(path[0]).Type; // < X
		let nodesToSelectFrom = this.source.selectDNodeByPTypeORType(Type);

		if(nodesToSelectFrom instanceof Array && rules) {
			//let nodesToSelectFrom:DNode[] = target.connectedTo('con/inst'); // < X
			let selectedNodes = this.selectByRules(nodesToSelectFrom, rules)

			return new DMQuery({
				results: selectedNodes.map((result) => {
					return result;
				}),
				result: null,
			});
		}
		else if(nodesToSelectFrom instanceof Array) {
			return new DMQuery({
				result: null,
				results: nodesToSelectFrom,
			});
		}
		else {
			return new DMQuery({
				result: nodesToSelectFrom,
				results: null,
			});
		}
	}
	
	/*T,t*/selectOne(targetDNode:any):DMQuery { // D2,OK /15m
		let Type = this.utils.parseStxTargetDNode(targetDNode, this.constructors).Type;
		let target = this.source.selectDNodeByType(Type);

		return new DMQuery({
			result: target,
			results: [target]
		});
	}
	
	/*t*/selectByInst(targetInst:any):DMQuery { // D3,OK
		let mactchedDNode = this.source.nodes.find((dNode) => {
			return dNode === targetInst;
		});

		return new DMQuery({
			result: mactchedDNode,
			results: [mactchedDNode]
		});
	}
	
	/*t*/selectByName(Type:any, name:string):DMQuery { // /D3,OK
		let mactchedDNode = this.source.nodes.filter((dNode) => {
				return dNode.Type == Type || dNode instanceof Type;
			})
			.find((dNode:any) => {
				return dNode.name == name;
			})

		return new DMQuery({
			result: mactchedDNode,
			results: [mactchedDNode]
		});
	}

	selectByID(Type:any, id:number|string):DMQuery { 
		
		let mactchedDNode2 = this.source.nodes.filter((dNode) => {
				if(dNode instanceof Type) {
					return true;
				}
			});

		let mactchedDNode = this.source.nodes.filter((dNode) => {
				if(dNode instanceof Type) {
					return dNode;
				}
			})
			.find((dNode:any) => {
				return dNode.id == id;
			})

		return new DMQuery({
			result: mactchedDNode,
			results: [mactchedDNode]
		});
	}
	
	// SELECTORS - SECUNDARY  (2)
	/*t*/containes(prms:{ data:DNode[] }):DMQuery { // D2,/OK
		let result:DNode[] = this.results.filter((dNode) => {
			let matchedDNode = prms.data.find((prmDNode) => {
				return dNode == prmDNode;
			});
			return matchedDNode ? true : false;
		})

		return new DMQuery({
			results: result.map((result) => {
				return result;
			}),
			result: null,
		});
	}
	
	/*t*/containesType(prms:{ Type:any }):DMQuery { // /OK /5m
		let result:DNode[] = this.results.filter((dNode) => {
			return (dNode instanceof prms.Type) ? true : false;
		})

		return new DMQuery({
			results: result.map((result) => {
				return result;
			}),
			result: null,
		});
	}
	
	// SELECOTOR - HELPERS  (2)
	/*t*/getDataElement(keyName:string):any { // D1,/OK
		let result:any = this.results.filter((dNode:DNode) => {
				let matchedKey = Object.keys(dNode).find((key) => {
					return key == keyName;
				});

				return matchedKey ? true : false;
			})
			.map((dNode) => {
				return dNode[keyName];
			})

		return result;
	}
	
	/*T,t*/getLast(Type?:any):DNode { // D1,OK
		let dNodesByType = this.source.nodes.filter((dNode) => {
			return Type ? dNode.Type == Type : true;
		});

		return dNodesByType[dNodesByType.length-1];
	}
	
	// // SELECTOR - RULES  (2)
	selectByRules(dNodes:DNode[], rules:any):DNode[] { // D1,OK

		let filterdDNodes:DNode[] = dNodes; // this.dNodes.map(dNode => dNode)

		// Object.keys(filterdDNodes[0]).forEach((key) => {
		// 	console.log('key: %s', key);
		// }) // < t/Dbg

		let results:any[] = Object.keys(rules ? rules : {}).map((key) => { // < select and pass rule fce
				let macthedRuleByOperator = this.rules.find((rule:any) => { // < matche operator
					return rule.alias == key;
				});

				let rule = macthedRuleByOperator != undefined 
					? macthedRuleByOperator 
					: this.rules.find((rule:any) => {
						return rule.type == 'IsEqual';
					});

				rule.rKey = key;
				rule.rValue = rules[key];

				return rule;
			})
			// .map((key) => { // X
			// 	return ;
			// })
			.map((rule) => { // < use rule
				filterdDNodes = filterdDNodes.filter((dNode) => {
					let d_ruleResult = rule.rule(dNode, rule.rKey, rule.rValue);
					return d_ruleResult;
				})
				return filterdDNodes;
			});

		return results[results.length-1];
		// return null;
	}
	
	rules = [

		{ alias:<string> '$eq', type:'IsEqual', rKey:<string>'', rValue:<any> null, // ruleKeyIsEqual
			rule: (dNode:any, rKey:string, rValue:any):boolean => { // OK

				let result = Object.keys(dNode).filter((key) => {
						return key == rKey;
					})
					.map( (matchedKey) => {
						return dNode[matchedKey] == rValue ? true : false;
					})[0]

				return result ? result : false; 
			},
		}
	]
	
	// OPERATIONS  (2)
	/*t*/set(setting:any):DMQuery { // D1,OK
		let results:DNode[] = this.results.map((dNode:DNode) => {
			this.utils.set(dNode, setting);
			return dNode;
		});

		return new DMQuery({
			results: results.map((result) => {
				return result;
			})
		});
	}
	
	/*t*/setMany(setting:any):DMQuery { // D1,OK
		return this.set(setting);
	}
	
	/*t*/operation(clbOperation:Function) { // D2,/OK
		let results:DNode[] = this.results.map((dNode:DNode) => {
			return clbOperation(dNode);
		});

		return new DMQuery({
			results: results.map((result) => {
				return result;
			})
		});
	}
	
	// MODIFICATORS
	// UTILS, HELPERS (2)
	
	/*T,t*/getLastCreated() { // D1,OK
		return this.lastCreated;
	}
	
	createData(Type:any, cfg:any):any { // ???
	}
	
	// NEZARAZENE
	/*X*/connect(targetDNode:any, cfgORCmds:any|any[], connection?:any) { // /R /45m+
		
		// this.currentDNode.connect();

		// // ...
		// let Type = this.utils.parseStxDNType(targetDNode).Type
		// let PType = this.utils.parseStxDNType(targetDNode).PType; // ParentType

		// if(cfgORCmds !instanceof Array) {
		// 	// cm/select node
		// 	let pType = this.source.selectType(PType)
		// 	pType.selectNodeByType(Type)

		// 	// cm/create node
		// }
		// else {
		// 	// t/Todo:
		// }
	}
	
	/*X*/connectMany(connectCfgs:{ targetDNode:any, selector:any, connection:string }[]) { // R/ /15m+
		// connectCfgs.map((connectCfg:any) => {
		// 	this.connect()
		// });
	}	
}

export class DMQuery extends DataModel {

	constructor(cfg:any) {
		super();
		this.results = cfg.results;
		this.result = cfg.result;
		//BUtils.set(this, cfg);
	}

	selectNext() { // t/Todo:

	}
}

class State extends DNode {
	
	constructor() {
		super();
	}
}

// // MANAGERS - X

interface IConstructors {
	al:string; 
	name?:string; 
	Type:any;
}

class Utils {

	dm:DataModel;

	constructor(dm?:DataModel) {	
		this.dm = dm;
	}

	/* Struktura:
		- parsers
		- helpers
	*/

	public getTypeFor(targetDNodeStx:string):any {
		let Type = null;
		if( this.isUpperCase(targetDNodeStx.split('/')[1][0]) ) {
			Type = this.parseStxTargetDNode(targetDNodeStx, this.dm.constructors).Type;
		}
		else {
			Type = this.parseStxTargetDNode(targetDNodeStx, this.dm.constructors).PType;
		}
		return Type;
	}

	/*T*/parseStxTargetDNode(stx:string, constructors:IConstructors[]) {
		
		let stxFirstChar = stx.split('/')[1][0];
		if(this.isUpperCase(stxFirstChar)) {
			let stxType = this.parseStxType(stx, constructors);
			return { PType: stxType.PType, Type: stxType.Type, name: undefined  };
		}
		else {
			let stxInst = this.parseStxInst(stx, constructors);
			return { PType: stxInst.PType, Type: undefined, name: stxInst.name  };
		}
	}

	public isUpperCase(character:string):boolean {
		if(character == character.toUpperCase()) {
			return true;
		}
		else {
			return false;
		}
	}

	private parseStxType(stx:string, constructors:IConstructors[]) {
		let pTypeAl = stx.split('/')[0];
		let PType = constructors.find((cnt) => {
			return cnt.al == pTypeAl;
		}).Type;

		let typeName = stx.split('/')[1];
		let Type = constructors.find((cnt) => {
			return cnt.name == typeName;
		}).Type;

		return { PType: PType, Type: Type };
	}

	private parseStxInst(stx:string, constructors:IConstructors[]) {
		let pTypeAl = stx.split('/')[0];
		let PType = constructors.find((cnt) => {
			return cnt.al == pTypeAl;
		}).Type;

		let instName = stx.split('/')[1];
		return { PType: PType, name: instName };
	}

	// HELPERS
	/**/set(object:any, prms:any) { // Ok/impl,tests,war

		if(object && prms) {
			Object.keys(prms).forEach((prmName) => {
				
				let propertyName = prmName;
				let propertyValue = prms[prmName];

				Object.defineProperty(object, propertyName, {value: propertyValue, enumerable: true, writable:true});
			});
		}
	}
}

// STATE MANAGER
@Injectable()
export class StateManager extends DataModel {
	
	//states:StatesStream = new StatesStream();
	//statesAgregator:StatesAgregator = new StatesAgregator();
	flSucces:boolean;
	flFailure:boolean;

	// < 

	constructor(private al:ALoger, /*private am:ActionManager,*/ /*private dm:AXModel*/) {
		super();
		// code...
		//this.connectTo();

		// default reducer
		// this.createReducer('', (action:any) => { // t/???
		// 	console.log('reducers: a/%s', action.type);
		// }, 1);

		// this.connectToStates();
	}

	/* Struktura:

		- //dispatchers
		- //facotories, destrucors
		- sub-mechanic - reducers - construcotrs
		- sub-mechanic - reducers - helpers
		- sub-mechanic - reducers - helpers - flow control
		- stream handleres
		- Utils, Helpers
		- Nezarazene
	*/

	// SUB-MECHANICS - REDUCERSS - CONSTRUCTORS
	/**/createReducer(actionTypes:string, clb:Function, d_ctx?:number):any { // /OK /55m // < AXStream 

		// let stateStream$ = this.dm.createInst(StateStream, { aTypes: actionTypes, clb: clb }).lastCreated as AXStream; // < action: action, 

		// this.am.actions.actionsStream.subscribe((action:any) => {
		// 		if(action) {
		// 			this.al.log('AX,Flow,Re', undefined, 'Re/ch-> Acs/.clb/Sub - a/%s', [action.type], null);
		// 			let changedState = clb(action);
					
		// 			if(changedState) {
		// 				this.al.log('AX,Flow,Re', undefined, 'Re/--> Em/St.next() - a/%s', [action.type], null);
		// 				stateStream$.stream.next(changedState);
		// 			}
		// 		}
		// 	});

		// if(d_ctx == 1) { // < X
		// 	this.am.actions.actionsStream.subscribe(function obsv1(action:any) {
		// 		let changedState = clb(action);
		// 		this.al.actionCheck('reduce:', action.type, null, { prev: changedState.prev, current: changedState });
		// 		stateStream$.stream.next(changedState);
		// 	});
		// }
		// else if(d_ctx == 2) {
		// 	this.am.actions.actionsStream.subscribe(function obsv2(action:any) {

		// 		let changedState = clb(action);
		// 		this.al.actionCheck('reduce:', action.type, null, { prev: changedState.prev, current: changedState });
		// 		stateStream$.stream.next(changedState);
		// 	});
		// }
		
		// stateStream$.stream.pipe( // < X
		// 		map((action:any) => {
		// 			let changedState = clb(action);
		// 			let p = {
		// 				...action.payload,
		// 				state: changedState,
		// 			}
		// 			return 'A';
		// 			//return new Action({ type: action.type, payload: p });
		// 		})
		// 	)
		// 	.subscribe((state:any) => { // < X
		// 		state;
		// 	})

		// return stateStream$;
		return null;
	}

	// SUB-MECHANICS - REDUCERSS - HELPERS
	/**/setState(stateTarget:any, clbStateReducer:Function, collection?:any):State { // < stateTarget/Instance,Stx/[],flag[PATH] // /OK /1h
		
		if(this.flSucces && this.flSucces == true || this.flFailure && this.flFailure == true ) {
			this.flSucces = this.flSucces = undefined;
			return this._setState(stateTarget, clbStateReducer);
		}
		else if(!this.flSucces || !this.flFailure) {
			return this._setState(stateTarget, clbStateReducer, collection);
		}
		else {
			return null;
		}
	}

	/**/private _setState(stateTarget:any, clbStateReducer:Function, collection?:any):State {
		let changedStates:State[] = [];

		// if(stateTarget instanceof Array) {
		// 	// < stx[]
		// 	// this.selectMany( stateTarget.map((sTarget) => { return this.utils.parseStxTargetState(sTarget).Type }), {
		// 	// 	name: stateTarget.map((sTarget) => { return this.utils.parseStxTargetState(sTarget).name})
		// 	// })
		// 	// 	.operation((selected) => {
		// 	// 		return clbStateReducer(selected)
		// 	// 	});
		// }
		if(stateTarget instanceof AXSelector) {
			switch (stateTarget.type) {
				case "byID":
					let selectionQuery = this.selectByID(this.utils.getTypeFor(stateTarget.target), stateTarget.id);
					changedStates = selectionQuery.operation((selected:any) => {
							let changedData = clbStateReducer(selected); // < t/Dcs
							let changedState = changedData;
							// let changedState = new selected.Type(changedData);
							// changedState.prev = selected;

							// this.updateDNode(selected, changedState);
							return changedState;
						}).results;
					break;
				default:
					changedStates = null;
					break;
			}
		}
		else {

			if((typeof stateTarget) == 'string') {
				if(false /*this.checkFLAG(stateTarget)*/) { // < t/Dcs
					// < flag[PATH]
					// let pathForState = this.select(CChain, { name: 'set-state' }).getDataElement('path');
					// chagedState = this.path(pathForState)
					// 	.operation((selected:any) => {
					// 		return clbStateReducer(selected);
					// 	});
				}
				else {
					// < stx/Type
					let parsedStx = this.utils.parseStxTargetDNode(stateTarget, this.constructors);
					let selectionQuery:any = null;

					if(parsedStx.Type) { // < stx/Type
						// changedStates = this.select(collection ? collection : parsedStx.Type, { name: parsedStx.name })
						selectionQuery = this.selectOne(stateTarget);
					}
					else { // < stx/Inst
						selectionQuery = this.selectByName(parsedStx.PType, parsedStx.name);
					}

					changedStates = selectionQuery.operation((selected:any) => {
							let changedData = clbStateReducer(selected); // < t/Dcs
							let changedState = changedData;
							// let changedState = new selected.Type(changedData);
							// changedState.prev = selected;

							// this.updateDNode(selected, changedState);
							return changedState;
						}).results;
				}
			}
			else { // /Ok
				// < insatnce
				// chagedState = this.selectOne(stateTarget)
				// 	.operation((selected) => {
				// 		return clbStateReducer(selected);
				// 	});
			}
		}

		return changedStates[0];
	}
	// SUB-MECHANICS - REDUCERSS - HELPERS - FLOW CONTROLS
	// /**/onSucces(action:Action) {

	// 	this.flSucces = this.utils.checkActionResponse(action);
	// 	return this;
	// }

	// /**/onFailure(action:Action) {

	// 	this.flFailure = this.utils.checkActionResponse(action);
	// 	return this;
	// }

	// STREAM HANDLERES
	/**/connectToStates() {
		// let sStreams:Subject<any>[] = this.dm.select(StateStream).results.filter((stateStream:any) => { 
		// 		return stateStream.connectedToOutput == false;
		// 	})
		// 	.map((stateStream:any) => {
		// 		stateStream.connectedToOutput = true;
		// 		return stateStream.stream;
		// 	})

		// //this.states.statesStream = this.states.stream
		// statesStream.stream = this.states.stream;

		// this.statesAgregator.stream
		// 	.pipe(
		// 		merge(...sStreams),
		// 		map((state:any) => {
		// 			this.al.log('AX,Flow,Re', undefined, 'Re/-> StsAGR/.clb/Op - state...', [], { state: state });
		// 			return state;
		// 		})
		// 	)
		// 	.subscribe((state:any) => { // < X
		// 		this.al.log('AX,Flow,Re', undefined, 'Re/-> StsAGR/.clb/Sub - state...', [], { state: state });
		// 		this.al.log('AX,Flow,Re', undefined, 'Re/--> Em/Sts.next() - state...', [], { state: state });
		// 		statesStream.stream.next(state);
		// 	})

		//this.states.statesStream.subscribe((state:any) => { // < X
		// statesStream.stream.subscribe((state:any) => {
		// 	console.log('states - sub-subscribe ');
		// })
	}

	// UTILS, HELPERS
	// /**/private checkFLAG(flag:string) { // < flag[PATH]
	// }

	// NEZARAZENE
	updateDNode(a1:any, a2:any) {
	}

	// /**/private connectTo() { // /OK
	// 	this.connectToInteractions();
	// 	this.connectToActions();
	// }

	// /**/private connectToInteractions() { // /OK
	// 	this.dm.selectMany(StateStream)
	// 		.operation((aStream:any) => {
	// 			// connect to a-stream
	// 			aStream.ofCategory(aStream.aTypes)
	// 				.subscribe((action:any) => {
	// 					aStream.clb(action);
	// 				});
	// 		})
	// }

	// /**/private connectToActions() {
	// 	this.am.actions
	// 		.map((action:any) => action);
	// 		.subscribe((action:any) => {
	// 			this.se.statesStream$.next();
	// 		});
	// }

	// // ...
	// /**/createState(name:string, data:any) { // /OK
	// 	this.dm.createInst(State, {
	// 		...data,
	// 		name: name,
	// 	})
	// }
}