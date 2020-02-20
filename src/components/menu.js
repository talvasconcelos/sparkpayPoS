import { h } from 'preact'
import { useState, useContext, useEffect } from 'preact/hooks'

import { idb } from '../lib/idb'
import { I18nContext } from '../i18n'

const close = (menuToggle, update = () => {}) => {
    closePanels()
    update()
    document.getElementById("main-menu").style.width = "0"
    menuToggle.current.style.display = "block"
};

const closePanels = () => {
    const els = document.getElementsByClassName("panel active");
    if (els.length) {
        for (const el of els) {
            el.classList.toggle("active");
        }
    }
};

const setActivePanel = e => {
    e.preventDefault();
    if (e.target.nextElementSibling.classList.contains("active"))
        return e.target.nextElementSibling.classList.toggle("active");
    closePanels();
    const el = e.target;
    el.nextElementSibling.classList.toggle("active");
};


export const OffCanvasMenu = ({ config, toggle, wallet, update, withdraw }) => {
    const [options, setOptions] = useState({currency: config.currency, units: config.units, lang: config.lang})
    const { dispatch, translate } = useContext(I18nContext)
    const updateSettings = async (event) => {
        const target = event.target
		const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name
        // const updatedOptions = options
        // updatedOptions[name] = value
        setOptions({...options, [name]: value})
        await idb.setConfig({...options, [name]: value})
        
        if(name === 'currency'){
            await idb.getRate(true)
        }
        if(name === 'lang'){
            
            dispatch({type: 'setLanguage', payload: value})
        }
    }

    const doWithdraw = () => {
        close(toggle)
        return withdraw()
    }

    useEffect(() => {
        dispatch({type: 'setLanguage', payload: options.lang})
        return () => {}
    }, [])

    return (
            <nav id="main-menu" class="main-menu">
                <a class="closebtn" onclick={() => close(toggle, update)}>
                &times;
                </a>
                <div class="accordion">
                <p class="title" onClick={setActivePanel}>
                    {translate('wallet')}
                </p>
                <div class="panel">
                    <p>Wallet ID: <small>{wallet.id}</small></p>
                    <p>Wallet Key: <small>{wallet.key}</small></p>
                    <p>{translate('balance')}: <small>{options.units === 'sats' ? wallet.balance : wallet.balance / 1e8}</small></p>
                    {wallet.balance ? <><button class="btn btn-primary" onClick={doWithdraw} >{translate('withdraw_btn')}</button>
                    <p>
                    <small>
                        {translate('warning_msg_2')}
                    </small>
                    </p></> : null}
                </div>
                </div>
                <div class="accordion">
                <p class="title" onClick={setActivePanel}>
                    {translate('settings')}
                </p>
                <div class="panel">
                    <div>
                    <label for="conversion">{translate('conversion')}</label>
                    <input
                        type="text"
                        id="conversion"
                        name="currency"
                        placeholder="EUR, USD, CHF, BRL, CAD..."
                        value={options.currency.toUpperCase()}
                        onChange={updateSettings}
                    />
                    <label for="units">{translate('units')}</label>
                    <select id="units" value={options.units} name="units" onChange={updateSettings}>
                        <option value="btc">BTC</option>
                        <option value="sats">Satoshis</option>
                    </select>
                    <label for="lang">{translate('language')}</label>
                    <select id="lang" value={options.lang} name="lang"  onChange={updateSettings}>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="pt">Português</option>
                    </select>
                    {/* <button class="btn btn-primary" onClick={update}>Update</button> */}
                    </div>
                </div>
                </div>
                {/* <div class="accordion">
                <p class="title" onClick={setActivePanel}>
                    {translate('invoices')}
                </p>
                <div class="panel">
                    <p>id: 77 settled</p>
                    <p>id: 77 settled</p>
                    <p>id: 77 settled</p>
                    <p>id: 77 settled</p>
                </div>
                </div> */}
                <footer class='menu-footer'>
                    <a href='https://lnpay.co/'>Powered by ⚡ lnpay.co</a>
                </footer>
            </nav>
    )
};
  