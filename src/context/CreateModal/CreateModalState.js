import React, { useState } from "react"
import CreateModalContext from "./CreateModalContext"

const CreateModalState = (props) => {
    const [rateOfIndexToken, setRateOfIndexToken] = useState(0)
    function updateRateOfIndexToken(rate) {
        setRateOfIndexToken(rate)
    }
    return (
        <CreateModalContext.Provider value={{ rateOfIndexToken, updateRateOfIndexToken }}>
            {props.children}
        </CreateModalContext.Provider>
    )
}

export default CreateModalState
