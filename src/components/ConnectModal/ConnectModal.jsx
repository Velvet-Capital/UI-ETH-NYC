import React from "react";
import './ConnectModal.css';

import VelvetImg from '../../assets/img/velvet.svg';
import MetamaskImg from '../../assets/img/metamask.webp';

function Modal(props) {
    if(!props.show) return null;

    return (
        <>
            <div className="overlay" onClick={props.toggleModal} >
            </div>
            <div className='modal'>
                <img src={VelvetImg} alt="" className='connect-modal-velvet-logo horizontally-centred'/>
                <h2 className="connect-modal-title">Create wallet</h2>
                <input type="email" name="email" placeholder="E-mail" id="connect-modal-input" />
                <button className="btn fn-md connect-modal-signup-btn">Sign Up</button>
                <p className="fn-sm" style={{textAlign: 'center', color: '#564dd0', cursor: 'pointer', fontWeight: 500}}>I already have an account</p>
                <h2 className="connect-modal-title my-30">Connect wallet</h2>
                <button className="connect-modal-metamask-btn fn-md" onClick={props.connectWallet}>
                    <span> Connect with Metamask</span>
                    <img src={MetamaskImg} alt="" />
                </button>
                <p className="text-center fn-vsm">By connecting you are agree to our <b>Terms of use and Privacy Policy</b></p>
            </div>
        </>
    )
}

export default Modal;