import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Accordion, Button } from 'react-bootstrap';

const ButtonColapse = inject('TodoStore')(
	observer(props => {
		const { TodoStore } = props;

		return (
			<>
				<Accordion.Toggle
					as={Button}
					eventKey={props.index + 1}
					onClick={event => TodoStore.ColapseOpen(props.todo, event)}
				>
					<i
						className={`fa fa-angle-right icon-rotate${props.iconClass}`}
						title="Expand tasks"
					/>
				</Accordion.Toggle>
			</>
		);
	})
);

ButtonColapse.wrappedComponent.propTypes = {
	iconClass: PropTypes.string.isRequired,
	index: PropTypes.number.isRequired,
	todo: PropTypes.objectOf(PropTypes.object).isRequired,
	TodoStore: PropTypes.objectOf(PropTypes.object).isRequired
};

export default ButtonColapse;
