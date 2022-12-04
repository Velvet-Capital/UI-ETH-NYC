import React from "react"
import Tippy from "@tippy.js/react"
import "./Header.css"
import "../../styles/utils.css"

import GhostLogo from "../../assets/img/ghost-logo.png"
import Logo from "../../assets/img/headerlogo.png"
import WalletNotConnectedImg from "../../assets/img/wallet-notconnected.png"
import WalletConnectedImg from "../../assets/img/wallet-connected.png"
import ArrowUPImg from "../../assets/img/chevron-down (1).svg"
import ArrowDownImg from "../../assets/img/chevron-down.svg"
import ExitImg from "../../assets/img/exit.svg"
import CopyImg from "../../assets/img/copyicon.png"
import WrongNetworkImg from "../../assets/img/wrong-network.svg"

function Header({
    toggleConnectWalletModal,
    toggleHeaderDropdownMenu,
    toggleSwapModal,
    showHeaderDropdownMenu,
    isWalletConnected,
    currentAccount,
    maticBalance,
    totalUserValue,
    currentMaticPrice,
    isTestnet,
    isWrongNetwork,
    switchToMainnet,
    switchToTestnet,
    disconnectWallet,
    toggleEtherSpotModal,
}) {
    return (
        <div className="header">
            <img src={Logo} alt="" id="header-logo" draggable="false" />

            {isWalletConnected && (
                <button className="btn get-matic-btn" onClick={() => toggleSwapModal()}>
                    Get Matic
                </button>
            )}

            {isWrongNetwork && (
                <>
                    <div className="header-wrong-network-rounded-box flex">
                        <img src={WrongNetworkImg} alt="" style={{ width: "19px" }} />
                        <p>Wrong Network</p>
                    </div>

                    <div className="header-wrong-network-modal">
                        <h2
                            className="font-semibold"
                            style={{ fontSize: "12px", color: "#fe6971", margin: "15px 0" }}
                        >
                            Wrong Network
                        </h2>
                        <p style={{ fontSize: "10px", fontWeight: 500 }}>
                            Please connect to a supported network (Polygon)
                        </p>
                        <button
                            className="btn header-wrong-network-modal-btn"
                            onClick={switchToMainnet}
                        >
                            Switch to Polygon
                        </button>
                    </div>
                </>
            )}

            <button className="connect-btn" onClick={toggleEtherSpotModal}>
                <span className="fn-sm">Connect Etherspot</span>
            </button>

            {!isWalletConnected ? (
                <button className="connect-btn" onClick={toggleConnectWalletModal}>
                    <span className="fn-sm">Connect a wallet</span>
                </button>
            ) : (
                <button
                    className={isWrongNetwork ? "border-red connect-btn" : "connect-btn"}
                    onClick={toggleHeaderDropdownMenu}
                >
                    <span className="fn-sm">
                        Wallet: {currentAccount.slice(0, 8) + "..." + currentAccount.slice(-6)}
                    </span>
                </button>
            )}
        </div>
    )
}

export default Header
