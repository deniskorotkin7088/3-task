let app = new Vue({
    el: '#app',
    data: {
        cards: [
            { 
                id: 1, 
                title: 'Разработка макета', 
                description: 'Создать дизайн главной страницы',
                deadline: '2026-03-20',
                column: 1,
                createdAt: '2026-03-13',
                editedAt: null
            }
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
        },
        column4() {
            return this.cards.filter(c => c.column === 4);
        }
    }
});