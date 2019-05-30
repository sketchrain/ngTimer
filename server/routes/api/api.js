var router = require('express').Router();
var mongoose = require('mongoose');
//var MDataModel = mongoose.model('SDataModel');
var passport = require('passport');
var User = mongoose.model('User');
var MProject = mongoose.model('Project');
var auth = require('../auth');
var passportConfig = require('../../config/passport');
// var User = mongoose.model('User');
// var Task = mongoose.model('Task');
// var Project = mongoose.model('Project');

router.param('testprm', function(req, res, next, testprm) {
	return next();
});

router.get('/test-api/:testprm', function(req, res) { // Ok/impl // tDBG
	// console.log('test-api: %s');
	// console.log('test-api: %s');
	// console.log('test-api: %s');
	//return res.json({res: { test: true }});
	console.log('API: api/test-api/:testprm');
	return res.send("Hello World");
});

module.exports = router;

/* SV-API
-------------------------------------------------------

	/ - Legenda
		<-
		->

 	/ - Request/Response - data types
  	-----------------------------------------------------

	- Projects <-
	- Tasks <-
	- Task <- // TaskData [progres,state]
	- Project <- // ProjectData[progres]
	- AgreagtedProges <- [[Tasks]forNext7Days,[Tasks]forToday]
	- Errors and Status Codes
		- 422
		- 401 for Unauthorized requests, when a request requires authentication but it isn't provided
		- 403 for Forbidden requests, when a request may be valid but the user doesn't have permissions to perform the action
		- 404 for Not found requests, when a resource can't be found to fulfill the request
	---

  	/ - End points (19ep)
	-----------------------------------------------------

	// < GET,POST r/Root/ 
		// r/api/;
			// r/articles;
				// < GET r/feed
				// < r-p/:article,:comments
				---------------------------------------------------------
					- a/vyber [DataElement] -> a/handle /Errors
					- GET /api/articles/:slug <-X / -> Article // Get Article
				// < GET,PUT,DELETE r/:article
					// < GET,POST r/:article/comments
						// < GET,POST r/:article/comments:comment

					// < DELETE,POST r/:article/favorite

			// r/tags;
			// r/users;
			// r/user;
			// r/profiles;

		// < r-p/

	
	// Standartni akce
	// - queries
	------------------------------------
		- a/vyber [DataElements]
		- a/vybar [DataElements] - filturuj /DE from [DECollection]
		- a/vyber [DataElement] -> a/handle /Errors
	// - CRUD akce pro [DataElemnt]
	------------------------------------
		- a/CRUD - create
		- a/CRUD - delete
		- a/CRUD - update

	// Serever API - Ende points - doc
	// ----------------------------------------------------
	
	- PUT api/update -> User / <- User, auth, prms // > [Task(s),Project(s)]
	- POST api/create > [Task(s),Project(s)]
	- DELETE api/delete > [Task(s),Project(s)]
	- PUT api/remove > [Task(s)]
	- PUT api/add > [Task(s)]
	- GET api/get > [Task(s),Project(s)]
	- GET api/select > [Task(s)]
	- GET api/agragate > [Task(s)]
	---
		/ - Prms
		-------------------------------------------
		- type:[DataElementType]
		- instance:number/string<name>

	- POST /api/users/login -> User / <- User // Authentication: // < r/
	- POST /api/users -> Use / <- User // Registration
	- GET /api/user -> X / <- User, auth // Get Current User
	- PUT /api/user -> X / <- User, auth // Update User
	- GET /api/profiles/:username <-X / -> Profile, (auth) // Get Profile
	- POST /api/profiles/:username/follow <-X / -> Profile, auth  // Follow user
	- DELETE /api/profiles/:username/follow <-X / -> Profile // Unfollow user
	- GET /api/articles <-X / -> Article[], auth,params  // List Articles
		//  Returns most recent articles globally by default, provide tag, author or favorited query parameter to filter results
		/ - Params
		Filter by tag:
		?tag=AngularJS
		Filter by author:
		?author=jake
		Favorited by user:
		?favorited=jake
		Limit number of articles (default is 20):
		?limit=20
		Offset/skip number of articles (default is 0):
		?offset=0
	- GET /api/articles/feed <-X / -> Article[], auth,params // Feed Articles
		/ - Params
		-> viz./ GET /api/articles
	- POST /api/articles <- CreatedArticle / -> Article, auth // Create Article
	- PUT /api/articles/:slug <- UpdatedArticle / -> Article, auth  // Update Article
	- DELETE /api/articles/:slug <- X / -> X, auth // Delete Article
	- POST /api/articles/:slug/comments <- CreatedComment / -> Comment, auth // Add Comments to an Article
	- GET /api/articles/:slug/comments <- X / -> Comment[], (auth) // Get Comments from an Article
	- DELETE /api/articles/:slug/comments/:id <- X / -> X, auth // Delete Comment
	- POST /api/articles/:slug/favorite <- X / -> X, auth  // Favorite Article
	- DELETE /api/articles/:slug/favorite <- X / -> X, auth // Unfavorite Article
	- GET /api/tags  <- X / -> Tag[] // Get Tags
	*/

router.param('type', function(req, res, next, type) { // Ok/impl
	var SelectedModel = mongoose.connection.model(type);
	req.SelectedModel = SelectedModel;
	req.ObjType = type;
	console.log('pHS - /:type: %s', req.param('type'));
	console.dir(req.SelectedModel);
	return next();
});

router.param('types', function(req, res, next, types) { // Ok/impl
	
	console.log('pHS - /:types: %s', types);
	var selectedModels = [];
	if(types) {
		var parsedTypes = types.split('-');
		console.log('pHS - parsed types:', parsedTypes);
		selectedModels = parsedTypes.map((type) => {
			let SelectedModel = mongoose.connection.model(type);
			console.log('pHS - add selected Model to stack:', SelectedModel);
			return SelectedModel;
		});
		console.log('pHS - selectedModels:', selectedModels);
	}

	req.selectedModels = selectedModels;
	return next();
	// console.log('/');
	// return next();
});

router.param('instance', function(req, res, next, instance) { // Ok/impl
	
	console.log('pHS - slecte /:instance');
	req.SelectedModel.findById(instance)
	.then((docSelection) => {
		if (!docSelection) { return res.sendStatus(404); }
		req.docSelection = docSelection;
		console.log('pHS - /:instance: %s', req.param('instance'));
		console.log('pHS - doc selection -> ');
		console.dir(req.docSelection);
		return next();
	})
	.catch(next);
});

// K/USER
// ziskat user
router.get('/user', auth.required, function(req, res, next){

	debugger;
	User.findById(req.payload.id).then(function(user){
		if(!user){ return res.sendStatus(401); }

		return res.json({user: user.toAuthJSON()});
	}).catch(next);
});

// update user
router.put('/user', auth.required, function(req, res, next){
	// User.findById(req.payload.id).then(function(user){
	// 	if(!user){ return res.sendStatus(401); }

    // only update fields that were actually passed...
  //   if(typeof req.body.user.username !== 'undefined'){
  //   	user.username = req.body.user.username;
  //   }
  //   if(typeof req.body.user.email !== 'undefined'){
  //   	user.email = req.body.user.email;
  //   }
  //   if(typeof req.body.user.bio !== 'undefined'){
  //   	user.bio = req.body.user.bio;
  //   }
  //   if(typeof req.body.user.image !== 'undefined'){
  //   	user.image = req.body.user.image;
  //   }
  //   if(typeof req.body.user.password !== 'undefined'){
  //   	user.setPassword(req.body.user.password);
  //   }

  //   return user.save().then(function(){
  //   	return res.json({user: user.toAuthJSON()});
  //   });
  // }).catch(next); // tTodo:
});

// login /user
router.post('/users/login', function(req, res, next){
	if(!req.body.user.email){
		return res.status(422).json({errors: {email: "can't be blank"}});
	}

	if(!req.body.user.password){
		return res.status(422).json({errors: {password: "can't be blank"}});
	}

	passport.authenticate('local', {session: false }, function(err, user, info){
		
		if(err){
			return next(err); 
		}

		if(user){
			console.log('pRA-Lo - v');
			//user.token = user.generateJWT();
			userJSON = user.toAuthJSON();
			return res.json(userJSON);
		} else {
			return res.status(422).json(info);
		}
	})(req, res, next);
});

// register /user
router.post('/users', function(req, res, next){

	console.log('pRA-Re - create new user');
	var user = new User();

	user.username = req.body.user.name;
	user.email = req.body.user.email;
	user.setPassword(req.body.user.password);

	user.save().then(function(){
		var userJSON = user.toAuthJSON();
		console.log('api/user - res', userJSON);
		return res.json(userJSON);
	}).catch(next);
});

// K/QUERIES
router.get('/get/:type/:instance', auth.required, function(req, res, next) { // Ok/impl //dc/ auth.required, :type/:instace
	
	console.log('pRA-Ge -/api/get');

	Promise.all([
		req.payload ? User.findById(req.payload.id) : null, // tDcs
		//User.findOne({ username: 'sketchrain' }),
		]).then(function(results){
			var user = results[0];
			console.log('pRA-Ge - results -> '); console.dir(results);
			console.log('pRA-Ge - return response ');
			return res.json({typeInst: req.docSelection.toJSONFor(user)});
		}).catch(next);
});

router.post('/get2/:type/:instance', auth.required, function(req, res, next) {

	// a/vyber konkretniho /DNode
	// a/provedeni akci na tomto /DNode
	var req = req;

	Promise.all([
		req.payload ? User.findById(req.payload.id) : null, // tDcs
		]).then(function(results){
			var user = results[0];

			if(req.body.actions.length > 0) { // req.body.actions.length > 0
				var updatedDNodes = [];
				// 1/ tDBG
				// Promise.all([
				// 	req.SelectedModel
				// 		.findOne({ name: 'new taskA' })
				// 		.populate('parent') // only works if we pushed refs to children
				// 		.exec(function (err, task) {
				// 			if (err) return handleError(err);
				// 			console.log('task.parent:', task, task.parent);
				// 		})
				// ])
				// 	.then((result) => {
				// 		return res.json({typeInst: req.docSelection.toJSONFor(user)});
				// 	});

				// req.body.actions.forEach((action) => {
				// 	// 1/ tDBG
				// 	var dbg_pop = req.docSelection.populate('parent');
				// 	console.log('parent:', dbg_pop.parent);
				// 	console.log('parent:', dbg_pop.get('parent'));

				// 	updatedDNodes = req.docSelection[action.action](action.prms, []);
				// });
				req.docSelection[req.body.actions[0].action](req.body.actions[0].prms, [])
					.then((resData) => {
						console.log('(res-pr)-> save progres');

						var updatedDNodesToReturn = resData.updatedDNodes.map((updatedDNode) => {
							return updatedDNode.prObj;
						});

						return res.json({typeInst: req.docSelection.toJSONFor(user), updatedData: updatedDNodesToReturn.map((updatedDNode) => {
							return updatedDNode.toJSONFor(user);
						})});
					}).catch(next);
				// updatedDNodes.save().then(() => {
				// 	return res.json({typeInst: req.docSelection.toJSONFor(user), updatedData: updatedDNodes.splice(1).map(function(doc){
				// 			return doc.toJSONFor(user);
				// 		})
				// 	});
				// })
			}
			else {
				return res.json({typeInst: req.docSelection.toJSONFor(user)});
			}
		}).catch(next);
});

router.get('/getAll/:type', auth.required, function(req, res, next) { // Ok/impl // auth.required, 
	
	var limit = 1;
	var offset = 0;

	if(typeof req.query.limit !== 'undefined'){
		limit = req.query.limit;
	}

	if(typeof req.query.offset !== 'undefined'){
		offset = req.query.offset;
	}

	// User.findById(req.payload.id).then(function(user) // tDCS
	User.findById(req.payload.id).then(function(user){
		if (!user) { return res.sendStatus(401); }

		Promise.all([
			req.SelectedModel.find({ user: user._id})
			.limit(Number(limit))
			.skip(Number(offset))
			.exec(),
			]).then(function(results){
				var docSelection = results[0];

				return res.json({
					types: docSelection.map(function(doc){
						return doc.toJSONFor(user);
					}),
				});
			}).catch(next);
		});
});

router.post('/select/:type', auth.required, function(req, res, next) { // Ok/impl // byDate,byProject // < auth.required
	
	var query = {};
	var limit = req.body.limit ? req.limit : 10; 
	var offset = req.body.offset ? req.offset : 0; 

	if(req.body.dataFilter){
		query = req.body.dataFilter; 
		// var date = new Date('2018-12-19'); // tDCS
		// query = { termin: date };
	}

	console.log('pRA-Se - query:', query); 

	//User.findById(req.payload.id).then(function(user)
	User.findById(req.payload.id).then(function(user){
		if (!user) { return res.sendStatus(401); }

		Promise.all([
			req.SelectedModel
			.find({ user: user._id })
			//.find(query) // < query
			.limit(Number(limit))
			.skip(Number(offset))
			.exec(),
			]).then(function(results){
				var docSelection = results[0];

				return res.json({
					types: docSelection.map(function(doc){
						return doc.toJSONFor(user);
					}),
				});
			}).catch(next);
		});
});

var selectTypesInstsByFilter = function(selectedModels, filters, sorting, user) { // -> Promise
	
	return new Promise((resolve, reject) => {

		var promisedDocSelectionForTypes = [];
		//var promisedDocSelectionForType; /X
		selectedModels.forEach((selectedModel) => {
			var promisedDocSelectionForType = selectTypeInstsByFilters(selectedModel, filters, sorting, user)
			promisedDocSelectionForTypes.push(promisedDocSelectionForType)

		})

		console.log('promisedDocSelectionForTypes: ', promisedDocSelectionForTypes);
		var docSelection;

		Promise.all(promisedDocSelectionForTypes)
			.then((docSelectionForTypes) => {
				docSelection = docSelectionForTypes[0];
				if(docSelection) {
					resolve(docSelection);
				}
			});

		// promisedDocSelectionForType // /X, tTest
		// 	.then((_docSelection) => {
		// 		docSelection = _docSelection;
		// 		if(docSelection) {
		// 			resolve(docSelection);
		// 		}
		// 	});
	});
}

var selectTypeInstsByFilters = function(selectedModel, filters, sorting, user) { // -> Promise
	
	return new Promise((resolve, reject) => {

		var _filters = filters.length == 0 ? [{}] : filters; // < sit/neni zadany zadny filter
		var selections = [];
		var filterObj = {};

		_filters .forEach((filter) => {
			// var dbQuery = selectedModel.find(filter);
			// selections.push(dbQuery);
			// console.log('filter, dbQuery: ', filter, dbQuery);
			if(Object.keys(filter)[0]) {
				var filterForKey = Object.keys(filter)[0];
				var filterRule = filter[filterForKey];

				filterObj[filterForKey] = filterRule;
			}				
		});
		
		var sortingSetting = '';
		if(sorting) {
			var sortingSettingDir  = sorting.dir == -1 ? '-' : '';
			var sortingSetting = sortingSettingDir + sorting.field;
		}

		var dbQuery = selectedModel
			.find({ user: user._id })
			.find(filterObj)
			.sort(sortingSetting);

		selections.push(dbQuery);

		var docSelection;
		var promiseResolver; 

		Promise.all(selections)
			.then((results) => {
				// results.forEach((result) => { // X/
				// 	let doc = result.exec();
				// 	docSelection.push(doc);
				// });
				docSelection = results[0];
				if(docSelection) {
					resolve(docSelection);
				}
			});
	});
}

router.post('/select2/:types', auth.required, function(req, res, next) {

	// a/...
	// a/vyber konkretnih /DNodes pdole zadanych filtru
	var req = req;

	Promise.all([
		req.payload ? User.findById(req.payload.id) : null, // tDcs
		]).then(function(results){

			var user = results[0];

			selectTypesInstsByFilter(req.selectedModels, req.body.filters, req.body.sorting, user)
				.then((selectedTypesInsts) => {

					return res.json({typeInst: selectedTypesInsts.map((doc) => {
						return doc.toJSONFor(user);
					})});

					// if(req.body.sorting) {

					// 	// let sortingSettingDir  = req.body.sorting.dir == -1 ? '-' : '';
					// 	// let sortingSetting = sortingSettingDir + req.body.sorting.field;

					// 	//selectedTypesInsts.sort(sortingSetting)
					// 	selectedTypesInsts.sort({ priority: 'asc' })
					// 		.then((sortedTypesInsts) => {
					// 			return res.json({typeInst: sortedTypesInsts.map((doc) => {
					// 				return doc.toJSONFor(user);
					// 			})});
					// 	});
					// }
					// else {
					// 	return res.json({typeInst: selectedTypesInsts.map((doc) => {
					// 		return doc.toJSONFor(user);
					// 	})});
					// }
				});

			// a/provedeni akci // tTodo:
			// if(req.actions.length > 0) {
			// 	var updatedDNodes = [];

			// 	// a/provedeni akci na tomto /DNode
			// 	req.actions.forEach((action) => {
			// 		updatedDNodes = req.docSelection[action](action.prms, []);
			// 	});

			// 	updatedDNodes.save().then(() => {
			// 		return res.json({typeInst: req.docSelection.toJSONFor(user), updatedData: updatedDNodes.splice(1).map(function(doc){
			// 				return doc.toJSONFor(user);
			// 			})
			// 		});
			// 	})
			// }
			// else {
				
			// }
		}).catch(next);
});

router.get('/agregate/:types/:value', auth.required, function(req, res, next) { // Ok/impl // < auth.required

	console.log('pRA-Agr - /agregate/:types/:value ', req.param('value'));

	var query = {};
	var selectedModels = req.selectedModels;

	// if(req.body.dataFilter){
	// 	query = req.body.dataFilter;
	// 	console.log('pRA-Agr - set query: ', query);
	// }

	//User.findById(req.payload.id)
	User.findById(req.payload.id).then(function(user){
		if (!user) { return res.sendStatus(401); }

		Promise.all(selectedModels.map( (SelectedModel) => {
			return SelectedModel.find(query) // <  req.param('value')
		})).then((results) => {

				var docSelection = results[0];
				var agragtedValue = 0;

				docSelection.forEach((doc) => {
					console.log('pRA-Agr - step docSelection, doc', doc, doc.get('progres'));
					agragtedValue +=  doc.get('progres');
				});
				console.log('pRA-Agr - return resp, agr. value: ', agragtedValue);
				return res.json({ agregatedValue: agragtedValue });
			}).catch(next);
	});
});

// K/CRUD

// api/
router.post('/create/:type', auth.required, function(req, res, next) { // Ok/impl // < auth.required, 
	// ...
	var SelectedModel = req.SelectedModel;
	// var docSelection = req.docSelection; // tDE

	// SUser.findById(req.payload.id)
	User.findById(req.payload.id).then(function(user){ // vyber /uzivatele podle id
		if (!user) { return res.sendStatus(401); }

		console.log('pRA-Cr - create type');
	    var createdModel = new req.SelectedModel(req.body.typeCfg); // vytvoreni noveho /clanku
	    createdModel.user = user;
	    
	    // Connect to /Parent
	    var resToClient;

	    createdModel.addToParent()
	    	.then((createdModel) => {
	    		return createdModel.save().then(function(){ // ulozeno /dokumentu [/clanek] do /kolekce
			    	console.log('pRA-Cr - return response');

			    	// if(req.ObjType == 'A') {
			    	// 	MProject.findById(result.parentID).then((parent) => {
			    	// 		parent.tasks.push(result.createdModel._id);
			    	// 		parent.save().then(function(){
			    	// 			return res.json({createdTypeInst: result.createdModel.toJSONFor(user)});
			    	// 		});
			    	// 	});
			    	// }
			    	// else {
			    	// 	return res.json({createdTypeInst: result.createdModel.toJSONFor(user)});
			    	// }
			    	resToClient = res.json({createdTypeInst: createdModel.toJSONFor(user)});
			    });
	    	});
	    return resToClient;

	}).catch(next);
});

router.delete('/delete/:type/:instance', auth.required, function(req, res, next) { // Ok/impl // < auth.required

	var SelectedModel = req.SelectedModel;
	var docSelection = req.docSelection;

	//User.findById(req.payload.id).then(function(user)
	User.findById(req.payload.id).then(function(user){
		if (!user) { return res.sendStatus(401); }

		var resToClient;
		if(docSelection){ // req.docSelection.user._id.toString() === req.payload.id.toString() // tDCS

			console.log('delete: ', req.docSelection.name);
			// remove form /Parent
			req.docSelection.removeFromParent()
				.then((deletedModel) => {
					return deletedModel.remove().then(function(){
						console.log('deleted: ', deletedModel.name);
						resToClient = res.json({deletedTypeInst: deletedModel.toJSONFor(user)});
					});
				})
		} else {
			return res.sendStatus(403);
		}
		return resToClient;
	}).catch(next);
});

router.put('/update/:type/:instance', auth.required, function(req, res, next) { // set // Ok/impl // <  
	
	var SelectedModel = req.SelectedModel;
	var docSelection = req.docSelection;
	var setting = { };

	if(req.body.typeUpdate) {
		//setting[Object.keys(req.body.typeUpdate)[0]] = req.body.typeUpdate[Object.keys(req.body.typeUpdate)[0]];
		setting = req.body.typeUpdate;
	}

	//  User.findOne({username: 'sketchrain'})
	User.findById(req.payload.id).then(function(user){
		if(true){ // req.docSelection.user._id.toString() === req.payload.id.toString()
			
			var dbg_selected = req.docSelection.get('state.selected'); // tDCS,DBG
			if(req.docSelection){
				req.docSelection.set(setting); // < req.body.typeUpdate
				var _setting = setting;
				var dbg_selected = req.docSelection.get('state.selected'); // tDCS,DBG
			}

			return req.docSelection.save().then(function(){ // ulozeno /dokumentu [/clanek] do /kolekce
				return res.json({updatedTypeInst: req.docSelection.toJSONFor(user)});
			});
		} else {
			return res.sendStatus(403);
		}
	}).catch(next);
});

router.put('/updateAll/:type', auth.required, function(req, res, next) { // set // tTodo: ,tN // < auth.required, 

	console.log('pRA-UpAll - /updateAll/:type:', req.param('type'));

	// User.findById(req.payload.id).then(function(user) // tDCS
	User.findById(req.payload.id).then(function(user){
		if (!user) { return res.sendStatus(401); }

		Promise.all([
			req.SelectedModel.find({ user: user._id})
			.exec(),
			]).then(function(results){
				var docSelection = results[0];
				docSelection.forEach((doc) => {
					doc.set(req.body.typeUpdate);
					console.log('pRA-UpAll - step docSelection, doc:', doc);
				});

				return Promise.all(docSelection.map((doc) => {
					return doc.save();
				})).then(() => {
						return res.json({
							updatedTypes: docSelection.map(function(doc){
								console.log('pRA-UpAll - step docSelection for response, doc:', doc);
								return doc.toJSONFor(user);
							}),
						});
					});
			}).catch(next);
		});
});

// api/updateSelected // tTodo:

// K/OTHERS
router.post('/add/:type/:instance', auth.required, function(req, res, next) { // Ok/impl < // add to parent // <  auth.required, 
	
	var parentID = req.body.parentID;
	//var ParentModel = connection.model(req.docSelection.parentModelRef); // X/
	var ParentModel = mongoose.connection.model(req.docSelection.schema.tree.parent.ref);

	//User.findById(req.payload.id)
	User.findById(req.payload.id).then(function(user){
		if (!user) { return res.sendStatus(401); }

		ParentModel.findById(parentID).then((parent) => {
			if (!parent) { return res.sendStatus(401); }
			return req.docSelection.addToParent(parentID).then(function(){
				return res.json({addedTypeInst: req.docSelection.toJSONFor(user)});
			});
		}).catch(next);
	}).catch(next);
});

// api/addTo // tTodo:
// api/removeFrom // tTodo:

router.delete('/remove/:type/:instance', auth.required, function(req, res, next) { // Ok/impl remove form parent // < auth.required, 

	//User.findById(req.payload.id)
	User.findById(req.payload.id).then(function(user){
		if (!user) { return res.sendStatus(401); }

		return req.docSelection.removeFromParent().then(function(){
			return res.json({removedTypeInst: req.docSelection.toJSONFor(user)});
		});
	}).catch(next);
});



