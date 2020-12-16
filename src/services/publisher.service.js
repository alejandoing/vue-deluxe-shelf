import axios from 'axios';

const API_URL = 'http://localhost:3001/api/publishers';

class PublisherService {
  async add (publisher) {
    return await axios.post(`${API_URL}/add`, { publisher });
  }

  async findAll () {
    return (await axios.post(API_URL)).data;
  }
}

export default new PublisherService();