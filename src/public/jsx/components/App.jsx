import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import TodoItem from './TodoItem';

@inject('TodoStore')
@observer
class App extends Component {
	async componentDidMount() {
		const { TodoStore } = this.props;
		TodoStore.Retrieve();
	}

	render() {
		const { TodoStore } = this.props;

		return (
			<>
				<div className="container-fluid todo">
					<div className="row">
						<TransitionGroup component={null}>
							{!TodoStore.isLoading ? (
								TodoStore.todos &&
								TodoStore.todos
									.sort((a, b) => a.id - b.id)
									.map((todo, index) => (
										<CSSTransition
											timeout={500}
											classNames="fade"
											key={`fadeLists${todo.id}`}
										>
											<TodoItem key={todo.id} todo={todo} index={index} />
										</CSSTransition>
									))
							) : (
								<></>
							)}
						</TransitionGroup>

						{TodoStore.isLoading ? (
							<div className="col-12 container-react-logo">
								<span className="react-logo">
									<span className="nucleo" />
								</span>
							</div>
						) : (
							<></>
						)}
					</div>
				</div>
			</>
		);
	}
}

App.wrappedComponent.propTypes = {
	TodoStore: PropTypes.objectOf(PropTypes.object).isRequired
};

export default App;
