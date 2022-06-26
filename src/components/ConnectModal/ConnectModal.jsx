import React from "react"
import "./ConnectModal.css"

import VelvetImg from "../../assets/img/velvet.svg"
import MetamaskImg from "../../assets/img/metamask.webp"
import WalletConnectImg from "../../assets/img/walletconnect.png"

function Modal(props) {
    if (!props.show) return null

    return (
        <>
            <div className="overlay" onClick={props.toggleModal}></div>
            <div className="modal">   

                <h2 className="connect-modal-title my-30">Connect wallet</h2>

                <button className="connect-modal-metamask-btn fn-md" onClick={() => props.connectWallet()}>
                    <span> Connect with Metamask</span>
                    <img src={MetamaskImg} alt="" />
                </button>

                <button className="connect-modal-metamask-btn fn-md" onClick={() => props.connectWalletWithWalletConnect()}>
                    <span> Connect with Wallet Connect</span>
                    <img src={WalletConnectImg} alt="" />
                </button>
            </div>
        </>
    )
}

export default Modal
