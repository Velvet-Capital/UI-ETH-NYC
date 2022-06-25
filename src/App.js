import React, { useEffect, useState } from "react"
import { Magic } from "magic-sdk"
import { providers, Contract, utils, BigNumber, ethers } from "ethers"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./styles/App.css"
import {abi as indexSwapAbi} from "./utils/abi/IndexSwap.json"
import {abi as indexSwapLibraryAbi} from "./utils/abi/IndexSwapLibrary.json"

import Header from "./components/Header/Header.jsx"
import PortfolioBox from "./components/PortfolioBox/PortfolioBox.jsx"
import ConnectModal from "./components/ConnectModal/ConnectModal.jsx"
import CreateModal from "./components/CreateModal/CreateModal.jsx"
import SuccessOrErrorMsgModal from "./components/SuccessOrErrorMsgModal/SuccessOrErrorMsgModal.jsx"
import ProgressModal from "./components/ProgressModal/ProgressModal"

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
    const [magicProvider, setMagicProvider] = useState(null)
    const [portfolioBox1FlipHandler, setPortfolioBox1FlipHandler] = useState("front")
    const [portfolioBox2FlipHandler, setPortfolioBox2FlipHandler] = useState("front")
    const [portfolioBox3FlipHandler, setPortfolioBox3FlipHandler] = useState("front")
    const [portfolioBox4FlipHandler, setPortfolioBox4FlipHandler] = useState("front")
    const [createModalTab, setCreateModalTab] = useState("create")
    const [maticBalance, setMaticBalance] = useState("0")
    const [top10Balance, setTop10Balance] = useState("0")
    const [currentMaticPrice, setCurrentMaticPrice] = useState(null)
    const [currentSafeGasPrice, setCurrentSafeGasPrice] = useState(null)
    const [isTestnet, setIsTestnet] = useState(false)
    const [isWrongNetwork, setIsWrongNetwork] = useState(false)
    // const [isLoading, setIsLoading] = useState(false)
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
    const [top10IndexVaultBalance, setTop10IndexVaultBalance] = useState("")
    const [top10TokenTotalSupply, setTop10TokenTotalSupply] = useState()

    const top10IndexContractAddressMainnet = constants.top10IndexContractAddressMainnet

    const [top10Tokens, setTop10Tokens] = useState([
        ["Bitcoin", "BTC", "0"],
        ["Ethereum", "ETH", "0"],
        ["XRP", "XRP", "0"],
        ["Cardano", "ADA", "0"],
        ["Avalanche", "AVAX", "0"],
        ["Polkadot", "DOT", "0"],
        ["TRON", "TRX", "0"],
        ["Dogecoin", "DOGE", "0"],
        ["Solana", "SOL", "0"],
        ["BNB", "BNB", "0"],
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

    //Alert **** changes required in this function for polygon 
    function portfolioBoxesflipHandler(portfolioName) {
        if (portfolioName === "BLUECHIP" || portfolioName === "TOP7") {
            if (portfolioBox1FlipHandler === "front") setPortfolioBox1FlipHandler("back")
            else setPortfolioBox1FlipHandler("front")
        } else if (portfolioName === "META") {
            if (portfolioBox2FlipHandler === "front") setPortfolioBox2FlipHandler("back")
            else setPortfolioBox2FlipHandler("front")
        } else if (portfolioName === "VTOP10") {
            if (portfolioBox4FlipHandler === "front") setPortfolioBox4FlipHandler("back")
            else setPortfolioBox4FlipHandler("front")
        } else if (portfolioName === "TOP10") {
            if (portfolioBox3FlipHandler === "front") setPortfolioBox3FlipHandler("back")
            else setPortfolioBox3FlipHandler("front")
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

    //Alert **** changes required in this function for polygon 

    async function checkIfWalletConnected() {
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
                window.open("https://metamask.io/download/", "_blank")
                return
            }
            const accounts = await ethereum.request({ method: "eth_accounts" })
            if (accounts.length > 0) {
                setCurrentAccount(accounts[0])
                setIsWalletConnected(true)
                const provider = getProviderOrSigner()
                provider.getNetwork().then(({ chainId }) => {
                    if (chainId === 56) {
                        getTokensTotalSupply()
                        getBalancesMainnet(accounts[0])
                    } else if (chainId === 97) getBalancesTestnet(accounts[0])
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

    //Alert **** changes required in this function for polygon 
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

    //Alert **** changes required in this function for polygon 
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

    //Alert **** changes required in this function for polygon 
    async function getBalancesMainnet(accountAddress) {
        try {
            //Getting Matic Balance
            const provider = new ethers.providers.JsonRpcProvider(
                "https://bsc-dataseed.binance.org/"
            )
            if (accountAddress !== "0x0000000000000000000000000000000000000000") {
                const maticBalance = utils.formatEther(await provider.getBalance(accountAddress))
                setMaticBalance(maticBalance)
            }

            //Getting BLUECHIP Balance
            const bluechipContract = new Contract(
                bluechipIndexContractAddressMainnet,
                indexSwapAbi,
                provider
            )
            const bluechipBalance = utils.formatEther(
                await bluechipContract.balanceOf(accountAddress)
            )
            setBluechipBalance(bluechipBalance)
            //Getting BLUECHIP Vault Balance
            const [bluechipTokensBalance, bluechipIndexVaultBalance] =
                await bluechipContract.getTokenAndVaultBalance()
            setBluechipIndexVaultBalance(utils.formatEther(bluechipIndexVaultBalance))
            //Getting BLUECHIP Tokens Weight
            let bluechipTokensInformation = bluechipTokens
            bluechipTokensBalance.forEach((tokenBalance, index) => {
                bluechipTokensInformation[index][2] = (
                    (utils.formatEther(tokenBalance) /
                        utils.formatEther(bluechipIndexVaultBalance)) *
                    100
                ).toFixed(1)
            })
            bluechipTokensInformation.sort(function (a, b) {
                return b[2] - a[2]
            })
            setBluechipTokens(bluechipTokensInformation)

            //Getting TOP10 Balance
            const top10Contract = new Contract(
                top10IndexContractAddressMainnet,
                indexSwapAbi,
                provider
            )
            const top10Balance = utils.formatEther(await top10Contract.balanceOf(accountAddress))
            setTop10Balance(top10Balance)
            //Getting TOP10 Vault Balance
            const [top10TokensBalance, top10IndexVaultBalance] =
                await top10Contract.getTokenAndVaultBalance()
            setTop10IndexVaultBalance(utils.formatEther(top10IndexVaultBalance))
            //Getting TOP10 Tokens Weight
            let top10TokensInformation = top10Tokens
            top10TokensBalance.forEach((tokenBalance, index) => {
                top10TokensInformation[index][2] = (
                    (utils.formatEther(tokenBalance) / utils.formatEther(top10IndexVaultBalance)) *
                    100
                ).toFixed(1)
            })
            top10TokensInformation.sort(function (a, b) {
                return b[2] - a[2]
            })
            setTop10Tokens(top10TokensInformation)     
        } catch (err) {
            console.log(err)
        }
    }

    //Alert **** changes required in this function for polygon 
    async function getTokensTotalSupply() {
        const provider = getProviderOrSigner()
        let contract
        //Getting META Token Total Supply
        contract = new Contract(metaIndexContractAddressMainnet, indexSwapAbi, provider)
        setMetaTokenTotalSupply(utils.formatEther(await contract.totalSupply()))

        //Getting BLUECHIP Token Total Supply
        contract = new Contract(bluechipIndexContractAddressMainnet, indexSwapAbi, provider)
        setBluechipTokenTotalSupply(utils.formatEther(await contract.totalSupply()))

        //Getting TOP10 Token Total Supply
        contract = new Contract(top10IndexContractAddressMainnet, indexSwapAbi, provider)
        setTop10TokenTotalSupply(utils.formatEther(await contract.totalSupply()))

        //Getting VTOP10 Token Total Supply
        contract = new Contract(top10VenusContractAddressMainnet, indexSwapAbi, provider)
        setVtop10TokenTotalSupply(utils.formatEther(await contract.totalSupply()))
    }

    //Alert **** changes required in this function for polygon 
    async function invest(portfolioName, amountToInvest) {
        toggleCreateModal()
        try {
            await checkNetwork()
            const signer = getProviderOrSigner(true)
            let contract
            console.log(portfolioName)
            if (portfolioName === "META") {
                contract = new Contract(metaIndexContractAddressMainnet, indexSwapAbi, signer)
            } else if (portfolioName === "BLUECHIP") {
                contract = new Contract(bluechipIndexContractAddressMainnet, indexSwapAbi, signer)
            } else if (portfolioName === "TOP10") {
                contract = new Contract(top10IndexContractAddressMainnet, indexSwapAbi, signer)
            } else if (portfolioName === "VTOP10") {
                contract = new Contract(top10VenusContractAddressMainnet, Top10Venus.abi, signer)
            } else if (portfolioName === "TOP7") {
                contract = new Contract(top7IndexContractAddressTestnet, indexSwapAbi, signer)
            }

            //showing progress Modal till transaction is not mined
            setProgressModalInf({
                show: true,
                transactionType: "invest",
                asset1Name: "BNB",
                asset1Amount: utils.formatEther(amountToInvest),
                asset2Name: portfolioName,
                asset2Amount: utils.formatEther(amountToInvest),
            })

            let txHash
            let tx
            if (portfolioName === "VTOP10")
                tx = await contract.investInFund({
                    value: amountToInvest.toString(),
                    gasLimit: 6500000,
                })
            else tx = await contract.investInFund({ value: amountToInvest, gasLimit: 2220806 })
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

    //Alert **** changes required in this function for polygon 
    async function withdraw(portfolioName, amountToWithdraw) {
        toggleCreateModal()
        try {
            await checkNetwork()
            const signer = getProviderOrSigner(true)
            let contract
            console.log(portfolioName)
            if (portfolioName === "META") {
                contract = new Contract(metaIndexContractAddressMainnet, indexSwapAbi, signer)
            } else if (portfolioName === "BLUECHIP") {
                contract = new Contract(bluechipIndexContractAddressMainnet, indexSwapAbi, signer)
            } else if (portfolioName === "TOP10") {
                contract = new Contract(top10IndexContractAddressMainnet, indexSwapAbi, signer)
            } else if (portfolioName === "VTOP10") {
                contract = new Contract(top10VenusContractAddressMainnet, Top10Venus.abi, signer)
            } else if (portfolioName === "TOP7") {
                contract = new Contract(top7IndexContractAddressTestnet, indexSwapAbi, signer)
            }

            //showing progress Modal till transaction is not mined
            setProgressModalInf({
                show: true,
                transactionType: "withdraw",
                asset1Name: portfolioName,
                asset1Amount: utils.formatEther(amountToWithdraw),
                asset2Name: "BNB",
                asset2Amount: utils.formatEther(amountToWithdraw),
            })

            let txHash
            let tx
            if (portfolioName === "VTOP10")
                tx = await contract.withdrawFromFundNew(amountToWithdraw.toString(), {
                    gasLimit: 7440729,
                })
            else tx = await contract.withdrawFromFundNew(amountToWithdraw.toString())
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

    //Alert **** changes required in this function for polygon 
    useEffect(() => {
        checkIfWalletConnected()

        if (!isWalletConnected) getBalancesMainnet("0x0000000000000000000000000000000000000000")

        //fetching bnb price in USDT
        fetch("https://api.binance.com/api/v3/ticker/price?symbol=MATICUSDT")
            .then((res) => res.json())
            .then((data) => {
                const price = parseFloat(data.price)
                setCurrentMaticPrice(price)

                //fetching current safe gas price
                fetch(
                    "https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=AJ4KP2CIWV6DWF2SSPQ5SX16C9YZ78B2B4"
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
                handleEmailInputChange={handleEmailInputChange}
                email={email}
                handleSignin={handleSignin}
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
                    top10Balance={top10Balance}
                    top10IndexVaultBalance={top10IndexVaultBalance}
                    top10TokenTotalSupply={top10TokenTotalSupply}
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


            <Header
                toggleConnectWalletModal={toggleConnectWalletModal}
                toggleHeaderDropdownMenu={toggleHeaderDropdownMenu}
                showHeaderDropdownMenu={showHeaderDropdownMenu}
                isWalletConnected={isWalletConnected}
                currentAccount={currentAccount}
                maticBalance={maticBalance}
                totalUserValue={
                    parseFloat(top10Balance) + 0
                }
                currentMaticPrice={currentMaticPrice}
                isTestnet={isTestnet}
                isWrongNetwork={isWrongNetwork}
                switchToMainnet={switchToMainnet}
                switchToTestnet={switchToTestnet}
                disconnectWallet={disconnectWallet}
            />

            <h2 className="title fn-lg">Community Portfolios</h2>

            <div className="container">
                {isTestnet ? (
                    null
                ) : (
                    <>
                        <PortfolioBox
                            flipHandler={portfolioBoxesflipHandler}
                            portfolioBoxSide={portfolioBox3FlipHandler}
                            logo={VelvetCapitalLogo2}
                            title="Top5"
                            portfolioName="TOP10"
                            creator="Test"
                            tippyContent="Top 5 Cryptocurrencies by Total Market Capitalization, Equally weighted (excluding stablecoins)"
                            assetsImg={Top10AssestsImg}
                            indexTokenBalance={top10Balance}
                            currentMaticPrice={currentMaticPrice}
                            numberOfInvestors="4,519"
                            indexVaultBalance={top10IndexVaultBalance}
                            tokens={top10Tokens}
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
