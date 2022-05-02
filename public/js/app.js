import * as Vue from "./vue.js";

const app = Vue.createApp({
    data() {
        return {
            images: [],
            title: "",
            description: "",
            username: "",
            image: null,
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
            // Prevent the default form submission behavior
            e.preventDefault();

            // Create your data with the right encoding
            const formData = new FormData();
            formData.append("title", this.title);
            formData.append("image", this.image);
            formData.append("username", this.username);
            formData.append("description", this.description);

            // Trigger an Ajax to the server:
            fetch("/image", {
                method: "POST",
                body: formData,
            })
                .then((insertedImage) => {
                    return insertedImage.json();
                })
                .then((insertedImage) => {
                    this.images.unshift(insertedImage);
                });
        },

        handleFileChange(e) {
            console.log("Handle File Change");
            this.image = e.target.files[0];
        },
    },
});

app.mount("#main");
