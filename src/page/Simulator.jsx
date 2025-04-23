/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import MemoryBlock from "../components/memory.jsx";
import Register from "../components/Register.jsx";
import ThemeSwitch from "../components/ThemeSwitch.jsx";
import { SimContext } from "../context/context.jsx";
import { LoadToMemory, RunCode } from "../utils/functions.jsx";

const Simulator = () => {
    const {
        start,
        setStart,
        input,
        setInput,
        memory,
        setMemory,
        register,
        setRegister,
    } = useContext(SimContext);
    const [programCounter, setProgramCounter] = useState(start);

    function handleInput(e) {
        setInput(e.target.value);
    }

    function handleStartAdress(e) {
        setStart(e.target.value);
    }

    function load() {
        let code = input.split("\n");
        const newm = [...memory];
        const newMemory = LoadToMemory(newm, code, start);
        setMemory(newMemory);
        setProgramCounter(start);
    }

    function run(step) {
        let newReg = [...register];
        let newMem = [...memory];
        const { register: reg, memory: mem, pc: newPc } = RunCode(newReg, newMem, programCounter, step);
        setMemory(mem);
        setRegister(reg);
        setProgramCounter(newPc);
    }

    return (
        <>
            <ThemeSwitch />
            <div className="main">
                <div className="input-section">
                    <h1>Machine Language Simulator</h1>
                    <div className="code-input">
                        <label htmlFor="code-input">Enter your code:</label>
                        <textarea
                            id="code-input"
                            onChange={handleInput}
                            placeholder="Enter your machine code here..."
                        />
                    </div>
                    <div className="start-address">
                        <label htmlFor="start-address">Start Address:</label>
                        <input
                            type="text"
                            id="start-address"
                            defaultValue="00"
                            onChange={handleStartAdress}
                        />
                    </div>
                    <div className="button-group">
                        <button className="load" onClick={load}>
                            Load to Memory
                        </button>
                        <button className="step" onClick={() => run(true)}>
                            Step
                        </button>
                        <button className="run" onClick={() => run(false)}>
                            Run
                        </button>
                    </div>
                    <div className="pc">
                        Program Counter: {programCounter}
                    </div>
                </div>
                <div className="visualization">
                    <Register />
                    <MemoryBlock />
                </div>
            </div>
        </>
    );
};

export default Simulator;
