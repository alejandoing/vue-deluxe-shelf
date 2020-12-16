import axios from 'axios';

const API_URL = 'http://localhost:3001/api/works';

class WorkService {
  async add (work) {
    return await axios.post(`${API_URL}/add`, { work });
  }

  async findAll () {
    return (await axios.post(API_URL)).data;
  }

  async update (work) {
    return await axios.post(`${API_URL}/update`, { work });
  }
}

export default new WorkService();