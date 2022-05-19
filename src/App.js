import React, { useState } from 'react';
import './styles/App.css';
import './styles/portfoliobox.css';

import Header from './components/Header/Header.jsx';
import Modal from './components/Modal/Modal.jsx';

import Logo from './assets/img/velvetcapitallogo.png';
import MetaverseLogo from './assets/img/metaverse.svg';
import AssetsImg from './assets/img/assetsimg1.png';
import DollarImg from './assets/img/dollar.svg';
import PeopleImg from './assets/img/people.svg';


function App() {

    const [isWalletConnected, setIsWalletConnected] = useState(true);
    const [showConnectWalletModal, setShowConnectWalletModal] = useState(false);

    function toggleConnectWalletModal() {
        if(showConnectWalletModal){
            setShowConnectWalletModal(false);
        }
        else {
            setShowConnectWalletModal(true);
        }
    }
    return (
    <div className="App">

        <Modal show={showConnectWalletModal} toggleConnectWalletModal={toggleConnectWalletModal} />

        <Header toggleConnectWalletModal={toggleConnectWalletModal} isWalletConnected={isWalletConnected} />

        <h2 className='title fn-lg'>Community portfolios</h2>

        <div className="container">

        <div className="portfolio-box">
                <div className="level1">
                    <img src={Logo} alt="" />

                    <div className="portfolio-details">
                        <h1 className="portfolio-title fn-lg">Top 15</h1>
                        <p className="creator fn-vsm">by Andreas555</p>
                    </div>
                </div>

                <img className="assets-img" src={AssetsImg} alt="" />

                <div className="user-balance">
                    <span>balance</span>
                    <span>$0</span>
                </div>

                <div className="user-return">
                    <span>return</span>
                    <span>-</span>
                </div>

                <button className="btn fn-md" >Create</button>

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
        </div>

        <div className="portfolio-box">
            <div className="level1">
                <img src={MetaverseLogo} alt="" />

                <div className="portfolio-details">
                    <h1 className="portfolio-title fn-lg">Metaverse</h1>
                    <p className="creator fn-vsm">by kate14</p>
                </div>
            </div>

            <img className="assets-img" src={AssetsImg} alt="" />

            <div className="user-balance">
                <span>balance</span>
                <span>$0</span>
            </div>

            <div className="user-return">
                <span>return</span>
                <span>-</span>
            </div>

            <button className="btn fn-md">Create</button>

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

        </div>

    </div>
    );
}

export default App;
