
// holds your root state
export const state = () => ({
    userAuth: undefined,
    villagesList: ['ភូមិក្រេះ-Gres', 'ភូមិតាង៉ាច-Tangaech', 'ភូមិកងកុយ-Koy', 'ភូមិកាន់ឈើង-Kancheung',
        'ភូមិ២-Pii', 'ភូមិល្អក់-La Ak', 'ភូមិកាម៉ែន-Kamen', 'ភូមិសិកស្រែ-Sek Sraay', 'ភូមិហឺយ-Tahoeuy',
        'ភូមិម៉ឺនថាំង-Meunthang', 'តាំងម្លូ-Tang Malou', 'តាំងលោម-Tang Laum', 'Koy'
    ]
})

// contains your actions
export const actions = {
    // FIREBASE PAGE
    signUp({ commit }, formData) {
        return new Promise((resolve, reject) => {
            const authentification = async () => {
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
                        newUser.user.userData = {
                            village: formData.village,
                            role: formData.role,
                            name: formData.displayName,
                        }
                        await this.$fire.firestore.collection('authId').doc(newUser.user.uid)
                            .set(newUser.user.userData);

                        commit('USER_FECTH', newUser.user)
                        resolve({ result: true })
                    }
                } catch (error) {
                    resolve({ result: true, message: error.message })
                }
            }
            authentification()
        })

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
        const { village, role } = authUser.userData ? authUser.userData : ''
        state.userAuth = { uid, email, emailVerified, displayName, village, role }
    },
    UPDATE_USER(state, data) {
        state.userAuth.displayName = data.displayName
    },
    USER_SIGNOUT(state) {
        state.userAuth = undefined
    },
}
export const getters = {
}
