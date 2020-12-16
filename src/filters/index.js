import Vue from 'vue';

Vue.filter('formatPages', value => {
    return `${value} pag.`;
});

Vue.filter('filterQuantity', value => {
    return `(${value})`;
})