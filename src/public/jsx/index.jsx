import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import App from './components/App';
import PanelAddList from './components/panelMenu/PanelAddList';
import TodoStore from './stores/TodoStore';
// import registerServiceWorker from './registerServiceWorker';
const rootadd = document.getElementById('addlist');
const rootID = document.getElementById('root');

const PanelLogon = (
	<Provider TodoStore={TodoStore}>
		<PanelAddList />
	</Provider>
);

const Root = (
	<Provider TodoStore={TodoStore}>
		<App />
	</Provider>
);

if (typeof rootadd !== 'undefined' && rootadd != null) {
	ReactDOM.render(PanelLogon, rootadd);
}

if (typeof rootID !== 'undefined' && rootID != null) {
	ReactDOM.render(Root, rootID);
}

// registerServiceWorker();
