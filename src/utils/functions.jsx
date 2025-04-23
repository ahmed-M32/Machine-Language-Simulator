/* eslint-disable no-unused-vars */
import { useContext, useEffect } from "react";
import { SimContext } from "../context/context";

let codeLength;
let programCounter;

const or = (a, b) => a | b;
const and = (a, b) => a & b;
const xor = (a, b) => a ^ b;

export function LoadToMemory(memory, code, start) {
	cleanMemory(memory);
	codeLength = code.length * 2;
	programCounter = start;

	for (let i = parseInt(start, 16), j = 0; j < code.length; i += 2, j++) {
		storeInMemory(memory, i, code[j]);
	}
	return memory;
}

export function RunCode(register, memory, start, step) {
	let pc = programCounter;

	for (let i = parseInt(pc, 16); i < 256; i += 2) {
		if (getMemoryValue(memory[i]) === "C0") {
			break;
		}

		i = parseInt(pc, 16);
		let fullCode = fetch(memory[i], memory[i + 1]);
		let [opCode, operand] = decode(fullCode);
		let newPc = execute(opCode, operand, memory, register, pc);

		pc = newPc.pc;
		programCounter = newPc.pc;

		if (step) break;
	}

	return { register, memory, pc };
}

function storeInMemory(memory, address, code) {
	memory[address] = { [toHex(address)]: code.substring(0, 2) };
	memory[address + 1] = { [toHex(address + 1)]: code.substring(2) };
}

function fetch(code1, code2) {
	return getMemoryValue(code1) + getMemoryValue(code2);
}

function decode(code) {
	return [code[0], code.substring(1)];
}

function execute(opCode, operand, memory, register, pc) {
	pc = toHex(parseInt(pc, 16) + 2);

	if (opCode === "1") {
		storeInRegister(
			register,
			operand[0],
			getMemoryValue(memory[parseInt(operand.substring(1))])
		);
	} else if (opCode === "2") {
		storeInRegister(register, operand[0], operand.substring(1));
	} else if (opCode === "3") {
		storeInMemory(
			memory,
			parseInt(operand.substring(1), 16),
			getMemoryValue(register[parseInt(operand[0], 16)])
		);
	} else if (opCode == "4") {
		storeInRegister(
			register,
			operand[2],
			getMemoryValue(register[parseInt(operand[1], 16)])
		);
	} else if (opCode == "5") {
		let num1 = codeToReg(operand[1], register);
		let num2 = codeToReg(operand[2], register);
		let reg = operand[0].padStart(2, "0");
		console.log(num1, "  ", num2);

		let sum = (parseInt(num1, 16) + parseInt(num2, 16))
			.toString(16)
			.padStart(2, "0");
		console.log(sum);

		storeInRegister(register, reg, sum);
	} else if (opCode === "6") {
		/* Test cases for opcode 6 (Floating-point addition):
		 * Format: 1-bit sign, 3-bit exponent (bias 3), 4-bit mantissa
		 *
		 * Example 1: Adding 1.5 + 1.5 = 3.0
		 * 1.5 in binary = 1.1
		 * Register format: 0 011 1000 (0x38) - positive, exp=3, mantissa=1000
		 * Expected: 3.0 = 0 100 0000 (0x40) - positive, exp=4, mantissa=0000
		 *
		 * Example 2: Adding 1.0 + (-0.5) = 0.5
		 * 1.0 = 0 011 0000 (0x30)
		 * -0.5 = 1 010 0000 (0xA0)
		 * Expected: 0.5 = 0 010 0000 (0x20)
		 *
		 * Example 3: Adding 0.25 + 0.25 = 0.5
		 * 0.25 = 0 001 0000 (0x10)
		 * 0.25 = 0 001 0000 (0x10)
		 * Expected: 0.5 = 0 010 0000 (0x20)
		 *
		 * Example 4: Adding 2.0 + 2.0 = 4.0
		 * 2.0 = 0 100 0000 (0x40)
		 * 2.0 = 0 100 0000 (0x40)
		 * Expected: 4.0 = 0 101 0000 (0x50)
		 *
		 * Example 5: Adding -1.5 + (-1.5) = -3.0
		 * -1.5 = 1 011 1000 (0xB8)
		 * -1.5 = 1 011 1000 (0xB8)
		 * Expected: -3.0 = 1 100 0000 (0xC0)
		 */
		let reg1 = parseInt(operand[1], 16);
		let reg2 = parseInt(operand[2], 16);
		let reg3 = parseInt(operand[0], 16);

		let val1 = floatingPointToDec(Object.values(register[reg1])[0]);
		let val2 = floatingPointToDec(Object.values(register[reg2])[0]);
		console.log(register[reg1]);

		let result = decToFloating(val1 + val2);

		register[reg3] = { [toHex(reg3)]: result };
	} else if (opCode === "7") {
		let reg1 = parseInt(codeToReg(operand[1], register), 16);
		let reg2 = parseInt(codeToReg(operand[2], register), 16);

		let result = bitwiseOp(reg1, reg2, or).toString(16).padStart(2, "0");

		storeInRegister(register, operand[0].padStart(2, "0"), result);
	} else if (opCode === "8") {
		let reg1 = parseInt(codeToReg(operand[1], register), 16);
		let reg2 = parseInt(codeToReg(operand[2], register), 16);

		let result = bitwiseOp(reg1, reg2, and).toString(16).padStart(2, "0");

		storeInRegister(register, operand[0].padStart(2, "0"), result);
	} else if (opCode === "9") {
		let reg1 = parseInt(codeToReg(operand[1], register), 16);
		let reg2 = parseInt(codeToReg(operand[2], register), 16);

		let result = bitwiseOp(reg1, reg2, xor).toString(16).padStart(2, "0");

		storeInRegister(register, operand[0].padStart(2, "0"), result);
	} else if (opCode === "A") {
		let num = parseInt(codeToReg(operand[0],register), 16).toString(2);
		let res = parseInt(rotate(num.padStart(8,"0"), parseInt(operand[2], 10)), 2)
			.toString(16)
			.padStart(2, "0");


			console.log(res);
			
		storeInRegister(register, operand[0].padStart(2, "0"), res);
	} else {
		let reg1 = operand[0].padStart(2,"0")

		let reg0 = Object.values(register[0])[0]
		if(reg1 == reg0){
			pc = operand.substring(1)
		}
	}

	return { pc, memory, register };
}

function rotate(num, shift) {
	console.log(num,shift);
	
	num =  num.slice(-shift) + num.slice(0, -shift)
	console.log(num);
	
	return num;
}
function storeInRegister(register, regIndex, value) {
	let reg = parseInt(regIndex, 16);
	register[reg] = { [toHex(reg)]: value };
}

function getMemoryValue(memoryCell) {
	return Object.values(memoryCell)[0];
}

function toHex(value) {
	return value.toString(16).padStart(2, "0");
}

function cleanMemory(memory) {
	for (let i = 0; i < memory.length; i++) {
		memory[i] = { [toHex(i)]: "00" };
	}
}

function floatingPointToDec(num) {
	let decNum = parseInt(num, 16);

	let Num = decNum.toString(2).padStart(8, "0");

	let sign = Num[0];
	let exp = Num.substring(1, 4);
	let mantissa = Num.substring(4);

	let decimalAfterPoint =
		parseInt(mantissa[0], 2) * 0.5 +
		parseInt(mantissa[1], 2) * 0.25 +
		parseInt(mantissa[2], 2) * 0.125 +
		parseInt(mantissa[3], 2) * 0.0625;

	let decimalValue = (1 + decimalAfterPoint) * 2 ** (parseInt(exp, 2) - 3);
	decimalValue = sign == "0" ? decimalValue : -decimalValue;

	return decimalValue;
}

function decToFloating(num) {
	let finalNum = "";
	// Handle sign bit
	finalNum = num < 0 ? "1" : "0";
	num = Math.abs(num);

	// Convert to binary string
	let intPart = Math.floor(num);
	let floatPart = num - intPart;

	// Convert integer part to binary
	let binNum = intPart !== 0 ? intPart.toString(2) : "0";
	binNum += ".";

	// Convert decimal part to binary (up to 10 bits precision)
	for (let i = 0; i < 10 && floatPart > 0; i++) {
		floatPart *= 2;
		if (floatPart >= 1) {
			binNum += "1";
			floatPart -= 1;
		} else {
			binNum += "0";
		}
	}

	// Find the position of the first '1'
	let firstOnePos = binNum.indexOf("1");
	if (firstOnePos === -1) {
		// Handle zero case
		return "00";
	}

	// Calculate the shift needed to normalize
	let pointPos = binNum.indexOf(".");
	let shift;
	if (firstOnePos < pointPos) {
		shift = pointPos - firstOnePos - 1;
	} else if (firstOnePos > pointPos) {
		shift = pointPos - firstOnePos;
	} else {
		shift = 0;
	}

	// Calculate exponent (bias of 3)
	let exponent = (3 + shift).toString(2).padStart(3, "0");
	if (parseInt(exponent, 2) > 7 || parseInt(exponent, 2) < 0) {
		console.warn("Number out of representable range");
		return num > 0 ? "7F" : "FF"; // Return max value with appropriate sign
	}

	// Extract mantissa (4 bits after the first 1)
	let normalizedNum = binNum.replace(".", "").substring(firstOnePos + 1);
	let mantissa = normalizedNum.padEnd(4, "0").substring(0, 4);

	// Combine all parts
	finalNum += exponent + mantissa;
	return parseInt(finalNum, 2).toString(16).padStart(2, "0").toUpperCase();
}

function bitwiseOp(num1, num2, op) {
	return op(num1, num2);
}

function codeToReg(code, register) {
	let final = code.padStart(2, "0");
	return Object.values(register[parseInt(final, 16)])[0];
}
/*

0 000 0001
0 000 0000



1.+1/16

1


2+1/16


10.0001

       0 001 1000
 */
