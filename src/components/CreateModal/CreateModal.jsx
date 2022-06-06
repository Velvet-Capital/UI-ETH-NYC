import React, { useState } from "react";
import { BigNumber, utils } from "ethers";
import './CreateModal.css';

import CrossImg from '../../assets/img/cross.svg';
import VelvetCapitalLogo from '../../assets/img/newvelvetcapitallogo.svg';
import MetaverseLogo from '../../assets/img/metaverse.svg';
import BnbImg from '../../assets/img/bnb.png';

import formatDecimal from "../../utils/formatDecimal";

function CreateModal(props) {

    const [amount, setAmount] = useState(BigNumber.from(0));
    const [hasEnoughFunds, setHasEnoughFunds] = useState(true);

    let indexTokenBalance;
    if(props.portfolioName === 'META')
        indexTokenBalance = props.metaBalance;

    else if(props.portfolioName === 'BLUECHIP') 
        indexTokenBalance = props.bluechipBalance;

    else if(props.portfolioName === 'TOP10') 
        indexTokenBalance = props.top10Balance;

    else if(props.portfolioName === 'TOP7')
        indexTokenBalance = props.top7Balance;
    
    else if(props.portfolioName === 'VTOP3')
        indexTokenBalance = props.vtop3Balance;

    function checkHasEnoughFunds(amount, fund) {
        if(parseFloat(amount) > parseFloat(fund)) 
            setHasEnoughFunds(false)
        
        else 
            setHasEnoughFunds(true);
    }

    if(!props.show) return null;

    return (
        <>
            <div className="overlay" onClick={props.toggleModal}></div>
            <div className="modal create-modal">
                <img src={CrossImg} alt="" id="create-modal-cancle" className="cursor-pointer" onClick={props.toggleModal} />

                <div className="create-modal-details">
                    <img src={props.portfolioName === 'META' ? MetaverseLogo : VelvetCapitalLogo} alt="" id="create-modal-logo" />
                    <span>{props.portfolioName}</span>
                </div>
                <div className="create-modal-action-tab flex">
                    <div className="cursor-pointer" onClick={() => {props.toggleCreateModalTab(); checkHasEnoughFunds(amount.toString(), props.bnbBalance);}} >
                        <span className={props.createModalTab === 'redeem' && "unactive"}> Create </span>
                        <div className={`line ${props.createModalTab === 'create' && "active"}`} ></div>
                    </div>
                    <div className="cursor-pointer" onClick={() => {props.toggleCreateModalTab(); checkHasEnoughFunds(amount.toString(), indexTokenBalance);}} >
                        <span className={props.createModalTab === 'create' && "unactive"}> Redeem </span>
                        <div className={`line ${props.createModalTab === 'redeem' && "active"}`} ></div>
                    </div>
                </div>

                <div className="create-modal-inputs flex">
                    <div className="create-modal-token-input">
                        <span className="fn-sm">Token</span>
                        <div className="create-modal-asset-dropdown flex">
                            {
                                props.createModalTab === 'create' ? (
                                    <>
                                        <img src={BnbImg} alt="" />
                                        <span style={{fontSize: '16px', fontWeight: 500, color: '#262626'}}> BNB </span>
                                    </>
                                ) : (
                                    <span style={{fontSize: '16px', fontWeight: 500, color: '#262626'}}> {props.portfolioName} </span>
                                )
                            }
                        </div>
                    </div>
                    <div className="create-modal-amount-input">
                        {
                            hasEnoughFunds ? (
                                <span className="fn-sm">Amount</span>
                            ) : (
                                <span className="c-red fn-sm">Not enough funds</span>
                            )
                        }
                        <span className="fn-sm create-modal-amount-input-balance">
                            ~ ${props.createModalTab === 'create' ? (amount * props.currentBnbPrice).toLocaleString('en-US', {maximumFractionDigits: 2}) : (amount * props.currentBnbPrice).toLocaleString('en-US', {maximumFractionDigits: 2})}
                        </span>
                        <input 
                            type="number" 
                            className={ hasEnoughFunds ? "block" : "block border-red" } 
                            placeholder={props.createModalTab === 'create' ? 'max ' + formatDecimal(props.bnbBalance) + ' BNB' : 'max ' + formatDecimal(indexTokenBalance) + ' ' + props.portfolioName} 
                            value={amount == '0' ? null : amount}
                            onChange={(e) => {
                                e.target.value <= 1000000000 && setAmount(e.target.value);
                                if(props.createModalTab === 'create'){
                                    checkHasEnoughFunds(e.target.value, props.bnbBalance);
                                }

                                else {
                                    checkHasEnoughFunds(e.target.value, indexTokenBalance);
                                }
                            }} 
                        />
                    </div>
                </div>

                { props.createModalTab === 'redeem' && hasEnoughFunds && <span className="create-modal-max-btn cursor-pointer" onClick={() => setAmount(indexTokenBalance.slice(0, -7))}> max </span> }
    
                {props.createModalTab === 'create' ? <p className="create-modal-inf font-normal fn-sm text-center c-purple">You will get ~ {amount.toString()} {props.portfolioName} tokens representing your basket</p> : <p className="create-modal-inf font-normal fn-sm text-center c-purple">You will get ~ {amount.toString()} BNB </p> }

                <button 
                    className="create-modal-action-btn btn fn-md" 
                    data-portfolio-name= {props.portfolioName}
                    disabled = {!hasEnoughFunds || props.isLoading}
                    style = {hasEnoughFunds ? {opacity: 1} : {opacity: 0.5}}
                    onClick={props.createModalTab === 'create' ? () => props.invest(props.portfolioName, utils.parseEther(amount.toString())) : () => props.withdraw(props.portfolioName, utils.parseEther(amount.toString()))}>
                       {props.isLoading && props.createModalTab === 'create' ? 'Investing...' : props.isLoading && props.createModalTab === 'redeem' ? 'Redeeming...' : props.createModalTab === 'create' ? "Create" : "Redeem"}
                </button>
            </div>
        </>
    )
}

export default CreateModal;