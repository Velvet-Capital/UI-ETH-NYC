import React from "react";
import "./SwapModal.css"

function SwapModal(props) {

    if (!props.show) return false

    return (
        <>
            <div className="overlay" onClick={() => props.toggleSwapModal()}></div>
            <div className="modal swap-modal">
                <p>Swap Token Into MATIC</p>
                <label for="cars">Choose asset:</label>
                <select name="assets" id="assets">
                    <option value="volvo">USDT</option>
                    <option value="saab">USDC</option>
                </select>
                <br />
                <input type="number"  />
                <button className="btn fn-md">Swap</button>
            </div>
        </>

    )
}

export default SwapModal
