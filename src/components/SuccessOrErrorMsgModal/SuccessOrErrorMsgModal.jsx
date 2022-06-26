import React, { useContext } from "react"
import "./SuccessOrErrorMsgModal.css"

import CreateModalContext from "../../context/CreateModal/CreateModalContext"

import CrossImg from "../../assets/img/cross.svg"
import SuccessImg from "../../assets/img/success-mark.svg"
import ErrorImg from "../../assets/img/error-mark.svg"
import MaticImg from "../../assets/img/matic.png"
import VelvetCapitalLogo from "../../assets/img/newvelvetcapitallogo.svg"
import MetaverseLogo from "../../assets/img/metaverse.svg"
import StraightLine from "../../assets/img/straightline.svg"
import Circle from "../../assets/img/circle.svg"

import * as constants from "../../utils/constants.js"

function SuccessOrErrorMsgModal(props) {
    const { rateOfIndexToken } = useContext(CreateModalContext)

    const tokensAddress = {
        TOP5D: constants.top5DefiIndexContractAddressMainnet,
        META: constants.metaIndexContractAddressMainnet
    }

    const indexTokensImg = {
        META: MetaverseLogo,
        TOP5D: VelvetCapitalLogo,
    }

    async function addTokenToWallet(tokenAddress, tokenSymbol) {
        try {
            //adding token to metamask wallet
            await window.ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20",
                    options: {
                        address: tokenAddress,
                        symbol: tokenSymbol,
                        decimals: 18,
                    },
                },
            })
        } catch (err) {
            console.log(err)
        }
    }

    if (!props.show) return null

    return (
        <>
            <div className="overlay" onClick={props.toggleSuccessOrErrorMsgModal}></div>
            <div className="modal success-or-error-msg-modal">
                <img
                    src={CrossImg}
                    alt=""
                    id="success-or-error-msg-modal-cancle"
                    className="cursor-pointer"
                    onClick={props.toggleSuccessOrErrorMsgModal}
                />
                {props.status == 0 ? (
                    <>
                        {/* {props.transactionType === "invest" ? (
                            <>
                                <div className="success-or-error-msg-modal-invested-or-redeemed-amount">
                                    <p className="c-purple">{props.amount} MATIC</p>
                                    <p className="text-center fn-sm c-grey">
                                        ~${" "}
                                        {(props.amount * props.currentMaticPrice).toLocaleString(
                                            "en-US",
                                            { maximumFractionDigits: 1 }
                                        )}
                                    </p>
                                </div>
                                <p className="success-or-error-msg-modal-received-amount c-purple">
                                    ~{(props.amount / rateOfIndexToken).toFixed(4)} {props.portfolioName}
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="success-or-error-msg-modal-invested-or-redeemed-amount">
                                    <p className="c-purple">
                                        {props.amount} {props.portfolioName}
                                    </p>
                                    <p className="text-center fn-sm c-grey">
                                        ~${" "}
                                        {(
                                            props.amount *
                                            rateOfIndexToken *
                                            props.currentMaticPrice
                                        ).toLocaleString("en-US", { maximumFractionDigits: 1 })}
                                    </p>
                                </div>
                                <p className="success-or-error-msg-modal-received-amount c-purple">
                                    ~{(props.amount * rateOfIndexToken).toFixed(4)} MATIC
                                </p>
                            </>
                        )} */}

                        <div className="success-or-error-msg-modal-details flex">
                            {/* <div>
                                {props.transactionType === "invest" ? (
                                    <img src={MaticImg} alt="" style={{ width: "50px" }} />
                                ) : (
                                    <img
                                        src={indexTokensImg[props.portfolioName]}
                                        alt=""
                                        style={{ width: "50px" }}
                                    />
                                )}
                            </div> */}
                            <div>
                                <img src={SuccessImg} alt="" style={{ width: "64px"}} />
                            </div>
                            {/* <div>
        
                                {props.transactionType !== "invest" ? (
                                    <img src={MaticImg} alt="" style={{ width: "50px" }} />
                                ) : (
                                    <img
                                        src={indexTokensImg[props.portfolioName]}
                                        alt=""
                                        style={{ width: "50px" }}
                                    />
                                )}
                            </div> */}
                        </div>

                        <h2
                            className="success-or-error-msg-modal-title text-center"
                            style={{ fontSize: "30px", color: "green"  }}
                        >
                            Success!
                        </h2>
                        {props.transactionType === "invest" ? (
                            <>
                                <p className="success-or-error-msg-modal-message text-center fn-md">
                                    You have successfully deposited {props.amount} MATIC (~$
                                    {(props.amount * props.currentMaticPrice).toLocaleString(
                                        "en-US",
                                        { maximumFractionDigits: 1 }
                                    )}
                                    ) in {props.portfolioName} portfolio
                                </p>
                                <p
                                    className="success-or-error-msg-modal-message text-center fn-md cursor-pointer"
                                    onClick={() =>
                                        addTokenToWallet(
                                            tokensAddress[props.portfolioName],
                                            props.portfolioName
                                        )
                                    }
                                    style={{ margin: "20px 0" }}
                                >
                                    <u>
                                        Click here to Add <b>{props.portfolioName}</b> Token to your
                                        wallet
                                    </u>
                                </p>
                            </>
                        ) : (
                            <p className="success-or-error-msg-modal-message text-center fn-md">
                                You have successfully redeemed {props.amount} {props.portfolioName}{" "}
                                from portfolio
                            </p>
                        )}
                        <button
                            className="btn success-or-error-msg-modal-btn fn-md font-bold"
                            onClick={props.toggleSuccessOrErrorMsgModal}
                        >
                            Back to portfolios
                        </button>
                    </>
                ) : (
                    <>
                        {/* {props.transactionType === "invest" ? (
                            <>
                                <div className="success-or-error-msg-modal-invested-or-redeemed-amount">
                                    <p className="c-purple">{props.amount} MATIC</p>
                                    <p className="text-center fn-sm c-grey">
                                        ~${" "}
                                        {(props.amount * props.currentMaticPrice).toLocaleString(
                                            "en-US",
                                            { maximumFractionDigits: 1 }
                                        )}
                                    </p>
                                </div>
                                <p className="success-or-error-msg-modal-received-amount c-purple">
                                    ~{(props.amount / rateOfIndexToken).toFixed(4)} {props.portfolioName}
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="success-or-error-msg-modal-invested-or-redeemed-amount">
                                    <p className="c-purple">
                                        {props.amount} {props.portfolioName}
                                    </p>
                                    <p className="text-center fn-sm c-grey">
                                        ~${" "}
                                        {(
                                            props.amount *
                                            rateOfIndexToken *
                                            props.currentMaticPrice
                                        ).toLocaleString("en-US", { maximumFractionDigits: 1 })}
                                    </p>
                                </div>
                                <p className="success-or-error-msg-modal-received-amount c-purple">
                                    ~{(props.amount * rateOfIndexToken).toFixed(4)} MATIC
                                </p>
                            </>
                        )} */}

                        <div className="success-or-error-msg-modal-details flex">
                    
                            {/* <div>
                                {props.transactionType === "invest" ? (
                                    <img src={MaticImg} alt="" style={{ width: "50px" }} />
                                ) : (
                                    <img
                                        src={indexTokensImg[props.portfolioName]}
                                        alt=""
                                        style={{ width: "50px" }}
                                    />
                                )}
                            </div> */}
                            <div>
                                <img src={ErrorImg} alt="" style={{ width: "64px" }} />
                            </div>
                            {/* <div>
                                {props.transactionType !== "invest" ? (
                                    <img src={MaticImg} alt="" style={{ width: "50px" }} />
                                ) : (
                                    <img
                                        src={indexTokensImg[props.portfolioName]}
                                        alt=""
                                        style={{ width: "50px" }}
                                    />
                                )}
                            </div> */}
                        </div>
                        <h2
                            className="success-or-error-msg-modal-title text-center"
                            style={{ fontSize: "30px", color: "red"}}
                        >
                            Error!
                        </h2>
                        <p
                            className="success-or-error-msg-modal-message text-center fn-md"
                            style={{ margin: "35px 0" }}
                        >
                            Looks like this transaction has failed, it happens sometimes due to
                            network congestion, please try again
                        </p>
                        <button
                            className="btn success-or-error-msg-modal-btn fn-md font-bold"
                            onClick={props.toggleSuccessOrErrorMsgModal}
                        >
                            Try again
                        </button>
                    </>
                )}

                <a
                    className="success-or-error-msg-modal-blockexplorer-link"
                    // `https://dashboard.tenderly.co/tx/polygon/${props.txHash}`
                    href={`https://polygonscan.com/tx/${props.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                >
                    <p className="text-center font-semibold"> View Txn On Polyscan </p>
                    {/* <p className="text-center font-semibold"> View Txn On Tenderly </p> */}
                </a>
            </div>
        </>
    )
}

export default SuccessOrErrorMsgModal
