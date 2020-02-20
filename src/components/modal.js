import { useState, useEffect, useContext } from 'preact/hooks'
import { lnpay } from '../lib/lnpay'

import { I18nContext } from '../i18n'

export const Modal = ({open, qr, value, sats, symbol, rate, issats, close, lang}) => {
    const { dispatch, translate } = useContext(I18nContext)
    const [status, setStatus] = useState(false)
    const [check, doCheck] = useState(0)

    const poll = setTimeout(() => doCheck(check + 1), 1000)

    const closeModal = () => {
        clearTimeout(poll)
        return close()
    }
    
    useEffect(async () => {
        if(check === 0) {
            dispatch({type: 'setLanguage', payload: lang})
        }
        const lntx = await lnpay.invoiceStatus(open.id)
        if(!lntx.settled){
            console.log('Not settled!', check)
            return poll
        } 
        if(lntx.settled) {
            // console.log('Settled!')
            return setStatus(true)
        }
        return () => (clearTimeout(poll))
    }, [check])

    return (
        <div class={`modal ${open ? 'open' : null} ${status ? 'settled' : null}`} data-modal="payment-modal">
            <article class="content-wrapper">
                <button onClick={closeModal} class="close"></button>
                <header class="modal-header">
                    <h2><small>{symbol.toUpperCase()}</small>{` ${value}`}</h2>
                </header>
                <div class="content">
                    {!status && 
                    <>
                        <p>{`${translate('scan_to_pay')} ${issats ? sats : sats / 1e8} ${issats ? 'sats' : 'BTC'}`}</p>
                        <img src={qr} class="img-responsive" alt={open}/>
                        <p><small>{`1 BTC = ${symbol} ${rate.toFixed(2)}`}</small></p>
                    </>}
                    {status && 
                    <>
                        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>
                        <p>{`${issats ? sats : sats / 1e8} ${issats ? 'sats' : 'BTC'} ${translate('payed')}!`}</p>
                    </>}
                </div>
            </article>
        </div>
    )
}