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
            :headers="datasHeaders"
            :items="villageDatas"
            :expanded.sync="expanded"
            item-key="borrowerName"
            show-expand
            :search="search"
            :single-expand="true"
        >
        <template #expanded-item="{ headers, item }">
            <td :colspan="headers.length" class="py-2">
                <img :src="item.imageURL" alt="" class="table-photo">
                <span class="ml-3">Purpose of the loan {{ item.purpose }} / Collected by {{ item.fillByname }} on {{ item.fillByOn.replace('T', ' ') }}</span>
            </td>
        </template>
        </v-data-table>
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
                expanded: [],
                search: '',
                datasHeaders: [
                    {
                        text: 'Name',
                        align: 'start',
                        sortable: false,
                        value: 'borrowerName',
                    },
                    { text: 'Start', value: 'dateStart' },
                    { text: 'End', value: 'dateEnd' },
                    { text: 'bank', value: 'bank' },
                    { text: 'currency', value: 'currency' },
                    { text: 'Amount', value: 'loanAmount' },
                    { text: 'Rate', value: 'loanRate' },
                    { text: 'Year', value: 'loanYear' },
                    { text: 'Fee', value: 'serviceFee' },
                    { text: 'remaining Loan', value: 'remainingLoan' },
                    { text: 'remaining Interest', value: 'remainingInterest' },
                    { text: 'Penalty Period', value: 'noPenaltyPeriod' },
                    { text: 'Penalty Rate', value: 'penaltyRate' },
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
.table-photo{
    width: 90px;
    height: 90px;
}
</style>