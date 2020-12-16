import axios from 'axios';

const API_URL = 'http://localhost:3001/api/books';

class BookService {
  async add (formData) {
    return await axios.post(`${API_URL}/add`, formData);
  }

  async findAll () {
    return (await axios.post(API_URL)).data;
  }

  async update (formData) {
    return await axios.post(`${API_URL}/update`, formData);
  }
}

export default new BookService();