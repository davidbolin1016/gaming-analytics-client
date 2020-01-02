import React from 'react';
import ApiService from '../../Services/ApiService';
import Recommendation from '../Recommendation/Recommendation';


export default class ListPage extends React.Component {
  
  state = {
    recommendations: [],
    sort: {
      Action: 0,
      Status: 0,
      Area: -1,
      Zone: -1,
      Bank: -1,
      Stand: -1,
      NetWin: 0,
      'Old Denom': 0,
      'New Denom': 0,
      'Old Payback %': 0,
      'New Payback %': 0,
      Asset: 0,
      Date: 0
    },
    numberRows: 20,
    page: 0,
    visible: []
  }
  
  sorter = (arr) => {
    return arr; // will implement sorting here
  }

  groupBy = (arr) => {
    return arr; // this might not be the right structure, will revisit
  }

  changeFields(event) {
    const newNumber = event.target.value;
    const sorted = this.groupBy(this.sorter(this.state.recommendations));
    console.log(sorted.length);
    console.log(newNumber);
    console.log(this.state.page);
    const newView = sorted.slice(this.state.page * newNumber, (this.state.page + 1) * newNumber);
    console.log(newView);
    this.setState({
      numberRows: newNumber,
      visible: newView
    })
  }

  componentDidMount() {
    ApiService.getRecommendations()
      .then(res => {
        const sorted = this.groupBy(this.sorter(res));
        const selection = sorted.slice(this.state.page * this.state.numberRows, (this.state.page + 1) * (this.state.numberRows));

        this.setState({
          recommendations: res,
          visible: selection
        }
        );
      });
  }

  render() {
    return <>
    <table>
      <tbody>
        <tr>
          <th></th>
          <th>Action</th>
          <th>Status</th>
          <th>Area</th>
          <th>Zone</th>
          <th>Bank</th>
          <th>Stand</th>
          <th>Net Win</th>
          <th>Old Denom</th>
          <th>New Denom</th>
          <th>Old Payback %</th>
          <th>New Payback %</th>
          <th>Asset</th>
          <th>Generated On</th>
        </tr>      
        {this.state.visible.map((recommendation, i) => <Recommendation rec={recommendation}></Recommendation>)}
        </tbody>
    </table>
    <div>
      <button>Previous</button>
      Page {this.state.page + 1} of {Math.ceil(this.state.recommendations.length / this.state.numberRows)}
      {'  '}
      <input type="number" value={this.state.numberRows} onChange={event => this.changeFields(event)}></input>rows
      <button>Next</button>
    </div>
    </>;
  }
}