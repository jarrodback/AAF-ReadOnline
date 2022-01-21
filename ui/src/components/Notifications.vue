  <template>
    <div>
        <p>{{notification.message}}
    </div>
</template>

<script>
export default {
    name: "notification",
    props: {
        notification,
    },
};
</script>
<style>
.login-div {
    max-width: 500px;
    padding: 10px;
}
.submit-space {
    padding: 15px;
}
</style>


