import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

const InputNameTask = inject('TodoStore')(
	observer(props => {
		const { TodoStore } = props;

		return (
			<>
				<div className="form-group">
					<input
						id={`InputNameTask${props.tasks.id}`}
						className="form-control taskname-input"
						type="text"
						autoComplete="off"
						maxLength={100}
						aria-required="true"
						defaultValue={props.tasks.name}
						onBlur={event =>
							TodoStore.doneEditTask(props.tasks, 'name', props.listid, event)
						}
						onKeyUp={event => {
							if (event.key === 'Enter') {
								TodoStore.doneEditTask(props.tasks, 'name', props.listid, event);
							} else if (event.key === 'Escape') {
								TodoStore.cancelEditTask(props.tasks, 'name', props.listid, event);
							}
						}}
					/>
				</div>
			</>
		);
	})
);

InputNameTask.wrappedComponent.propTypes = {
	listid: PropTypes.objectOf(PropTypes.object).isRequired,
	tasks: PropTypes.objectOf(PropTypes.object).isRequired,
	TodoStore: PropTypes.objectOf(PropTypes.object).isRequired
};

export default InputNameTask;
