<template lang="pug">
v-app
  template(v-if="toolbar")
    DSDrawer
    DSToolbar
  v-main
    router-view(:key="$route.fullPath")
</template>

<script>
import DSDrawer from 'components/layout/DSDrawer';
import DSToolbar from 'components/layout/DSToolbar';

export default {
  name: 'App',

  components: { DSDrawer, DSToolbar },

  computed: {
    toolbar () {
      return this.$store.getters['layout/toolbar'];
    }
  },

  mounted () {
    this.$store.dispatch('work/FIND_ALL');
    this.$store.dispatch('collection/FIND_ALL');
  }
};
</script>

<style lang="stylus">
html
	scrollbar-face-color: #646464;
	scrollbar-base-color: #646464;
	scrollbar-3dlight-color: #646464;
	scrollbar-highlight-color: #646464;
	scrollbar-track-color: #000;
	scrollbar-arrow-color: #000;
	scrollbar-shadow-color: #646464;
	scrollbar-dark-shadow-color: #646464;

::-webkit-scrollbar
	width: 8px; height: 3px;
::-webkit-scrollbar-button
	background-color: #666;

::-webkit-scrollbar-track
	background-color: #646464;
::-webkit-scrollbar-track-piece
	background-color: #000;
::-webkit-scrollbar-thumb
	height: 50px; 
	background-color: #666;
	border-radius: 3px;
::-webkit-scrollbar-corner
	background-color: #646464;
::-webkit-resizer
	background-color: #666;
</style>
