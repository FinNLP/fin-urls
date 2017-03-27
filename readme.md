# Fin-URLs
Detecting URLs, emails, and IP addresses, for Fin Natural language processor.


## The Problem

The core lexer doesn't treat URLs, emails and IP addresses any differently, so it will separate between the `www` and `google` and consider them as separate tokens when presented with the string `www.google`. This is obviously inaccurate, and will lead to many inaccuracies in the POS tagger and the dependency parser

The solution to this problem is to have an preprocessor function that takes out the URLs and a postprocessor function that puts them back after the lexer, the POS tagger and the dependency parser are done with the sentence.

And while we're at it, we can attach a detector to the prototype that gives you the URLs that have been detected.

## Installation

```
npm i --save fin-urls
```

## Usage

```typescript
import * as Fin from "finnlp";
import "fin-urls";

const input = "Here's an email alex@arrayy.com. and a website: www.google.com."
const instance = new Fin.Run(input);
const result = instance.links();
const links = result.filter((link)=>link);

console.log(result);
console.log(links);

```

The above example will give you:

```json
[
    [false,false,false,false,{"type":"email","token":"alex@arrayy.com"},false],
    [false,false,false,false,{"type":"url","token":"www.google.com"}]
]
```

```json
[
    [{"type":"email","token":"alex@arrayy.com"}],
    [{"type":"url","token":"www.google.com"}]
]
```

