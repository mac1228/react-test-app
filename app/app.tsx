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

const PRODUCTS = [
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];

function App() {
  return (
    <FilterableProductTable products={PRODUCTS}/>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);