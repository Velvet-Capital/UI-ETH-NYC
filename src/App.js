import React, { useEffect, useState } from "react"
import { Magic } from "magic-sdk"
// import WalletConnectProvider from "@walletconnect/web3-provider";
import { providers, Contract, utils, BigNumber, ethers } from "ethers"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./styles/App.css"
import indexSwap from "./utils/abi/IndexSwap.json"
import indexSwapLibraryAbi from "./utils/abi/IndexSwapLibrary.json"

import Header from "./components/Header/Header.jsx"
import PortfolioBox from "./components/PortfolioBox/PortfolioBox.jsx"
import ConnectModal from "./components/ConnectModal/ConnectModal.jsx"
import CreateModal from "./components/CreateModal/CreateModal.jsx"
import SuccessOrErrorMsgModal from "./components/SuccessOrErrorMsgModal/SuccessOrErrorMsgModal.jsx"
import ProgressModal from "./components/ProgressModal/ProgressModal"
import SwapModal from "./components/SwapModal/SwapModal"

import CreateModalState from "./context/CreateModal/CreateModalState"

import VelvetCapitalLogo from "./assets/img/newvelvetcapitallogo.svg"
import VelvetCapitalLogo2 from "./assets/img/velvetcapitallogo2.svg"
import MetaverseLogo from "./assets/img/metaverse.svg"
import Top10AssestsImg from "./assets/img/top10assests.png"
import BluechipAssetsImg from "./assets/img/bluechipassets.png"
import MetaverseAssetsImg from "./assets/img/metaverseassets.png"

import * as constants from "./utils/constants.js"

function App() {
    const [currentAccount, setCurrentAccount] = useState("")
    const [email, setEmail] = useState("")
    const [isWalletConnected, setIsWalletConnected] = useState(false)
    const [showConnectWalletModal, setShowConnectWalletModal] = useState(false)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showHeaderDropdownMenu, setShowHeaderDropdownMenu] = useState(false)
    const [showSwapModal, setShowSwapModal] = useState(false)
    const [magicProvider, setMagicProvider] = useState(null)
    const [provider, setProvider] = useState(null)
    const [top5DefiPortfolioBoxFlipHandler, setTop5DefiPortfolioBoxFlipHandler] = useState("front")
    const [metaPortfolioBoxFlipHandler, setMetaPortfolioBoxFlipHandler] = useState("front")
    const [createModalTab, setCreateModalTab] = useState("create")
    const [maticBalance, setMaticBalance] = useState("0")
    const [top5DefiBalance, setTop5DefiBalance] = useState("0")
    const [metaBalance, setMetaBalance] = useState("0")
    const [currentMaticPrice, setCurrentMaticPrice] = useState(null)
    const [currentSafeGasPrice, setCurrentSafeGasPrice] = useState(null)
    const [isTestnet, setIsTestnet] = useState(false)
    const [isWrongNetwork, setIsWrongNetwork] = useState(false)
    const [createModalPortfolioName, setCreateModalPortfolioName] = useState(null)
    const [successOrErrorModalInf, setSuccessOrErrorModalInf] = useState({
        show: false,
        portfolioName: "",
        transactionType: "",
        amount: "",
        txHash: "",
        status: 0,
    })
    const [progressModalInf, setProgressModalInf] = useState({
        show: false,
        transactionType: "",
        asset1Name: "",
        asset1Amount: "",
        asset2Name: "",
        asset2Amount: ""
    })
    const [top5DefiIndexVaultBalance, setTop5DefiIndexVaultBalance] = useState("")
    const [metaIndexVaultBalance, setMetaIndexVaultBalance] = useState("")
    const [top5DefiTokenTotalSupply, setTop5DefiTokenTotalSupply] = useState("")
    const [metaTokenTotalSupply, setMetaTokenTotalSupply] = useState("")
    const [top5DefiTokenHoldersCount, setTop5DefiTokenHoldersCount] = useState("0")
    const [metaTokenHoldersCount, setMetaTokenHoldersCount] = useState("0")

    const top5DefiIndexContractAddressMainnet = constants.top5DefiIndexContractAddressMainnet
    const metaIndexContractAddressMainnet = constants.metaIndexContractAddressMainnet

    const [top5DefiTokens, setTop5DefiTokens] = useState([
        ["Maker", "MKR", "0"],
        ["Uniswap", "UNI", "0"],
        ["ChainLink", "LINK", "0"],
        ["Aave", "AAVE", "0"],
        ["COMPOUND", "COMP", "0"]
    ])

    const [metaTokens, setMetaTokens] = useState([
        ["SandBox", "SAND", "0"],
        ["Decentraland", "MANA", "0"],
        ["Aavegotchi", "GHST", "0"]
    ])

    function checkMetamask() {
        const { ethereum } = window
        if (!ethereum) {
            toast.error("Get MetaMask -> https://metamask.io/", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            throw new Error("Metamask Not Installed")
        }
        return ethereum;
    }

    function toggleConnectWalletModal() {
        if (showConnectWalletModal) setShowConnectWalletModal(false)
        else setShowConnectWalletModal(true)
    }

    function toggleSwapModal() {
        setShowSwapModal(prevState => !prevState);
    }

    async function toggleCreateModal(e) {
        await checkNetwork()
        if (showCreateModal) setShowCreateModal(false)
        else setShowCreateModal(true)

        setCreateModalPortfolioName(e.target.getAttribute("data-portfolio-name"))
    }

    function toggleCreateModalTab() {
        if (createModalTab === "create") setCreateModalTab("redeem")
        else setCreateModalTab("create")
    }

    function toggleHeaderDropdownMenu() {
        if (showHeaderDropdownMenu) setShowHeaderDropdownMenu(false)
        else setShowHeaderDropdownMenu(true)
    }

    function toggleSuccessOrErrorMsgModal() {
        if (successOrErrorModalInf.show)
            setSuccessOrErrorModalInf((prevState) => ({ ...prevState, show: false }))
        else setSuccessOrErrorModalInf((prevState) => ({ ...prevState, show: true }))
    }

    function toggleProgressModal() {
        if (progressModalInf.show)
            setProgressModalInf((prevState) => ({ ...prevState, show: false }))
        else setProgressModalInf((prevState) => ({ ...prevState, show: true }))
    }

    function portfolioBoxesflipHandler(portfolioName) {
        if(portfolioName === "TOP5D") {
            if (top5DefiPortfolioBoxFlipHandler === "front") setTop5DefiPortfolioBoxFlipHandler("back")
            else setTop5DefiPortfolioBoxFlipHandler("front")
        }
        else if(portfolioName === "META") {
            if (metaPortfolioBoxFlipHandler === "front") setMetaPortfolioBoxFlipHandler("back")
            else setMetaPortfolioBoxFlipHandler("front")
        }
    }

    function handleEmailInputChange(e) {
        e.preventDefault()
        setEmail(e.target.value)
    }

    async function handleSignin(e) {
        e.preventDefault()
        try {
            const magic = new Magic("pk_live_5A41A4690CAFE701")
            const didToken = await magic.auth.loginWithMagicLink({
                email: email,
            })

            const provider = new providers.Web3Provider(magic.rpcProvider)
            setMagicProvider(provider)
            const signer = provider.getSigner()
            setCurrentAccount(await signer.getAddress())
            setIsWalletConnected(true)
            toggleConnectWalletModal()
        } catch (err) {
            console.log(err)
            console.log("some error while login with magic link")
        }
    }

    async function switchToTestnet() {
        try {
            const { ethereum } = window
            if (!ethereum) {
                toast.error("Get MetaMask -> https://metamask.io/", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
                return
            }

            //switch network to polygon-testnet
            await ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                    {
                        chainId: "0x13881",
                        rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
                        chainName: "Mumbai Testnet",
                        nativeCurrency: {
                            name: "Matic",
                            symbol: "MATIC",
                            decimals: 18,
                        },
                        blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
                    },
                ],
            })

            toggleHeaderDropdownMenu()
            const provider = getProviderOrSigner()
            const { chainId } = await provider.getNetwork()
            if (chainId === 80001) {
                setIsTestnet(true)
                await getBalancesTestnet(currentAccount)
            }
        } catch (err) {
            console.log(err)
        }
    }

    async function switchToMainnet() {
        try {
            const { ethereum } = window
            if (!ethereum) {
                toast.error("Get MetaMask -> https://metamask.io/", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                    progress: undefined,
                })
                return
            }

            //switch network to polygon-mainnet
            await ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                    {
                        chainId: "0x89",
                        rpcUrls: ["https://polygon-rpc.com"],
                        chainName: "Polygon",
                        nativeCurrency: {
                            name: "Matic",
                            symbol: "MATIC",
                            decimals: 18,
                        },
                        blockExplorerUrls: ["https://polygonscan.com/"],
                    },
                ],
            })
            if (showHeaderDropdownMenu) toggleHeaderDropdownMenu()
            const provider = getProviderOrSigner()
            const { chainId } = await provider.getNetwork()
            if (chainId === 137) {
                setIsTestnet(false)
                setIsWrongNetwork(false)
                await getBalancesMainnet(currentAccount)
            }
        } catch (err) {
            console.log(err)
        }
    }

    async function connectWalletWithWalletConnect() {
        try {
            // const provider = new WalletConnectProvider({
            //     infuraId: "0256b551e86c73001408616c2984b098",
            // });
            // await provider.enable();
            // const web3Provider = new providers.Web3Provider(provider)
            // setProvider(web3Provider);
            // setCurrentAccount(await web3Provider.getAddress())
            // toggleConnectWalletModal()
            // setIsWalletConnected(true)
        } catch(err) {
            console.log(err)
        }
    } 

    async function connectWallet() {
        try {
            const { ethereum } = window
            if (!ethereum) {
                toast.error("Get MetaMask -> https://metamask.io/", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
                return
            }

            const accounts = await ethereum.request({ method: "eth_requestAccounts" })
            setCurrentAccount(accounts[0])
            setIsWalletConnected(true)
            toggleConnectWalletModal()
            checkNetwork().then(async () => {
                const provider = getProviderOrSigner()
                if (provider) {
                    const { chainId } = await provider.getNetwork()
                    if (chainId === 137) {
                        await getBalancesMainnet(accounts[0])
                        getTokensTotalSupply()
                        setIsWrongNetwork(false)
                    }
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    function disconnectWallet() {
        setIsWalletConnected(false)
        toggleHeaderDropdownMenu()
    }

    async function checkIfWalletConnected() {
        try {
            const ethereum = checkMetamask()
            
            const accounts = await ethereum.request({ method: "eth_accounts" })
            if (accounts.length > 0) {
                setCurrentAccount(accounts[0])
                setIsWalletConnected(true)
                const provider = getProviderOrSigner()
                provider.getNetwork().then(({ chainId }) => {
                    if (chainId === 137) {
                        getTokensTotalSupply()
                        getBalancesMainnet(accounts[0])
                    } else if (chainId === 80001) getBalancesTestnet(accounts[0])
                })
            }
        } catch (err) {
            console.log(err)
        }
    }

    function getProviderOrSigner(needSigner = false) {
        try {
            const { ethereum } = window
            if (ethereum) {
                const provider = new providers.Web3Provider(ethereum)
                if (needSigner) return provider.getSigner()

                return provider
            }
        } catch (err) {
            console.log(err)
        }
    }

    async function checkNetwork() {
        try {
            const ethereum = checkMetamask()
            const provider = getProviderOrSigner()
            const { chainId } = await provider.getNetwork()
            if (isTestnet) {
                if (chainId !== 80001) {
                    //switch network to polygon-testnet
                    await ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainId: "0x13881",
                                rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
                                chainName: "Mumbai Testnet",
                                nativeCurrency: {
                                    name: "Matic",
                                    symbol: "MATIC",
                                    decimals: 18,
                                },
                                blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
                            },
                        ],
                    })
                }
            } else {
                if (chainId !== 137) {
                    //switch network to polygon-mainnet
                    await ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainId: "0x89",
                                rpcUrls: ["https://polygon-rpc.com"],
                                chainName: "Polygon",
                                nativeCurrency: {
                                    name: "Matic",
                                    symbol: "MATIC",
                                    decimals: 18,
                                },
                                blockExplorerUrls: ["https://polygonscan.com/"],
                            },
                        ],
                    })
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    async function getBalancesTestnet(accountAddress) {
        try {
            //Getting matic Balance
            const provider = getProviderOrSigner()
            const maticBalance = utils.formatEther(await provider.getBalance(accountAddress))
            setMaticBalance(maticBalance)
        } catch (err) {
            console.log(err)
        }
    }

    async function getBalancesMainnet(accountAddress) {
        try {
            //Getting Matic Balance
            const provider = new ethers.providers.JsonRpcProvider(
                "https://rpc-mainnet.maticvigil.com"
            )
            if (accountAddress !== "0x0000000000000000000000000000000000000000") {
                const maticBalance = utils.formatEther(await provider.getBalance(accountAddress))
                setMaticBalance(maticBalance)
            }
            
            //Getting TOP-5-DEFI Balance
            const top5DefiContract = new Contract(
                top5DefiIndexContractAddressMainnet,
                indexSwap.abi,
                provider
            )
            const top5DefiBalance = utils.formatEther(await top5DefiContract.balanceOf(accountAddress))
            setTop5DefiBalance(top5DefiBalance)

            //Getting TOP-5-DEFI Vault Balance
            const top5DefiLibraryContract = new Contract(
                "0xe0406D86aEb9B3b5dbE94d4C9d394A164E67a6ac",
                indexSwapLibraryAbi.abi,
                provider
            )
            const [top5DefiTokensBalance, top5DefiIndexVaultBalance] =
                await top5DefiLibraryContract.getTokenAndVaultBalance(top5DefiIndexContractAddressMainnet)
            setTop5DefiIndexVaultBalance(utils.formatEther(top5DefiIndexVaultBalance))

            //Getting TOP-5-DEFI Tokens Weight
            let top5DefiTokensInformation = top5DefiTokens
            top5DefiTokensBalance.forEach((tokenBalance, index) => {
                top5DefiTokensInformation[index][2] = (
                    (tokenBalance / top5DefiIndexVaultBalance) * 100
                ).toFixed(1)
            })
            top5DefiTokensInformation.sort(function (a, b) {
                return b[2] - a[2]
            })
            setTop5DefiTokens(top5DefiTokensInformation)
            // console.log(top5DefiTokensBalance.map(ele => ele.toString()))
            // console.log(top5DefiIndexVaultBalance.toString())

            //Getting META Balance
            const metaContract = new Contract(
                metaIndexContractAddressMainnet,
                indexSwap.abi,
                provider
            )
            const metaBalance = utils.formatEther(await metaContract.balanceOf(accountAddress))
            setMetaBalance(metaBalance)

            //Getting META Vault Balance
            const metaLibraryContract = new Contract(
                "0x13b1b380FeC7737C435bCDd59c02F7D0EC1076C3",
                indexSwapLibraryAbi.abi,
                provider
            )
            const [metaTokensBalance, metaIndexVaultBalance] =
                await metaLibraryContract.getTokenAndVaultBalance(metaIndexContractAddressMainnet)
            setMetaIndexVaultBalance(utils.formatEther(metaIndexVaultBalance))

            //Getting META Tokens Weight
            let metaTokensInformation = metaTokens
            metaTokensBalance.forEach((tokenBalance, index) => {
                metaTokensInformation[index][2] = (
                    (tokenBalance / metaIndexVaultBalance) * 100
                ).toFixed(1)
            })
            metaTokensInformation.sort(function (a, b) {
                return b[2] - a[2]
            })
            setMetaTokens(metaTokensInformation)
    

        } catch (err) {
            console.log(err)
        }
    }

    async function getTokensTotalSupply() {
        const provider = getProviderOrSigner()
        let contract

        //Getting META Token Total Supply
        contract = new Contract(metaIndexContractAddressMainnet, indexSwap.abi, provider)
        setMetaTokenTotalSupply(utils.formatEther(await contract.totalSupply()))

        //Getting Top5 Defi Token Total Supply
        contract = new Contract(top5DefiIndexContractAddressMainnet, indexSwap.abi, provider)
        setTop5DefiTokenTotalSupply(utils.formatEther(await contract.totalSupply()))
    }

    async function getTokensHoldersCount() {
    let urlForTop5DefiTokenHoldersCount = "https://api.unmarshal.com/v1/matic/token-address/" + top5DefiIndexContractAddressMainnet + "/holders-count?auth_key=M0hbF8toAf3A8ZGyl4dMU9o4I8mujoFG2H0jc2m7"
    let urlForMetaTokenHoldersCount = "https://api.unmarshal.com/v1/matic/token-address/" + metaIndexContractAddressMainnet + "/holders-count?auth_key=M0hbF8toAf3A8ZGyl4dMU9o4I8mujoFG2H0jc2m7"

    fetch(urlForTop5DefiTokenHoldersCount)
        .then((res) => res.json())
        .then((data) => {
            setTop5DefiTokenHoldersCount(data.token_holders_count)
        })
        .catch(err => console.log(err))

    fetch(urlForMetaTokenHoldersCount)
        .then((res) => res.json())
        .then((data) => {
            setMetaTokenHoldersCount(data.token_holders_count)
        })
        .catch(err => console.log(err))
 
    }

    async function invest(portfolioName, amountToInvest) {
        toggleCreateModal()
        try {
            await checkNetwork()
            const signer = getProviderOrSigner(true)
            let contract
            console.log(portfolioName)
            if(portfolioName === "TOP5D")
                contract = new Contract(top5DefiIndexContractAddressMainnet, indexSwap.abi, signer)
            else if(portfolioName === "META")
                contract = new Contract(metaIndexContractAddressMainnet, indexSwap.abi, signer)

            //showing progress Modal till transaction is not mined
            setProgressModalInf({
                show: true,
                transactionType: "invest",
                asset1Name: "MATIC",
                asset1Amount: utils.formatEther(amountToInvest),
                asset2Name: portfolioName,
                asset2Amount: utils.formatEther(amountToInvest),
            })

            let txHash
            let tx
            tx = await contract.investInFund({ value: amountToInvest, gasLimit: 2000000 })
            txHash = tx.hash
            const receipt = tx.wait()

            receipt
                .then(async () => {
                    //hiding progress Modal - transaction is completed
                    setProgressModalInf(prevState => ({...prevState, show: false}))
                    setSuccessOrErrorModalInf({
                        show: true,
                        portfolioName: portfolioName,
                        transactionType: "invest",
                        amount: utils.formatEther(amountToInvest),
                        txHash: txHash,
                        status: 0,
                    })
                    if (isTestnet) await getBalancesTestnet(currentAccount)
                    else await getBalancesMainnet(currentAccount)
                })
                .catch((err) => {
                    //hiding progress Modal - transaction is completed
                    setProgressModalInf(prevState => ({...prevState, show: false}))
                    setSuccessOrErrorModalInf({
                        show: true,
                        portfolioName: portfolioName,
                        transactionType: "invest",
                        amount: utils.formatEther(amountToInvest),
                        txHash: txHash,
                        status: 1,
                    })
                    console.log(err)
                })
        } catch (err) {
            setProgressModalInf(prevState => ({...prevState, show: false}))
            console.log(err)
            if (err.code === -32603) {
                toast.error("Insufficient BNB Balance", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            } 
            else if(err.code === 4001) {
                toast.error("User Denied Transaction Signature", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    progress: undefined,
                })
            } 
            else {
                toast.error("Some Error Occured", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    progress: undefined,
                })
            }
        }
    }

    async function withdraw(portfolioName, amountToWithdraw) {
        toggleCreateModal()
        try {
            await checkNetwork()
            const signer = getProviderOrSigner(true)
            let contract
            console.log(portfolioName)

            if(portfolioName === "TOP5D")
                contract = new Contract(top5DefiIndexContractAddressMainnet, indexSwap.abi, signer)
            else if(portfolioName === "META")
                contract = new Contract(metaIndexContractAddressMainnet, indexSwap.abi, signer)
            

            //showing progress Modal till transaction is not mined
            setProgressModalInf({
                show: true,
                transactionType: "withdraw",
                asset1Name: portfolioName,
                asset1Amount: utils.formatEther(amountToWithdraw),
                asset2Name: "MATIC",
                asset2Amount: utils.formatEther(amountToWithdraw),
            })

            let txHash
            let tx

            tx = await contract.withdrawFund(amountToWithdraw.toString(), {gasLimit: 2000000})
            txHash = tx.hash
            const receipt = tx.wait()

            receipt
                .then(async () => {
                    //hiding progress Modal - transaction is completed
                    setProgressModalInf(prevState => ({...prevState, show: false}))
                    setSuccessOrErrorModalInf({
                        show: true,
                        portfolioName: portfolioName,
                        transactionType: "redeem",
                        amount: utils.formatEther(amountToWithdraw),
                        txHash: txHash,
                        status: 0,
                    })
                    if (isTestnet) await getBalancesTestnet(currentAccount)
                    else await getBalancesMainnet(currentAccount)
                })
                .catch((err) => {
                    //hiding progress Modal - transaction is completed
                    setProgressModalInf(prevState => ({...prevState, show: false}))
                    setSuccessOrErrorModalInf({
                        show: true,
                        portfolioName: portfolioName,
                        transactionType: "redeem",
                        amount: utils.formatEther(amountToWithdraw),
                        txHash: txHash,
                        status: 1,
                    })
                    console.log(err)
                })
        } catch (err) {
            //hiding progress Modal - transaction is completed
            setProgressModalInf(prevState => ({...prevState, show: false}))
            console.log(err)
            if (err.code === -32603) {
                toast.error(`Insufficient ${portfolioName} Balance`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    progress: undefined,
                })
            } 
            else if (err.code === 4001) {
                toast.error("User Denied Transaction Signature", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    progress: undefined,
                })
            }
            else {
                toast.error("Some Error Occured", {
                    position: "top-right",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    progress: undefined,
                })
            }
        }
    }

    useEffect(() => {
        checkIfWalletConnected()
        getTokensHoldersCount()

        if (!isWalletConnected) getBalancesMainnet("0x0000000000000000000000000000000000000000")

        //fetching bnb price in USDT
        fetch("https://api.binance.com/api/v3/ticker/price?symbol=MATICUSDT")
            .then((res) => res.json())
            .then((data) => {
                const price = parseFloat(data.price)
                setCurrentMaticPrice(price)

                //fetching current safe gas price
                fetch(
                    "https://api.polygonscan.com/api?module=gastracker&action=gasoracle&apikey=HDQTYF73Q2JJZBE6YNMZ1Q3HXIZYF9VI97"
                )
                    .then((res) => res.json())
                    .then((data) => {
                        const safeGasPrice = data.result.SafeGasPrice
                        setCurrentSafeGasPrice(safeGasPrice)
                    })
            })
            .catch((err) => console.log(err))
        //checking isWrongNetwork or not
        const provider = getProviderOrSigner()
        if (provider) {
            provider.getNetwork().then(({ chainId }) => {
                if (chainId === 137) setIsWrongNetwork(false)
                else if (chainId === 80001) setIsTestnet(true)
                else setIsWrongNetwork(true)
            })
        }
    }, [])

    return (
        <div className="App">
            <ConnectModal
                show={showConnectWalletModal}
                toggleModal={toggleConnectWalletModal}
                connectWallet={connectWallet}
                connectWalletWithWalletConnect={connectWalletWithWalletConnect}
                handleEmailInputChange={handleEmailInputChange}
                email={email}
                handleSignin={handleSignin}
            />

            <SwapModal 
                show={showSwapModal}
                toggleSwapModal={toggleSwapModal}

            />

            <CreateModalState>

                <CreateModal
                    show={showCreateModal}
                    toggleModal={toggleCreateModal}
                    createModalTab={createModalTab}
                    toggleCreateModalTab={toggleCreateModalTab}
                    invest={invest}
                    withdraw={withdraw}
                    maticBalance={maticBalance}
                    top5DefiBalance={top5DefiBalance}
                    metaBalance={metaBalance}
                    top5DefiIndexVaultBalance={top5DefiIndexVaultBalance}
                    metaIndexVaultBalance={metaIndexVaultBalance}
                    top5DefiTokenTotalSupply={top5DefiTokenTotalSupply}
                    metaTokenTotalSupply={metaTokenTotalSupply}
                    currentMaticPrice={currentMaticPrice}
                    currentSafeGasPrice={currentSafeGasPrice}
                    portfolioName={createModalPortfolioName}
                />

                <ProgressModal
                    show={progressModalInf.show}
                    asset1Name={progressModalInf.asset1Name}
                    asset1Amount={progressModalInf.asset1Amount}
                    asset2Name={progressModalInf.asset2Name}
                    asset2Amount={progressModalInf.asset2Amount}
                    transactionType={progressModalInf.transactionType}
                    currentMaticPrice={currentMaticPrice}
                    toggleProgessModal={toggleProgressModal}
                />

                <SuccessOrErrorMsgModal
                    show={successOrErrorModalInf.show}
                    portfolioName={successOrErrorModalInf.portfolioName}
                    transactionType={successOrErrorModalInf.transactionType}
                    amount={successOrErrorModalInf.amount}
                    txHash={successOrErrorModalInf.txHash}
                    status={successOrErrorModalInf.status}
                    currentMaticPrice={currentMaticPrice}
                    toggleSuccessOrErrorMsgModal={toggleSuccessOrErrorMsgModal}
                />

            </CreateModalState>

            <div style={{width: "100vw" , height: "5vh", backgroundColor: "red", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <p className="text-center">This project is at alpha stage proceed at your own risk.</p>
            </div>


            <Header
                toggleConnectWalletModal={toggleConnectWalletModal}
                toggleHeaderDropdownMenu={toggleHeaderDropdownMenu}
                toggleSwapModal={toggleSwapModal}
                showHeaderDropdownMenu={showHeaderDropdownMenu}
                isWalletConnected={isWalletConnected}
                currentAccount={currentAccount}
                maticBalance={maticBalance}
                totalUserValue={
                    parseFloat(metaBalance) + 
                    parseFloat(top5DefiBalance)
                }
                currentMaticPrice={currentMaticPrice}
                isTestnet={isTestnet}
                isWrongNetwork={isWrongNetwork}
                switchToMainnet={switchToMainnet}
                switchToTestnet={switchToTestnet}
                disconnectWallet={disconnectWallet}
            />

            <h2 className="title text-center">Portfolios</h2>

            <div className="container">
                {isTestnet ? (
                    null
                ) : (
                    <>
                        <PortfolioBox
                            flipHandler={portfolioBoxesflipHandler}
                            portfolioBoxSide={top5DefiPortfolioBoxFlipHandler}
                            logo={VelvetCapitalLogo}
                            title="Top 5 DEFI"
                            portfolioName="TOP5D"
                            creator="Test"
                            tippyContent="Top 5 DEFI Tokens by Total Market Capitalization, Equally weighted"
                            assetsImg={Top10AssestsImg}
                            indexTokenBalance={top5DefiBalance}
                            currentMaticPrice={currentMaticPrice}
                            indexVaultBalance={top5DefiIndexVaultBalance}
                            tokens={top5DefiTokens}
                            numberOfInvestors={top5DefiTokenHoldersCount}
                            isWalletConnected={isWalletConnected}
                            toggleConnectWalletModal={toggleConnectWalletModal}
                            toggleCreateModal={toggleCreateModal}
                        />

                        <PortfolioBox
                            flipHandler={portfolioBoxesflipHandler}
                            portfolioBoxSide={metaPortfolioBoxFlipHandler}
                            logo={MetaverseLogo}
                            title="Metaverse"
                            portfolioName="META"
                            creator="Test"
                            tippyContent="Top 3 Metaverse Tokens by Total Market Capitalization, Equally weighted"
                            assetsImg={MetaverseAssetsImg}
                            indexTokenBalance={metaBalance}
                            indexVaultBalance={metaIndexVaultBalance}
                            tokens={metaTokens}
                            currentMaticPrice={currentMaticPrice}
                            numberOfInvestors={metaTokenHoldersCount}
                            isWalletConnected={isWalletConnected}
                            toggleConnectWalletModal={toggleConnectWalletModal}
                            toggleCreateModal={toggleCreateModal}
                        />
                    </>
                )}
            </div>

            <ToastContainer />
        </div>
    )
}

export default App
