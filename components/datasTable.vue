<template>
    <v-card>
        <v-card-title>
            {{villageDatas[0].village}}
        <v-spacer></v-spacer>
        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
        ></v-text-field>
        </v-card-title>
        <v-data-table
        :headers="headers"
        :items="villageDatas"
        :search="search"
        ></v-data-table>
    </v-card>
</template>

<script>
    export default {
        props: {
            villageDatas: {
                type: Array,
                default: Array
            },
        },
        data() {
            return {
                search: '',
                headers: [
                    {
                        text: 'Name',
                        align: 'start',
                        sortable: false,
                        value: 'borrowerName',
                    },
                    { text: 'Start', value: 'dateStart' },
                    { text: 'End', value: 'dateEnd' },
                    { text: 'bank', value: 'bank' },
                    { text: 'Amount', value: 'loanAmount' },
                    { text: 'Rate', value: 'loanRate' },
                    { text: 'Year', value: 'loanYear' },
                    { text: 'Fee', value: 'serviceFee' },
                    { text: 'remaining Loan', value: 'remainingLoan' },
                    { text: 'remaining Interest', value: 'remainingInterest' },
                    { text: 'Purpose', value: 'purpose' },
                    { text: 'By name', value: 'fillByname' },
                    { text: 'fill On', value: 'fillByOn' },
                ],  
                dataCollection: {
                    loanType: 'Microfinance',
                    village: '',
                    bank: 'អិលអូអិលស៊ី',
                    newBank: '',
                    currency: 'Dollars',
                    borrowerName: 'ron',
                    loanAmount: 2500,
                    loanRate: 1.6,
                    loanYear: 2,
                    serviceFee: 0,
                    dateStart: new Date().toISOString().substr(0, 10),
                    remainingLoan: 1000,
                    remainingInterest: 230,
                    penaltyRate: 0,
                    noPenaltyPeriod: 0,
                    consentShareData: false,
                    shareAgreement: false,
                    purpose: '',
                    fillByname: '',
                    fillByOn : undefined
                },          
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>