import WorkService from 'services/work.service';

export const work = {
  namespaced: true,
  state: { works: [], update: { error: null, success: null }, add: { error: null, success: null } },

  actions: {
    ADD({ commit }, work) {
      return WorkService.add(work).then(
        work => {
          commit('ADD_SUCCESS');
          return Promise.resolve(work);
        },
        error => {
          commit('ADD_ERROR');
          return Promise.reject(error);
        }
      );
    },
    
    FIND_ALL({ commit }) {
      return WorkService.findAll().then(
        works => {
          commit("FIND_ALL", works);
          return Promise.resolve(works);
        }
      );
    },

    UPDATE({ commit }, work) {
      return WorkService.update(work).then(
        work => {
          commit('UPDATE_SUCCESS');
          return Promise.resolve(work);
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
      return state.works;
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

    FIND_ALL (state, works) {
      state.works = works;
    },

    UPDATE_SUCCESS (state) {
      state.update.success = true;
      state.update.error = false;
    },

    UPDATE_ERROR (state) {
      state.update.success = false;
      state.update.error = true;
    }
  }
};