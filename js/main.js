let app = new Vue({
    el: '#app',
    data: {
        cards: [
            { id: 1, title: 'Задача 1', column: 1 },
            { id: 2, title: 'Задача 2', column: 2 },
            { id: 3, title: 'Задача 3', column: 3 }
        ]
    },
    computed: {
        column1() {
            return this.cards.filter(c => c.column === 1);
        },
        column2() {
            return this.cards.filter(c => c.column === 2);
        },
        column3() {
            return this.cards.filter(c => c.column === 3);
        }
    }
});