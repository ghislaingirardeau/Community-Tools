<template>
    <div>
        <v-btn @click="ReadFB">read FS</v-btn>
        <p>{{listOfLoan}}</p>

    </div>
</template>

<script>
    export default {
        name: 'AnalysePage',

        data() {
            return {
                listOfLoan: []
            }
        },
        methods: {
            async ReadFB() {
                /* const messageRef = this.$fire.firestore.collection('village A')
                console.log(messageRef)
                try {
                    const messageDoc = await messageRef.get()
                    messageDoc.forEach(doc => {
                        this.listOfLoan.push(doc.data())
                    });
                } catch (e) {
                console.log(e)
                } */
                const citiesRef = this.$fire.firestore.collection('village B');
                const snapshot = await citiesRef.where('shareAgreement', '==', true).get();
                if (snapshot.empty) {
                console.log('No matching documents.');
                return;
                }  

                snapshot.forEach(doc => {
                    this.listOfLoan.push(doc.data())
                });
            },

        },
    }
</script>

<style lang="scss" scoped>

</style>