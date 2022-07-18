<template>
    <div>
        <v-overlay :value="overlay">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>
        <v-form v-if="userAuth" ref="form" v-model="valid" lazy-validation>
            <v-container>
                <v-row>
                    <v-col cols="6" sm="3" class="px-2">
                        <v-select
                            v-model="dataCollection.village"
                            :items="userAuth.village"
                            label="Village"
                            :rules="[value => !!value || 'Required']"
                        ></v-select>
                    </v-col>
                    <v-col cols="6" sm="3" class="px-2">
                        <v-select
                            v-model="dataCollection.loanType"
                            :items="loanTypeList"
                            label="Loan Type"
                            :rules="[value => !!value || 'Required']"
                        ></v-select>
                    </v-col>
                    <v-col cols="6" sm="3" class="px-2">
                        <v-select
                            v-model="dataCollection.currency"
                            :items="currencyList"
                            label="Currency"
                            :rules="[value => !!value || 'Required']"
                        ></v-select>
                    </v-col>
                    <v-col cols="6" sm="3" class="px-2">
                        <v-select
                            v-model="dataCollection.bank"
                            :items="bankList"
                            label="Bank"
                            :rules="[value => !!value || 'Required']"
                        ></v-select>
                    </v-col>
                    <v-col v-if="dataCollection.bank === 'Other'" cols="6" sm="4">
                        <v-text-field
                            v-model="dataCollection.newBank"
                            label="bank name / (Name)"
                            placeholder="ABA"
                            :rules="[value => !!value || 'Required']"
                        ></v-text-field>
                    </v-col>

                    <v-col cols="6" sm="4">
                        <v-text-field
                            v-model="dataCollection.borrowerName"
                            label="សដថដសថរ៊ / (Name)"
                            placeholder="James"
                            :rules="[value => !!value || 'Required']"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="4">
                        <v-text-field
                            id="loanAmountInput"
                            v-model.number="dataCollection.loanAmount"
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
                            v-model.number="dataCollection.loanRate"
                            label="Interest Rate / month"
                            suffix="%"
                            type="number"
                            :rules="[value => !!value || 'Required a number']"
                            step="0.01"
                            min='0.5'
                            :max="dataCollection.loanType === 'private' ? 10 : 3"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="2">
                        <v-text-field
                            v-model.number="dataCollection.loanYear"
                            label="Year"
                            type="number"
                            :rules="[value => !!value || 'Required a number']"
                            min='1'
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="4">
                        <v-text-field
                            v-model="dataCollection.remainingLoan"
                            label="Principle remaining"
                            type="number"
                            :rules="[value => !!value || 'Required a number']"
                            min='0'
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="4">
                        <v-text-field
                            v-model="dataCollection.remainingInterest"
                            label="Interest remaining"
                            type="number"
                            :rules="[value => !!value || 'Required a number']"
                            min='0'
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="4">
                        <v-text-field
                            v-model="dataCollection.noPenaltyPeriod"
                            label="Payment penalty period"
                            type="number"
                            min='0'
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="2">
                        <v-text-field
                            v-model.number="dataCollection.penaltyRate"
                            label="Penalty Rate"
                            suffix="%"
                            type="number"
                            step="0.01"
                            min='0'
                            max="2.5"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="2">
                        <v-menu
                            ref="menu"
                            v-model="menu"
                            :close-on-content-click="false"
                            :return-value.sync="dataCollection.dateStart"
                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="auto"
                        >
                            <template #activator="{ on, attrs }">
                                <v-text-field
                                    v-model="dataCollection.dateStart"
                                    label="Started Loan"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                ></v-text-field>
                            </template>
                            <v-date-picker v-model="dataCollection.dateStart" no-title scrollable>
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
                            step="10000"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="4">
                        <v-text-field
                            v-model="dataCollection.purpose"
                            label="Loan Purpose"
                            :rules="[value => !!value || 'Required a number']"
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
                            v-model="dataCollection.shareAgreement"
                            dense
                            label="I consent to share my loan detail for private analysis only !"
                        ></v-checkbox>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-checkbox
                            v-model="dataCollection.consentShareData"
                            dense
                            label="I consent to share the amount, rate and fee for the simulator database"
                        ></v-checkbox>
                    </v-col>
                    <v-col cols="12">
                        <v-btn @click="SendLoan">Save</v-btn>
                    </v-col>
                    <v-col cols="12">
                        <v-btn @click="writeFB">write FS</v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
        <auth-form v-else @overlay-active="overlayShow" />
        <v-bottom-sheet v-model="sheet">
            <v-sheet
                class="text-center"
                height="60px"
            >
                <div class="py-2" :class="{'message--success' : infoMessage.success, 'message--failed' : !infoMessage.success }">
                    {{infoMessage.text}}
                </div>
            </v-sheet>
        </v-bottom-sheet>

    </div>
</template>

<script>
import { mapState } from 'vuex'
    export default {
        name: 'CollectPage',
        data () {
            return {
                overlay: false,
                valid: true,
                sheet: false,
                infoMessage: {
                    success: false,
                    text: ''
                },
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
                loanTypeList: ['Microfinance', 'private'],
                bankList: ['មីក្រូ. មហានគរ ម.ក', 'អិលអូអិលស៊ី', 'មីក្រូ. អេអឹមខេ', 'មីក្រូ. ប្រាសាក់ ម.ក', 'ធនាគារ ស្ថាបនា', 'ហត្ថាកសិករ', 'ធនាគារ ហត្ថា ម.ក', 'ធនាគារ ហត្ថ ម.ក', 'មីក្រូ. ហ្វូណន', 'ធនាគារ ភីលីព', 'មីក្រូ ដាប់ប៊ែលយូប៊ី', 'មីក្រូ. ដាប់ប៉ែលយូប៊ី', 'Other'],
                currencyList: ['Riels', 'Dollars'],
                menu: false,
            }
        },
        computed: {
            ...mapState(['userAuth']),
            endLoan() {
                const parseDate = new Date(this.dataCollection.dateStart)
                parseDate.setMonth(parseDate.getMonth() + (this.dataCollection.loanYear * 12))
                return parseDate.toISOString().substr(0, 10)
            }
        },
        watch: {
            'userAuth.village': {
                handler (after, before) {
                this.dataCollection.village = this.userAuth.village[0]
                }
            }
        },
        methods: {
            async SendLoan() {
                if (this.$refs.form.validate()) {
                    try {
                        this.overlay = true
                        this.dataCollection.fillByname = this.userAuth.displayName
                        this.dataCollection.dateEnd = this.endLoan
                        this.dataCollection.fillByOn = new Date().toISOString().substr(0, 16)
                        const res = await this.$fire.firestore.collection(this.dataCollection.village).add(this.dataCollection);
                        if (res) {
                            this.overlay = false
                            this.sheet = true
                            setTimeout(() => {
                                this.sheet = false
                                this.$refs.form.reset()

                            }, 2000);
                            this.infoMessage.text = 'Form send successfully'
                            this.infoMessage.success = true
                            
                        }
                    } catch (error) {
                        console.log(error, 'Error during the sending process');
                    }
                } else {
                    this.sheet = true
                    setTimeout(() => {
                        this.sheet = false
                    }, 3000);
                    this.infoMessage.text = 'Fill all the required form'
                    this.infoMessage.success = false
                }
            },
            overlayShow(payload) {
                this.overlay = payload.message
            },
            writeFB() {
                // UPDATE
                /* const cityRef = this.$fire.firestore.collection('debtVillage').doc('gwFIKtYrN1L0pP4kuCKi')
                const res = await cityRef.update({
                amount: this.$fireModule.firestore.FieldValue.increment(50)
                }) */

                // DELETE
                // const res = await this.$fire.firestore.collection('debtVillage').doc('LA').delete();
            },
            updateDate() {
                this.$refs.menu.save(this.dataCollection.dateStart)
            },
            // stepper : 
            // 1- do you agree to give the datas YES data form NO estimated form
            // 2- select until name
            // 3- detail of loan
            // 4- doc to upload
        },
    }
</script>

<style lang="scss" scoped>
.message--success{
    color: green;
    font-weight: bold;
}
.message--failed{
    color: red;
    font-weight: bold;
}
</style>