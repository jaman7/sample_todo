import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import NameTask from './tasks/NameTask';
import InputNameTask from './tasks/InputNameTask';
import DescriptionTask from './tasks/DescriptionTask';
import InputDescriptionTask from './tasks/InputDescriptionTask';
import ButtonRemoveTask from './buttons/ButtonRemoveTask';

const TodoItemTask = inject('TodoStore')(
	observer(props => {
		const { TodoStore } = props;

		return (
			<>
				<div
					key={props.tasks.id}
					className="d-flex align-items-center justify-content-between border-bottom border-primary todo-item-task coloured"
				>
					<div className="checkbox">
						<label className="mb-0" htmlFor={`box-${props.tasks.id}`}>
							<input
								type="checkbox"
								id={`box-${props.tasks.id}`}
								checked={props.tasks.state}
								key={`CheckTask${props.tasks.id}`}
								onChange={event =>
									TodoStore.checkTodo(props.tasks, props.listid, event)
								}
							/>
							<span className="checkbox-material">
								<span
									className="check"
									title={`checkbox-${props.tasks.id}`}
									aria-label={`checkbox-${props.tasks.id}`}
								/>
							</span>
						</label>
					</div>

					<div className="d-flex flex-column align-items-center todo-item">
						{!props.tasks.editing && (
							<NameTask
								key={`NameTask${props.tasks.id}`}
								tasks={props.tasks}
								listid={props.listid}
							/>
						)}
						{props.tasks.editing && (
							<InputNameTask
								key={`InputNameTask${props.tasks.id}`}
								tasks={props.tasks}
								listid={props.listid}
							/>
						)}

						{!props.tasks.editing2 && (
							<DescriptionTask
								key={`DescriptionTask${props.tasks.id}`}
								tasks={props.tasks}
								listid={props.listid}
							/>
						)}
						{props.tasks.editing2 && (
							<InputDescriptionTask
								key={`InputDescriptionTask${props.tasks.id}`}
								tasks={props.tasks}
								listid={props.listid}
							/>
						)}
					</div>
					<ButtonRemoveTask
						key={`ButtonRemoveTask${props.tasks.id}`}
						tasks={props.tasks}
						listid={props.listid}
					/>
				</div>
			</>
		);
	})
);

TodoItemTask.wrappedComponent.propTypes = {
	index: PropTypes.number.isRequired,
	listid: PropTypes.objectOf(PropTypes.object).isRequired,
	tasks: PropTypes.objectOf(PropTypes.object).isRequired,
	TodoStore: PropTypes.objectOf(PropTypes.object).isRequired
};

export default TodoItemTask;
