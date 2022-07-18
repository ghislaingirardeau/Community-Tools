<template>
    <div>
        <sign-form :sign-type="false" />
        <v-btn @click="ReadFB">read FS</v-btn>
        <p>{{listOfLoan}}</p>

    </div>
</template>

<script>
import { mapState } from 'vuex'

    export default {
        name: 'AdminPage',
        data() {
            return {
                listOfLoan: []
            }
        },
        computed: {
            ...mapState(['userAuth']),
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