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
    currentMaticPrice,
    numberOfInvestors,
    indexVaultBalance,
    tokens,
    isWalletConnected,
    toggleConnectWalletModal,
    toggleCreateModal,
}) {
    return (
        <div className="portfolio-box">
                <div className="portfolio-box-front">
                    <div className="level1">
                        <div className="portfolio-details">
                            <h1 className="portfolio-details-title">{title}</h1>
                        </div>

                    </div>

                    <div className="portfolio-box-user-amount">
                        <span>Amount</span>
                        <span>
                            {formatDecimal(indexTokenBalance) == 0
                                ? "0"
                                : formatDecimal(indexTokenBalance)}{" "}
                            {portfolioName}
                        </span>
                    </div>

                    <button
                        className="btn fn-md"
                        style={{color: "green"}}
                        data-portfolio-name={portfolioName}
                        onClick={isWalletConnected ? toggleCreateModal : toggleConnectWalletModal}
                    >
                        {formatDecimal(indexTokenBalance) > 0 ? "Deposit / Withdraw" : "Deposit"}
                    </button>

                    <div className="portfolio-data">

                        <div className="left">
                            <span className="num-of-investors fn-sm">Investors: {numberOfInvestors}</span>
                        </div>
             
                        <div className="right">
                            <span className="marketcap fn-sm">
                                Invested Amount: ${(indexVaultBalance * currentMaticPrice).toLocaleString("en-US", {
                                    maximumFractionDigits: 1,
                                })}
                            </span>
                        </div>

                    </div>

                    <p className="text-center fn-lg" style={{margin: "10px 0px"}}>Asset Allocation</p>
                    <div className="portfolio-box-back-assets">
                        {tokens.map(([tokenName, tokenSymbol, tokenWeight], index) => {
                            return (
                                <div className="portfolio-box-back-asset" key={index}>
                                    <span className="portfolio-box-back-asset-name">
                                        {tokenName}
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
        </div>
    )
}

export default PortfolioBox
