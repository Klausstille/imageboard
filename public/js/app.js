import * as Vue from "./vue.js";

const app = Vue.createApp({
    data() {
        return {
            images: [],
            title: "",
        };
    },
    mounted() {
        console.log("vue app just mounted");
        console.log("this:", this);
        fetch("/getimages")
            .then((resp) => resp.json())
            .then((resp) => {
                console.log("this", this);
                this.images = resp;
            });
    },
    methods: {
        handleSubmit(e) {
            e.preventDefault();
            const formData = {};
            fetch("/getimages", {
                method: "POST",
                body: formData,
            });
        },
        handleFileChange(e) {
            console.log("Change FILE", e.target);
            this.image = e.target.files[0];
        },
    },
});

app.mount("#main");
