import React, { useContext } from "react"
import "./SuccessOrErrorMsgModal.css"

import CreateModalContext from "../../context/CreateModal/CreateModalContext"

import CrossImg from "../../assets/img/cross.svg"
import SuccessImg from "../../assets/img/success-mark.svg"
import ErrorImg from "../../assets/img/error-mark.svg"
import BnbImg from "../../assets/img/bnb.png"
import VelvetCapitalLogo from "../../assets/img/newvelvetcapitallogo.svg"
import VelvetCapitalLogo2 from "../../assets/img/velvetcapitallogo2.svg"
import MetaverseLogo from "../../assets/img/metaverse.svg"
import VenusLogo from "../../assets/img/venuslogo.png"
import StraightLine from "../../assets/img/straightline.svg"
import Circle from "../../assets/img/circle.svg"

import * as constants from "../../utils/constants.js"

function SuccessOrErrorMsgModal(props) {
    const { rateOfIndexToken } = useContext(CreateModalContext)
    console.log(rateOfIndexToken)

    const tokensAddress = {
        BLUECHIP: constants.bluechipIndexContractAddressMainnet,
        META: constants.metaIndexContractAddressMainnet,
        TOP10: constants.top10IndexContractAddressMainnet,
        VTOP10: constants.top10VenusContractAddressMainnet,
        TOP7: constants.top7IndexContractAddressTestnet,
    }

    const indexTokensImg = {
        META: MetaverseLogo,
        BLUECHIP: VelvetCapitalLogo,
        TOP10: VelvetCapitalLogo2,
        TOP7: VelvetCapitalLogo,
        VTOP10: VenusLogo,
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
                        {props.transactionType === "invest" ? (
                            <>
                                <div className="success-or-error-msg-modal-invested-or-redeemed-amount">
                                    <p className="c-purple">{props.amount} BNB</p>
                                    <p className="text-center fn-sm c-grey">
                                        ~${" "}
                                        {(props.amount * props.currentBnbPrice).toLocaleString(
                                            "en-US",
                                            { maximumFractionDigits: 1 }
                                        )}
                                    </p>
                                </div>
                                <p className="success-or-error-msg-modal-received-amount c-purple">
                                    ~{props.amount} {props.portfolioName}
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
                                            props.currentBnbPrice
                                        ).toLocaleString("en-US", { maximumFractionDigits: 1 })}
                                    </p>
                                </div>
                                <p className="success-or-error-msg-modal-received-amount c-purple">
                                    ~{(props.amount * rateOfIndexToken).toFixed(4)} BNB
                                </p>
                            </>
                        )}

                        <div className="success-or-error-msg-modal-details flex">
                            <img
                                src={StraightLine}
                                alt=""
                                style={{ position: "absolute", zIndex: -1 }}
                            />
                            <div>
                                <img
                                    src={Circle}
                                    alt=""
                                    style={{ position: "absolute", right: "-20%", top: "-18%" }}
                                />
                                {props.transactionType === "invest" ? (
                                    <img src={BnbImg} alt="" style={{ width: "50px" }} />
                                ) : (
                                    <img
                                        src={indexTokensImg[props.portfolioName]}
                                        alt=""
                                        style={{ width: "50px" }}
                                    />
                                )}
                            </div>
                            <div>
                                <img src={SuccessImg} alt="" style={{ width: "64px" }} />
                            </div>
                            <div>
                                <img
                                    src={Circle}
                                    alt=""
                                    style={{ position: "absolute", left: "-20%", top: "-18%" }}
                                />
                                {props.transactionType !== "invest" ? (
                                    <img src={BnbImg} alt="" style={{ width: "50px" }} />
                                ) : (
                                    <img
                                        src={indexTokensImg[props.portfolioName]}
                                        alt=""
                                        style={{ width: "50px" }}
                                    />
                                )}
                            </div>
                        </div>

                        <h2
                            className="success-or-error-msg-modal-title c-purple text-center"
                            style={{ fontSize: "30px" }}
                        >
                            Success!
                        </h2>
                        {props.transactionType === "invest" ? (
                            <>
                                <p className="success-or-error-msg-modal-message c-purple text-center fn-md">
                                    You have successfully deposited {props.amount} BNB in{" "}
                                    {props.portfolioName} portfolio
                                </p>
                                <p
                                    className="success-or-error-msg-modal-message c-purple text-center fn-md cursor-pointer"
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
                            <p className="success-or-error-msg-modal-message c-purple text-center fn-md">
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
                        {props.transactionType === "invest" ? (
                            <>
                                <div className="success-or-error-msg-modal-invested-or-redeemed-amount">
                                    <p className="c-purple">{props.amount} BNB</p>
                                    <p className="text-center fn-sm c-grey">
                                        ~${" "}
                                        {(props.amount * props.currentBnbPrice).toLocaleString(
                                            "en-US",
                                            { maximumFractionDigits: 1 }
                                        )}
                                    </p>
                                </div>
                                <p className="success-or-error-msg-modal-received-amount c-purple">
                                    ~{props.amount} {props.portfolioName}
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
                                            props.currentBnbPrice
                                        ).toLocaleString("en-US", { maximumFractionDigits: 1 })}
                                    </p>
                                </div>
                                <p className="success-or-error-msg-modal-received-amount c-purple">
                                    ~{(props.amount * rateOfIndexToken).toFixed(4)} BNB
                                </p>
                            </>
                        )}

                        <div className="success-or-error-msg-modal-details flex">
                            <img
                                src={StraightLine}
                                alt=""
                                style={{ position: "absolute", zIndex: -1 }}
                            />
                            <div>
                                <img
                                    src={Circle}
                                    alt=""
                                    style={{ position: "absolute", right: "-20%", top: "-18%" }}
                                />
                                {props.transactionType === "invest" ? (
                                    <img src={BnbImg} alt="" style={{ width: "50px" }} />
                                ) : (
                                    <img
                                        src={indexTokensImg[props.portfolioName]}
                                        alt=""
                                        style={{ width: "50px" }}
                                    />
                                )}
                            </div>
                            <div>
                                <img src={ErrorImg} alt="" style={{ width: "64px" }} />
                            </div>
                            <div>
                                <img
                                    src={Circle}
                                    alt=""
                                    style={{ position: "absolute", left: "-20%", top: "-18%" }}
                                />
                                {props.transactionType !== "invest" ? (
                                    <img src={BnbImg} alt="" style={{ width: "50px" }} />
                                ) : (
                                    <img
                                        src={indexTokensImg[props.portfolioName]}
                                        alt=""
                                        style={{ width: "50px" }}
                                    />
                                )}
                            </div>
                        </div>
                        <h2
                            className="success-or-error-msg-modal-title c-purple text-center"
                            style={{ fontSize: "30px" }}
                        >
                            Error!
                        </h2>
                        <p
                            className="success-or-error-msg-modal-message c-purple text-center fn-md"
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
                    href={`https://bscscan.com/tx/${props.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                >
                    <p className="text-center font-semibold c-purple"> View Txn On Bscscan </p>
                </a>
            </div>
        </>
    )
}

export default SuccessOrErrorMsgModal
