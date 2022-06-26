import React, {useState, useRef} from "react";
import axios from "axios";
import { providers } from "ethers";
import "./SwapModal.css"

function SwapModal(props) {

    const [selectedAsset, setSelectedAsset] = useState("USDT")
    const inputRef = useRef(null)

    function handleAssetChange(e) {
        setSelectedAsset(e.target.value)
        console.log(e.target.value)
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

    async function checkAllowanceToken(tokenAddress) {
        const checkAllowanceApi = 'https://api.1inch.io/v4.0/137/approve/allowance';
        const signer = getProviderOrSigner(true)
        const accountAddress = await signer.getAddress()
        let allowance;
        await axios.get(checkAllowanceApi, {
            params: {
                tokenAddress: tokenAddress,
                walletAddress: accountAddress
            }
        })
        .then(function (response) {
            allowance = response.data.allowance
        })
        console.log(allowance)
        return allowance;
    }

    async function giveAllowance(tokenAddress) {
        const giveAllowanceApi = 'https://api.1inch.io/v4.0/137/approve/transaction';
        const signer = getProviderOrSigner(true)
        const accountAddress = await signer.getAddress()
        console.log(accountAddress) 
        let allowanceData;
        await axios.get(giveAllowanceApi, {
            params: {
                tokenAddress: tokenAddress,
            }
        }).then(function (response) {
            allowanceData = response.data
            console.log(allowanceData)
        })
        console.log(allowanceData)
        const sign = await signer.sendTransaction({
            from: accountAddress,
            data: allowanceData.data,
            gasPrice: allowanceData.gasPrice,
            to: allowanceData.to,
            value: allowanceData.value
        })
    }

    async function swap() {
        try {
            const swapApi = 'https://api.1inch.io/v4.0/137/swap';
            const MATIC_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
            const signer = getProviderOrSigner(true)
            const accountAddress = await signer.getAddress()
            let fromTokenAddress;
    
            if(selectedAsset === "USDT")
                fromTokenAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
            else 
                fromTokenAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
    
            if(await checkAllowanceToken(fromTokenAddress) === "0") {
                await giveAllowance(fromTokenAddress)
            }
            let amountToSwap = (inputRef.current.value * 1000000).toString()
            const swapParams = {
                fromTokenAddress: fromTokenAddress, 
                toTokenAddress: MATIC_ADDRESS,
                amount: amountToSwap,
                fromAddress: accountAddress,
                slippage: 1,
                disableEstimate: false,
                allowPartialFill: false,
            };

            let swapData;
            await axios.get(swapApi, { params: swapParams }).then(function (response) {
                swapData = response.data.tx;
            });
        
            console.log(swapData)
            await signer.sendTransaction(swapData)
            alert(`Swaped ${inputRef.current.value} ${selectedAsset} To MATIC`)
            
            console.log(`Swapping ${inputRef.current.value} ${selectedAsset} To MATIC`)
        }
        catch(err) {
            console.log(err)
        }
    }

    if (!props.show) return false

    return (
        <>
            <div className="overlay" onClick={() => props.toggleSwapModal()}></div>
            <div className="modal swap-modal">
                <p className="text-center fn-lg" style={{margin: "25px 0px"}}>Swap Tokens To MATIC</p>
                <label htmlFor="assets" className="fn-md" style={{marginRight: "20px"}}>Choose asset:</label>
                <select className="swap-modal-asset-dropdown" name="assets" id="assets" onChange={(e) => handleAssetChange(e)}>
                    <option value="USDT">USDT</option>
                    <option value="USDC">USDC</option>
                </select>
                <br />
                <input type="number" ref={inputRef} className="fn-md horizontally-centred swap-modal-input-amount" placeholder="Amount to Swap" />
                <button className="btn fn-md" onClick={() => swap()}>Swap To MATIC</button>
            </div>
        </>

    )
}

export default SwapModal
