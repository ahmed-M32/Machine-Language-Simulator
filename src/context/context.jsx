/* eslint-disable no-unused-vars */
import { useContext, useState, useEffect, createContext } from "react";

const SimContext = createContext();

const SimContextProvider = ({ children }) => {
	const [register, setRegister] = useState(
        Array.from({ length: 16 }, (_, index) => ({ [index.toString(16).padStart(2, "0")]: "00" }))
    );
    
    const [memory, setMemory] = useState(
        Array.from({ length: 256 }, (_, index) => ({ [index.toString(16).padStart(2, "0")]: "00" }))
    );
    
	const [input, setInput] = useState("");
    const [start,setStart] = useState("00")



    function updateRegister(value){
        setRegister(value)
    }
	const contextValue = {
		register,
		setRegister,
		memory,
		setMemory,
        input,
        setInput,
        start,
        setStart,
	};

	return <SimContext.Provider value={contextValue}>{children}</SimContext.Provider>;
};

export { SimContext, SimContextProvider };
