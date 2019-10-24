import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

const ButtonRemoveTask = inject('TodoStore')(
	observer(props => {
		const { TodoStore } = props;

		return (
			<span
				id={`RemoveTaskID:${props.tasks.id}`}
				className="removeicon-color p-2"
				key={props.tasks.id}
				role="presentation"
				aria-label={`Remove Task ID:${props.tasks.id}`}
				title={`Remove Task ID:${props.tasks.id}`}
				onClick={event => TodoStore.deleteTodoTask(props.tasks, props.listid, event)}
			>
				<i className="far fa-trash-alt removeicon x2" />
			</span>
		);
	})
);

ButtonRemoveTask.wrappedComponent.propTypes = {
	listid: PropTypes.objectOf(PropTypes.object).isRequired,
	tasks: PropTypes.objectOf(PropTypes.object).isRequired,
	TodoStore: PropTypes.objectOf(PropTypes.object).isRequired
};

export default ButtonRemoveTask;
