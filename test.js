const assert = require('assert');
const fin = require('finnlp');
fin.extend(require('./index.js'));

var instance = new fin(`
	I sent you an email on alex@arrayy.com, about the issue (github.com/alexcorvi/anchorme.js/issues/30) I submitted.
	It concerns the current state of the art pos taggers (www.aclweb.org/aclwiki/index.php?title=POS_Tagging_(State_of_the_art)).
	I've also addressed some issues regrading the IP address you sent: "172.36.21.22:3000/ink".
`);

var urls = instance.urls();

describe('URL detection', function () {
	it('Detecting emails', function () {
		assert.equal(urls[0][0].index,6);
	});
	it('Detecting urls', function () {
		assert.equal(urls[0][1].index,11);
		assert.equal(urls[1][0].index,11);
	});
	it('Detecting IPs', function () {
		assert.equal(urls[2][0].index,14);
	});
});