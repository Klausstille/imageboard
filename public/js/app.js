import * as Vue from "./vue.js";

const commentModule = {
    props: ["selectedImage"],
    data() {
        return {
            comments: "",
            username: "",
            text: "",
        };
    },
    template: `
    <h1>Add a Comment!</h1>
    <div class="input-field">
        <input v-model="text" name="text" placeholder="Leave a comment" type="text"/>
        <input v-model="username" name="username" placeholder="Username" type="username"/>
        <button @click="submitPost">Submit</button>
     </div>

     <div id="comments">
        {{text}}
        {{username}}
     </div>

    `,
    mounted() {
        console.log("comment module is up", this.selectedImage);
        fetch("/comments/" + this.selectedImage)
            .then((response) => response.json())
            .then((response) => {
                this.text = response.text;
                this.username = response.username;
                // console.log("APPPPJS:comments", this.username, this.text);
            })
            .catch((error) => {
                console.log("error on CLIENT SIDE", error);
            });
    },
    methods: {
        submitPost() {
            const data = JSON.stringify({
                text: this.text,
                username: this.username,
                image_id: this.selectedImage,
            });
            console.log("data", data);
            fetch("/comment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: data,
            })
                .then((res) => res.json())
                .then((res) => {
                    this.comments = [...this.comments, res];
                    this.username = "";
                    this.text = "";
                });
        },
    },
};

const myComponent = {
    props: ["selectedImage"],
    data() {
        return {
            url: "",
            title: "",
            description: "",
            username: "",
        };
    },
    components: {
        "comment-module": commentModule,
    },
    template: `
    <div id="module">
        <div id="content">
            <div class="close" @click="onCloseClick"><img src="/js/icon.png"></div>
            <img :src="url">
            <h2>{{title}}</h2><p>{{description}}</p><p>Uploaded by: {{username}}</p>
            <comment-module v-if="selectedImage" :selected-image="selectedImage"></comment-module>
        </div>
    </div>
    `,
    mounted() {
        console.log("this.id", this.selectedImage);
        fetch("/image/" + this.selectedImage)
            .then((resp) => resp.json())
            .then((data) => {
                // console.log("data from fetch", data);
                this.url = data.url;
                this.description = data.description;
                this.title = data.title;
                this.username = data.username;
            });
    },
    methods: {
        onCloseClick() {
            this.$emit("close");
        },
    },
};

const app = Vue.createApp({
    components: {
        "my-component": myComponent,
        // "image-board": imageBoard,
    },
    data() {
        return {
            images: [],
            title: "",
            description: "",
            username: "",
            image: null,
            selectedImage: null,
        };
    },
    mounted() {
        console.log("vue app just mounted");
        console.log("this:", this);
        fetch("/getimages")
            .then((image) => image.json())
            .then((image) => {
                console.log("this", image);
                this.images = image;
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
        onClick(image_id) {
            console.log("image clicked!!!", image_id);
            this.selectedImage = image_id;
        },
        onCloseClick() {
            this.selectedImage = null;
        },

        handleFileChange(e) {
            console.log("Handle File Change");
            this.image = e.target.files[0];
        },
    },
});

app.mount("#main");
