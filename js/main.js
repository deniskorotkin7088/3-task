Vue.component('kanban-card', {
    template: `
        <div class="card" :class="deadlineClass">
            <div v-if="!isEditing">
                <div class="card-header">
                    <h3>{{ card.title }}</h3>
                    <div class="card-actions">
                        <button @click="startEdit" class="edit-btn">Редактировать</button>
                        <button @click="deleteCard" class="delete-btn">Удалить</button>
                    </div>
                </div>
                
                <p class="description">{{ card.description }}</p>
                
                <div class="meta">
                    <div>Создано: {{ card.createdAt }}</div>
                    <div>Дедлайн: {{ card.deadline }}</div>
                    <div v-if="card.editedAt">Ред.: {{ card.editedAt }}</div>
                    
                    <div v-if="card.column === 4" class="deadline-status" :class="deadlineClass">
                        {{ deadlineText }}
                    </div>
                </div>
                
                <div class="move-buttons" v-if="card.column < 4">
                    <button v-if="card.column === 1" @click="moveTo(2)" class="move-btn next">
                        В работу
                    </button>
                    
                    <button v-if="card.column === 2" @click="moveTo(3)" class="move-btn next">
                        Тестирование
                    </button>
                    
                    <div v-if="card.column === 3" class="move-group">
                        <button @click="moveTo(4)" class="move-btn next">Выполнено</button>
                        <button @click="showReturn = true" class="move-btn back">Вернуть</button>
                    </div>
                </div>
                
                <div v-if="showReturn" class="return-reason">
                    <textarea 
                        v-model="returnReason" 
                        placeholder="Причина возврата" 
                        class="reason-input">
                    </textarea>
                    <button @click="submitReturn" class="submit-reason">Подтвердить</button>
                    <button @click="cancelReturn" class="cancel-reason">Отмена</button>
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
            editDeadline: '',
            showReturn: false,
            returnReason: ''
        };
    },
    computed: {
        deadlineText() {
            if (this.card.column !== 4) return '';
            
            const today = new Date();
            const deadline = new Date(this.card.deadline);
            
            if (today > deadline) {
                return 'Просрочено';
            } else {
                return 'Выполнено в срок';
            }
        },
        
        deadlineClass() {
            if (this.card.column !== 4) return '';
            
            const today = new Date();
            const deadline = new Date(this.card.deadline);
            
            return today > deadline ? 'overdue' : 'ontime';
        }
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
        },
        
        moveTo(column) {
            this.$emit('move', {
                id: this.card.id,
                toColumn: column,
                reason: this.returnReason
            });
            this.showReturn = false;
            this.returnReason = '';
        },
        
        submitReturn() {
            if (this.returnReason) {
                this.moveTo(2);
            }
        },
        
        cancelReturn() {
            this.showReturn = false;
            this.returnReason = '';
        }
    }
});

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
            },
            { 
                id: 2, 
                title: 'Верстка компонентов', 
                description: 'Реализовать карточки товаров',
                deadline: '2026-03-22',
                column: 2,
                createdAt: '2026-03-13',
                editedAt: null
            },
            { 
                id: 3, 
                title: 'Тестирование интерфейса', 
                description: 'Проверить все функции',
                deadline: '2026-03-15',
                column: 3,
                createdAt: '2026-03-13',
                editedAt: null
            },
            { 
                id: 4, 
                title: 'Завершенная задача', 
                description: 'Пример выполненной задачи',
                deadline: '2026-03-10',
                column: 4,
                createdAt: '2026-03-13',
                editedAt: null
            }
        ],
        newTitle: '',
        newDescription: '',
        newDeadline: ''
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
        },
        
        handleMove(data) {
            const card = this.cards.find(c => c.id === data.id);
            if (card) {
                card.column = data.toColumn;
                if (data.reason) {
                    card.returnReason = data.reason;
                    card.editedAt = new Date().toLocaleString();
                }
            }
        }
    }
});