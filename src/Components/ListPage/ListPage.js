import React from 'react';
import ApiService from '../../Services/ApiService';
import Recommendation from '../Recommendation/Recommendation';
import names from './columns';

export default class ListPage extends React.Component {
  
  state = {
    recommendations: [],
    group: null,
    sort: names.sortTogether,
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

  groupBy = (arr, column) => {
    if (!column) {
      return arr;
    }
    let sorted;
    let areaGrouping = 0;

    if (names.sortTogether.indexOf(column) !== -1) {
      sorted = this.sorter(arr, names.sortTogether, new Array(names.sortTogether.length).fill(-1));
      areaGrouping = 1; 
    } else {
      sorted = this.sorter(arr, [column], [-1]);
    }

    let rowCount = 0;
    const newArr = [];
    newArr[0] = {};

    if (areaGrouping) {
      let i = 0;
      while (names.sortTogether[i] !== column) {
        newArr[0][names.sortTogether[i]] = sorted[0][names.sortTogether[i]];
        i++;
      }
    }

    newArr[0][column] = sorted[0][column];
    newArr[0]['NetWin'] = sorted[0]['NetWin'];

    for (let i = 1; i < sorted.length; i++) {
      let matched = 1;
      if (areaGrouping) {
        let j = 0;
        while (names.sortTogether[j] !== column) {
          if (newArr[rowCount][names.sortTogether[j]] !== sorted[i][names.sortTogether[j]]) {
            matched = 0;
          }
          j++;
        }
      }
      
      if (sorted[i][column] === newArr[rowCount][column] && matched === 1) {
        newArr[rowCount]['NetWin'] += sorted[i]['NetWin'];
      } else {
        rowCount += 1;
        newArr[rowCount] = {};

        if (areaGrouping) {
          let j = 0;
          while (names.sortTogether[j] !== column) {
            newArr[rowCount][names.sortTogether[j]] = sorted[i][names.sortTogether[j]];
            j++;
          }
        }

        newArr[rowCount][column] = sorted[i][column];
        newArr[rowCount]['NetWin'] = sorted[i]['NetWin'];
      }
    }
    console.log(newArr);
    return newArr;
  }

  clickToGroup = (event) => {
    const colIndex = event.target.cellIndex - 1;
    let group, update;
    
    if (colIndex === -1) {
      group = null
      update = true;
    } else {
      group = names.columns[colIndex];
    }

    if (this.state.group === group) {
      group = null;
      update = true;
    }

    if (names.groupCandidates.indexOf(names.columns[colIndex]) !== -1 || update) {
      const sorted = this.sorter(this.groupBy(this.state.recommendations, group), this.state.sort, this.state.sortDirection);
      const selection = sorted.slice(0, this.state.numberRows);

      this.setState({
        visible: selection,
        page: 0,
        group: group
      }
      );
    }

  }

  changeFields(event) {
    const newNumber = event.target.value;
    const sorted = this.sorter(this.groupBy(this.state.recommendations, this.state.group), this.state.sort, this.state.sortDirection);
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
        const sorted = this.sorter(this.groupBy(res, this.state.group), this.state.sort, this.state.sortDirection);
        const selection = sorted.slice(this.state.page * this.state.numberRows, (this.state.page + 1) * (this.state.numberRows));

        this.setState({
          recommendations: res,
          visible: selection
        }
        );
      });
  }

  next = () => {
    const sorted = this.sorter(this.groupBy(this.state.recommendations, this.state.group), this.state.sort, this.state.sortDirection);
    const newView = sorted.slice((this.state.page + 1) * this.state.numberRows, (this.state.page + 2) * this.state.numberRows);

    this.setState({
      page: this.state.page + 1,
      visible: newView
    }
    )
  }

  previous = () => {
    const sorted = this.sorter(this.groupBy(this.state.recommendations, this.state.group), this.state.sort, this.state.sortDirection);
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
    const sortTogetherIndex = names.sortTogether.indexOf(name);

    if (sortIndex === -1) {
      const newSort = [name, ...this.state.sort];
      const newDirections = [1, ...this.state.sortDirection];

      const sorted = this.sorter(this.groupBy(this.state.recommendations, this.state.group), newSort, newDirections);
        const selection = sorted.slice(0, this.state.numberRows);

        this.setState({
          sort: newSort,
          sortDirection: newDirections,
          visible: selection,
          page: 0
        });
    }

    else if (sortTogetherIndex === -1) {
      const currentDirection = this.state.sortDirection[sortIndex];
      const newSort = [name, ...this.state.sort.filter((ele) => ele !== name)];
      const newDirections = [-currentDirection, ...this.state.sortDirection.filter((ele, i) => i !== sortIndex)];

      const sorted = this.sorter(this.groupBy(this.state.recommendations, this.state.group), newSort, newDirections);
      const selection = sorted.slice(0, this.state.numberRows);

      this.setState({
          sort: newSort,
          sortDirection: newDirections,
          visible: selection,
          page: 0
        });
    }

    else {
      const newDirection = [...this.state.sortDirection];
      newDirection[sortIndex] = -newDirection[sortIndex];
      const combinations = newDirection.map((ele, i) => {
        return [this.state.sort[i], ele]
      })
      const startIndex = this.state.sort.indexOf(names.sortTogether[0]);

      const sortedCombinations = combinations.slice(startIndex, startIndex + names.sortTogether.length).concat(combinations.slice(0, startIndex)).concat(combinations.slice(startIndex + names.sortTogether.length, combinations.length));

      const newSort = sortedCombinations.map(ele => ele[0]);
      const newDirections = sortedCombinations.map (ele => ele[1]);

      const sorted = this.sorter(this.groupBy(this.state.recommendations, this.state.group), newSort, newDirections);
      const selection = sorted.slice(0, this.state.numberRows);

      this.setState({
        sort: newSort,
        sortDirection: newDirections,
        visible: selection,
        page: 0
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
        {this.state.visible.map((recommendation, i) => <Recommendation key={i} rec={recommendation} clickToGroup={(ev) => this.clickToGroup(ev)}></Recommendation>)}
        </tbody>
    </table>
    <div>
      {this.state.group !== null && 'Grouping By ' + names.visibleNames[names.columns.indexOf(this.state.group)]}
      <button onClick={this.previous}>Previous</button>
      Page {this.state.page + 1} of {Math.ceil(this.state.recommendations.length / this.state.numberRows)}
      {'  '}
      <input type="number" value={this.state.numberRows} onChange={event => this.changeFields(event)}></input>rows
      <button onClick={this.next}>Next</button>
    </div>
    </>;
  }
}