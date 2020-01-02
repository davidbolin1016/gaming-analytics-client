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
    return <table>
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
    </table>;
  }
}