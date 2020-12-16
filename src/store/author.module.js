import AuthorService from 'services/author.service';

export const author = {
  namespaced: true,
  state: { authors: [], add: { error: null, success: null } },

  actions: {
    ADD({ commit }, author) {
      return AuthorService.add(author).then(
        author => {
          commit('ADD_SUCCESS');
          return Promise.resolve(author);
        },
        error => {
          commit('ADD_ERROR');
          return Promise.reject(error);
        }
      );
    },

    FIND_ALL({ commit }) {
      return AuthorService.findAll().then(
        authors => {
          commit("FIND_ALL", authors);
          return Promise.resolve(authors);
        }
      );
    },
  },

  getters: {
    all: (state) => {
      return state.authors;
    }
   },

  mutations: {
    ADD_SUCCESS (state) {
      state.add.success = true;
      state.add.error = false;
    },

    ADD_ERROR (state) {
      state.add.success = false;
      state.add.error = true;
    },

    FIND_ALL (state, authors) {
      state.authors = authors;
    },
  }
};