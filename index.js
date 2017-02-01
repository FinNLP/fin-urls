const anchorme = require('anchorme');
const lexicon = require('en-lexicon');
var links = [];

const putPlaceHolders = {
	id:"lexer-transformer",
	extension:{
		level:"sentence",
		when:"initial",
		transformer:function(str){
			links = anchorme(str,{list:true}).map(x=>x.raw);
			var lexiconExtension = {};
			for (var i = links.length - 1; i >= 0; i--) {
				str = str.split(links[i]).join(` LINK-PLACEHOLDER-${i} `);
				lexiconExtension[links[i]] = "NNP";
			}
			lexicon.extend(lexiconExtension);
			return str;
		}
	}
};


const putLinksBack = {
	id:"lexer-transformer",
	extension:{
		level:"token",
		when:"initial",
		transformer:function(arr){
			arr = arr.map((token)=>{
				if(typeof token === "string" && token.startsWith("LINK-PLACEHOLDER-")) {
					return {
						token:links[token.substr(17)*1],
						meta:{
							link:true,
							pos:"NNP",
							i:token,
						}
					};
				}
				else return token;
			});
			return arr;
		}
	}
};

const detector = {
	id:"urls",
	extension:function(){
		this.result.forEach((sentence,si)=>{
			this.result[si].urls = [];
			sentence.tokens.forEach((token,i)=>{
				if(anchorme.validate.ip(token)) 		sentence.urls.push({token:token,index:i,type:"ip"});
				else if(anchorme.validate.email(token)) sentence.urls.push({token:token,index:i,type:"email"});
				else if(anchorme.validate.url(token)) 	sentence.urls.push({token:token,index:i,type:"url"});
			});
		});
		return this.result.map(s=>s.urls);
	}
};


module.exports = [
	putPlaceHolders,
	putLinksBack,
	detector
];