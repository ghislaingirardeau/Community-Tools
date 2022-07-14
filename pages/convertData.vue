<template>
    <div>
        <h1>tesseract</h1>
        <v-file-input
            id="imageTest"
            label="Test geojson"
            @click="recognize"
        ></v-file-input>
        
        <v-select
            v-model="language"
            :items="['eng', 'khm']"
            label="language"
        ></v-select>
        <p>{{progress}}</p>
    </div>
</template>

<script>
    export default {
        name: 'ConvertPage',
        data() {
            return {
                progress: 0,
                language: 'eng'
            }
        },
        methods: {
            recognize() {
                const imageTest = document.querySelector("#imageTest");
                imageTest.addEventListener("change", (e) => {
                    const gpxFile = e.target.files[0];
                    console.log(gpxFile);
                    Tesseract.recognize(
                        gpxFile,
                        this.language,
                        { logger: m => (this.progress = m.progress*100) }
                        ).then((res) => {
                        console.log(res.data);
                    })
                });
            },
        },
        
    }   
</script>

<style lang="scss" scoped>

</style>