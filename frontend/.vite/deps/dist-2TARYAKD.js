import {
  require_sha3
} from "./chunk-AZWTAXIN.js";
import {
  D,
  g,
  h,
  init_hooks_module,
  init_preact_module,
  y
} from "./chunk-R5AHIGTF.js";
import {
  import_index
} from "./chunk-D5VI4NRZ.js";
import "./chunk-7HO5RVPZ.js";
import {
  sha256
} from "./chunk-2P3OXF37.js";
import {
  bytesToHex
} from "./chunk-Z3MPRPDR.js";
import {
  __commonJS,
  __toESM
} from "./chunk-ONY6HBPH.js";

// node_modules/@coinbase/wallet-sdk/dist/vendor-js/eth-eip712-util/util.cjs
var require_util = __commonJS({
  "node_modules/@coinbase/wallet-sdk/dist/vendor-js/eth-eip712-util/util.cjs"(exports, module) {
    var { keccak_256 } = require_sha3();
    function zeros(bytes) {
      return Buffer.allocUnsafe(bytes).fill(0);
    }
    function bitLengthFromBigInt(num) {
      return num.toString(2).length;
    }
    function bufferBEFromBigInt(num, length) {
      let hex = num.toString(16);
      if (hex.length % 2 !== 0) hex = "0" + hex;
      const byteArray = hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16));
      while (byteArray.length < length) {
        byteArray.unshift(0);
      }
      return Buffer.from(byteArray);
    }
    function twosFromBigInt(value, width) {
      const isNegative = value < 0n;
      let result;
      if (isNegative) {
        const mask = (1n << BigInt(width)) - 1n;
        result = (~value & mask) + 1n;
      } else {
        result = value;
      }
      result &= (1n << BigInt(width)) - 1n;
      return result;
    }
    function setLength(msg, length, right) {
      const buf = zeros(length);
      msg = toBuffer(msg);
      if (right) {
        if (msg.length < length) {
          msg.copy(buf);
          return buf;
        }
        return msg.slice(0, length);
      } else {
        if (msg.length < length) {
          msg.copy(buf, length - msg.length);
          return buf;
        }
        return msg.slice(-length);
      }
    }
    function setLengthRight(msg, length) {
      return setLength(msg, length, true);
    }
    function toBuffer(v) {
      if (!Buffer.isBuffer(v)) {
        if (Array.isArray(v)) {
          v = Buffer.from(v);
        } else if (typeof v === "string") {
          if (isHexString2(v)) {
            v = Buffer.from(padToEven(stripHexPrefix(v)), "hex");
          } else {
            v = Buffer.from(v);
          }
        } else if (typeof v === "number") {
          v = intToBuffer(v);
        } else if (v === null || v === void 0) {
          v = Buffer.allocUnsafe(0);
        } else if (typeof v === "bigint") {
          v = bufferBEFromBigInt(v);
        } else if (v.toArray) {
          v = Buffer.from(v.toArray());
        } else {
          throw new Error("invalid type");
        }
      }
      return v;
    }
    function bufferToHex(buf) {
      buf = toBuffer(buf);
      return "0x" + buf.toString("hex");
    }
    function keccak(a, bits) {
      a = toBuffer(a);
      if (!bits) bits = 256;
      if (bits !== 256) {
        throw new Error("unsupported");
      }
      return Buffer.from(keccak_256(new Uint8Array(a)));
    }
    function padToEven(str) {
      return str.length % 2 ? "0" + str : str;
    }
    function isHexString2(str) {
      return typeof str === "string" && str.match(/^0x[0-9A-Fa-f]*$/);
    }
    function stripHexPrefix(str) {
      if (typeof str === "string" && str.startsWith("0x")) {
        return str.slice(2);
      }
      return str;
    }
    module.exports = {
      zeros,
      setLength,
      setLengthRight,
      isHexString: isHexString2,
      stripHexPrefix,
      toBuffer,
      bufferToHex,
      keccak,
      bitLengthFromBigInt,
      bufferBEFromBigInt,
      twosFromBigInt
    };
  }
});

// node_modules/@coinbase/wallet-sdk/dist/vendor-js/eth-eip712-util/abi.cjs
var require_abi = __commonJS({
  "node_modules/@coinbase/wallet-sdk/dist/vendor-js/eth-eip712-util/abi.cjs"(exports, module) {
    var util = require_util();
    function elementaryName(name) {
      if (name.startsWith("int[")) {
        return "int256" + name.slice(3);
      } else if (name === "int") {
        return "int256";
      } else if (name.startsWith("uint[")) {
        return "uint256" + name.slice(4);
      } else if (name === "uint") {
        return "uint256";
      } else if (name.startsWith("fixed[")) {
        return "fixed128x128" + name.slice(5);
      } else if (name === "fixed") {
        return "fixed128x128";
      } else if (name.startsWith("ufixed[")) {
        return "ufixed128x128" + name.slice(6);
      } else if (name === "ufixed") {
        return "ufixed128x128";
      }
      return name;
    }
    function parseTypeN(type) {
      return Number.parseInt(/^\D+(\d+)$/.exec(type)[1], 10);
    }
    function parseTypeNxM(type) {
      var tmp = /^\D+(\d+)x(\d+)$/.exec(type);
      return [Number.parseInt(tmp[1], 10), Number.parseInt(tmp[2], 10)];
    }
    function parseTypeArray(type) {
      var tmp = type.match(/(.*)\[(.*?)\]$/);
      if (tmp) {
        return tmp[2] === "" ? "dynamic" : Number.parseInt(tmp[2], 10);
      }
      return null;
    }
    function parseNumber(arg) {
      var type = typeof arg;
      if (type === "string" || type === "number") {
        return BigInt(arg);
      } else if (type === "bigint") {
        return arg;
      } else {
        throw new Error("Argument is not a number");
      }
    }
    function encodeSingle(type, arg) {
      var size, num, ret, i;
      if (type === "address") {
        return encodeSingle("uint160", parseNumber(arg));
      } else if (type === "bool") {
        return encodeSingle("uint8", arg ? 1 : 0);
      } else if (type === "string") {
        return encodeSingle("bytes", new Buffer(arg, "utf8"));
      } else if (isArray(type)) {
        if (typeof arg.length === "undefined") {
          throw new Error("Not an array?");
        }
        size = parseTypeArray(type);
        if (size !== "dynamic" && size !== 0 && arg.length > size) {
          throw new Error("Elements exceed array size: " + size);
        }
        ret = [];
        type = type.slice(0, type.lastIndexOf("["));
        if (typeof arg === "string") {
          arg = JSON.parse(arg);
        }
        for (i in arg) {
          ret.push(encodeSingle(type, arg[i]));
        }
        if (size === "dynamic") {
          var length = encodeSingle("uint256", arg.length);
          ret.unshift(length);
        }
        return Buffer.concat(ret);
      } else if (type === "bytes") {
        arg = new Buffer(arg);
        ret = Buffer.concat([encodeSingle("uint256", arg.length), arg]);
        if (arg.length % 32 !== 0) {
          ret = Buffer.concat([ret, util.zeros(32 - arg.length % 32)]);
        }
        return ret;
      } else if (type.startsWith("bytes")) {
        size = parseTypeN(type);
        if (size < 1 || size > 32) {
          throw new Error("Invalid bytes<N> width: " + size);
        }
        return util.setLengthRight(arg, 32);
      } else if (type.startsWith("uint")) {
        size = parseTypeN(type);
        if (size % 8 || size < 8 || size > 256) {
          throw new Error("Invalid uint<N> width: " + size);
        }
        num = parseNumber(arg);
        const bitLength = util.bitLengthFromBigInt(num);
        if (bitLength > size) {
          throw new Error("Supplied uint exceeds width: " + size + " vs " + bitLength);
        }
        if (num < 0) {
          throw new Error("Supplied uint is negative");
        }
        return util.bufferBEFromBigInt(num, 32);
      } else if (type.startsWith("int")) {
        size = parseTypeN(type);
        if (size % 8 || size < 8 || size > 256) {
          throw new Error("Invalid int<N> width: " + size);
        }
        num = parseNumber(arg);
        const bitLength = util.bitLengthFromBigInt(num);
        if (bitLength > size) {
          throw new Error("Supplied int exceeds width: " + size + " vs " + bitLength);
        }
        const twos = util.twosFromBigInt(num, 256);
        return util.bufferBEFromBigInt(twos, 32);
      } else if (type.startsWith("ufixed")) {
        size = parseTypeNxM(type);
        num = parseNumber(arg);
        if (num < 0) {
          throw new Error("Supplied ufixed is negative");
        }
        return encodeSingle("uint256", num * BigInt(2) ** BigInt(size[1]));
      } else if (type.startsWith("fixed")) {
        size = parseTypeNxM(type);
        return encodeSingle("int256", parseNumber(arg) * BigInt(2) ** BigInt(size[1]));
      }
      throw new Error("Unsupported or invalid type: " + type);
    }
    function isDynamic(type) {
      return type === "string" || type === "bytes" || parseTypeArray(type) === "dynamic";
    }
    function isArray(type) {
      return type.lastIndexOf("]") === type.length - 1;
    }
    function rawEncode(types, values) {
      var output = [];
      var data = [];
      var headLength = 32 * types.length;
      for (var i in types) {
        var type = elementaryName(types[i]);
        var value = values[i];
        var cur = encodeSingle(type, value);
        if (isDynamic(type)) {
          output.push(encodeSingle("uint256", headLength));
          data.push(cur);
          headLength += cur.length;
        } else {
          output.push(cur);
        }
      }
      return Buffer.concat(output.concat(data));
    }
    function solidityPack(types, values) {
      if (types.length !== values.length) {
        throw new Error("Number of types are not matching the values");
      }
      var size, num;
      var ret = [];
      for (var i = 0; i < types.length; i++) {
        var type = elementaryName(types[i]);
        var value = values[i];
        if (type === "bytes") {
          ret.push(value);
        } else if (type === "string") {
          ret.push(new Buffer(value, "utf8"));
        } else if (type === "bool") {
          ret.push(new Buffer(value ? "01" : "00", "hex"));
        } else if (type === "address") {
          ret.push(util.setLength(value, 20));
        } else if (type.startsWith("bytes")) {
          size = parseTypeN(type);
          if (size < 1 || size > 32) {
            throw new Error("Invalid bytes<N> width: " + size);
          }
          ret.push(util.setLengthRight(value, size));
        } else if (type.startsWith("uint")) {
          size = parseTypeN(type);
          if (size % 8 || size < 8 || size > 256) {
            throw new Error("Invalid uint<N> width: " + size);
          }
          num = parseNumber(value);
          const bitLength = util.bitLengthFromBigInt(num);
          if (bitLength > size) {
            throw new Error("Supplied uint exceeds width: " + size + " vs " + bitLength);
          }
          ret.push(util.bufferBEFromBigInt(num, size / 8));
        } else if (type.startsWith("int")) {
          size = parseTypeN(type);
          if (size % 8 || size < 8 || size > 256) {
            throw new Error("Invalid int<N> width: " + size);
          }
          num = parseNumber(value);
          const bitLength = util.bitLengthFromBigInt(num);
          if (bitLength > size) {
            throw new Error("Supplied int exceeds width: " + size + " vs " + bitLength);
          }
          const twos = util.twosFromBigInt(num, size);
          ret.push(util.bufferBEFromBigInt(twos, size / 8));
        } else {
          throw new Error("Unsupported or invalid type: " + type);
        }
      }
      return Buffer.concat(ret);
    }
    function soliditySHA3(types, values) {
      return util.keccak(solidityPack(types, values));
    }
    module.exports = {
      rawEncode,
      solidityPack,
      soliditySHA3
    };
  }
});

// node_modules/@coinbase/wallet-sdk/dist/vendor-js/eth-eip712-util/index.cjs
var require_eth_eip712_util = __commonJS({
  "node_modules/@coinbase/wallet-sdk/dist/vendor-js/eth-eip712-util/index.cjs"(exports, module) {
    var util = require_util();
    var abi = require_abi();
    var TYPED_MESSAGE_SCHEMA = {
      type: "object",
      properties: {
        types: {
          type: "object",
          additionalProperties: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                type: { type: "string" }
              },
              required: ["name", "type"]
            }
          }
        },
        primaryType: { type: "string" },
        domain: { type: "object" },
        message: { type: "object" }
      },
      required: ["types", "primaryType", "domain", "message"]
    };
    var TypedDataUtils = {
      /**
       * Encodes an object by encoding and concatenating each of its members
       *
       * @param {string} primaryType - Root type
       * @param {Object} data - Object to encode
       * @param {Object} types - Type definitions
       * @returns {string} - Encoded representation of an object
       */
      encodeData(primaryType, data, types, useV4 = true) {
        const encodedTypes = ["bytes32"];
        const encodedValues = [this.hashType(primaryType, types)];
        if (useV4) {
          const encodeField = (name, type, value) => {
            if (types[type] !== void 0) {
              return ["bytes32", value == null ? "0x0000000000000000000000000000000000000000000000000000000000000000" : util.keccak(this.encodeData(type, value, types, useV4))];
            }
            if (value === void 0)
              throw new Error(`missing value for field ${name} of type ${type}`);
            if (type === "bytes") {
              return ["bytes32", util.keccak(value)];
            }
            if (type === "string") {
              if (typeof value === "string") {
                value = Buffer.from(value, "utf8");
              }
              return ["bytes32", util.keccak(value)];
            }
            if (type.lastIndexOf("]") === type.length - 1) {
              const parsedType = type.slice(0, type.lastIndexOf("["));
              const typeValuePairs = value.map((item) => encodeField(name, parsedType, item));
              return ["bytes32", util.keccak(abi.rawEncode(
                typeValuePairs.map(([type2]) => type2),
                typeValuePairs.map(([, value2]) => value2)
              ))];
            }
            return [type, value];
          };
          for (const field of types[primaryType]) {
            const [type, value] = encodeField(field.name, field.type, data[field.name]);
            encodedTypes.push(type);
            encodedValues.push(value);
          }
        } else {
          for (const field of types[primaryType]) {
            let value = data[field.name];
            if (value !== void 0) {
              if (field.type === "bytes") {
                encodedTypes.push("bytes32");
                value = util.keccak(value);
                encodedValues.push(value);
              } else if (field.type === "string") {
                encodedTypes.push("bytes32");
                if (typeof value === "string") {
                  value = Buffer.from(value, "utf8");
                }
                value = util.keccak(value);
                encodedValues.push(value);
              } else if (types[field.type] !== void 0) {
                encodedTypes.push("bytes32");
                value = util.keccak(this.encodeData(field.type, value, types, useV4));
                encodedValues.push(value);
              } else if (field.type.lastIndexOf("]") === field.type.length - 1) {
                throw new Error("Arrays currently unimplemented in encodeData");
              } else {
                encodedTypes.push(field.type);
                encodedValues.push(value);
              }
            }
          }
        }
        return abi.rawEncode(encodedTypes, encodedValues);
      },
      /**
       * Encodes the type of an object by encoding a comma delimited list of its members
       *
       * @param {string} primaryType - Root type to encode
       * @param {Object} types - Type definitions
       * @returns {string} - Encoded representation of the type of an object
       */
      encodeType(primaryType, types) {
        let result = "";
        let deps = this.findTypeDependencies(primaryType, types).filter((dep) => dep !== primaryType);
        deps = [primaryType].concat(deps.sort());
        for (const type of deps) {
          const children = types[type];
          if (!children) {
            throw new Error("No type definition specified: " + type);
          }
          result += type + "(" + types[type].map(({ name, type: type2 }) => type2 + " " + name).join(",") + ")";
        }
        return result;
      },
      /**
       * Finds all types within a type definition object
       *
       * @param {string} primaryType - Root type
       * @param {Object} types - Type definitions
       * @param {Array} results - current set of accumulated types
       * @returns {Array} - Set of all types found in the type definition
       */
      findTypeDependencies(primaryType, types, results = []) {
        primaryType = primaryType.match(/^\w*/)[0];
        if (results.includes(primaryType) || types[primaryType] === void 0) {
          return results;
        }
        results.push(primaryType);
        for (const field of types[primaryType]) {
          for (const dep of this.findTypeDependencies(field.type, types, results)) {
            !results.includes(dep) && results.push(dep);
          }
        }
        return results;
      },
      /**
       * Hashes an object
       *
       * @param {string} primaryType - Root type
       * @param {Object} data - Object to hash
       * @param {Object} types - Type definitions
       * @returns {Buffer} - Hash of an object
       */
      hashStruct(primaryType, data, types, useV4 = true) {
        return util.keccak(this.encodeData(primaryType, data, types, useV4));
      },
      /**
       * Hashes the type of an object
       *
       * @param {string} primaryType - Root type to hash
       * @param {Object} types - Type definitions
       * @returns {string} - Hash of an object
       */
      hashType(primaryType, types) {
        return util.keccak(this.encodeType(primaryType, types));
      },
      /**
       * Removes properties from a message object that are not defined per EIP-712
       *
       * @param {Object} data - typed message object
       * @returns {Object} - typed message object with only allowed fields
       */
      sanitizeData(data) {
        const sanitizedData = {};
        for (const key in TYPED_MESSAGE_SCHEMA.properties) {
          data[key] && (sanitizedData[key] = data[key]);
        }
        if (sanitizedData.types) {
          sanitizedData.types = Object.assign({ EIP712Domain: [] }, sanitizedData.types);
        }
        return sanitizedData;
      },
      /**
       * Returns the hash of a typed message as per EIP-712 for signing
       *
       * @param {Object} typedData - Types message data to sign
       * @returns {string} - sha3 hash for signing
       */
      hash(typedData, useV4 = true) {
        const sanitizedData = this.sanitizeData(typedData);
        const parts = [Buffer.from("1901", "hex")];
        parts.push(this.hashStruct("EIP712Domain", sanitizedData.domain, sanitizedData.types, useV4));
        if (sanitizedData.primaryType !== "EIP712Domain") {
          parts.push(this.hashStruct(sanitizedData.primaryType, sanitizedData.message, sanitizedData.types, useV4));
        }
        return util.keccak(Buffer.concat(parts));
      }
    };
    module.exports = {
      TYPED_MESSAGE_SCHEMA,
      TypedDataUtils,
      hashForSignTypedDataLegacy: function(msgParams) {
        return typedSignatureHashLegacy(msgParams.data);
      },
      hashForSignTypedData_v3: function(msgParams) {
        return TypedDataUtils.hash(msgParams.data, false);
      },
      hashForSignTypedData_v4: function(msgParams) {
        return TypedDataUtils.hash(msgParams.data);
      }
    };
    function typedSignatureHashLegacy(typedData) {
      const error = new Error("Expect argument to be non-empty array");
      if (typeof typedData !== "object" || !typedData.length) throw error;
      const data = typedData.map(function(e) {
        return e.type === "bytes" ? util.toBuffer(e.value) : e.value;
      });
      const types = typedData.map(function(e) {
        return e.type;
      });
      const schema = typedData.map(function(e) {
        if (!e.name) throw error;
        return e.type + " " + e.name;
      });
      return abi.soliditySHA3(
        ["bytes32", "bytes32"],
        [
          abi.soliditySHA3(new Array(typedData.length).fill("string"), schema),
          abi.soliditySHA3(types, data)
        ]
      );
    }
  }
});

// node_modules/@coinbase/wallet-sdk/dist/assets/wallet-logo.js
var walletLogo = (type, width) => {
  let height;
  switch (type) {
    case "standard":
      height = width;
      return `data:image/svg+xml,%3Csvg width='${width}' height='${height}' viewBox='0 0 1024 1024' fill='none' xmlns='http://www.w3.org/2000/svg'%3E %3Crect width='1024' height='1024' fill='%230052FF'/%3E %3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M152 512C152 710.823 313.177 872 512 872C710.823 872 872 710.823 872 512C872 313.177 710.823 152 512 152C313.177 152 152 313.177 152 512ZM420 396C406.745 396 396 406.745 396 420V604C396 617.255 406.745 628 420 628H604C617.255 628 628 617.255 628 604V420C628 406.745 617.255 396 604 396H420Z' fill='white'/%3E %3C/svg%3E `;
    case "circle":
      height = width;
      return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 999.81 999.81'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%230052fe;%7D.cls-2%7Bfill:%23fefefe;%7D.cls-3%7Bfill:%230152fe;%7D%3C/style%3E%3C/defs%3E%3Cpath class='cls-1' d='M655-115.9h56c.83,1.59,2.36.88,3.56,1a478,478,0,0,1,75.06,10.42C891.4-81.76,978.33-32.58,1049.19,44q116.7,126,131.94,297.61c.38,4.14-.34,8.53,1.78,12.45v59c-1.58.84-.91,2.35-1,3.56a482.05,482.05,0,0,1-10.38,74.05c-24,106.72-76.64,196.76-158.83,268.93s-178.18,112.82-287.2,122.6c-4.83.43-9.86-.25-14.51,1.77H654c-1-1.68-2.69-.91-4.06-1a496.89,496.89,0,0,1-105.9-18.59c-93.54-27.42-172.78-77.59-236.91-150.94Q199.34,590.1,184.87,426.58c-.47-5.19.25-10.56-1.77-15.59V355c1.68-1,.91-2.7,1-4.06a498.12,498.12,0,0,1,18.58-105.9c26-88.75,72.64-164.9,140.6-227.57q126-116.27,297.21-131.61C645.32-114.57,650.35-113.88,655-115.9Zm377.92,500c0-192.44-156.31-349.49-347.56-350.15-194.13-.68-350.94,155.13-352.29,347.42-1.37,194.55,155.51,352.1,348.56,352.47C876.15,734.23,1032.93,577.84,1032.93,384.11Z' transform='translate(-183.1 115.9)'/%3E%3Cpath class='cls-2' d='M1032.93,384.11c0,193.73-156.78,350.12-351.29,349.74-193-.37-349.93-157.92-348.56-352.47C334.43,189.09,491.24,33.28,685.37,34,876.62,34.62,1032.94,191.67,1032.93,384.11ZM683,496.81q43.74,0,87.48,0c15.55,0,25.32-9.72,25.33-25.21q0-87.48,0-175c0-15.83-9.68-25.46-25.59-25.46H595.77c-15.88,0-25.57,9.64-25.58,25.46q0,87.23,0,174.45c0,16.18,9.59,25.7,25.84,25.71Z' transform='translate(-183.1 115.9)'/%3E%3Cpath class='cls-3' d='M683,496.81H596c-16.25,0-25.84-9.53-25.84-25.71q0-87.23,0-174.45c0-15.82,9.7-25.46,25.58-25.46H770.22c15.91,0,25.59,9.63,25.59,25.46q0,87.47,0,175c0,15.49-9.78,25.2-25.33,25.21Q726.74,496.84,683,496.81Z' transform='translate(-183.1 115.9)'/%3E%3C/svg%3E`;
    case "text":
      height = (0.1 * width).toFixed(2);
      return `data:image/svg+xml,%3Csvg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 528.15 53.64'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%230052ff;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3ECoinbase_Wordmark_SubBrands_ALL%3C/title%3E%3Cpath class='cls-1' d='M164.45,15a15,15,0,0,0-11.74,5.4V0h-8.64V52.92h8.5V48a15,15,0,0,0,11.88,5.62c10.37,0,18.21-8.21,18.21-19.3S174.67,15,164.45,15Zm-1.3,30.67c-6.19,0-10.73-4.83-10.73-11.31S157,23,163.22,23s10.66,4.82,10.66,11.37S169.34,45.65,163.15,45.65Zm83.31-14.91-6.34-.93c-3-.43-5.18-1.44-5.18-3.82,0-2.59,2.8-3.89,6.62-3.89,4.18,0,6.84,1.8,7.42,4.76h8.35c-.94-7.49-6.7-11.88-15.55-11.88-9.15,0-15.2,4.68-15.2,11.3,0,6.34,4,10,12,11.16l6.33.94c3.1.43,4.83,1.65,4.83,4,0,2.95-3,4.17-7.2,4.17-5.12,0-8-2.09-8.43-5.25h-8.49c.79,7.27,6.48,12.38,16.84,12.38,9.44,0,15.7-4.32,15.7-11.74C258.12,35.28,253.58,31.82,246.46,30.74Zm-27.65-2.3c0-8.06-4.9-13.46-15.27-13.46-9.79,0-15.26,5-16.34,12.6h8.57c.43-3,2.73-5.4,7.63-5.4,4.39,0,6.55,1.94,6.55,4.32,0,3.09-4,3.88-8.85,4.39-6.63.72-14.84,3-14.84,11.66,0,6.7,5,11,12.89,11,6.19,0,10.08-2.59,12-6.7.28,3.67,3,6.05,6.84,6.05h5v-7.7h-4.25Zm-8.5,9.36c0,5-4.32,8.64-9.57,8.64-3.24,0-6-1.37-6-4.25,0-3.67,4.39-4.68,8.42-5.11s6-1.22,7.13-2.88ZM281.09,15c-11.09,0-19.23,8.35-19.23,19.36,0,11.6,8.72,19.3,19.37,19.3,9,0,16.06-5.33,17.86-12.89h-9c-1.3,3.31-4.47,5.19-8.71,5.19-5.55,0-9.72-3.46-10.66-9.51H299.3V33.12C299.3,22.46,291.53,15,281.09,15Zm-9.87,15.26c1.37-5.18,5.26-7.7,9.72-7.7,4.9,0,8.64,2.8,9.51,7.7ZM19.3,23a9.84,9.84,0,0,1,9.5,7h9.14c-1.65-8.93-9-15-18.57-15A19,19,0,0,0,0,34.34c0,11.09,8.28,19.3,19.37,19.3,9.36,0,16.85-6,18.5-15H28.8a9.75,9.75,0,0,1-9.43,7.06c-6.27,0-10.66-4.83-10.66-11.31S13,23,19.3,23Zm41.11-8A19,19,0,0,0,41,34.34c0,11.09,8.28,19.3,19.37,19.3A19,19,0,0,0,79.92,34.27C79.92,23.33,71.64,15,60.41,15Zm.07,30.67c-6.19,0-10.73-4.83-10.73-11.31S54.22,23,60.41,23s10.8,4.89,10.8,11.37S66.67,45.65,60.48,45.65ZM123.41,15c-5.62,0-9.29,2.3-11.45,5.54V15.7h-8.57V52.92H112V32.69C112,27,115.63,23,121,23c5,0,8.06,3.53,8.06,8.64V52.92h8.64V31C137.66,21.6,132.84,15,123.41,15ZM92,.36a5.36,5.36,0,0,0-5.55,5.47,5.55,5.55,0,0,0,11.09,0A5.35,5.35,0,0,0,92,.36Zm-9.72,23h5.4V52.92h8.64V15.7h-14Zm298.17-7.7L366.2,52.92H372L375.29,44H392l3.33,8.88h6L386.87,15.7ZM377,39.23l6.45-17.56h.1l6.56,17.56ZM362.66,15.7l-7.88,29h-.11l-8.14-29H341l-8,28.93h-.1l-8-28.87H319L329.82,53h5.45l8.19-29.24h.11L352,53h5.66L368.1,15.7Zm135.25,0v4.86h12.32V52.92h5.6V20.56h12.32V15.7ZM467.82,52.92h25.54V48.06H473.43v-12h18.35V31.35H473.43V20.56h19.93V15.7H467.82ZM443,15.7h-5.6V52.92h24.32V48.06H443Zm-30.45,0h-5.61V52.92h24.32V48.06H412.52Z'/%3E%3C/svg%3E`;
    case "textWithLogo":
      height = (0.25 * width).toFixed(2);
      return `data:image/svg+xml,%3Csvg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 308.44 77.61'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%230052ff;%7D%3C/style%3E%3C/defs%3E%3Cpath class='cls-1' d='M142.94,20.2l-7.88,29H135l-8.15-29h-5.55l-8,28.93h-.11l-8-28.87H99.27l10.84,37.27h5.44l8.2-29.24h.1l8.41,29.24h5.66L148.39,20.2Zm17.82,0L146.48,57.42h5.82l3.28-8.88h16.65l3.34,8.88h6L167.16,20.2Zm-3.44,23.52,6.45-17.55h.11l6.56,17.55ZM278.2,20.2v4.86h12.32V57.42h5.6V25.06h12.32V20.2ZM248.11,57.42h25.54V52.55H253.71V40.61h18.35V35.85H253.71V25.06h19.94V20.2H248.11ZM223.26,20.2h-5.61V57.42H242V52.55H223.26Zm-30.46,0h-5.6V57.42h24.32V52.55H192.8Zm-154,38A19.41,19.41,0,1,1,57.92,35.57H77.47a38.81,38.81,0,1,0,0,6.47H57.92A19.39,19.39,0,0,1,38.81,58.21Z'/%3E%3C/svg%3E`;
    case "textLight":
      height = (0.1 * width).toFixed(2);
      return `data:image/svg+xml,%3Csvg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 528.15 53.64'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%23fefefe;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3ECoinbase_Wordmark_SubBrands_ALL%3C/title%3E%3Cpath class='cls-1' d='M164.45,15a15,15,0,0,0-11.74,5.4V0h-8.64V52.92h8.5V48a15,15,0,0,0,11.88,5.62c10.37,0,18.21-8.21,18.21-19.3S174.67,15,164.45,15Zm-1.3,30.67c-6.19,0-10.73-4.83-10.73-11.31S157,23,163.22,23s10.66,4.82,10.66,11.37S169.34,45.65,163.15,45.65Zm83.31-14.91-6.34-.93c-3-.43-5.18-1.44-5.18-3.82,0-2.59,2.8-3.89,6.62-3.89,4.18,0,6.84,1.8,7.42,4.76h8.35c-.94-7.49-6.7-11.88-15.55-11.88-9.15,0-15.2,4.68-15.2,11.3,0,6.34,4,10,12,11.16l6.33.94c3.1.43,4.83,1.65,4.83,4,0,2.95-3,4.17-7.2,4.17-5.12,0-8-2.09-8.43-5.25h-8.49c.79,7.27,6.48,12.38,16.84,12.38,9.44,0,15.7-4.32,15.7-11.74C258.12,35.28,253.58,31.82,246.46,30.74Zm-27.65-2.3c0-8.06-4.9-13.46-15.27-13.46-9.79,0-15.26,5-16.34,12.6h8.57c.43-3,2.73-5.4,7.63-5.4,4.39,0,6.55,1.94,6.55,4.32,0,3.09-4,3.88-8.85,4.39-6.63.72-14.84,3-14.84,11.66,0,6.7,5,11,12.89,11,6.19,0,10.08-2.59,12-6.7.28,3.67,3,6.05,6.84,6.05h5v-7.7h-4.25Zm-8.5,9.36c0,5-4.32,8.64-9.57,8.64-3.24,0-6-1.37-6-4.25,0-3.67,4.39-4.68,8.42-5.11s6-1.22,7.13-2.88ZM281.09,15c-11.09,0-19.23,8.35-19.23,19.36,0,11.6,8.72,19.3,19.37,19.3,9,0,16.06-5.33,17.86-12.89h-9c-1.3,3.31-4.47,5.19-8.71,5.19-5.55,0-9.72-3.46-10.66-9.51H299.3V33.12C299.3,22.46,291.53,15,281.09,15Zm-9.87,15.26c1.37-5.18,5.26-7.7,9.72-7.7,4.9,0,8.64,2.8,9.51,7.7ZM19.3,23a9.84,9.84,0,0,1,9.5,7h9.14c-1.65-8.93-9-15-18.57-15A19,19,0,0,0,0,34.34c0,11.09,8.28,19.3,19.37,19.3,9.36,0,16.85-6,18.5-15H28.8a9.75,9.75,0,0,1-9.43,7.06c-6.27,0-10.66-4.83-10.66-11.31S13,23,19.3,23Zm41.11-8A19,19,0,0,0,41,34.34c0,11.09,8.28,19.3,19.37,19.3A19,19,0,0,0,79.92,34.27C79.92,23.33,71.64,15,60.41,15Zm.07,30.67c-6.19,0-10.73-4.83-10.73-11.31S54.22,23,60.41,23s10.8,4.89,10.8,11.37S66.67,45.65,60.48,45.65ZM123.41,15c-5.62,0-9.29,2.3-11.45,5.54V15.7h-8.57V52.92H112V32.69C112,27,115.63,23,121,23c5,0,8.06,3.53,8.06,8.64V52.92h8.64V31C137.66,21.6,132.84,15,123.41,15ZM92,.36a5.36,5.36,0,0,0-5.55,5.47,5.55,5.55,0,0,0,11.09,0A5.35,5.35,0,0,0,92,.36Zm-9.72,23h5.4V52.92h8.64V15.7h-14Zm298.17-7.7L366.2,52.92H372L375.29,44H392l3.33,8.88h6L386.87,15.7ZM377,39.23l6.45-17.56h.1l6.56,17.56ZM362.66,15.7l-7.88,29h-.11l-8.14-29H341l-8,28.93h-.1l-8-28.87H319L329.82,53h5.45l8.19-29.24h.11L352,53h5.66L368.1,15.7Zm135.25,0v4.86h12.32V52.92h5.6V20.56h12.32V15.7ZM467.82,52.92h25.54V48.06H473.43v-12h18.35V31.35H473.43V20.56h19.93V15.7H467.82ZM443,15.7h-5.6V52.92h24.32V48.06H443Zm-30.45,0h-5.61V52.92h24.32V48.06H412.52Z'/%3E%3C/svg%3E`;
    case "textWithLogoLight":
      height = (0.25 * width).toFixed(2);
      return `data:image/svg+xml,%3Csvg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 308.44 77.61'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%23fefefe;%7D%3C/style%3E%3C/defs%3E%3Cpath class='cls-1' d='M142.94,20.2l-7.88,29H135l-8.15-29h-5.55l-8,28.93h-.11l-8-28.87H99.27l10.84,37.27h5.44l8.2-29.24h.1l8.41,29.24h5.66L148.39,20.2Zm17.82,0L146.48,57.42h5.82l3.28-8.88h16.65l3.34,8.88h6L167.16,20.2Zm-3.44,23.52,6.45-17.55h.11l6.56,17.55ZM278.2,20.2v4.86h12.32V57.42h5.6V25.06h12.32V20.2ZM248.11,57.42h25.54V52.55H253.71V40.61h18.35V35.85H253.71V25.06h19.94V20.2H248.11ZM223.26,20.2h-5.61V57.42H242V52.55H223.26Zm-30.46,0h-5.6V57.42h24.32V52.55H192.8Zm-154,38A19.41,19.41,0,1,1,57.92,35.57H77.47a38.81,38.81,0,1,0,0,6.47H57.92A19.39,19.39,0,0,1,38.81,58.21Z'/%3E%3C/svg%3E`;
    default:
      height = width;
      return `data:image/svg+xml,%3Csvg width='${width}' height='${height}' viewBox='0 0 1024 1024' fill='none' xmlns='http://www.w3.org/2000/svg'%3E %3Crect width='1024' height='1024' fill='%230052FF'/%3E %3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M152 512C152 710.823 313.177 872 512 872C710.823 872 872 710.823 872 512C872 313.177 710.823 152 512 152C313.177 152 152 313.177 152 512ZM420 396C406.745 396 396 406.745 396 420V604C396 617.255 406.745 628 420 628H604C617.255 628 628 617.255 628 604V420C628 406.745 617.255 396 604 396H420Z' fill='white'/%3E %3C/svg%3E `;
  }
};

// node_modules/@coinbase/wallet-sdk/dist/core/storage/ScopedLocalStorage.js
var ScopedLocalStorage = class _ScopedLocalStorage {
  constructor(scope, module) {
    this.scope = scope;
    this.module = module;
  }
  storeObject(key, item) {
    this.setItem(key, JSON.stringify(item));
  }
  loadObject(key) {
    const item = this.getItem(key);
    return item ? JSON.parse(item) : void 0;
  }
  setItem(key, value) {
    localStorage.setItem(this.scopedKey(key), value);
  }
  getItem(key) {
    return localStorage.getItem(this.scopedKey(key));
  }
  removeItem(key) {
    localStorage.removeItem(this.scopedKey(key));
  }
  clear() {
    const prefix = this.scopedKey("");
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (typeof key === "string" && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  }
  scopedKey(key) {
    return `-${this.scope}${this.module ? `:${this.module}` : ""}:${key}`;
  }
  static clearAll() {
    new _ScopedLocalStorage("CBWSDK").clear();
    new _ScopedLocalStorage("walletlink").clear();
  }
};

// node_modules/@coinbase/wallet-sdk/dist/core/error/constants.js
var standardErrorCodes = {
  rpc: {
    invalidInput: -32e3,
    resourceNotFound: -32001,
    resourceUnavailable: -32002,
    transactionRejected: -32003,
    methodNotSupported: -32004,
    limitExceeded: -32005,
    parse: -32700,
    invalidRequest: -32600,
    methodNotFound: -32601,
    invalidParams: -32602,
    internal: -32603
  },
  provider: {
    userRejectedRequest: 4001,
    unauthorized: 4100,
    unsupportedMethod: 4200,
    disconnected: 4900,
    chainDisconnected: 4901,
    unsupportedChain: 4902
  }
};
var errorValues = {
  "-32700": {
    standard: "JSON RPC 2.0",
    message: "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."
  },
  "-32600": {
    standard: "JSON RPC 2.0",
    message: "The JSON sent is not a valid Request object."
  },
  "-32601": {
    standard: "JSON RPC 2.0",
    message: "The method does not exist / is not available."
  },
  "-32602": {
    standard: "JSON RPC 2.0",
    message: "Invalid method parameter(s)."
  },
  "-32603": {
    standard: "JSON RPC 2.0",
    message: "Internal JSON-RPC error."
  },
  "-32000": {
    standard: "EIP-1474",
    message: "Invalid input."
  },
  "-32001": {
    standard: "EIP-1474",
    message: "Resource not found."
  },
  "-32002": {
    standard: "EIP-1474",
    message: "Resource unavailable."
  },
  "-32003": {
    standard: "EIP-1474",
    message: "Transaction rejected."
  },
  "-32004": {
    standard: "EIP-1474",
    message: "Method not supported."
  },
  "-32005": {
    standard: "EIP-1474",
    message: "Request limit exceeded."
  },
  "4001": {
    standard: "EIP-1193",
    message: "User rejected the request."
  },
  "4100": {
    standard: "EIP-1193",
    message: "The requested account and/or method has not been authorized by the user."
  },
  "4200": {
    standard: "EIP-1193",
    message: "The requested method is not supported by this Ethereum provider."
  },
  "4900": {
    standard: "EIP-1193",
    message: "The provider is disconnected from all chains."
  },
  "4901": {
    standard: "EIP-1193",
    message: "The provider is disconnected from the specified chain."
  },
  "4902": {
    standard: "EIP-3085",
    message: "Unrecognized chain ID."
  }
};

// node_modules/@coinbase/wallet-sdk/dist/core/error/utils.js
var FALLBACK_MESSAGE = "Unspecified error message.";
var JSON_RPC_SERVER_ERROR_MESSAGE = "Unspecified server error.";
function getMessageFromCode(code, fallbackMessage = FALLBACK_MESSAGE) {
  if (code && Number.isInteger(code)) {
    const codeString = code.toString();
    if (hasKey(errorValues, codeString)) {
      return errorValues[codeString].message;
    }
    if (isJsonRpcServerError(code)) {
      return JSON_RPC_SERVER_ERROR_MESSAGE;
    }
  }
  return fallbackMessage;
}
function isValidCode(code) {
  if (!Number.isInteger(code)) {
    return false;
  }
  const codeString = code.toString();
  if (errorValues[codeString]) {
    return true;
  }
  if (isJsonRpcServerError(code)) {
    return true;
  }
  return false;
}
function serialize(error, { shouldIncludeStack = false } = {}) {
  const serialized = {};
  if (error && typeof error === "object" && !Array.isArray(error) && hasKey(error, "code") && isValidCode(error.code)) {
    const _error = error;
    serialized.code = _error.code;
    if (_error.message && typeof _error.message === "string") {
      serialized.message = _error.message;
      if (hasKey(_error, "data")) {
        serialized.data = _error.data;
      }
    } else {
      serialized.message = getMessageFromCode(serialized.code);
      serialized.data = { originalError: assignOriginalError(error) };
    }
  } else {
    serialized.code = standardErrorCodes.rpc.internal;
    serialized.message = hasStringProperty(error, "message") ? error.message : FALLBACK_MESSAGE;
    serialized.data = { originalError: assignOriginalError(error) };
  }
  if (shouldIncludeStack) {
    serialized.stack = hasStringProperty(error, "stack") ? error.stack : void 0;
  }
  return serialized;
}
function isJsonRpcServerError(code) {
  return code >= -32099 && code <= -32e3;
}
function assignOriginalError(error) {
  if (error && typeof error === "object" && !Array.isArray(error)) {
    return Object.assign({}, error);
  }
  return error;
}
function hasKey(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
function hasStringProperty(obj, prop) {
  return typeof obj === "object" && obj !== null && prop in obj && typeof obj[prop] === "string";
}

// node_modules/@coinbase/wallet-sdk/dist/core/error/errors.js
var standardErrors = {
  rpc: {
    parse: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.parse, arg),
    invalidRequest: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.invalidRequest, arg),
    invalidParams: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.invalidParams, arg),
    methodNotFound: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.methodNotFound, arg),
    internal: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.internal, arg),
    server: (opts) => {
      if (!opts || typeof opts !== "object" || Array.isArray(opts)) {
        throw new Error("Ethereum RPC Server errors must provide single object argument.");
      }
      const { code } = opts;
      if (!Number.isInteger(code) || code > -32005 || code < -32099) {
        throw new Error('"code" must be an integer such that: -32099 <= code <= -32005');
      }
      return getEthJsonRpcError(code, opts);
    },
    invalidInput: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.invalidInput, arg),
    resourceNotFound: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.resourceNotFound, arg),
    resourceUnavailable: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.resourceUnavailable, arg),
    transactionRejected: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.transactionRejected, arg),
    methodNotSupported: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.methodNotSupported, arg),
    limitExceeded: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.limitExceeded, arg)
  },
  provider: {
    userRejectedRequest: (arg) => {
      return getEthProviderError(standardErrorCodes.provider.userRejectedRequest, arg);
    },
    unauthorized: (arg) => {
      return getEthProviderError(standardErrorCodes.provider.unauthorized, arg);
    },
    unsupportedMethod: (arg) => {
      return getEthProviderError(standardErrorCodes.provider.unsupportedMethod, arg);
    },
    disconnected: (arg) => {
      return getEthProviderError(standardErrorCodes.provider.disconnected, arg);
    },
    chainDisconnected: (arg) => {
      return getEthProviderError(standardErrorCodes.provider.chainDisconnected, arg);
    },
    unsupportedChain: (arg) => {
      return getEthProviderError(standardErrorCodes.provider.unsupportedChain, arg);
    },
    custom: (opts) => {
      if (!opts || typeof opts !== "object" || Array.isArray(opts)) {
        throw new Error("Ethereum Provider custom errors must provide single object argument.");
      }
      const { code, message, data } = opts;
      if (!message || typeof message !== "string") {
        throw new Error('"message" must be a nonempty string');
      }
      return new EthereumProviderError(code, message, data);
    }
  }
};
function getEthJsonRpcError(code, arg) {
  const [message, data] = parseOpts(arg);
  return new EthereumRpcError(code, message || getMessageFromCode(code), data);
}
function getEthProviderError(code, arg) {
  const [message, data] = parseOpts(arg);
  return new EthereumProviderError(code, message || getMessageFromCode(code), data);
}
function parseOpts(arg) {
  if (arg) {
    if (typeof arg === "string") {
      return [arg];
    } else if (typeof arg === "object" && !Array.isArray(arg)) {
      const { message, data } = arg;
      if (message && typeof message !== "string") {
        throw new Error("Must specify string message.");
      }
      return [message || void 0, data];
    }
  }
  return [];
}
var EthereumRpcError = class extends Error {
  constructor(code, message, data) {
    if (!Number.isInteger(code)) {
      throw new Error('"code" must be an integer.');
    }
    if (!message || typeof message !== "string") {
      throw new Error('"message" must be a nonempty string.');
    }
    super(message);
    this.code = code;
    if (data !== void 0) {
      this.data = data;
    }
  }
};
var EthereumProviderError = class extends EthereumRpcError {
  /**
   * Create an Ethereum Provider JSON-RPC error.
   * `code` must be an integer in the 1000 <= 4999 range.
   */
  constructor(code, message, data) {
    if (!isValidEthProviderCode(code)) {
      throw new Error('"code" must be an integer such that: 1000 <= code <= 4999');
    }
    super(code, message, data);
  }
};
function isValidEthProviderCode(code) {
  return Number.isInteger(code) && code >= 1e3 && code <= 4999;
}

// node_modules/@coinbase/wallet-sdk/dist/core/type/index.js
function OpaqueType() {
  return (value) => value;
}
var HexString = OpaqueType();
var AddressString = OpaqueType();
var BigIntString = OpaqueType();
function IntNumber(num) {
  return Math.floor(num);
}
var RegExpString = OpaqueType();

// node_modules/@coinbase/wallet-sdk/dist/core/type/util.js
var INT_STRING_REGEX = /^[0-9]*$/;
var HEXADECIMAL_STRING_REGEX = /^[a-f0-9]*$/;
function randomBytesHex(length) {
  return uint8ArrayToHex(crypto.getRandomValues(new Uint8Array(length)));
}
function uint8ArrayToHex(value) {
  return [...value].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function hexStringToUint8Array(hexString) {
  return new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => Number.parseInt(byte, 16)));
}
function hexStringFromBuffer(buf, includePrefix = false) {
  const hex = buf.toString("hex");
  return HexString(includePrefix ? `0x${hex}` : hex);
}
function encodeToHexString(str) {
  return hexStringFromBuffer(ensureBuffer(str), true);
}
function bigIntStringFromBigInt(bi) {
  return BigIntString(bi.toString(10));
}
function hexStringFromNumber(num) {
  return HexString(`0x${BigInt(num).toString(16)}`);
}
function has0xPrefix(str) {
  return str.startsWith("0x") || str.startsWith("0X");
}
function strip0x(hex) {
  if (has0xPrefix(hex)) {
    return hex.slice(2);
  }
  return hex;
}
function prepend0x(hex) {
  if (has0xPrefix(hex)) {
    return `0x${hex.slice(2)}`;
  }
  return `0x${hex}`;
}
function isHexString(hex) {
  if (typeof hex !== "string") {
    return false;
  }
  const s = strip0x(hex).toLowerCase();
  return HEXADECIMAL_STRING_REGEX.test(s);
}
function ensureHexString(hex, includePrefix = false) {
  if (typeof hex === "string") {
    const s = strip0x(hex).toLowerCase();
    if (HEXADECIMAL_STRING_REGEX.test(s)) {
      return HexString(includePrefix ? `0x${s}` : s);
    }
  }
  throw standardErrors.rpc.invalidParams(`"${String(hex)}" is not a hexadecimal string`);
}
function ensureEvenLengthHexString(hex, includePrefix = false) {
  let h2 = ensureHexString(hex, false);
  if (h2.length % 2 === 1) {
    h2 = HexString(`0${h2}`);
  }
  return includePrefix ? HexString(`0x${h2}`) : h2;
}
function ensureAddressString(str) {
  if (typeof str === "string") {
    const s = strip0x(str).toLowerCase();
    if (isHexString(s) && s.length === 40) {
      return AddressString(prepend0x(s));
    }
  }
  throw standardErrors.rpc.invalidParams(`Invalid Ethereum address: ${String(str)}`);
}
function ensureBuffer(str) {
  if (Buffer.isBuffer(str)) {
    return str;
  }
  if (typeof str === "string") {
    if (isHexString(str)) {
      const s = ensureEvenLengthHexString(str, false);
      return Buffer.from(s, "hex");
    }
    return Buffer.from(str, "utf8");
  }
  throw standardErrors.rpc.invalidParams(`Not binary data: ${String(str)}`);
}
function ensureIntNumber(num) {
  if (typeof num === "number" && Number.isInteger(num)) {
    return IntNumber(num);
  }
  if (typeof num === "string") {
    if (INT_STRING_REGEX.test(num)) {
      return IntNumber(Number(num));
    }
    if (isHexString(num)) {
      return IntNumber(Number(BigInt(ensureEvenLengthHexString(num, true))));
    }
  }
  throw standardErrors.rpc.invalidParams(`Not an integer: ${String(num)}`);
}
function ensureBigInt(val) {
  if (val !== null && (typeof val === "bigint" || isBigNumber(val))) {
    return BigInt(val.toString(10));
  }
  if (typeof val === "number") {
    return BigInt(ensureIntNumber(val));
  }
  if (typeof val === "string") {
    if (INT_STRING_REGEX.test(val)) {
      return BigInt(val);
    }
    if (isHexString(val)) {
      return BigInt(ensureEvenLengthHexString(val, true));
    }
  }
  throw standardErrors.rpc.invalidParams(`Not an integer: ${String(val)}`);
}
function ensureParsedJSONObject(val) {
  if (typeof val === "string") {
    return JSON.parse(val);
  }
  if (typeof val === "object") {
    return val;
  }
  throw standardErrors.rpc.invalidParams(`Not a JSON string or an object: ${String(val)}`);
}
function isBigNumber(val) {
  if (val == null || typeof val.constructor !== "function") {
    return false;
  }
  const { constructor } = val;
  return typeof constructor.config === "function" && typeof constructor.EUCLID === "number";
}
function getFavicon() {
  const el = document.querySelector('link[sizes="192x192"]') || document.querySelector('link[sizes="180x180"]') || document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]');
  const { protocol, host } = document.location;
  const href = el ? el.getAttribute("href") : null;
  if (!href || href.startsWith("javascript:") || href.startsWith("vbscript:")) {
    return `${protocol}//${host}/favicon.ico`;
  }
  if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("data:")) {
    return href;
  }
  if (href.startsWith("//")) {
    return protocol + href;
  }
  return `${protocol}//${host}${href}`;
}

// node_modules/@coinbase/wallet-sdk/dist/util/cipher.js
async function generateKeyPair() {
  return crypto.subtle.generateKey({
    name: "ECDH",
    namedCurve: "P-256"
  }, true, ["deriveKey"]);
}
async function deriveSharedSecret(ownPrivateKey, peerPublicKey) {
  return crypto.subtle.deriveKey({
    name: "ECDH",
    public: peerPublicKey
  }, ownPrivateKey, {
    name: "AES-GCM",
    length: 256
  }, false, ["encrypt", "decrypt"]);
}
async function encrypt(sharedSecret, plainText) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipherText = await crypto.subtle.encrypt({
    name: "AES-GCM",
    iv
  }, sharedSecret, new TextEncoder().encode(plainText));
  return { iv, cipherText };
}
async function decrypt(sharedSecret, { iv, cipherText }) {
  const plainText = await crypto.subtle.decrypt({
    name: "AES-GCM",
    iv
  }, sharedSecret, cipherText);
  return new TextDecoder().decode(plainText);
}
function getFormat(keyType) {
  switch (keyType) {
    case "public":
      return "spki";
    case "private":
      return "pkcs8";
  }
}
async function exportKeyToHexString(type, key) {
  const format = getFormat(type);
  const exported = await crypto.subtle.exportKey(format, key);
  return uint8ArrayToHex(new Uint8Array(exported));
}
async function importKeyFromHexString(type, hexString) {
  const format = getFormat(type);
  const arrayBuffer = hexStringToUint8Array(hexString).buffer;
  return await crypto.subtle.importKey(format, new Uint8Array(arrayBuffer), {
    name: "ECDH",
    namedCurve: "P-256"
  }, true, type === "private" ? ["deriveKey"] : []);
}
async function encryptContent(content, sharedSecret) {
  const serialized = JSON.stringify(content, (_, value) => {
    if (!(value instanceof Error))
      return value;
    const error = value;
    return Object.assign(Object.assign({}, error.code ? { code: error.code } : {}), { message: error.message });
  });
  return encrypt(sharedSecret, serialized);
}
async function decryptContent(encryptedData, sharedSecret) {
  return JSON.parse(await decrypt(sharedSecret, encryptedData));
}

// node_modules/@coinbase/wallet-sdk/dist/sign/scw/SCWKeyManager.js
var OWN_PRIVATE_KEY = {
  storageKey: "ownPrivateKey",
  keyType: "private"
};
var OWN_PUBLIC_KEY = {
  storageKey: "ownPublicKey",
  keyType: "public"
};
var PEER_PUBLIC_KEY = {
  storageKey: "peerPublicKey",
  keyType: "public"
};
var SCWKeyManager = class {
  constructor() {
    this.storage = new ScopedLocalStorage("CBWSDK", "SCWKeyManager");
    this.ownPrivateKey = null;
    this.ownPublicKey = null;
    this.peerPublicKey = null;
    this.sharedSecret = null;
  }
  async getOwnPublicKey() {
    await this.loadKeysIfNeeded();
    return this.ownPublicKey;
  }
  // returns null if the shared secret is not yet derived
  async getSharedSecret() {
    await this.loadKeysIfNeeded();
    return this.sharedSecret;
  }
  async setPeerPublicKey(key) {
    this.sharedSecret = null;
    this.peerPublicKey = key;
    await this.storeKey(PEER_PUBLIC_KEY, key);
    await this.loadKeysIfNeeded();
  }
  async clear() {
    this.ownPrivateKey = null;
    this.ownPublicKey = null;
    this.peerPublicKey = null;
    this.sharedSecret = null;
    this.storage.removeItem(OWN_PUBLIC_KEY.storageKey);
    this.storage.removeItem(OWN_PRIVATE_KEY.storageKey);
    this.storage.removeItem(PEER_PUBLIC_KEY.storageKey);
  }
  async generateKeyPair() {
    const newKeyPair = await generateKeyPair();
    this.ownPrivateKey = newKeyPair.privateKey;
    this.ownPublicKey = newKeyPair.publicKey;
    await this.storeKey(OWN_PRIVATE_KEY, newKeyPair.privateKey);
    await this.storeKey(OWN_PUBLIC_KEY, newKeyPair.publicKey);
  }
  async loadKeysIfNeeded() {
    if (this.ownPrivateKey === null) {
      this.ownPrivateKey = await this.loadKey(OWN_PRIVATE_KEY);
    }
    if (this.ownPublicKey === null) {
      this.ownPublicKey = await this.loadKey(OWN_PUBLIC_KEY);
    }
    if (this.ownPrivateKey === null || this.ownPublicKey === null) {
      await this.generateKeyPair();
    }
    if (this.peerPublicKey === null) {
      this.peerPublicKey = await this.loadKey(PEER_PUBLIC_KEY);
    }
    if (this.sharedSecret === null) {
      if (this.ownPrivateKey === null || this.peerPublicKey === null)
        return;
      this.sharedSecret = await deriveSharedSecret(this.ownPrivateKey, this.peerPublicKey);
    }
  }
  // storage methods
  async loadKey(item) {
    const key = this.storage.getItem(item.storageKey);
    if (!key)
      return null;
    return importKeyFromHexString(item.keyType, key);
  }
  async storeKey(item, key) {
    const hexString = await exportKeyToHexString(item.keyType, key);
    this.storage.setItem(item.storageKey, hexString);
  }
};

// node_modules/@coinbase/wallet-sdk/dist/sdk-info.js
var VERSION = "4.2.3";
var NAME = "@coinbase/wallet-sdk";

// node_modules/@coinbase/wallet-sdk/dist/util/provider.js
async function fetchRPCRequest(request, rpcUrl) {
  const requestBody = Object.assign(Object.assign({}, request), { jsonrpc: "2.0", id: crypto.randomUUID() });
  const res = await window.fetch(rpcUrl, {
    method: "POST",
    body: JSON.stringify(requestBody),
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "X-Cbw-Sdk-Version": VERSION,
      "X-Cbw-Sdk-Platform": NAME
    }
  });
  const { result, error } = await res.json();
  if (error)
    throw error;
  return result;
}
function getCoinbaseInjectedLegacyProvider() {
  const window2 = globalThis;
  return window2.coinbaseWalletExtension;
}
function getInjectedEthereum() {
  var _a, _b;
  try {
    const window2 = globalThis;
    return (_a = window2.ethereum) !== null && _a !== void 0 ? _a : (_b = window2.top) === null || _b === void 0 ? void 0 : _b.ethereum;
  } catch (_c) {
    return void 0;
  }
}
function getCoinbaseInjectedProvider({ metadata, preference }) {
  var _a, _b;
  const { appName, appLogoUrl, appChainIds } = metadata;
  if (preference.options !== "smartWalletOnly") {
    const extension = getCoinbaseInjectedLegacyProvider();
    if (extension) {
      (_a = extension.setAppInfo) === null || _a === void 0 ? void 0 : _a.call(extension, appName, appLogoUrl, appChainIds, preference);
      return extension;
    }
  }
  const ethereum = getInjectedEthereum();
  if (ethereum === null || ethereum === void 0 ? void 0 : ethereum.isCoinbaseBrowser) {
    (_b = ethereum.setAppInfo) === null || _b === void 0 ? void 0 : _b.call(ethereum, appName, appLogoUrl, appChainIds, preference);
    return ethereum;
  }
  return void 0;
}
function checkErrorForInvalidRequestArgs(args) {
  if (!args || typeof args !== "object" || Array.isArray(args)) {
    throw standardErrors.rpc.invalidParams({
      message: "Expected a single, non-array, object argument.",
      data: args
    });
  }
  const { method, params } = args;
  if (typeof method !== "string" || method.length === 0) {
    throw standardErrors.rpc.invalidParams({
      message: "'args.method' must be a non-empty string.",
      data: args
    });
  }
  if (params !== void 0 && !Array.isArray(params) && (typeof params !== "object" || params === null)) {
    throw standardErrors.rpc.invalidParams({
      message: "'args.params' must be an object or array if provided.",
      data: args
    });
  }
  switch (method) {
    case "eth_sign":
    case "eth_signTypedData_v2":
    case "eth_subscribe":
    case "eth_unsubscribe":
      throw standardErrors.provider.unsupportedMethod();
  }
}

// node_modules/@coinbase/wallet-sdk/dist/sign/scw/SCWSigner.js
var ACCOUNTS_KEY = "accounts";
var ACTIVE_CHAIN_STORAGE_KEY = "activeChain";
var AVAILABLE_CHAINS_STORAGE_KEY = "availableChains";
var WALLET_CAPABILITIES_STORAGE_KEY = "walletCapabilities";
var SCWSigner = class {
  constructor(params) {
    var _a, _b, _c;
    this.metadata = params.metadata;
    this.communicator = params.communicator;
    this.callback = params.callback;
    this.keyManager = new SCWKeyManager();
    this.storage = new ScopedLocalStorage("CBWSDK", "SCWStateManager");
    this.accounts = (_a = this.storage.loadObject(ACCOUNTS_KEY)) !== null && _a !== void 0 ? _a : [];
    this.chain = this.storage.loadObject(ACTIVE_CHAIN_STORAGE_KEY) || {
      id: (_c = (_b = params.metadata.appChainIds) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : 1
    };
    this.handshake = this.handshake.bind(this);
    this.request = this.request.bind(this);
    this.createRequestMessage = this.createRequestMessage.bind(this);
    this.decryptResponseMessage = this.decryptResponseMessage.bind(this);
  }
  async handshake(args) {
    var _a, _b;
    const handshakeMessage = await this.createRequestMessage({
      handshake: {
        method: args.method,
        params: Object.assign({}, this.metadata, (_a = args.params) !== null && _a !== void 0 ? _a : {})
      }
    });
    const response = await this.communicator.postRequestAndWaitForResponse(handshakeMessage);
    if ("failure" in response.content)
      throw response.content.failure;
    const peerPublicKey = await importKeyFromHexString("public", response.sender);
    await this.keyManager.setPeerPublicKey(peerPublicKey);
    const decrypted = await this.decryptResponseMessage(response);
    const result = decrypted.result;
    if ("error" in result)
      throw result.error;
    const accounts = result.value;
    this.accounts = accounts;
    this.storage.storeObject(ACCOUNTS_KEY, accounts);
    (_b = this.callback) === null || _b === void 0 ? void 0 : _b.call(this, "accountsChanged", accounts);
  }
  async request(request) {
    var _a;
    if (this.accounts.length === 0) {
      throw standardErrors.provider.unauthorized();
    }
    switch (request.method) {
      case "eth_requestAccounts":
        (_a = this.callback) === null || _a === void 0 ? void 0 : _a.call(this, "connect", { chainId: hexStringFromNumber(this.chain.id) });
        return this.accounts;
      case "eth_accounts":
        return this.accounts;
      case "eth_coinbase":
        return this.accounts[0];
      case "net_version":
        return this.chain.id;
      case "eth_chainId":
        return hexStringFromNumber(this.chain.id);
      case "wallet_getCapabilities":
        return this.storage.loadObject(WALLET_CAPABILITIES_STORAGE_KEY);
      case "wallet_switchEthereumChain":
        return this.handleSwitchChainRequest(request);
      case "eth_ecRecover":
      case "personal_sign":
      case "personal_ecRecover":
      case "eth_signTransaction":
      case "eth_sendTransaction":
      case "eth_signTypedData_v1":
      case "eth_signTypedData_v3":
      case "eth_signTypedData_v4":
      case "eth_signTypedData":
      case "wallet_addEthereumChain":
      case "wallet_watchAsset":
      case "wallet_sendCalls":
      case "wallet_showCallsStatus":
      case "wallet_grantPermissions":
        return this.sendRequestToPopup(request);
      default:
        if (!this.chain.rpcUrl)
          throw standardErrors.rpc.internal("No RPC URL set for chain");
        return fetchRPCRequest(request, this.chain.rpcUrl);
    }
  }
  async sendRequestToPopup(request) {
    var _a, _b;
    await ((_b = (_a = this.communicator).waitForPopupLoaded) === null || _b === void 0 ? void 0 : _b.call(_a));
    const response = await this.sendEncryptedRequest(request);
    const decrypted = await this.decryptResponseMessage(response);
    const result = decrypted.result;
    if ("error" in result)
      throw result.error;
    return result.value;
  }
  async cleanup() {
    var _a, _b;
    this.storage.clear();
    await this.keyManager.clear();
    this.accounts = [];
    this.chain = {
      id: (_b = (_a = this.metadata.appChainIds) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : 1
    };
  }
  /**
   * @returns `null` if the request was successful.
   * https://eips.ethereum.org/EIPS/eip-3326#wallet_switchethereumchain
   */
  async handleSwitchChainRequest(request) {
    var _a;
    const params = request.params;
    if (!params || !((_a = params[0]) === null || _a === void 0 ? void 0 : _a.chainId)) {
      throw standardErrors.rpc.invalidParams();
    }
    const chainId = ensureIntNumber(params[0].chainId);
    const localResult = this.updateChain(chainId);
    if (localResult)
      return null;
    const popupResult = await this.sendRequestToPopup(request);
    if (popupResult === null) {
      this.updateChain(chainId);
    }
    return popupResult;
  }
  async sendEncryptedRequest(request) {
    const sharedSecret = await this.keyManager.getSharedSecret();
    if (!sharedSecret) {
      throw standardErrors.provider.unauthorized("No valid session found, try requestAccounts before other methods");
    }
    const encrypted = await encryptContent({
      action: request,
      chainId: this.chain.id
    }, sharedSecret);
    const message = await this.createRequestMessage({ encrypted });
    return this.communicator.postRequestAndWaitForResponse(message);
  }
  async createRequestMessage(content) {
    const publicKey = await exportKeyToHexString("public", await this.keyManager.getOwnPublicKey());
    return {
      id: crypto.randomUUID(),
      sender: publicKey,
      content,
      timestamp: /* @__PURE__ */ new Date()
    };
  }
  async decryptResponseMessage(message) {
    var _a, _b;
    const content = message.content;
    if ("failure" in content) {
      throw content.failure;
    }
    const sharedSecret = await this.keyManager.getSharedSecret();
    if (!sharedSecret) {
      throw standardErrors.provider.unauthorized("Invalid session");
    }
    const response = await decryptContent(content.encrypted, sharedSecret);
    const availableChains = (_a = response.data) === null || _a === void 0 ? void 0 : _a.chains;
    if (availableChains) {
      const chains = Object.entries(availableChains).map(([id, rpcUrl]) => ({
        id: Number(id),
        rpcUrl
      }));
      this.storage.storeObject(AVAILABLE_CHAINS_STORAGE_KEY, chains);
      this.updateChain(this.chain.id, chains);
    }
    const walletCapabilities = (_b = response.data) === null || _b === void 0 ? void 0 : _b.capabilities;
    if (walletCapabilities) {
      this.storage.storeObject(WALLET_CAPABILITIES_STORAGE_KEY, walletCapabilities);
    }
    return response;
  }
  updateChain(chainId, newAvailableChains) {
    var _a;
    const chains = newAvailableChains !== null && newAvailableChains !== void 0 ? newAvailableChains : this.storage.loadObject(AVAILABLE_CHAINS_STORAGE_KEY);
    const chain = chains === null || chains === void 0 ? void 0 : chains.find((chain2) => chain2.id === chainId);
    if (!chain)
      return false;
    if (chain !== this.chain) {
      this.chain = chain;
      this.storage.storeObject(ACTIVE_CHAIN_STORAGE_KEY, chain);
      (_a = this.callback) === null || _a === void 0 ? void 0 : _a.call(this, "chainChanged", hexStringFromNumber(chain.id));
    }
    return true;
  }
};

// node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/WalletLinkSigner.js
var import_eth_eip712_util = __toESM(require_eth_eip712_util(), 1);

// node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/constants.js
var WALLET_USER_NAME_KEY = "walletUsername";
var LOCAL_STORAGE_ADDRESSES_KEY = "Addresses";
var APP_VERSION_KEY = "AppVersion";

// node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/type/Web3Response.js
function isErrorResponse(response) {
  return response.errorMessage !== void 0;
}

// node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/connection/WalletLinkCipher.js
var WalletLinkCipher = class {
  // @param secret hex representation of 32-byte secret
  constructor(secret) {
    this.secret = secret;
  }
  /**
   *
   * @param plainText string to be encrypted
   * returns hex string representation of bytes in the order: initialization vector (iv),
   * auth tag, encrypted plaintext. IV is 12 bytes. Auth tag is 16 bytes. Remaining bytes are the
   * encrypted plainText.
   */
  async encrypt(plainText) {
    const secret = this.secret;
    if (secret.length !== 64)
      throw Error(`secret must be 256 bits`);
    const ivBytes = crypto.getRandomValues(new Uint8Array(12));
    const secretKey = await crypto.subtle.importKey("raw", hexStringToUint8Array(secret), { name: "aes-gcm" }, false, ["encrypt", "decrypt"]);
    const enc = new TextEncoder();
    const encryptedResult = await window.crypto.subtle.encrypt({
      name: "AES-GCM",
      iv: ivBytes
    }, secretKey, enc.encode(plainText));
    const tagLength = 16;
    const authTag = encryptedResult.slice(encryptedResult.byteLength - tagLength);
    const encryptedPlaintext = encryptedResult.slice(0, encryptedResult.byteLength - tagLength);
    const authTagBytes = new Uint8Array(authTag);
    const encryptedPlaintextBytes = new Uint8Array(encryptedPlaintext);
    const concatted = new Uint8Array([...ivBytes, ...authTagBytes, ...encryptedPlaintextBytes]);
    return uint8ArrayToHex(concatted);
  }
  /**
   *
   * @param cipherText hex string representation of bytes in the order: initialization vector (iv),
   * auth tag, encrypted plaintext. IV is 12 bytes. Auth tag is 16 bytes.
   */
  async decrypt(cipherText) {
    const secret = this.secret;
    if (secret.length !== 64)
      throw Error(`secret must be 256 bits`);
    return new Promise((resolve, reject) => {
      void async function() {
        const secretKey = await crypto.subtle.importKey("raw", hexStringToUint8Array(secret), { name: "aes-gcm" }, false, ["encrypt", "decrypt"]);
        const encrypted = hexStringToUint8Array(cipherText);
        const ivBytes = encrypted.slice(0, 12);
        const authTagBytes = encrypted.slice(12, 28);
        const encryptedPlaintextBytes = encrypted.slice(28);
        const concattedBytes = new Uint8Array([...encryptedPlaintextBytes, ...authTagBytes]);
        const algo = {
          name: "AES-GCM",
          iv: new Uint8Array(ivBytes)
        };
        try {
          const decrypted = await window.crypto.subtle.decrypt(algo, secretKey, concattedBytes);
          const decoder = new TextDecoder();
          resolve(decoder.decode(decrypted));
        } catch (err) {
          reject(err);
        }
      }();
    });
  }
};

// node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/connection/WalletLinkHTTP.js
var WalletLinkHTTP = class {
  constructor(linkAPIUrl, sessionId, sessionKey) {
    this.linkAPIUrl = linkAPIUrl;
    this.sessionId = sessionId;
    const credentials = `${sessionId}:${sessionKey}`;
    this.auth = `Basic ${btoa(credentials)}`;
  }
  // mark unseen events as seen
  async markUnseenEventsAsSeen(events) {
    return Promise.all(events.map((e) => fetch(`${this.linkAPIUrl}/events/${e.eventId}/seen`, {
      method: "POST",
      headers: {
        Authorization: this.auth
      }
    }))).catch((error) => console.error("Unabled to mark event as failed:", error));
  }
  async fetchUnseenEvents() {
    var _a;
    const response = await fetch(`${this.linkAPIUrl}/events?unseen=true`, {
      headers: {
        Authorization: this.auth
      }
    });
    if (response.ok) {
      const { events, error } = await response.json();
      if (error) {
        throw new Error(`Check unseen events failed: ${error}`);
      }
      const responseEvents = (_a = events === null || events === void 0 ? void 0 : events.filter((e) => e.event === "Web3Response").map((e) => ({
        type: "Event",
        sessionId: this.sessionId,
        eventId: e.id,
        event: e.event,
        data: e.data
      }))) !== null && _a !== void 0 ? _a : [];
      this.markUnseenEventsAsSeen(responseEvents);
      return responseEvents;
    }
    throw new Error(`Check unseen events failed: ${response.status}`);
  }
};

// node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/connection/WalletLinkWebSocket.js
var ConnectionState;
(function(ConnectionState2) {
  ConnectionState2[ConnectionState2["DISCONNECTED"] = 0] = "DISCONNECTED";
  ConnectionState2[ConnectionState2["CONNECTING"] = 1] = "CONNECTING";
  ConnectionState2[ConnectionState2["CONNECTED"] = 2] = "CONNECTED";
})(ConnectionState || (ConnectionState = {}));
var WalletLinkWebSocket = class {
  setConnectionStateListener(listener) {
    this.connectionStateListener = listener;
  }
  setIncomingDataListener(listener) {
    this.incomingDataListener = listener;
  }
  /**
   * Constructor
   * @param url WebSocket server URL
   * @param [WebSocketClass] Custom WebSocket implementation
   */
  constructor(url, WebSocketClass = WebSocket) {
    this.WebSocketClass = WebSocketClass;
    this.webSocket = null;
    this.pendingData = [];
    this.url = url.replace(/^http/, "ws");
  }
  /**
   * Make a websocket connection
   * @returns a Promise that resolves when connected
   */
  async connect() {
    if (this.webSocket) {
      throw new Error("webSocket object is not null");
    }
    return new Promise((resolve, reject) => {
      var _a;
      let webSocket;
      try {
        this.webSocket = webSocket = new this.WebSocketClass(this.url);
      } catch (err) {
        reject(err);
        return;
      }
      (_a = this.connectionStateListener) === null || _a === void 0 ? void 0 : _a.call(this, ConnectionState.CONNECTING);
      webSocket.onclose = (evt) => {
        var _a2;
        this.clearWebSocket();
        reject(new Error(`websocket error ${evt.code}: ${evt.reason}`));
        (_a2 = this.connectionStateListener) === null || _a2 === void 0 ? void 0 : _a2.call(this, ConnectionState.DISCONNECTED);
      };
      webSocket.onopen = (_) => {
        var _a2;
        resolve();
        (_a2 = this.connectionStateListener) === null || _a2 === void 0 ? void 0 : _a2.call(this, ConnectionState.CONNECTED);
        if (this.pendingData.length > 0) {
          const pending = [...this.pendingData];
          pending.forEach((data) => this.sendData(data));
          this.pendingData = [];
        }
      };
      webSocket.onmessage = (evt) => {
        var _a2, _b;
        if (evt.data === "h") {
          (_a2 = this.incomingDataListener) === null || _a2 === void 0 ? void 0 : _a2.call(this, {
            type: "Heartbeat"
          });
        } else {
          try {
            const message = JSON.parse(evt.data);
            (_b = this.incomingDataListener) === null || _b === void 0 ? void 0 : _b.call(this, message);
          } catch (_c) {
          }
        }
      };
    });
  }
  /**
   * Disconnect from server
   */
  disconnect() {
    var _a;
    const { webSocket } = this;
    if (!webSocket) {
      return;
    }
    this.clearWebSocket();
    (_a = this.connectionStateListener) === null || _a === void 0 ? void 0 : _a.call(this, ConnectionState.DISCONNECTED);
    this.connectionStateListener = void 0;
    this.incomingDataListener = void 0;
    try {
      webSocket.close();
    } catch (_b) {
    }
  }
  /**
   * Send data to server
   * @param data text to send
   */
  sendData(data) {
    const { webSocket } = this;
    if (!webSocket) {
      this.pendingData.push(data);
      this.connect();
      return;
    }
    webSocket.send(data);
  }
  clearWebSocket() {
    const { webSocket } = this;
    if (!webSocket) {
      return;
    }
    this.webSocket = null;
    webSocket.onclose = null;
    webSocket.onerror = null;
    webSocket.onmessage = null;
    webSocket.onopen = null;
  }
};

// node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/connection/WalletLinkConnection.js
var HEARTBEAT_INTERVAL = 1e4;
var REQUEST_TIMEOUT = 6e4;
var WalletLinkConnection = class {
  /**
   * Constructor
   * @param session Session
   * @param linkAPIUrl Coinbase Wallet link server URL
   * @param listener WalletLinkConnectionUpdateListener
   * @param [WebSocketClass] Custom WebSocket implementation
   */
  constructor({ session, linkAPIUrl, listener }) {
    this.destroyed = false;
    this.lastHeartbeatResponse = 0;
    this.nextReqId = IntNumber(1);
    this._connected = false;
    this._linked = false;
    this.shouldFetchUnseenEventsOnConnect = false;
    this.requestResolutions = /* @__PURE__ */ new Map();
    this.handleSessionMetadataUpdated = (metadata) => {
      if (!metadata)
        return;
      const handlers = /* @__PURE__ */ new Map([
        ["__destroyed", this.handleDestroyed],
        ["EthereumAddress", this.handleAccountUpdated],
        ["WalletUsername", this.handleWalletUsernameUpdated],
        ["AppVersion", this.handleAppVersionUpdated],
        [
          "ChainId",
          // ChainId and JsonRpcUrl are always updated together
          (v) => metadata.JsonRpcUrl && this.handleChainUpdated(v, metadata.JsonRpcUrl)
        ]
      ]);
      handlers.forEach((handler, key) => {
        const value = metadata[key];
        if (value === void 0)
          return;
        handler(value);
      });
    };
    this.handleDestroyed = (__destroyed) => {
      var _a;
      if (__destroyed !== "1")
        return;
      (_a = this.listener) === null || _a === void 0 ? void 0 : _a.resetAndReload();
    };
    this.handleAccountUpdated = async (encryptedEthereumAddress) => {
      var _a;
      const address = await this.cipher.decrypt(encryptedEthereumAddress);
      (_a = this.listener) === null || _a === void 0 ? void 0 : _a.accountUpdated(address);
    };
    this.handleMetadataUpdated = async (key, encryptedMetadataValue) => {
      var _a;
      const decryptedValue = await this.cipher.decrypt(encryptedMetadataValue);
      (_a = this.listener) === null || _a === void 0 ? void 0 : _a.metadataUpdated(key, decryptedValue);
    };
    this.handleWalletUsernameUpdated = async (walletUsername) => {
      this.handleMetadataUpdated(WALLET_USER_NAME_KEY, walletUsername);
    };
    this.handleAppVersionUpdated = async (appVersion) => {
      this.handleMetadataUpdated(APP_VERSION_KEY, appVersion);
    };
    this.handleChainUpdated = async (encryptedChainId, encryptedJsonRpcUrl) => {
      var _a;
      const chainId = await this.cipher.decrypt(encryptedChainId);
      const jsonRpcUrl = await this.cipher.decrypt(encryptedJsonRpcUrl);
      (_a = this.listener) === null || _a === void 0 ? void 0 : _a.chainUpdated(chainId, jsonRpcUrl);
    };
    this.session = session;
    this.cipher = new WalletLinkCipher(session.secret);
    this.listener = listener;
    const ws = new WalletLinkWebSocket(`${linkAPIUrl}/rpc`, WebSocket);
    ws.setConnectionStateListener(async (state) => {
      let connected = false;
      switch (state) {
        case ConnectionState.DISCONNECTED:
          if (!this.destroyed) {
            const connect = async () => {
              await new Promise((resolve) => setTimeout(resolve, 5e3));
              if (!this.destroyed) {
                ws.connect().catch(() => {
                  connect();
                });
              }
            };
            connect();
          }
          break;
        case ConnectionState.CONNECTED:
          connected = await this.handleConnected();
          this.updateLastHeartbeat();
          setInterval(() => {
            this.heartbeat();
          }, HEARTBEAT_INTERVAL);
          if (this.shouldFetchUnseenEventsOnConnect) {
            this.fetchUnseenEventsAPI();
          }
          break;
        case ConnectionState.CONNECTING:
          break;
      }
      if (this.connected !== connected) {
        this.connected = connected;
      }
    });
    ws.setIncomingDataListener((m) => {
      var _a;
      switch (m.type) {
        // handle server's heartbeat responses
        case "Heartbeat":
          this.updateLastHeartbeat();
          return;
        // handle link status updates
        case "IsLinkedOK":
        case "Linked": {
          const linked = m.type === "IsLinkedOK" ? m.linked : void 0;
          this.linked = linked || m.onlineGuests > 0;
          break;
        }
        // handle session config updates
        case "GetSessionConfigOK":
        case "SessionConfigUpdated": {
          this.handleSessionMetadataUpdated(m.metadata);
          break;
        }
        case "Event": {
          this.handleIncomingEvent(m);
          break;
        }
      }
      if (m.id !== void 0) {
        (_a = this.requestResolutions.get(m.id)) === null || _a === void 0 ? void 0 : _a(m);
      }
    });
    this.ws = ws;
    this.http = new WalletLinkHTTP(linkAPIUrl, session.id, session.key);
  }
  /**
   * Make a connection to the server
   */
  connect() {
    if (this.destroyed) {
      throw new Error("instance is destroyed");
    }
    this.ws.connect();
  }
  /**
   * Terminate connection, and mark as destroyed. To reconnect, create a new
   * instance of WalletSDKConnection
   */
  async destroy() {
    if (this.destroyed)
      return;
    await this.makeRequest({
      type: "SetSessionConfig",
      id: IntNumber(this.nextReqId++),
      sessionId: this.session.id,
      metadata: { __destroyed: "1" }
    }, { timeout: 1e3 });
    this.destroyed = true;
    this.ws.disconnect();
    this.listener = void 0;
  }
  get connected() {
    return this._connected;
  }
  set connected(connected) {
    this._connected = connected;
  }
  get linked() {
    return this._linked;
  }
  set linked(linked) {
    var _a, _b;
    this._linked = linked;
    if (linked)
      (_a = this.onceLinked) === null || _a === void 0 ? void 0 : _a.call(this);
    (_b = this.listener) === null || _b === void 0 ? void 0 : _b.linkedUpdated(linked);
  }
  setOnceLinked(callback) {
    return new Promise((resolve) => {
      if (this.linked) {
        callback().then(resolve);
      } else {
        this.onceLinked = () => {
          callback().then(resolve);
          this.onceLinked = void 0;
        };
      }
    });
  }
  async handleIncomingEvent(m) {
    var _a;
    if (m.type !== "Event" || m.event !== "Web3Response") {
      return;
    }
    const decryptedData = await this.cipher.decrypt(m.data);
    const message = JSON.parse(decryptedData);
    if (message.type !== "WEB3_RESPONSE")
      return;
    const { id, response } = message;
    (_a = this.listener) === null || _a === void 0 ? void 0 : _a.handleWeb3ResponseMessage(id, response);
  }
  async checkUnseenEvents() {
    if (!this.connected) {
      this.shouldFetchUnseenEventsOnConnect = true;
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
    try {
      await this.fetchUnseenEventsAPI();
    } catch (e) {
      console.error("Unable to check for unseen events", e);
    }
  }
  async fetchUnseenEventsAPI() {
    this.shouldFetchUnseenEventsOnConnect = false;
    const responseEvents = await this.http.fetchUnseenEvents();
    responseEvents.forEach((e) => this.handleIncomingEvent(e));
  }
  /**
   * Publish an event and emit event ID when successful
   * @param event event name
   * @param unencryptedData unencrypted event data
   * @param callWebhook whether the webhook should be invoked
   * @returns a Promise that emits event ID when successful
   */
  async publishEvent(event, unencryptedData, callWebhook = false) {
    const data = await this.cipher.encrypt(JSON.stringify(Object.assign(Object.assign({}, unencryptedData), { origin: location.origin, relaySource: "coinbaseWalletExtension" in window && window.coinbaseWalletExtension ? "injected_sdk" : "sdk" })));
    const message = {
      type: "PublishEvent",
      id: IntNumber(this.nextReqId++),
      sessionId: this.session.id,
      event,
      data,
      callWebhook
    };
    return this.setOnceLinked(async () => {
      const res = await this.makeRequest(message);
      if (res.type === "Fail") {
        throw new Error(res.error || "failed to publish event");
      }
      return res.eventId;
    });
  }
  sendData(message) {
    this.ws.sendData(JSON.stringify(message));
  }
  updateLastHeartbeat() {
    this.lastHeartbeatResponse = Date.now();
  }
  heartbeat() {
    if (Date.now() - this.lastHeartbeatResponse > HEARTBEAT_INTERVAL * 2) {
      this.ws.disconnect();
      return;
    }
    try {
      this.ws.sendData("h");
    } catch (_a) {
    }
  }
  async makeRequest(message, options = { timeout: REQUEST_TIMEOUT }) {
    const reqId = message.id;
    this.sendData(message);
    let timeoutId;
    return Promise.race([
      new Promise((_, reject) => {
        timeoutId = window.setTimeout(() => {
          reject(new Error(`request ${reqId} timed out`));
        }, options.timeout);
      }),
      new Promise((resolve) => {
        this.requestResolutions.set(reqId, (m) => {
          clearTimeout(timeoutId);
          resolve(m);
          this.requestResolutions.delete(reqId);
        });
      })
    ]);
  }
  async handleConnected() {
    const res = await this.makeRequest({
      type: "HostSession",
      id: IntNumber(this.nextReqId++),
      sessionId: this.session.id,
      sessionKey: this.session.key
    });
    if (res.type === "Fail")
      return false;
    this.sendData({
      type: "IsLinked",
      id: IntNumber(this.nextReqId++),
      sessionId: this.session.id
    });
    this.sendData({
      type: "GetSessionConfig",
      id: IntNumber(this.nextReqId++),
      sessionId: this.session.id
    });
    return true;
  }
};

// node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/RelayEventManager.js
var RelayEventManager = class {
  constructor() {
    this._nextRequestId = 0;
    this.callbacks = /* @__PURE__ */ new Map();
  }
  makeRequestId() {
    this._nextRequestId = (this._nextRequestId + 1) % 2147483647;
    const id = this._nextRequestId;
    const idStr = prepend0x(id.toString(16));
    const callback = this.callbacks.get(idStr);
    if (callback) {
      this.callbacks.delete(idStr);
    }
    return id;
  }
};

// node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/type/WalletLinkSession.js
var STORAGE_KEY_SESSION_ID = "session:id";
var STORAGE_KEY_SESSION_SECRET = "session:secret";
var STORAGE_KEY_SESSION_LINKED = "session:linked";
var WalletLinkSession = class _WalletLinkSession {
  constructor(storage2, id, secret, linked = false) {
    this.storage = storage2;
    this.id = id;
    this.secret = secret;
    this.key = bytesToHex(sha256(`${id}, ${secret} WalletLink`));
    this._linked = !!linked;
  }
  static create(storage2) {
    const id = randomBytesHex(16);
    const secret = randomBytesHex(32);
    return new _WalletLinkSession(storage2, id, secret).save();
  }
  static load(storage2) {
    const id = storage2.getItem(STORAGE_KEY_SESSION_ID);
    const linked = storage2.getItem(STORAGE_KEY_SESSION_LINKED);
    const secret = storage2.getItem(STORAGE_KEY_SESSION_SECRET);
    if (id && secret) {
      return new _WalletLinkSession(storage2, id, secret, linked === "1");
    }
    return null;
  }
  get linked() {
    return this._linked;
  }
  set linked(val) {
    this._linked = val;
    this.persistLinked();
  }
  save() {
    this.storage.setItem(STORAGE_KEY_SESSION_ID, this.id);
    this.storage.setItem(STORAGE_KEY_SESSION_SECRET, this.secret);
    this.persistLinked();
    return this;
  }
  persistLinked() {
    this.storage.setItem(STORAGE_KEY_SESSION_LINKED, this._linked ? "1" : "0");
  }
};

// node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/ui/components/util.js
function isInIFrame() {
  try {
    return window.frameElement !== null;
  } catch (e) {
    return false;
  }
}
function getLocation() {
  try {
    if (isInIFrame() && window.top) {
      return window.top.location;
    }
    return window.location;
  } catch (e) {
    return window.location;
  }
}
function isMobileWeb() {
  var _a;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test((_a = window === null || window === void 0 ? void 0 : window.navigator) === null || _a === void 0 ? void 0 : _a.userAgent);
}
function isDarkMode() {
  var _a, _b;
  return (_b = (_a = window === null || window === void 0 ? void 0 : window.matchMedia) === null || _a === void 0 ? void 0 : _a.call(window, "(prefers-color-scheme: dark)").matches) !== null && _b !== void 0 ? _b : false;
}

// node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/ui/components/cssReset/cssReset-css.js
var cssReset_css_default = /* @__PURE__ */ (() => `@namespace svg "http://www.w3.org/2000/svg";.-cbwsdk-css-reset,.-cbwsdk-css-reset *{animation:none;animation-delay:0;animation-direction:normal;animation-duration:0;animation-fill-mode:none;animation-iteration-count:1;animation-name:none;animation-play-state:running;animation-timing-function:ease;backface-visibility:visible;background:0;background-attachment:scroll;background-clip:border-box;background-color:rgba(0,0,0,0);background-image:none;background-origin:padding-box;background-position:0 0;background-position-x:0;background-position-y:0;background-repeat:repeat;background-size:auto auto;border:0;border-style:none;border-width:medium;border-color:inherit;border-bottom:0;border-bottom-color:inherit;border-bottom-left-radius:0;border-bottom-right-radius:0;border-bottom-style:none;border-bottom-width:medium;border-collapse:separate;border-image:none;border-left:0;border-left-color:inherit;border-left-style:none;border-left-width:medium;border-radius:0;border-right:0;border-right-color:inherit;border-right-style:none;border-right-width:medium;border-spacing:0;border-top:0;border-top-color:inherit;border-top-left-radius:0;border-top-right-radius:0;border-top-style:none;border-top-width:medium;box-shadow:none;box-sizing:border-box;caption-side:top;clear:none;clip:auto;color:inherit;columns:auto;column-count:auto;column-fill:balance;column-gap:normal;column-rule:medium none currentColor;column-rule-color:currentColor;column-rule-style:none;column-rule-width:none;column-span:1;column-width:auto;counter-increment:none;counter-reset:none;direction:ltr;empty-cells:show;float:none;font:normal;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif;font-size:medium;font-style:normal;font-variant:normal;font-weight:normal;height:auto;hyphens:none;letter-spacing:normal;line-height:normal;list-style:none;list-style-image:none;list-style-position:outside;list-style-type:disc;margin:0;margin-bottom:0;margin-left:0;margin-right:0;margin-top:0;opacity:1;orphans:0;outline:0;outline-color:invert;outline-style:none;outline-width:medium;overflow:visible;overflow-x:visible;overflow-y:visible;padding:0;padding-bottom:0;padding-left:0;padding-right:0;padding-top:0;page-break-after:auto;page-break-before:auto;page-break-inside:auto;perspective:none;perspective-origin:50% 50%;pointer-events:auto;position:static;quotes:"\\201C" "\\201D" "\\2018" "\\2019";tab-size:8;table-layout:auto;text-align:inherit;text-align-last:auto;text-decoration:none;text-decoration-color:inherit;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-shadow:none;text-transform:none;transform:none;transform-style:flat;transition:none;transition-delay:0s;transition-duration:0s;transition-property:none;transition-timing-function:ease;unicode-bidi:normal;vertical-align:baseline;visibility:visible;white-space:normal;widows:0;word-spacing:normal;z-index:auto}.-cbwsdk-css-reset strong{font-weight:bold}.-cbwsdk-css-reset *{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif;line-height:1}.-cbwsdk-css-reset [class*=container]{margin:0;padding:0}.-cbwsdk-css-reset style{display:none}`)();

// node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/ui/components/cssReset/cssReset.js
function injectCssReset() {
  const styleEl = document.createElement("style");
  styleEl.type = "text/css";
  styleEl.appendChild(document.createTextNode(cssReset_css_default));
  document.documentElement.appendChild(styleEl);
}

// node_modules/@coinbase/wallet-sdk/node_modules/clsx/dist/clsx.m.js
function r(e) {
  var t, f, n = "";
  if ("string" == typeof e || "number" == typeof e) n += e;
  else if ("object" == typeof e) if (Array.isArray(e)) for (t = 0; t < e.length; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
  else for (t in e) e[t] && (n && (n += " "), n += t);
  return n;
}
function clsx() {
  for (var e, t, f = 0, n = ""; f < arguments.length; ) (e = arguments[f++]) && (t = r(e)) && (n && (n += " "), n += t);
  return n;
}

// node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/ui/components/Snackbar/Snackbar.js
init_preact_module();
init_hooks_module();

// node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/ui/components/Snackbar/Snackbar-css.js
var Snackbar_css_default = /* @__PURE__ */ (() => `.-cbwsdk-css-reset .-gear-container{margin-left:16px !important;margin-right:9px !important;display:flex;align-items:center;justify-content:center;width:24px;height:24px;transition:opacity .25s}.-cbwsdk-css-reset .-gear-container *{user-select:none}.-cbwsdk-css-reset .-gear-container svg{opacity:0;position:absolute}.-cbwsdk-css-reset .-gear-icon{height:12px;width:12px;z-index:10000}.-cbwsdk-css-reset .-cbwsdk-snackbar{align-items:flex-end;display:flex;flex-direction:column;position:fixed;right:0;top:0;z-index:2147483647}.-cbwsdk-css-reset .-cbwsdk-snackbar *{user-select:none}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance{display:flex;flex-direction:column;margin:8px 16px 0 16px;overflow:visible;text-align:left;transform:translateX(0);transition:opacity .25s,transform .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-header:hover .-gear-container svg{opacity:1}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-header{display:flex;align-items:center;background:#fff;overflow:hidden;border:1px solid #e7ebee;box-sizing:border-box;border-radius:8px;cursor:pointer}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-header-cblogo{margin:8px 8px 8px 8px}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-header *{cursor:pointer}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-header-message{color:#000;font-size:13px;line-height:1.5;user-select:none}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu{background:#fff;transition:opacity .25s ease-in-out,transform .25s linear,visibility 0s;visibility:hidden;border:1px solid #e7ebee;box-sizing:border-box;border-radius:8px;opacity:0;flex-direction:column;padding-left:8px;padding-right:8px}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item:last-child{margin-bottom:8px !important}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item:hover{background:#f5f7f8;border-radius:6px;transition:background .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item:hover span{color:#050f19;transition:color .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item:hover svg path{fill:#000;transition:fill .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item{visibility:inherit;height:35px;margin-top:8px;margin-bottom:0;display:flex;flex-direction:row;align-items:center;padding:8px;cursor:pointer}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item *{visibility:inherit;cursor:pointer}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item-is-red:hover{background:rgba(223,95,103,.2);transition:background .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item-is-red:hover *{cursor:pointer}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item-is-red:hover svg path{fill:#df5f67;transition:fill .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item-is-red:hover span{color:#df5f67;transition:color .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item-info{color:#aaa;font-size:13px;margin:0 8px 0 32px;position:absolute}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-hidden{opacity:0;text-align:left;transform:translateX(25%);transition:opacity .5s linear}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-expanded .-cbwsdk-snackbar-instance-menu{opacity:1;display:flex;transform:translateY(8px);visibility:visible}`)();

// node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/ui/components/Snackbar/Snackbar.js
var cblogo = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEuNDkyIDEwLjQxOWE4LjkzIDguOTMgMCAwMTguOTMtOC45M2gxMS4xNjNhOC45MyA4LjkzIDAgMDE4LjkzIDguOTN2MTEuMTYzYTguOTMgOC45MyAwIDAxLTguOTMgOC45M0gxMC40MjJhOC45MyA4LjkzIDAgMDEtOC45My04LjkzVjEwLjQxOXoiIGZpbGw9IiMxNjUyRjAiLz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEwLjQxOSAwSDIxLjU4QzI3LjMzNSAwIDMyIDQuNjY1IDMyIDEwLjQxOVYyMS41OEMzMiAyNy4zMzUgMjcuMzM1IDMyIDIxLjU4MSAzMkgxMC40MkM0LjY2NSAzMiAwIDI3LjMzNSAwIDIxLjU4MVYxMC40MkMwIDQuNjY1IDQuNjY1IDAgMTAuNDE5IDB6bTAgMS40ODhhOC45MyA4LjkzIDAgMDAtOC45MyA4LjkzdjExLjE2M2E4LjkzIDguOTMgMCAwMDguOTMgOC45M0gyMS41OGE4LjkzIDguOTMgMCAwMDguOTMtOC45M1YxMC40MmE4LjkzIDguOTMgMCAwMC04LjkzLTguOTNIMTAuNDJ6IiBmaWxsPSIjZmZmIi8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNS45OTggMjYuMDQ5Yy01LjU0OSAwLTEwLjA0Ny00LjQ5OC0xMC4wNDctMTAuMDQ3IDAtNS41NDggNC40OTgtMTAuMDQ2IDEwLjA0Ny0xMC4wNDYgNS41NDggMCAxMC4wNDYgNC40OTggMTAuMDQ2IDEwLjA0NiAwIDUuNTQ5LTQuNDk4IDEwLjA0Ny0xMC4wNDYgMTAuMDQ3eiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0xMi43NjIgMTQuMjU0YzAtLjgyMi42NjctMS40ODkgMS40ODktMS40ODloMy40OTdjLjgyMiAwIDEuNDg4LjY2NiAxLjQ4OCAxLjQ4OXYzLjQ5N2MwIC44MjItLjY2NiAxLjQ4OC0xLjQ4OCAxLjQ4OGgtMy40OTdhMS40ODggMS40ODggMCAwMS0xLjQ4OS0xLjQ4OHYtMy40OTh6IiBmaWxsPSIjMTY1MkYwIi8+PC9zdmc+`;
var gearIcon = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDYuNzV2LTEuNWwtMS43Mi0uNTdjLS4wOC0uMjctLjE5LS41Mi0uMzItLjc3bC44MS0xLjYyLTEuMDYtMS4wNi0xLjYyLjgxYy0uMjQtLjEzLS41LS4yNC0uNzctLjMyTDYuNzUgMGgtMS41bC0uNTcgMS43MmMtLjI3LjA4LS41My4xOS0uNzcuMzJsLTEuNjItLjgxLTEuMDYgMS4wNi44MSAxLjYyYy0uMTMuMjQtLjI0LjUtLjMyLjc3TDAgNS4yNXYxLjVsMS43Mi41N2MuMDguMjcuMTkuNTMuMzIuNzdsLS44MSAxLjYyIDEuMDYgMS4wNiAxLjYyLS44MWMuMjQuMTMuNS4yMy43Ny4zMkw1LjI1IDEyaDEuNWwuNTctMS43MmMuMjctLjA4LjUyLS4xOS43Ny0uMzJsMS42Mi44MSAxLjA2LTEuMDYtLjgxLTEuNjJjLjEzLS4yNC4yMy0uNS4zMi0uNzdMMTIgNi43NXpNNiA4LjVhMi41IDIuNSAwIDAxMC01IDIuNSAyLjUgMCAwMTAgNXoiIGZpbGw9IiMwNTBGMTkiLz48L3N2Zz4=`;
var Snackbar = class {
  constructor() {
    this.items = /* @__PURE__ */ new Map();
    this.nextItemKey = 0;
    this.root = null;
    this.darkMode = isDarkMode();
  }
  attach(el) {
    this.root = document.createElement("div");
    this.root.className = "-cbwsdk-snackbar-root";
    el.appendChild(this.root);
    this.render();
  }
  presentItem(itemProps) {
    const key = this.nextItemKey++;
    this.items.set(key, itemProps);
    this.render();
    return () => {
      this.items.delete(key);
      this.render();
    };
  }
  clear() {
    this.items.clear();
    this.render();
  }
  render() {
    if (!this.root) {
      return;
    }
    D(g(
      "div",
      null,
      g(SnackbarContainer, { darkMode: this.darkMode }, Array.from(this.items.entries()).map(([key, itemProps]) => g(SnackbarInstance, Object.assign({}, itemProps, { key }))))
    ), this.root);
  }
};
var SnackbarContainer = (props) => g(
  "div",
  { class: clsx("-cbwsdk-snackbar-container") },
  g("style", null, Snackbar_css_default),
  g("div", { class: "-cbwsdk-snackbar" }, props.children)
);
var SnackbarInstance = ({ autoExpand, message, menuItems }) => {
  const [hidden, setHidden] = h(true);
  const [expanded, setExpanded] = h(autoExpand !== null && autoExpand !== void 0 ? autoExpand : false);
  y(() => {
    const timers = [
      window.setTimeout(() => {
        setHidden(false);
      }, 1),
      window.setTimeout(() => {
        setExpanded(true);
      }, 1e4)
    ];
    return () => {
      timers.forEach(window.clearTimeout);
    };
  });
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  return g(
    "div",
    { class: clsx("-cbwsdk-snackbar-instance", hidden && "-cbwsdk-snackbar-instance-hidden", expanded && "-cbwsdk-snackbar-instance-expanded") },
    g(
      "div",
      { class: "-cbwsdk-snackbar-instance-header", onClick: toggleExpanded },
      g("img", { src: cblogo, class: "-cbwsdk-snackbar-instance-header-cblogo" }),
      " ",
      g("div", { class: "-cbwsdk-snackbar-instance-header-message" }, message),
      g(
        "div",
        { class: "-gear-container" },
        !expanded && g(
          "svg",
          { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
          g("circle", { cx: "12", cy: "12", r: "12", fill: "#F5F7F8" })
        ),
        g("img", { src: gearIcon, class: "-gear-icon", title: "Expand" })
      )
    ),
    menuItems && menuItems.length > 0 && g("div", { class: "-cbwsdk-snackbar-instance-menu" }, menuItems.map((action, i) => g(
      "div",
      { class: clsx("-cbwsdk-snackbar-instance-menu-item", action.isRed && "-cbwsdk-snackbar-instance-menu-item-is-red"), onClick: action.onClick, key: i },
      g(
        "svg",
        { width: action.svgWidth, height: action.svgHeight, viewBox: "0 0 10 11", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
        g("path", { "fill-rule": action.defaultFillRule, "clip-rule": action.defaultClipRule, d: action.path, fill: "#AAAAAA" })
      ),
      g("span", { class: clsx("-cbwsdk-snackbar-instance-menu-item-info", action.isRed && "-cbwsdk-snackbar-instance-menu-item-info-is-red") }, action.info)
    )))
  );
};

// node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/ui/WalletLinkRelayUI.js
var WalletLinkRelayUI = class {
  constructor() {
    this.attached = false;
    this.snackbar = new Snackbar();
  }
  attach() {
    if (this.attached) {
      throw new Error("Coinbase Wallet SDK UI is already attached");
    }
    const el = document.documentElement;
    const container = document.createElement("div");
    container.className = "-cbwsdk-css-reset";
    el.appendChild(container);
    this.snackbar.attach(container);
    this.attached = true;
    injectCssReset();
  }
  showConnecting(options) {
    let snackbarProps;
    if (options.isUnlinkedErrorState) {
      snackbarProps = {
        autoExpand: true,
        message: "Connection lost",
        menuItems: [
          {
            isRed: false,
            info: "Reset connection",
            svgWidth: "10",
            svgHeight: "11",
            path: "M5.00008 0.96875C6.73133 0.96875 8.23758 1.94375 9.00008 3.375L10.0001 2.375V5.5H9.53133H7.96883H6.87508L7.80633 4.56875C7.41258 3.3875 6.31258 2.53125 5.00008 2.53125C3.76258 2.53125 2.70633 3.2875 2.25633 4.36875L0.812576 3.76875C1.50008 2.125 3.11258 0.96875 5.00008 0.96875ZM2.19375 6.43125C2.5875 7.6125 3.6875 8.46875 5 8.46875C6.2375 8.46875 7.29375 7.7125 7.74375 6.63125L9.1875 7.23125C8.5 8.875 6.8875 10.0312 5 10.0312C3.26875 10.0312 1.7625 9.05625 1 7.625L0 8.625V5.5H0.46875H2.03125H3.125L2.19375 6.43125Z",
            defaultFillRule: "evenodd",
            defaultClipRule: "evenodd",
            onClick: options.onResetConnection
          }
        ]
      };
    } else {
      snackbarProps = {
        message: "Confirm on phone",
        menuItems: [
          {
            isRed: true,
            info: "Cancel transaction",
            svgWidth: "11",
            svgHeight: "11",
            path: "M10.3711 1.52346L9.21775 0.370117L5.37109 4.21022L1.52444 0.370117L0.371094 1.52346L4.2112 5.37012L0.371094 9.21677L1.52444 10.3701L5.37109 6.53001L9.21775 10.3701L10.3711 9.21677L6.53099 5.37012L10.3711 1.52346Z",
            defaultFillRule: "inherit",
            defaultClipRule: "inherit",
            onClick: options.onCancel
          },
          {
            isRed: false,
            info: "Reset connection",
            svgWidth: "10",
            svgHeight: "11",
            path: "M5.00008 0.96875C6.73133 0.96875 8.23758 1.94375 9.00008 3.375L10.0001 2.375V5.5H9.53133H7.96883H6.87508L7.80633 4.56875C7.41258 3.3875 6.31258 2.53125 5.00008 2.53125C3.76258 2.53125 2.70633 3.2875 2.25633 4.36875L0.812576 3.76875C1.50008 2.125 3.11258 0.96875 5.00008 0.96875ZM2.19375 6.43125C2.5875 7.6125 3.6875 8.46875 5 8.46875C6.2375 8.46875 7.29375 7.7125 7.74375 6.63125L9.1875 7.23125C8.5 8.875 6.8875 10.0312 5 10.0312C3.26875 10.0312 1.7625 9.05625 1 7.625L0 8.625V5.5H0.46875H2.03125H3.125L2.19375 6.43125Z",
            defaultFillRule: "evenodd",
            defaultClipRule: "evenodd",
            onClick: options.onResetConnection
          }
        ]
      };
    }
    return this.snackbar.presentItem(snackbarProps);
  }
};

// node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/ui/components/RedirectDialog/RedirectDialog.js
init_preact_module();

// node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/ui/components/RedirectDialog/RedirectDialog-css.js
var RedirectDialog_css_default = /* @__PURE__ */ (() => `.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-backdrop{position:fixed;top:0;left:0;right:0;bottom:0;transition:opacity .25s;background-color:rgba(10,11,13,.5)}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-backdrop-hidden{opacity:0}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-box{display:block;position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);padding:20px;border-radius:8px;background-color:#fff;color:#0a0b0d}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-box p{display:block;font-weight:400;font-size:14px;line-height:20px;padding-bottom:12px;color:#5b636e}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-box button{appearance:none;border:none;background:none;color:#0052ff;padding:0;text-decoration:none;display:block;font-weight:600;font-size:16px;line-height:24px}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-box.dark{background-color:#0a0b0d;color:#fff}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-box.dark button{color:#0052ff}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-box.light{background-color:#fff;color:#0a0b0d}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-box.light button{color:#0052ff}`)();

// node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/ui/components/RedirectDialog/RedirectDialog.js
var RedirectDialog = class {
  constructor() {
    this.root = null;
    this.darkMode = isDarkMode();
  }
  attach() {
    const el = document.documentElement;
    this.root = document.createElement("div");
    this.root.className = "-cbwsdk-css-reset";
    el.appendChild(this.root);
    injectCssReset();
  }
  present(props) {
    this.render(props);
  }
  clear() {
    this.render(null);
  }
  render(props) {
    if (!this.root)
      return;
    D(null, this.root);
    if (!props)
      return;
    D(g(RedirectDialogContent, Object.assign({}, props, { onDismiss: () => {
      this.clear();
    }, darkMode: this.darkMode })), this.root);
  }
};
var RedirectDialogContent = ({ title, buttonText, darkMode, onButtonClick, onDismiss }) => {
  const theme = darkMode ? "dark" : "light";
  return g(
    SnackbarContainer,
    { darkMode },
    g(
      "div",
      { class: "-cbwsdk-redirect-dialog" },
      g("style", null, RedirectDialog_css_default),
      g("div", { class: "-cbwsdk-redirect-dialog-backdrop", onClick: onDismiss }),
      g(
        "div",
        { class: clsx("-cbwsdk-redirect-dialog-box", theme) },
        g("p", null, title),
        g("button", { onClick: onButtonClick }, buttonText)
      )
    )
  );
};

// node_modules/@coinbase/wallet-sdk/dist/core/constants.js
var CB_KEYS_URL = "https://keys.coinbase.com/connect";
var WALLETLINK_URL = "https://www.walletlink.org";
var CBW_MOBILE_DEEPLINK_URL = "https://go.cb-w.com/walletlink";

// node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/ui/WLMobileRelayUI.js
var WLMobileRelayUI = class {
  constructor() {
    this.attached = false;
    this.redirectDialog = new RedirectDialog();
  }
  attach() {
    if (this.attached) {
      throw new Error("Coinbase Wallet SDK UI is already attached");
    }
    this.redirectDialog.attach();
    this.attached = true;
  }
  redirectToCoinbaseWallet(walletLinkUrl) {
    const url = new URL(CBW_MOBILE_DEEPLINK_URL);
    url.searchParams.append("redirect_url", getLocation().href);
    if (walletLinkUrl) {
      url.searchParams.append("wl_url", walletLinkUrl);
    }
    const anchorTag = document.createElement("a");
    anchorTag.target = "cbw-opener";
    anchorTag.href = url.href;
    anchorTag.rel = "noreferrer noopener";
    anchorTag.click();
  }
  openCoinbaseWalletDeeplink(walletLinkUrl) {
    this.redirectDialog.present({
      title: "Redirecting to Coinbase Wallet...",
      buttonText: "Open",
      onButtonClick: () => {
        this.redirectToCoinbaseWallet(walletLinkUrl);
      }
    });
    setTimeout(() => {
      this.redirectToCoinbaseWallet(walletLinkUrl);
    }, 99);
  }
  showConnecting(_options) {
    return () => {
      this.redirectDialog.clear();
    };
  }
};

// node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/WalletLinkRelay.js
var WalletLinkRelay = class _WalletLinkRelay {
  constructor(options) {
    this.chainCallbackParams = { chainId: "", jsonRpcUrl: "" };
    this.isMobileWeb = isMobileWeb();
    this.linkedUpdated = (linked) => {
      this.isLinked = linked;
      const cachedAddresses = this.storage.getItem(LOCAL_STORAGE_ADDRESSES_KEY);
      if (linked) {
        this._session.linked = linked;
      }
      this.isUnlinkedErrorState = false;
      if (cachedAddresses) {
        const addresses = cachedAddresses.split(" ");
        const wasConnectedViaStandalone = this.storage.getItem("IsStandaloneSigning") === "true";
        if (addresses[0] !== "" && !linked && this._session.linked && !wasConnectedViaStandalone) {
          this.isUnlinkedErrorState = true;
        }
      }
    };
    this.metadataUpdated = (key, value) => {
      this.storage.setItem(key, value);
    };
    this.chainUpdated = (chainId, jsonRpcUrl) => {
      if (this.chainCallbackParams.chainId === chainId && this.chainCallbackParams.jsonRpcUrl === jsonRpcUrl) {
        return;
      }
      this.chainCallbackParams = {
        chainId,
        jsonRpcUrl
      };
      if (this.chainCallback) {
        this.chainCallback(jsonRpcUrl, Number.parseInt(chainId, 10));
      }
    };
    this.accountUpdated = (selectedAddress) => {
      if (this.accountsCallback) {
        this.accountsCallback([selectedAddress]);
      }
      if (_WalletLinkRelay.accountRequestCallbackIds.size > 0) {
        Array.from(_WalletLinkRelay.accountRequestCallbackIds.values()).forEach((id) => {
          this.invokeCallback(id, {
            method: "requestEthereumAccounts",
            result: [selectedAddress]
          });
        });
        _WalletLinkRelay.accountRequestCallbackIds.clear();
      }
    };
    this.resetAndReload = this.resetAndReload.bind(this);
    this.linkAPIUrl = options.linkAPIUrl;
    this.storage = options.storage;
    this.metadata = options.metadata;
    this.accountsCallback = options.accountsCallback;
    this.chainCallback = options.chainCallback;
    const { session, ui, connection } = this.subscribe();
    this._session = session;
    this.connection = connection;
    this.relayEventManager = new RelayEventManager();
    this.ui = ui;
    this.ui.attach();
  }
  subscribe() {
    const session = WalletLinkSession.load(this.storage) || WalletLinkSession.create(this.storage);
    const { linkAPIUrl } = this;
    const connection = new WalletLinkConnection({
      session,
      linkAPIUrl,
      listener: this
    });
    const ui = this.isMobileWeb ? new WLMobileRelayUI() : new WalletLinkRelayUI();
    connection.connect();
    return { session, ui, connection };
  }
  resetAndReload() {
    this.connection.destroy().then(() => {
      const storedSession = WalletLinkSession.load(this.storage);
      if ((storedSession === null || storedSession === void 0 ? void 0 : storedSession.id) === this._session.id) {
        ScopedLocalStorage.clearAll();
      }
      document.location.reload();
    }).catch((_) => {
    });
  }
  signEthereumTransaction(params) {
    return this.sendRequest({
      method: "signEthereumTransaction",
      params: {
        fromAddress: params.fromAddress,
        toAddress: params.toAddress,
        weiValue: bigIntStringFromBigInt(params.weiValue),
        data: hexStringFromBuffer(params.data, true),
        nonce: params.nonce,
        gasPriceInWei: params.gasPriceInWei ? bigIntStringFromBigInt(params.gasPriceInWei) : null,
        maxFeePerGas: params.gasPriceInWei ? bigIntStringFromBigInt(params.gasPriceInWei) : null,
        maxPriorityFeePerGas: params.gasPriceInWei ? bigIntStringFromBigInt(params.gasPriceInWei) : null,
        gasLimit: params.gasLimit ? bigIntStringFromBigInt(params.gasLimit) : null,
        chainId: params.chainId,
        shouldSubmit: false
      }
    });
  }
  signAndSubmitEthereumTransaction(params) {
    return this.sendRequest({
      method: "signEthereumTransaction",
      params: {
        fromAddress: params.fromAddress,
        toAddress: params.toAddress,
        weiValue: bigIntStringFromBigInt(params.weiValue),
        data: hexStringFromBuffer(params.data, true),
        nonce: params.nonce,
        gasPriceInWei: params.gasPriceInWei ? bigIntStringFromBigInt(params.gasPriceInWei) : null,
        maxFeePerGas: params.maxFeePerGas ? bigIntStringFromBigInt(params.maxFeePerGas) : null,
        maxPriorityFeePerGas: params.maxPriorityFeePerGas ? bigIntStringFromBigInt(params.maxPriorityFeePerGas) : null,
        gasLimit: params.gasLimit ? bigIntStringFromBigInt(params.gasLimit) : null,
        chainId: params.chainId,
        shouldSubmit: true
      }
    });
  }
  submitEthereumTransaction(signedTransaction, chainId) {
    return this.sendRequest({
      method: "submitEthereumTransaction",
      params: {
        signedTransaction: hexStringFromBuffer(signedTransaction, true),
        chainId
      }
    });
  }
  getWalletLinkSession() {
    return this._session;
  }
  sendRequest(request) {
    let hideSnackbarItem = null;
    const id = randomBytesHex(8);
    const cancel = (error) => {
      this.publishWeb3RequestCanceledEvent(id);
      this.handleErrorResponse(id, request.method, error);
      hideSnackbarItem === null || hideSnackbarItem === void 0 ? void 0 : hideSnackbarItem();
    };
    return new Promise((resolve, reject) => {
      {
        hideSnackbarItem = this.ui.showConnecting({
          isUnlinkedErrorState: this.isUnlinkedErrorState,
          onCancel: cancel,
          onResetConnection: this.resetAndReload
          // eslint-disable-line @typescript-eslint/unbound-method
        });
      }
      this.relayEventManager.callbacks.set(id, (response) => {
        hideSnackbarItem === null || hideSnackbarItem === void 0 ? void 0 : hideSnackbarItem();
        if (isErrorResponse(response)) {
          return reject(new Error(response.errorMessage));
        }
        resolve(response);
      });
      this.publishWeb3RequestEvent(id, request);
    });
  }
  publishWeb3RequestEvent(id, request) {
    const message = { type: "WEB3_REQUEST", id, request };
    this.publishEvent("Web3Request", message, true).then((_) => {
    }).catch((err) => {
      this.handleWeb3ResponseMessage(message.id, {
        method: request.method,
        errorMessage: err.message
      });
    });
    if (this.isMobileWeb) {
      this.openCoinbaseWalletDeeplink(request.method);
    }
  }
  // copied from MobileRelay
  openCoinbaseWalletDeeplink(method) {
    if (!(this.ui instanceof WLMobileRelayUI))
      return;
    switch (method) {
      case "requestEthereumAccounts":
      // requestEthereumAccounts is handled via popup
      case "switchEthereumChain":
        return;
      default:
        window.addEventListener("blur", () => {
          window.addEventListener("focus", () => {
            this.connection.checkUnseenEvents();
          }, { once: true });
        }, { once: true });
        this.ui.openCoinbaseWalletDeeplink();
        break;
    }
  }
  publishWeb3RequestCanceledEvent(id) {
    const message = {
      type: "WEB3_REQUEST_CANCELED",
      id
    };
    this.publishEvent("Web3RequestCanceled", message, false).then();
  }
  publishEvent(event, message, callWebhook) {
    return this.connection.publishEvent(event, message, callWebhook);
  }
  handleWeb3ResponseMessage(id, response) {
    if (response.method === "requestEthereumAccounts") {
      _WalletLinkRelay.accountRequestCallbackIds.forEach((id2) => this.invokeCallback(id2, response));
      _WalletLinkRelay.accountRequestCallbackIds.clear();
      return;
    }
    this.invokeCallback(id, response);
  }
  handleErrorResponse(id, method, error) {
    var _a;
    const errorMessage = (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Unspecified error message.";
    this.handleWeb3ResponseMessage(id, {
      method,
      errorMessage
    });
  }
  invokeCallback(id, response) {
    const callback = this.relayEventManager.callbacks.get(id);
    if (callback) {
      callback(response);
      this.relayEventManager.callbacks.delete(id);
    }
  }
  requestEthereumAccounts() {
    const { appName, appLogoUrl } = this.metadata;
    const request = {
      method: "requestEthereumAccounts",
      params: {
        appName,
        appLogoUrl
      }
    };
    const hideSnackbarItem = null;
    const id = randomBytesHex(8);
    return new Promise((resolve, reject) => {
      this.relayEventManager.callbacks.set(id, (response) => {
        hideSnackbarItem === null || hideSnackbarItem === void 0 ? void 0 : hideSnackbarItem();
        if (isErrorResponse(response)) {
          return reject(new Error(response.errorMessage));
        }
        resolve(response);
      });
      _WalletLinkRelay.accountRequestCallbackIds.add(id);
      this.publishWeb3RequestEvent(id, request);
    });
  }
  watchAsset(type, address, symbol, decimals, image, chainId) {
    const request = {
      method: "watchAsset",
      params: {
        type,
        options: {
          address,
          symbol,
          decimals,
          image
        },
        chainId
      }
    };
    let hideSnackbarItem = null;
    const id = randomBytesHex(8);
    const cancel = (error) => {
      this.publishWeb3RequestCanceledEvent(id);
      this.handleErrorResponse(id, request.method, error);
      hideSnackbarItem === null || hideSnackbarItem === void 0 ? void 0 : hideSnackbarItem();
    };
    {
      hideSnackbarItem = this.ui.showConnecting({
        isUnlinkedErrorState: this.isUnlinkedErrorState,
        onCancel: cancel,
        onResetConnection: this.resetAndReload
        // eslint-disable-line @typescript-eslint/unbound-method
      });
    }
    return new Promise((resolve, reject) => {
      this.relayEventManager.callbacks.set(id, (response) => {
        hideSnackbarItem === null || hideSnackbarItem === void 0 ? void 0 : hideSnackbarItem();
        if (isErrorResponse(response)) {
          return reject(new Error(response.errorMessage));
        }
        resolve(response);
      });
      this.publishWeb3RequestEvent(id, request);
    });
  }
  addEthereumChain(chainId, rpcUrls, iconUrls, blockExplorerUrls, chainName, nativeCurrency) {
    const request = {
      method: "addEthereumChain",
      params: {
        chainId,
        rpcUrls,
        blockExplorerUrls,
        chainName,
        iconUrls,
        nativeCurrency
      }
    };
    let hideSnackbarItem = null;
    const id = randomBytesHex(8);
    const cancel = (error) => {
      this.publishWeb3RequestCanceledEvent(id);
      this.handleErrorResponse(id, request.method, error);
      hideSnackbarItem === null || hideSnackbarItem === void 0 ? void 0 : hideSnackbarItem();
    };
    {
      hideSnackbarItem = this.ui.showConnecting({
        isUnlinkedErrorState: this.isUnlinkedErrorState,
        onCancel: cancel,
        onResetConnection: this.resetAndReload
        // eslint-disable-line @typescript-eslint/unbound-method
      });
    }
    return new Promise((resolve, reject) => {
      this.relayEventManager.callbacks.set(id, (response) => {
        hideSnackbarItem === null || hideSnackbarItem === void 0 ? void 0 : hideSnackbarItem();
        if (isErrorResponse(response)) {
          return reject(new Error(response.errorMessage));
        }
        resolve(response);
      });
      this.publishWeb3RequestEvent(id, request);
    });
  }
  switchEthereumChain(chainId, address) {
    const request = {
      method: "switchEthereumChain",
      params: Object.assign({ chainId }, { address })
    };
    let hideSnackbarItem = null;
    const id = randomBytesHex(8);
    const cancel = (error) => {
      this.publishWeb3RequestCanceledEvent(id);
      this.handleErrorResponse(id, request.method, error);
      hideSnackbarItem === null || hideSnackbarItem === void 0 ? void 0 : hideSnackbarItem();
    };
    {
      hideSnackbarItem = this.ui.showConnecting({
        isUnlinkedErrorState: this.isUnlinkedErrorState,
        onCancel: cancel,
        onResetConnection: this.resetAndReload
        // eslint-disable-line @typescript-eslint/unbound-method
      });
    }
    return new Promise((resolve, reject) => {
      this.relayEventManager.callbacks.set(id, (response) => {
        hideSnackbarItem === null || hideSnackbarItem === void 0 ? void 0 : hideSnackbarItem();
        if (isErrorResponse(response) && response.errorCode) {
          return reject(standardErrors.provider.custom({
            code: response.errorCode,
            message: `Unrecognized chain ID. Try adding the chain using addEthereumChain first.`
          }));
        } else if (isErrorResponse(response)) {
          return reject(new Error(response.errorMessage));
        }
        resolve(response);
      });
      this.publishWeb3RequestEvent(id, request);
    });
  }
};
WalletLinkRelay.accountRequestCallbackIds = /* @__PURE__ */ new Set();

// node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/WalletLinkSigner.js
var DEFAULT_CHAIN_ID_KEY = "DefaultChainId";
var DEFAULT_JSON_RPC_URL = "DefaultJsonRpcUrl";
var WalletLinkSigner = class {
  constructor(options) {
    this._relay = null;
    this._addresses = [];
    this.metadata = options.metadata;
    this._storage = new ScopedLocalStorage("walletlink", WALLETLINK_URL);
    this.callback = options.callback || null;
    const cachedAddresses = this._storage.getItem(LOCAL_STORAGE_ADDRESSES_KEY);
    if (cachedAddresses) {
      const addresses = cachedAddresses.split(" ");
      if (addresses[0] !== "") {
        this._addresses = addresses.map((address) => ensureAddressString(address));
      }
    }
    this.initializeRelay();
  }
  getSession() {
    const relay = this.initializeRelay();
    const { id, secret } = relay.getWalletLinkSession();
    return { id, secret };
  }
  async handshake() {
    await this._eth_requestAccounts();
  }
  get selectedAddress() {
    return this._addresses[0] || void 0;
  }
  get jsonRpcUrl() {
    var _a;
    return (_a = this._storage.getItem(DEFAULT_JSON_RPC_URL)) !== null && _a !== void 0 ? _a : void 0;
  }
  set jsonRpcUrl(value) {
    this._storage.setItem(DEFAULT_JSON_RPC_URL, value);
  }
  updateProviderInfo(jsonRpcUrl, chainId) {
    var _a;
    this.jsonRpcUrl = jsonRpcUrl;
    const originalChainId = this.getChainId();
    this._storage.setItem(DEFAULT_CHAIN_ID_KEY, chainId.toString(10));
    const chainChanged = ensureIntNumber(chainId) !== originalChainId;
    if (chainChanged) {
      (_a = this.callback) === null || _a === void 0 ? void 0 : _a.call(this, "chainChanged", hexStringFromNumber(chainId));
    }
  }
  async watchAsset(params) {
    const request = Array.isArray(params) ? params[0] : params;
    if (!request.type) {
      throw standardErrors.rpc.invalidParams("Type is required");
    }
    if ((request === null || request === void 0 ? void 0 : request.type) !== "ERC20") {
      throw standardErrors.rpc.invalidParams(`Asset of type '${request.type}' is not supported`);
    }
    if (!(request === null || request === void 0 ? void 0 : request.options)) {
      throw standardErrors.rpc.invalidParams("Options are required");
    }
    if (!(request === null || request === void 0 ? void 0 : request.options.address)) {
      throw standardErrors.rpc.invalidParams("Address is required");
    }
    const chainId = this.getChainId();
    const { address, symbol, image, decimals } = request.options;
    const relay = this.initializeRelay();
    const result = await relay.watchAsset(request.type, address, symbol, decimals, image, chainId === null || chainId === void 0 ? void 0 : chainId.toString());
    if (isErrorResponse(result))
      return false;
    return !!result.result;
  }
  async addEthereumChain(params) {
    var _a, _b;
    const request = params[0];
    if (((_a = request.rpcUrls) === null || _a === void 0 ? void 0 : _a.length) === 0) {
      throw standardErrors.rpc.invalidParams("please pass in at least 1 rpcUrl");
    }
    if (!request.chainName || request.chainName.trim() === "") {
      throw standardErrors.rpc.invalidParams("chainName is a required field");
    }
    if (!request.nativeCurrency) {
      throw standardErrors.rpc.invalidParams("nativeCurrency is a required field");
    }
    const chainIdNumber = Number.parseInt(request.chainId, 16);
    if (chainIdNumber === this.getChainId()) {
      return false;
    }
    const relay = this.initializeRelay();
    const { rpcUrls = [], blockExplorerUrls = [], chainName, iconUrls = [], nativeCurrency } = request;
    const res = await relay.addEthereumChain(chainIdNumber.toString(), rpcUrls, iconUrls, blockExplorerUrls, chainName, nativeCurrency);
    if (isErrorResponse(res))
      return false;
    if (((_b = res.result) === null || _b === void 0 ? void 0 : _b.isApproved) === true) {
      this.updateProviderInfo(rpcUrls[0], chainIdNumber);
      return null;
    }
    throw standardErrors.rpc.internal("unable to add ethereum chain");
  }
  async switchEthereumChain(params) {
    const request = params[0];
    const chainId = Number.parseInt(request.chainId, 16);
    const relay = this.initializeRelay();
    const res = await relay.switchEthereumChain(chainId.toString(10), this.selectedAddress || void 0);
    if (isErrorResponse(res))
      throw res;
    const switchResponse = res.result;
    if (switchResponse.isApproved && switchResponse.rpcUrl.length > 0) {
      this.updateProviderInfo(switchResponse.rpcUrl, chainId);
    }
    return null;
  }
  async cleanup() {
    this.callback = null;
    if (this._relay) {
      this._relay.resetAndReload();
    }
    this._storage.clear();
  }
  _setAddresses(addresses, _) {
    var _a;
    if (!Array.isArray(addresses)) {
      throw new Error("addresses is not an array");
    }
    const newAddresses = addresses.map((address) => ensureAddressString(address));
    if (JSON.stringify(newAddresses) === JSON.stringify(this._addresses)) {
      return;
    }
    this._addresses = newAddresses;
    (_a = this.callback) === null || _a === void 0 ? void 0 : _a.call(this, "accountsChanged", newAddresses);
    this._storage.setItem(LOCAL_STORAGE_ADDRESSES_KEY, newAddresses.join(" "));
  }
  async request(request) {
    const params = request.params || [];
    switch (request.method) {
      case "eth_accounts":
        return [...this._addresses];
      case "eth_coinbase":
        return this.selectedAddress || null;
      case "net_version":
        return this.getChainId().toString(10);
      case "eth_chainId":
        return hexStringFromNumber(this.getChainId());
      case "eth_requestAccounts":
        return this._eth_requestAccounts();
      case "eth_ecRecover":
      case "personal_ecRecover":
        return this.ecRecover(request);
      case "personal_sign":
        return this.personalSign(request);
      case "eth_signTransaction":
        return this._eth_signTransaction(params);
      case "eth_sendRawTransaction":
        return this._eth_sendRawTransaction(params);
      case "eth_sendTransaction":
        return this._eth_sendTransaction(params);
      case "eth_signTypedData_v1":
      case "eth_signTypedData_v3":
      case "eth_signTypedData_v4":
      case "eth_signTypedData":
        return this.signTypedData(request);
      case "wallet_addEthereumChain":
        return this.addEthereumChain(params);
      case "wallet_switchEthereumChain":
        return this.switchEthereumChain(params);
      case "wallet_watchAsset":
        return this.watchAsset(params);
      default:
        if (!this.jsonRpcUrl)
          throw standardErrors.rpc.internal("No RPC URL set for chain");
        return fetchRPCRequest(request, this.jsonRpcUrl);
    }
  }
  _ensureKnownAddress(addressString) {
    const addressStr = ensureAddressString(addressString);
    const lowercaseAddresses = this._addresses.map((address) => ensureAddressString(address));
    if (!lowercaseAddresses.includes(addressStr)) {
      throw new Error("Unknown Ethereum address");
    }
  }
  _prepareTransactionParams(tx) {
    const fromAddress = tx.from ? ensureAddressString(tx.from) : this.selectedAddress;
    if (!fromAddress) {
      throw new Error("Ethereum address is unavailable");
    }
    this._ensureKnownAddress(fromAddress);
    const toAddress = tx.to ? ensureAddressString(tx.to) : null;
    const weiValue = tx.value != null ? ensureBigInt(tx.value) : BigInt(0);
    const data = tx.data ? ensureBuffer(tx.data) : Buffer.alloc(0);
    const nonce = tx.nonce != null ? ensureIntNumber(tx.nonce) : null;
    const gasPriceInWei = tx.gasPrice != null ? ensureBigInt(tx.gasPrice) : null;
    const maxFeePerGas = tx.maxFeePerGas != null ? ensureBigInt(tx.maxFeePerGas) : null;
    const maxPriorityFeePerGas = tx.maxPriorityFeePerGas != null ? ensureBigInt(tx.maxPriorityFeePerGas) : null;
    const gasLimit = tx.gas != null ? ensureBigInt(tx.gas) : null;
    const chainId = tx.chainId ? ensureIntNumber(tx.chainId) : this.getChainId();
    return {
      fromAddress,
      toAddress,
      weiValue,
      data,
      nonce,
      gasPriceInWei,
      maxFeePerGas,
      maxPriorityFeePerGas,
      gasLimit,
      chainId
    };
  }
  async ecRecover(request) {
    const { method, params } = request;
    if (!Array.isArray(params))
      throw standardErrors.rpc.invalidParams();
    const relay = this.initializeRelay();
    const res = await relay.sendRequest({
      method: "ethereumAddressFromSignedMessage",
      params: {
        message: encodeToHexString(params[0]),
        signature: encodeToHexString(params[1]),
        addPrefix: method === "personal_ecRecover"
      }
    });
    if (isErrorResponse(res))
      throw res;
    return res.result;
  }
  getChainId() {
    var _a;
    return Number.parseInt((_a = this._storage.getItem(DEFAULT_CHAIN_ID_KEY)) !== null && _a !== void 0 ? _a : "1", 10);
  }
  async _eth_requestAccounts() {
    var _a, _b;
    if (this._addresses.length > 0) {
      (_a = this.callback) === null || _a === void 0 ? void 0 : _a.call(this, "connect", { chainId: hexStringFromNumber(this.getChainId()) });
      return this._addresses;
    }
    const relay = this.initializeRelay();
    const res = await relay.requestEthereumAccounts();
    if (isErrorResponse(res))
      throw res;
    if (!res.result) {
      throw new Error("accounts received is empty");
    }
    this._setAddresses(res.result);
    (_b = this.callback) === null || _b === void 0 ? void 0 : _b.call(this, "connect", { chainId: hexStringFromNumber(this.getChainId()) });
    return this._addresses;
  }
  async personalSign({ params }) {
    if (!Array.isArray(params))
      throw standardErrors.rpc.invalidParams();
    const address = params[1];
    const rawData = params[0];
    this._ensureKnownAddress(address);
    const relay = this.initializeRelay();
    const res = await relay.sendRequest({
      method: "signEthereumMessage",
      params: {
        address: ensureAddressString(address),
        message: encodeToHexString(rawData),
        addPrefix: true,
        typedDataJson: null
      }
    });
    if (isErrorResponse(res))
      throw res;
    return res.result;
  }
  async _eth_signTransaction(params) {
    const tx = this._prepareTransactionParams(params[0] || {});
    const relay = this.initializeRelay();
    const res = await relay.signEthereumTransaction(tx);
    if (isErrorResponse(res))
      throw res;
    return res.result;
  }
  async _eth_sendRawTransaction(params) {
    const signedTransaction = ensureBuffer(params[0]);
    const relay = this.initializeRelay();
    const res = await relay.submitEthereumTransaction(signedTransaction, this.getChainId());
    if (isErrorResponse(res))
      throw res;
    return res.result;
  }
  async _eth_sendTransaction(params) {
    const tx = this._prepareTransactionParams(params[0] || {});
    const relay = this.initializeRelay();
    const res = await relay.signAndSubmitEthereumTransaction(tx);
    if (isErrorResponse(res))
      throw res;
    return res.result;
  }
  async signTypedData(request) {
    const { method, params } = request;
    if (!Array.isArray(params))
      throw standardErrors.rpc.invalidParams();
    const encode = (input) => {
      const hashFuncMap = {
        eth_signTypedData_v1: import_eth_eip712_util.default.hashForSignTypedDataLegacy,
        eth_signTypedData_v3: import_eth_eip712_util.default.hashForSignTypedData_v3,
        eth_signTypedData_v4: import_eth_eip712_util.default.hashForSignTypedData_v4,
        eth_signTypedData: import_eth_eip712_util.default.hashForSignTypedData_v4
      };
      return hexStringFromBuffer(hashFuncMap[method]({
        data: ensureParsedJSONObject(input)
      }), true);
    };
    const address = params[method === "eth_signTypedData_v1" ? 1 : 0];
    const rawData = params[method === "eth_signTypedData_v1" ? 0 : 1];
    this._ensureKnownAddress(address);
    const relay = this.initializeRelay();
    const res = await relay.sendRequest({
      method: "signEthereumMessage",
      params: {
        address: ensureAddressString(address),
        message: encode(rawData),
        typedDataJson: JSON.stringify(rawData, null, 2),
        addPrefix: false
      }
    });
    if (isErrorResponse(res))
      throw res;
    return res.result;
  }
  initializeRelay() {
    if (!this._relay) {
      this._relay = new WalletLinkRelay({
        linkAPIUrl: WALLETLINK_URL,
        storage: this._storage,
        metadata: this.metadata,
        accountsCallback: this._setAddresses.bind(this),
        chainCallback: this.updateProviderInfo.bind(this)
      });
    }
    return this._relay;
  }
};

// node_modules/@coinbase/wallet-sdk/dist/sign/util.js
var SIGNER_TYPE_KEY = "SignerType";
var storage = new ScopedLocalStorage("CBWSDK", "SignerConfigurator");
function loadSignerType() {
  return storage.getItem(SIGNER_TYPE_KEY);
}
function storeSignerType(signerType) {
  storage.setItem(SIGNER_TYPE_KEY, signerType);
}
async function fetchSignerType(params) {
  const { communicator, metadata, handshakeRequest, callback } = params;
  listenForWalletLinkSessionRequest(communicator, metadata, callback).catch(() => {
  });
  const request = {
    id: crypto.randomUUID(),
    event: "selectSignerType",
    data: Object.assign(Object.assign({}, params.preference), { handshakeRequest })
  };
  const { data } = await communicator.postRequestAndWaitForResponse(request);
  return data;
}
function createSigner(params) {
  const { signerType, metadata, communicator, callback } = params;
  switch (signerType) {
    case "scw": {
      return new SCWSigner({
        metadata,
        callback,
        communicator
      });
    }
    case "walletlink": {
      return new WalletLinkSigner({
        metadata,
        callback
      });
    }
  }
}
async function listenForWalletLinkSessionRequest(communicator, metadata, callback) {
  await communicator.onMessage(({ event }) => event === "WalletLinkSessionRequest");
  const walletlink = new WalletLinkSigner({
    metadata,
    callback
  });
  communicator.postMessage({
    event: "WalletLinkUpdate",
    data: { session: walletlink.getSession() }
  });
  await walletlink.handshake();
  communicator.postMessage({
    event: "WalletLinkUpdate",
    data: { connected: true }
  });
}

// node_modules/@coinbase/wallet-sdk/dist/util/checkCrossOriginOpenerPolicy.js
var COOP_ERROR_MESSAGE = `Coinbase Wallet SDK requires the Cross-Origin-Opener-Policy header to not be set to 'same-origin'. This is to ensure that the SDK can communicate with the Coinbase Smart Wallet app.

Please see https://www.smartwallet.dev/guides/tips/popup-tips#cross-origin-opener-policy for more information.`;
var createCoopChecker = () => {
  let crossOriginOpenerPolicy;
  return {
    getCrossOriginOpenerPolicy: () => {
      if (crossOriginOpenerPolicy === void 0) {
        return "undefined";
      }
      return crossOriginOpenerPolicy;
    },
    checkCrossOriginOpenerPolicy: async () => {
      if (typeof window === "undefined") {
        crossOriginOpenerPolicy = "non-browser-env";
        return;
      }
      try {
        const url = `${window.location.origin}${window.location.pathname}`;
        const response = await fetch(url, {
          method: "HEAD"
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = response.headers.get("Cross-Origin-Opener-Policy");
        crossOriginOpenerPolicy = result !== null && result !== void 0 ? result : "null";
        if (crossOriginOpenerPolicy === "same-origin") {
          console.error(COOP_ERROR_MESSAGE);
        }
      } catch (error) {
        console.error("Error checking Cross-Origin-Opener-Policy:", error.message);
        crossOriginOpenerPolicy = "error";
      }
    }
  };
};
var { checkCrossOriginOpenerPolicy, getCrossOriginOpenerPolicy } = createCoopChecker();

// node_modules/@coinbase/wallet-sdk/dist/util/web.js
var POPUP_WIDTH = 420;
var POPUP_HEIGHT = 540;
function openPopup(url) {
  const left = (window.innerWidth - POPUP_WIDTH) / 2 + window.screenX;
  const top = (window.innerHeight - POPUP_HEIGHT) / 2 + window.screenY;
  appendAppInfoQueryParams(url);
  const popup = window.open(url, "Smart Wallet", `width=${POPUP_WIDTH}, height=${POPUP_HEIGHT}, left=${left}, top=${top}`);
  popup === null || popup === void 0 ? void 0 : popup.focus();
  if (!popup) {
    throw standardErrors.rpc.internal("Pop up window failed to open");
  }
  return popup;
}
function closePopup(popup) {
  if (popup && !popup.closed) {
    popup.close();
  }
}
function appendAppInfoQueryParams(url) {
  const params = {
    sdkName: NAME,
    sdkVersion: VERSION,
    origin: window.location.origin,
    coop: getCrossOriginOpenerPolicy()
  };
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value.toString());
  }
}

// node_modules/@coinbase/wallet-sdk/dist/core/communicator/Communicator.js
var Communicator = class {
  constructor({ url = CB_KEYS_URL, metadata, preference }) {
    this.popup = null;
    this.listeners = /* @__PURE__ */ new Map();
    this.postMessage = async (message) => {
      const popup = await this.waitForPopupLoaded();
      popup.postMessage(message, this.url.origin);
    };
    this.postRequestAndWaitForResponse = async (request) => {
      const responsePromise = this.onMessage(({ requestId }) => requestId === request.id);
      this.postMessage(request);
      return await responsePromise;
    };
    this.onMessage = async (predicate) => {
      return new Promise((resolve, reject) => {
        const listener = (event) => {
          if (event.origin !== this.url.origin)
            return;
          const message = event.data;
          if (predicate(message)) {
            resolve(message);
            window.removeEventListener("message", listener);
            this.listeners.delete(listener);
          }
        };
        window.addEventListener("message", listener);
        this.listeners.set(listener, { reject });
      });
    };
    this.disconnect = () => {
      closePopup(this.popup);
      this.popup = null;
      this.listeners.forEach(({ reject }, listener) => {
        reject(standardErrors.provider.userRejectedRequest("Request rejected"));
        window.removeEventListener("message", listener);
      });
      this.listeners.clear();
    };
    this.waitForPopupLoaded = async () => {
      if (this.popup && !this.popup.closed) {
        this.popup.focus();
        return this.popup;
      }
      this.popup = openPopup(this.url);
      this.onMessage(({ event }) => event === "PopupUnload").then(this.disconnect).catch(() => {
      });
      return this.onMessage(({ event }) => event === "PopupLoaded").then((message) => {
        this.postMessage({
          requestId: message.id,
          data: {
            version: VERSION,
            metadata: this.metadata,
            preference: this.preference,
            location: window.location.toString()
          }
        });
      }).then(() => {
        if (!this.popup)
          throw standardErrors.rpc.internal();
        return this.popup;
      });
    };
    this.url = new URL(url);
    this.metadata = metadata;
    this.preference = preference;
  }
};

// node_modules/@coinbase/wallet-sdk/dist/core/error/serialize.js
function serializeError(error) {
  const serialized = serialize(getErrorObject(error), {
    shouldIncludeStack: true
  });
  const docUrl = new URL("https://docs.cloud.coinbase.com/wallet-sdk/docs/errors");
  docUrl.searchParams.set("version", VERSION);
  docUrl.searchParams.set("code", serialized.code.toString());
  docUrl.searchParams.set("message", serialized.message);
  return Object.assign(Object.assign({}, serialized), { docUrl: docUrl.href });
}
function getErrorObject(error) {
  var _a;
  if (typeof error === "string") {
    return {
      message: error,
      code: standardErrorCodes.rpc.internal
    };
  } else if (isErrorResponse(error)) {
    const message = error.errorMessage;
    const code = (_a = error.errorCode) !== null && _a !== void 0 ? _a : message.match(/(denied|rejected)/i) ? standardErrorCodes.provider.userRejectedRequest : void 0;
    return Object.assign(Object.assign({}, error), {
      message,
      code,
      data: { method: error.method }
    });
  }
  return error;
}

// node_modules/@coinbase/wallet-sdk/dist/core/provider/interface.js
var ProviderEventEmitter = class extends import_index.default {
};

// node_modules/@coinbase/wallet-sdk/dist/CoinbaseWalletProvider.js
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
var CoinbaseWalletProvider = class extends ProviderEventEmitter {
  constructor(_a) {
    var { metadata } = _a, _b = _a.preference, { keysUrl } = _b, preference = __rest(_b, ["keysUrl"]);
    super();
    this.signer = null;
    this.isCoinbaseWallet = true;
    this.metadata = metadata;
    this.preference = preference;
    this.communicator = new Communicator({
      url: keysUrl,
      metadata,
      preference
    });
    const signerType = loadSignerType();
    if (signerType) {
      this.signer = this.initSigner(signerType);
    }
  }
  async request(args) {
    try {
      checkErrorForInvalidRequestArgs(args);
      if (!this.signer) {
        switch (args.method) {
          case "eth_requestAccounts": {
            const signerType = await this.requestSignerSelection(args);
            const signer = this.initSigner(signerType);
            await signer.handshake(args);
            this.signer = signer;
            storeSignerType(signerType);
            break;
          }
          case "net_version":
            return 1;
          // default value
          case "eth_chainId":
            return hexStringFromNumber(1);
          // default value
          default: {
            throw standardErrors.provider.unauthorized("Must call 'eth_requestAccounts' before other methods");
          }
        }
      }
      return this.signer.request(args);
    } catch (error) {
      const { code } = error;
      if (code === standardErrorCodes.provider.unauthorized)
        this.disconnect();
      return Promise.reject(serializeError(error));
    }
  }
  /** @deprecated Use `.request({ method: 'eth_requestAccounts' })` instead. */
  async enable() {
    console.warn(`.enable() has been deprecated. Please use .request({ method: "eth_requestAccounts" }) instead.`);
    return await this.request({
      method: "eth_requestAccounts"
    });
  }
  async disconnect() {
    var _a;
    await ((_a = this.signer) === null || _a === void 0 ? void 0 : _a.cleanup());
    this.signer = null;
    ScopedLocalStorage.clearAll();
    this.emit("disconnect", standardErrors.provider.disconnected("User initiated disconnection"));
  }
  requestSignerSelection(handshakeRequest) {
    return fetchSignerType({
      communicator: this.communicator,
      preference: this.preference,
      metadata: this.metadata,
      handshakeRequest,
      callback: this.emit.bind(this)
    });
  }
  initSigner(signerType) {
    return createSigner({
      signerType,
      metadata: this.metadata,
      communicator: this.communicator,
      callback: this.emit.bind(this)
    });
  }
};

// node_modules/@coinbase/wallet-sdk/dist/util/validatePreferences.js
function validatePreferences(preference) {
  if (!preference) {
    return;
  }
  if (!["all", "smartWalletOnly", "eoaOnly"].includes(preference.options)) {
    throw new Error(`Invalid options: ${preference.options}`);
  }
  if (preference.attribution) {
    if (preference.attribution.auto !== void 0 && preference.attribution.dataSuffix !== void 0) {
      throw new Error(`Attribution cannot contain both auto and dataSuffix properties`);
    }
  }
}

// node_modules/@coinbase/wallet-sdk/dist/CoinbaseWalletSDK.js
var CoinbaseWalletSDK = class {
  constructor(metadata) {
    this.metadata = {
      appName: metadata.appName || "Dapp",
      appLogoUrl: metadata.appLogoUrl || getFavicon(),
      appChainIds: metadata.appChainIds || []
    };
    this.storeLatestVersion();
    void checkCrossOriginOpenerPolicy();
  }
  makeWeb3Provider(preference = { options: "all" }) {
    var _a;
    validatePreferences(preference);
    const params = { metadata: this.metadata, preference };
    return (_a = getCoinbaseInjectedProvider(params)) !== null && _a !== void 0 ? _a : new CoinbaseWalletProvider(params);
  }
  /**
   * Official Coinbase Wallet logo for developers to use on their frontend
   * @param type Type of wallet logo: "standard" | "circle" | "text" | "textWithLogo" | "textLight" | "textWithLogoLight"
   * @param width Width of the logo (Optional)
   * @returns SVG Data URI
   */
  getCoinbaseWalletLogo(type, width = 240) {
    return walletLogo(type, width);
  }
  storeLatestVersion() {
    const versionStorage = new ScopedLocalStorage("CBWSDK");
    versionStorage.setItem("VERSION", VERSION);
  }
};

// node_modules/@coinbase/wallet-sdk/dist/createCoinbaseWalletProvider.js
function createCoinbaseWalletProvider(options) {
  var _a;
  const params = {
    metadata: options.metadata,
    preference: options.preference
  };
  return (_a = getCoinbaseInjectedProvider(params)) !== null && _a !== void 0 ? _a : new CoinbaseWalletProvider(params);
}

// node_modules/@coinbase/wallet-sdk/dist/createCoinbaseWalletSDK.js
var DEFAULT_PREFERENCE = {
  options: "all"
};
function createCoinbaseWalletSDK(params) {
  var _a;
  const versionStorage = new ScopedLocalStorage("CBWSDK");
  versionStorage.setItem("VERSION", VERSION);
  void checkCrossOriginOpenerPolicy();
  const options = {
    metadata: {
      appName: params.appName || "Dapp",
      appLogoUrl: params.appLogoUrl || "",
      appChainIds: params.appChainIds || []
    },
    preference: Object.assign(DEFAULT_PREFERENCE, (_a = params.preference) !== null && _a !== void 0 ? _a : {})
  };
  validatePreferences(options.preference);
  let provider = null;
  return {
    getProvider: () => {
      if (!provider) {
        provider = createCoinbaseWalletProvider(options);
      }
      return provider;
    }
  };
}

// node_modules/@coinbase/wallet-sdk/dist/index.js
var dist_default = CoinbaseWalletSDK;
export {
  CoinbaseWalletSDK,
  createCoinbaseWalletSDK,
  dist_default as default
};
//# sourceMappingURL=dist-2TARYAKD.js.map
