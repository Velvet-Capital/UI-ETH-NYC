import React from "react";
import '../styles/header.css';
import '../styles/utils.css'

import GhostLogo from '../assets/img/ghost-logo.png';
import Logo from '../assets/img/headerlogo.png';
import WalletImg from '../assets/img/wallet.png';

function Header() {
    return (
        <div className="header">
            <img src={GhostLogo} alt="" id="ghost-logo"/>
            <img src={Logo} alt="" id="header-logo" />

            <button className="connect-btn" >
                <img src={WalletImg} alt="" className="fn-sm"/>
                <span>Connect a wallet</span>
            </button>
        </div>
    )
}

export default Header;