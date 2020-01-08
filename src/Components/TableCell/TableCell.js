import React from 'react';
import names from '../../Components/ListPage/columns';
import moment from 'moment';
import './TableCell.css';

export default class TableCell extends React.Component {
  render() {
    const column = this.props.column - 1;
    const columnName = names.columns[column];
    
    let item = this.props.item;
    let cssClass = '';
    
    switch(columnName) {
      case 'NetWin':
      case 'Old Denom':
      case 'New Denom':
        if (item) {
          item = '$' + item.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        }

        if (item === 0) {
          item = '$0';
        }
        break;

      case 'Recommendation Status':
        if (item === 'rejected') {
          cssClass = 'red-text';
        }

        if (item === 'implemented') {
          cssClass = 'green-text';
        }
        break;

      case 'Old Payback %':
      case 'New Payback %':
        if (item) {
          item = item.toFixed(2) + '%';
        }
        break;
      case 'Action':
        if (item === 'noAction') {
          item = 'n/a';
        } else if (item) {
          item = item.charAt(0).toUpperCase() + item.slice(1);
        }
        break;
      case 'Date':
        if (item) {
          item = moment(item, 'YYYY/MM/DD').format('LL');
        }
      default:
    }
    return <td onClick={this.props.clickToGroup} className={cssClass}>{item}</td>
  }
} 

