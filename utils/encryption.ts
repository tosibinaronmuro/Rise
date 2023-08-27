import crypto from "crypto"

const generatePublicKey = () => {
    const publicKeyLength = 32; // Desired length of the public key in bytes
    const publicKey = crypto.randomBytes(publicKeyLength).toString('hex');
    return publicKey;
  };

  export {generatePublicKey}