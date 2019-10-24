import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

const ListsRemaining = inject('TodoStore')(
	observer(props => {
		return <>{props.TodoStore.ListsRemaining} Lists left</>;
	})
);

ListsRemaining.wrappedComponent.propTypes = {
	TodoStore: PropTypes.objectOf(PropTypes.object).isRequired
};

export default ListsRemaining;
