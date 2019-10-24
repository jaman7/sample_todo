import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import ProgresBarPerc from './ProgresBarPerc';

const CountAll = inject('TodoStore')(
	observer(props => {
		const { TodoStore } = props;

		const count = TodoStore.CompletedTasks(props.todo.tasks);

		return (
			<>
				{TodoStore.checkTasks(props.todo.tasks) ? (
					<div key={props.todo.id} className="d-flex flex-row align-items-center">
						<span className="text-center mr-1">{count}</span>

						<ProgresBarPerc
							key={`ProgresBar${props.todo.id}`}
							todo={props.todo}
							change={props.change}
						/>
					</div>
				) : (
					<span className="text-center font-italic description">No Tasks</span>
				)}
			</>
		);
	})
);

CountAll.wrappedComponent.propTypes = {
	change: PropTypes.bool.isRequired,
	todo: PropTypes.objectOf(PropTypes.object).isRequired,
	TodoStore: PropTypes.objectOf(PropTypes.object).isRequired
};

export default CountAll;
