import anchorme from "anchorme";

const links:string[] = [];


const interceptor = {
	type:"interceptor",
	function (string:string):string {
		(anchorme(string,{list:true}) as string[])
		.forEach((match,index)=>{
			links[index] = match;
			string.split(match).join("DetectedLINK"+index);
		});
		return string;
	}
};

const detector = {
	type:"detector",
	extension:(input:any) => {
		input.links = function(){
			return links;
		};
		return input;
	}
};

export default [interceptor,detector];