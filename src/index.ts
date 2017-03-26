import anchorme from "anchorme";
import * as Fin from "finnlp";

// detected links registry
const links:string[] = [];

// interceptor
Fin.interceptors.push(function(string:string){
	anchorme(string,{list:true})
	.forEach((match:any,index:number)=>{
		console.log(match.raw);
		links[index] = match.raw;
		string = string.split(match.raw).join("DetectedLINK"+index);
	});
	return string;
});


// detector
declare module "finnlp" {
	export interface Run {
		links:()=>string[][];
	}
}

Fin.Run.prototype.links = function(this:Fin.Run){
	const result:string[][] = [];
	this.sentences.forEach((sentence,sentenceIndex)=>{
		result[sentenceIndex] = sentence.tokens
		.filter(x=>/^(DetectedLINK)(\d)+$/.test(x))
		.map(link=>parseInt(link.replace(/^DetectedLINK/,"")))
		.map(indexInTheRegistry=>links[indexInTheRegistry]);
	});
	return result;
};