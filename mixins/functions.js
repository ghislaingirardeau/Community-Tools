export default {
    methods: {
        convertToNumber(value, amount = undefined) {
            const tostring = value.toString()
            const currency = amount ?
                amount < 100000 ? '$' : '៛'
                : '៛'
            if (tostring.length > 3 && tostring.length < 7) {
                const a = tostring.slice(-3)
                const b = tostring.slice(0, -3)
                return b.concat(',', a, ' ', currency)
            } else if (tostring.length > 6) {
                const a = tostring.slice(-3)
                const b = tostring.slice(0, -6)
                const c = tostring.slice(-6, -3)
                return b.concat(',', c, ',', a, ' ', currency)
            } else {
                return `${tostring} ${currency}`
            }
        },
    },
}