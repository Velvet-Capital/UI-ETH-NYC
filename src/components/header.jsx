import React from "react";
import '../styles/header.css';
import '../styles/utils.css'

import GhostLogo from '../assets/img/ghost-logo.png';
import Logo from '../assets/img/headerlogo.png';
import WalletImg from '../assets/img/wallet.png';

function Header() {
    return (
        <div className="header">
            <img src={GhostLogo} alt="" id="ghost-logo" draggable="false" />
            <img src={Logo} alt="" id="header-logo" draggable="false" />

            <div className="header-investor-data">
                <div>
                    <span className="header-investor-data-title fn-sm">Balance</span>
                    <span className="balance fn-lg">$15,000</span>
                </div>

                <div>
                    <span className="header-investor-data-title fn-sm">Return</span>
                    <span className="return fn-lg c-green">+ $5,000 (20%)</span>
                </div>
            </div>

            <button className="connect-btn" >
                <img src={WalletImg} alt="" className="fn-sm"/>
                <span>Connect a wallet</span>
            </button>
        </div>
    )
}

export default Header;