import * as React from 'react';

let data = [
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];

class FilterableProductTable extends React.Component <any, any> {
  render () {
    return (
      <div>
        <SearchBar />
        <ProductTable data={data} />
      </div>
    );
  }
}

class SearchBar extends React.Component <any, any> {
  divStyle = {
    display: 'block'
  };

  render () {
    return (
      <div>
        <input style={this.divStyle} type="text" />
        <input type="checkbox" /> Only show products in stock
      </div>
    );
  }
}

class ProductTable extends React.Component <any, any> {
  private categories = {};
  private table = [];

  constructor(props) {
    super(props);
    this.buildTable();
  }

  buildTable() {
    this.props.data.forEach(item => {
      if (this.categories[item.category] !== true) {
        this.categories[item.category] = true;
        this.table.push(<ProductCategoryRow name={item.category} />);
        this.table.push(<ProductRow name={item.name} price={item.price} stocked={item.stocked}/>);
      } else {
        let index = this.table.indexOf(item.category);
        this.table.splice(index, 0, <ProductRow name={item.name} price={item.price} stocked={item.stocked}/>);
      }
    });
  } 

  render () {
    return (
      <div>
        <div> Name Price</div>
        {this.table}
      </div>
    );
  }
}

class ProductCategoryRow extends React.Component <any, any> {
  render () {
    return (
      <div className="header">{this.props.name}</div>
    );
  }
}

class ProductRow extends React.Component <any, any> {
  render () {
    return (
      <div className={this.props.stocked ? '' : 'out-of-stock'}>{this.props.name} {this.props.price}</div>
    );
  }
}

export default FilterableProductTable;