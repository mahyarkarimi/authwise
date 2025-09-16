// Script to generate RSA key pairs for JWT signing and verification
// Generates 2 key pairs for OAuth server and 1 for admin criteria

const { generateKeyPairSync } = require('crypto');
const fs = require('fs');
const path = require('path');

function writeKeyPair(name, dir = '.') {
  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });
  fs.writeFileSync(path.join(dir, `${name}.public.pem`), publicKey);
  fs.writeFileSync(path.join(dir, `${name}.private.pem`), privateKey);
  console.log(`Generated key pair: ${name}`);
}

const outputDir = path.join(__dirname, 'apps/api/keys');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

writeKeyPair('jwtAccess', outputDir);
writeKeyPair('jwtRefresh', outputDir);
writeKeyPair('admin', outputDir);

console.log('All key pairs generated in ./keys directory.');
