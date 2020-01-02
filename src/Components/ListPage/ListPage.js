import React from 'react';
import ApiService from '../../Services/ApiService';

export default class ListPage extends React.Component {
  
  state = {
    recommendations: [] 
  }
  
  componentDidMount() {
    ApiService.getRecommendations()
      .then(res => {
        this.setState({
          recommendations: res
        }
        );
      });
  }

  render() {
    return <div>
        {this.state.recommendations.map((recommendation, i) => 'Recommendation number ' + i)}
    </div>;
  }
}