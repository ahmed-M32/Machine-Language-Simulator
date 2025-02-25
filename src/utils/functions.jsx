/* eslint-disable no-unused-vars */
import { useContext ,useEffect } from "react"
import { SimContext } from "../context/context"



export function LoadToMemory  (memory,code,start)  {
    console.log(code);
    for(let i = parseInt(start,16);i<code.length*2;i+=2){
        console.log(i);
        
        memory[i]= {[i.toString(16).padStart(2,"0")]: code[i/2].substring(0,2)}
        memory[i+1] = {[(i+1).toString(16).padStart(2,"0")]: code[i/2].substring(2)}
    }
    console.log(memory);
    
    return memory
};


export function RunCode(register,memory,start){

    return {register,memory}
}



function fetch(){

}

function decode(){

}
function execute(){
    
}
