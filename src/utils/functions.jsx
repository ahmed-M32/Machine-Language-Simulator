/* eslint-disable no-unused-vars */
import { useContext, useEffect } from "react";
import { SimContext } from "../context/context";

let codeLength;

export function LoadToMemory(memory, code, start) {
	cleanMemory(memory);
	codeLength = code.length * 2;
	for (let i = parseInt(start, 16), j = 0; j < code.length; i += 2, j++) {
		console.log(i);

		memory[i] = {
			[i.toString(16).padStart(2, "0")]: code[j].substring(0, 2),
		};
		memory[i + 1] = {
			[(i + 1).toString(16).padStart(2, "0")]: code[j].substring(2),
		};
	}
	console.log(memory);

	return memory;
}

export function RunCode(register, memory, start, step) {
	for (let i = parseInt(start, 16); i < codeLength; i+=2) {
        let fullCode = Object.values(memory[i])[0]+Object.values(memory[i+1])[0]
        console.log(fullCode);
        
		if (step) {
			break;
		}
	}
	return { register, memory };
}

function fetch(addres, code) {}

function decode() {}
function execute() {}
function cleanMemory(memory) {
	for (let i = 0; i < memory.length; i++) {
		memory[i] = { [i.toString(16).padStart(2, "0")]: "00" };
	}
}
