import React from 'react';
import { observable, action, computed, configure, runInAction } from 'mobx';
import axios from 'axios';

axios.defaults.baseURL = 'api';
axios.defaults.responseType = 'json';

configure({
	enforceActions: 'observed'
});

class TodoStore {
	@observable todoInputNameList = React.createRef();

	@observable todoInputDescriptionList = React.createRef();

	@observable todoInputNameTask = React.createRef();

	@observable todoInputDescriptionTask = React.createRef();

	@observable beforeEditCache = '';

	// @observable beforeEditCache2 = '';

	@observable beforeOpen = false;

	@observable todos = [];

	@observable isLoading = true;

	@observable errors = false;

	@observable showModal = false;

	@action setData(data) {
		this.todos = data;
	}

	// Modalopen
	@action Modalopen = event => {
		this.showModal = true;
		event.preventDefault();
	};

	// Modalclose
	@action Modalclose = () => {
		this.showModal = false;
	};

	// filter length return
	@action filterrLength = todo => {
		return todo.filter(todofilter => todofilter.state).length;
	};

	// find index return
	@action findIndex = currentid => {
		return this.todos.findIndex(item => item.id === currentid);
	};

	// find index task return
	@action findindexTask = (indexList, currentid) => {
		return this.todos[indexList].tasks.findIndex(item => item.id === currentid);
	};

	// ver try catch concat 1
	@action async Retrieve() {
		try {
			const response = await axios.get('/sets');
			const todos = response.data;
			todos.forEach(todo => {
				todo.editing = false;
				todo.editing2 = false;
				todo.open = false;
				todo.formopen = false;
				todo.change = true;
			});

			const todoRequests = todos.map(async todo => {
				const response2 = await axios.get(`/sets/${todo.id}/tasks`);
				return {
					...todo,
					tasks: response2.data
				};
			});
			const todosWithTasks = await Promise.all(todoRequests);

			runInAction(() => {
				todosWithTasks.map(todo =>
					todo.tasks.map(todo2 => {
						todo2.editing = false;
						todo2.editing2 = false;
						return todo2;
					})
				);
				this.todos = todosWithTasks;
				this.isLoading = false;
			});
		} catch (error) {
			this.setState({
				isLoading: false,
				errorMsg: 'Error loading todos',
				error
			});
		}
	}

	// Lists addTodoList
	@action addTodoList = event => {
		event.preventDefault();
		const todoInputNameList = this.todoInputNameList.current.value;
		const todoInputDescriptionList = this.todoInputDescriptionList.current.value;
		if (todoInputNameList.trim().length === 0) {
			return;
		}
		axios
			.post('/sets/create', {
				name: todoInputNameList,
				description: todoInputDescriptionList
			})
			.then(response => {
				runInAction(() => {
					this.todos.push({
						description: response.data.description,
						editing: false,
						editing2: false,
						formopen: false,
						id: response.data.id,
						name: response.data.name,
						open: false,
						tasks: []
					});
					// const indexList = this.todos.findIndex(item => item.id === response.data.id);
					const indexList = this.findIndex(response.data.id);
					console.log(indexList);
					this.ListsUpadteListChange(this.todos[indexList]);
				});
			})
			.catch(error => {
				console.log(error);
			});
		this.todoInputNameList.current.value = '';
		this.todoInputDescriptionList.current.value = '';
		this.Modalclose();
	};

	// Lists deleteTodoList
	@action deleteTodoList = (id, event) => {
		event.preventDefault();
		axios
			.delete(`/sets/${id}/delete`)
			.then(() => {
				runInAction(() => {
					// const index = this.todos.findIndex(item => item.id === id);
					const index = this.findIndex(id);
					this.todos.splice(index, 1);
				});
			})
			.catch(error => {
				console.log(error);
			});
	};

	// Lists editTodoList
	@action editTodoList = (todo, data, event) => {
		event.preventDefault();
		if (data === 'name') {
			todo.editing = true;
			this.beforeEditCache = todo.name;
		} else {
			todo.editing2 = true;
			this.beforeEditCache = todo.description;
		}
		const index = this.todos.findIndex(item => item.id === todo.id);
		this.todos.splice(index, 1, todo);
	};

	// Lists doneEditList
	@action doneEditList = (todo, data, event) => {
		let datavalue = '';
		if (data === 'name') {
			todo.editing = false;
			if (event.target.value.trim().length === 0) {
				todo.name = this.beforeEditCache;
			} else {
				todo.name = event.target.value;
			}
			datavalue = todo.name;
		} else {
			todo.editing2 = false;
			if (event.target.value.trim().length === 0) {
				todo.description = this.beforeEditCache;
			} else {
				todo.description = event.target.value;
			}
			datavalue = todo.description;
		}

		const profile = {};
		profile[data] = datavalue;

		axios
			.put(`/sets/${todo.id}/update`, profile)
			.then(() => {
				runInAction(() => {
					const index = this.findIndex(todo.id);
					this.todos.splice(index, 1, todo);
					this.beforeEditCache = '';
					// this.beforeEditCache2 = '';
				});
			})
			.catch(error => {
				console.log(error);
			});
	};

	// Lists cancelEditList
	@action cancelEditList = (todo, data, event) => {
		if (data === 'name') {
			todo.name = this.beforeEditCache;
			todo.editing = false;
		} else {
			todo.description = this.beforeEditCache;
			todo.editing2 = false;
		}

		const index = this.findIndex(todo.id);
		this.todos.splice(index, 1, todo);
		this.beforeEditCache = '';
		// this.beforeEditCache2 = '';
		event.preventDefault();
	};

	// Tasks addTodoTask
	@action addTodoTask = (parentid, todo) => event => {
		event.preventDefault();
		const todoInputNameTask = this.todoInputNameTask.current.value;
		const todoInputDescriptionTask = this.todoInputDescriptionTask.current.value;
		if (todoInputNameTask.trim().length === 0) {
			return;
		}
		axios
			.post(`/sets/${parentid}/tasks/create`, {
				name: todoInputNameTask,
				description: todoInputDescriptionTask,
				state: false
			})
			.then(response => {
				runInAction(() => {
					const indexList = this.findIndex(parentid);

					this.todos[indexList].tasks.push({
						id: response.data.id,
						name: todoInputNameTask,
						description: todoInputDescriptionTask,
						editing: false,
						editing2: false,
						position: response.data.position,
						state: false
					});

					this.ListsUpadteListChange(this.todos[indexList]);
					this.FormOpen(todo, event);
				});
			})
			.catch(error => {
				console.log(error);
			});
		this.todoInputNameTask.current.value = '';
		this.todoInputDescriptionTask.current.value = '';
	};

	// Tasks checkTodo
	@action checkTodo = (tasks, parentid, event) => {
		axios
			.put(`/sets/${parentid}/tasks/${tasks.id}/update`, {
				state: !tasks.state
			})
			.then(() => {
				runInAction(() => {
					tasks.state = !tasks.state;
					const indexList = this.findIndex(parentid);
					const indexTask = this.findindexTask(indexList, tasks.id);
					this.todos[indexList].tasks.splice(indexTask, 1, tasks);
					this.ListsUpadteListChange(this.todos[indexList]);
				});
			})
			.catch(error => {
				console.log(error);
			});
		event.preventDefault();
	};

	// Tasks editTodoTask
	@action editTodoTask = (tasks, data, parentid, event) => {
		if (data === 'name') {
			tasks.editing = true;
			this.beforeEditCache = tasks.name;
		} else {
			tasks.editing2 = true;
			this.beforeEditCache = tasks.description;
		}

		const indexList = this.findIndex(parentid);
		const indexTask = this.findindexTask(indexList, tasks.id);
		this.todos[indexList].tasks.splice(indexTask, 1, tasks);
		event.preventDefault();
	};

	// Tasks doneEditTask
	@action doneEditTask = (tasks, data, parentid, event) => {
		let datavalue = '';
		if (data === 'name') {
			tasks.editing = false;
			if (event.target.value.trim().length === 0) {
				tasks.name = this.beforeEditCache;
			} else {
				tasks.name = event.target.value;
			}

			datavalue = tasks.name;
		} else {
			tasks.editing2 = false;
			if (event.target.value.trim().length === 0) {
				tasks.description = this.beforeEditCache;
			} else {
				tasks.description = event.target.value;
			}

			datavalue = tasks.description;
		}

		const profile = {};
		profile[data] = datavalue;

		axios
			.put(`/sets/${parentid}/tasks/${tasks.id}/update`, profile)
			.then(() => {
				runInAction(() => {
					const indexList = this.findIndex(parentid);
					const indexTask = this.findindexTask(indexList, tasks.id);
					this.todos[indexList].tasks.splice(indexTask, 1, tasks);
					this.beforeEditCache = '';
					// this.beforeEditCache2 = '';
				});
			})
			.catch(error => {
				console.log(error);
			});
	};

	// Tasks cancelEditTask
	@action cancelEditTask = (tasks, data, parentid, event) => {
		if (data === 'name') {
			tasks.name = this.beforeEditCache;
			tasks.editing = false;
		} else {
			tasks.description = this.beforeEditCache;
			tasks.editing2 = false;
		}

		const indexList = this.findIndex(parentid);
		const indexTask = this.findindexTask(indexList, tasks.id);
		this.todos[indexList].tasks.splice(indexTask, 1, tasks);
		this.beforeEditCache = '';
		// this.beforeEditCache2 = '';
		event.preventDefault();
	};

	// Tasks deleteTodoTask
	@action deleteTodoTask = (tasks, parentid, event) => {
		event.preventDefault();
		axios
			.delete(`/sets/${parentid}/tasks/${tasks.id}/delete`)
			.then(() => {
				runInAction(() => {
					const indexList = this.findIndex(parentid);
					const indexTask = this.findindexTask(indexList, tasks.id);
					this.todos[indexList].tasks.splice(indexTask, 1);
					this.ListsUpadteListChange(this.todos[indexList]);
				});
			})
			.catch(error => {
				console.log(error);
			});
	};

	// Lists upadte list change
	@action ListsUpadteListChange = todo => {
		if (todo.change) {
			todo.change = false;
		} else {
			todo.change = true;
		}

		this.beforeOpen = todo.change;
		const index = this.findIndex(todo.id);
		this.todos.splice(index, 1, todo);
	};

	// Lists FormOpen
	@action FormOpen = (todo, event) => {
		event.preventDefault();
		if (todo.formopen) {
			todo.formopen = false;
		} else {
			todo.formopen = true;
		}

		this.beforeOpen = todo.formopen;
		const index = this.findIndex(todo.id);
		this.todos.splice(index, 1, todo);
	};

	// Lists ColapseOpen
	@action ColapseOpen = (todo, event) => {
		if (todo.open) {
			todo.open = false;
		} else {
			todo.open = true;
		}

		this.beforeOpen = todo.open;
		const index = this.findIndex(todo.id);
		this.todos.splice(index, 1, todo);
		event.preventDefault();
	};

	@action checkTasks = todo => {
		const counttask = todo.length;
		if (counttask > 0) {
			return true;
		}

		return false;
	};

	@action CompletedTasks = todo => {
		const filteredData = this.filterrLength(todo);
		const counttask = todo.length;
		return `${filteredData}/${counttask}`;
	};

	@action PercentTasks = todo => {
		const filteredData = this.filterrLength(todo);
		const all = todo.length;
		const prc = (parseInt(filteredData, 10) / parseInt(all, 10)) * 100;
		if (all === 0) {
			return null;
		}

		return prc;
	};

	@computed get ListsRemaining() {
		return this.todos.filter(todo => !todo.completed).length;
	}
}

const store = new TodoStore();

export default store;
