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

                <input type="email" name="email" placeholder="E-mail" id="connect-modal-input" value={props.email} onChange={props.handleEmailInputChange} />

                <button className="btn fn-md connect-modal-signup-btn" onClick={props.handleSignin} >Sign In</button>
                {/* <p className="fn-sm" style={{textAlign: 'center', color: '#564dd0', cursor: 'pointer', fontWeight: 500}}>I already have an account</p> */}
                <div className="flex" style={{justifyContent: 'space-between', alignItems: 'center'}}>
                    <hr style={{width: '20%', opacity: 0.4}}/>
                    <h2 className="connect-modal-title my-30">Connect wallet</h2>
                    <hr style={{width: '20%', opacity: 0.4}}/>
                </div>
                
                <button className="connect-modal-metamask-btn fn-md" onClick={props.connectWallet}>
                    <span> Connect with Metamask</span>
                    <img src={MetamaskImg} alt="" />
                </button>

                <p className="text-center fn-vsm">By connecting you agree to our <a href="https://acrobat.adobe.com/link/track?uri=urn:aaid:scds:US:54249449-1664-4b64-a11e-feb9dbcbf507" target="_blank" rel="noreferrer"><b>Terms of use and Privacy Policy</b></a></p>
            </div>
        </>
    )
}

export default Modal;