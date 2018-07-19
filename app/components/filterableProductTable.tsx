import * as React from 'react';

class FilterableProductTable extends React.Component <any, any> {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.state = {searchTerm: '', onlyShowInStock: false};
  }

  handleInputChange(e) {
    this.setState({searchTerm: e.target.value});
  }

  handleCheckboxChange(e) {
    this.setState({onlyShowInStock: e.target.checked});
  }

  render () {
    return (
      <div>
        <SearchBar searchTerm={this.state.searchTerm} onInputChange={this.handleInputChange} onlyShowInStock={this.state.onlyShowInStock} onCheckboxChange={this.handleCheckboxChange}/>
        <ProductTable data={this.props.products} searchTerm={this.state.searchTerm} onlyShowInStock={this.state.onlyShowInStock}/>
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
        <input style={this.divStyle} type="text" placeholder="Search..." value={this.props.searchTerm} onChange={this.props.onInputChange} />
        <input type="checkbox" checked={this.props.onlyShowInStock} onChange={this.props.onCheckboxChange} /> Only show products in stock
      </div>
    );
  }
}

class ProductTable extends React.Component <any, any> {
  private categories = {};
  private table = [];

  buildTable() {
    this.categories = {};
    this.table = [];
    if (this.props.onlyShowInStock) {
      this.props.data.forEach(item => {
        if(item.stocked) {
          this.addProduct(item);
        }
      });
    } else {
      this.props.data.forEach(item => {
        this.addProduct(item);
      });
    }
  } 

  addProduct(item) {
    if (item.name.toLowerCase().startsWith(this.props.searchTerm.toLowerCase())) {
      if (this.categories[item.category] !== true) {
        this.categories[item.category] = true;
        this.table.push(<ProductCategoryRow name={item.category} key={item.category}/>);
        this.table.push(<ProductRow name={item.name} price={item.price} stocked={item.stocked} key={item.name}/>);
      } else {
        let index = this.table.indexOf(item.category);
        this.table.splice(index, 0, <ProductRow name={item.name} price={item.price} stocked={item.stocked} key={item.name}/>);
      }
    }
  }

  render () {
    this.buildTable();
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