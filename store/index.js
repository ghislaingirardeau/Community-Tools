
// holds your root state
export const state = () => ({
    userAuth: undefined,
    villagesDatas: []
})

// contains your actions
export const actions = {
    // FIREBASE PAGE
    async signUp({ commit }, formData) {
        try {
            const newUser = await this.$fire.auth.createUserWithEmailAndPassword(
                formData.email,
                formData.password,
            )
            if (newUser) {
                await this.$fire.auth.currentUser
                    .updateProfile({
                        displayName: formData.displayName,
                    })
                await this.$fire.firestore.collection('authId').doc(newUser.user.uid).set({
                    village: [formData.village],
                    role: 'investigator'
                });
                newUser.user.userData = {
                    village: [formData.village],
                    role: 'investigator'
                }
                commit('USER_FECTH', newUser.user)
            }
        } catch (error) {
            commit('ERROR_REPONSE', error.message)
        }

    },
    login({ commit }, formData) {
        return new Promise((resolve, reject) => { 
            const authentification = async () => {
                try {
                    await this.$fire.auth.signInWithEmailAndPassword(
                        formData.email,
                        formData.password
                    );
                    resolve({ result: true })

                } catch (error) {
                    resolve({ result: true, message: error.message })
                }
            }
            authentification()
        })
    },
    keepConnection({ commit, state }) {
        return new Promise((resolve, reject) => {
            this.$fire.auth.onAuthStateChanged(async (user) => {
                if (user) {
                    try {
                        const messageRef = this.$fire.firestore.collection('authId').doc(user.uid)
                        const messageDoc = await messageRef.get()
                        user.userData = messageDoc.data()
                        commit('USER_FECTH', user)
                        resolve(true)

                    } catch (e) {
                        alert(e)
                        reject(e)
                    }
                } else {
                    resolve(true)
                }
            })
        });
    },
    async updateUser({ commit }, datas) {
        console.log(datas);
        await this.$fire.auth.currentUser
            .updateProfile({
                displayName: datas.displayName,
                photoURL: datas.photoURL
            })
            .then(() => {
                commit('UPDATE_USER', datas)
            })
            .catch(e => {
                console.log(e);
            })
    },
}
// contains your mutations
export const mutations = {
    // FIREBASE PAGE
    USER_FECTH(state, authUser) {
        const { uid, email, emailVerified, displayName } = authUser
        const { village, role } = authUser.userData
        state.userAuth = { uid, email, emailVerified, displayName, village, role }
    },
    UPDATE_USER(state, data) {
        state.userAuth.displayName = data.displayName
    },
    USER_SIGNOUT(state) {
        state.userAuth = undefined
    },
    ERROR_REPONSE(state, message) {
        state.errorMessage = message
    },
}
export const getters = {
}
