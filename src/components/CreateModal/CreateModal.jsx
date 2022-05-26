import React, { useState } from "react";
import { BigNumber, utils } from "ethers";
import './CreateModal.css';

import Loading from '../Loading/Loading.jsx';

import CrossImg from '../../assets/img/cross.svg';
import VelvetLogo from '../../assets/img/velvetlogo3x.png';
import MetaverseLogo from '../../assets/img/metaverse.svg';

import BnbImg from '../../assets/img/bnb.png';
import BtcImg from '../../assets/img/btc.svg';
import EthImg from '../../assets/img/eth.svg';
import SolImg from '../../assets/img/sol.png';

function CreateModal(props) {

    const [amount, setAmount] = useState(BigNumber.from(0));

    let indexTokenBalance = '';
    if(props.portfolioName === 'META')
        indexTokenBalance = props.metaBalance;
    else if(props.portfolioName === 'BLUECHIP') 
        indexTokenBalance = props.bluechipBalance;
    else if(props.portfolioName === 'TOP7')
        indexTokenBalance = props.top7Balance;


    if(!props.show) return null;

    return (
        <>
            <div className="overlay" onClick={props.toggleModal}></div>
            <div className="modal create-modal">
                <img src={CrossImg} alt="" id="create-modal-cancle" className="cursor-pointer" onClick={props.toggleModal} />

                <div className="create-modal-details">
                    <img src={props.portfolioName === 'META' ? MetaverseLogo : VelvetLogo} alt="" id="create-modal-logo" />
                    <span>{props.portfolioName}</span>
                </div>
                <div className="create-modal-action-tab flex">
                    <div className="cursor-pointer" onClick={props.toggleCreateModalTab}>
                        <span className={props.createModalTab === 'reedem' && "unactive"}> Create </span>
                        <div className={`line ${props.createModalTab === 'create' && "active"}`} ></div>
                    </div>
                    <div className="cursor-pointer" onClick={props.toggleCreateModalTab}>
                        <span className={props.createModalTab === 'create' && "unactive"}> Redeem </span>
                        <div className={`line ${props.createModalTab === 'reedem' && "active"}`} ></div>
                    </div>
                </div>

                <div className="create-modal-inputs flex">
                    <div className="create-modal-token-input">
                        <span className="fn-sm">Token</span>
                        <div className="asset-dropdown">
                            <select disabled >
                                {
                                    props.createModalTab === 'create' ? (
                                        <option value="1"><img src={BnbImg} alt="" /> BNB</option>
                                        /* <option value="2"><img src={BtcImg} alt="" /> BTC</option>
                                        <option value="3"><img src={EthImg} alt="" /> ETH</option>
                                        <option value="4"><img src={SolImg} alt="" /> SOL</option> */
                                    ) : (
                                        <option value="1"><img src={BnbImg} alt="" /> {props.portfolioName}</option>
                                    )
                                }
                            </select>
                        </div>
                    </div>
                    <div className="create-modal-amount-input">
                        <span className="fn-sm">Amount</span>
                        <span className="fn-sm create-modal-amount-input-balance">
                            ~ ${props.createModalTab === 'create' ? (amount * props.currentBnbPrice).toLocaleString() : (amount * props.currentBnbPrice).toLocaleString()}
                        </span>
                        <input 
                            type="number" 
                            className="block" 
                            placeholder={props.createModalTab === 'create' ? 'max ' + props.bnbBalance + ' BNB' : 'max ' + indexTokenBalance + ' ' + props.portfolioName} 
                            max= '100'
                            value={amount == '0' ? null : amount} onChange={(e) => e.target.value <= 1000000000 && setAmount(e.target.value)} 
                        />
                    </div>
                </div>
    
                {props.createModalTab === 'create' ? <p className="create-modal-inf font-normal fn-sm text-center c-purple">You will get ~ {amount.toString()} {props.portfolioName} tokens representing your basket</p> : <p className="create-modal-inf font-normal fn-sm text-center c-purple">You will get ~ {amount.toString()} BNB </p> }

                <button 
                    className="create-modal-action-btn btn fn-md" 
                    data-portfolio-name= {props.portfolioName}
                    onClick={props.createModalTab === 'create' ? () => props.invest(props.portfolioName, utils.parseEther(amount.toString())) : () => props.withdraw(props.portfolioName, utils.parseEther(amount.toString()))}>
                       {props.isLoading ? <Loading/> : props.createModalTab === 'create' ? "Create" : "Reedem"}
                </button>
            </div>
        </>
    )
}

export default CreateModal;