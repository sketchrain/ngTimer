class NodeOfTree  {

	name:string;
	parentNode:NodeOfTree;
	content:any;
	childNodes:NodeOfTree[] = [];
	goThrough:boolean = false;
	childNodesGoThroug:boolean = false;
	solved:boolean = false;

	constructor(name:string, conntent:any) {
		this.name = name;
		this.content = conntent;
	}

	next():NodeOfTree {

		let nextNOTSolvedNode:NodeOfTree = this.childNodes.find((childNode) => {
			return childNode.solved == false;
		});

		return nextNOTSolvedNode;
	}

	addChild(childNode:NodeOfTree) {
		childNode.parentNode = this;
		this.childNodes.push(childNode);
	}
}

export class NodeTree  {
	
	name:string;
	rootNode:any = null;
	typeOfIteration:string ;
	currentLevel:number = 0;
	currentNode:any = null;
	treeConnectionFiled:string = undefined;
	childNodesGoThroug:boolean = false;

	clbAction:Function;

	constructor(name:string) { // < fa/[Ok/I]
		name = this.name;
	}

	goThrough(rootNode:any, typeOfIteration:string, prms:{ treeConnectionFiled:string }):NodeTree { // < fa/[Ok/I]
		// todo:
		this.rootNode = new NodeOfTree('rootNode', rootNode);
		this.typeOfIteration = typeOfIteration;
		this.treeConnectionFiled = prms.treeConnectionFiled;
		return this;
	}

	setActionForEachNodeOnLevel(clbAction:Function) { // < fa/[Ok/I]
		this.clbAction = clbAction;
	}

	run() { // fa[Ok/I]
		// todo:
		if(this.typeOfIteration == NodeTree.byEachLevel) {
			this.solvedEachLeveFirst();
		}
		else {

		}
	}

	solvedEachLeveFirst() {

		this.currentNode = this.rootNode;
		this.clbAction(this.rootNode.content);
		

		let treeNOTsolved:boolean = true;

		while(treeNOTsolved) {

			if(!this.currentNode.childNodesGoThroug) { // current[Level] has NOTgotThrough all childNode 
				this.goThroughNodesOnCurrentLevel(this.currentNode);
			}
			else { // current[Level] has NOTsolevd all childNode

				let nextChildNodeToSolve = this.stepIN(this.currentNode);

				if(!nextChildNodeToSolve) {
					let parentNode = this.stepUP(this.currentNode);

					if(parentNode == this.rootNode) {
						treeNOTsolved = false;
					}
				}
			}
		}
	}

	private stepIN(currentNode:NodeOfTree):NodeOfTree {

		let next:NodeOfTree = this.currentNode.next();
		if(next) {
			this.currentNode = next;
		}

		return next;
	}

	private stepUP(currentNode:NodeOfTree):NodeOfTree {

		let parentNode:NodeOfTree = this.currentNode.parentNode;
		if(parentNode) {
			this.currentNode.solved = true;
			this.currentNode = parentNode;
		}
		return parentNode;
	}

	private goThroughNodesOnCurrentLevel(currentNode:NodeOfTree) {

		let childNodes = this.currentNode.content[this.treeConnectionFiled];

		childNodes.forEach((childNode:any) => {
			let newChildNode = new NodeOfTree('childNode', childNode);
			newChildNode.goThrough = true;
			this.clbAction(newChildNode.content);
			currentNode.addChild(newChildNode);
		});
		currentNode.childNodesGoThroug = true;
	}

	static byEachLevel:string = 'BEL';
}

class Str {

	sub(string:string, args:any[], replaceIdentifierType:string = 'substring') { // < NEW,CH
		var counter = 0;
		let _replaceIdentifier:RegExp = undefined;
		switch (replaceIdentifierType) {
			case "substring":
				_replaceIdentifier = /%s/g;
				break;
			case "substring2":
				_replaceIdentifier = /%s2/g;
				break;
			// case "integer":
			// 	_replaceIdentifier = /%i/g;
			// 	break;
			// case "floating-point":
			// 	_replaceIdentifier = /%f/g;
			// 	break;
		}
		return string.replace(_replaceIdentifier, function() {
	        return args[counter++];
	    });
		// return string.replace(/%s/g, function() {
		//     return args[counter++];
		// });
	}
}

class ID {
	
	widget:number = 0;

	constructor() {
		// code...
	}

	getIDforWidget():number {
		this.widget++;
		return this.widget;
	}
}

export class AXUtils {
	
	static str:Str = new Str();
	static id:ID = new ID();

	constructor() {

	}
}

export class Utils {
	
	static str:Str = new Str();
	static id:ID = new ID();

	constructor() {
	}

	set(object:any, prms:any) { // Ok/impl,tests,war

		if(object && prms) {
			Object.keys(prms).forEach((prmName) => {
				
				let propertyName = prmName;
				let propertyValue = prms[prmName];

				Object.defineProperty(object, propertyName, {value: propertyValue, enumerable: true, writable:true});
			});
		}
	}
}