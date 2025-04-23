/* eslint-disable no-unused-vars */
import { useContext, useEffect } from "react";
import { SimContext } from "../context/context";

let codeLength;
let programCounter;

const or = (a, b) => a | b;
const and = (a, b) => a & b;
const xor = (a, b) => a ^ b;

// ==== Public API ====

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

	while (parseInt(pc, 16) < 256) {
		if (getMemoryValue(memory[parseInt(pc, 16)]) === "C0") break;

		let fullCode = fetch(memory[parseInt(pc, 16)], memory[parseInt(pc, 16) + 1]);
		let [opCode, operand] = decode(fullCode);
		let newPc = execute(opCode, operand, memory, register, pc);

		pc = newPc.pc;
		programCounter = newPc.pc;

		if (step) break;
	}

	return { register, memory, pc };
}

// ==== Core Instruction Helpers ====

function execute(opCode, operand, memory, register, pc) {
	pc = toHex(parseInt(pc, 16) + 2);

	const r0 = operand[0].padStart(2, "0");
	const r1 = operand[1];
	const r2 = operand[2];

	switch (opCode) {
		case "1":
			return executeLoadMemToReg(r0, operand.substring(1), memory, register, pc);
		case "2":
			return executeLoadImmToReg(r0, operand.substring(1), register, pc);
		case "3":
			return executeStoreRegToMem(r0, operand.substring(1), memory, register, pc);
		case "4":
			return executeLoadFromRegPointer(r2, r1, register, pc);
		case "5":
			return executeAddHex(r0, r1, r2, register, pc);
		case "6":
			return executeFloatingAdd(r0, r1, r2, register, pc);
		case "7":
			return executeBitwiseOp(r0, r1, r2, register, or, pc);
		case "8":
			return executeBitwiseOp(r0, r1, r2, register, and, pc);
		case "9":
			return executeBitwiseOp(r0, r1, r2, register, xor, pc);
		case "A":
			return executeRotate(r0, r2, register, pc);
		default:
			return executeConditionalJump(r0, operand.substring(1), register, pc);
	}
}

function executeLoadMemToReg(regIndex, memAddr, memory, register, pc) {
	const value = getMemoryValue(memory[parseInt(memAddr)]);
	storeInRegister(register, regIndex, value);
	return { pc, memory, register };
}

function executeLoadImmToReg(regIndex, value, register, pc) {
	storeInRegister(register, regIndex, value);
	return { pc, memory: null, register };
}

function executeStoreRegToMem(regIndex, memAddr, memory, register, pc) {
	const value = codeToReg(regIndex, register);
	const addr = parseInt(memAddr, 16);
	memory[addr] = { [toHex(addr)]: value };
	return { pc, memory, register };
}

function executeLoadFromRegPointer(targetReg, pointerReg, register, pc) {
	const source = getMemoryValue(register[parseInt(pointerReg, 16)]);
	storeInRegister(register, targetReg, source);
	return { pc, memory: null, register };
}

function executeAddHex(destReg, reg1, reg2, register, pc) {
	const val1 = parseInt(codeToReg(reg1, register), 16);
	const val2 = parseInt(codeToReg(reg2, register), 16);
	const sum = toHex(val1 + val2);
	storeInRegister(register, destReg, sum);
	return { pc, memory: null, register };
}

function executeFloatingAdd(destReg, reg1, reg2, register, pc) {
	const val1 = floatingPointToDec(Object.values(register[parseInt(reg1, 16)])[0]);
	const val2 = floatingPointToDec(Object.values(register[parseInt(reg2, 16)])[0]);
	const result = decToFloating(val1 + val2);
	register[parseInt(destReg, 16)] = { [toHex(parseInt(destReg, 16))]: result };
	return { pc, memory: null, register };
}

function executeBitwiseOp(destReg, reg1, reg2, register, operation, pc) {
	const val1 = parseInt(codeToReg(reg1, register), 16);
	const val2 = parseInt(codeToReg(reg2, register), 16);
	const result = toHex(operation(val1, val2));
	storeInRegister(register, destReg, result);
	return { pc, memory: null, register };
}

function executeRotate(regIndex, shiftStr, register, pc) {
	const binVal = parseInt(codeToReg(regIndex, register), 16).toString(2).padStart(8, "0");
	const rotated = rotate(binVal, parseInt(shiftStr, 10));
	const result = toHex(parseInt(rotated, 2));
	storeInRegister(register, regIndex, result);
	return { pc, memory: null, register };
}

function executeConditionalJump(testReg, newPc, register, pc) {
	const regVal = codeToReg(testReg, register);
	const reg0 = Object.values(register[0])[0];

	if (regVal === reg0) {
		pc = toHex(parseInt(newPc, 16));
	}
	return { pc, memory: null, register };
}

// ==== Utilities ====

function storeInMemory(memory, address, code) {
	memory[address] = { [toHex(address)]: code.substring(0, 2) };
	memory[address + 1] = { [toHex(address + 1)]: code.substring(2) };
}

function storeInRegister(register, regIndex, value) {
	const reg = parseInt(regIndex, 16);
	register[reg] = { [toHex(reg)]: value };
}

function fetch(code1, code2) {
	return getMemoryValue(code1) + getMemoryValue(code2);
}

function decode(code) {
	return [code[0], code.substring(1)];
}

function getMemoryValue(memoryCell) {
	return Object.values(memoryCell)[0];
}

function codeToReg(code, register) {
	const index = parseInt(code.padStart(2, "0"), 16);
	return Object.values(register[index])[0];
}

function toHex(value) {
	return value.toString(16).padStart(2, "0");
}

function cleanMemory(memory) {
	for (let i = 0; i < memory.length; i++) {
		memory[i] = { [toHex(i)]: "00" };
	}
}

function rotate(num, shift) {
	return num.slice(-shift) + num.slice(0, -shift);
}

// ==== Floating Point Conversion ====

function floatingPointToDec(num) {
	const binary = parseInt(num, 16).toString(2).padStart(8, "0");
	const sign = binary[0];
	const exp = binary.slice(1, 4);
	const mantissa = binary.slice(4);

	const decimalMantissa =
		parseInt(mantissa[0], 2) * 0.5 +
		parseInt(mantissa[1], 2) * 0.25 +
		parseInt(mantissa[2], 2) * 0.125 +
		parseInt(mantissa[3], 2) * 0.0625;

	let value = (1 + decimalMantissa) * 2 ** (parseInt(exp, 2) - 3);
	return sign === "0" ? value : -value;
}

function decToFloating(num) {
	let signBit = num < 0 ? "1" : "0";
	num = Math.abs(num);

	let intPart = Math.floor(num);
	let floatPart = num - intPart;
	let binNum = (intPart !== 0 ? intPart.toString(2) : "0") + ".";

	for (let i = 0; i < 10 && floatPart > 0; i++) {
		floatPart *= 2;
		binNum += floatPart >= 1 ? "1" : "0";
		if (floatPart >= 1) floatPart -= 1;
	}

	let firstOnePos = binNum.indexOf("1");
	if (firstOnePos === -1) return "00";

	let pointPos = binNum.indexOf(".");
	let shift = firstOnePos < pointPos ? pointPos - firstOnePos - 1 : pointPos - firstOnePos;

	let exponent = (3 + shift).toString(2).padStart(3, "0");
	if (parseInt(exponent, 2) > 7 || parseInt(exponent, 2) < 0) return num > 0 ? "7F" : "FF";

	let normalized = binNum.replace(".", "").slice(firstOnePos + 1).padEnd(4, "0").slice(0, 4);

	return parseInt(signBit + exponent + normalized, 2).toString(16).padStart(2, "0").toUpperCase();
}
