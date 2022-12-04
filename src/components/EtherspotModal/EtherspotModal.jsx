import React from "react"
import "./EtherspotModal.css"
import { Etherspot } from "@etherspot/react-transaction-buidler"

const EtherspotModal = ({ showEtherSpotModal, toggleEtherSpotModal, provider }) => {
    if (!showEtherSpotModal) {
        return null
    }

    console.log(provider)

    return (
        <>
            <div className="overlay" onClick={toggleEtherSpotModal}></div>
            <div className="modal ethspot-modal">
                <Etherspot provider={provider} />
            </div>
        </>
    )
}

export default EtherspotModal
