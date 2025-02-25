/* eslint-disable no-unused-vars */

import { useContext, useEffect, useState } from "react";
import MemoryBlock from "../components/memory.jsx";
import Register from "../components/Register.jsx";
import { SimContext } from "../context/context.jsx";
import { LoadToMemory ,RunCode} from "../utils/functions.jsx";
const Simulator = () => {

	const {start,setStart,input,setInput,memory,setMemory} = useContext(SimContext)

	function handleInput(e) {
		setInput(e.target.value)
	}
	
	function handleStartAdress(e){
		setStart(e.target.value)
	}

	function load(){
		let code  = input.split("\n")

		console.log(code,"  ,   ",start);
		const newm =[...memory]
		const newMemory = LoadToMemory(newm,code,start)
		setMemory(newMemory)
		
	}
	function run(){
		let newReg = [...Register]
		let newMem = [...memory]

		const {reg,mem} = RunCode(newReg,newMem,start);
	}
	
	return (
		<div className="main">
			<div className="input">
				enter your code
				<div className="input">
					<textarea name="" id="" onChange={handleInput}></textarea>
					Start Address
					<input type="text" name="" id="" defaultValue={"00"} onChange={handleStartAdress}/>
					<button className="load" onClick={load}>Load to Memory</button>
					<button className="run" onClick={run}>
						Run
					</button>
				</div>
			</div>
			<Register />
			<MemoryBlock />
		</div>
	);
};

export default Simulator;
