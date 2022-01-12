<template>
    <div class="center-form">
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
                placeholder="Enter the Book's name..."
                v-model="request.name"
            />
            <br />

            Cost <input
                type="number"
                step="0.01"
                placeholder="Enter the Book's cost..."
                v-model="request.cost"
            />
            <br />

            Author
            <input
                type="text"
                placeholder="Enter the Book's Author..."
                v-model="request.author"
            />
            <br />
            <label for="datePublished">Date Published:</label>
            <input
                type="date"
                v-model="request.datePublished"
            >
            <br />

            <label for="type">Type</label>
            <select v-model="request.type">
                <option
                    id="Book"
                    value="Book"
                >Book</option>
                <option
                    id="Audiobook"
                    value="Audiobook"
                >Audiobook</option>
            </select>
            <br />

            <input
                type="submit"
                class="button-green"
                value="Submit"
            />

        </form>
    </div>
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
                    cost: "",
                    author: "",
                    datePublished: "",
                    type: "",
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
                this.request.author === "" ||
                (this.request.type !== "Book" &&
                    this.request.type !== "Audiobook") ||
                this.request.datePublished === ""
            ) {
                console.log(this.request);
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