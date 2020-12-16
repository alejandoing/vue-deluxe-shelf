import axios from 'axios';

const API_URL = 'http://localhost:3001/api/collections';

class CollectionService {
  async add (collection) {
    return await axios.post(`${API_URL}/add`, { collection });
  }

  async findAll () {
    return (await axios.post(API_URL)).data;
  }

  async findOne (id) {
    return (await axios.get(`${API_URL}/${id}`)).data;
  }
}

export default new CollectionService();