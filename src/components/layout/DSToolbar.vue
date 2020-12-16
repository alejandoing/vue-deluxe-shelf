<template lang="pug">
v-app-bar(app color="black" clipped-left dark fixed height="100")
	v-app-bar-nav-icon(@click="toggleDrawer")
		v-icon mdi-menu
	v-container(fluid)
		v-row
			v-col(align-self="center" cols="2" md="5")
				v-btn(text :to="{ name: 'Home' }") Home
				v-btn(text) Books
				v-btn(text) Authors
				v-menu.overflow-y-auto(v-model="collectionsMenu" open-on-hover offset-y :close-on-content-click="false" max-height="800")
					template(v-slot:activator="{ on, attrs }")
						v-btn(text v-on="on" v-bind="attrs") Collections
							v-icon(size="18").ml-1 mdi-chevron-down
					v-card(dark)
						v-list
							v-list-group(v-for="x in publishers" :key="x.title" v-model="x.active")
								template(v-slot:activator)
									v-list-item-content
										v-list-item-title(v-text="x.title")
								v-list-item(v-for="y in x.collections" :key="y.title")
									v-list-item-content
										v-list-item-title(@click="collectionsMenu = false")
											router-link(v-text="y.title" :to="{ name: 'COLLECTIONS', params: { id: y._id }}")
			v-col.logoCol(cols="2")
				v-img(:src="logo")
			v-col.iconsCol.text-right(align-self="center" cols="3" md="5")
				v-btn(icon )
					v-icon mdi-magnify
				v-btn(icon)
					v-icon mdi-heart-outline
				v-btn(icon)
					v-icon mdi-account-outline
</template>

<script>
export default {
  data: () => ({
		collectionsMenu: false
	}),
	
	computed: {
		logo () {
			return require('assets/logo.png');
		},

		publishers () {
			const publishers = this.$store.getters['publisher/all'];
			return publishers.map(x => { return {
				active: false,
				...x
			}})
		}
	},

	methods: {
		toggleDrawer () {
			this.$store.dispatch('layout/TOGGLE_DRAWER');
		}
	},

	mounted () {
		this.$store.dispatch('publisher/FIND_ALL');
	}
}
</script>

<style lang="stylus" scoped>
.iconsCol
	.v-icon
		font-size: 1.70rem !important;

.logoCol
	padding: 50px;

a
	text-decoration: none !important;
</style>