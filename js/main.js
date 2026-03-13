let app = new Vue({
    el: '#app',
    data: {
        message: 'Приложение запущено'
    },
    mounted() {
        console.log(this.message);
    }
});