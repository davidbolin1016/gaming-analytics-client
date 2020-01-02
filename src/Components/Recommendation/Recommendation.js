import React from 'react';


export default class Recommendation extends React.Component {
  render() {

    const columns = ['Action', 'Recommendation Status', 'Area', 'Zone', 'Bank', 'Stand', 'NetWin', 'Old Denom', 'New Denom', 'Old Payback %', 'New Payback %', 'Asset', 'Date'];
    const tableItems = ['View Details', ...columns.map(column => this.props.rec[column])];
    
    console.log(tableItems);

    return <tr>
      {tableItems.map(item => <td>{item}</td>)}
    </tr>
  }
}