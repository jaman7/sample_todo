import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

const DescriptionList = inject('TodoStore')(
	observer(props => {
		const { TodoStore } = props;
		let { description } = props.tasks;
		if (!description.length) {
			description = 'No Description';
		}

		return (
			<>
				<span
					id={`taskdescription${props.tasks.id}`}
					className="text-center font-italic taskdescription"
					onDoubleClick={event =>
						TodoStore.editTodoTask(props.tasks, 'description', props.listid, event)
					}
				>
					{description}
				</span>
			</>
		);
	})
);

DescriptionList.wrappedComponent.propTypes = {
	listid: PropTypes.objectOf(PropTypes.object).isRequired,
	tasks: PropTypes.objectOf(PropTypes.object).isRequired,
	TodoStore: PropTypes.objectOf(PropTypes.object).isRequired
};

export default DescriptionList;
