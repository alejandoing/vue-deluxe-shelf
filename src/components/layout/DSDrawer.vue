<template lang="pug">
  v-navigation-drawer(
    v-model="drawer"
    :src="background"
    app clipped dark
    width="15%"
  )
    v-list
      v-list-item(to="/dashboard")
        v-list-item-avatar(color="white")
          v-img(:src="initials")
        v-list-item-title.font-weight-bold(v-html="'Alejandro Uray'")
      v-divider
      v-list
        v-list-group(
          v-for="x in menu"
          v-model="x.active"
          :key="x.title"
          :prepend-icon="x.icon"
          no-action
        )
          template(v-slot:activator)
            v-list-item-title(v-text="x.title")
          v-list-item(
            v-for="y in x.children"
            :key="y.title"
            :to="y.to"
            active-class="secondary"
          )
            v-list-item-content
              v-list-item-title(v-text="y.title")
            v-list-item-action
              v-icon(v-text="y.icon")
</template>

<script>
	import { mapGetters } from 'vuex';

	export default {
		name: 'DSDrawer',

		data: () => ({
			initials: null,
			menu: [
				{
					icon: 'mdi-book-open-variant', active: false, title: 'Books', 
						children: [
							{ icon: 'mdi-format-list-bulleted-square',  title: 'View Books', to: '/books/all' },
							{ icon: 'mdi-cloud-upload',  title: 'Add Book', to: '/books/add' }
						]
        },
				{
					icon: 'mdi-head-lightbulb', active: false, title: 'Authors', 
						children: [
							{ icon: 'mdi-cloud-upload',  title: 'Add Author', to: '/authors/add' }
						]
        },
				{
					icon: 'mdi-book-account', active: false, title: 'Works', 
						children: [
							{ icon: 'mdi-format-list-bulleted-square',  title: 'View Works', to: '/works/all' },
							{ icon: 'mdi-cloud-upload',  title: 'Add Work', to: '/works/add' }
						]
        },
				{
					icon: 'mdi-bookshelf', active: false, title: 'Collections', 
						children: [
							{ icon: 'mdi-cloud-upload',  title: 'Add Collection', to: '/collections/add' }
						]
        },
				{
					icon: 'mdi-bullhorn', active: false, title: 'Publishers', 
						children: [
							{ icon: 'mdi-cloud-upload',  title: 'Add Publisher', to: '/publishers/add' }
						]
				}
			]
		}),

		computed: {
			background () {
				return require('assets/drawer_background.png');
			},

			...mapGetters({ drawerFromStore: 'layout/drawer' }),

			drawer: {
				get () { return this.drawerFromStore; },
				set (newDrawer) { return newDrawer; } 
			}
		},

		methods: {
			getInitialsURL (name) {
				return `https://ui-avatars.com/api/?name=${name}`;
			},
		},
		
		mounted () {
			this.initials = this.getInitialsURL('Alejandro Uray');
		}
	}
</script>

<style lang="stylus" scoped>
	.v-list
		padding: 0px;
	.v-list-item__title
		font-size: 13px;
</style>