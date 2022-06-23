import { React } from "react"
import Tippy from "@tippy.js/react"
import "./PortfolioBox.css"
import "tippy.js/dist/tippy.css"

import DollarImg from "../../assets/img/dollar.svg"
import PeopleImg from "../../assets/img/people.svg"
import CrossImg from "../../assets/img/cross.svg"
import InfoImg from "../../assets/img/info.svg"

import AssestsLogo from "../../utils/assests_logo_helper.js"
import formatDecimal from "../../utils/formatDecimal"

function PortfolioBox({
    flipHandler,
    portfolioBoxSide,
    logo,
    title,
    portfolioName,
    creator,
    tippyContent,
    assetsImg,
    indexTokenBalance,
    currentBnbPrice,
    numberOfInvestors,
    indexVaultBalance,
    tokens,
    isWalletConnected,
    toggleConnectWalletModal,
    toggleCreateModal,
}) {
    return (
        <div className="portfolio-box">
            {portfolioBoxSide === "front" ? (
                <div className="portfolio-box-front">
                    <div className="level1">
                        <img src={logo} alt="" />

                        <div className="portfolio-details">
                            <h1 className="portfolio-details-title">{title}</h1>
                            <p className="portfolio-details-creator fn-vsm">by {creator}</p>
                        </div>

                        <Tippy
                            placement="top"
                            animation="scale"
                            content={tippyContent}
                        >
                            <img
                                src={InfoImg}
                                alt=""
                                className="portfolio-box-front-info-img cursor-pointer"
                            />
                        </Tippy>
                    </div>

                    <img
                        className="portfolio-box-assets-img cursor-pointer"
                        src={assetsImg}
                        alt=""
                        title="Click to see assets allocation"
                        onClick={() => flipHandler(portfolioName)}
                    />

                    <div className="portfolio-box-user-amount">
                        <span>Amount</span>
                        <span
                            style={
                                formatDecimal(indexTokenBalance) > 0
                                    ? { color: "#564dd0" }
                                    : { color: "#b3b3b3" }
                            }
                        >
                            {formatDecimal(indexTokenBalance) == 0
                                ? "0"
                                : formatDecimal(indexTokenBalance)}{" "}
                            {portfolioName}
                        </span>
                    </div>

                    <div className="portfolio-box-user-balance">
                        <span>Value</span>
                        <span
                            style={
                                formatDecimal(indexTokenBalance) > 0
                                    ? { color: "#564dd0" }
                                    : { color: "#b3b3b3" }
                            }
                        >
                            ${" "}
                            {(indexTokenBalance * currentBnbPrice).toLocaleString("en-US", {
                                maximumFractionDigits: 1,
                            })}
                        </span>
                    </div>

                    <div className="portfolio-box-user-return">
                        <span>Return</span>
                        <span>-</span>
                    </div>

                    <button
                        className="btn fn-md"
                        data-portfolio-name={portfolioName}
                        onClick={isWalletConnected ? toggleCreateModal : toggleConnectWalletModal}
                    >
                        {formatDecimal(indexTokenBalance) > 0 ? "Deposit/ Withdraw" : "Deposit"}
                    </button>

                    <div className="portfolio-data">
                        <Tippy
                            placement="top"
                            animation="scale"
                            arrow={false}
                            content={"Total No. Of Investors"}
                        >
                            <div className="left">
                                <img src={PeopleImg} alt="" />
                                <span className="num-of-investors fn-sm">{numberOfInvestors}</span>
                            </div>
                        </Tippy>

                        <Tippy
                            placement="top"
                            animation="scale"
                            arrow={false}
                            content={"Amount Invested In Portfolio"}
                        >
                            <div className="right">
                                <img src={DollarImg} alt="" />
                                <span className="marketcap fn-sm">
                                    {(indexVaultBalance * currentBnbPrice).toLocaleString("en-US", {
                                        maximumFractionDigits: 1,
                                    })}
                                </span>
                            </div>
                        </Tippy>
                    </div>
                </div>
            ) : (
                <div className="portfolio-box-back">
                    <img
                        src={CrossImg}
                        alt=""
                        id="portfolio-box-back-cross"
                        onClick={() => flipHandler(portfolioName)}
                    />
                    <h2>Allocation</h2>
                    <h3>Rebalancing Weekly</h3>
                    <div className="portfolio-box-back-assets">
                        {tokens.map(([tokenName, tokenSymbol, tokenWeight], index) => {
                            return (
                                <div className="portfolio-box-back-asset" key={index}>
                                    <img
                                        src={AssestsLogo[tokenSymbol]}
                                        alt=""
                                        className="portfolio-box-back-asset-icon"
                                    />
                                    <span className="portfolio-box-back-asset-name">
                                        {tokenName}
                                    </span>
                                    <span className="portfolio-box-back-asset-symbol">
                                        {tokenSymbol}
                                    </span>
                                    {tokenWeight === "0" ? (
                                        <span className="portfolio-box-back-asset-allocation">
                                            0 %
                                        </span>
                                    ) : (
                                        <span className="portfolio-box-back-asset-allocation">
                                            {tokenWeight.slice(-1) === "0"
                                                ? tokenWeight.slice(0, -2)
                                                : tokenWeight}{" "}
                                            %
                                        </span>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default PortfolioBox
