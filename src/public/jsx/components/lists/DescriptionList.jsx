import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

const DescriptionList = inject('TodoStore')(
	observer(props => {
		const { TodoStore } = props;
		let { description } = props.todo;
		if (!description.length) {
			description = 'No Description';
		}

		return (
			<>
				<span
					className="text-center font-italic listdescription"
					onDoubleClick={event =>
						TodoStore.editTodoList(props.todo, 'description', event)
					}
					id={`listdescription${props.todo.id}`}
				>
					{description}
				</span>
			</>
		);
	})
);

DescriptionList.wrappedComponent.propTypes = {
	todo: PropTypes.objectOf(PropTypes.object).isRequired,
	TodoStore: PropTypes.objectOf(PropTypes.object).isRequired
};

export default DescriptionList;
