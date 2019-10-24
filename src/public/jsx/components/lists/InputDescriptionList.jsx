import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

const InputDescriptionList = inject('TodoStore')(
	observer(props => {
		const { TodoStore } = props;

		return (
			<>
				<div className="form-group">
					<input
						id={`InputDescriptionList${props.todo.id}`}
						className="form-control listdescription-input"
						type="text"
						autoComplete="off"
						aria-required="true"
						maxLength={160}
						defaultValue={props.todo.description}
						onBlur={event => TodoStore.doneEditList(props.todo, 'description', event)}
						onKeyUp={event => {
							if (event.key === 'Enter') {
								TodoStore.doneEditList(props.todo, 'description', event);
							} else if (event.key === 'Escape') {
								TodoStore.cancelEditList(props.todo, 'description', event);
							}
						}}
					/>
				</div>
			</>
		);
	})
);

InputDescriptionList.wrappedComponent.propTypes = {
	todo: PropTypes.objectOf(PropTypes.object).isRequired,
	TodoStore: PropTypes.objectOf(PropTypes.object).isRequired
};

export default InputDescriptionList;
