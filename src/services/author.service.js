import axios from 'axios';

const API_URL = 'http://localhost:3001/api/authors';

class AuthorService {
  async add (author) {
    return await axios.post(`${API_URL}/add`, { author });
  }

  async findAll () {
    const authors = (await axios.post(API_URL)).data; 
    
    return authors;
  }
}

export default new AuthorService();