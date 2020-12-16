<template lang="pug">
  v-container
    v-card(elevation="5" flat)
      v-toolbar(color="secondary" dark)
        v-toolbar-title.mr-3 Add Author
        v-icon mdi-head-lightbulb
      v-card-text
        form
          v-container(fill-height fluid)
            v-row(wrap)
              v-col(cols="12")
                v-text-field(
                  v-model="author.name"
                  clearable
                  label="Name"
                  outlined
                  hint="For example, Louisa May Alcott"
                )
                v-row.pa-0
                  v-col(cols="6")
                    v-text-field(
                      v-model="author.birth"
                      type="number"
                      clearable
                      label="Birth"
                      outlined
                      hint="For example, 1941"
                    )

                    v-text-field(
                      v-model="author.death"
                      type="number"
                      clearable
                      label="Death"
                      outlined
                      hint="For example, 1989"
                    )
                  v-col(cols="6")
                    v-text-field(
                      v-model="author.country"
                      type="text"
                      clearable
                      label="Country"
                      outlined
                      hint="For example, United States"
                    )

                    v-select(
                      v-model="author.genre"
                      :items="['Man', 'Woman']"
                      label="Genre"
                      outlined
                    )                    
      v-card-actions
        v-row
          v-col.ml-5(cols="4")
            v-btn(@click="addAuthor" color="primary" large) Add Author
    v-snackbar.text-center(v-model="snackbar" :color="feedback.color" dark)
      .text-center(v-text="feedback.text")
</template>

<script>
import Author from 'models/author';

export default {
  data: () => ({
    author: new Author (),
    snackbar: false,
    feedback: {
      color: null,
      text: null
    }
	}),
	
	computed: {
    add () {
      return this.$store.getters['author/add'];
    }
	},
	
	methods: {
    async addAuthor () {
      try {
        await this.$store.dispatch('author/ADD', this.author);
        this.setFeedback();
        this.reset();
      } catch (err) { this.setFeedback(err) }
    },

    reset () {
      this.author = new Author();
    },

    setFeedback (err) {
      this.snackbar = true;
      this.feedback = err 
        ? { color: 'red',   text: 'An error occurred while adding the author' }
        : { color: 'green', text: 'Author added successfully' };
    }
	}
}
</script>

<style lang="stylus" scoped>
.coverCol
  margin-left: 300px
</style>