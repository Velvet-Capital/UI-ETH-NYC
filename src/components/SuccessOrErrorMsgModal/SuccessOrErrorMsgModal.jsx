import React from "react";
import './SuccessOrErrorMsgModal.css';

import CrossImg from '../../assets/img/cross.svg';
import SuccessImg from '../../assets/img/success-mark.svg';
import ErrorImg from '../../assets/img/error-mark.svg';

function SuccessOrErrorMsgModal(props) {

    if(!props.show) return null;

    return (
        <>
            <div className="overlay" onClick={props.toggleSuccessOrErrorMsgModal}></div>
            <div className="modal success-or-error-msg-modal">
                <img src={CrossImg} alt="" id="success-or-error-msg-modal-cancle" className="cursor-pointer" onClick={props.toggleSuccessOrErrorMsgModal} />

                {
                    props.status == 1 ? (
                        <>
                            <img src={SuccessImg} alt="" className="horizontally-centred success-or-error-msg-modal-img" />
                            <h2 className="success-or-error-msg-modal-title c-purple text-center" style={{fontSize: '30px'}}>Success!</h2>
                            {
                                props.transactionType === 'invest' ? (
                                    <p className="success-or-error-msg-modal-message c-purple text-center fn-md">You have successfully  invested {props.amount} BNB in {props.portfolioName} basket </p>
                                ) : (
                                    <p className="success-or-error-msg-modal-message c-purple text-center fn-md">You have successfully redeemed {props.amount} {props.portfolioName} from basket </p>
                                )
                            }
                            <button className="btn success-or-error-msg-modal-btn fn-md font-bold" onClick={props.toggleSuccessOrErrorMsgModal}>Back to portfolios</button>
                        </>
                    ) : (
                        <>
                            <img src={ErrorImg} alt="" className="horizontally-centred success-or-error-msg-modal-img" />
                            <h2 className="success-or-error-msg-modal-title c-purple text-center" style={{fontSize: '30px'}}>Error!</h2>
                            <p className="success-or-error-msg-modal-message c-purple text-center fn-md" style={{margin: '35px 0'}}>Looks like this transaction has failed, it happens sometimes due to network congestion, please try again</p>
                            <button className="btn success-or-error-msg-modal-btn fn-md font-bold" onClick={props.toggleSuccessOrErrorMsgModal}>Try again</button>
                        </>
                    )
                }

                
            </div>
        </>
    );
}

export default SuccessOrErrorMsgModal;