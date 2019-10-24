import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

const InputNameList = inject('TodoStore')(
	observer(props => {
		const { TodoStore } = props;

		return (
			<>
				<div className="form-group">
					<input
						id={`InputNameList${props.todo.id}`}
						className="form-control listname-input"
						type="text"
						autoComplete="off"
						maxLength={100}
						defaultValue={props.todo.name}
						onBlur={event => TodoStore.doneEditList(props.todo, 'name', event)}
						onKeyUp={event => {
							if (event.key === 'Enter') {
								TodoStore.doneEditList(props.todo, 'name', event);
							} else if (event.key === 'Escape') {
								TodoStore.cancelEditList(props.todo, 'name', event);
							}
						}}
					/>
				</div>
			</>
		);
	})
);

InputNameList.wrappedComponent.propTypes = {
	todo: PropTypes.objectOf(PropTypes.object).isRequired,
	TodoStore: PropTypes.objectOf(PropTypes.object).isRequired
};

export default InputNameList;
