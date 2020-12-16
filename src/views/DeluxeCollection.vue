<template lang="pug">
	v-container
		v-row(v-if="!collection._id")
			v-col(cols="3")
				v-skeleton-loader(type="article" v-for="i in 4" :key="i")
			v-col(cols="9")
				v-skeleton-loader(max-height="100%" type="table")
		
		v-row(v-else)
			v-col(cols="3")
				v-card.collectionCard(dark)
					v-card-title
						router-link.collectionTitle(v-text="collection.title" :to="{ name: 'COLLECTIONS', params: { id: collection._id } }")
					v-card-text
						v-row.mb-4(no-glutters)
							v-col.pa-2(cols="2")
								v-img(:src="require('assets/publisher.svg')")
							v-col.px-0.pl-0(cols="10" align-self="center")
								p.publisher(v-text="publisher.title")
						p.text-justify(v-text="collection.description")
						
						v-divider.my-4
						
						v-row.progressRow
							v-col.pa-0(cols="3" align-self="center")
								v-img(:src="require('assets/books.svg')" width="200")
							v-col(cols="9")
								span.quantity(v-text="progressRelation")
								v-progress-linear.mt-4(:value="progress" height="30" color="primary" rounded)
									strong {{ progress }}%

						v-divider.my-4

						v-row.mt-4.pl-4
							v-col.pa-0(cols="2" align-self="center")
								v-img(:src="require('assets/language.svg')" width="50")
							v-col(cols="10" align-self="center")
								span.attributeText(v-text="collection.language")
						
						v-row.mt-4.pl-4
							v-col.pa-0(cols="2")
								v-img(:src="require('assets/country.svg')" width="50")
							v-col(cols="10" align-self="center")
								span.attributeText(v-text="publisher.country")
				
				//- v-card.mt-4
				//- 	v-card-text
				//- 		v-expansion-panels(v-model="filterPanels")
				//- 			v-expansion-panel
				//- 				v-expansion-panel-header
				//- 					h3.filterTitle.ma-4 Authors
				//- 				v-expansion-panel-content
				//- 					ul.filterList
				//- 						template(v-for="x in authors")
				//- 							li
				//- 								v-row
				//- 									v-col(cols="10")
				//- 										router-link.filterItem(
				//- 											v-text="x.name"
				//- 											:to="{ name: 'COLLECTIONS', params: { id: collection._id }, query: { filterByAutor: x.name } }"
				//- 										)
				//- 									v-col(cols="2")
				//- 										span {{ x.quantity | filterQuantity }}
			v-col(cols="9")
				v-row(no-gutters)
					v-col(v-for="x of books" :key="x.ISBN" cols="3")
						BookCard(:book="x")
</template>

<script>
import BookCard from 'components/BookCard';

export default {
  name: 'DeluxeCollection',

  data: () => ({
		authors: [],
		filterPanels: 0
	}),
	
	computed: {
		progressRelation () {
			const quantity = this.books.length;
			const done = this.books.filter(x => x.status == 'Done').length;

			return `${done}/${quantity} books`
		},

		progress () {
			const quantity = this.books.length;
			const done = this.books.filter(x => x.status == 'Done').length;
			
			return parseInt((done / quantity) * 100);
		},

		books () {
			return this.collection.books;
		},

		collection () {
			return this.$store.getters['collection/currentCollection'];
		},

		publisher () {
			return this.collection.publisher;
		}
	},

	components: { BookCard },
	
	methods: {
		toggleCollapse (entity) {
			this.filters[entity].collapse = !this.filters[entity].collapse;
		}
	},

  async mounted () {
		this.$store.dispatch('collection/FIND_ONE', this.$route.params.id);
  }
}
</script>

<style lang="stylus" scoped>
.container
	@media (min-width: 576px)
		max-width: 540px !important;
	@media (min-width: 768px)
		max-width: 720px !important;
	@media (min-width: 992px)
		max-width: 960px !important;
	@media (min-width: 1200px)
		max-width: 1200px !important;
	@media (min-width: 1480px)
		max-width: 1700px !important;

.collectionCard
	background: url("https://i.pinimg.com/736x/77/7e/d5/777ed57dfc8c0a2fcfedc5afa4fbb907.jpg");

.collectionTitle
	color: white !important;
	font-size: 1.2rem !important;

.quantity
	font-size: 2.5rem;

.filterTitle
	font-weight: 500;
	font-size: 1.125rem;
	line-height: 1.2;
	color: #161619;

.filterList
	list-style: none;
	font-size: 14px !important;

.filterItem
	padding: 9px 0;
	color: #161619 !important;
	display: inline-block;

.progressRow
	padding-left: 10px;

.publisher
	font-size: 16px;
	font-weight: lighter;
	margin-bottom: 0;

.attributeText
	font-weight: 500;
	font-size: 1.2rem;

.v-expansion-panels
	z-index: auto !important;
	.v-expansion-panel-content
		width: 100%;

a
	text-decoration: none !important;
	&:hover
		color: #f75454 !important;
</style>