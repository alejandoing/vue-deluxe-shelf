import PublisherService from 'services/publisher.service';

export const publisher = {
  namespaced: true,
  state: { publishers: [], add: { error: null, success: null } },

  actions: {
    ADD({ commit }, publisher) {
      return PublisherService.add(publisher).then(
        publisher => {
          commit('ADD_SUCCESS');
          return Promise.resolve(publisher);
        },
        error => {
          commit('ADD_ERROR');
          return Promise.reject(error);
        }
      );
    },

    FIND_ALL({ commit }) {
      return PublisherService.findAll().then(
        publishers => {
          commit("FIND_ALL", publishers);
          return Promise.resolve(publishers);
        }
      );
    }
  },

  getters: {
    all: (state) => {
      return state.publishers;
    },

   },

  mutations: {
    FIND_ALL (state, publishers) {
      state.publishers = publishers;
    },
  }
};