import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('views/Home')
    },
    {
      path: '/authors/add/',
      name: 'AUTHORS_ADD',
      component: () => import('views/AuthorsAdd')
    },
    {
      path: '/books/all/',
      name: 'BOOKS',
      component: () => import('views/Books')
    },
    {
      path: '/books/add/',
      name: 'BOOKS_ADD',
      component: () => import('views/BooksAdd')
    },
    {
      path: '/collections/add/',
      name: 'COLLECTIONS_ADD',
      component: () => import('views/CollectionsAdd')
    },
    {
      path: '/collections/:id/',
      name: 'COLLECTIONS',
      component: () => import('views/DeluxeCollection')
    },
    {
      path: '/publishers/add/',
      name: 'PUBLISHERS_ADD',
      component: () => import('views/PublishersAdd')
    },
    {
      path: '/works/all/',
      name: 'WORKS',
      component: () => import('views/Works')
    },
    {
      path: '/works/add/',
      name: 'WORKS_ADD',
      component: () => import('views/WorksAdd')
    },
  ]
});

export default router;