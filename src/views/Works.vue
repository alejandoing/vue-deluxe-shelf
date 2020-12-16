<template lang="pug">
  v-container(v-if="works")
    v-card(elevation="5" flat)
      v-toolbar(color="secondary" dark)
        v-toolbar-title.mr-3 Works
        v-icon mdi-book-account
      v-card-text
        v-container(fluid='')
          v-data-iterator(
            :items="works"
            :items-per-page.sync="worksPerPage"
            :page="page"
            :search="search"
            :sort-by="sortBy.toLowerCase()"
            :sort-desc="sortDesc"
            hide-default-footer
          )
            template(v-slot:header)
              v-toolbar.mb-1(dark color="secondary")
                v-text-field(
                  v-model="search"
                  clearable
                  flat
                  solo-inverted
                  hide-details
                  prepend-inner-icon="mdi-magnify"
                  label="Search"
                )
                template(v-if='$vuetify.breakpoint.mdAndUp')
                  v-spacer
                  v-select(
                    v-model="sortBy"
                    flat
                    solo-inverted
                    hide-details
                    :items="keys"
                    prepend-inner-icon="mdi-magnify"
                    label="Sort by"
                  )
                  v-spacer
                  v-btn-toggle(v-model="sortDesc" mandatory)
                    v-btn(large depressed color="blue" :value='false')
                      v-icon mdi-arrow-up
                    v-btn(large  depressed color="blue" :value='true')
                      v-icon mdi-arrow-down
            template(v-slot:default="props")
              v-row
                v-col(v-for="x in props.items" :key='x.name' cols='12' sm='6' md='4' lg='3')
                  v-card
                    v-card-title.d-inline-block.text-truncate.subheading.font-weight-bold(v-text="x.title" style="max-width: 400px")
                    v-divider
                    v-list(dense)
                      v-list-item(v-for="(key, index) in filteredKeys" :key="index")
                        v-list-item-content(:class="{ 'blue--text': sortBy === key }")
                          | {{ key }}:
                        v-list-item-content.align-end(
                          v-text="formatAuthors(x[key.toLowerCase()])"
                          :class="{ 'blue--text': sortBy === key }"
                        )
                    v-btn.ma-3(color="secondary" @click="setCurrentWork(x)") See Details
            template(v-slot:footer)
              v-row.mt-2(align="center" justify="center")
                span.grey--text Items per page
                v-menu(offset-y)
                  template(v-slot:activator='{ on, attrs }')
                    v-btn.ml-2(dark text color="primary" v-bind="attrs" v-on="on")
                      | {{ worksPerPage }}
                      v-icon mdi-chevron-down
                  v-list
                    v-list-item(v-for="(number, index) in itemsPerPageArray" :key="index" @click="updateItemsPerPage(number)")
                      v-list-item-title {{ number }}
                v-spacer
                span.mr-4.grey--text
                  | Page {{ page }} of {{ numberOfPages }}
                v-btn.mr-1(fab dark color="blue darken-3" @click="formerPage")
                  v-icon mdi-chevron-left
                v-btn.ml-1(fab dark color="blue darken-3" @click="nextPage")
                  v-icon mdi-chevron-right
    v-dialog(v-model="dialog" max-width="800")
      v-container(fill-height fluid)
        v-card
          v-toolbar(color="primary" dark)
            v-toolbar-title.mr-3(v-text="currentWork.title")
            v-icon mdi-cloud-upload
          v-card-text
            v-container(fill-height fluid)
              v-row(wrap)
                v-col(cols="12")
                  v-text-field(
                    v-model="currentWork.title"
                    clearable
                    label="Title"
                    outlined
                    hint="For example, The Great Gatsby"
                  )
                  
                  v-row.pa-0
                    v-col(cols="6")                    
                      v-autocomplete(
                        v-model="currentWork.authorsSelect"
                        :items="authors"
                        label="Authors"
                        multiple
                        outlined
                      )

                      v-text-field(
                        v-model="currentWork.year"
                        type="number"
                        clearable
                        label="Year"
                        outlined
                        hint="For example, 1941"
                      )
                    v-col(cols="6")
                      v-select(
                        v-model="currentWork.language"
                        :items="['Spanish', 'English', 'French', 'Irish', 'German']"
                        label="Language"
                        outlined
                      )
              v-row
                v-col(cols="6")
                  v-btn.mr-4(@click="updateWork" color="secondary" large) Update Work
                  v-btn(@click="dialog = false" color="secondary" large) Close
    v-snackbar.text-center(v-model="snackbar" :color="feedback.color" dark)
      .text-center(v-text="feedback.text")
</template>

<script>
import Book from 'models/book';

export default {
  data: () => ({
    book: new Book (),
    currentWork: {},
    dialog: false,
    snackbar: false,
    feedback: {
      color: null,
      text: null
    },
    indexWork: null,
    itemsPerPageArray: [4, 8, 12],
    search: '',
    filter: {},
    sortDesc: false,
    page: 1,
    worksPerPage: 12,
    sortBy: 'name',
    keys: [
      'Language',
      'Year',
      'Authors'
    ],
	}),
	
	computed: {
    authors () {
      const authors = this.$store.getters['author/all'];
      return authors.map(x => { return ({ text: x.name, value: x._id, ...x }) });
    },

		collections () {
      const collections = this.$store.getters['collection/all'];
      return collections.map(x => ({ text: x.title, value: x._id }));
    },

    works () {
      const works = this.$store.getters['work/all'];
      return works.map(x => { return ({ ...x, authors: x.authors.map(y => y.name), authorsData: x.authors })})
    },

    numberOfPages () {
      return Math.ceil(this.works.length / this.worksPerPage)
    },

    filteredKeys () {
      return this.keys.filter(key => key !== 'Name')
    },
	},

	components: { },
	
	methods: {
    nextPage () {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },

    formerPage () {
      if (this.page - 1 >= 1) this.page -= 1
    },

    updateItemsPerPage (number) {
      this.worksPerPage = number
    },

    formatAuthors (field) {
      return Array.isArray(field) 
        ? field.map(x => ` ${x}`).join()
        : field;
    },

    setCurrentWork (work) {
      this.currentWork = work;
      this.indexWork = this.works.indexOf(work);
      this.currentWork.authorsSelect = this.currentWork.authorsData.map(x => x._id);
      this.dialog = true;
    },

    reset () {
      this.book = new Book();
      this.cover = {},
      this.url = null;
    },

    setFeedback (err) {
      this.snackbar = true;
      this.feedback = err 
        ? { color: 'red',   text: 'An error occurred while updating the work' }
        : { color: 'green', text: 'Work updating successfully' };
    },

    async updateWork () {
      try {
        await this.$store.dispatch('work/UPDATE', this.currentWork);
        
        this.currentWork.authorsData = this.authors.filter(y => this.currentWork.authorsSelect.includes(y.value));
        this.currentWork.authors     = this.currentWork.authorsData.map(x => x.name);
        this.works[this.indexWork]   = this.currentWork;
        
        this.setFeedback();
        this.dialog = false;
        this.currentWork = {};
      } catch (err) {
        this.setFeedback(err)
      }
    }

	},

	mounted () {
    this.$store.dispatch('work/FIND_ALL');
    this.$store.dispatch('author/FIND_ALL');
  }
}
</script>

<style lang="stylus" scoped>
.coverCol
  margin-left: 300px
</style>