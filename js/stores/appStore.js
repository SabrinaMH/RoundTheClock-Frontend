'use strict';

var appDispatcher = require('../dispatcher/appDispatcher');
var eventEmitter = require('events').EventEmitter;
var constants = require('../constants/constants');
var assign = require('../../bower_components/object-assign/index'); 
var _ = require('underscore')._;

var CHANGE_EVENT = 'change';

var _customers = [], _projects = [], _tasks = [];
var _timeEntry = {
		customer: null,
		project: null,
		task: null,
		date: null, 
		to: null, 
		from: null
	};
var _metadata = {
	error: null,
	success: null
};

function setCustomers(customers){
	_customers = customers;
	if (_customers.length > 0){
		setSelectedCustomer(_customers[0].Name);
	}
}

function setSelectedCustomer(customerName){
	_timeEntry.customer = _.find(_customers, function(customer){
		return customer.Name == customerName;
	});
	setProjects(_timeEntry.customer.Projects);
}

function setProjects(projects){
	_projects = projects;
	if (_projects.length > 0){
		setSelectedProject(_projects[0].Name);
	}
}

function setSelectedProject(projectName){
	_timeEntry.project = _.find(_projects, function(project){
		return project.Name == projectName;
	});
	setTasks(_timeEntry.project.Tasks);
}

function setTasks(tasks){
	_tasks = tasks;
	if (_tasks.length > 0){
		setSelectedTask(_tasks[0]);
	}
}

function setSelectedTask(task){
	_timeEntry.task = task;
}

function updateState(formChange){
	switch(formChange.field){
		case 'project':
			setSelectedProject(formChange.value);
			break;
		case 'task':
			setSelectedTask(formChange.value);
			break;
		case 'date':
			_timeEntry.date = formChange.value;
			break;
		case 'to':
			_timeEntry.to = formChange.value;
			break;
		case 'from':
			_timeEntry.from = formChange.value;
			break;
		default:
			return;
	}
}

function setError(error){
	if (error){
		_metadata.error = error;
	}
}

function setSuccess(message){
	_metadata.success = message;
}

var appStore = assign({}, eventEmitter.prototype, {
	getCustomers: function(){
		return _customers;
	},

	getSelectedCustomer: function(){
		return _timeEntry.customer;
	},

	getTasks: function(){
		return _tasks;
	},

	getTimeEntry: function(){
		console.log("get time entry");
		return _timeEntry;
	},

	getError: function(){
		return _metadata.error;
	},

	getSuccess: function(){
		return _metadata.success;
	}

	emitChange: function(){
		this.emit(CHANGE_EVENT);
	},

	addChangeListener: function(callback){
		this.on(CHANGE_EVENT, callback);
	},

	removeChangeListener: function(callback){
		this.removeListener(CHANGE_EVENT, callback);
	}
});

appDispatcher.register(function(action){
	switch(action.actionType){
		case constants.GET_CUSTOMERS_SUCCESS:
			setCustomers(action.data);
			break;
		case constants.GET_CUSTOMERS_ERROR:
			setError(action.data);
			break;
		case constants.CUSTOMER_CHANGED:
			setSelectedCustomer(action.data);
			break;
		case constants.PROJECT_CHANGED:
			setSelectedProject(action.data);
			break;
		case constants.PROJECTS_CHANGED:
			setProjects(action.data);
			break;
		case constants.FORM_CHANGED:
			updateState(action.data);
			break;
		case constants.TIME_ENTRY_SAVED:
			setSuccess("Time entry saved");
			break;
		case constants.TIME_ENTRY_SAVED_ERROR:
			setError(action.data);
			break;
		default: 
			return; // Only emit change if action was recognized.
	}
	appStore.emitChange();
});

module.exports = appStore;