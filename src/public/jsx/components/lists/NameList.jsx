import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

const NameList = inject('TodoStore')(
	observer(props => {
		const { TodoStore } = props;

		return (
			<>
				<p
					onDoubleClick={event => TodoStore.editTodoList(props.todo, 'name', event)}
					className="text-center mb-0 listname"
					id={`listname${props.todo.id}`}
				>
					{props.todo.name}
				</p>
			</>
		);
	})
);

NameList.wrappedComponent.propTypes = {
	todo: PropTypes.objectOf(PropTypes.object).isRequired,
	TodoStore: PropTypes.objectOf(PropTypes.object).isRequired
};

export default NameList;
