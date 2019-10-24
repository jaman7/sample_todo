/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Modal } from 'react-bootstrap';
import ListsRemaining from './ListsRemaining';

@inject('TodoStore')
@observer
class PanelAddList extends Component {
	render() {
		const { TodoStore } = this.props;

		return (
			<>
				<li className="nav-item">
					<span
						aria-disabled="true"
						role="presentation"
						aria-label="Add new list"
						className="nav-link todo-user-color d-flex align-items-center"
						onClick={event => TodoStore.Modalopen(event)}
						title="Add new list"
					>
						Add List
						<i className="fas fa-plus-circle ml-2" />
					</span>
				</li>
				<li className="nav-item">
					<span
						aria-disabled="true"
						className="nav-link disabled todo-user-color"
						title="ListsRemaining"
						role="presentation"
						aria-label="ListsRemaining"
					>
						<ListsRemaining />
					</span>
				</li>

				<Modal
					className="modal-todo-container"
					show={TodoStore.showModal}
					onHide={TodoStore.Modalclose}
					animation={false}
					size="md"
					centered
				>
					<form
						onSubmit={event => TodoStore.addTodoList(event)}
						key="formaddlist"
						className="form-add-list"
						id="form-add-list"
					>
						<Modal.Header closeButton>
							<Modal.Title>Add new List to TODO</Modal.Title>
						</Modal.Header>

						<Modal.Body>
							<div className="form-group">
								<label htmlFor="todonamelist">List name</label>
								<input
									className="form-control"
									id="todonamelist"
									name="todonamelist"
									placeholder="Title"
									type="text"
									maxLength={100}
									aria-required="true"
									required
									ref={TodoStore.todoInputNameList}
									autoComplete="off"
								/>
							</div>
							<div className="form-group">
								<textarea
									className="form-control"
									id="tododescriptionlist"
									name="tododescriptionlist"
									placeholder="Description"
									type="text"
									maxLength={160}
									autoComplete="off"
									ref={TodoStore.todoInputDescriptionList}
								/>
							</div>
						</Modal.Body>
						<Modal.Footer>
							<button type="submit" className="btn btn-primary btn-addlist">
								<i className="fas fa-plus-circle" title="Add new list" />
							</button>
							<button
								type="button"
								variant="primary"
								className="btn btn-primary btn-addlist"
								onClick={TodoStore.Modalclose}
							>
								<i className="far fa-times-circle" title="Cancel" />
							</button>
						</Modal.Footer>
					</form>
				</Modal>
			</>
		);
	}
}

PanelAddList.wrappedComponent.propTypes = {
	TodoStore: PropTypes.objectOf(PropTypes.object).isRequired
};

export default PanelAddList;
