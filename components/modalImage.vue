<template>
    <v-dialog
      v-model="modal"
      fullscreen
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
        >
            <v-btn
                color="primary"
                @click="close"
            > Close
            </v-btn>
            <v-spacer></v-spacer>
            <v-icon @click="close">
                mdi-close
            </v-icon>


        </v-toolbar>
        <v-card-text class="text-center">
            <v-slider
                v-model="width"
                label = "Aspect Ratio"
                class="align-self-stretch mt-3"
                min="500"
                max="1200"
                step="1"
                style="width: 800px"
            ></v-slider>
            <v-img
                :src="imageSrc"
                :lazy-src="imageSrc"
                aspect-ratio="auto"
                :width="width"
            ></v-img>
        </v-card-text>
      </v-card>
    </v-dialog>
</template>

<script>
    export default {
        props: {
            dialog: {
                type: Boolean,
                default: Boolean
            },
            imageSrc: {
                type: String,
                default: String
            },
        },
        data() {
            return {
                modal: false,
                width: 800
            }
        },
        watch: {
            dialog(newV) {
                console.log(newV);
                this.modal = newV
            }
        },
        methods: {
            close() {
                this.$emit('close-modal', false)
            }
        },
        
    }
</script>

<style lang="scss" scoped>

</style>