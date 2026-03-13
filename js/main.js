Vue.component('kanban-card', {
    template: `
     <div class="card">
            <div v-if="!isEditing">
                <div class="card-header">
                    <h3>{{ card.title }}</h3>
                    <div class="card-actions">
                        <button @click="startEdit" class="edit-btn"></button>
                        <button @click="deleteCard" class="delete-btn"></button>
                    </div>
                </div>
                <p class="description">{{ card.description }}</p>
                <div class="meta">
                    <div>Создано: {{ card.createdAt }}</div>
                    <div>Дедлайн: {{ card.deadline }}</div>
                    <div v-if="card.editedAt">Ред.: {{ card.editedAt }}</div>
                </div>
            </div>
            <div v-else class="edit-mode">
                <input v-model="editTitle" placeholder="Заголовок" class="edit-input">
                <textarea v-model="editDescription" placeholder="Описание" class="edit-input"></textarea>
                <input v-model="editDeadline" type="date" class="edit-input">
                <div class="edit-actions">
                    <button @click="saveEdit" class="save-btn">Сохранить</button>
                    <button @click="cancelEdit" class="cancel-btn">Отмена</button>
                </div>
            </div>
        </div>
    `,
    props: {
        card: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            isEditing: false,
            editTitle: '',
            editDescription: '',
            editDeadline: ''
        };
    },
    methods: {
        startEdit() {
            this.editTitle = this.card.title;
            this.editDescription = this.card.description;
            this.editDeadline = this.card.deadline;
            this.isEditing = true;
        },
        saveEdit() {
            this.$emit('edit', {
                id: this.card.id,
                title: this.editTitle,
                description: this.editDescription,
                deadline: this.editDeadline
            });
            this.isEditing = false;
        },
        cancelEdit() {
            this.isEditing = false;
        },
        deleteCard() {
            if (confirm('Удалить карточку?')) {
                this.$emit('delete', this.card.id);
            }
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
        },
        handleEdit(data) {
        const card = this.cards.find(c => c.id === data.id);
        if (card) {
            card.title = data.title;
            card.description = data.description;
            card.deadline = data.deadline;
            card.editedAt = new Date().toLocaleString();
        }
    },
    handleDelete(id) {
        this.cards = this.cards.filter(c => c.id !== id);
    }
}
});