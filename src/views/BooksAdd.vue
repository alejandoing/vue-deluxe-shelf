<template lang="pug">
  v-container
    v-card(elevation="5" flat)
      v-toolbar(color="secondary" dark)
        v-toolbar-title.mr-3 Add Book
        v-icon mdi-cloud-upload
      v-card-text
        form
          v-container(fill-height fluid)
            v-row(wrap)
              v-col(cols="6")
                v-text-field(
                  v-model="book.title"
                  clearable
                  label="Title"
                  outlined
                  hint="For example, The Great Gatsby"
                )
                
                v-row.pa-0
                  v-col(cols="6")
                    v-autocomplete(
                      v-model="book.DScollection"
                      :items="collections"
                      label="Collection"
                      outlined
                    )
                  
                    v-autocomplete(
                      v-model="book.works"
                      :items="works"
                      label="Work"
                      multiple
                      outlined
                    )

                    v-text-field(
                      v-model="book.pages"
                      type="number"
                      clearable
                      label="Pages"
                      outlined
                      hint="For example, 256"
                    )
                  v-col(cols="6")
                    v-text-field(
                      v-model="book.ISBN13"
                      type="number"
                      clearable
                      label="ISBN13"
                      outlined
                      hint="For example, 9780241198773"
                    )

                    v-select(
                      v-model="book.format"
                      :items="['Hardback', 'Paperback']"
                      label="Format"
                      outlined
                    )

                    v-select(
                      v-model="book.status"
                      :items="['Done', 'Pending']"
                      label="Status"
                      outlined
                    )

              v-col(cols="6")
                v-file-input(
                  v-model="cover"
                  @change="previewImage"
                  accept="image/png, image/jpeg, image/bmp"
                  placeholder="Pick an image"
                  prepend-icon="mdi-image"
                  label="Cover"
                  outlined
                )
                v-img.coverCol(:src="url" width="250")

      v-card-actions
        v-row
          v-col.ml-5(cols="4")
            v-btn(@click="AddBook" color="primary" large) Add Book
    v-snackbar.text-center(v-model="snackbar" :color="feedback.color" dark)
      .text-center(v-text="feedback.text")
</template>

<script>
import Book from 'models/book';

export default {
  data: () => ({
    book: new Book (),
    cover: {},
    url: null,
    snackbar: false,
    feedback: {
      color: null,
      text: null
    }
	}),
	
	computed: {
		collections () {
      const collections = this.$store.getters['collection/all'];
      return collections.map(x => ({ text: x.title, value: x._id }));
    },

    add () {
      return this.$store.getters['book/add'];
    },

    works () {
      const works = this.$store.getters['work/all'];
      return works.map(x => ({ text: x.title, value: x._id }));
    }
	},

	components: { },
	
	methods: {
    previewImage () {
      this.url = URL.createObjectURL(this.cover);
    },

    async AddBook () {
      const formData = new FormData();
      
      formData.append('file', this.cover);
      formData.append('book', JSON.stringify(this.book));

      try {
        await this.$store.dispatch('book/ADD', formData);
        this.setFeedback();
        this.reset();
      } catch (err) {
        this.setFeedback(err)
      }
    },

    reset () {
      this.book = new Book();
      this.cover = {},
      this.url = null;
    },

    setFeedback (err) {
      this.snackbar = true;
      this.feedback = err 
        ? { color: 'red',   text: 'An error occurred while adding the book' }
        : { color: 'green', text: 'Book added successfully' };
    }
  },
  
	mounted () {
    this.$store.dispatch('work/FIND_ALL');
  }
}
</script>

<style lang="stylus" scoped>
.coverCol
  margin-left: 300px
</style>