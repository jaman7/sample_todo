import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

const NameTask = inject('TodoStore')(
	observer(props => {
		const { TodoStore } = props;

		return (
			<>
				<p
					id={`tasksname${props.tasks.id}`}
					className="text-center mb-0 taskname"
					onDoubleClick={event =>
						TodoStore.editTodoTask(props.tasks, 'name', props.listid, event)
					}
				>
					{props.tasks.name}
				</p>
			</>
		);
	})
);

NameTask.wrappedComponent.propTypes = {
	listid: PropTypes.objectOf(PropTypes.object).isRequired,
	tasks: PropTypes.objectOf(PropTypes.object).isRequired,
	TodoStore: PropTypes.objectOf(PropTypes.object).isRequired
};

export default NameTask;
