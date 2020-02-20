import { Store, set, get, keys } from 'idb-keyval'
import { lnpay } from './lnpay'
import { translations } from '../i18n'

const sparkdb = new Store('sparkpos', 'pos')

const openNodeRates = async (cur) => {
    const res = await fetch("https://api.opennode.com/v1/rates")
    const body = await res.json()
    const conversion = body.data[`BTC${cur}`][cur]
    // console.log(cur, body, conversion)
    return conversion
}

export const idb = {
    setWallet: async (id, key, balance) => {
        await set('wallet_id', id, sparkdb)
        await set('wallet_key', key, sparkdb)
        await set('wallet_balance', balance, sparkdb)
        return
    },

    getWalletDetails: async () => {
        const isWallet = await get('wallet_id', sparkdb)
        if(!isWallet) {
            return false
            // const {id, key, balance} = await lnpay.createWallet()
            // await idb.setWallet(id, key, balance)
            // return {id, key, balance}
        }
        const wallet = {}
        wallet.id = await get('wallet_id', sparkdb)
        wallet.key = await get('wallet_key', sparkdb)
        await idb.getBalance(wallet.key)
        wallet.balance = await get('wallet_balance', sparkdb)
        return wallet
    },

    getBalance: async (key) => {
        const balance = await lnpay.getBalance(key)
        await set('wallet_balance', balance, sparkdb)
        return balance
    },

    getRate: async (force = false) => {
        const now = Date.now()
        const timestamp = await get('rate_timestamp', sparkdb)
        const sendCachedRate = new Date(now - (timestamp ? timestamp : now)).getMinutes()
        if(!force && timestamp && sendCachedRate < 59 ) {
            const rate = await get('rate', sparkdb)
            console.debug('Cached rate', rate)
            return rate
        }
        const currency = await get('config_currency', sparkdb)
        const rate = await openNodeRates(currency.toUpperCase())
        await idb.setRate(rate, now)
        return rate
    },

    setRate: async (rate, timestamp) => {
        await set('rate_timestamp', timestamp, sparkdb)
        await set('rate', rate, sparkdb)
    },

    getTransactions: async (key) => {
        const tX = await lnpay.getTransactions(key)
        return tX
    },

    getConfig: async () => {
        const isConfig = await get('config_currency', sparkdb)
        if(!isConfig){
            await idb.setConfig()
        }
        const config = {}
        config.currency = await get('config_currency', sparkdb)
        config.units = await get('config_units', sparkdb)
        config.lang = await get('config_lang', sparkdb)
        return config        
    },

    setConfig: async (opts = {currency: 'eur', units: 'sats', lang: 'en'}) => {
        const navLang = navigator.language.slice(0, 2)
        if(Object.keys(translations).includes(navLang)) {
            opts.lang = navLang
        }
        await set('config_currency', opts.currency, sparkdb)
        await set('config_units', opts.units, sparkdb)
        await set('config_lang', opts.lang, sparkdb)
        return
    }
}