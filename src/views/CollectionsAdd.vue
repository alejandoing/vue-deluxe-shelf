<template lang="pug">
  v-container
    v-card(elevation="5" flat)
      v-toolbar(color="secondary" dark)
        v-toolbar-title.mr-3 Add Collection
        v-icon mdi-head-lightbulb
      v-card-text
        form
          v-container(fill-height fluid)
            v-row(wrap)
              v-col(cols="12")
                v-text-field(
                  v-model="collection.title"
                  clearable
                  label="Title"
                  outlined
                  hint="For example, Chiltern Classics"
                )
                v-row.pa-0
                  v-col.pb-0(cols="6")
                    v-select(
                      v-model="collection.language"
                      :items="['Spanish', 'English']"
                      label="Language"
                      outlined
                    )
                  v-col.pb-0(cols="6")
                    v-autocomplete(
                      v-model="collection.publisher"
                      :items="publishers"
                      label="Publishers"
                      outlined
                    )
              v-col.py-0(cols="12")
                v-textarea(
                  v-model="collection.description"
                  label="Description"
                  outlined
                )
      v-card-actions
        v-row
          v-col.ml-5(cols="4")
            v-btn(@click="addCollection" color="primary" large) Add Collection
    v-snackbar.text-center(v-model="snackbar" :color="feedback.color" dark)
      .text-center(v-text="feedback.text")
</template>

<script>
import Collection from 'models/collection';

export default {
  data: () => ({
    collection: new Collection (),
    snackbar: false,
    feedback: {
      color: null,
      text: null
    }
	}),
	
	computed: {
    add () {
      return this.$store.getters['collection/add'];
    },

    publishers () {
      const publishers = this.$store.getters['publisher/all'];
      return publishers.map(x => { return { text: x.title, value: x._id }});
    }
	},
	
	methods: {
    async addCollection () {
      try {
        await this.$store.dispatch('collection/ADD', this.collection);
        this.setFeedback();
        this.reset();
      } catch (err) { this.setFeedback(err) }
    },

    reset () {
      this.collection = new Collection();
    },

    setFeedback (err) {
      this.snackbar = true;
      this.feedback = err 
        ? { color: 'red',   text: 'An error occurred while adding the collection' }
        : { color: 'green', text: 'Collection added successfully' };
    }
	}
}
</script>

<style lang="stylus" scoped>
.coverCol
  margin-left: 300px
</style>