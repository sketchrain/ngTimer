// angular
import { Injectable } from '@angular/core';
// flow
import { Category, Managers, ISignal } from '../../flow/core/fl-core';

@Injectable()
export class Selectors extends Category {
	
	constructor(m:Managers) {
		super(m);

		// Set modul interaction
		this.selectors();
		this.se.connectToActions();
		
		// Connect to Input
		this.se.connectOneToInput(this.im, (inActions:ISignal[]) => {

			let inputActions:ISignal[] = inActions.map((inAction:ISignal) => {
					return { type:'[Select] select', payload: { dNode: inAction.payload.changedState  } };
				});
			
			console.log('-> Se/input actions: ', inputActions);
			//this.se.dispatch(inputActions[0].type, inputActions[0].payload);
			this.se.dispatchMany(inputActions);
		});
	}

	selectors() {
		this.selectorsV1();
		this.selectorsV2();
	}

	selectorsV1() {
		this.al.log('AX3,App,Bo', '', 'Bootstrap - selectors - v1', [], null);

		this.se.selector('w/App', (selectors) => {
			return [
				selectors.operator((selection) => {
					return this.selectDElement(selection, 'outletTarget');
				})
			]
		}, 'w/App-outletTarget');

		this.se.selector('w/Loger', (selectors) => {
			return [
				selectors.operator((selection) => {
					return this.selectDElement(selection, 'action');
				})
			]
		}, 'w/Loger-action');

		// WIDGETS - AUTH
		// w/Loger

		this.se.selector('w/Loger', (selectors) => {
			return [
				selectors.operator((selection) => {
					return this.selectDElement(selection, 'action');
				})
			]
		}, 'w/Loger-action');

		// - w/LogIn
		this.se.selector('w/LogIn', (selectors) => {
			return [
				selectors.operator((selection) => {
					return selection;
				})
			]
		}, 'w/LI');

		this.se.selector('w/LogIn', (selectors) => {
			return [
				selectors.operator((selection) => {
					return selectors.dm.path(['w/LogIn','el/b-logIn']).result.block;
				})
			]
		}, 'w/LogIn-block');

		this.se.selector('w/LogIn', (selectors) => {
			return [
				selectors.operator((selection) => {
					return this.selectDElement(selection, 'infoMessage');
				})
			]
		}, 'w/LogIn-infoMessage');

		// - w/signIn
		this.se.selector('w/SignIn', (selectors) => {
			return [
				selectors.operator((selection) => {
					return selectors.dm.path(['w/SignIn','el/b-register']).result.block;
				})
			]
		}, 'w/SignIn-block');

		this.se.selector('w/SignIn', (selectors) => {
			return [
				selectors.operator((selection) => {
					return this.selectDElement(selection, 'infoMessage');
				})
			]
		}, 'w/SignIn-infoMessage');

		this.se.selector('w/SignIn', (selectors) => {
			return [
				selectors.operator((selection) => {
					return selection;
				})
			]
		}, 'w/SI');

		this.se.selector('w-t/any', (selectors) => {
			return [
				selectors.operator((selection) => {
					return selection;
				})
			]
		}, 'w/ti');

		// ...
		this.se.selector('w/ItemEditor', (selectors) => {
			return [
				selectors.operator((selection) => {
					return selection;
				})
			]
		}, 'w/IE');
		// - w/prehledItems
		this.se.selector('w/PrehledItems', (selectors) => {
			return [
				selectors.operator((selection) => {
					return this.selectDElement(selection, 'variant');
				})
			]
		}, 'w/PI-variant');
		this.se.selector('w/PrehledItems', (selectors) => {
			return [
				// selectors.operator((selection) => { // < t/Dcs
				// 	return this.selectDElement(selection, 'variant');
				// }),
				selectors.operator((selection) => {
					return this.selectDElement(selection, 'items');
				})
			]
		}, 'w/PI-items');
		
		// ...
		this.se.selector('w/PrehledItemsHeader', (selectors) => {
			return [
				selectors.operator((selection) => {
					return selection;
				})
			]
		}, 'w/PIH');
		this.se.selector('w/PrehledItemsHeader', (selectors) => {
			return [
				selectors.operator((selection) => {
					return this.selectDElement(selection, 'variant');
				})
			]
		}, 'w/PIH-variant');
		// Views
		// - v/Tasks
		this.se.selector('v/Tasks', (selectors) => {
			return [
				selectors.operator((selection) => {
					return this.selectDElement(selection, 'items');
				})
			]
		}, 'v/T-items');
	}

	selectorsV2() {
		this.al.log('AX3,App,Bo', '', 'Bootstrap - selectors - v2', [], null);
		
		this.se.selector('w/App', (selectors) => {
			return [
				selectors.operator((selection) => {
					return this.selectDElement(selection, 'outletTarget');
				})
			]
		}, 'w/App-outletTarget');

		this.se.selector('w/Loger', (selectors) => {
			return [
				selectors.operator((selection) => {
					return this.selectDElement(selection, 'action');
				})
			]
		}, 'w/Loger-action');

		// WIDGETS - AUTH
		// w/Loger

		this.se.selector('w/Loger', (selectors) => {
			return [
				selectors.operator((selection) => {
					return this.selectDElement(selection, 'action');
				})
			]
		}, 'w/Loger-action');

		// - w/LogIn
		this.se.selector('w/LogIn', (selectors) => {
			return [
				selectors.operator((selection) => {
					return selection;
				})
			]
		}, 'w/LI');

		this.se.selector('w/LogIn', (selectors) => {
			return [
				selectors.operator((selection) => {
					return selectors.dm.path(['w/LogIn','el/b-logIn']).result.block;
				})
			]
		}, 'w/LogIn-block');

		this.se.selector('w/LogIn', (selectors) => {
			return [
				selectors.operator((selection) => {
					return this.selectDElement(selection, 'infoMessage');
				})
			]
		}, 'w/LogIn-infoMessage');

		// - w/signIn
		this.se.selector('w/SignIn', (selectors) => {
			return [
				selectors.operator((selection) => {
					return selectors.dm.path(['w/SignIn','el/b-register']).result.block;
				})
			]
		}, 'w/SignIn-block');

		this.se.selector('w/SignIn', (selectors) => {
			return [
				selectors.operator((selection) => {
					return this.selectDElement(selection, 'infoMessage');
				})
			]
		}, 'w/SignIn-infoMessage');

		this.se.selector('w/SignIn', (selectors) => {
			return [
				selectors.operator((selection) => {
					return selection;
				})
			]
		}, 'w/SI');

		this.se.selector('w-tg/any', (selectors) => {
			return [
				selectors.operator((selection) => {
					return selection;
				})
			]
		}, 'w/tgi');

		this.se.selector('w-t/any', (selectors) => {
			return [
				selectors.operator((selection) => {
					return selection;
				})
			]
		}, 'w/ti');

		// ...
		this.se.selector('w/ItemEditor', (selectors) => {
			return [
				selectors.operator((selection) => {
					return selection;
				})
			]
		}, 'w/IE');
		// - w/prehledItems
		this.se.selector('w/PrehledItems', (selectors) => {
			return [
				selectors.operator((selection) => {
					return this.selectDElement(selection, 'variant');
				})
			]
		}, 'w/PI-variant');
		this.se.selector('w/PrehledItems', (selectors) => {
			return [
				// selectors.operator((selection) => { // < t/Dcs
				// 	return this.selectDElement(selection, 'variant');
				// }),
				selectors.operator((selection) => {
					return this.selectDElement(selection, 'items');
				})
			]
		}, 'w/PI-items');
		
		this.se.selector('w/PrehledItemsHeader', (selectors) => {
			return [
				selectors.operator((selection) => {
					return this.selectDElement(selection, 'variant');
				})
			]
		}, 'w/PIH-variant');
		// Views
		// - v/Tasks
		this.se.selector('v/Tasks', (selectors) => {
			return [
				selectors.operator((selection) => {
					return this.selectDElement(selection, 'items');
				})
			]
		}, 'v/T-items');
		// - v/TaskGroups
		this.se.selector('v/TaskGroups', (selectors) => {
			return [
				selectors.operator((selection) => {
					return this.selectDElement(selection, 'items');
				})
			]
		}, 'v/TG-items');

		// /Output-> selection
	}

	private selectDElement(selection, key:string):any {
		return Object.keys(selection).filter((sKey) => {
				return sKey == key;
			})
			.map(sKey => selection[sKey])[0];
	}
}