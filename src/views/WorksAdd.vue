<template lang="pug">
  v-container
    v-card(elevation="5" flat)
      v-toolbar(color="secondary" dark)
        v-toolbar-title.mr-3 Add Work
        v-icon mdi-book-account
      v-card-text
        form
          v-container(fill-height fluid)
            v-row(wrap)
              v-col(cols="12")
                v-text-field(
                  v-model="work.title"
                  clearable
                  label="Title"
                  outlined
                  hint="For example, The Great Gatsby"
                )
                v-row.pa-0
                  v-col(cols="6")                    
                    v-autocomplete(
                      v-model="work.authors"
                      :items="authors"
                      label="Authors"
                      multiple
                      outlined
                    )

                    v-text-field(
                      v-model="work.year"
                      type="number"
                      clearable
                      label="Year"
                      outlined
                      hint="For example, 1941"
                    )
                  v-col(cols="6")
                    v-select(
                      v-model="work.language"
                      :items="['Spanish', 'English', 'French', 'Irish', 'German', 'Danish']"
                      label="Language"
                      outlined
                    )

      v-card-actions
        v-row
          v-col.ml-5(cols="4")
            v-btn(@click="addWork" color="primary" large) Add Work
    v-snackbar.text-center(v-model="snackbar" :color="feedback.color" dark)
      .text-center(v-text="feedback.text")
</template>

<script>
import Work from 'models/work';

export default {
  data: () => ({
    work: new Work (),
    snackbar: false,
    feedback: {
      color: null,
      text: null
    }
	}),
	
	computed: {
    add () {
      return this.$store.getters['work/add'];
    },

    authors () {
      const authors = this.$store.getters['author/all'];
      return authors.map(x => ({ text: x.name, value: x._id }));
    }
	},
	
	methods: {
    async addWork () {
      try {
        await this.$store.dispatch('work/ADD', this.work);
        this.setFeedback();
        this.reset();
      } catch (err) {
        this.setFeedback(err)
      }
    },

    reset () {
      this.work = new Work();
    },

    setFeedback (err) {
      this.snackbar = true;
      this.feedback = err 
        ? { color: 'red',   text: 'An error occurred while adding the work' }
        : { color: 'green', text: 'Work added successfully' };
    }
	},

	mounted () {
		this.$store.dispatch('author/FIND_ALL');
  }
}
</script>

<style lang="stylus" scoped>
.coverCol
  margin-left: 300px
</style>