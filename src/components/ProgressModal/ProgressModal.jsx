import React from "react"
import "./ProgressModal.css"

import Spinner from "../Spinner/Spinner"

import BnbImg from "../../assets/img/bnb.png"
import VelvetCapitalLogo from "../../assets/img/newvelvetcapitallogo.svg"
import VelvetCapitalLogo2 from "../../assets/img/velvetcapitallogo2.svg"
import MetaverseLogo from "../../assets/img/metaverse.svg"
import VenusLogo from "../../assets/img/venuslogo.png"
import StraightLine from "../../assets/img/straightline.svg"
import Circle from "../../assets/img/circle.svg"

function ProgressModal(props) {
    const tokensImg = {
        BNB: BnbImg,
        META: MetaverseLogo,
        BLUECHIP: VelvetCapitalLogo,
        TOP10: VelvetCapitalLogo2,
        TOP7: VelvetCapitalLogo,
        VTOP10: VenusLogo,
    }

    if (!props.show) return null

    return (
        <div>
            <div className="overlay" onClick={() => props.toggleProgessModal()}></div>
            <div className="modal progress-modal">
                <div className="progress-modal-asset1">
                    <p className="c-purple">
                        {props.asset1Amount} {props.asset1Name}
                    </p>
                    <p className="text-center fn-sm c-grey">
                        ~
                        {(props.asset1Amount * props.currentBnbPrice).toLocaleString("en-US", {
                            maximumFractionDigits: 1,
                        })}
                    </p>
                </div>

                <p className="progress-modal-asset2 c-purple">
                    ~{props.asset2Amount} {props.asset2Name}
                </p>

                <div className="progress-modal-details flex">
                    <img
                        src={StraightLine}
                        alt=""
                        style={{ position: "absolute", zIndex: -1, width: "46%" }}
                    />
                    <div>
                        <img
                            src={Circle}
                            alt=""
                            style={{ position: "absolute", right: "-20%", top: "-18%" }}
                        />
                        <img src={tokensImg[props.asset1Name]} alt="" style={{ width: "50px" }} />
                    </div>
                    <div>
                        <Spinner />
                    </div>
                    <div>
                        <img
                            src={Circle}
                            alt=""
                            style={{ position: "absolute", left: "-20%", top: "-18%" }}
                        />
                        <img src={tokensImg[props.asset2Name]} alt="" style={{ width: "50px" }} />
                    </div>
                </div>

                <p className="text-center c-purple font-semibold" style={{ fontSize: "30px" }}>
                    Transaction in progress...
                </p>

                <p className="text-center c-purple" style={{ fontSize: "16px", marginTop: "45px" }}>
                    (please press <b>"Confirm"</b> in your Metamask wallet)
                </p>
            </div>
        </div>
    )
}

export default ProgressModal
