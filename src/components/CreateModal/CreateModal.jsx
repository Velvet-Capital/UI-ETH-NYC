import React from "react";
import './CreateModal.css';

import CrossImg from '../../assets/img/cross.svg';
import VelvetLogo from '../../assets/img/velvetlogo3x.png';
import BtcImg from '../../assets/img/btc.svg';
import EthImg from '../../assets/img/eth.svg';
import BnbImg from '../../assets/img/bnb.png';
import SolImg from '../../assets/img/sol.png';

function CreateModal(props) {
    if(!props.show) return null;

    return (
        <>
            <div className="overlay" onClick={props.toggleModal}></div>
            <div className="modal create-modal">
                <img src={CrossImg} alt="" id="create-modal-cancle" className="cursor-pointer" onClick={props.toggleModal} />

                <div className="create-modal-details">
                    <img src={VelvetLogo} alt="" id="create-modal-logo" />
                    <span>Top-15</span>
                </div>
                <div className="create-modal-action-tab flex">
                    <div className="cursor-pointer" onClick={props.toggleCreateModalTab}>
                        <span className={props.createModalTab === 'reedem' && "unactive"} >Create</span>
                        <div className={`line ${props.createModalTab === 'create' && "active"}`} ></div>
                    </div>
                    <div className="cursor-pointer" onClick={props.toggleCreateModalTab}>
                        <span className={props.createModalTab === 'create' && "unactive"}>Redeem</span>
                        <div className={`line ${props.createModalTab === 'reedem' && "active"}`} ></div>
                    </div>
                </div>

                <div className="create-modal-inputs flex">
                    <div className="create-modal-token-input">
                        <span className="fn-sm">Token</span>
                        <div className="asset-dropdown">
                            <select>
                                <option value="1"><img src={BnbImg} alt="" /> BNB</option>
                                <option value="2"><img src={BtcImg} alt="" /> BTC</option>
                                <option value="3"><img src={EthImg} alt="" /> ETH</option>
                                <option value="4"><img src={SolImg} alt="" /> SOL</option>
                            </select>
                        </div>
                    </div>
                    <div className="create-modal-amount-input">
                        <span className="fn-sm">Amount</span>
                        <span className="fn-sm create-modal-amount-input-balance">~ $15,000</span>
                        <input type="number" className="block" />
                    </div>
                </div>

                <button className="create-modal-action-btn btn fn-md">{props.createModalTab === 'create' ? "Create" : "Reedem"}</button>
            </div>
        </>
    )
}

export default CreateModal;