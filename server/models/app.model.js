var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
//var slug = require('slug');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;

// < Project,Task
var updateData = function (updatedDNodes, next) {

	// a/akce updatu // X/
	// this.progres = this.tasks ? this.agregateProgres(this.tasks, this.tasks.length) : this.progres;
	// updatedDNodes.push(this);

	// if(this.parent) {
	// 	var parent = this.populate('parent');
	// 	parent.updateData(updatedDNodes);
	// }

	return new Promise((resolve, reject) => {

		
		console.log('<-(reg-pr) update data - obj/%s, next/%s', this.name, next);

		updatedDNodes.push({ prObj:this, resolve: resolve, reject:reject });

		// a/akce updatu
		Promise.all([
			(this.tasks) ? this.agregateProgres() : this.progres,
		])
			.then((results) => {
				// update dat
				console.log('(res-pr)-> agregate progres/progres  - obj/%s', this.name)

				this.progres = results[0];

				// next /node/parent
				if(this.parent) {
					var obj = this;
					obj.populate('parent', (err, pUnit) => {
						console.log('(res-pr)-> populate /parent - obj/%s', this.name);

						var next1 = next + 1;
						pUnit.parent.updateData(updatedDNodes, next1)
							.then((resData) => {
								var next2 = resData.next - 1; 
								var prev = resData.updatedDNodes[next2]
								
								console.log('(res-pr-prev)-> update data - obj/%s, next/%s', this.name, next2);

								prev.resolve({ updatedDNodes: resData.updatedDNodes, next: resData.next2  });
							});
					});
				}
				else { // go Bakc resolve chained promises
					
					console.log('(res-pr-X)-> update data - obj/%s, next/%s', this.name, next);

					resolve({ updatedDNodes: updatedDNodes, next: next });
				}
			});
	});
}

var agregateProgres = function () {

	return new Promise((resolve, reject) => {

		
		console.log('<-(reg-pr) agregate progres  - obj/%s', this.name);

		var childsProgres = 0;

		this.populate('tasks', (err, pUnit) => {

			console.log('(res-pr)-> populate /tasks  - obj/%s', this.name);

			pUnit.tasks.forEach((task) => {
				childsProgres += task.progres;
			});
			
			childsCount = pUnit.tasks.length;
			var progres = (childsCount >= 0) ? Math.floor((childsProgres / childsCount)) : 0;
			console.log('- agregated /progres: %s  - obj/%s', progres, this.name);

			pUnit.progres = progres;
			pUnit.save().then(() => {
				resolve(progres);
			})		
		})
	})
}

// DN/User
// ------------------------------------------------------------------------------------
var SUser = new mongoose.Schema({
	
	username: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
 	email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
	
	projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
	tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  	hash: String,
  	salt: String,

}, {timestamps: true});

SUser.plugin(uniqueValidator, {message: 'is already taken'});

SUser.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

SUser.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

SUser.methods.generateJWT = function() {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

SUser.methods.toAuthJSON = function(){
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
  };
};

SUser.methods.toJSONFor = function(user){
  return {
    name: this.name,
    state: this.state,
  };
}

mongoose.model('User', SUser);

// DN/Project
// ------------------------------------------------------------------------------------
var SProject = new mongoose.Schema({
	
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	name:String,
	type:String,
	progres: { type: Number, default: 0 },
	color:String,
	state: {
		work:Boolean,
		selected:Boolean,
	},
	tRanNum:Number,
	tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
});

SProject.plugin(uniqueValidator, {message: 'is already taken'});

SProject.methods.updateData = function(updatedDNodes, next){
	return updateData.apply(this, [updatedDNodes, next]);
}

SProject.methods.addToParent = function(parentID){
	
	// a/check existence of parent inst // tTodo:
	// if(parentID ) { // X/
	// 	this.parent = parentID;
	// }

	return new Promise((resolve, reject) => {
		resolve(this);
	});
	
	// return this.save();
}

SProject.methods.removeFromParent = function(){
	
	// this.parent = null; // X/
	// return this.save();
	return new Promise((resolve, reject) => {
		resolve(this);
	});
}

SProject.methods.updateChilds = function(updatedDNodes){
	
	return new Promise((resolve, reject) => {
		var tasksToSave = []
		this.populate('tasks', (err, project) => {
			
			project.tasks.forEach((task) => {
				task.color = this.color;
				updatedDNodes.push({ prObj: task });
				tasksToSave.push(task.save())
			});

			Promise.all(tasksToSave)
				.then((results) => {
					resolve(updatedDNodes);
				})
		})
	});
}

SProject.methods.addChild = function(child) {
	
	return new Promise((resolve, reject) => {
		//this.tasks.push(child._id);

		this.tasks.addToSet(child._id);

		this.save().then(() => {

			resolve(this);
		})
		
		// this.save().then(() => {
		// 	resolve(this);
		// });
	})	
}

SProject.methods.removeChild = function(child) {
	
	return new Promise((resolve, reject) => {
		//this.tasks.push(child._id);

		this.tasks.remove(child._id);

		this.save().then(() => {
			resolve(this);
		})
		
		// this.save().then(() => {
		// 	resolve(this);
		// });
	})	
}

SProject.methods.setColor = function(prms, updatedDNodes){
	
	return new Promise((resolve, reject) => {

		this.color = prms.color;
		updatedDNodes.push({ prObj: this });

		this.save().then(() => {
			this.updateChilds(updatedDNodes)
				.then((_updatedDNodes) => {
					resolve({ updatedDNodes: _updatedDNodes});
				});
		})
	})
}

SProject.methods.agregateProgres = function(tasks, childsCount){ // < private tasks:Task[], childsCount:number
	return agregateProgres.apply(this, [tasks, childsCount]);
}

SProject.methods.toJSONFor = function(project){
  return {
    name: this.name,
    id: this._id,
    type: this.type,
    state: this.state,
    progres: this.progres,
    color: this.color
  };
}

mongoose.model('Project', SProject);

// DN/Task
// ------------------------------------------------------------------------------------
var STask = new mongoose.Schema({
	
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	name:String,
	type:String,
	// parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
	// parentModelRef: { type: String, default: 'Project' }, // X/
	termin:Date,
	progres: { type: Number, default: 0 },
	priority:Number,
	odpCas: { type: Number, default: 0 },
	//color:String,
	state: {
		work:Boolean,
		selected:Boolean,
	},
	// tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }], // tTodo:
});

// STask.plugin(uniqueValidator, {message: 'is already taken'}); // tX

STask.methods.updateData = function(updatedDNodes, next){
	// updateData.apply(this, [updatedDNodes]);
	return updateData.apply(this, [updatedDNodes, next]);
}

STask.methods.agregateProgres = function(tasks, childsCount){ // < private tasks:Task[], childsCount:number
	return agregateProgres.apply(this, [tasks, childsCount]);
}

STask.methods.saveProgres = function(prms, updatedDNodes){ // < public progresIncrease:number
	
	return new Promise((resolve, reject) => {

		// a/save progres
		console.log('<-(reg-pr) - save progres');

		var progresToSet = this.progres + prms.progresIncrease;

		if(progresToSet <= 100) {
			this.progres = progresToSet;
		}
		else {
			this.progres = progresToSet - 100;
		}
		
		this.save().then(() => {
				console.log('save new progres on/%s', this.name);

				this.updateData(updatedDNodes, 0)
					.then((resData) => {
						console.log('(res-pr)-> update data/%s -> res', resData.next);

						resolve({ updatedDNodes: resData.updatedDNodes, next: resData.next  });
					});
			})
	});
}

STask.methods.addToParent = function(parentID){
	
	// a/check existence of parent inst // tTodo:
	// if(parentID ) { // X/
	// 	this.parent = parentID;
	// }

	// return new Promise((resolve, reject) => {

	// 	if(this.parent) {
	// 		this.populate('parent', (err, task) => {
	// 			//task.parent.tasks.push(task._id);
	// 			task.parent.addChild(task).then((result) => {
	// 				resolve(task);
	// 			});
				
	// 			// task.parent.save().then(() => {
	// 			// 	resolve(task);
	// 			// })
	// 		})
	// 	}
	// 	else {
	// 		resolve(this);
	// 	}	
	// });
	
	return new Promise((resolve, reject) => {
		resolve(this);
	});

	// return this.save();
}

STask.methods.removeFromParent = function(){
	
	// this.parent = null; // X/
	// return this.save();
	return new Promise((resolve, reject) => {
		if(this.parent) {
			this.populate('parent', (err, task) => {

				//var idToRemoveIndex = task.parent.tasks.indexOf(task._id);
				task.parent.removeChild(task).then((result) => {
					resolve(task);
				});
				// task.parent.save().then(() => {
				// 	resolve(task);
				// })
			})
		}
		else {
			resolve(this);
		}
		
	});
}

STask.methods.toJSONFor = function(task){
  return {
    name: this.name,
    id: this._id,
    type: this.type,
    state: this.state,
    parentID: this.parent,
    //termin: this.termin.toDateString(),
    progres: this.progres,
    priority: this.priority,
    //color: this.color,
  };
}

mongoose.model('Task', STask);

// var SDataModel = new mongoose.Schema({
	
// 	tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
// 	projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],

// }, {timestamps: true});

// mongoose.model('DataModel', SDataModel);
