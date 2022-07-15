<template>
    <div>
        <v-form>
            <v-container>
                <v-row>
                    <v-col cols="6" sm="3" class="px-2">
                        <v-select
                            v-model="dataCollection.village"
                            :items="villageList"
                            label="Village"
                        ></v-select>
                    </v-col>
                    <v-col cols="6" sm="3" class="px-2">
                        <v-select
                            v-model="dataCollection.loanType"
                            :items="loanTypeList"
                            label="Loan Type"
                        ></v-select>
                    </v-col>
                    <v-col cols="6" sm="3" class="px-2">
                        <v-select
                            v-model="dataCollection.currency"
                            :items="currencyList"
                            label="Currency"
                        ></v-select>
                    </v-col>
                    <v-col cols="6" sm="3" class="px-2">
                        <v-select
                            v-model="dataCollection.bank"
                            :items="bankList"
                            label="Bank"
                        ></v-select>
                    </v-col>

                    <v-col cols="6" sm="4">
                        <v-text-field
                            v-model="dataCollection.borrowerName"
                            label="Name"
                            placeholder="James"
                            :rules="[value => !!value || 'Required']"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="4">
                        <v-text-field
                            id="loanAmountInput"
                            v-model.number="dataCollection.loan.amount"
                            label="Principle amount"
                            type="number"
                            :rules="[value => !!value || 'Required a number']"
                            :step="dataCollection.currency === 'Dollars' ? 500 : 500000"
                            min='0'
                            :prefix="dataCollection.currency === 'Dollars' ? '$' : '៛'"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="2">
                        <v-text-field
                            v-model.number="dataCollection.loan.rate"
                            label="Interest Rate / month"
                            suffix="%"
                            type="number"
                            :rules="[value => !!value || 'Required a number']"
                            step="0.01"
                            min='0.5'
                            max="2.5"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="2">
                        <v-text-field
                            v-model.number="dataCollection.loan.year"
                            label="Year"
                            type="number"
                            :rules="[value => !!value || 'Required a number']"
                            min='1'
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="4">
                        <v-text-field
                            v-model="dataCollection.remaining.loan"
                            label="Principle remaining"
                            type="number"
                            :rules="[value => !!value || 'Required a number']"
                            min='0'
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="4">
                        <v-text-field
                            v-model="dataCollection.remaining.interest"
                            label="Interest remaining"
                            type="number"
                            :rules="[value => !!value || 'Required a number']"
                            min='0'
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="2">
                        <v-menu
                            ref="menu"
                            v-model="menu"
                            :close-on-content-click="false"
                            :return-value.sync="dataCollection.date"
                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="auto"
                        >
                            <template #activator="{ on, attrs }">
                                <v-text-field
                                    v-model="dataCollection.date"
                                    label="Started Loan"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                ></v-text-field>
                            </template>
                            <v-date-picker v-model="dataCollection.date" type="month" no-title scrollable>
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
                                <v-btn text color="primary" @click="updateDate">
                                    OK
                                </v-btn>
                            </v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="6" sm="2">
                        <v-text-field
                            :value="endLoan"
                            label="Ended Loan"
                            prepend-icon="mdi-calendar-remove-outline"
                            readonly
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="4">
                        <v-text-field
                            v-model="dataCollection.serviceFee"
                            label="Service Fee"
                            type="number"
                            :rules="[value => !!value || 'Required a number']"
                            min='0'
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="4">
                        <v-file-input
                            accept="image/*"
                            label="Borrower"
                        ></v-file-input>
                    </v-col>
                    <v-col cols="6" sm="4">
                        <v-file-input
                            accept="image/*"
                            label="Payment Table"
                        ></v-file-input>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-checkbox
                            v-model="dataCollection.checkbox.consent"
                            label="I consent to share my loan privacy !"
                            required
                        ></v-checkbox>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-checkbox
                            v-model="dataCollection.checkbox.share"
                            label="I consent to share my loan details (only amount, rate and fee) for the simulator !"
                            required
                        ></v-checkbox>
                    </v-col>
                    <v-col cols="12">
                        <v-btn @click="SendLoan">Send to database</v-btn>
                    </v-col>
                    <v-col cols="12">
                        <export-data />
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
    </div>
</template>

<script>

    export default {
        data () {
            return {
                dataCollection: {
                    loanType: 'Microfinance',
                    village: 'village A',
                    bank: 'bankA',
                    currency: 'Riels',
                    borrowerName: '',
                    loan: {
                        amount: 0,
                        rate: 0,
                        year: 1,
                    },
                    serviceFee: 0,
                    date: new Date().toISOString().substr(0, 7),
                    remaining: {
                    loan: 0,
                    interest: 0
                    },
                    checkbox: {
                        consent : false,
                        share: false
                    }
                },
                loanTypeList: ['Microfinance', 'private'],
                villageList: ['village A', 'village B', 'village C'],
                bankList: ['មីក្រូ. មហានគរ ម.ក', 'អិលអូអិលស៊ី', 'មីក្រូ. អេអឹមខេ', 'មីក្រូ. ប្រាសាក់ ម.ក', 'ធនាគារ ស្ថាបនា', 'ហត្ថាកសិករ', 'ធនាគារ ហត្ថា ម.ក', 'ធនាគារ ហត្ថ ម.ក', 'មីក្រូ. ហ្វូណន', 'ធនាគារ ភីលីព', 'មីក្រូ ដាប់ប៊ែលយូប៊ី', 'មីក្រូ. ដាប់ប៉ែលយូប៊ី'],
                currencyList: ['Riels', 'Dollars'],
                menu: false,
            }
        },
        computed: {
            endLoan() {
                const parseDate = new Date(this.dataCollection.date)
                parseDate.setMonth(parseDate.getMonth() + (this.dataCollection.loan.year * 12))
                return parseDate.toISOString().substr(0, 7)
            }
        },
        methods: {
            SendLoan() {
                
            },
                updateDate() {
                    this.$refs.menu.save(this.dataCollection.date)
                },

        },
    }
</script>

<style lang="scss" scoped>

</style>