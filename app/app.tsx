import * as React from 'react';
import * as ReactDOM from "react-dom";
import Clock from './components/clock';
import Toggle from './components/toggleButton';
import LoginControl from './components/loginControl';
import NumberList from './components/numberList';
import NameForm from './components/nameForm';
import FlavorForm from './components/flavorForm';
import Calculator from './components/calculator';
import FilterableProductTable from './components/filterableProductTable';

function App() {
  return (
    <FilterableProductTable />
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);