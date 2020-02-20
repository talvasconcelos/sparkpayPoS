import { Component, createRef } from 'preact'
import QRCode from 'qrcode'

import { checkSize } from '../lib/fontSize'
import { idb } from '../lib/idb'
import { lnpay } from '../lib/lnpay'

import { OffCanvasMenu } from './menu'
import { Button } from './button'
import { Cogs } from './cogs'
import { Modal } from './modal'
import { LNURLModal } from './lnurlmodal'
import { InitModal } from './initmodal'
import { Loader } from './loader'


const pad = [
	"1",
	"2",
	"3",
	"C",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"OK",
	"DEL",
	"0",
	"."
];

export default class App extends Component {
	state = {
		init: true,
		payValue: "",
		sanitizedValue: 0,
		fontSize: 150,
		rate: 8062,
		satoshis: 0
	}

	display = createRef()
	toggle = createRef()

	changeSize = (size = false) => {
		this.setState({
			fontSize: checkSize(
				this.display.current,
				size ? size : this.state.fontSize
			)
		})
	}

	handleCancel = () => {
		if (this.state.payValue === "") return
		this.setState({
			payValue: "",
			sanitizedValue: 0,
			satoshis: 0
		},
			this.changeSize(150)
		)
	}

	resetInvoice = async () => {
		await this.updateBalance()
		this.setState({
			invoice: null,
			invoiceQR: null,
			lnurl: null,
			lnurlqr: null
		}, this.handleCancel)
	}

	handleInvoice = async () => {
		if (!this.state.sanitizedValue) {
			return console.debug('Zero amount not allowed!')
		}
		const { wallet, satoshis } = this.state
		const invoice = await lnpay.generateInvoice(wallet.key, satoshis)
		const qr = await this.generateQR(invoice.payment_request)
		this.setState({ invoice, invoiceQR: qr })
	}

	handleWithdraw = async () => {
		const key = this.state.wallet.key
		const lnurl = await lnpay.withdrawLNURL(key)
		const lnurlqr = await this.generateQR(lnurl)
		this.setState({ lnurl, lnurlqr })
	}

	generateQR = async (address) => {
		try {
			return await QRCode.toDataURL(address, { margin: 0 })
		} catch (err) {
			console.error(err)
		}
	}

	handleInput = e => {
		e.preventDefault()
		const key = e.target.innerText
		let value = this.state.payValue
		if (key === 'OK') {
			return this.handleInvoice()
		}
		if (key === "C") {
			return this.handleCancel()
		}
		if (key === "DEL") {
			value = value.substring(0, value.length - 1)
			if (value === "0") {
				value = ""
			}
			const satoshis = this.calcSatoshis(Math.round(parseFloat(value) * 100) / 100)
			return this.setState({
				payValue: value,
				sanitizedValue: Math.round(parseFloat(value) * 100) / 100,
				satoshis
			},
				this.changeSize
			)
		}
		if (key === "." && value.includes(key)) return
		if (value === '' && key === ".")
			return this.setState({
				payValue: "0."
			}, this.changeSize)
		value = this.state.payValue + e.target.innerText
		const satoshis = this.calcSatoshis(Math.round(parseFloat(value) * 100) / 100)
		this.setState({
			payValue: value,
			sanitizedValue: Math.round(parseFloat(value) * 100) / 100,
			satoshis
		},
			this.changeSize
		)
		return
	}

	calcSatoshis = price => {
		const {
			rate
		} = this.state
		if (!price || !rate) return
		let conversion = price / rate
		// let btc = Math.round(conversion * 100000000) / 100000000
		let sats = Math.round(conversion * 100000000)
		return sats
	}

	openMenu = () => {
		this.updateBalance()
		document.getElementById("main-menu").style.width = "100%"
		this.toggle.current.style.display = "none"
	}

	getRates = async () => {
		const conversion = await idb.getRate()
		this.setState({
			rate: conversion
		})
	}

	updateBalance = async () => {
		await idb.getBalance(this.state.wallet.key)
	}

	updateSettings = async () => {
		this.handleCancel()
		const config = await idb.getConfig()
		const wallet = await idb.getWalletDetails()
		if (!wallet) {
			this.setState({ loading: false, config })
			return
		}
		// const transactions = await idb.getTransactions(wallet.key)
		this.setState({
			config,
			wallet,
			loading: false
		}, this.getRates)
	}

	componentDidMount = async () => {
		this.updateSettings()
		// this.getRates()
		// this.changeSize()
	}

	render({ }, { payValue, fontSize, satoshis, config, wallet, invoice = null, loading = true }) {
		return (			
			<div id="app">
				{loading ? <Loader /> : null}
				{config && wallet && <OffCanvasMenu toggle={this.toggle} config={config} wallet={wallet} update={this.updateSettings} withdraw={this.handleWithdraw} />}
				<Cogs open={this.openMenu} toggle={this.toggle} />
				<div class="display">
					<p style={`font-size: ${fontSize}px`} ref={this.display}>
						{payValue ? <span class="symbol">{config.currency.toUpperCase()}</span> : null}
						{payValue ? payValue : null}
						{(config && satoshis) ? <span class="sats">{`${config.units === 'sats' ? satoshis + ' sats' : (satoshis / 1e8) + ' BTC'}`}</span> : null}
					</p>
				</div>
				<div class="keypad">
					{pad.map(b => (
						<Button value={b} action={this.handleInput} />
					))}
				</div>
				{invoice && <Modal open={invoice} qr={this.state.invoiceQR} value={this.state.sanitizedValue} sats={satoshis} rate={this.state.rate} symbol={config.currency} issats={config.units === 'sats'} close={this.resetInvoice} lang={config.lang} />}
				{this.state.lnurl && <LNURLModal open={this.state.lnurl} qr={this.state.lnurlqr} sats={wallet.balance} issats={config.units === 'sats'} close={this.resetInvoice} lang={config.lang} />}
				{config && !wallet ? <InitModal open={!wallet} close={this.updateSettings} lang={config.lang} /> : null}
			</div>			
		)
	}
}
