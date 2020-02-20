// import { h } from 'preact'
import { useState, useEffect, useContext } from 'preact/hooks'
import { lnpay } from '../lib/lnpay'
import { idb } from '../lib/idb'
import { I18nContext } from '../i18n'


const Nowallet = ({create, restore}) => {
    const { translate } = useContext(I18nContext)
    return (
    <>
        <div class="content">
            <p>{translate('no_wallet_01')}</p>
        </div>
        <footer class="modal-footer">
            <button class="action green" onClick={create}>{translate('create_btn')}</button>
        </footer>
        <br/>
        <small><a href='#'  onClick={restore}>{translate('have_backup')}</a></small>
    </>
)}

const Restorewallet = ({upload, cancel}) => {

    const { translate } = useContext(I18nContext)
    const [wallet, setWallet] = useState({id: null, key: null})

    const handleChange = (e) => {
        const target = e.target
		const value = target.value
        const name = target.name
        
        setWallet({...wallet, [name]: value})
    }

    const getWallet = async () => {
        const balance = await idb.getBalance(wallet.key)
        await idb.setWallet(wallet.id, wallet.key, balance)
        return upload({id: wallet.id, key: wallet.key, balance})
    }

    useEffect(() => {
        return () => {}
    }, [wallet])

    return (
        <>
        <div class="content">
            <p>{translate('restore')}</p>
            <label for="id">Wallet ID</label>
            <input type="text" name="id" placeholder="w_Noii2dJ..." value={wallet.id} onChange={handleChange} />
            <label for="key">Wallet Key</label>
            <input type="text" name="key" placeholder="wa_JEa9ZqCRT6o..." value={wallet.key} onChange={handleChange} />
        </div>
        <footer class="modal-footer">
        <button class="action green" onClick={getWallet}>{translate('restore_btn')}</button>
        <button class="action red" onClick={cancel}>{translate('cancel_btn')}</button>
        </footer>
        </>
    )
}

const Wallet = ({close, wallet}) => {
    const { translate } = useContext(I18nContext)
    return (
    <>
        <div class="content">
            <p><strong>Wallet ID</strong></p>
            <small>{wallet.id}</small>
            <p><strong>Wallet Key</strong></p>
            <small>{wallet.key}</small>
            <br/>
            <small><strong>{`${translate('warning')} `}</strong>{translate('warning_msg')}</small>
        </div>
        <footer class="modal-footer">
        <button class="action green" onClick={close}>{translate('done_btn')}</button>
        </footer>
    </>
)}

export const InitModal = ({open, close, lang}) => {

    const [wallet, setWallet] = useState(null)
    const [restore, setRestore] = useState(false)

    const { dispatch } = useContext(I18nContext)

    const createWallet = async () => {
        const {id, key, balance} = await lnpay.createWallet()
        await idb.setWallet(id, key, balance)
        return setWallet({id, key, balance})
    }

    useEffect(() => {
        dispatch({type: 'setLanguage', payload: lang})
        return () => {}
    }, [wallet, restore])

    return (
        <div class={`modal ${open ? 'open' : null} ${status ? 'settled' : null}`} data-modal="payment-modal">
            <article class="content-wrapper">
                <header class="modal-header">
                    <h2>Sparkpay PoS</h2>
                </header>
                {!wallet && !restore && <Nowallet create={createWallet} restore={() => setRestore(!restore)} />}
                {!wallet && restore && < Restorewallet upload={setWallet} cancel={() => setRestore(!restore)} />}
                {wallet && <Wallet close={close} wallet={wallet} />}
            </article>
        </div>
    )
}