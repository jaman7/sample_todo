import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

const AddTodoTask = inject('TodoStore')(
	observer(props => {
		const { TodoStore } = props;
		const formopen = props.todo.formopen ? ' open' : ' closed';

		return (
			<>
				<div className={`col-12 mt-2 task-form px-0${formopen}`}>
					{props.todo.formopen && (
						<form
							className="form"
							id={`todoformtask${props.index}`}
							onSubmit={TodoStore.addTodoTask(props.todo.id, props.todo)}
							key={`formaddtask${props.index}`}
						>
							<div className="form-group">
								<input
									type="text"
									name={`todoNameTask${props.index}`}
									id={`todoNameTask${props.index}`}
									className="form-control"
									placeholder="Task title"
									maxLength={100}
									autoComplete="off"
									aria-required="true"
									required
									ref={TodoStore.todoInputNameTask}
								/>
							</div>
							<div className="form-group">
								<textarea
									type="text"
									name={`todoDescriptionTask${props.index}`}
									id={`todoDescriptionTask${props.index}`}
									className="form-control"
									placeholder="Task description"
									maxLength={160}
									autoComplete="off"
									ref={TodoStore.todoInputDescriptionTask}
								/>
							</div>

							<div className="d-flex justify-content-end">
								<button
									type="submit"
									className="btn btn-primary btn-addlist"
									// onClick={this.handleOnClick}
								>
									<i
										className="fas fa-plus-circle icon-addtask text-white x2"
										title="Submit New Task"
									/>
								</button>
								<button
									type="button"
									className="btn btn-primary btn-addlist"
									onClick={event => TodoStore.FormOpen(props.todo, event)}
								>
									<i
										className="far fa-times-circle icon-addtask text-white x2"
										title="Cancel"
									/>
								</button>
							</div>
						</form>
					)}
				</div>
			</>
		);
	})
);

AddTodoTask.wrappedComponent.propTypes = {
	index: PropTypes.number.isRequired,
	todo: PropTypes.objectOf(PropTypes.object).isRequired,
	TodoStore: PropTypes.objectOf(PropTypes.object).isRequired
};

export default AddTodoTask;
