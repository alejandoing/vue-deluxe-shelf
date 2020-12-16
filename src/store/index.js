import Vue from 'vue';
import Vuex from 'vuex';

import { author } from './author.module';
import { book } from './book.module';
import { collection } from './collection.module';
import { layout } from './layout.module';
import { publisher } from './publisher.module';
import { work } from './work.module';

Vue.use(Vuex);

export default new Vuex.Store({ modules: { author, book, collection, layout, publisher, work } });