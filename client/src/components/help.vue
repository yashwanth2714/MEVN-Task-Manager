<template>
    <div>
        <p class="help" :class="msgType">{{message}}</p>
    </div>
</template>

<script>
export default {
    props: {
        msgType: {
            required: true,
            type: String
        },
        message: {
            type: String,
            required: true
        }
    }
}
</script>
