let app = new Vue({
    el: '#app',
    data: {
        message: 'Kanban запущена'
    },
    mounted() {
        console.log(this.message);
    }
});