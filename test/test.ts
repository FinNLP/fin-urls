/// <reference path="../node_modules/@types/node/index.d.ts" />

import * as Fin from "finnlp";
import "../src/index";

function fail (msg:string){
	console.error(`\t ❌ Fail: ${msg}`);
	process.exit(1);
}

function pass (msg:string) {
	console.log(`\t ✔ Passed: ${msg}`);
}

function assert (sentence:string,expectedNum:number) {
	const inst = new Fin.Run(sentence);
	const result = inst.links()[0].length;
	if(result === expectedNum) pass(sentence);
	else fail(`sentence ${sentence} detected ${result} links while we were expecting ${expectedNum}. Here's the interception result: ${inst.intercepted}`);
}

assert("http://google.com this is link??",1);
assert("google.com this is link??",1);
assert("mail@gmail.com this is link??",1);
assert("facebook.com this is link??",1);
assert("school.com this is link??",1);