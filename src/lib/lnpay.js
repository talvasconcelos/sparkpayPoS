const KEY = process.env.PREACT_APP_LNPAY_KEY
const AUTH = btoa(KEY + ':')
const URL = 'https://api.lnpay.co/v1'

const generateLabel = () => ({
    user_label: 'sparkpay_' + [...Array(16)].map(_ => (Math.random() * 36 | 0).toString(36)).join ``
})

// const mockCreateWalletResponse = {
//     "id": "w_Noii2dJQmJjXdq",
//     "created_at": 1577985279,
//     "updated_at": 1577985279,
//     "user_label": "Tester API Wallet",
//     "balance": 0,
//     "statusType": {
//         "id": 200,
//         "type": "wallet",
//         "name": "active",
//         "display_name": "Active"
//     },
//     "access_keys": {
//         "Wallet Admin": [
//             "wa_JEa9ZqCRT6oD4FsMgwWmqf1"
//         ],
//         "Wallet Invoice": [
//             "wi_u7SjGDIG9a2EYTv4HyvXz3SW"
//         ],
//         "Wallet Read": [
//             "wr_fWQd82MvofmBRrdT2x5YkGJ2"
//         ]
//     }
// }

// const mockBalanceResponse = {
//     "id": "w_pXHvKoKeKfrv",
//     "created_at": 1577600922,
//     "updated_at": 1577600922,
//     "user_label": "Wallet for ATM",
//     "balance": 1000,
//     "statusType": {
//         "id": 200,
//         "type": "wallet",
//         "name": "active",
//         "display_name": "Active"
//     },
// }

// const mockTransactionsResponse = [{
//     "id": "wtx_OXWNFNYYY0NsGLwLx7AtcPM",
//     "created_at": 1580475159,
//     "wallet_id": "w_ALMWRQrSoSf4Qh",
//     "num_satoshis": 158,
//     "user_label": "asdf",
//     "lnTx": {
//         "id": "lntx_hlLn7xArPmew8KKSjqJqy6Vo",
//         "created_at": 1580129586,
//         "updated_at": 1580129586,
//         "dest_pubkey": "033868c219bdb51a33560d854d500fe7d3898a1ad9e05dd89d0007e11313588500",
//         "payment_request": "",
//         "r_hash_decoded": "7e13af679b551d8b0b804c3f0c74b43352c2d4c332ead6d693a8ea0aa6b6beec",
//         "memo": "",
//         "description_hash": "",
//         "num_satoshis": 2,
//         "expiry": 0,
//         "expires_at": null,
//         "payment_preimage": "323550597244415037724d6a436765567a72735875667438626e66754d385547",
//         "settled": 1,
//         "settled_at": 1580129586
//     },
//     "wtxType": {
//         "id": 30,
//         "layer": "ln",
//         "name": "ln_transfer_in",
//         "display_name": "Transfer In"
//     }
// }]

// const mockInvoice = {
//     "id":"lntx_RFbu0YosFoIuJc7S6qMg0L9",
//     "created_at":1577655829,
//     "updated_at":1577655829,
//     "dest_pubkey":"033868c219bdb51a33560d854d500fe7d3898a1ad9e05dd89d0007e11313588500",
//     "payment_request":"lnbc200n1p0qj8s4pp525lkfynvsxlyl5vys8v4xv840swspylfk3v5l95gne3ms77vc9tsdp223jhxapqd9h8vmmfvdjjqenjdakjqargv5sxgmmrwvcqzpgxqyz5vq48ud7ha9rnsnadkhcsv38aadh3yrvuvv3kl9xv7wp0w3hqqyllvjkdzm2awcsdw9l5zkkkqu2hy0shunjdrdg4r8h8f59e2720885jgqwrqyt8",
//     "r_hash_decoded":"553f64926c81be4fd18481d95330f57c1d0093e9b4594f96889e63b87bccc157",
//     "memo":"Test invoice from the docs",
//     "num_satoshis":20,
//     "expiry":86400,
//     "expires_at":1577742229,
//     "payment_preimage":null,
//     "settled":0,
//     "settled_at":null
// }

// const mocklntx = {
//     "id":"lntx_RFbu0YosFoIuJc7S6qMg0L9",
//     "created_at":1577657602,
//     "updated_at":1577657602,
//     "dest_pubkey":"02c16cca44562b590dd279c942200bdccfd4f990c3a69fad620c10ef2f8228eaff",
//     "payment_request":"lnbc50n1p0qjf84pp5f70yqjjvu0z0esf7hksnca44d8j440mk5743qv70ku6jy9ewj8eqdpz23jhxapqd9h8vmmfvdjjqen0wgsxgmmrwvxqyz5vqcqzyssp583w0tugt4scyek2dat72p389lau0j8u9t5qnep29y0c32hyfn8rqrzjqt0pr36g7ke9elfvaqq3wmfey6laun0z8v0lg0nf9fdhdncxsp0y5zxkp5qqnsgqqqqqqquyqqqqqksqrc9qy9qsqzmvy83s8np7yrlqs98ge90tj3wwhfawjtq3cewv4vavmq0p5c4anhkm2aeyzjcvycttfgzwtak7nrrk6e3m3td8g4t8ha06uzzare4cqqne839",
//     "r_hash_decoded":"4f9e404a4ce3c4fcc13ebda13c76b569e55abf76a7ab1033cfb73522172e91f2",
//     "memo":"Test invoice for docs",
//     "num_satoshis":20,
//     "expiry":86400,
//     "expires_at":1577744002,
//     "payment_preimage":"6631394e526f35325135563854574f316651513330527a6e4e47315630795147662f7066466e4276664a773d",
//     "settled":0,
//     "settled_at":1577657602
// }

// const mockWithdraw = {
//     "lnurl":"LNURL1DP68GURN8GHJ7MRWWPSHJTNRDUHHVVF0W4EK2U30WASKCMR9WSHHWC2LFACXUM35DDR5736ZF4HXVS6VGEV8GU6YDE49GC30D3H82UNV94C8YMMRV4EHX0M0W36R66MGD95KS4JGFADRS4ZRFEXK2SN2FFUXUSMHFA98XDZ8D3T9SDECWVHR43"
// }


export const lnpay = {
    createWallet: async () => {
        const response = await fetch(`${URL}/wallet`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${AUTH}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(generateLabel())
        })
        const body = await response.json()
        // console.log(body)
        // const body = mockCreateWalletResponse
        const wallet = {
            id: body.id,
            balance: body.balance,
            key: body.access_keys["Wallet Admin"][0]
        }
        return wallet
    },

    getBalance: async (key) => {
        const response = await fetch(`${URL}/wallet/${key}`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${AUTH}`,
                'Content-Type': 'application/json'
            }
        })
        const body = await response.json()
        // const body = mockBalanceResponse
        return body.balance
    },

    getTransactions: async (key) => {
        const response = await fetch(`${URL}/wallet/${key}/transactions`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${AUTH}`,
                'Content-Type': 'application/json'
            }
        })
        const body = await response.json()
        // const body = mockTransactionsResponse
        const txs = body
            .filter(t => t.lnTx)
            .map(t => {
                const tx = { ...t.lnTx }
                return {
                    id: tx.id,
                    timestamp: tx.created_at,
                    value: tx.num_satoshis,
                    settled: tx.settled
                }
            })
        // console.log(txs)
        return txs
    },

    generateInvoice: async (key, value) => {
        const response = await fetch(`${URL}/wallet/${key}/invoice`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${AUTH}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                num_satoshis: value
            })
        })
        const body = await response.json()
        // const body = mockInvoice
        // console.log(body)
        return body
    },

    invoiceStatus: async (invoice_id) => {
        const response = await fetch(`${URL}/lntx/${invoice_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${AUTH}`,
                'Content-Type': 'application/json'
            }
        })
        const body = await response.json()
        // const body = mocklntx
        // console.log(body)
        return body
    },

    withdrawLNURL: async (key) => {
        const response = await fetch(`${URL}/wallet/${key}/lnurl/withdraw`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${AUTH}`,
                'Content-Type': 'application/json'
            }
        })
        const body = await response.json()
        // const body = mockWithdraw.lnurl
        // console.log(body)
        return body.lnurl
    }
}
