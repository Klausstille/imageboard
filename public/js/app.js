import * as Vue from "./vue.js";

const commentModule = {
    props: ["id"],
    data() {
        return {
            comments: "",
            username: "",
            comment: "",
        };
    },
    template: `
    <h1>Add a Comment!</h1>
    <div class="input-field">
        <input v-model="comment" name="comment" placeholder="Leave a comment":type="type"/>
        <input v-model="username" name="username" placeholder="Username":type="type"/>
        <button>Submit</button>
     </div>

     <div id="comments">
        {{comments}}
     </div>

    `,
    mounted() {
        console.log("comment module is up");
        // fetch("/comments/" + this.id)
        //     .then((resp) => resp.json())
        //     .then((data) => {
        //         console.log("data from fetch", data);
        //         this.username = data.username;
        //         this.comments = data.comments;
        //         this.comment = data.comment;
        //     });
    },
    // methods: {},
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
            <comment-module></comment-module>
        </div>
    </div>
    `,
    mounted() {
        console.log("this.id", this.selectedImage);
        fetch("/image/" + this.selectedImage)
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data from fetch", data);
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
