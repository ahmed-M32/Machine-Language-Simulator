/* eslint-disable no-unused-vars */
import { useContext } from "react";
import { SimContext } from "../context/context.jsx";

const Register = () => {
    const { register } = useContext(SimContext);

    return (
        <div className="register-block">
            <h1>Registers</h1>
            <div className="memory-grid">
                {register.map((reg, index) => (
                    <div key={index} className="memory-cell">
                        R{index.toString(16).toUpperCase()}: {Object.values(reg)[0]}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Register;