import React, { useEffect, useState } from "react"
import { Magic } from "magic-sdk"
import { providers, Contract, utils, BigNumber, ethers } from "ethers"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./styles/App.css"
import indexSwap from "./utils/abi/IndexSwap.json"
import VBep20Interface from "./utils/abi/VBep20Interface.json"
import Top10Venus from "./utils/abi/Top10Venus.json"
import PriceOracle from "./utils/abi/PriceOracle.json"

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
import VenusLogo from "./assets/img/venuslogo.png"
import VenusAssestsImg from "./assets/img/venusassests.png"
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
    const [bnbBalance, setBnbBalance] = useState("0")
    const [metaBalance, setMetaBalance] = useState("0")
    const [bluechipBalance, setBluechipBalance] = useState("0")
    const [top10Balance, setTop10Balance] = useState("0")
    const [vtop10Balance, setVtop10Balance] = useState("0")
    const [top7IndexBalance, setTop7IndexBalance] = useState("0")
    const [currentBnbPrice, setCurrentBnbPrice] = useState(null)
    const [currentSafeGasPrice, setCurrentSafeGasPrice] = useState(null)
    const [isTestnet, setIsTestnet] = useState(false)
    const [isWrongNetwork, setIsWrongNetwork] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
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
    const [metaIndexVaultBalance, setMetaIndexVaultBalance] = useState("")
    const [bluechipIndexVaultBalance, setBluechipIndexVaultBalance] = useState("")
    const [top10IndexVaultBalance, setTop10IndexVaultBalance] = useState("")
    const [vtop10IndexVaultBalance, setVtop10IndexVaultBalance] = useState("")
    const [top7IndexVaultBalance, setTop7IndexVaultBalance] = useState("")
    const [metaTokenTotalSupply, setMetaTokenTotalSupply] = useState()
    const [bluechipTokenTotalSupply, setBluechipTokenTotalSupply] = useState()
    const [top10TokenTotalSupply, setTop10TokenTotalSupply] = useState()
    const [vtop10TokenTotalSupply, setVtop10TokenTotalSupply] = useState()

    const bluechipIndexContractAddressMainnet = constants.bluechipIndexContractAddressMainnet
    const metaIndexContractAddressMainnet = constants.metaIndexContractAddressMainnet
    const top10IndexContractAddressMainnet = constants.top10IndexContractAddressMainnet
    const top10VenusContractAddressMainnet = constants.top10VenusContractAddressMainnet
    const top7IndexContractAddressTestnet = constants.top7IndexContractAddressTestnet
    const indexSwapAbi = indexSwap.abi

    const [metaTokens, setMetaTokens] = useState([
        ["Decentraland", "MANA", "0"],
        ["The Sandbox", "SAND", "0"],
        ["Axie Infinity", "AXS", "0"],
    ])
    const [bluechipTokens, setBluechipTokens] = useState([
        ["Bitcoin", "BTC", "0"],
        ["Ethereum", "ETH", "0"],
        ["XRP", "XRP", "0"],
        ["Cardano", "ADA", "0"],
        ["BNB", "BNB", "0"],
    ])
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
    const [vtop10Tokens, setVtop10Tokens] = useState([
        ["Bitcoin", "BTC", "0"],
        ["Ethereum", "ETH", "0"],
        ["BNB", "BNB", "0"],
        ["XRP", "XRP", "0"],
        ["Cardano", "ADA", "0"],
        ["Polkadot", "DOT", "0"],
        ["TRON", "TRX", "0"],
        ["PancakeSwap", "CAKE", "0"],
        ["Bitcoin Cash", "BCH", "0"],
        ["Filecoin", "FIL", "0"],
    ])
    const [top7Tokens, setTop7Tokens] = useState([
        ["Bitcoin", "BTC", "0"],
        ["Ethereum", "ETH", "0"],
        ["XRP", "XRP", "0"],
        ["Cardano", "ADA", "0"],
        ["Avalanche", "AVAX", "0"],
        ["Polkadot", "DOT", "0"],
        ["TRON", "TRX", "0"],
    ])

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

            //switch network to bsc-testnet
            await ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                    {
                        chainId: "0x61",
                        rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
                        chainName: "BSC Testnet",
                        nativeCurrency: {
                            name: "Binance",
                            symbol: "BNB",
                            decimals: 18,
                        },
                        blockExplorerUrls: ["https://testnet.bscscan.com"],
                    },
                ],
            })

            toggleHeaderDropdownMenu()
            const provider = getProviderOrSigner()
            const { chainId } = await provider.getNetwork()
            if (chainId === 97) {
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
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
                return
            }

            //switch network to bsc-mainnet
            await ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                    {
                        chainId: "0x38",
                        rpcUrls: ["https://bsc-dataseed.binance.org/"],
                        chainName: "BSC Main",
                        nativeCurrency: {
                            name: "Binance",
                            symbol: "BNB",
                            decimals: 18,
                        },
                        blockExplorerUrls: ["https://bscscan.com"],
                    },
                ],
            })
            if (showHeaderDropdownMenu) toggleHeaderDropdownMenu()
            const provider = getProviderOrSigner()
            const { chainId } = await provider.getNetwork()
            if (chainId === 56) {
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
                    if (chainId === 56) {
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

    async function checkNetwork() {
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
            const provider = getProviderOrSigner()
            const { chainId } = await provider.getNetwork()
            if (isTestnet) {
                if (chainId !== 97) {
                    //switch network to bsctest
                    await ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainId: "0x61",
                                rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
                                chainName: "BSC Testnet",
                                nativeCurrency: {
                                    name: "Binance",
                                    symbol: "BNB",
                                    decimals: 18,
                                },
                                blockExplorerUrls: ["https://testnet.bscscan.com"],
                            },
                        ],
                    })
                }
            } else {
                if (chainId !== 56) {
                    //switch network to bscmain
                    await ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainId: "0x38",
                                rpcUrls: ["https://bsc-dataseed.binance.org/"],
                                chainName: "BSC Main",
                                nativeCurrency: {
                                    name: "Binance",
                                    symbol: "BNB",
                                    decimals: 18,
                                },
                                blockExplorerUrls: ["https://bscscan.com"],
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
            //Getting BNB Balance
            const provider = getProviderOrSigner()
            const bnbBalance = utils.formatEther(await provider.getBalance(accountAddress))
            setBnbBalance(bnbBalance)

            //Getting Top7 Balance
            const contract = new Contract(top7IndexContractAddressTestnet, indexSwapAbi, provider)
            const top7Balance = utils.formatEther(await contract.balanceOf(accountAddress))
            setTop7IndexBalance(top7Balance)
            //Getting Top7 Vault Balance
            let top7IndexVaultBalance = utils.formatEther(
                (await contract.getTokenAndVaultBalance())[1]
            )
            //-!-!-!- there is some issue in contract side so we need to formatEther twice
            setTop7IndexVaultBalance(
                utils.formatEther(BigNumber.from(parseInt(top7IndexVaultBalance).toString()))
            )
            console.log("Top7 Vault Balance: ", top7IndexVaultBalance)
            //Getting Top7 Tokens Weight
            const tokensBalance = (await contract.getTokenAndVaultBalance())[0]
            let top7TokensInformation = top7Tokens
            tokensBalance.forEach((tokenBalance, index) => {
                top7TokensInformation[index][2] = (
                    (utils.formatEther(tokenBalance) / top7IndexVaultBalance) *
                    100
                ).toFixed(1)
            })
            top7TokensInformation.sort(function (a, b) {
                return b[2] - a[2]
            })
            setTop7Tokens(top7TokensInformation)
        } catch (err) {
            console.log(err)
        }
    }

    async function getBalancesMainnet(accountAddress) {
        try {
            //Getting BNB Balance
            const provider = new ethers.providers.JsonRpcProvider(
                "https://bsc-dataseed.binance.org/"
            )
            if (accountAddress !== "0x0000000000000000000000000000000000000000") {
                const bnbBalance = utils.formatEther(await provider.getBalance(accountAddress))
                setBnbBalance(bnbBalance)
            }

            //Getting META Balance
            const metaContract = new Contract(
                metaIndexContractAddressMainnet,
                indexSwapAbi,
                provider
            )
            const metaBalance = utils.formatEther(await metaContract.balanceOf(accountAddress))
            setMetaBalance(metaBalance)
            //Getting META Vault Balance
            const [metaTokensBalance, metaIndexVaultBalance] =
                await metaContract.getTokenAndVaultBalance()
            setMetaIndexVaultBalance(utils.formatEther(metaIndexVaultBalance))
            //Getting META Tokens Weight
            let metaTokensInformation = metaTokens
            metaTokensBalance.forEach((tokenBalance, index) => {
                metaTokensInformation[index][2] = (
                    (utils.formatEther(tokenBalance) / utils.formatEther(metaIndexVaultBalance)) *
                    100
                ).toFixed(1)
            })
            metaTokensInformation.sort(function (a, b) {
                return b[2] - a[2]
            })
            setMetaTokens(metaTokensInformation)

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

            //Getting VTOP10 Balance
            const vtop10Contract = new Contract(
                top10VenusContractAddressMainnet,
                indexSwapAbi,
                provider
            )
            const vtop10Balance = utils.formatEther(await vtop10Contract.balanceOf(accountAddress))
            setVtop10Balance(vtop10Balance)
            // Getting VTOP10 Vault Balance and Tokens Weights
            const venusTokenUnderlyingTokenAddresses = [
                "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c", // BTC
                "0x2170Ed0880ac9A755fd29B2688956BD959F933F8", // ETH
                "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", // WBNB
                "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE", // XRP
                "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47", // ADA
                "0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402", // DOT
                "0x85EAC5Ac2F758618dFa09bDbe0cf174e7d574D5B", // TRX
                "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", // CAKE
                "0x8fF795a6F4D97E7887C79beA79aba5cc76444aDf", // BCH
                "0x0D8Ce2A99Bb6e3B7Db580eD848240e4a0F9aE153", // FIL
            ]
            const venusTokenAddresses = [
                "0x882C173bC7Ff3b7786CA16dfeD3DFFfb9Ee7847B", // BTC
                "0xf508fCD89b8bd15579dc79A6827cB4686A3592c8", //ETH
                "0xA07c5b74C9B40447a954e1466938b865b6BBea36", //WBNB
                "0xB248a295732e0225acd3337607cc01068e3b9c10", // XRP
                "0x9A0AF7FDb2065Ce470D72664DE73cAE409dA28Ec", // ADA
                "0x1610bc33319e9398de5f57B33a5b184c806aD217", // DOT
                "0x61eDcFe8Dd6bA3c891CB9bEc2dc7657B3B422E93", // TRX
                "0x86aC3974e2BD0d60825230fa6F355fF11409df5c", // CAKE
                "0x5F0388EBc2B94FA8E123F404b79cCF5f40b29176", // BCH
                "0xf91d58b5aE142DAcC749f58A49FCBac340Cb0343", // FIL
            ]

            const balanceOfEachTokenInBNB = []
            let vtop10VaultBalanceInBNB = 0
            const top10VenusVaultAddress = "0x175D8654f8453626824412F0FB16F84B133BB443"
            const oracle = new Contract(
                "0x9c6Daa2CCc08CeD096fa01Bc87F80a057d839862",
                PriceOracle.abi,
                provider
            )
            let tokenContract
            for (let i = 0; i < 10; i++) {
                //Initialize contract for every token
                tokenContract = new Contract(venusTokenAddresses[i], VBep20Interface.abi, provider)
                //Getting underlying balance
                let tokenBalance = utils.formatEther(
                    await tokenContract.balanceOfUnderlying(top10VenusVaultAddress)
                )
                let priceToken
                if (venusTokenAddresses[i] === "0xA07c5b74C9B40447a954e1466938b865b6BBea36") {
                    vtop10VaultBalanceInBNB += parseFloat(tokenBalance)
                    balanceOfEachTokenInBNB.push(parseFloat(tokenBalance))
                } else {
                    priceToken =
                        (await oracle.getTokenPrice(
                            venusTokenUnderlyingTokenAddresses[i],
                            "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
                        )) / 1e18
                    //converting underlyling Asset Balance to BNB
                    let tokenBalanceBNB = priceToken * tokenBalance
                    balanceOfEachTokenInBNB.push(tokenBalanceBNB)
                    vtop10VaultBalanceInBNB += tokenBalanceBNB
                }
            }
            setVtop10IndexVaultBalance(vtop10VaultBalanceInBNB)
            //calculating VTOP10 Tokens Weight
            let vtop10TokensInformation = vtop10Tokens
            balanceOfEachTokenInBNB.forEach((tokenBalance, index) => {
                vtop10TokensInformation[index][2] = (
                    (tokenBalance / vtop10VaultBalanceInBNB) *
                    100
                ).toFixed(1)
            })
            vtop10TokensInformation.sort(function (a, b) {
                return b[2] - a[2]
            })
            setVtop10Tokens(vtop10TokensInformation)
        } catch (err) {
            console.log(err)
        }
    }

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

    async function invest(portfolioName, amountToInvest) {
        toggleCreateModal()
        setIsLoading(true)
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
                    setProgressModalInf(prevState => ({...prevState, show: false}))
                    setIsLoading(false)
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
                    setProgressModalInf(prevState => ({...prevState, show: false}))
                    setIsLoading(false)
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
            setIsLoading(false)
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
        setIsLoading(true)
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
                    setProgressModalInf(prevState => ({...prevState, show: false}))
                    setIsLoading(false)
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
                    setProgressModalInf(prevState => ({...prevState, show: false}))
                    setIsLoading(false)
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
            setProgressModalInf(prevState => ({...prevState, show: false}))
            setIsLoading(false)
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

        if (!isWalletConnected) getBalancesMainnet("0x0000000000000000000000000000000000000000")

        //fetching bnb price in USDT
        fetch("https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT")
            .then((res) => res.json())
            .then((data) => {
                const price = parseFloat(data.price)
                setCurrentBnbPrice(price)

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
                if (chainId === 56) setIsWrongNetwork(false)
                else if (chainId === 97) setIsTestnet(true)
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
                    bnbBalance={bnbBalance}
                    metaBalance={metaBalance}
                    bluechipBalance={bluechipBalance}
                    top10Balance={top10Balance}
                    top7Balance={top7IndexBalance}
                    vtop10Balance={vtop10Balance}
                    metaIndexVaultBalance={metaIndexVaultBalance}
                    bluechipIndexVaultBalance={bluechipIndexVaultBalance}
                    top10IndexVaultBalance={top10IndexVaultBalance}
                    vtop10IndexVaultBalance={vtop10IndexVaultBalance}
                    top7IndexVaultBalance={top7IndexVaultBalance}
                    metaTokenTotalSupply={metaTokenTotalSupply}
                    bluechipTokenTotalSupply={bluechipTokenTotalSupply}
                    top10TokenTotalSupply={top10TokenTotalSupply}
                    vtop10TokenTotalSupply={vtop10TokenTotalSupply}
                    currentBnbPrice={currentBnbPrice}
                    currentSafeGasPrice={currentSafeGasPrice}
                    portfolioName={createModalPortfolioName}
                    isLoading={isLoading}
                />

                <ProgressModal
                    show={progressModalInf.show}
                    asset1Name={progressModalInf.asset1Name}
                    asset1Amount={progressModalInf.asset1Amount}
                    asset2Name={progressModalInf.asset2Name}
                    asset2Amount={progressModalInf.asset2Amount}
                    transactionType={progressModalInf.transactionType}
                    currentBnbPrice={currentBnbPrice}
                    toggleProgessModal={toggleProgressModal}
                />

                <SuccessOrErrorMsgModal
                    show={successOrErrorModalInf.show}
                    portfolioName={successOrErrorModalInf.portfolioName}
                    transactionType={successOrErrorModalInf.transactionType}
                    amount={successOrErrorModalInf.amount}
                    txHash={successOrErrorModalInf.txHash}
                    status={successOrErrorModalInf.status}
                    currentBnbPrice={currentBnbPrice}
                    toggleSuccessOrErrorMsgModal={toggleSuccessOrErrorMsgModal}
                />

            </CreateModalState>


            <Header
                toggleConnectWalletModal={toggleConnectWalletModal}
                toggleHeaderDropdownMenu={toggleHeaderDropdownMenu}
                showHeaderDropdownMenu={showHeaderDropdownMenu}
                isWalletConnected={isWalletConnected}
                currentAccount={currentAccount}
                bnbBalance={bnbBalance}
                totalUserValue={
                    parseFloat(bluechipBalance) +
                    parseFloat(metaBalance) +
                    parseFloat(top10Balance) +
                    parseFloat(vtop10Balance)
                }
                currentBnbPrice={currentBnbPrice}
                isTestnet={isTestnet}
                isWrongNetwork={isWrongNetwork}
                switchToMainnet={switchToMainnet}
                switchToTestnet={switchToTestnet}
                disconnectWallet={disconnectWallet}
            />

            <h2 className="title fn-lg">Community Portfolios</h2>

            <div className="container">
                {isTestnet ? (
                    <PortfolioBox
                        flipHandler={portfolioBoxesflipHandler}
                        portfolioBoxSide={portfolioBox1FlipHandler}
                        logo={VelvetCapitalLogo}
                        title="TOP 7"
                        portfolioName="TOP7"
                        creator="Test"
                        tippyContent="Top 7 Cryptocurrencies by Total Market Capitalization, Equally weighted (excluding stablecoins)"
                        assetsImg={BluechipAssetsImg}
                        indexTokenBalance={top7IndexBalance}
                        currentBnbPrice={currentBnbPrice}
                        numberOfInvestors="7,534"
                        indexVaultBalance={top7IndexVaultBalance}
                        tokens={top7Tokens}
                        isWalletConnected={isWalletConnected}
                        toggleConnectWalletModal={toggleConnectWalletModal}
                        toggleCreateModal={toggleCreateModal}
                    />
                ) : (
                    <>
                        <PortfolioBox
                            flipHandler={portfolioBoxesflipHandler}
                            portfolioBoxSide={portfolioBox1FlipHandler}
                            logo={VelvetCapitalLogo}
                            title="Blue Chip"
                            portfolioName="BLUECHIP"
                            creator="Test"
                            tippyContent="Top 5 Cryptocurrencies by Total Market Capitalization, Equally weighted (excluding stablecoins)"
                            assetsImg={BluechipAssetsImg}
                            indexTokenBalance={bluechipBalance}
                            currentBnbPrice={currentBnbPrice}
                            numberOfInvestors="10,534"
                            indexVaultBalance={bluechipIndexVaultBalance}
                            tokens={bluechipTokens}
                            isWalletConnected={isWalletConnected}
                            toggleConnectWalletModal={toggleConnectWalletModal}
                            toggleCreateModal={toggleCreateModal}
                        />

                        <PortfolioBox
                            flipHandler={portfolioBoxesflipHandler}
                            portfolioBoxSide={portfolioBox2FlipHandler}
                            logo={MetaverseLogo}
                            title="Metaverse"
                            portfolioName="META"
                            creator="Test"
                            tippyContent="Top 4 Tokens from the Metaverse sector on BNB chain by Total Market Capitalization, Equally weighted"
                            assetsImg={MetaverseAssetsImg}
                            indexTokenBalance={metaBalance}
                            currentBnbPrice={currentBnbPrice}
                            numberOfInvestors="8,471"
                            indexVaultBalance={metaIndexVaultBalance}
                            tokens={metaTokens}
                            isWalletConnected={isWalletConnected}
                            toggleConnectWalletModal={toggleConnectWalletModal}
                            toggleCreateModal={toggleCreateModal}
                        />

                        <PortfolioBox
                            flipHandler={portfolioBoxesflipHandler}
                            portfolioBoxSide={portfolioBox4FlipHandler}
                            logo={VenusLogo}
                            title="Yield By Venus"
                            portfolioName="VTOP10"
                            creator="Test"
                            tippyContent="Yield generating portfolio powered by Venus"
                            assetsImg={VenusAssestsImg}
                            indexTokenBalance={vtop10Balance}
                            currentBnbPrice={currentBnbPrice}
                            numberOfInvestors="5,237"
                            indexVaultBalance={vtop10IndexVaultBalance}
                            tokens={vtop10Tokens}
                            isWalletConnected={isWalletConnected}
                            toggleConnectWalletModal={toggleConnectWalletModal}
                            toggleCreateModal={toggleCreateModal}
                        />

                        <PortfolioBox
                            flipHandler={portfolioBoxesflipHandler}
                            portfolioBoxSide={portfolioBox3FlipHandler}
                            logo={VelvetCapitalLogo2}
                            title="Top10"
                            portfolioName="TOP10"
                            creator="Test"
                            tippyContent="Top 10 Cryptocurrencies by Total Market Capitalization, Equally weighted (excluding stablecoins)"
                            assetsImg={Top10AssestsImg}
                            indexTokenBalance={top10Balance}
                            currentBnbPrice={currentBnbPrice}
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
