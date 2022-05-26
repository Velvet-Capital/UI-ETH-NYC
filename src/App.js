import React, { useEffect, useState } from 'react';
import { Magic} from 'magic-sdk';
import { providers, Contract, utils} from 'ethers';
import './styles/App.css';
import './styles/portfoliobox.css';
import indexSwap  from './utils/abi/IndexSwap.json';

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

    const [currentAccount, setCurrentAccount] = useState('');
    const [email, setEmail] = useState('');
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [showConnectWalletModal, setShowConnectWalletModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [provider, setProvider] = useState(null);
    const [portfolioBox1FlipHandler, setPortfolioBox1FlipHandler] = useState('front');
    const [portfolioBox2FlipHandler, setPortfolioBox2FlipHandler] = useState("front");
    const [createModalTab, setCreateModalTab] = useState('create');
    const [bnbBalance, setBnbBalance] = useState('0');
    const [metaBalance, setMetaBalance] = useState('0');
    const [bluechipBalance, setBluechipBalance] = useState('0')
    const [top7IndexBalalce, setTop7IndexBalance] = useState('0')
    const [currentBnbPrice, setCurrentBnbPrice] = useState(null);
    const [isTestnet, setIsTestnet] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [createModalPortfolioName, setCreateModalPortfolioName] = useState(null);
    
    const bluechipIndexContractAddressMainnet = '0x55204c31E725C7635393bdBdE738d73c1e10E178';
    const metaIndexContractAddressMainnet = '0xB757F1D8c40D49313f716906d7c3107a877367AD';
    const top7IndexContractAddressTestnet = '0x5DA92941262768deA5018114e64EB73b937B5Cb0';
    const indexSwapAbi = indexSwap.abi;

    function toggleConnectWalletModal() {
        if(showConnectWalletModal)
            setShowConnectWalletModal(false);
        else 
            setShowConnectWalletModal(true);
    }

    async function toggleCreateModal(e) {
        if(showCreateModal)
            setShowCreateModal(false);
        else
            setShowCreateModal(true);

        setCreateModalPortfolioName(e.target.getAttribute('data-portfolio-name'));
    }

    function toggleCreateModalTab() {
        if(createModalTab === 'create') 
            setCreateModalTab('reedem');
        else
            setCreateModalTab('create');
    }

    function handleEmailInputChange(e) {
        e.preventDefault();
        setEmail(e.target.value);
    }
    
    async function handleSignin(e) {
        e.preventDefault();
        try {
            const magic = new Magic('pk_live_5A41A4690CAFE701');
            const didToken = await magic.auth.loginWithMagicLink({
                email: email
            })
            
            const provider = new providers.Web3Provider(magic.rpcProvider);
            setProvider(provider);
            const signer = provider.getSigner();
            setCurrentAccount(await signer.getAddress());
            setIsWalletConnected(true);
            toggleConnectWalletModal();
        }
        catch(err) {
            console.log(err);
            console.log("some error while login with magic link")
        }
    }

    async function switchToTestnet() {
        try {
            const {ethereum} = window;
            if(!ethereum) {
                alert("Get MetaMask -> https://metamask.io/")
                return
            }
  
            setIsTestnet(true);
            //switch network to bsc-testnet
            await ethereum.request({
                method: "wallet_addEthereumChain",
                params: [{
                    chainId: "0x61",
                    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
                    chainName: "BSC Testnet",
                    nativeCurrency: {
                        name: "Binance",
                        symbol: "BNB",
                        decimals: 18
                    },
                    blockExplorerUrls: ["https://testnet.bscscan.com"]
                }]
            });
            await getBalancesTestnet(currentAccount);
        }
        catch(err) {
            console.log(err);
        }
    }

    async function switchToMainnet() {
        try {
            const {ethereum} = window;
            if(!ethereum) {
                alert("Get MetaMask -> https://metamask.io/")
                return
            }
  
            setIsTestnet(false);
            //switch network to bsc-mainnet
            await ethereum.request({
                method: "wallet_addEthereumChain",
                params: [{
                    chainId: "0x38",
                    rpcUrls: ["https://bsc-dataseed.binance.org/"],
                    chainName: "BSC Main",
                    nativeCurrency: {
                        name: "Binance",
                        symbol: "BNB",
                        decimals: 18
                    },
                    blockExplorerUrls: ["https://bscscan.com"]
                }]
            });
            await getBalancesMainnet(currentAccount);
        }
        catch(err) {
            console.log(err);
        }
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
            checkNetwork();
            if(isTestnet)
                await getBalancesTestnet(accounts[0]);
            else
                await getBalancesMainnet(accounts[0]);
        }
        catch(err) {
            console.log(err);
        }
    }

    async function checkIfWalletConnected() {
        try {
            const {ethereum} = window;
            if(!ethereum) {
                alert("Get MetaMask -> https://metamask.io/")
                return
            }
            const accounts = await ethereum.request({method: "eth_accounts"});
            if(accounts.length > 0) {
                setCurrentAccount(accounts[0]);
                setIsWalletConnected(true);
                await checkNetwork();
                if(isTestnet)
                    await getBalancesTestnet(accounts[0]);
                else
                    await getBalancesMainnet(accounts[0]);
            }
        }
        catch(err) {
            console.log(err);
        }
    }

    function getProviderOrSigner(needSigner=false) {
        try {
            const {ethereum} = window;
            if(ethereum) {
                const provider = new providers.Web3Provider(ethereum);
                if(needSigner) 
                    return provider.getSigner();

                return provider;
            }
        }
        catch(err) {
            console.log(err);
        }
    }

    async function checkNetwork() {
        try {
            const {ethereum} = window;
            if(!ethereum) {
                alert("Get MetaMask -> https://metamask.io/")
                return
            }
            const provider = getProviderOrSigner();
            const {chainId} = await provider.getNetwork();
            if(isTestnet){
                if(chainId !== 97) {
                    //switch network to bsctest
                    await ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [{
                            chainId: "0x61",
                            rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
                            chainName: "BSC Testnet",
                            nativeCurrency: {
                                name: "Binance",
                                symbol: "BNB",
                                decimals: 18
                            },
                            blockExplorerUrls: ["https://testnet.bscscan.com"]
                        }]
                    });
                } 
            } 
            else {
                if(chainId !== 56) {
                    //switch network to bscmain
                    await ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [{
                            chainId: "0x38",
                            rpcUrls: ["https://bsc-dataseed.binance.org/"],
                            chainName: "BSC Main",
                            nativeCurrency: {
                                name: "Binance",
                                symbol: "BNB",
                                decimals: 18
                            },
                            blockExplorerUrls: ["https://bscscan.com"]
                        }]
                    });
                } 
            }
        }
        catch(err) {
            console.log(err);
        }
    }

    async function getBalancesTestnet(accountAddress) {
        try { 
            const provider = getProviderOrSigner();
            setBnbBalance(parseFloat(utils.formatEther(await provider.getBalance(accountAddress))).toFixed(2));
            const contract = new Contract(top7IndexContractAddressTestnet, indexSwapAbi, provider);
            setTop7IndexBalance(parseFloat(utils.formatEther(await contract.balanceOf(accountAddress))).toFixed(2));
        }
        catch(err) {
            console.log(err);
        }
    }

    async function getBalancesMainnet(accountAddress) {
        try { 
            //BNB
            const provider = getProviderOrSigner();
            setBnbBalance(parseFloat(utils.formatEther(await provider.getBalance(accountAddress))).toFixed(2));
            //META
            const contract = new Contract(metaIndexContractAddressMainnet, indexSwapAbi, provider); 
            setMetaBalance(parseFloat(utils.formatEther(await contract.balanceOf(accountAddress))).toFixed(2));
            //BLUECHIP
            const contract2 = new Contract(bluechipIndexContractAddressMainnet, indexSwapAbi, provider); 
            setBluechipBalance(parseFloat(utils.formatEther(await contract2.balanceOf(accountAddress))).toFixed(2));
        }
        catch(err) {
            console.log(err);
        }
    }

    async function invest(portfolioName, amountToInvest) {
        setIsLoading(true);
        try {
            await checkNetwork();
            const signer= getProviderOrSigner(true);
            let contract;
            console.log(portfolioName);
            if(portfolioName === 'META') {
                contract = new Contract(metaIndexContractAddressMainnet, indexSwapAbi, signer);
            }
            else if(portfolioName === 'BLUECHIP') {
                contract = new Contract(bluechipIndexContractAddressMainnet, indexSwapAbi, signer);
            }
            else if(portfolioName === 'TOP7') {
                contract = new Contract(top7IndexContractAddressTestnet, indexSwapAbi, signer);
            }
            
            let tx = await contract.investInFund({value: amountToInvest});
            const receipt = await tx.wait();
            setIsLoading(false);
            if(isTestnet)
                await getBalancesTestnet(currentAccount);
            else
                await getBalancesMainnet(currentAccount);

            if(receipt.status === 1) 
                alert(`You have successfully invested ${utils.formatEther(amountToInvest)} BNB into ${portfolioName} Index`);
            else
                alert("Transaction failed! Please try again");
            toggleCreateModal()
            
        }
        catch(err) {
            setIsLoading(false);
            console.log(err);
        }
    }

    async function withdraw(portfolioName, amountToWithdraw) {
        setIsLoading(true);
        try {
            await checkNetwork();
            const signer = getProviderOrSigner(true);
            let contract;
            console.log(portfolioName);
            if(portfolioName === 'META') {
                contract = new Contract(metaIndexContractAddressMainnet, indexSwapAbi, signer);
            }
            else if(portfolioName === 'BLUECHIP') {
                contract = new Contract(bluechipIndexContractAddressMainnet, indexSwapAbi, signer);
            }
            else if(portfolioName === 'TOP7') {
                contract = new Contract(top7IndexContractAddressTestnet, indexSwapAbi, signer);
            }
            
            let tx = await contract.withdrawFromFundNew(amountToWithdraw);
            const receipt = await tx.wait();
            setIsLoading(false);
            if(isTestnet)
                await getBalancesTestnet(currentAccount);
            else
                await getBalancesMainnet(currentAccount);
            if(receipt.status === 1)
                alert(`You have successfully reedemed ${utils.formatEther(amountToWithdraw)} ${portfolioName}`);
            else
                alert("Transaction failed! Please try again");
            toggleCreateModal()
        }
        catch(err) {
            setIsLoading(false);
            console.log(err);
        }
    }
    
    useEffect(() => { 
        checkIfWalletConnected(); 

        //fetching bnb price from binance api
        fetch('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT')
        .then( res => res.json() )
        .then( data => {
            const price = parseFloat(data.price);
            setCurrentBnbPrice(price)
        })
        .catch(err => console.log(err))
    }, [])

    return (
    <div className="App">

        <ConnectModal 
            show = {showConnectWalletModal} 
            toggleModal = {toggleConnectWalletModal} 
            connectWallet = {connectWallet} 
            handleEmailInputChange = {handleEmailInputChange} 
            email = {email} 
            handleSignin = {handleSignin} 
        />

        <CreateModal 
            show = {showCreateModal} 
            toggleModal = {toggleCreateModal} 
            createModalTab = {createModalTab} 
            toggleCreateModalTab = {toggleCreateModalTab}  
            invest = {invest}
            withdraw = {withdraw}
            bnbBalance = {bnbBalance}
            metaBalance = {metaBalance}
            bluechipBalance = {bluechipBalance}
            top7Balance = {top7IndexBalalce}
            currentBnbPrice = {currentBnbPrice}
            portfolioName = {createModalPortfolioName}
            isLoading = {isLoading}
        />

        <Header 
            toggleConnectWalletModal = {toggleConnectWalletModal} 
            isWalletConnected = {isWalletConnected} 
            currentAccount = {currentAccount} 
            bnbBalance = {bnbBalance}
            currentBnbPrice = {currentBnbPrice}
            isTestnet = {isTestnet}
            switchToMainnet = {switchToMainnet}
            switchToTestnet = {switchToTestnet}
        />

        <h2 className = 'title fn-lg'>Community Baskets</h2>

        <div className="container">

            {isTestnet ? (
                <div className="portfolio-box">
                    { portfolioBox1FlipHandler === 'front' ?
                    <div className='portfolio-box-front'>
                        <div className="level1">
                            <img src={Logo} alt="" />

                            <div className="portfolio-details">
                                <h1 className="portfolio-title fn-lg">Top 7</h1>
                                <p className="creator fn-vsm">by Andreas555</p>
                            </div>
                        </div>

                        <img className="assets-img cursor-pointer" src={AssetsImg} alt="" onClick={() => setPortfolioBox1FlipHandler('back')}/>

                        <div className="user-balance">
                            <span>Balance</span>
                            <span>{top7IndexBalalce} TOP7</span>
                        </div>

                        <div className="user-return">
                            <span>Return</span>
                            <span>-</span>
                        </div>

                        <button className="btn fn-md" data-portfolio-name="TOP7" onClick={isWalletConnected ? toggleCreateModal : toggleConnectWalletModal}>
                            {parseFloat(top7IndexBalalce) > 0 ? "Create/ Redeem" : "Create"}
                        </button>

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
                    :  
                    <div className="portfolio-box-back">
                        <img src={CrossImg} alt="" id="portfolio-box-back-cross" onClick={() => setPortfolioBox1FlipHandler('front')} />
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
                    </div>}

                </div>

            ) : (
                <>
                    <div className="portfolio-box">
                        { portfolioBox1FlipHandler === 'front' ?
                        <div className='portfolio-box-front'>
                            <div className="level1">
                                <img src={Logo} alt="" />

                                <div className="portfolio-details">
                                    <h1 className="portfolio-title fn-lg">Blue Chip</h1>
                                    <p className="creator fn-vsm">by Andreas555</p>
                                </div>
                            </div>

                            <img className="assets-img cursor-pointer" src={AssetsImg} alt="" onClick={() => setPortfolioBox1FlipHandler('back')}/>

                            <div className="user-balance">
                                <span>Balance</span>
                                <span>{bluechipBalance} BLUECHIP</span>
                            </div>

                            <div className="user-return">
                                <span>Return</span>
                                <span>-</span>
                            </div>

                            <button className="btn fn-md" data-portfolio-name="BLUECHIP" onClick={isWalletConnected ? toggleCreateModal : toggleConnectWalletModal}>
                                {parseFloat(bluechipBalance) > 0 ? "Create/ Redeem" : "Create"}
                            </button>

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
                        :  
                        <div className="portfolio-box-back">
                            <img src={CrossImg} alt="" id="portfolio-box-back-cross" onClick={() => setPortfolioBox1FlipHandler('front')} />
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
                        </div>}

                    </div>

                    <div className="portfolio-box">
                        { portfolioBox2FlipHandler === 'front' ? 

                        <div className="portfolio-box-front" >
                            <div className="level1">
                                <img src={MetaverseLogo} alt="" />

                                <div className="portfolio-details">
                                    <h1 className="portfolio-title fn-lg">Metaverse</h1>
                                    <p className="creator fn-vsm">by kate14</p>
                                </div>
                            </div>

                            <img className="assets-img cursor-pointer" src={AssetsImg} alt="" onClick={() => setPortfolioBox2FlipHandler('back')}/>

                            <div className="user-balance">
                                <span>Balance</span>
                                <span>{metaBalance} META</span>
                            </div>

                            <div className="user-return">
                                <span>Return</span>
                                <span>-</span>
                            </div>

                            <button className="btn fn-md" data-portfolio-name="META" onClick={isWalletConnected ? toggleCreateModal : toggleConnectWalletModal}>
                                {parseFloat(metaBalance) > 0 ? "Create/ Redeem" : "Create"}
                            </button>

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
                            :
                        <div className="portfolio-box-back">
                            <img src={CrossImg} alt="" id="portfolio-box-back-cross" onClick={() => setPortfolioBox2FlipHandler('front')} />
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
                        </div> }
                    </div>
                </>
            )}
        </div>

    </div>
    );
}

export default App;
