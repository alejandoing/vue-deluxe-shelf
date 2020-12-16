<template lang="pug">
  v-container
    v-card(elevation="5" flat)
      v-toolbar(color="secondary" dark)
        v-toolbar-title.mr-3 Add Publisher
        v-icon mdi-head-lightbulb
      v-card-text
        form
          v-container(fill-height fluid)
            v-row(wrap)
              v-col(cols="6")
                v-text-field(
                  v-model="publisher.title"
                  clearable
                  label="Name"
                  outlined
                  hint="For example, Penguin Random House"
                )

              v-col(cols="6")
                v-text-field(
                  v-model="publisher.country"
                  type="text"
                  clearable
                  label="Country"
                  outlined
                  hint="For example, United States"
                )                   
      v-card-actions
        v-row
          v-col.ml-5(cols="4")
            v-btn(@click="addPublisher" color="primary" large) Add Publisher
    v-snackbar.text-center(v-model="snackbar" :color="feedback.color" dark)
      .text-center(v-text="feedback.text")
</template>

<script>
import Publisher from 'models/publisher';

export default {
  data: () => ({
    publisher: new Publisher (),
    snackbar: false,
    feedback: {
      color: null,
      text: null
    }
	}),
	
	computed: {
    add () {
      return this.$store.getters['publisher/add'];
    }
	},
	
	methods: {
    async addPublisher () {
      try {
        await this.$store.dispatch('publisher/ADD', this.publisher);
        this.setFeedback();
        this.reset();
      } catch (err) { this.setFeedback(err) }
    },

    reset () {
      this.publisher = new Publisher();
    },

    setFeedback (err) {
      this.snackbar = true;
      this.feedback = err 
        ? { color: 'red',   text: 'An error occurred while adding the publisher' }
        : { color: 'green', text: 'Publisher added successfully' };
    }
	}
}
</script>

<style lang="stylus" scoped>
.coverCol
  margin-left: 300px
</style>