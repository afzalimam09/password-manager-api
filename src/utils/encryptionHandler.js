import CryptoJS from "crypto-js";
import config from "../config/config.js";

const encrypt = (joinedData) => {
    return CryptoJS.AES.encrypt(joinedData, config.enc.secret).toString();
};

const decrypt = (encData) => {
    return CryptoJS.AES.decrypt(encData, config.enc.secret).toString(
        CryptoJS.enc.Utf8
    );
};

export { encrypt, decrypt };
