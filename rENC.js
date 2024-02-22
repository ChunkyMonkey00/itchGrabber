/* Comp setup */

const chars = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";
const fuzzChars = "!@#$%^&*()[{]}\|;:,<.>/?";

function generateUUID(len) {
  // Returns a string UUID
  let UUID = "";

  for(var i = 0;i<len;i++) {
    let rnd = Math.floor(Math.random() * chars.length);
    let char = chars[rnd];
    UUID += char;
  }

  return UUID;
}

function pushFuzz(str, len) {
  let _fUUID = str;

  for (var i = 0; i < len; i++) {
    let rnd = Math.floor(Math.random() * fuzzChars.length);
    let rnd2 = Math.floor(Math.random() * str.length);
    let char = fuzzChars[rnd];
    _fUUID = _fUUID.slice(0, rnd2) + char + _fUUID.slice(rnd2);
  }

  return _fUUID;
}

function removeFuzz(str) {
  for (var i = 0; i < str.length; i++) {
    if (fuzzChars.includes(str[i])) {
      str = str.slice(0, i) + str.slice(i + 1);
      i--;
    }
  }

  return str;
}

function generateKeys(str) {
  return btoa(str);
}

function decodeKeys(str) {
  return atob(str);
}

/* End setup */

// Generate UUID
var UUID = generateUUID(1674);
console.log(UUID);

// Generate fuzzed UUID
const fUUID = pushFuzz(UUID, 756);
console.log(fUUID);

// encrypt UUID
const eUUID = generateKeys(fUUID);
console.log(eUUID);

// decrypt UUID
const dUUID = decodeKeys(eUUID);
console.log(dUUID);

// unfuzz UUID
UUID = removeFuzz(dUUID);
console.log(UUID);

/* What i need to do:

- develop an encryption method to encrypt ALL the fuzz in a way base64 wont understand

- Encode fuzz as rENC
- Push all coded fuzz into string
- Encode as base64

- Decode base64
- Decode rENC
- Remove all fuzz from string

*/
