export const layout = {
	namespaced: true,
  state: {
		drawer: false,
		toolbar: true
	},

  actions: {
    TOGGLE_DRAWER ({ commit }) {
      commit('TOGGLE_DRAWER');
    },

		TOGGLE_TOOLBAR ({ commit }) { 
      commit('TOGGLE_TOOLBAR'); 
    },
	},
	
	getters: {
		drawer (state) {
      return state.drawer;
    },

    toolbar (state) {
      return state.toolbar;
    }
	},

  mutations: {
		TOGGLE_DRAWER (state) {
      state.drawer = !state.drawer 
    },

		TOGGLE_TOOLBAR (state) { 
      state.toolbar = !state.toolbar
    }
  }
};