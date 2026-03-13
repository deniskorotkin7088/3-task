Vue.component('kanban-card', {
    template: `
        <div class="card">
            <h3>{{ card.title }}</h3>
            <p class="description">{{ card.description }}</p>
            <div class="meta">
                <div>Создано: {{ card.createdAt }}</div>
                <div>Дедлайн: {{ card.deadline }}</div>
                <div v-if="card.editedAt">✏️ Ред.: {{ card.editedAt }}</div>
            </div>
        </div>
    `,
    props: {
        card: {
            type: Object,
            required: true
        }
    }
});
let app = new Vue({
    el: '#app',
    data: {
        cards: [],
        newTitle: '',
        newDescription: '',
        newDeadline: ''
    },
    computed: {
        column1() { return this.cards.filter(c => c.column === 1); },
        column2() { return this.cards.filter(c => c.column === 2); },
        column3() { return this.cards.filter(c => c.column === 3); },
        column4() { return this.cards.filter(c => c.column === 4); }
    },
    methods: {

        addCard() {
            if (!this.newTitle || !this.newDeadline) return;
            
            const card = {
                id: Date.now(),
                title: this.newTitle,
                description: this.newDescription || 'Нет описания',
                deadline: this.newDeadline,
                column: 1,
                createdAt: new Date().toLocaleDateString(),
                editedAt: null
            };
            
            this.cards.push(card);
            this.newTitle = '';
            this.newDescription = '';
            this.newDeadline = '';
        }
    }
});