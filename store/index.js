
// holds your root state
export const state = () => ({
    userAuth: undefined,
    villagesDatas: []
})

// contains your actions
export const actions = {
    // FIREBASE PAGE
    async signUp({ commit, state, dispatch }, formData) {
        try {
            const newUser = await this.$fire.auth.createUserWithEmailAndPassword(
                formData.email,
                formData.password,
            )
            if (newUser) {
                console.log('add name');
                await this.$fire.auth.currentUser
                    .updateProfile({
                        displayName: formData.displayName,
                    })
            }
        } catch (error) {
            commit('ERROR_REPONSE', error.message)
        }

    },
    async login({ commit, state }, formData) {
        try {
            const userLog = await this.$fire.auth.signInWithEmailAndPassword(
                formData.email,
                formData.password
            );

            if (userLog) {
                console.log('log ok');
                return new Promise((resolve, reject) => {
                    commit('USER_FECTH', userLog.user)
                    resolve(true)
                });
            }
            // LISTENER TO THE AUTH CHANGED IF STILL LOG OR NOT
        } catch (error) {
            console.log("This email or password doesn't exist");
            commit('ERROR_REPONSE', error.message)
        }
    },
    keepConnection({ commit, dispatch }) {
        return new Promise((resolve, reject) => {
            this.$fire.auth.onAuthStateChanged((user) => {
                if (user) {
                    try {
                        commit('USER_FECTH', user)
                        resolve({ user })

                    } catch (e) {
                        alert(e)
                        reject(e)
                    }
                } else {
                    dispatch('appLoad')
                    resolve({ user: undefined })
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
        state.userAuth = { uid, email, emailVerified, displayName }
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
