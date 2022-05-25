import React, { useState } from "react";
import './Header.css';
import '../../styles/utils.css'

import GhostLogo from '../../assets/img/ghost-logo.png';
import Logo from '../../assets/img/headerlogo.png';
import WalletImg from '../../assets/img/wallet.png';
import ArrowUPImg from '../../assets/img/chevron-down (1).svg';
import ArrowDownImg from '../../assets/img/chevron-down.svg';
import ExitImg from '../../assets/img/exit.svg';

function Header({toggleConnectWalletModal, isWalletConnected, currentAccount, idxBalance}) {

    const [showDropdownMenu, setShowDropdownMenu] = useState(false);

    function toggleDropdownMenu() {
        if (showDropdownMenu)
            setShowDropdownMenu(false);
        else
            setShowDropdownMenu(true);
    }

    return (
        <div className="header">
            <img src={GhostLogo} alt="" id="ghost-logo" draggable="false" />
            <img src={Logo} alt="" id="header-logo" draggable="false" />

            {isWalletConnected && (
            <div className="header-investor-data hide-for-mobile">
                <div>
                    <span className="header-investor-data-title fn-sm">Balance</span>
                    <span className="header-investor-data-balance fn-lg">{idxBalance} IDX</span>
                </div>

                <div>
                    <span className="header-investor-data-title fn-sm">Return</span>
                    <span className="header-investor-data-return fn-lg c-green">+ $5,000 (20%)</span>
                </div>
            </div> )}

            {!isWalletConnected ? (
                <button className="connect-btn" onClick={toggleConnectWalletModal}>
                    <img src={WalletImg} alt="" />
                    <span className="fn-sm">Connect a wallet</span>
                </button>
            ) : (
                <button className="connect-btn" onClick={toggleDropdownMenu}>
                    <img src={WalletImg} alt="" />
                    <span className="fn-sm"> {currentAccount.slice(0,4) + '...' + currentAccount.slice(-3)} </span>
                    <img src={showDropdownMenu ? ArrowUPImg : ArrowDownImg} className="connect-btn-icon" alt="" />
                </button> 
            )}

            {
                showDropdownMenu && (
                <div className="header-dropdown-menu">
                    <div>
                        <p className="fn-vsm">Wallet balance</p>
                        <span>{idxBalance + ' IDX'}</span>
                    </div>
                    <hr style={{opacity: 0.5}}/>
                    <div>
                        <span className="fn-sm">Disconnect</span>
                        <img src={ExitImg} alt="" />
                    </div>
                </div> )
            }

        </div>
    )
}

export default Header;