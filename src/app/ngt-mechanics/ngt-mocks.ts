// angular
import { Injectable } from '@angular/core';
// app
import { User } from './ngt-states';

@Injectable()
export class Mock {
	
	constructor() {
		// code...
	}

	// MOCK DATA TYPES
	taskGroups(mockAction:any, count?:number):any|any[] {
		let mocked:any|any[] = [];
		switch (mockAction) {
			case "one":
				mocked = this.createDType('TaskGroup');
				return mocked;
			
			case "many":
				mocked = this.generate('TaskGroup', count);
				return mocked;
		}
	}

	tasks(mockAction:any, count?:number):any|any[] {
		let mocked:any|any[] = [];
		switch (mockAction) {
			case "one":
				mocked = this.createDType('Task');
				return mocked;
			
			case "many":
				mocked = this.generate('Task', count);
				return mocked;
		}
	}

	// MECHANICS
	private generate(dataType:string, count:number):any[] {

		let generated = [];
		for (var i = 0; i < count; ++i) {
			generated.push(this.createDType(dataType, i));
		}
		return generated;
	}

	private createDType(dataType:string, index?:number):any {
		switch (dataType) {
			case "Task":
				return { name: index ? 'task'+index : 'task', odpCas:<number> this.getRandomNum() };
			
			case "TaskGroup":
				return { name: index ? 'taskGroup'+index : 'taskGroup', odpCas:<number> this.getRandomNum() };
		}
	}

	private getRandomNum():number { // t/Todo:
		return 10;
	}
}