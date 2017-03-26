import anchorme from "anchorme";
import * as Fin from "finnlp";

// detected links registry
let links:string[] = [];


// preProcessor
Fin.preProcessors.push(function(string:string){
	anchorme(string,{list:true})
	.forEach((match:any,index:number)=>{
		links[index] = match.raw;
		string = string.split(match.raw).join("DetectedLINK"+index);
	});
	return string;
});

// postProcessor
Fin.postProcessors.push(function(processingResult:Fin.Run){
	processingResult.sentences.forEach((sentence,sentenceIndex)=>{
		sentence.tokens.forEach((token,tokenIndex)=>{
			if(/^(DetectedLINK)(\d)+$/.test(token)) {
				let linkIndex = parseInt(token.replace(/^DetectedLINK/,""));
				processingResult.sentences[sentenceIndex].tokens[tokenIndex] = links[linkIndex];
			}
		});
	});
	//links = [];
	return processingResult;
});

// detector
declare module "finnlp" {
	export interface Run {
		links:()=>({type:string,url:string}|false)[][];
	}
}

Fin.Run.prototype.links = function(this:Fin.Run){
	const result:({type:string,url:string}|false)[][] = [];
	this.sentences.forEach((sentence,sentenceIndex)=>{
		result[sentenceIndex] = sentence.tokens
		.map((token)=>{
			const result = anchorme(token,{list:true});
			if(!result.length) return false;
			else return {
				type:result[0].reason,
				url:result[0].raw
			};
		});
	});
	return result;
};