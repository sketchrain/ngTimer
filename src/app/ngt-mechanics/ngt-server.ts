// angular
import { Injectable } from '@angular/core';
import { Headers, Http, Response, URLSearchParams } from '@angular/http';
// rxjs
import { Observable, throwError, Subject } from 'rxjs';
import {
  catchError,
  map
} from 'rxjs/operators';
// flow
import { ALoger } from '../../flow/loger/loger';
// app
import { environment } from '../../environments/environment'
import * as IM from './ngt-in';

// OBEJCTS
class ServerResponse {
	
	succes:boolean;
	data:any;

	constructor() {

	}
}

class DBase {
	
	users:any[]
	tasks:any[]

	constructor() {
		
		this.users = [
			{ name:'user1', id:0, email:'user1@gmail.com', password:'user1-1234' },
			{ name:'user2', id:0, email:'user2@gmail.com', password:'user2-1234' }
		]
		this.tasks = [
			{ name: 't1', id:0, odpCas: 0, open:false, ref_user:0,
				timeCounter: { state:'stoped' }  // < 
			},
			{ name: 't2', id:1, odpCas: 0, open:true, ref_user:0,
				timeCounter: { state:'running' } 
			},
		];
	}
}

// SERVICES
@Injectable()
export class JwtService {

	getToken():string {
	  	return window.localStorage['jwtToken'];
	}

	saveToken(token:string) {
	  	window.localStorage['jwtToken'] = token;
	}

	destroyToken() {
	  	window.localStorage.removeItem('jwtToken');
	}
}

@Injectable()
export class ApiService {
	
	constructor(
		private http: Http,
		private jwtService: JwtService
		) {}

	private setHeaders(): Headers {

		let userToken = this.jwtService.getToken();

		const headersConfig = {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		};

		if (this.jwtService.getToken()) { // tDcs
			headersConfig['Authorization'] = `Token ${this.jwtService.getToken()}`;
		}

		return new Headers(headersConfig);
	}

	private formatErrors(error: any) {
		return throwError(error.json());
	}

	get(path: string, params: URLSearchParams = new URLSearchParams()): Observable<any> {
		let req = this.http.get(`${environment.api_url}${path}`, { headers: this.setHeaders(), search: params })
			.pipe(
				catchError((err) => {
					return this.formatErrors(err);
				}),
				map((res:Response) => {
					return res.json();
				})
			)
		return req;
		//.catch(this.formatErrors)
		// .map((res: Response) => {
		// 	return res.json();
		// });
	}

	put(path: string, body: Object = {}): Observable<any> {
		return this.http.put(
			`${environment.api_url}${path}`,
			JSON.stringify(body),
			{ headers: this.setHeaders() }
			)
		.pipe(
			catchError((err) => {
				return this.formatErrors(err);
			}),
			map((res:Response) => {
				return res.json();
			})
		)
	}

	post(path: string, body: Object = {}): Observable<any> {
		return this.http.post(
			`${environment.api_url}${path}`,
			JSON.stringify(body),
			{ headers: this.setHeaders() }
			)
		.pipe(
			catchError((err) => {
				return this.formatErrors(err);
			}),
			map((res:Response) => {
				return res.json();
			})
		)
	}

	delete(path): Observable<any> {
		return this.http.delete(
			`${environment.api_url}${path}`,
			{ headers: this.setHeaders() }
			)
		.pipe(
			catchError((err) => {
				return this.formatErrors(err);
			}),
			map((res:Response) => {
				return res.json();
			})
		)
	}
}

export class SResponse {

	type:string;

	constructor(type:string, clbRes:any) {
		this.type = type;
	}
}

@Injectable()
export class ServerAPI {
	
	projectsCount:number = 0;
	tasksCount:number = 0;

	respones:SResponse[];

	constructor (
		private apiService: ApiService
		) {}

	// AUTH
	logIn(user:IM.IDUser, clbResponse:any, dbg?:any):Subject<any>  { // OK/ 15m
		
		let result = new Subject<any>();
		let res = new ServerResponse();

		this.apiService.post('/users/login', {
			user: {
				...user,
			}
		})
			.subscribe(
				(resJSON:any) => {
					res.data = resJSON;
					res.succes = true;

					let _next = clbResponse(res);
					result.next(_next);
				},
				(err) => {
					res.succes = false;

					let _next = clbResponse(res);
					result.next(_next);
				}
			)

		return result;
	}

	getUser(userToken:string, clbResponse:any, dbg?:any):Subject<any> {
		
		let result = new Subject<any>();
		let res = new ServerResponse();

		this.apiService.get('/user')
			.subscribe(
				(resJSON:any) => {
					res.data = resJSON;
					res.succes = true;

					let _next = clbResponse(res);
					result.next(_next);

				},
				(err) => {
					res.succes = false;

					let _next = clbResponse(res);
					result.next(_next);
				}
			);		
		return result;
	}

	register(user:IM.IDUser, clbResponse:any, dbg?:any):Subject<any> {
		
		let result = new Subject<any>();
		let res = new ServerResponse();

		this.apiService.post('/users', { user: { ...user } })
			.subscribe(
				(resJSON:any) => {
					res.data = resJSON;
					res.succes = true;

					let _next = clbResponse(res);
					result.next(_next);

				},
				(err) => {
					res.succes = false;

					let _next = clbResponse(res);
					result.next(_next);
				}
			);		
		return result;
	}

	select(q:IM.IQuery, clbResponse:any, dbg?:any) {
		let result = new Subject<any>();
		let res = new ServerResponse();

		this.apiService.post('/select/'+q.Type)
			.subscribe(
				(resJSON:any) => {
					res.data = resJSON.types;
					res.succes = true;

					let _next = clbResponse(res);
					result.next(_next);

				},
				(err) => {
					res.succes = false;

					let _next = clbResponse(res);
					result.next(_next);
				}
			);		
		return result;
	}

	create(dNode:any, cfg:any, clbResponse:any, dbg?:any) {
		let result = new Subject<any>();
		let res = new ServerResponse();

		let dNodeName = dNode.name;
		this.apiService.post('/create/'+dNodeName, { typeCfg: cfg })
			.subscribe(
				(resJSON:any) => {
					res.data = resJSON.createdTypeInst;
					res.succes = true;

					let _next = clbResponse(res);
					result.next(_next);

				},
				(err) => {
					res.succes = false;

					let _next = clbResponse(res);
					result.next(_next);
				}
			);		
		return result;
	}

	delete(dNode:any, id:any, clbResponse:any, dbg?:any) {
		let result = new Subject<any>();
		let res = new ServerResponse();

		let dNodeName = dNode.name;
		this.apiService.delete('/delete/'+dNodeName+'/'+id)
			.subscribe(
				(resJSON:any) => {
					res.data = resJSON.deletedTypeInst;
					res.succes = true;

					let _next = clbResponse(res);
					result.next(_next);

				},
				(err) => {
					res.succes = false;

					let _next = clbResponse(res);
					result.next(_next);
				}
			);		
		return result;
	}

	update(dNode:any, id:any, cfg:any, clbResponse:any, dbg?:any) {
		let result = new Subject<any>();
		let res = new ServerResponse();

		let dNodeName = dNode.name;
		this.apiService.put('/update/'+dNodeName+'/'+id, { typeUpdate: cfg })
			.subscribe(
				(resJSON:any) => {
					res.data = resJSON.updatedTypeInst;
					res.succes = true;

					let _next = clbResponse(res);
					result.next(_next);

				},
				(err) => {
					res.succes = false;

					let _next = clbResponse(res);
					result.next(_next);
				}
			);		
		return result;
	}

	// register() {
	// }

	// getUser() {
	// }

	// CRUD
	// create() {
	// }

	// delete() {
	// }

	// update() {
	// }

	// SELECTIONS
	// select() {
	// }

	// ...
	// get2(type:any, instance:string, actions:any[], qName?:string):Observable<Query> {
		
	// 	// set query
	// 	let _query = new Query(qName, type, instance);
	// 	let svQuery = this.setQueryToServer(_query);
	// 	svQuery.actions = actions ? actions : [];
		
	// 	// request to /server
	// 	debugger;
	// 	return  this.apiService.post(Utils.str.sub('/get2/%s/%s', [type, instance]), svQuery) // tDcs
	// 	.map((dbOutput) => {
	// 		debugger;
	// 		console.log('get2 output:', dbOutput);
	// 		let query:Query = new Query('query', svQuery.type, svQuery.id, dbOutput.updatedData);
	// 		return query;
	// 	});
	// }

	// get(type:any, instance:string):Observable<Query> {
	// 	return this.apiService.get(Utils.str.sub('/get/%s/%s', [type, instance])) // tDcs
	// 	.map((dbOutput) => {
	// 		debugger;
	// 		let query:Query = this.dataModel.updateDataModel(new Query('query', type, instance, dbOutput.typeInst));
	// 		//let dbOutput =  { type: type, data: dNode}; // from/DB -> ...
	// 		return query;
	// 	});
	// 	//return this.mockGet(type);
	// }

	// private mockGet(type:any):Observable<{ type:string, data:any }> {

	// 	switch (type) {
	// 		case "Project":
	// 			let project = this.createDType(Project, type, this.projectsCount, { progres: 20, state: {work:false, selected:false} } );
	// 			this.projectsCount++; 
	// 			return Observable.from([{ type:'Project', data: project }]);
			
	// 		case "Task":
	// 			let task = this.createDType(Task, type, this.tasksCount, { progres: 10, state: {work:false, selected:false} } );
	// 			this.tasksCount++; 
	// 			return Observable.from([{ type:'Task', data: task }]);
	// 	}
	// }

	// getAll(type:any, limit:string, offset:string):Observable<Query> { // -> { type:DType, data: //from/DB }
		
	// 	const params: URLSearchParams = new URLSearchParams(); // tDCs
	// 	params.set('limit', limit);
	// 	params.set('offset', offset);

	// 	return this.apiService.get(Utils.str.sub('/getAll/%s', [type]), params)
	// 	.map((data) => {
	// 		// poz./implemenovat interface outputs db/
	// 		let query:Query = this.dataModel.updateDataModel(new Query('query', 'A'));
	// 		//let dbOutput =  { type: type, data: dNode}; // from/DB -> DBOutput { types: [Project] }
	// 		return query;
	// 	});  

	// 	//return this.mockGetAll(type, limit);
	// }

	// private mockGetAll(type:any, limit:string):Observable<{ type:string, data:any }> {

	// 	let typesLimit = +limit;

	// 	switch (type) {
	// 		case "Project":
	// 			let projects:Project[] = this.generateDTypes(Project, type, typesLimit, this.projectsCount, { progres: 20, state: { work:false, selected:false } });
	// 			this.projectsCount += projects.length; 
	// 			return Observable.from([{ type:'Project', data: projects }]);
			
	// 		case "Task":
	// 			let tasks:Task[] = this.generateDTypes(Task, type, typesLimit, this.tasksCount, { progres: 10, state: { work:false, selected:false } });
	// 			this.tasksCount += tasks.length; 
	// 			return Observable.from([{ type:'Project', data: tasks }]);
	// 	}
	// }

	// select2(_query:Query):Observable<Query> {

	// 	let svQuery = this.setQueryToServer(_query);
	// 	// tTodo:
	// 	return this.apiService.post(Utils.str.sub('/select2/%s', [svQuery.type]), svQuery)
	// 	.map((dbOutput) => {
	// 		//debugger;
	// 		let query:Query = this.dataModel.updateDataModel(new Query('query', svQuery.type, svQuery.id, dbOutput.typeInst));
	// 		query.childs = _query.childs;
	// 		//let dbOutput =  { type: type, data: data}; // from/DB -> DBOutput { types: [Project] }
	// 		return query;
	// 	});
	// }

	// private setQueryToServer(_query:Query):any {
	// 	let query = {
	// 		type: _query.type,
	// 		id: _query.id,
	// 		filters: this.setQueryFilters(_query),
	// 		actions: [],
	// 	}
	// 	return query;
	// }

	// private setQueryActions(_query:Query):any[] { // tTodo:
	// 	return null;
	// }

	// private setQueryFilters(_query:Query):any[] {
	// 	let selectedQFilters:any[] = _query.childs.filter((qChild:any) => {
	// 		return (qChild instanceof QueryFilter) ? true : false;
	// 	});

	// 	let filters:any[] = [];
	// 	selectedQFilters.forEach((qFilter) => {
	// 		filters.push(qFilter.filter);
	// 	});

	// 	return filters;
	// }

	// select(type:any, limit:string, offset:string, dataFilter:IDataFilter):Observable<Query> {
		
	// 	let body:any = {
	// 		type: type,
	// 		limit: limit,
	// 		offset: offset,
	// 		dataFilter: dataFilter,
	// 	}

	// 	return this.apiService.post(Utils.str.sub('/select/%s', [type]), body)
	// 	.map((dbOutput) => {
	// 		let query:Query = this.dataModel.updateDataModel(new Query('query', type, null, dbOutput.types));
	// 		//let dbOutput =  { type: type, data: data}; // from/DB -> DBOutput { types: [Project] }
	// 		return query;
	// 	});
	// }

	// agregate(types:any[], value:string):Observable<{ type:string, data:any }> {
		
	// 	let body:any = {
	// 		types: types,
	// 		value: value,
	// 	}

	// 	return this.apiService.post(Utils.str.sub('/select', []), body)
	// 	.map(data => data);
	// }

	// create(type:any, typeCfg:any, name?:string):Observable<{ type:string, data:DNode }> {
	// 	let body:any = {
	// 		type: type,
	// 		typeCfg: typeCfg,
	// 	}

	// 	return this.apiService.post(Utils.str.sub('/create/%s', [type]), body)
	// 	.map((dbOutput) => {
	// 		let query:Query = new Query('createdData', type, null, dbOutput.createdTypeInst);
	// 		return query;
	// 	});
	// }

	// delete(type:any, instance:string) {
	// 	return this.apiService.delete(Utils.str.sub('/delete/%s/%s', [type, instance]))
	// 	.map((dbOutput) => {
	// 		let query:Query = new Query('createdData', type, null, null);
	// 		return query;
	// 	});
	// }

	// update(type:any, instance:string, typeUpdate:any):Observable<Query> {
	// 	let body:any = {
	// 		type: name,
	// 		instance: instance,
	// 		typeUpdate: typeUpdate,
	// 	}

	// 	debugger;
	// 	return this.apiService.put(Utils.str.sub('/update/%s/%s', [type, instance]), body)
	// 	.map((dbOutput) => {
	// 		let query:Query = this.dataModel.updateDataModel(new Query('query', type, instance, dbOutput.updatedTypeInst));
	// 		return query;
	// 	});
	// }

	// updateMany(updatedData:{ type:string, id:string, data:any }[]):Observable<{ type:string, data:DNode[] }> {
	// 	return null;
	// }

	// updateAll(type:any, typesCfg:any) { // tTodo
		
	// 	let body:any = {
	// 		type: name,
	// 		typeUpdate: typesCfg,
	// 	}

	// 	return this.apiService.put(Utils.str.sub('/updateAll/%s', [type]), body)
	// 	.map((dbOutput) => {
	// 		debugger;
	// 		let query:Query = this.dataModel.updateDataModel(new Query('query', type, null, dbOutput.updatedTypes));
	// 		return query;
	// 	});
	// }

	// add(type:any, instance:string, parentID:string):Observable<{ type:string, data:any }> {

	// 	let body:any = {
	// 		type: name,
	// 		instance: instance,
	// 		parentID: parentID,
	// 	}

	// 	return this.apiService.post(Utils.str.sub('/update', []), body)
	// 	.map(data => data);
	// }

	// remove(type:any, instance:string, parentID:string) {

	// 	return this.apiService.delete(Utils.str.sub('/delete/%s/%s/%s', [type, instance,parentID]));
	// }

	// private parseDBOutput(dbOutput: {type:string, data:any}):{ type:string, data:any } { //... tN,tTodo:
	// 	return null;
	// }

	// private generateDTypes(DType:any, name:string, count:number, typeInstCount:number, cfg?:any):any[] {
		
	// 	let typeInsts:any[] = [];
	// 	for (var i = 0; i < count; ++i) {
	// 		let typeInst = this.createDType(DType, name, (typeInstCount + 1 + i), cfg);
	// 		typeInsts.push(typeInst);
	// 	}
	// 	return typeInsts;
	// }

	// private createDType(DType:any,  name:string, typeInstCount:number, cfg?:any):any {
	// 	let typeInstId:string = '' + typeInstCount;
	// 	let typeInst = new DType(name + typeInstId, cfg);
	// 	typeInst._id = typeInstId;
	// 	return typeInst;
	// }
}

@Injectable()
export class ServerAPIMock {
	
	dBase:DBase;

	constructor(private al:ALoger) {
		this.dBase = new DBase();
	}

	// AUTH
	// -------------------------------------------------------
	logIn(user:any, dbg?:any):ServerResponse { // < t/Mock
		
		this.al.log('App,In,Sv', undefined, '--> op/server/logIn', [user], null);
		let res =  new ServerResponse();

		res.succes = dbg ? dbg.succes : true;
		res.data = {
			name:<string> 'user1',
			email:<string> 'user1@email.com',
			password:<string> '1234',
			checkPassword:<string> '1234',
			token:<string> 'tokenUser1',	
		};
		return res;
	}

	register(user:any, dbg?:any):ServerResponse { // < t/Mock
		
		this.al.log('App,In,Sv', undefined, '--> op/server/register:', [user], null);
		let res =  new ServerResponse();

		res.succes = dbg ? dbg.succes : true;
		res.data = {
			name:<string> 'user1',
			email:<string> 'user1@email.com',
			password:<string> '1234',
			checkPassword:<string> '1234',
			token:<string> 'tokenUser1',	
		};
		return res;
	}

	getUser(token:string, dbg?:any):ServerResponse { // < t/Mock
		
		this.al.log('App,In,Sv', undefined, '--> op/server/getUser:', [token], null);
		
		let res =  new ServerResponse();
		res.succes = dbg ? dbg.succes : true;
		
		res.data = {
			name:<string> 'user1',
			email:<string> 'user1@email.com',
			password:<string> '1234',
			checkPassword:<string> '1234',
			token:<string> 'tokenUser1',	
		};
		
		return res;
	}

	// CRUD
	create(DNode:any, cfg:any, dbg?:any) {  // < t/Mock
		
		this.al.log('App,In,Sv', undefined, '--> op/server/create:', [], { DNode: DNode, cfg:cfg });
		
		let res =  new ServerResponse();
		res.succes = dbg ? dbg.succes : true;
		
		res.data = res.succes ? this.mockCRUD_set1(dbg) : [];
		
		return res;
	}

	delete(DNode:any, id:string|number, dbg?:any) {  // < t/Mock
		
		this.al.log('App,In,Sv', undefined, '--> op/server/delete:', [], { DNode: DNode, id:id });
		
		let res =  new ServerResponse();
		res.succes = dbg ? dbg.succes : true;
		
		res.data = res.succes ? this.mockDelete(DNode, id, dbg) : [];
		return res;
	}

	update(DNode:any, id:string|number, cfg:any, dbg?:any) {  // < t/Mock

		this.al.log('App,In,Sv', undefined, '--> op/server/update:', [], { DNode: DNode, cfg:cfg });

		let res =  new ServerResponse();
		res.succes = dbg ? dbg.succes : true;
		
		res.data = res.succes ? this.mockUpdate(DNode, id, cfg, dbg) : [];
		
		return res;
	}

	private mockUpdate(DNode:any, id:string|number, cfg:any, dbg:any) {
		let _dbg = dbg ? dbg : { dataType: 'task' };
		switch (_dbg.dataType) {
			case "taskGroup":
				return [
					{ name: 'tg1', celkOdpCas: 0 },
				]
			
			case "task":
				let taskToUpdate:any = this.dBase.tasks.find(task => task.id == id);
				Object.keys(cfg).map((cfgKey) => {
					let newValue = cfg[cfgKey];
					Object.defineProperty(taskToUpdate, cfgKey, { value: newValue })
				})
				return taskToUpdate;
		}
	}

	private mockDelete(DNode:any, id:string|number, dbg:any) {
		let _dbg = dbg ? dbg : { dataType: 'task' };
		switch (_dbg.dataType) {
			case "taskGroup":
				return [
					{ name: 'tg1', celkOdpCas: 0 },
				]
			
			case "task":
				let taskToDelete = this.dBase.tasks.find(task => task.id == id);
				this.dBase.tasks.splice(this.dBase.tasks.indexOf(taskToDelete), 1)
				return taskToDelete;
		}
	}

	private mockCRUD_set1(dbg:any):any {
		let _dbg = dbg ? dbg : { dataType: 'task' };
		switch (_dbg.dataType) {
			case "taskGroup":
				return [
					{ name: 'tg1', celkOdpCas: 0 },
				]
			
			case "task":
				let newTask = { name: 'newTask', OdpCas: 0, id: this.dBase.tasks.length+1 };
				this.dBase.tasks.push(newTask);
				return newTask;
		}
	}

	// SELCTION
	// -------------------------------------------------------
	select(query:any, dbg?:any):ServerResponse { // < t/Mock
		
		this.al.log('App,In,Sv', undefined, '--> op/server/select:', [], { query: query });
		
		let res =  new ServerResponse();
		res.succes = dbg ? dbg.succes : true;

		res.data = res.succes ? this.mockSelectedData_set1(dbg) : [];

		return res;
	}

	private mockSelectedData_set1(dbg:any):any {
		let _dbg = dbg ? dbg : { dataType: 'tasks' };
		switch (_dbg.dataType) {
			case "taskGroups":
				return [
					{ name: 'tg1', id:0, celkOdpCas: 0 },
					{ name: 'tg2', id:1, celkOdpCas: 0 },
					{ name: 'tg3', id:2, celkOdpCas: 0 },
				]
			
			case "tasks":
				return this.dBase.tasks;
		}
	}
}
