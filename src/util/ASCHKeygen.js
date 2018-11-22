import KeyPair from '../models/KeyPair';
import Mnemonic from './Mnemonic';
//import {PrivateKey} from 'eosjs-ecc';
var AschJS = require('asch-js');

export default class ASCHKeygen {

    /***
     * Generates a KeyPair
     * @returns {KeyPair}
     */
    static generateKeys(){
        let [mnemonic, seed] = Mnemonic.generateDanglingMnemonic();
        // let privateKey = EOSKeygen.generatePrivateKey(seed);
        // let publicKey = EOSKeygen.privateToPublic(privateKey);
        let keys = AschJS.crypto.getKeys(mnemonic);
        let privateKey = keys.privateKey;
        let publicKey =  keys.publicKey;
        return KeyPair.fromJson({publicKey, privateKey})
    }

    /***
     * Generates only a private key
     * @param seed - The seed to build the key from
     * @returns {wif}
     */
    // static generatePrivateKey(seed) {
    //     return PrivateKey.fromSeed(seed).toWif()
    // }

    /***
     * Converts a private key to a public key
     * @param privateKey - The private key to convert
     */
    // static privateToPublic(privateKey) {
    //     return PrivateKey.fromWif(privateKey).toPublic().toString()
    // }

    /***
     * Checks if a private key is a valid EOS private key
     * @param privateKey - The private key to check
     * @returns {boolean}
     */
    // static validPrivateKey(privateKey){
    //     return PrivateKey.isValid(privateKey);
    // }

}