import config from '../config';

const ApiService = {
  getRecommendations() {
    return fetch(config.API_ENDPOINT, {})
      .then(res => 
        (!res.ok)
             ? res.json().then(e => Promise.reject(e))
             : res.json()
      )
  }
}

export default ApiService;