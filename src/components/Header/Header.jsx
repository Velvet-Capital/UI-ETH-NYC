import React from "react";
import './Header.css';
import '../../styles/utils.css'

import GhostLogo from '../../assets/img/ghost-logo.png';
import Logo from '../../assets/img/headerlogo.png';
import WalletNotConnectedImg from '../../assets/img/wallet-notconnected.png';
import WalletConnectedImg from '../../assets/img/wallet-connected.png';
import ArrowUPImg from '../../assets/img/chevron-down (1).svg';
import ArrowDownImg from '../../assets/img/chevron-down.svg';
import ExitImg from '../../assets/img/exit.svg';
import WrongNetworkImg from '../../assets/img/wrong-network.svg';

import formatDecimal from "../../utils/formatDecimal";

function Header({toggleConnectWalletModal, toggleHeaderDropdownMenu, showHeaderDropdownMenu, isWalletConnected, currentAccount, bnbBalance, totalUserValue, currentBnbPrice, isTestnet, isWrongNetwork, switchToMainnet, switchToTestnet, disconnectWallet}) {

    const totalUserValueInDollar = parseFloat(totalUserValue * currentBnbPrice).toLocaleString('en-US', {maximumFractionDigits: 2});

    return (
        <div className="header">
            <img src={GhostLogo} alt="" id="ghost-logo" draggable="false" />
            <img src={Logo} alt="" id="header-logo" draggable="false" />

            {isWalletConnected && (
            <div className="header-investor-data hide-for-mobile">
                <div>
                    <span className="header-investor-data-title fn-sm">Value (USD)</span>
                    <span className="header-investor-data-balance fn-lg"> $ {totalUserValueInDollar} </span>
                </div>

                <div>
                    <span className="header-investor-data-title fn-sm">Return</span>
                    <span className="header-investor-data-return fn-lg c-green">-</span>
                </div>
            </div> )}

            {
                isWrongNetwork && (
                    <>
                        <div className="header-wrong-network-rounded-box flex">
                            <img src={WrongNetworkImg} alt="" style={{width: '19px'}}/>
                            <p>Wrong Network</p>
                        </div>
                        
                        <div className="header-wrong-network-modal">
                            <h2 className="font-semibold" style={{fontSize:'12px', color: '#fe6971', margin: '15px 0'}}>Wrong Network</h2>
                            <p style={{fontSize:'10px', fontWeight: 500}}>Please connect to a supported network (BNB Chain)</p>
                            <button className="btn header-wrong-network-modal-btn" onClick={switchToMainnet}> Switch to BNB chain </button>
                        </div>
                    </>
                )
            }

            {!isWalletConnected ? (
                <button className="connect-btn" onClick={toggleConnectWalletModal}>
                    <img src={isWalletConnected ? WalletConnectedImg : WalletNotConnectedImg} alt="" />
                    <span className="fn-sm">Connect a wallet</span>
                </button>
            ) : (
                <button className={isWrongNetwork ? "border-red connect-btn" : "connect-btn"} onClick={toggleHeaderDropdownMenu}>
                    <img src={isWalletConnected ? WalletConnectedImg : WalletNotConnectedImg} alt="" />
                    <span className="fn-sm"> {currentAccount.slice(0,4) + '...' + currentAccount.slice(-3)} </span>
                    <img src={showHeaderDropdownMenu ? ArrowUPImg : ArrowDownImg} className="connect-btn-icon" alt="" />
                </button> 
            )}

            {
                showHeaderDropdownMenu && (
                <div className="header-dropdown-menu">
                    <div>
                        <p className="fn-vsm">Wallet balance</p>
                        <span>{formatDecimal(bnbBalance) + ' BNB'}</span>
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