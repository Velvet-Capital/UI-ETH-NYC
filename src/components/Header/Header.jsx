import React from "react";
import './Header.css';
import '../../styles/utils.css'

import GhostLogo from '../../assets/img/ghost-logo.png';
import Logo from '../../assets/img/headerlogo.png';
import WalletImg from '../../assets/img/wallet.png';
import ArrowUPImg from '../../assets/img/chevron-down (1).svg';
import ArrowDownImg from '../../assets/img/chevron-down.svg';

function Header({toggleConnectWalletModal, isWalletConnected}) {
    return (
        <div className="header">
            <img src={GhostLogo} alt="" id="ghost-logo" draggable="false" />
            <img src={Logo} alt="" id="header-logo" draggable="false" />

            {isWalletConnected ? (
            <div className="header-investor-data">
                <div>
                    <span className="header-investor-data-title fn-sm">Balance</span>
                    <span className="balance fn-lg">$15,000</span>
                </div>

                <div>
                    <span className="header-investor-data-title fn-sm">Return</span>
                    <span className="return fn-lg c-green">+ $5,000 (20%)</span>
                </div>
            </div> ) : null}

            {!isWalletConnected ? (
                <button className="connect-btn" onClick={toggleConnectWalletModal}>
                    <img src={WalletImg} alt="" />
                    <span className="fn-sm">Connect a wallet</span>
                </button>
            ) : (
                <button className="connect-btn" >
                    <img src={WalletImg} alt="" />
                    <span className="fn-sm">0x19..709</span>
                    <img src={ArrowDownImg} className="connect-btn-icon" alt="" />
                </button> 
            )}
        </div>
    )
}

export default Header;