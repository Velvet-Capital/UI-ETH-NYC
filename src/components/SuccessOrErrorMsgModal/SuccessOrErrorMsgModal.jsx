import React from "react";
import './SuccessOrErrorMsgModal.css';

import CrossImg from '../../assets/img/cross.svg';
import SuccessImg from '../../assets/img/success-mark.svg';
import ErrorImg from '../../assets/img/error-mark.svg';
import CopyIcon from '../../assets/img/copyicon.png';

function SuccessOrErrorMsgModal(props) {

    const tokensAddress = {
        'BLUECHIP': '0x55204c31E725C7635393bdBdE738d73c1e10E178',
        'META': '0xB757F1D8c40D49313f716906d7c3107a877367AD',
        'TOP10': '0x210b31776fA73c72CCaD41A65AcAF1Ab3317440E',
        'TOP7': '0x5DA92941262768deA5018114e64EB73b937B5Cb0'
    }

    async function addTokenToWallet(tokenAddress, tokenSymbol) {
        try {
            //adding token to metamask wallet
            await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                  type: 'ERC20', 
                  options: {
                    address: tokenAddress,
                    symbol: tokenSymbol, 
                    decimals: 18
                  },
                },
              });
        }
        catch(err) {
            console.log(err);
        }
    }

    function copyTokenAddress(portfolioName) {
        console.log(portfolioName);
        navigator.clipboard.writeText(tokensAddress[portfolioName]);

    }

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
                                    <>
                                        <p className="success-or-error-msg-modal-message c-purple text-center fn-md">You have successfully  invested {props.amount} BNB in {props.portfolioName} basket </p>
                                        <p className="success-or-error-msg-modal-message c-purple text-center fn-md cursor-pointer" onClick={() => addTokenToWallet(tokensAddress[props.portfolioName], props.portfolioName)} style={{margin: '20px 0'}}>Add {props.portfolioName} Token to your wallet: <u style={{color: 'blue'}}>{tokensAddress[props.portfolioName]}</u> </p>
                                        <img src={CopyIcon} alt="" className="cursor-pointer success-or-error-msg-modal-copy-icon" onClick={() => copyTokenAddress(props.portfolioName)} />
                                        
                                    </>
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