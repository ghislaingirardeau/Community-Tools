<template>
    <div>
        <v-form>
            <v-container>
            <v-row>
                <v-col cols="6" class="px-2">
                <v-select
                    v-model="currency"
                    :items="currencyList"
                    label="Currency"
                ></v-select>
                </v-col>
                <v-col cols="6">
                <v-text-field
                    id="loanAmountInput"
                    v-model.number="loan.amount"
                    label="Loan amount"
                    type="number"
                    :rules="[value => !!value || 'Required a number']"
                    :step="currency === 'Dollars' ? 500 : 500000"
                    min='0'
                    :prefix="currency === 'Dollars' ? '$' : '៛'"
                ></v-text-field>
                </v-col>
                <v-col cols="6">
                <v-text-field
                    v-model.number="loan.rate"
                    label="Interest Rate / year"
                    suffix="%"
                    type="number"
                    :rules="[value => !!value || 'Required a number']"
                    step="0.01"
                    min='0.5'
                    max="2.5"
                ></v-text-field>
                </v-col>
                <v-col cols="6">
                <v-text-field
                    v-model.number="loan.year"
                    label="Year"
                    type="number"
                    :rules="[value => !!value || 'Required a number']"
                    min='1'
                ></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        :return-value.sync="date"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                    >
                        <template #activator="{ on, attrs }">
                            <v-text-field
                                v-model="date"
                                label="Started Loan"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                            ></v-text-field>
                        </template>
                        <v-date-picker v-model="date" type="month" no-title scrollable>
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
                            <v-btn text color="primary" @click="updateDate">
                                OK
                            </v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="6">
                    <v-text-field
                        :value="endLoan"
                        label="Ended Loan"
                        readonly
                    ></v-text-field>
                </v-col>

                <v-col cols="12">
                    <v-btn @click="SendLoan">Send to database</v-btn>
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
                currencyList: ['Riels', 'Dollars'],
                currency: 'Riels',
                loan: {
                    amount: 0,
                    rate: 0,
                    year: 1,
                },
                date: new Date().toISOString().substr(0, 7),
                menu: false,
            }
        },
        computed: {
            endLoan() {
                const parseDate = new Date(this.date)
                parseDate.setMonth(parseDate.getMonth() + (this.loan.year * 12))
                return parseDate.toISOString().substr(0, 7)
            }
        },
        methods: {
            SendLoan() {
                console.log(this.date);
                const parseDate = new Date(this.date)
                parseDate.setMonth(parseDate.getMonth() + (this.loan.year * 12))
                console.log(parseDate.toISOString().substr(0, 7));
            },
                updateDate() {
                    this.$refs.menu.save(this.date)
                },

        },
    }
</script>

<style lang="scss" scoped>

</style>