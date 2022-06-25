import React, { useState, useContext, useEffect} from "react"
import { BigNumber, utils } from "ethers"
import "./CreateModal.css"

import CreateModalContext from "../../context/CreateModal/CreateModalContext"

import CrossImg from "../../assets/img/cross.svg"
import VelvetCapitalLogo from "../../assets/img/newvelvetcapitallogo.svg"
import VelvetCapitalLogo2 from "../../assets/img/velvetcapitallogo2.svg"
import MetaverseLogo from "../../assets/img/metaverse.svg"
import MaticImg from "../../assets/img/matic.png"

import formatDecimal from "../../utils/formatDecimal"

function CreateModal(props) {
    const [amount, setAmount] = useState(BigNumber.from(0))
    const [hasEnoughFunds, setHasEnoughFunds] = useState(true)
    const [rateOfIndexToken, setRateOfIndexToken] = useState(0);

    const {_, updateRateOfIndexToken} = useContext(CreateModalContext)

    let indexTokenBalance
    let indexTokenVaultBalance
    let indexTokenTotalSupply

    if (props.portfolioName === "TOP10") {
        indexTokenBalance = props.top10Balance
        indexTokenVaultBalance = props.top10IndexVaultBalance
        indexTokenTotalSupply = props.top10TokenTotalSupply
    }
    else if(props.portfolioName === "TOP5D") {
        indexTokenBalance = props.top5DefiBalance 
        indexTokenVaultBalance = props.top5DefiIndexVaultBalance
    }
    else if(props.portfolioName === "META") {
        indexTokenBalance = props.metaBalance 
        indexTokenVaultBalance = props.metaIndexVaultBalance
    }

    useEffect(() => {
        if (indexTokenTotalSupply && indexTokenVaultBalance) {
            let rate = indexTokenVaultBalance / indexTokenTotalSupply
            setRateOfIndexToken(rate)
            updateRateOfIndexToken(rate)
        }
    }, [indexTokenVaultBalance, indexTokenTotalSupply])

    function checkHasEnoughFunds(amount, fund) {
        if (parseFloat(amount) > parseFloat(fund)) setHasEnoughFunds(false)
        else setHasEnoughFunds(true)
    }

    const createModalTitle = {
        TOP10: "TOP10",
        TOP5D: "Top 5 DEFI",
        META: "Metaverse"
    }

    const createModalImg = {
        TOP10: VelvetCapitalLogo2,
        TOP5D: VelvetCapitalLogo,
        META: MetaverseLogo
    }

    const gasRequiredForInvest = {
        TOP10: 1660000,
        TOP5D: 1000000,
        META: 1000000
    }

    const gasRequiredForWithdraw = {
        TOP10: 1600000,
        TOP5D: 900000,
        META: 900000
    }

    let portfolioInvestGasFee, portofolioWithdrawGasFee
    if (props.currentSafeGasPrice) {
        portfolioInvestGasFee = parseFloat(
            utils.formatEther(utils.parseUnits(props.currentSafeGasPrice, "gwei")) *
                gasRequiredForInvest[props.portfolioName] *
                props.currentMaticPrice
        ).toFixed(2)
        portofolioWithdrawGasFee = parseFloat(
            utils.formatEther(utils.parseUnits(props.currentSafeGasPrice, "gwei")) *
                gasRequiredForWithdraw[props.portfolioName] *
                props.currentMaticPrice
        ).toFixed(2)
    }

    if (!props.show) return null

    return (
        <>
            <div
                className="overlay"
                onClick={() => {
                    setAmount(BigNumber.from(0))
                    setHasEnoughFunds(true)
                    props.toggleModal()
                }}
            ></div>
            <div className="modal create-modal">
                <img
                    src={CrossImg}
                    alt=""
                    id="create-modal-cancle"
                    className="cursor-pointer"
                    onClick={() => {
                        setAmount(BigNumber.from(0))
                        setHasEnoughFunds(true)
                        props.toggleModal()
                    }}
                />

                <div className="create-modal-details">
                    <img src={createModalImg[props.portfolioName]} alt="" id="create-modal-logo" />
                    <span>{createModalTitle[props.portfolioName]}</span>
                </div>
                <div className="create-modal-action-tab flex">
                    <div
                        className="cursor-pointer"
                        onClick={() => {
                            props.toggleCreateModalTab()
                            checkHasEnoughFunds(amount.toString(), props.maticBalance)
                        }}
                    >
                        <span className={props.createModalTab === "redeem" && "unactive"}>
                            Deposit
                        </span>
                        <div
                            className={`line ${props.createModalTab === "create" && "active"}`}
                        ></div>
                    </div>
                    <div
                        className="cursor-pointer"
                        onClick={() => {
                            props.toggleCreateModalTab()
                            checkHasEnoughFunds(amount.toString(), indexTokenBalance)
                        }}
                    >
                        <span className={props.createModalTab === "create" && "unactive"}>
                            Withdraw
                        </span>
                        <div
                            className={`line ${props.createModalTab === "redeem" && "active"}`}
                        ></div>
                    </div>
                </div>

                <div className="create-modal-inputs flex">
                    <div className="create-modal-token-input">
                        <span className="fn-sm">Token</span>
                        <div className="create-modal-asset-dropdown flex">
                            {props.createModalTab === "create" ? (
                                <>
                                    <img src={MaticImg} alt="" />
                                    <span
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: 500,
                                            color: "#262626",
                                        }}
                                    >
                                        MATIC
                                    </span>
                                </>
                            ) : (
                                <span
                                    style={{ fontSize: "16px", fontWeight: 500, color: "#262626" }}
                                >
                                    {props.portfolioName}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="create-modal-amount-input">
                        {hasEnoughFunds ? (
                            <span className="fn-sm">Amount</span>
                        ) : (
                            <span className="c-red fn-sm">Not enough funds</span>
                        )}
                        <span className="fn-sm create-modal-amount-input-balance">
                            ~ $
                            {props.createModalTab === "create"
                                ? (amount * props.currentMaticPrice).toLocaleString("en-US", {
                                      maximumFractionDigits: 2,
                                  })
                                : (amount * rateOfIndexToken * props.currentMaticPrice ).toLocaleString("en-US", {
                                      maximumFractionDigits: 2,
                                  })}
                        </span>
                        <input
                            type="number"
                            className={hasEnoughFunds ? "block" : "block border-red"}
                            placeholder={
                                props.createModalTab === "create"
                                    ? "max " + formatDecimal(props.maticBalance) + " MATIC"
                                    : "max " +
                                      formatDecimal(indexTokenBalance) +
                                      " " +
                                      props.portfolioName
                            }
                            value={amount == "0" ? null : amount}
                            onChange={(e) => {
                                e.target.value <= 1000000000 && setAmount(e.target.value)
                                if (props.createModalTab === "create") {
                                    checkHasEnoughFunds(e.target.value, props.bnbBalance)
                                } else {
                                    checkHasEnoughFunds(e.target.value, indexTokenBalance)
                                }
                            }}
                        />
                    </div>
                </div>

                <p className="c-grey fn-sm" style={{ textAlign: "right", marginTop: "8px", marginBottom: "25px" }}>
                    Estimated Gas Fee:{" "}
                        $
                        {props.createModalTab === "create"
                            ? portfolioInvestGasFee
                            : portofolioWithdrawGasFee}
                </p>

                {props.createModalTab === "redeem" && hasEnoughFunds && (
                    <span
                        className="create-modal-max-btn cursor-pointer"
                        onClick={() => setAmount(indexTokenBalance.slice(0, -7))}
                    >
                        max
                    </span>
                )}

                {props.createModalTab === "create" ? (
                    <p className="create-modal-inf font-normal fn-sm text-center c-purple">
                        You will get ~ {amount.toString()} {props.portfolioName} tokens representing
                        your basket
                    </p>
                ) : (
                    <p className="create-modal-inf font-normal fn-sm text-center c-purple">
                        You will get ~ {(amount.toString() * rateOfIndexToken).toFixed(5)} MATIC
                    </p>
                )}

                <button
                    className="create-modal-action-btn btn fn-md"
                    data-portfolio-name={props.portfolioName}
                    disabled={!hasEnoughFunds || parseFloat(amount.toString()) === 0}
                    style={hasEnoughFunds && parseFloat(amount.toString()) > 0 && amount.toString() !== "" ? { opacity: 1 } : { opacity: 0.5 }}
                    onClick={
                        props.createModalTab === "create"
                            ? () => {
                                setAmount(BigNumber.from(0))
                                props.invest(
                                    props.portfolioName,
                                    utils.parseEther(amount.toString())
                                )
                            }
                            : () => {
                                setAmount(BigNumber.from(0))
                                props.withdraw(
                                    props.portfolioName,
                                    utils.parseEther(amount.toString())
                                )
                            }
                    }
                >
                    {props.createModalTab === "create"
                        ? "Deposit"
                        : "Withdraw"}
                </button>

            </div>
        </>
    )
}

export default CreateModal
