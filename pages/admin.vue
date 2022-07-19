<template>
    <v-row>
        <v-col cols="12">
            <v-btn color='primary' @click="showSignUp = !showSignUp">{{showSignUp ? 'Hide' : 'Add an investigator' }}</v-btn>
            <sign-form v-if="showSignUp" :sign-type="false" />
        </v-col>
        <v-col cols="12">
            <v-btn @click="ReadFB">read FS</v-btn>
            <p>{{listOfLoan}}</p>
        </v-col>
        <v-col v-if="listOfLoan.length > 0" cols="12">
             <datas-table :village-datas="listOfLoan" />
        </v-col>

    </v-row>
</template>

<script>
import { mapState } from 'vuex'

    export default {
        name: 'AdminPage',
        data() {
            return {
                listOfLoan: [],
                showSignUp: false,
            }
        },
        computed: {
            ...mapState(['userAuth']),
        },
        methods: {
            async ReadFB() {
                const messageRef = this.$fire.firestore.collection('village A')
                console.log(messageRef)
                try {
                    const messageDoc = await messageRef.get()
                    messageDoc.forEach(doc => {
                        this.listOfLoan.push(doc.data())
                    });
                } catch (e) {
                console.log(e)
                }
                /* const citiesRef = this.$fire.firestore.collection('village B');
                const snapshot = await citiesRef.where('shareAgreement', '==', true).get();
                if (snapshot.empty) {
                console.log('No matching documents.');
                return;
                }  

                snapshot.forEach(doc => {
                    this.listOfLoan.push(doc.data())
                }); */
                // show village added
                // show list of village in index store
                // admin : list of users
                // admin : read all villages
                // reader: read only one village
                // check table with data from private or microfinance 
            },

        },
    }
</script>

<style lang="scss" scoped>

</style>