<template lang="pug">
v-hover(v-slot:default="{ hover }" open-delay="200")
	v-card(elevation="0" :class="{ 'on-hover': hover }")
		v-container(:class="book.status == 'Done' ? 'bought' : 'pending'")
			v-card-text
				v-row
					v-col.text-center(cols="12")
						v-img(contain height="250" :src="getImage(book.DScollection, book._id)")
					v-col.mb-1.formatCol(cols="12")
						a.format.text-uppercase(v-text="book.format")
					v-col.mb-1.titleCol.text-truncate(cols="12")
						a.title(v-text="book.title")
					v-col.mb-1.authorCol(cols="12")
						a.author(v-text="book.works[0].authors[0].name")
					v-col.mb-1.pagesCol(align-self="center" cols="6")
						p.pages {{ book.pages | formatPages }}
</template>

<script>
export default {
  name: 'BookCard',

  props: {
    book: Object
	},

	methods: {
		getImage (collection, id) {
			return require(`uploads/books/${collection}/${id}.png`)
		}
	}
}
</script>

<style lang="stylus" scoped>
.v-card
	height: auto;
	border-radius: 0;
	border: 1px solid #eae8e4 !important;

	.bought
		//-background: #93d7ff;

	.v-card__text
		padding: 5px !important;

	.formatCol
		padding: 0 12px;
		.format
			font-size: .75rem;
			color: #f75454;
			margin-bottom: 0;
			text-decoration: none;
	
	.titleCol
		height: 3rem !important;
		padding: 0 12px;
		.title
			color: #161619;
			font-size: 1rem !important;
			font-weight: 500;
			text-decoration: none;
			line-height: 1.5;
	
	.authorCol
		padding: 0 12px;
		.author
			text-decoration: none;
			color: #7c6e65;
			&:hover
				color: #f75454;

	.pagesCol
		padding: 0 12px;
		.pages
			font-size: 1.125rem !important;
			font-weight: 500!important;
			margin-bottom: 0;

.v-card.on-hover
	border: 1px solid #000 !important;

.boughtImg
	padding: 0 12px 0 70px;
</style>