import React from 'react';


export default class Recommendation extends React.Component {
  
  render() {

    const columns = ['Action', 'Recommendation Status', 'Area', 'Zone', 'Bank', 'Stand', 'NetWin', 'Old Denom', 'New Denom', 'Old Payback %', 'New Payback %', 'Asset', 'Date'];
    const tableItems = ['View Details', ...columns.map(column => this.props.rec[column])];
    
    return <tr>
      {tableItems.map((item, i) => <td key={i} onClick={this.props.clickToGroup}>{item}</td>)}
    </tr>
  }
}