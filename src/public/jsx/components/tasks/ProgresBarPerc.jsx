import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import ProgressBar from 'react-bootstrap/ProgressBar';

const ProgresBarPerc = inject('TodoStore')(
	observer(props => {
		const { TodoStore } = props;

		const now = Math.round(TodoStore.PercentTasks(props.todo.tasks));

		return <ProgressBar className="w-100" now={now} label={`${now}%`} />;
	})
);

ProgresBarPerc.wrappedComponent.propTypes = {
	todo: PropTypes.objectOf(PropTypes.object).isRequired,
	TodoStore: PropTypes.objectOf(PropTypes.object).isRequired
};

export default ProgresBarPerc;
