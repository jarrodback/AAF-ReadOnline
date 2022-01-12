<template>
    <form
        action="#"
        @submit.prevent="onSubmit"
    >
        <p
            v-if="errorsPresent"
            class="error"
        >Please fill out all fields!
        </p>
        Name <input
            type="text"
            placeholder="Enter name..."
            v-model="request.name"
        />
        <br />
        Cost <input
            type="text"
            placeholder="Enter cost..."
            v-model="request.cost"
        />
        <br />
        Author
        <input
            type="text"
            placeholder="Enter Author..."
            v-model="request.author"
        />
        <br />
        Date Published
        <input
            type="text"
            placeholder="Enter date published..."
            v-model="request.datePublished"
        />
        <br />
        AudioBook? <input
            type="text"
            placeholder="Enter if audiobook..."
            v-model="request.audiobook"
        />
        <br />
        <button class="positive ui button">Submit</button>
    </form>
</template>
 
<script>
export default {
    name: "request-form",
    props: {
        request: {
            type: Object,
            required: false,
            default: () => {
                return {
                    name: "",
                    cost: 1,
                    author: "",
                    datePublished: Date.now(),
                    audiobook: false,
                };
            },
        },
    },
    data() {
        return {
            errorsPresent: false,
        };
    },
    methods: {
        onSubmit: function () {
            if (
                this.request.name === "" ||
                this.request.cost === "" ||
                this.request.author === ""
            ) {
                this.errorsPresent = true;
            } else {
                this.$emit("createOrUpdate", this.request);
            }
        },
    },
};
</script>
 
<style scoped>
.error {
    color: red;
}
</style>