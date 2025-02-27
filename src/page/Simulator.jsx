/* eslint-disable no-unused-vars */

import { useContext, useEffect, useState } from "react";
import MemoryBlock from "../components/memory.jsx";
import Register from "../components/Register.jsx";
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
	const [programCounter,setProgramCounter] = useState(start)

	function handleInput(e) {
		setInput(e.target.value);
	}

	function handleStartAdress(e) {
		setStart(e.target.value);
	}

	function load() {
		let code = input.split("\n");

		console.log(code, "  ,   ", start);
		const newm = [...memory];
		const newMemory = LoadToMemory(newm, code, start);
		setMemory(newMemory);
		setProgramCounter(start)
	}
	function run(step) {
		let newReg = [...register];
		let newMem = [...memory];

		const { register:reg, memory:mem,pc:newPc } = RunCode(newReg, newMem, programCounter, step);
		console.log(mem,reg);
		
		setMemory(mem);
		setRegister(reg);
		setProgramCounter(newPc);
	}

	return (
		<div className="main">
			<div className="input">
				enter your code
				<div className="input">
					<textarea name="" id="" onChange={handleInput}></textarea>
					Start Address
					<input
						type="text"
						name=""
						id=""
						defaultValue={"00"}
						onChange={handleStartAdress}
					/>
					<button className="load" onClick={load}>
						Load to Memory
					</button>
					<button className="step" onClick={() => run(true)}>
						Step
					</button>
					<button className="run" onClick={() => run(false)}>
						Run
					</button>
					<div className="pc">PC: {programCounter}</div>
				</div>
			</div>
			<Register />
			<MemoryBlock />
		</div>
	);
};

export default Simulator;
