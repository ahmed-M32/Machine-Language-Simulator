/* eslint-disable no-unused-vars */
import { useContext } from "react";
import { SimContext } from "../context/context.jsx";

const MemoryBlock = () => {
	const { memory } = useContext(SimContext);

	return (
		<div className="mem-block">
			<h1>Memory</h1>

			<div className="memory-block">
				<div className="memory-grid">
					{memory.map((mem, index) => (
						<div key={index} className="memory-cell">
							{index.toString(16).toUpperCase().padStart(2, "0")}:{" "}
							{mem[index.toString(16).padStart(2, "0")]}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default MemoryBlock;
