// Libs
import React    from 'react';
import ReactDOM from 'react-dom';
import App      from './App.jsx';

// Styles
import './assets/stylesheets/style.css';
import './assets/stylesheets/spinkit.css';
import './assets/stylesheets/reactTags.css';


/**
 * RenderDOM connects the root JSX logic (App.jsx) to the root HTML id, and
 * imports render 
 * @param  {[JSX File]} ( <App /> ) App.jsx file that hanldes 'if auth'
 * @return {[type]}   [description]
 */
ReactDOM.render((
    <App />
), document.getElementById('root'));
