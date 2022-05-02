import * as Vue from "/public/js/vue.js";

// const inputField = {
//     props: ["label", "type"],
//     template: `
//     <div class="input-field">
//         <label>{{ label }}</label>
//         <input :type="type" required/>
//     </div>
//     `,
// };
const inputField = {
    props: ["label", "type"],
    methods: {
        onInput(evt) {
            console.log("onInput", evt.target.value);
            this.$emit("change", evt.target.value);
        },
    },
    template: `
    <div class="input-field"> 
        <label>{{ label }}</label>
        <input :type="type" required @input="onInput"/>
    </div>
    `,
};

const userView = {
    props: ["id"],
    data() {
        return {
            user: {},
            loaded: false,
        };
    },
    mounted() {
        const url = "reqres.in/api/users" + this.id;
        fetch(url)
            .then((response) => response.json())
            .then(({ data }) => {
                this.user = data;
                this.loaded = true;
            });
    },
    template: `
    <div class="user-view">
        {{user.first_name}} {{user.last_name}} {{user.email}}
    </div>
    `,
};

const switchButton = {
    props: ["text"],
    methods: {
        onButtonClick() {
            console.log("beeeen clickkked");
            this.clicked = !this.clicked;
        },
    },
    template: `
    <div v-bind:class="{ 'switch-button' : true, 'clicked' : clicked }">
        <button v-on:click="onButtonClick">{{ text }}</button>
    </div>
    `,
    data() {
        return {
            clicked: true,
        };
    },
};
// <div class="switch-button">
// <button @click="onButtonClick">{{ text }}</button>;

const app = Vue.createApp({
    components: {
        "switch-button": switchButton,
        "input-field": inputField,
        "user-view": userView,
    },
    methods: {
        onTitleChange(value) {
            console.log("onTitleChange", value);
            this.title = value;
        },
    },
    data() {
        return {
            title: "Vue examples",
            listOfUsers: [1, 2, 3],
        };
    },
});

app.mount("#main");
