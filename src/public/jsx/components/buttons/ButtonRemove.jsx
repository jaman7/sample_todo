import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

const ButtonRemove = inject('TodoStore')(
	observer(props => {
		const { TodoStore } = props;

		return (
			<span
				id={`deleteTodoList:${props.todo.id}`}
				className="mr-1"
				key={props.todo.id}
				role="presentation"
				aria-label={`deleteTodoList:${props.todo.id}`}
				title={`Remove List ID:${props.todo.id}`}
				onClick={event => TodoStore.deleteTodoList(props.todo.id, event)}
			>
				<i className="fas fa-trash-alt remove-item" />
			</span>
		);
	})
);

ButtonRemove.wrappedComponent.propTypes = {
	todo: PropTypes.objectOf(PropTypes.object).isRequired,
	TodoStore: PropTypes.objectOf(PropTypes.object).isRequired
};

export default ButtonRemove;
