/*
Copyright (c) 2011, Daniel Guerrero
All rights reserved.
Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL DANIEL GUERRERO BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * Uses the new array typed in javascript to binary base64 encode/decode
 * at the moment just decodes a binary base64 encoded
 * into either an ArrayBuffer (decodeArrayBuffer)
 * or into an Uint8Array (decode)
 * 
 * References:
 * https://developer.mozilla.org/en/JavaScript_typed_arrays/ArrayBuffer
 * https://developer.mozilla.org/en/JavaScript_typed_arrays/Uint8Array
 */

const Base64Binary = {
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	removePaddingChars: function(input){
		let count = 0;
		var lkey = Base64Binary._keyStr.indexOf(input.charAt(input.length - 1));
		while(lkey === 64){
			count++;
			if (count > 2) {
				throw new Error(`Invalid base64 padding.`);
			}
			input = input.substring(0,input.length - 1);
			lkey = Base64Binary._keyStr.indexOf(input.charAt(input.length - 1));
		}
		return count;
	},

	decodeArrayBuffer: function (input) {
		//get last chars to see if are valid
		let padlen = Base64Binary.removePaddingChars(input);
		var bytes = parseInt((input.length / 4) * 3 - padlen, 10);
		
		let chr1, chr2, chr3;
		let enc1, enc2, enc3, enc4;
		let j = 0;
		
		const arrayBuffer = new ArrayBuffer(bytes);
		const uarray = new Uint8Array(arrayBuffer);
		
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		
		for (let i=0; i<bytes; i+=3) {
			//get the 3 octects in 4 ascii chars
			enc1 = Base64Binary._keyStr.indexOf(input.charAt(j++));
			enc2 = Base64Binary._keyStr.indexOf(input.charAt(j++));
			enc3 = Base64Binary._keyStr.indexOf(input.charAt(j++));
			enc4 = Base64Binary._keyStr.indexOf(input.charAt(j++));
	
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
	
			uarray[i] = chr1;			
			if (enc3 !== 64) uarray[i+1] = chr2;
			if (enc4 !== 64) uarray[i+2] = chr3;
		}
	
		return arrayBuffer;	
	}
}

export default Base64Binary;