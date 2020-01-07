import React from 'react';
import ApiService from '../../Services/ApiService';
import Recommendation from '../Recommendation/Recommendation';
import names from './columns';

export default class ListPage extends React.Component {
  
  state = {
    recommendations: [],
    sort: ['Area', 'Zone', 'Bank', 'Stand'],
    sortDirection: [-1, -1, -1, -1],
    numberRows: 20,
    page: 0,
    visible: []
  }
  
  sorter = (arr, fields, directions) => {
    return arr.sort((a, b) => {
      for (let i = 0; i < fields.length; i++) {
        if (a[fields[i]] < b[fields[i]]) {
          return directions[i];
        }

        if (a[fields[i]] > b[fields[i]]) {
          return -directions[i];
        }
      }
      return 0;
    })
  }

  groupBy = (arr) => {
    return arr; // this might not be the right structure, will revisit
  }

  changeFields(event) {
    const newNumber = event.target.value;
    const sorted = this.groupBy(this.sorter(this.state.recommendations, this.state.sort, this.state.sortDirection));
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
        const sorted = this.groupBy(this.sorter(res, this.state.sort, this.state.sortDirection));
        const selection = sorted.slice(this.state.page * this.state.numberRows, (this.state.page + 1) * (this.state.numberRows));

        this.setState({
          recommendations: res,
          visible: selection
        }
        );
      });
  }

  next = () => {
    const sorted = this.groupBy(this.sorter(this.state.recommendations, this.state.sort, this.state.sortDirection));
    const newView = sorted.slice((this.state.page + 1) * this.state.numberRows, (this.state.page + 2) * this.state.numberRows);

    this.setState({
      page: this.state.page + 1,
      visible: newView
    }
    )
  }

  previous = () => {
    const sorted = this.groupBy(this.sorter(this.state.recommendations, this.state.sort, this.state.sortDirection));
    const newView = sorted.slice((this.state.page - 1) * this.state.numberRows, (this.state.page) * this.state.numberRows);

    this.setState({
      page: this.state.page - 1,
      visible: newView
    }
    )
  }

  sort = (name) => {
    console.log('attempting to sort by' + name);
    const sortIndex = this.state.sort.indexOf(name);
    if (sortIndex === -1) {
      const newSort = [name, ...this.state.sort];
      const newDirections = [1, ...this.state.sortDirection];

      const sorted = this.groupBy(this.sorter(this.state.recommendations, newSort, newDirections));
        const selection = sorted.slice(this.state.page * this.state.numberRows, (this.state.page + 1) * (this.state.numberRows));

        this.setState({
          sort: newSort,
          sortDirection: newDirections,
          visible: selection
        });
    }
  }

  render() {
    return <>
    <table>
      <tbody>
        <tr>
          <th></th>
          {names.visibleNames.map ((name, i) => {
            const currentColumn = names.columns[i];
            const sortIndex = this.state.sort.indexOf(currentColumn);
            let arrow = '';

            if (sortIndex !== -1) {
              if (this.state.sortDirection[sortIndex] === -1) {
                arrow = '▲';
              } else {
                arrow = '▼';
              }
            }

            return <th key={i} onClick={event => this.sort(names.columns[i])}>{name}{arrow}</th>
          })}
        </tr>      
        {this.state.visible.map((recommendation, i) => <Recommendation key={i} rec={recommendation}></Recommendation>)}
        </tbody>
    </table>
    <div>
      <button onClick={this.previous}>Previous</button>
      Page {this.state.page + 1} of {Math.ceil(this.state.recommendations.length / this.state.numberRows)}
      {'  '}
      <input type="number" value={this.state.numberRows} onChange={event => this.changeFields(event)}></input>rows
      <button onClick={this.next}>Next</button>
    </div>
    </>;
  }
}