// angular
import { Injectable } from '@angular/core';
// flow
import { ALoger } from '../../flow/loger/loger';


@Injectable()
export class Operators {
	constructor(private al:ALoger) {
	}
	// [CORE]
	switchSM(stateA:any, stateB:any, ds_tateM:any):any { // /5m+ /13m
		// < t/Todo: prepinani - vnorenych,paraelnich stavů
		let  ds_tateMSwitched = ds_tateM
			.map((state) => { // < copy ds/
				return { active: state.active,  name: state.name };
			})
			.map((state:any) => { // modife copied ds/
				switch (state.name) {
					case stateA:
						state.active = state.active == true ? false : true;
						return state;
					case stateB:
						state.active = state.active == true ? false : true;
						return state;	
					default: {
					  return state;
					}
				}
			});
		return ds_tateMSwitched;
	}

	saveToken(user:any) { // < t/Mock
		this.al.log('App,In,Op', undefined, '-> op/save token: %s', [user.token], null);
	}

	destroyToken(user:any) { // < t/Mock
		this.al.log('App,In,Op', undefined, '-> op/destroy token: %s', [user.token], null);
	}

	public convertJSONData(JSONData:any[], Type:any):any {
		return JSONData.map((data:any) => { // < tDcs
			return data;
		});
	}

	// // op/switchToSM()
	// /*OK*/static switchToSM(stateToSwitch:string, ds_tateM:any) { // /3m
	// 	let currentState = dsStateMachine.find((state) => {
	// 		return state.active == true;
	// 	})

	// 	Operators.switchSM(currentState.name, stateToSwitch);
	// }

	// // [CORE, STATE MACHINE-API]
	// /*OK*/static getActiveSM(dsStateMachine:any):any { // /5m
	// 	return dsStateMachine.find((state) => {
	// 		return state.active == true;
	// 	});
	// }

	// /*OK*/static switchValue(value:any, valueA:any, valueB:any) { // /11m
	// 	return value == valueA ? valueB : valueA;
	// }

	// // [UI]
	// /*//*/static switchElement(parent:string, elementName:any, elementID?:any,) { // < t/Todo: // /15:42-
	// 	return null;
	// }

	// // [CRUD]
	// /*OK*/static create(dnType:any, cfgObejct:any):any { // /8m
	// 	return this.server.create(dnType, cfgObejct);
	// }

	// /*D1,OK*/static delete(dnType:any, id:any):any { // /5m
	// 	return this.server.delete(dnType, id);
	// }

	// // [Auth-API] 
	// /*D1,OK*/static destroyToken(token:string):string { // /19m
	// 	return this.jwtService.destroyToken();;
	// }

	// /*OK*/static saveToken(token:string):string { // /19m
	// 	return this.jwtService.saveToken(token);
	// }

	// // [DNode-Operators, Get]
	// /*D1,OK*/static getTasksTodoCount(taskGroup:any):number { // /5m
		
	// 	let tasksTodo:any[] = taskGroup.tasks.filter((task:any) => {
	// 		return task.stateWork == false;
	// 	});
	// 	return tasksTodo.length;
	// }

	// /*D1,OK*/static getTasksDoneCount(taskGroup:any):number { // /5m
	// 	let tasksDone:any[] = taskGroup.tasks.filter((task:any) => {
	// 		return task.stateWork == true;
	// 	});
	// 	return tasksDone.length;
	// }

	// /*D1,OK*/static agregateOdpCas(taskGroup:any):number {

	// 	let tasksOdpCas:number = 0;
	// 	let tasksDone:any[] = taskGroup.tasks.forEach((task:any) => {
	// 		tasksOdpCas += task.odpCas;
	// 	});
	// 	return tasksOdpCas;
	// }

	// /*D1,OK*/static checkUserInnputs(user:any, authActionType:string):any {
	// 	switch (authActionType) {
	// 		case "logIn":
	// 			if (this.checkName(user.name) && 
	// 				this.checkPassword(user.name)) {
	// 				return true;
	// 			}
	// 			else {
	// 				return false;
	// 			}
	// 			break;
			
	// 		case "register":
	// 			if (this.checkName(user.name) && 
	// 				this.checkEmail(user.email) && 
	// 				this.comparePasswords(user.password, user.checkPassword)) {
	// 				return true;
	// 			}
	// 			else {
	// 				return false;
	// 			}
	// 			break;
	// 	}
	// }

	// private static checkName(name:string):boolean { // < t/Todo:
	// 	return true;
	// }

	// private static checkEmail(email:string):boolean { // < t/Todo:
	// 	return true;
	// }

	// private static checkPassword(password:string):boolean { // < t/Todo:
	// 	return true;
	// }

	// private static comparePasswords(password:string, checkPassword:string):boolean { // < t/Todo:
	// 	return true;
	// }
}

// export class SubActions {

// 	// [...]
// 	static navigateTo(url:string) {
// 		return null;
// 	}

// 	/*OK*/static logIn(name:string, password:string) { // /10m
// 		let user = {
// 			name: name,
// 			password: password,
// 		}
// 		return this.server.logIn(user).map((res) => {
// 			return res;
// 		})
// 	}

// 	/*OK*/static register(name:string, email:string, password:string) {
		
// 		let user = {
// 			name: name,
// 			email: password,
// 			password: password,
// 		}

// 		return this.server.register(user).map((res) => {
// 			return res;
// 		})
// 	}
// }