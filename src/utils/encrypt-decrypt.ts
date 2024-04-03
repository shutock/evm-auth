import CryptoJS from "crypto-js";

const SECRET = "";

export const encrypt = (data: any) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET).toString();
};

export const decrypt = <T = object>(data: string) => {
  return JSON.parse(
    CryptoJS.AES.decrypt(data, SECRET).toString(CryptoJS.enc.Utf8)
  ) as T;
};
