import React, { useEffect, useState } from 'react';
import './styles/App.css';
import './styles/portfoliobox.css';

import Header from './components/Header/Header.jsx';
import ConnectModal from './components/ConnectModal/ConnectModal.jsx';
import CreateModal from './components/CreateModal/CreateModal.jsx';

import Logo from './assets/img/velvetcapitallogo.png';
import MetaverseLogo from './assets/img/metaverse.svg';
import AssetsImg from './assets/img/assetsimg1.png';
import DollarImg from './assets/img/dollar.svg';
import PeopleImg from './assets/img/people.svg';
import CrossImg from './assets/img/cross.svg';
import BtcImg from './assets/img/btc.svg';
import EthImg from './assets/img/eth.svg';
import BnbImg from './assets/img/bnb.png';
import SolImg from './assets/img/sol.png';
import XrpImg from './assets/img/xrp.png';
import AvaxImg from './assets/img/avax.png';


function App() {

    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [currentAccount, setCurrentAccount] = useState('');
    const [showConnectWalletModal, setShowConnectWalletModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    function toggleConnectWalletModal() {
        if(showConnectWalletModal)
            setShowConnectWalletModal(false);
        else 
            setShowConnectWalletModal(true);
    }

    function toggleCreateModal() {
        if(showCreateModal)
            setShowCreateModal(false);
        else
            setShowCreateModal(true);
    }

    async function connectWallet() {
        try{
            const {ethereum} = window;
            if (!ethereum) {
                alert("Get MetaMask -> https://metamask.io/")
                return;
            }

            const accounts = await ethereum.request({method: "eth_requestAccounts"});
            setCurrentAccount(accounts[0]);
            setIsWalletConnected(true);
            toggleConnectWalletModal();
        }
        catch(err) {
            console.log(err);
        }
    }

    async function checkIfWalletConnected() {
        try{
            const {ethereum} = window;
            if(!ethereum) {
                alert("Get MetaMask -> https://metamask.io/")
                return
            }
            const accounts = await ethereum.request({method: "eth_accounts"});
            if(accounts.length > 0) {
                setCurrentAccount(accounts[0]);
                setIsWalletConnected(true);
            }
        }
        catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
       checkIfWalletConnected();

    }, [])

    return (
    <div className="App">

        <ConnectModal show={showConnectWalletModal} toggleModal={toggleConnectWalletModal} connectWallet={connectWallet} />

        <CreateModal show={showCreateModal} toggleModal={toggleCreateModal} />

        <Header toggleConnectWalletModal={toggleConnectWalletModal} isWalletConnected={isWalletConnected} currentAccount={currentAccount} />

        <h2 className='title fn-lg'>Community portfolios</h2>

        <div className="container">

            <div className="portfolio-box">
                {/* <div className='protfolio-box-front'>
                    <div className="level1">
                        <img src={Logo} alt="" />

                        <div className="portfolio-details">
                            <h1 className="portfolio-title fn-lg">Top 15</h1>
                            <p className="creator fn-vsm">by Andreas555</p>
                        </div>
                    </div>

                    <img className="assets-img" src={AssetsImg} alt="" />

                    <div className="user-balance">
                        <span>Balance</span>
                        <span>$0</span>
                    </div>

                    <div className="user-return">
                        <span>Return</span>
                        <span>-</span>
                    </div>

                    <button className="btn fn-md" onClick={isWalletConnected && toggleCreateModal}>Create</button>

                    <div className="portfolio-data">
                        <div className="left">
                            <img src={PeopleImg} alt="" />
                            <span className="num-of-investors fn-sm">7,587</span>
                        </div>

                        <div className="right">
                            <img src={DollarImg} alt="" />
                            <span className="marketcap fn-sm">1,507,455</span>
                        </div>
                    </div>

                </div> */}

                <div className="portfolio-box-back">
                    <img src={CrossImg} alt="" id="portfolio-box-back-cross" />
                    <h2>Allocation</h2>
                    <h3>Rebalancing Weekly</h3>
                    <div className="portfolio-box-back-assets">
                        <div className="portfolio-box-back-asset">
                            <img src={BtcImg} alt="" className='portfolio-box-back-asset-icon' />
                            <span className="portfolio-box-back-asset-name">Bitcoin</span>
                            <span className="portfolio-box-back-asset-allocation">6.6 %</span>
                        </div>

                        <div className="portfolio-box-back-asset">
                            <img src={EthImg} alt="" className='portfolio-box-back-asset-icon' />
                            <span className="portfolio-box-back-asset-name">Ethereum</span>
                            <span className="portfolio-box-back-asset-allocation">6.6 %</span>
                        </div>

                        <div className="portfolio-box-back-asset">
                            <img src={AvaxImg} alt="" className='portfolio-box-back-asset-icon' />
                            <span className="portfolio-box-back-asset-name">Avalanche</span>
                            <span className="portfolio-box-back-asset-allocation">6.6 %</span>
                        </div>

                        <div className="portfolio-box-back-asset">
                            <img src={BnbImg} alt="" className='portfolio-box-back-asset-icon' />
                            <span className="portfolio-box-back-asset-name">BNB</span>
                            <span className="portfolio-box-back-asset-allocation">6.6 %</span>
                        </div>

                        <div className="portfolio-box-back-asset">
                            <img src={SolImg} alt="" className='portfolio-box-back-asset-icon' />
                            <span className="portfolio-box-back-asset-name">Solana</span>
                            <span className="portfolio-box-back-asset-allocation">6.6 %</span>
                        </div>

                        <div className="portfolio-box-back-asset">
                            <img src={XrpImg} alt="" className='portfolio-box-back-asset-icon' />
                            <span className="portfolio-box-back-asset-name">Ripple</span>
                            <span className="portfolio-box-back-asset-allocation">6.6 %</span>
                        </div>
                    </div>
                </div>

            </div>


            <div className="portfolio-box">
                <div className="portfolio-box-front">
                    <div className="level1">
                        <img src={MetaverseLogo} alt="" />

                        <div className="portfolio-details">
                            <h1 className="portfolio-title fn-lg">Metaverse</h1>
                            <p className="creator fn-vsm">by kate14</p>
                        </div>
                    </div>

                    <img className="assets-img" src={AssetsImg} alt="" />

                    <div className="user-balance">
                        <span>Balance</span>
                        <span>$0</span>
                    </div>

                    <div className="user-return">
                        <span>Return</span>
                        <span>-</span>
                    </div>

                    <button className="btn fn-md" onClick={isWalletConnected && toggleCreateModal}>Create</button>

                    <div className="portfolio-data">
                        <div className="left">
                            <img src={PeopleImg} alt="" />
                            <span className="num-of-investors fn-sm">5,012</span>
                        </div>

                        <div className="right">
                            <img src={DollarImg} alt="" />
                            <span className="marketcap fn-sm">1,900,842</span>
                        </div>
                    </div>
                </div>

                <div className="protfolio-box-back">

                </div>
            </div>

        </div>

    </div>
    );
}

export default App;
