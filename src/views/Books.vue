<template lang="pug">
  v-container(v-if="works")
    v-card(elevation="5" flat)
      v-toolbar(color="secondary" dark)
        v-toolbar-title.mr-3 Books
        v-icon mdi-book-account
      v-card-text
        v-container(fluid='')
          v-data-iterator(
            :items="books"
            :items-per-page.sync="booksPerPage"
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
                    v-card-title.d-inline-block.text-truncate.subheading.font-weight-bold(v-text="x.title" style="max-width: 380px")
                    v-divider
                    v-list
                      v-list-item(v-for="(key, index) in filteredKeys" :key="index" style="height: 65px")
                        v-list-item-content(:class="{ 'blue--text': sortBy === key }")
                          | {{ key }}:
                        v-list-item-content.align-end(
                          v-text="formatFields(x, key)"
                          :class="{ 'blue--text': sortBy === key }"
                        )
                    v-btn.ma-3(color="secondary" @click="setCurrentBook(x)") See Details
            template(v-slot:footer)
              v-row.mt-2(align="center" justify="center")
                span.grey--text Items per page
                v-menu(offset-y)
                  template(v-slot:activator='{ on, attrs }')
                    v-btn.ml-2(dark text color="primary" v-bind="attrs" v-on="on")
                      | {{ booksPerPage }}
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
    v-dialog(v-model="dialog" max-width="800px" persistent scrollable)
      v-card
        v-toolbar(color="secondary" dark)
          v-toolbar-title.mr-3(v-text="currentBook.title")
          v-icon mdi-cloud-upload
        v-card-text(style="height: 800px;")
          v-container(fill-height fluid)
            v-row(wrap)
              v-col(cols="12")
                v-text-field(
                  v-model="currentBook.title"
                  clearable
                  label="Title"
                  outlined
                  hint="For example, The Great Gatsby"
                )
                
                v-row.pa-0
                  v-col(cols="6")                    
                    v-autocomplete(
                      v-model="currentBook.worksSelect"
                      :items="works"
                      label="Works"
                      multiple
                      outlined
                    )

                    v-text-field(
                      v-model="currentBook.ISBN13"
                      type="number"
                      clearable
                      label="ISBN13"
                      outlined
                      hint="For example, 9788417430061"
                    )

                    v-text-field(
                      v-model="currentBook.pages"
                      type="number"
                      clearable
                      label="Pages"
                      outlined
                      hint="For example, 457"
                    )
                  v-col(cols="6")
                    v-select(
                      v-model="currentBook.format"
                      :items="['Paperback', 'Hardback']"
                      label="Format"
                      outlined
                    )
                    v-select(
                      v-model="currentBook.status"
                      :items="['Pending', 'Done']"
                      label="Status"
                      outlined
                    )

                    v-autocomplete(
                      v-model="currentBook.collectionSelect"
                      :items="collections"
                      label="Collection"
                      outlined
                    )
                  v-col(cols="12")
                    v-file-input(
                      v-model="cover"
                      @change="previewImage"
                      accept="image/png, image/jpeg, image/bmp"
                      placeholder="Pick an image"
                      prepend-icon="mdi-image"
                      label="Cover"
                      outlined
                    )
                  v-col.offset-md-3(v-if="url" cols="6")
                    v-img.coverCol(:src="url" width="250")
                  
                  v-col.offset-md-3(v-else cols="6")
                    v-img(v-if="currentCover" contain height="250" :src="currentCover")
            v-row
              v-col(cols="12")
                v-btn.mr-4(@click="updateBook" color="secondary" large) Update Book
                v-btn.mr-4(@click="updateBook" color="secondary" large) Send to Deluxe-Books.com
                v-btn(@click="reset" color="secondary" large) Close
    v-snackbar.text-center(v-model="snackbar" :color="feedback.color" dark)
      .text-center(v-text="feedback.text")
</template>

<script>
import Book from 'models/book';

export default {
  data: () => ({
    attrs: {
      class: 'mb-6',
      boilerplate: true,
      elevation: 2,
    },
    book: new Book (),
    cover: {},
    currentBook: {},
    dialog: false,
    snackbar: false,
    feedback: {
      color: null,
      text: null
    },
    indexBook: null,
    itemsPerPageArray: [4, 8, 12, 100],
    search: '',
    filter: {},
    sortDesc: false,
    page: 1,
    booksPerPage: 100,
    sortBy: 'name',
    keys: ['ISBN13','Format','Pages','Status','Works','Collection'],
    url: null
	}),
	
	computed: {
		collections () {
      const collections = this.$store.getters['collection/all'];
      return collections.map(x => ({ text: x.title, value: x._id }));
    },

    currentCover () {
      try {
        if (this.currentBook._id) {
          const { _id, DScollection } = this.currentBook;
          return require(`uploads/books/${DScollection._id}/${_id}.png`);
        }
        return null;
      } catch (err) {
        return null;
      } 
    },

    books () {
      const books = this.$store.getters['book/all'];
      
      try {
        return books.map(x => { 
          return ({
            ...x,
            collection: x.DScollection.title,
            collectionData: x.DScollection,
            works: x.works.map(y => y.title), 
            worksData: x.works 
          })
        })
      } catch (e) { 
        console.log(e);
        return [] 
      }
    },

    works () {
      const works = this.$store.getters['work/all'];
      return works.map(x => { return ({ text: x.title, value: x._id, ...x })});
    },

    numberOfPages () {
      return Math.ceil(this.books.length / this.booksPerPage);
    },

    filteredKeys () {
      return this.keys.filter(key => key !== 'Name');
    },
	},

	components: { },
	
	methods: {
    previewImage () {
      this.url = URL.createObjectURL(this.cover);
    },
    
    nextPage () {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },

    formerPage () {
      if (this.page - 1 >= 1) this.page -= 1
    },

    updateItemsPerPage (number) {
      this.booksPerPage = number
    },

    formatFields (field, key) {
      const regularField = field[key.toLowerCase()];

      return Array.isArray(regularField)
        ? regularField.filter((x,i) => i < 4).map(x => ` ${x}`).join()
        : regularField ? regularField : field[key];
    },

    setCurrentBook (book) {
      this.currentBook = book;
      this.indexBook = this.books.indexOf(book);
      this.currentBook.worksSelect = this.currentBook.worksData.map(x => x._id);
      this.currentBook.collectionSelect = this.currentBook.DScollection._id;
      this.dialog = true;
    },

    reset () {
      this.dialog = false;
      this.cover = {};
      this.currentBook = {};
      this.url = null;
    },

    setFeedback (err) {
      this.snackbar = true;
      this.feedback = err 
        ? { color: 'red',   text: 'An error occurred while updating the work' }
        : { color: 'green', text: 'Work updating successfully' };
    },

    async updateBook () {
      try {
        if (this.cover) {
          const formData = new FormData();
          
          formData.append('file', this.cover);
          formData.append('book', JSON.stringify(this.currentBook));
          
          await this.$store.dispatch('book/UPDATE', formData);
        
        } else {
          await this.$store.dispatch('book/UPDATE', this.currentBook);
        }

        this.currentBook.worksData = this.works.filter(y => this.currentBook.worksSelect.includes(y.value));
        this.currentBook.collectionData = this.collections.filter(y => this.currentBook.collectionSelect.includes(y.value))[0];

        this.currentBook.works       = this.currentBook.worksData.map(x => x.title);
        this.currentBook.collection  = this.currentBook.collectionData.text;

        this.books[this.indexBook] = this.currentBook;
        
        this.setFeedback();
        this.reset();
      } catch (err) {
        this.setFeedback(err);
      }
    }
	},

	async mounted () {
    await this.$store.dispatch('book/FIND_ALL');
    this.$store.dispatch('work/FIND_ALL');
  }
}
</script>

<style lang="stylus" scoped>
.coverCol
  margin-left: 50px
</style>