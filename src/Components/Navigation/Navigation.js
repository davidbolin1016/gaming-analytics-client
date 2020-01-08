import React from 'react';
import names from '../ListPage/columns';
import './Navigation.css';

export default class Navigation extends React.Component {
  render() {
    return  <div className="navigation">
    {this.props.group !== null && 'Grouping By ' + names.visibleNames[names.columns.indexOf(this.props.group)]}
    <button disabled={this.props.page < 1} onClick={this.props.previous}>Previous</button>
    Page {this.props.page + 1} of {Math.ceil(this.props.visibleRows / this.props.numberRows)}
    {'  '}
    <input type="number" value={this.props.numberRows} onChange={event => this.props.changeFields(event)}></input>rows
    <button disabled={this.props.page + 1 >= Math.ceil(this.props.visibleRows / this.props.numberRows)} onClick={this.props.next}>Next</button>
    </div>
  }
}
