/* eslint-disable no-unused-vars */
import { useContext, useEffect } from "react";
import { SimContext } from "../context/context";

let codeLength;
let programCounter;

export function LoadToMemory(memory, code, start) {
	cleanMemory(memory);
	codeLength = code.length * 2;
	programCounter = start;
	for (let i = parseInt(start, 16), j = 0; j < code.length; i += 2, j++) {
		memory[i] = {
			[i.toString(16).padStart(2, "0")]: code[j].substring(0, 2),
		};
		memory[i + 1] = {
			[(i + 1).toString(16).padStart(2, "0")]: code[j].substring(2),
		};
	}

	return memory;
}

export function RunCode(register, memory, start, step) {
	let pc = programCounter;
	for (let i = parseInt(pc, 16); i < 256; i += 2) {
		if (Object.values(memory[i])[0] == "C0") {
			break;
		}
		i = parseInt(pc, 16);

		let fullCode = fetch(memory[i], memory[i + 1]);
		let decodedInstruction = decode(fullCode);
		let newPc = execute(
			decodedInstruction[0],
			decodedInstruction[1],
			memory,
			register,
			pc
		);
		console.log(newPc.pc);
		pc = newPc.pc;
		programCounter = newPc.pc;
		if (step) {
			break;
		}
	}

	return { register, memory, pc };
}

function fetch(code1, code2) {
	let fullCode = Object.values(code1)[0] + Object.values(code2)[0];
	return fullCode;
}

function decode(code) {
	let opCode = code[0];
	let operand = code.substring(1);
	return [opCode, operand];
}
function execute(opCode, operand, memory, register, pc) {
	pc = (parseInt(pc, 16) + 2).toString(16).padStart(2, "0");

	if (opCode == "1") {
		let regStr = operand[0].padStart(2, "0");
		let reg = parseInt(operand[0].padStart(2, "0"), 16);
		register[reg] = {
			[regStr]: Object.values(memory[parseInt(operand.substring(1))])[0],
		};
	} else if (opCode == "2") {
		let reg = operand[0].padStart(2, "0");
		register[parseInt(reg, 16)] = { [reg.toLowerCase()]: operand.substring(1) };
	} else if (opCode == "3") {
		let memCell = operand.substring(1).padStart(2, "0");
		let regValue = Object.values(register[parseInt(operand[0], 16)])[0];
		memory[parseInt(memCell, 16)] = {
			[memCell.toLowerCase()]: regValue,
		};
	}

	return { pc, memory, register };
}
function cleanMemory(memory) {
	for (let i = 0; i < memory.length; i++) {
		memory[i] = { [i.toString(16).padStart(2, "0")]: "00" };
	}
}
