import BookService from 'services/book.service';

export const book = {
  namespaced: true,
  state: { books: [], add: { error: null, success: null }, update: { error: null, success: null } },

  actions: {
    ADD({ commit }, formData) {
      return BookService.add(formData).then(
        book => {
          commit('ADD_SUCCESS');
          return Promise.resolve(book);
        },
        error => {
          commit('ADD_ERROR');
          return Promise.reject(error);
        }
      );
    },

    FIND_ALL({ commit }) {
      return BookService.findAll().then(
        books => {
          commit("FIND_ALL", books);
          return Promise.resolve(books);
        }
      );
    },

    UPDATE({ commit }, book) {
      return BookService.update(book).then(
        book => {
          commit('UPDATE_SUCCESS');
          return Promise.resolve(book);
        },
        error => {
          commit('UPDATE_ERROR');
          return Promise.reject(error);
        }
      )
    }
  },

  getters: {
    all: (state) => {
      return state.books;
    },

    upload: (state) => {
      return state.upload;
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

    UPDATE_SUCCESS (state) {
      state.update.success = true;
      state.update.error = false;
    },

    UPDATE_ERROR (state) {
      state.update.success = false;
      state.update.error = true;
    },

    FIND_ALL (state, books) {
      state.books = books;
    },
  }
};