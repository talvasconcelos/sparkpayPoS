import { useContext, useEffect } from 'preact/hooks'

import { I18nContext } from '../i18n'

export const LNURLModal = ({open, qr, close, issats, sats, lang}) => {
    const { dispatch, translate } = useContext(I18nContext)
    
    useEffect(() => {
        dispatch({type: 'setLanguage', payload: lang})
    }, [])
    
    return (
        <div class={`modal ${open ? 'open' : null}`} data-modal="withdraw-modal">
            <article class="content-wrapper">
                <button onClick={close} class="close"></button>
                <header class="modal-header">
                    <h2>{`${translate('withdraw')}  ${issats ? sats : sats / 1e8} ${issats ? 'sats' : 'BTC'}`}</h2>
                </header>
                <div class="content">                    
                    <a href={`lightning:${open}`}><img src={qr} alt={open} class="img-responsive" /></a>
                    <br/>
                    <small>{translate('lnurl_click')}</small>
                </div>
            </article>
        </div>
    )
}