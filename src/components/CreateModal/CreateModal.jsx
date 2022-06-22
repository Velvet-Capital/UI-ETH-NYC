import React, { useState, useContext} from "react"
import { BigNumber, utils } from "ethers"
import { BeatLoader } from "react-spinners"
import "./CreateModal.css"

import CreateModalContext from "../../context/CreateModal/CreateModalContext"

import CrossImg from "../../assets/img/cross.svg"
import VelvetCapitalLogo from "../../assets/img/newvelvetcapitallogo.svg"
import VelvetCapitalLogo2 from "../../assets/img/velvetcapitallogo2.svg"
import MetaverseLogo from "../../assets/img/metaverse.svg"
import VenusLogo from "../../assets/img/venuslogo.png"
import BnbImg from "../../assets/img/bnb.png"

import formatDecimal from "../../utils/formatDecimal"

function CreateModal(props) {
    const [amount, setAmount] = useState(BigNumber.from(0))
    const [hasEnoughFunds, setHasEnoughFunds] = useState(true)

    const {_, updateRateOfIndexToken} = useContext(CreateModalContext)

    let indexTokenBalance
    let indexTokenVaultBalance
    let indexTokenTotalSupply

    if (props.portfolioName === "META") {
        indexTokenBalance = props.metaBalance
        indexTokenVaultBalance = props.metaIndexVaultBalance
        indexTokenTotalSupply = props.metaTokenTotalSupply
    } else if (props.portfolioName === "BLUECHIP") {
        indexTokenBalance = props.bluechipBalance
        indexTokenVaultBalance = props.bluechipIndexVaultBalance
        indexTokenTotalSupply = props.bluechipTokenTotalSupply
    } else if (props.portfolioName === "TOP10") {
        indexTokenBalance = props.top10Balance
        indexTokenVaultBalance = props.top10IndexVaultBalance
        indexTokenTotalSupply = props.top10TokenTotalSupply
    } else if (props.portfolioName === "TOP7") {
        indexTokenBalance = props.top7Balance
        indexTokenVaultBalance = props.top7IndexVaultBalance
    } else if (props.portfolioName === "VTOP10") {
        indexTokenBalance = props.vtop10Balance
        indexTokenVaultBalance = props.vtop10IndexVaultBalance
        indexTokenTotalSupply = props.vtop10TokenTotalSupply
    }
    let rateOfIndexToken = 0
    if (indexTokenTotalSupply && indexTokenVaultBalance) {
        rateOfIndexToken = indexTokenVaultBalance / indexTokenTotalSupply
        updateRateOfIndexToken(rateOfIndexToken)
    }

    function checkHasEnoughFunds(amount, fund) {
        if (parseFloat(amount) > parseFloat(fund)) setHasEnoughFunds(false)
        else setHasEnoughFunds(true)
    }

    const createModalTitle = {
        META: "Metaverse",
        BLUECHIP: "Bluechip",
        TOP10: "TOP10",
        TOP7: "TOP7",
        VTOP10: "Yield By Venus",
    }

    const createModalImg = {
        META: MetaverseLogo,
        BLUECHIP: VelvetCapitalLogo,
        TOP10: VelvetCapitalLogo2,
        TOP7: VelvetCapitalLogo,
        VTOP10: VenusLogo,
    }

    const gasRequiredForInvest = {
        META: 650000,
        BLUECHIP: 900000,
        TOP10: 1660000,
        VTOP10: 4595971,
        TOP7: 900000,
    }

    const gasRequiredForWithdraw = {
        META: 600000,
        BLUECHIP: 800000,
        TOP10: 1600000,
        VTOP10: 4200000,
        TOP7: 800000,
    }

    let portfolioInvestGasFee, portofolioWithdrawGasFee
    if (props.currentSafeGasPrice) {
        portfolioInvestGasFee = parseFloat(
            utils.formatEther(utils.parseUnits(props.currentSafeGasPrice, "gwei")) *
                gasRequiredForInvest[props.portfolioName] *
                props.currentBnbPrice
        ).toFixed(2)
        portofolioWithdrawGasFee = parseFloat(
            utils.formatEther(utils.parseUnits(props.currentSafeGasPrice, "gwei")) *
                gasRequiredForWithdraw[props.portfolioName] *
                props.currentBnbPrice
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
                            checkHasEnoughFunds(amount.toString(), props.bnbBalance)
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
                                    <img src={BnbImg} alt="" />
                                    <span
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: 500,
                                            color: "#262626",
                                        }}
                                    >
                                        BNB
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
                                ? (amount * props.currentBnbPrice).toLocaleString("en-US", {
                                      maximumFractionDigits: 2,
                                  })
                                : (amount * props.currentBnbPrice).toLocaleString("en-US", {
                                      maximumFractionDigits: 2,
                                  })}
                        </span>
                        <input
                            type="number"
                            className={hasEnoughFunds ? "block" : "block border-red"}
                            placeholder={
                                props.createModalTab === "create"
                                    ? "max " + formatDecimal(props.bnbBalance) + " BNB"
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
                        You will get ~ {(amount.toString() * rateOfIndexToken).toFixed(5)} BNB
                    </p>
                )}

                <button
                    className="create-modal-action-btn btn fn-md flex"
                    data-portfolio-name={props.portfolioName}
                    disabled={!hasEnoughFunds || props.isLoading || amount.toString() === "0"}
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
                    {props.isLoading && props.createModalTab === "create"
                        ? "Investing"
                        : props.isLoading && props.createModalTab === "redeem"
                        ? "Withdrawing"
                        : props.createModalTab === "create"
                        ? "Deposit"
                        : "Withdraw"}
                    <BeatLoader loading={props.isLoading} size={16} color="white" />
                </button>

                <p className="c-purple fn-sm" style={{ textAlign: "right" }}>
                    Estimated Gas Fee:{" "}
                    <b>
                        $
                        {props.createModalTab === "create"
                            ? portfolioInvestGasFee
                            : portofolioWithdrawGasFee}
                    </b>
                </p>
            </div>
        </>
    )
}

export default CreateModal
