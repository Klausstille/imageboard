import * as Vue from "./vue.js";

const commentModule = {
    props: ["selectedImage"],
    data() {
        return {
            comments: [],
            username: "",
            text: "",
        };
    },
    template: `
    <div id="commentmodule">
    <h1>Add a Comment!</h1><br>
    <div class="input-field-comment">
        <input v-model="text" name="text" placeholder="Leave a comment" type="text"/>
        <input v-model="username" name="username" placeholder="Username" type="username"/>
        <button @click="submitPost" id="submitcomment">Submit</button>
     </div><br><h5>Total comments: {{comments.length}}</h5>
        <div v-for="comment in comments" id="comments">
        <p>{{comment.username}}: {{comment.text}}</p>
        </div>
    </div>
    `,
    mounted() {
        console.log("comment module is up", this.selectedImage);
        fetch("/comments/" + this.selectedImage)
            .then((response) => response.json())
            .then((response) => {
                console.log("APPPPJS:comments", response);

                // this.text = response.text;
                // this.username = response.username;
                this.comments = response;
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
            loaded: false,
            previous: "",
            next: "",
        };
    },
    components: {
        "comment-module": commentModule,
    },
    template: `
    <div id="module">
        <div id="content">
            <img id="imagemodule" :src="url"><br><br>
            <h2>{{title}}</h2><p>{{description}}</p><h5>Uploaded by: {{username}}</h5><br>
            <comment-module v-if="selectedImage" :selected-image="selectedImage"></comment-module>
        </div>
        <button class="next-previous" @click="nextImg" > → </button>
        <button class="next-previous" @click="previousImg" > ← </button>
        <div @click="onCloseClick" id="closecontainer"></div>
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
                this.loaded = true;
                this.previous = data.previous;
                this.next = data.next;
            });
    },
    methods: {
        onCloseClick() {
            this.$emit("close");
        },
        onBackDropClick(e) {
            if (e.target.id === "backdrop") {
                this.$emit("close");
            }
        },
        nextImg() {
            console.log("NEXT BUTTON");
            this.$emit("update", this.next);
        },
        previousImg() {
            console.log("PREVIOUS BUTTON");
            this.$emit("update", this.previous);
        },
    },
    watch: {
        selectedImage: function () {
            fetch("/images/" + this.selectedImage)
                .then((resp) => {
                    if (resp.status >= 400) {
                        this.$emit("close");
                        return {};
                    }
                    return resp.json();
                })
                .then((image) => {
                    this.url = image.url;
                    this.username = image.username;
                    this.title = image.title;
                    this.loaded = true;
                    this.previous = image.previous;
                    this.next = image.next;
                });
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
            seen: true,
        };
    },
    mounted() {
        addEventListener("popstate", () => {
            this.selectedImage = location.pathname.slice(1);
        });
        window.addEventListener("scroll", this.scroll);
        const idFromUrl = location.pathname.slice(1);
        this.selectedImage = idFromUrl;
        console.log(this.selectedImage);

        // fetch images to display
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
            console.log(image_id);
            this.selectedImage = image_id;
            history.pushState({}, "", this.selectedImage);
        },
        onCloseClick() {
            this.selectedImage = null;
            history.pushState({}, "", "/");
        },
        handleFileChange(e) {
            console.log("Handle File Change");
            this.image = e.target.files[0];
        },
        loadMore() {
            const lowestId = this.images[this.images.length - 1].id;
            console.log("lastId in the APPPPJS", lowestId);
            fetch("/more/" + lowestId)
                .then((images) => images.json())
                .then((image) => {
                    if (image.length) {
                        const lowestId = image[0].lowestId;
                        for (let i = 0; i < image.length; i++) {
                            if (lowestId === image[i].id) {
                                this.seen = false;
                                console.log("hide");
                            }
                        }
                    }
                    this.images = [...this.images, ...image];
                })
                .catch((error) => {
                    console.log("error from the then in loadMore!!", error);
                });
        },
        mouseEnter(e) {
            // console.log("MOUSENTER", e.target);
            e.target.className = "";
            e.target.classList.add("shape-default");
        },
        mouseLeave(e) {
            const random = this.getRandomShape();
            // console.log(random);
            e.target.classList.add(random);
        },
        getRandomShape() {
            const index = Math.floor(Math.random() * 7) + 1;
            return `shape-${index}`;
        },
    },
});

app.mount("#main");
