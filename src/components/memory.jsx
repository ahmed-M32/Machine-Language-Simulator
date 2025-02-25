/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import { SimContext } from "../context/context.jsx";
const MemoryBlock = () => {
	const {memory,setMemory,register} = useContext(SimContext)
	console.log(register);
	
	return (
			
			<div className="mem-block">
				<h1>Memory</h1>
				{memory.map((mem, index) => (
					<div key={index} className="">
					{index.toString(16).toUpperCase().padStart(2, "0")}: {mem[index.toString(16).padStart(2, "0")]}
					</div>
				))}
			</div>
	);
};

export default MemoryBlock;
