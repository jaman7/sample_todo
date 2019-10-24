import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

const InputDescriptionTask = inject('TodoStore')(
	observer(props => {
		const { TodoStore } = props;

		return (
			<>
				<div className="form-group">
					<input
						id={`InputDescriptionTask${props.tasks.id}`}
						className="form-control taskdescription-input"
						type="text"
						autoComplete="off"
						maxLength={160}
						defaultValue={props.tasks.description}
						onBlur={event =>
							TodoStore.doneEditTask(props.tasks, 'description', props.listid, event)
						}
						onKeyUp={event => {
							if (event.key === 'Enter') {
								TodoStore.doneEditTask(
									props.tasks,
									'description',
									props.listid,
									event
								);
							} else if (event.key === 'Escape') {
								TodoStore.cancelEditTask(
									props.todo,
									'description',
									props.listid,
									event
								);
							}
						}}
					/>
				</div>
			</>
		);
	})
);

InputDescriptionTask.wrappedComponent.propTypes = {
	listid: PropTypes.objectOf(PropTypes.object).isRequired,
	tasks: PropTypes.objectOf(PropTypes.object).isRequired,
	TodoStore: PropTypes.objectOf(PropTypes.object).isRequired
};

export default InputDescriptionTask;
