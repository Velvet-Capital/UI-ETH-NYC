import React from "react";
import './Header.css';
import '../../styles/utils.css'

import GhostLogo from '../../assets/img/ghost-logo.png';
import Logo from '../../assets/img/headerlogo.png';
import WalletImg from '../../assets/img/wallet.png';
import ArrowUPImg from '../../assets/img/chevron-down (1).svg';
import ArrowDownImg from '../../assets/img/chevron-down.svg';
import ExitImg from '../../assets/img/exit.svg';

function Header({toggleConnectWalletModal, toggleHeaderDropdownMenu, showHeaderDropdownMenu, isWalletConnected, currentAccount, bnbBalance, currentBnbPrice, isTestnet, switchToMainnet, switchToTestnet, disconnectWallet}) {

    const bnbBalanceInDollar = parseFloat(bnbBalance * currentBnbPrice).toFixed(2).toLocaleString();

    return (
        <div className="header">
            <img src={GhostLogo} alt="" id="ghost-logo" draggable="false" />
            <img src={Logo} alt="" id="header-logo" draggable="false" />

            {isWalletConnected && (
            <div className="header-investor-data hide-for-mobile">
                <div>
                    <span className="header-investor-data-title fn-sm">Balance</span>
                    <span className="header-investor-data-balance fn-lg">$ {bnbBalanceInDollar === '0.00' ? '0' : bnbBalanceInDollar}</span>
                </div>

                <div>
                    <span className="header-investor-data-title fn-sm">Return</span>
                    <span className="header-investor-data-return fn-lg c-green">-</span>
                </div>
            </div> )}

            {!isWalletConnected ? (
                <button className="connect-btn" onClick={toggleConnectWalletModal}>
                    <img src={WalletImg} alt="" />
                    <span className="fn-sm">Connect a wallet</span>
                </button>
            ) : (
                <button className="connect-btn" onClick={toggleHeaderDropdownMenu}>
                    <img src={WalletImg} alt="" />
                    <span className="fn-sm"> {currentAccount.slice(0,4) + '...' + currentAccount.slice(-3)} </span>
                    <img src={showHeaderDropdownMenu ? ArrowUPImg : ArrowDownImg} className="connect-btn-icon" alt="" />
                </button> 
            )}

            {
                showHeaderDropdownMenu && (
                <div className="header-dropdown-menu">
                    <div>
                        <p className="fn-vsm">Wallet balance</p>
                        <span>{bnbBalance + ' BNB'}</span>
                    </div>
                    <hr style={{opacity: 0.5}}/>
                    <div>
                        <button 
                            className="btn header-dropdown-menu-btn fn-sm" 
                            onClick={isTestnet ? switchToMainnet : switchToTestnet}>
                                Switch to {isTestnet ? 'Mainnet' : 'Testnet'}
                        </button>
                    </div>
                    <hr style={{opacity: 0.5}}/>
                    <div className="cursor-pointer" onClick={disconnectWallet}>
                        <span className="fn-sm">Disconnect</span>
                        <img src={ExitImg} alt="" />
                    </div>
                </div> )
            }

        </div>
    )
}

export default Header;