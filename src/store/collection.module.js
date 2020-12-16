import CollectionService from 'services/collection.service';
import collectionService from '../services/collection.service';

export const collection = {
  namespaced: true,
  state: { collections: [], currentCollection: {}, add: { error: null, success: null } },

  actions: {
    ADD({ commit }, collection) {
      return collectionService.add(collection).then(
        collection => {
          commit('ADD_SUCCESS');
          return Promise.resolve(collection);
        },
        error => {
          commit('ADD_ERROR');
          return Promise.reject(error);
        }
      );
    },
  
    FIND_ALL({ commit }) {
      return CollectionService.findAll().then(
        collections => {
          commit("FIND_ALL", collections);
          return Promise.resolve(collections);
        }
      );
    },

    FIND_ONE({ commit }, id) {
      return CollectionService.findOne(id).then(
        collection => {
          commit("FIND_ONE", collection);
          return Promise.resolve(collection);
        }
      );
    }
  },

  getters: {
    all: (state) => {
      return state.collections;
    },

    currentCollection: (state) => {
      return state.currentCollection;
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

    FIND_ALL (state, collections) {
      state.collections = collections;
    },

    FIND_ONE (state, collection) {
      state.currentCollection = collection;
    },
  }
};