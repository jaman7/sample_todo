import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Accordion, Card } from 'react-bootstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import TodoItemTask from './TodoItemtask';
import NameList from './lists/NameList';
import InputNameList from './lists/InputNameList';
import DescriptionList from './lists/DescriptionList';
import InputDescriptionList from './lists/InputDescriptionList';
import ButtonColapse from './buttons/ButtonColapse';
import ButtonRemove from './buttons/ButtonRemove';
import CountAll from './tasks/CountAll';
import AddTodoTask from './tasks/AddTodoTask';

const TodoItem = inject('TodoStore')(
	observer(props => {
		const { TodoStore } = props;
		// const iconClass = props.todo.open ? 'fa fa-angle-down' : 'fa fa-angle-right';
		const iconClass = props.todo.open ? ' rotate' : '';
		const formOpen = !!props.todo.formopen;
		const buttonhide = formOpen ? ' d-none' : ' d-block';
		const change = !!props.todo.change;

		return (
			<div className="col-md-6 col-xl-4 mt-1">
				<Accordion defaultActiveKey="0">
					<Card>
						<Card.Header
							key={props.todo.id}
							className="d-flex flex-row justify-content-between align-items-center todo-item-list"
						>
							<span className="list-index">{props.index + 1}</span>

							<div className="col d-flex flex-column">
								{!props.todo.editing && (
									<NameList key={`NameList${props.todo.id}`} todo={props.todo} />
								)}
								{props.todo.editing && (
									<InputNameList
										key={`InputNameList${props.todo.id}`}
										todo={props.todo}
									/>
								)}

								{!props.todo.editing2 && (
									<DescriptionList
										key={`DescriptionList${props.todo.id}`}
										todo={props.todo}
									/>
								)}
								{props.todo.editing2 && (
									<InputDescriptionList
										key={`InputDescriptionList${props.todo.id}`}
										todo={props.todo}
									/>
								)}

								<CountAll key={props.todo.id} todo={props.todo} change={change} />
							</div>
							<ButtonRemove key={props.todo.id} todo={props.todo} />
							<ButtonColapse
								key={props.index + 1}
								index={props.index}
								iconClass={iconClass}
								todo={props.todo}
							/>
						</Card.Header>
						<Accordion.Collapse
							eventKey={props.index + 1}
							in={props.todo.open}
							timeout={600}
						>
							<Card.Body className="text-white">
								<TransitionGroup component={null}>
									{props.todo.tasks &&
										props.todo.tasks
											.sort((a, b) => a.position - b.position)
											.map((tasks, index) => (
												<CSSTransition
													timeout={500}
													classNames="fade"
													key={`fadeTask${props.todo.id}${tasks.id}`}
												>
													<TodoItemTask
														// key={index}
														key={`TodoItem${tasks.id}`}
														tasks={tasks}
														index={index}
														listid={props.todo.id}
													/>
												</CSSTransition>
											))}
								</TransitionGroup>
								<div className="d-flex justify-content-end">
									<i
										title="Add Task"
										role="presentation"
										aria-label={`Add Task:${props.todo.id}`}
										className={`fas fa-plus-circle mt-2 icon-addtask x2${buttonhide}`}
										onClick={event => TodoStore.FormOpen(props.todo, event)}
									/>
								</div>

								<AddTodoTask
									key={`AddTodoTask${props.index}`}
									todo={props.todo}
									index={props.index}
								/>
							</Card.Body>
						</Accordion.Collapse>
					</Card>
				</Accordion>
			</div>
		);
	})
);

TodoItem.wrappedComponent.propTypes = {
	index: PropTypes.number.isRequired,
	todo: PropTypes.objectOf(PropTypes.object).isRequired,
	TodoStore: PropTypes.objectOf(PropTypes.object).isRequired
};

export default TodoItem;
