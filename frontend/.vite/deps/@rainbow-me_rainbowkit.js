"use client";
import {
  require_dijkstra
} from "./chunk-CMAQIWOC.js";
import {
  en_US_default
} from "./chunk-UDC52U5U.js";
import {
  __assign,
  __rest,
  __spreadArray,
  init_tslib_es6
} from "./chunk-322AH5JE.js";
import {
  ChainNotConfiguredError,
  ProviderNotFoundError,
  createConfig,
  createConnector,
  extractRpcUrls,
  injected,
  useAccount,
  useAccountEffect,
  useBalance,
  useConfig,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  usePublicClient,
  useSignMessage,
  useSwitchChain
} from "./chunk-R77566BE.js";
import {
  import_index
} from "./chunk-D5VI4NRZ.js";
import "./chunk-7HO5RVPZ.js";
import {
  AbiConstructor_exports,
  AbiFunction_exports,
  AbiItem_exports,
  AbiParameters_exports,
  Address_exports,
  BaseError,
  BlockOverrides_exports,
  Bytes_exports,
  Caches_exports,
  DataSizeTooSmallError,
  Errors_exports,
  Hash_exports,
  Hex_exports,
  InvalidAddressError,
  InvalidInputError,
  InvalidLengthError,
  InvalidSelectorSizeError,
  Json_exports,
  NotFoundError,
  PositionOutOfBoundsError,
  PublicKey_exports,
  Solidity_exports,
  Withdrawal_exports,
  assert,
  bytesRegex,
  concat,
  concat2,
  create,
  decode,
  encode,
  format,
  from,
  from2,
  from3,
  from4,
  from5,
  fromAbi,
  fromArray,
  fromBytes,
  fromHex,
  fromNumber,
  fromNumber2,
  fromPublicKey,
  fromRpc,
  fromString,
  fromString2,
  getSelector,
  getSignatureHash,
  getUrl,
  http,
  integerRegex,
  isEqual,
  keccak256,
  maxUint256,
  padLeft,
  prettyPrint,
  random,
  ripemd160,
  sha256 as sha2562,
  size,
  size2,
  slice,
  slice2,
  stringify,
  toBigInt,
  toBytes as toBytes2,
  toBytes2 as toBytes3,
  toHex,
  toHex2,
  toNumber,
  toRpc,
  toString,
  toString2,
  trimLeft,
  validate,
  validate2,
  validate3,
  validate4,
  withRetry,
  withTimeout
} from "./chunk-SPXDUZSQ.js";
import {
  Field,
  FpInvertBatch,
  FpLegendre,
  FpPow,
  bitGet,
  bitLen,
  bitMask,
  bytesToHex as bytesToHex2,
  bytesToNumberBE,
  concatBytes as concatBytes2,
  createCurve,
  createHasher,
  ensureBytes,
  getMinHashLength,
  hmac,
  isogenyMap,
  mapHashToField,
  mapToCurveSimpleSWU,
  memoized,
  mod,
  notImplemented,
  numberToBytesBE,
  secp256k1,
  weierstrassPoints
} from "./chunk-O2WWLZ6G.js";
import "./chunk-KQUGMLKX.js";
import {
  mainnet
} from "./chunk-HGTKZA6Z.js";
import "./chunk-Y6GNYFWO.js";
import {
  ResourceUnavailableRpcError,
  SwitchChainError,
  UserRejectedRequestError,
  formatAbi,
  formatAbiItem2 as formatAbiItem,
  getAddress,
  hexToNumber,
  isAddress,
  numberToHex,
  parseAbi,
  u64_default
} from "./chunk-57T76P2V.js";
import {
  HashMD,
  sha256
} from "./chunk-2P3OXF37.js";
import {
  abytes,
  ahash,
  anumber,
  bytesToHex,
  checkOpts,
  concatBytes,
  createView,
  hexToBytes,
  randomBytes,
  toBytes,
  utf8ToBytes,
  wrapConstructor
} from "./chunk-Z3MPRPDR.js";
import {
  clsx_default
} from "./chunk-LNJWJNFR.js";
import {
  useQuery
} from "./chunk-PT6NJ353.js";
import "./chunk-OZ6CQKAS.js";
import {
  require_react_dom
} from "./chunk-2JZJ2OCM.js";
import {
  require_react
} from "./chunk-PNII7RQZ.js";
import {
  __commonJS,
  __export,
  __toESM
} from "./chunk-ONY6HBPH.js";

// node_modules/ua-parser-js/src/ua-parser.js
var require_ua_parser = __commonJS({
  "node_modules/ua-parser-js/src/ua-parser.js"(exports, module) {
    (function(window2, undefined2) {
      "use strict";
      var LIBVERSION = "1.0.40", EMPTY = "", UNKNOWN = "?", FUNC_TYPE = "function", UNDEF_TYPE = "undefined", OBJ_TYPE = "object", STR_TYPE = "string", MAJOR = "major", MODEL = "model", NAME = "name", TYPE = "type", VENDOR = "vendor", VERSION = "version", ARCHITECTURE = "architecture", CONSOLE = "console", MOBILE = "mobile", TABLET = "tablet", SMARTTV = "smarttv", WEARABLE = "wearable", EMBEDDED = "embedded", UA_MAX_LENGTH = 500;
      var AMAZON = "Amazon", APPLE = "Apple", ASUS = "ASUS", BLACKBERRY = "BlackBerry", BROWSER = "Browser", CHROME = "Chrome", EDGE = "Edge", FIREFOX = "Firefox", GOOGLE = "Google", HUAWEI = "Huawei", LG = "LG", MICROSOFT = "Microsoft", MOTOROLA = "Motorola", OPERA = "Opera", SAMSUNG = "Samsung", SHARP = "Sharp", SONY = "Sony", XIAOMI = "Xiaomi", ZEBRA = "Zebra", FACEBOOK = "Facebook", CHROMIUM_OS = "Chromium OS", MAC_OS = "Mac OS", SUFFIX_BROWSER = " Browser";
      var extend = function(regexes2, extensions) {
        var mergedRegexes = {};
        for (var i in regexes2) {
          if (extensions[i] && extensions[i].length % 2 === 0) {
            mergedRegexes[i] = extensions[i].concat(regexes2[i]);
          } else {
            mergedRegexes[i] = regexes2[i];
          }
        }
        return mergedRegexes;
      }, enumerize = function(arr) {
        var enums = {};
        for (var i = 0; i < arr.length; i++) {
          enums[arr[i].toUpperCase()] = arr[i];
        }
        return enums;
      }, has = function(str1, str2) {
        return typeof str1 === STR_TYPE ? lowerize(str2).indexOf(lowerize(str1)) !== -1 : false;
      }, lowerize = function(str) {
        return str.toLowerCase();
      }, majorize = function(version2) {
        return typeof version2 === STR_TYPE ? version2.replace(/[^\d\.]/g, EMPTY).split(".")[0] : undefined2;
      }, trim = function(str, len) {
        if (typeof str === STR_TYPE) {
          str = str.replace(/^\s\s*/, EMPTY);
          return typeof len === UNDEF_TYPE ? str : str.substring(0, UA_MAX_LENGTH);
        }
      };
      var rgxMapper = function(ua2, arrays) {
        var i = 0, j, k, p, q, matches, match;
        while (i < arrays.length && !matches) {
          var regex = arrays[i], props = arrays[i + 1];
          j = k = 0;
          while (j < regex.length && !matches) {
            if (!regex[j]) {
              break;
            }
            matches = regex[j++].exec(ua2);
            if (!!matches) {
              for (p = 0; p < props.length; p++) {
                match = matches[++k];
                q = props[p];
                if (typeof q === OBJ_TYPE && q.length > 0) {
                  if (q.length === 2) {
                    if (typeof q[1] == FUNC_TYPE) {
                      this[q[0]] = q[1].call(this, match);
                    } else {
                      this[q[0]] = q[1];
                    }
                  } else if (q.length === 3) {
                    if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                      this[q[0]] = match ? q[1].call(this, match, q[2]) : undefined2;
                    } else {
                      this[q[0]] = match ? match.replace(q[1], q[2]) : undefined2;
                    }
                  } else if (q.length === 4) {
                    this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined2;
                  }
                } else {
                  this[q] = match ? match : undefined2;
                }
              }
            }
          }
          i += 2;
        }
      }, strMapper = function(str, map) {
        for (var i in map) {
          if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
            for (var j = 0; j < map[i].length; j++) {
              if (has(map[i][j], str)) {
                return i === UNKNOWN ? undefined2 : i;
              }
            }
          } else if (has(map[i], str)) {
            return i === UNKNOWN ? undefined2 : i;
          }
        }
        return map.hasOwnProperty("*") ? map["*"] : str;
      };
      var oldSafariMap = {
        "1.0": "/8",
        "1.2": "/1",
        "1.3": "/3",
        "2.0": "/412",
        "2.0.2": "/416",
        "2.0.3": "/417",
        "2.0.4": "/419",
        "?": "/"
      }, windowsVersionMap = {
        "ME": "4.90",
        "NT 3.11": "NT3.51",
        "NT 4.0": "NT4.0",
        "2000": "NT 5.0",
        "XP": ["NT 5.1", "NT 5.2"],
        "Vista": "NT 6.0",
        "7": "NT 6.1",
        "8": "NT 6.2",
        "8.1": "NT 6.3",
        "10": ["NT 6.4", "NT 10.0"],
        "RT": "ARM"
      };
      var regexes = {
        browser: [
          [
            /\b(?:crmo|crios)\/([\w\.]+)/i
            // Chrome for Android/iOS
          ],
          [VERSION, [NAME, "Chrome"]],
          [
            /edg(?:e|ios|a)?\/([\w\.]+)/i
            // Microsoft Edge
          ],
          [VERSION, [NAME, "Edge"]],
          [
            // Presto based
            /(opera mini)\/([-\w\.]+)/i,
            // Opera Mini
            /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,
            // Opera Mobi/Tablet
            /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i
            // Opera
          ],
          [NAME, VERSION],
          [
            /opios[\/ ]+([\w\.]+)/i
            // Opera mini on iphone >= 8.0
          ],
          [VERSION, [NAME, OPERA + " Mini"]],
          [
            /\bop(?:rg)?x\/([\w\.]+)/i
            // Opera GX
          ],
          [VERSION, [NAME, OPERA + " GX"]],
          [
            /\bopr\/([\w\.]+)/i
            // Opera Webkit
          ],
          [VERSION, [NAME, OPERA]],
          [
            // Mixed
            /\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i
            // Baidu
          ],
          [VERSION, [NAME, "Baidu"]],
          [
            /\b(?:mxbrowser|mxios|myie2)\/?([-\w\.]*)\b/i
            // Maxthon
          ],
          [VERSION, [NAME, "Maxthon"]],
          [
            /(kindle)\/([\w\.]+)/i,
            // Kindle
            /(lunascape|maxthon|netfront|jasmine|blazer|sleipnir)[\/ ]?([\w\.]*)/i,
            // Lunascape/Maxthon/Netfront/Jasmine/Blazer/Sleipnir
            // Trident based
            /(avant|iemobile|slim(?:browser|boat|jet))[\/ ]?([\d\.]*)/i,
            // Avant/IEMobile/SlimBrowser/SlimBoat/Slimjet
            /(?:ms|\()(ie) ([\w\.]+)/i,
            // Internet Explorer
            // Blink/Webkit/KHTML based                                         // Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser/QupZilla/Falkon
            /(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|duckduckgo|klar|helio|(?=comodo_)?dragon)\/([-\w\.]+)/i,
            // Rekonq/Puffin/Brave/Whale/QQBrowserLite/QQ//Vivaldi/DuckDuckGo/Klar/Helio/Dragon
            /(heytap|ovi|115)browser\/([\d\.]+)/i,
            // HeyTap/Ovi/115
            /(weibo)__([\d\.]+)/i
            // Weibo
          ],
          [NAME, VERSION],
          [
            /quark(?:pc)?\/([-\w\.]+)/i
            // Quark
          ],
          [VERSION, [NAME, "Quark"]],
          [
            /\bddg\/([\w\.]+)/i
            // DuckDuckGo
          ],
          [VERSION, [NAME, "DuckDuckGo"]],
          [
            /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i
            // UCBrowser
          ],
          [VERSION, [NAME, "UC" + BROWSER]],
          [
            /microm.+\bqbcore\/([\w\.]+)/i,
            // WeChat Desktop for Windows Built-in Browser
            /\bqbcore\/([\w\.]+).+microm/i,
            /micromessenger\/([\w\.]+)/i
            // WeChat
          ],
          [VERSION, [NAME, "WeChat"]],
          [
            /konqueror\/([\w\.]+)/i
            // Konqueror
          ],
          [VERSION, [NAME, "Konqueror"]],
          [
            /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i
            // IE11
          ],
          [VERSION, [NAME, "IE"]],
          [
            /ya(?:search)?browser\/([\w\.]+)/i
            // Yandex
          ],
          [VERSION, [NAME, "Yandex"]],
          [
            /slbrowser\/([\w\.]+)/i
            // Smart Lenovo Browser
          ],
          [VERSION, [NAME, "Smart Lenovo " + BROWSER]],
          [
            /(avast|avg)\/([\w\.]+)/i
            // Avast/AVG Secure Browser
          ],
          [[NAME, /(.+)/, "$1 Secure " + BROWSER], VERSION],
          [
            /\bfocus\/([\w\.]+)/i
            // Firefox Focus
          ],
          [VERSION, [NAME, FIREFOX + " Focus"]],
          [
            /\bopt\/([\w\.]+)/i
            // Opera Touch
          ],
          [VERSION, [NAME, OPERA + " Touch"]],
          [
            /coc_coc\w+\/([\w\.]+)/i
            // Coc Coc Browser
          ],
          [VERSION, [NAME, "Coc Coc"]],
          [
            /dolfin\/([\w\.]+)/i
            // Dolphin
          ],
          [VERSION, [NAME, "Dolphin"]],
          [
            /coast\/([\w\.]+)/i
            // Opera Coast
          ],
          [VERSION, [NAME, OPERA + " Coast"]],
          [
            /miuibrowser\/([\w\.]+)/i
            // MIUI Browser
          ],
          [VERSION, [NAME, "MIUI" + SUFFIX_BROWSER]],
          [
            /fxios\/([\w\.-]+)/i
            // Firefox for iOS
          ],
          [VERSION, [NAME, FIREFOX]],
          [
            /\bqihoobrowser\/?([\w\.]*)/i
            // 360
          ],
          [VERSION, [NAME, "360"]],
          [
            /\b(qq)\/([\w\.]+)/i
            // QQ
          ],
          [[NAME, /(.+)/, "$1Browser"], VERSION],
          [
            /(oculus|sailfish|huawei|vivo|pico)browser\/([\w\.]+)/i
          ],
          [[NAME, /(.+)/, "$1" + SUFFIX_BROWSER], VERSION],
          [
            // Oculus/Sailfish/HuaweiBrowser/VivoBrowser/PicoBrowser
            /samsungbrowser\/([\w\.]+)/i
            // Samsung Internet
          ],
          [VERSION, [NAME, SAMSUNG + " Internet"]],
          [
            /metasr[\/ ]?([\d\.]+)/i
            // Sogou Explorer
          ],
          [VERSION, [NAME, "Sogou Explorer"]],
          [
            /(sogou)mo\w+\/([\d\.]+)/i
            // Sogou Mobile
          ],
          [[NAME, "Sogou Mobile"], VERSION],
          [
            /(electron)\/([\w\.]+) safari/i,
            // Electron-based App
            /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,
            // Tesla
            /m?(qqbrowser|2345(?=browser|chrome|explorer))\w*[\/ ]?v?([\w\.]+)/i
            // QQ/2345
          ],
          [NAME, VERSION],
          [
            /(lbbrowser|rekonq)/i,
            // LieBao Browser/Rekonq
            /\[(linkedin)app\]/i
            // LinkedIn App for iOS & Android
          ],
          [NAME],
          [
            /ome\/([\w\.]+) \w* ?(iron) saf/i,
            // Iron
            /ome\/([\w\.]+).+qihu (360)[es]e/i
            // 360
          ],
          [VERSION, NAME],
          [
            // WebView
            /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i
            // Facebook App for iOS & Android
          ],
          [[NAME, FACEBOOK], VERSION],
          [
            /(Klarna)\/([\w\.]+)/i,
            // Klarna Shopping Browser for iOS & Android
            /(kakao(?:talk|story))[\/ ]([\w\.]+)/i,
            // Kakao App
            /(naver)\(.*?(\d+\.[\w\.]+).*\)/i,
            // Naver InApp
            /safari (line)\/([\w\.]+)/i,
            // Line App for iOS
            /\b(line)\/([\w\.]+)\/iab/i,
            // Line App for Android
            /(alipay)client\/([\w\.]+)/i,
            // Alipay
            /(twitter)(?:and| f.+e\/([\w\.]+))/i,
            // Twitter
            /(chromium|instagram|snapchat)[\/ ]([-\w\.]+)/i
            // Chromium/Instagram/Snapchat
          ],
          [NAME, VERSION],
          [
            /\bgsa\/([\w\.]+) .*safari\//i
            // Google Search Appliance on iOS
          ],
          [VERSION, [NAME, "GSA"]],
          [
            /musical_ly(?:.+app_?version\/|_)([\w\.]+)/i
            // TikTok
          ],
          [VERSION, [NAME, "TikTok"]],
          [
            /headlesschrome(?:\/([\w\.]+)| )/i
            // Chrome Headless
          ],
          [VERSION, [NAME, CHROME + " Headless"]],
          [
            / wv\).+(chrome)\/([\w\.]+)/i
            // Chrome WebView
          ],
          [[NAME, CHROME + " WebView"], VERSION],
          [
            /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i
            // Android Browser
          ],
          [VERSION, [NAME, "Android " + BROWSER]],
          [
            /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i
            // Chrome/OmniWeb/Arora/Tizen/Nokia
          ],
          [NAME, VERSION],
          [
            /version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i
            // Mobile Safari
          ],
          [VERSION, [NAME, "Mobile Safari"]],
          [
            /version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i
            // Safari & Safari Mobile
          ],
          [VERSION, NAME],
          [
            /webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i
            // Safari < 3.0
          ],
          [NAME, [VERSION, strMapper, oldSafariMap]],
          [
            /(webkit|khtml)\/([\w\.]+)/i
          ],
          [NAME, VERSION],
          [
            // Gecko based
            /(navigator|netscape\d?)\/([-\w\.]+)/i
            // Netscape
          ],
          [[NAME, "Netscape"], VERSION],
          [
            /(wolvic|librewolf)\/([\w\.]+)/i
            // Wolvic/LibreWolf
          ],
          [NAME, VERSION],
          [
            /mobile vr; rv:([\w\.]+)\).+firefox/i
            // Firefox Reality
          ],
          [VERSION, [NAME, FIREFOX + " Reality"]],
          [
            /ekiohf.+(flow)\/([\w\.]+)/i,
            // Flow
            /(swiftfox)/i,
            // Swiftfox
            /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror)[\/ ]?([\w\.\+]+)/i,
            // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
            /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
            // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
            /(firefox)\/([\w\.]+)/i,
            // Other Firefox-based
            /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,
            // Mozilla
            // Other
            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
            // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Obigo/Mosaic/Go/ICE/UP.Browser
            /(links) \(([\w\.]+)/i
            // Links
          ],
          [NAME, [VERSION, /_/g, "."]],
          [
            /(cobalt)\/([\w\.]+)/i
            // Cobalt
          ],
          [NAME, [VERSION, /master.|lts./, ""]]
        ],
        cpu: [
          [
            /(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i
            // AMD64 (x64)
          ],
          [[ARCHITECTURE, "amd64"]],
          [
            /(ia32(?=;))/i
            // IA32 (quicktime)
          ],
          [[ARCHITECTURE, lowerize]],
          [
            /((?:i[346]|x)86)[;\)]/i
            // IA32 (x86)
          ],
          [[ARCHITECTURE, "ia32"]],
          [
            /\b(aarch64|arm(v?8e?l?|_?64))\b/i
            // ARM64
          ],
          [[ARCHITECTURE, "arm64"]],
          [
            /\b(arm(?:v[67])?ht?n?[fl]p?)\b/i
            // ARMHF
          ],
          [[ARCHITECTURE, "armhf"]],
          [
            // PocketPC mistakenly identified as PowerPC
            /windows (ce|mobile); ppc;/i
          ],
          [[ARCHITECTURE, "arm"]],
          [
            /((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i
            // PowerPC
          ],
          [[ARCHITECTURE, /ower/, EMPTY, lowerize]],
          [
            /(sun4\w)[;\)]/i
            // SPARC
          ],
          [[ARCHITECTURE, "sparc"]],
          [
            /((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i
            // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
          ],
          [[ARCHITECTURE, lowerize]]
        ],
        device: [
          [
            //////////////////////////
            // MOBILES & TABLETS
            /////////////////////////
            // Samsung
            /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i
          ],
          [MODEL, [VENDOR, SAMSUNG], [TYPE, TABLET]],
          [
            /\b((?:s[cgp]h|gt|sm)-(?![lr])\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
            /samsung[- ]((?!sm-[lr])[-\w]+)/i,
            /sec-(sgh\w+)/i
          ],
          [MODEL, [VENDOR, SAMSUNG], [TYPE, MOBILE]],
          [
            // Apple
            /(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i
            // iPod/iPhone
          ],
          [MODEL, [VENDOR, APPLE], [TYPE, MOBILE]],
          [
            /\((ipad);[-\w\),; ]+apple/i,
            // iPad
            /applecoremedia\/[\w\.]+ \((ipad)/i,
            /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
          ],
          [MODEL, [VENDOR, APPLE], [TYPE, TABLET]],
          [
            /(macintosh);/i
          ],
          [MODEL, [VENDOR, APPLE]],
          [
            // Sharp
            /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
          ],
          [MODEL, [VENDOR, SHARP], [TYPE, MOBILE]],
          [
            // Honor
            /(?:honor)([-\w ]+)[;\)]/i
          ],
          [MODEL, [VENDOR, "Honor"], [TYPE, MOBILE]],
          [
            // Huawei
            /\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i
          ],
          [MODEL, [VENDOR, HUAWEI], [TYPE, TABLET]],
          [
            /(?:huawei)([-\w ]+)[;\)]/i,
            /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
          ],
          [MODEL, [VENDOR, HUAWEI], [TYPE, MOBILE]],
          [
            // Xiaomi
            /\b(poco[\w ]+|m2\d{3}j\d\d[a-z]{2})(?: bui|\))/i,
            // Xiaomi POCO
            /\b; (\w+) build\/hm\1/i,
            // Xiaomi Hongmi 'numeric' models
            /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,
            // Xiaomi Hongmi
            /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,
            // Xiaomi Redmi
            /oid[^\)]+; (m?[12][0-389][01]\w{3,6}[c-y])( bui|; wv|\))/i,
            // Xiaomi Redmi 'numeric' models
            /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite|pro)?)(?: bui|\))/i
            // Xiaomi Mi
          ],
          [[MODEL, /_/g, " "], [VENDOR, XIAOMI], [TYPE, MOBILE]],
          [
            /oid[^\)]+; (2\d{4}(283|rpbf)[cgl])( bui|\))/i,
            // Redmi Pad
            /\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i
            // Mi Pad tablets
          ],
          [[MODEL, /_/g, " "], [VENDOR, XIAOMI], [TYPE, TABLET]],
          [
            // OPPO
            /; (\w+) bui.+ oppo/i,
            /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
          ],
          [MODEL, [VENDOR, "OPPO"], [TYPE, MOBILE]],
          [
            /\b(opd2\d{3}a?) bui/i
          ],
          [MODEL, [VENDOR, "OPPO"], [TYPE, TABLET]],
          [
            // Vivo
            /vivo (\w+)(?: bui|\))/i,
            /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
          ],
          [MODEL, [VENDOR, "Vivo"], [TYPE, MOBILE]],
          [
            // Realme
            /\b(rmx[1-3]\d{3})(?: bui|;|\))/i
          ],
          [MODEL, [VENDOR, "Realme"], [TYPE, MOBILE]],
          [
            // Motorola
            /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
            /\bmot(?:orola)?[- ](\w*)/i,
            /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i
          ],
          [MODEL, [VENDOR, MOTOROLA], [TYPE, MOBILE]],
          [
            /\b(mz60\d|xoom[2 ]{0,2}) build\//i
          ],
          [MODEL, [VENDOR, MOTOROLA], [TYPE, TABLET]],
          [
            // LG
            /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
          ],
          [MODEL, [VENDOR, LG], [TYPE, TABLET]],
          [
            /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
            /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,
            /\blg-?([\d\w]+) bui/i
          ],
          [MODEL, [VENDOR, LG], [TYPE, MOBILE]],
          [
            // Lenovo
            /(ideatab[-\w ]+)/i,
            /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i
          ],
          [MODEL, [VENDOR, "Lenovo"], [TYPE, TABLET]],
          [
            // Nokia
            /(?:maemo|nokia).*(n900|lumia \d+)/i,
            /nokia[-_ ]?([-\w\.]*)/i
          ],
          [[MODEL, /_/g, " "], [VENDOR, "Nokia"], [TYPE, MOBILE]],
          [
            // Google
            /(pixel c)\b/i
            // Google Pixel C
          ],
          [MODEL, [VENDOR, GOOGLE], [TYPE, TABLET]],
          [
            /droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i
            // Google Pixel
          ],
          [MODEL, [VENDOR, GOOGLE], [TYPE, MOBILE]],
          [
            // Sony
            /droid.+; (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
          ],
          [MODEL, [VENDOR, SONY], [TYPE, MOBILE]],
          [
            /sony tablet [ps]/i,
            /\b(?:sony)?sgp\w+(?: bui|\))/i
          ],
          [[MODEL, "Xperia Tablet"], [VENDOR, SONY], [TYPE, TABLET]],
          [
            // OnePlus
            / (kb2005|in20[12]5|be20[12][59])\b/i,
            /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
          ],
          [MODEL, [VENDOR, "OnePlus"], [TYPE, MOBILE]],
          [
            // Amazon
            /(alexa)webm/i,
            /(kf[a-z]{2}wi|aeo(?!bc)\w\w)( bui|\))/i,
            // Kindle Fire without Silk / Echo Show
            /(kf[a-z]+)( bui|\)).+silk\//i
            // Kindle Fire HD
          ],
          [MODEL, [VENDOR, AMAZON], [TYPE, TABLET]],
          [
            /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i
            // Fire Phone
          ],
          [[MODEL, /(.+)/g, "Fire Phone $1"], [VENDOR, AMAZON], [TYPE, MOBILE]],
          [
            // BlackBerry
            /(playbook);[-\w\),; ]+(rim)/i
            // BlackBerry PlayBook
          ],
          [MODEL, VENDOR, [TYPE, TABLET]],
          [
            /\b((?:bb[a-f]|st[hv])100-\d)/i,
            /\(bb10; (\w+)/i
            // BlackBerry 10
          ],
          [MODEL, [VENDOR, BLACKBERRY], [TYPE, MOBILE]],
          [
            // Asus
            /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
          ],
          [MODEL, [VENDOR, ASUS], [TYPE, TABLET]],
          [
            / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
          ],
          [MODEL, [VENDOR, ASUS], [TYPE, MOBILE]],
          [
            // HTC
            /(nexus 9)/i
            // HTC Nexus 9
          ],
          [MODEL, [VENDOR, "HTC"], [TYPE, TABLET]],
          [
            /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,
            // HTC
            // ZTE
            /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
            /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i
            // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
          ],
          [VENDOR, [MODEL, /_/g, " "], [TYPE, MOBILE]],
          [
            // TCL
            /droid [\w\.]+; ((?:8[14]9[16]|9(?:0(?:48|60|8[01])|1(?:3[27]|66)|2(?:6[69]|9[56])|466))[gqswx])\w*(\)| bui)/i
          ],
          [MODEL, [VENDOR, "TCL"], [TYPE, TABLET]],
          [
            // itel
            /(itel) ((\w+))/i
          ],
          [[VENDOR, lowerize], MODEL, [TYPE, strMapper, { "tablet": ["p10001l", "w7001"], "*": "mobile" }]],
          [
            // Acer
            /droid.+; ([ab][1-7]-?[0178a]\d\d?)/i
          ],
          [MODEL, [VENDOR, "Acer"], [TYPE, TABLET]],
          [
            // Meizu
            /droid.+; (m[1-5] note) bui/i,
            /\bmz-([-\w]{2,})/i
          ],
          [MODEL, [VENDOR, "Meizu"], [TYPE, MOBILE]],
          [
            // Ulefone
            /; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i
          ],
          [MODEL, [VENDOR, "Ulefone"], [TYPE, MOBILE]],
          [
            // Energizer
            /; (energy ?\w+)(?: bui|\))/i,
            /; energizer ([\w ]+)(?: bui|\))/i
          ],
          [MODEL, [VENDOR, "Energizer"], [TYPE, MOBILE]],
          [
            // Cat
            /; cat (b35);/i,
            /; (b15q?|s22 flip|s48c|s62 pro)(?: bui|\))/i
          ],
          [MODEL, [VENDOR, "Cat"], [TYPE, MOBILE]],
          [
            // Smartfren
            /((?:new )?andromax[\w- ]+)(?: bui|\))/i
          ],
          [MODEL, [VENDOR, "Smartfren"], [TYPE, MOBILE]],
          [
            // Nothing
            /droid.+; (a(?:015|06[35]|142p?))/i
          ],
          [MODEL, [VENDOR, "Nothing"], [TYPE, MOBILE]],
          [
            // MIXED
            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron|infinix|tecno|micromax|advan)[-_ ]?([-\w]*)/i,
            // BlackBerry/BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron/Infinix/Tecno/Micromax/Advan
            /; (imo) ((?!tab)[\w ]+?)(?: bui|\))/i,
            // IMO
            /(hp) ([\w ]+\w)/i,
            // HP iPAQ
            /(asus)-?(\w+)/i,
            // Asus
            /(microsoft); (lumia[\w ]+)/i,
            // Microsoft Lumia
            /(lenovo)[-_ ]?([-\w]+)/i,
            // Lenovo
            /(jolla)/i,
            // Jolla
            /(oppo) ?([\w ]+) bui/i
            // OPPO
          ],
          [VENDOR, MODEL, [TYPE, MOBILE]],
          [
            /(imo) (tab \w+)/i,
            // IMO
            /(kobo)\s(ereader|touch)/i,
            // Kobo
            /(archos) (gamepad2?)/i,
            // Archos
            /(hp).+(touchpad(?!.+tablet)|tablet)/i,
            // HP TouchPad
            /(kindle)\/([\w\.]+)/i,
            // Kindle
            /(nook)[\w ]+build\/(\w+)/i,
            // Nook
            /(dell) (strea[kpr\d ]*[\dko])/i,
            // Dell Streak
            /(le[- ]+pan)[- ]+(\w{1,9}) bui/i,
            // Le Pan Tablets
            /(trinity)[- ]*(t\d{3}) bui/i,
            // Trinity Tablets
            /(gigaset)[- ]+(q\w{1,9}) bui/i,
            // Gigaset Tablets
            /(vodafone) ([\w ]+)(?:\)| bui)/i
            // Vodafone
          ],
          [VENDOR, MODEL, [TYPE, TABLET]],
          [
            /(surface duo)/i
            // Surface Duo
          ],
          [MODEL, [VENDOR, MICROSOFT], [TYPE, TABLET]],
          [
            /droid [\d\.]+; (fp\du?)(?: b|\))/i
            // Fairphone
          ],
          [MODEL, [VENDOR, "Fairphone"], [TYPE, MOBILE]],
          [
            /(u304aa)/i
            // AT&T
          ],
          [MODEL, [VENDOR, "AT&T"], [TYPE, MOBILE]],
          [
            /\bsie-(\w*)/i
            // Siemens
          ],
          [MODEL, [VENDOR, "Siemens"], [TYPE, MOBILE]],
          [
            /\b(rct\w+) b/i
            // RCA Tablets
          ],
          [MODEL, [VENDOR, "RCA"], [TYPE, TABLET]],
          [
            /\b(venue[\d ]{2,7}) b/i
            // Dell Venue Tablets
          ],
          [MODEL, [VENDOR, "Dell"], [TYPE, TABLET]],
          [
            /\b(q(?:mv|ta)\w+) b/i
            // Verizon Tablet
          ],
          [MODEL, [VENDOR, "Verizon"], [TYPE, TABLET]],
          [
            /\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i
            // Barnes & Noble Tablet
          ],
          [MODEL, [VENDOR, "Barnes & Noble"], [TYPE, TABLET]],
          [
            /\b(tm\d{3}\w+) b/i
          ],
          [MODEL, [VENDOR, "NuVision"], [TYPE, TABLET]],
          [
            /\b(k88) b/i
            // ZTE K Series Tablet
          ],
          [MODEL, [VENDOR, "ZTE"], [TYPE, TABLET]],
          [
            /\b(nx\d{3}j) b/i
            // ZTE Nubia
          ],
          [MODEL, [VENDOR, "ZTE"], [TYPE, MOBILE]],
          [
            /\b(gen\d{3}) b.+49h/i
            // Swiss GEN Mobile
          ],
          [MODEL, [VENDOR, "Swiss"], [TYPE, MOBILE]],
          [
            /\b(zur\d{3}) b/i
            // Swiss ZUR Tablet
          ],
          [MODEL, [VENDOR, "Swiss"], [TYPE, TABLET]],
          [
            /\b((zeki)?tb.*\b) b/i
            // Zeki Tablets
          ],
          [MODEL, [VENDOR, "Zeki"], [TYPE, TABLET]],
          [
            /\b([yr]\d{2}) b/i,
            /\b(dragon[- ]+touch |dt)(\w{5}) b/i
            // Dragon Touch Tablet
          ],
          [[VENDOR, "Dragon Touch"], MODEL, [TYPE, TABLET]],
          [
            /\b(ns-?\w{0,9}) b/i
            // Insignia Tablets
          ],
          [MODEL, [VENDOR, "Insignia"], [TYPE, TABLET]],
          [
            /\b((nxa|next)-?\w{0,9}) b/i
            // NextBook Tablets
          ],
          [MODEL, [VENDOR, "NextBook"], [TYPE, TABLET]],
          [
            /\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i
            // Voice Xtreme Phones
          ],
          [[VENDOR, "Voice"], MODEL, [TYPE, MOBILE]],
          [
            /\b(lvtel\-)?(v1[12]) b/i
            // LvTel Phones
          ],
          [[VENDOR, "LvTel"], MODEL, [TYPE, MOBILE]],
          [
            /\b(ph-1) /i
            // Essential PH-1
          ],
          [MODEL, [VENDOR, "Essential"], [TYPE, MOBILE]],
          [
            /\b(v(100md|700na|7011|917g).*\b) b/i
            // Envizen Tablets
          ],
          [MODEL, [VENDOR, "Envizen"], [TYPE, TABLET]],
          [
            /\b(trio[-\w\. ]+) b/i
            // MachSpeed Tablets
          ],
          [MODEL, [VENDOR, "MachSpeed"], [TYPE, TABLET]],
          [
            /\btu_(1491) b/i
            // Rotor Tablets
          ],
          [MODEL, [VENDOR, "Rotor"], [TYPE, TABLET]],
          [
            /(shield[\w ]+) b/i
            // Nvidia Shield Tablets
          ],
          [MODEL, [VENDOR, "Nvidia"], [TYPE, TABLET]],
          [
            /(sprint) (\w+)/i
            // Sprint Phones
          ],
          [VENDOR, MODEL, [TYPE, MOBILE]],
          [
            /(kin\.[onetw]{3})/i
            // Microsoft Kin
          ],
          [[MODEL, /\./g, " "], [VENDOR, MICROSOFT], [TYPE, MOBILE]],
          [
            /droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i
            // Zebra
          ],
          [MODEL, [VENDOR, ZEBRA], [TYPE, TABLET]],
          [
            /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
          ],
          [MODEL, [VENDOR, ZEBRA], [TYPE, MOBILE]],
          [
            ///////////////////
            // SMARTTVS
            ///////////////////
            /smart-tv.+(samsung)/i
            // Samsung
          ],
          [VENDOR, [TYPE, SMARTTV]],
          [
            /hbbtv.+maple;(\d+)/i
          ],
          [[MODEL, /^/, "SmartTV"], [VENDOR, SAMSUNG], [TYPE, SMARTTV]],
          [
            /(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i
            // LG SmartTV
          ],
          [[VENDOR, LG], [TYPE, SMARTTV]],
          [
            /(apple) ?tv/i
            // Apple TV
          ],
          [VENDOR, [MODEL, APPLE + " TV"], [TYPE, SMARTTV]],
          [
            /crkey/i
            // Google Chromecast
          ],
          [[MODEL, CHROME + "cast"], [VENDOR, GOOGLE], [TYPE, SMARTTV]],
          [
            /droid.+aft(\w+)( bui|\))/i
            // Fire TV
          ],
          [MODEL, [VENDOR, AMAZON], [TYPE, SMARTTV]],
          [
            /\(dtv[\);].+(aquos)/i,
            /(aquos-tv[\w ]+)\)/i
            // Sharp
          ],
          [MODEL, [VENDOR, SHARP], [TYPE, SMARTTV]],
          [
            /(bravia[\w ]+)( bui|\))/i
            // Sony
          ],
          [MODEL, [VENDOR, SONY], [TYPE, SMARTTV]],
          [
            /(mitv-\w{5}) bui/i
            // Xiaomi
          ],
          [MODEL, [VENDOR, XIAOMI], [TYPE, SMARTTV]],
          [
            /Hbbtv.*(technisat) (.*);/i
            // TechniSAT
          ],
          [VENDOR, MODEL, [TYPE, SMARTTV]],
          [
            /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,
            // Roku
            /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i
            // HbbTV devices
          ],
          [[VENDOR, trim], [MODEL, trim], [TYPE, SMARTTV]],
          [
            /\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i
            // SmartTV from Unidentified Vendors
          ],
          [[TYPE, SMARTTV]],
          [
            ///////////////////
            // CONSOLES
            ///////////////////
            /(ouya)/i,
            // Ouya
            /(nintendo) ([wids3utch]+)/i
            // Nintendo
          ],
          [VENDOR, MODEL, [TYPE, CONSOLE]],
          [
            /droid.+; (shield) bui/i
            // Nvidia
          ],
          [MODEL, [VENDOR, "Nvidia"], [TYPE, CONSOLE]],
          [
            /(playstation [345portablevi]+)/i
            // Playstation
          ],
          [MODEL, [VENDOR, SONY], [TYPE, CONSOLE]],
          [
            /\b(xbox(?: one)?(?!; xbox))[\); ]/i
            // Microsoft Xbox
          ],
          [MODEL, [VENDOR, MICROSOFT], [TYPE, CONSOLE]],
          [
            ///////////////////
            // WEARABLES
            ///////////////////
            /\b(sm-[lr]\d\d[05][fnuw]?s?)\b/i
            // Samsung Galaxy Watch
          ],
          [MODEL, [VENDOR, SAMSUNG], [TYPE, WEARABLE]],
          [
            /((pebble))app/i
            // Pebble
          ],
          [VENDOR, MODEL, [TYPE, WEARABLE]],
          [
            /(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i
            // Apple Watch
          ],
          [MODEL, [VENDOR, APPLE], [TYPE, WEARABLE]],
          [
            /droid.+; (glass) \d/i
            // Google Glass
          ],
          [MODEL, [VENDOR, GOOGLE], [TYPE, WEARABLE]],
          [
            /droid.+; (wt63?0{2,3})\)/i
          ],
          [MODEL, [VENDOR, ZEBRA], [TYPE, WEARABLE]],
          [
            ///////////////////
            // XR
            ///////////////////
            /droid.+; (glass) \d/i
            // Google Glass
          ],
          [MODEL, [VENDOR, GOOGLE], [TYPE, WEARABLE]],
          [
            /(pico) (4|neo3(?: link|pro)?)/i
            // Pico
          ],
          [VENDOR, MODEL, [TYPE, WEARABLE]],
          [
            /; (quest( \d| pro)?)/i
            // Oculus Quest
          ],
          [MODEL, [VENDOR, FACEBOOK], [TYPE, WEARABLE]],
          [
            ///////////////////
            // EMBEDDED
            ///////////////////
            /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i
            // Tesla
          ],
          [VENDOR, [TYPE, EMBEDDED]],
          [
            /(aeobc)\b/i
            // Echo Dot
          ],
          [MODEL, [VENDOR, AMAZON], [TYPE, EMBEDDED]],
          [
            ////////////////////
            // MIXED (GENERIC)
            ///////////////////
            /droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+? mobile safari/i
            // Android Phones from Unidentified Vendors
          ],
          [MODEL, [TYPE, MOBILE]],
          [
            /droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i
            // Android Tablets from Unidentified Vendors
          ],
          [MODEL, [TYPE, TABLET]],
          [
            /\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i
            // Unidentifiable Tablet
          ],
          [[TYPE, TABLET]],
          [
            /(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i
            // Unidentifiable Mobile
          ],
          [[TYPE, MOBILE]],
          [
            /(android[-\w\. ]{0,9});.+buil/i
            // Generic Android Device
          ],
          [MODEL, [VENDOR, "Generic"]]
        ],
        engine: [
          [
            /windows.+ edge\/([\w\.]+)/i
            // EdgeHTML
          ],
          [VERSION, [NAME, EDGE + "HTML"]],
          [
            /(arkweb)\/([\w\.]+)/i
            // ArkWeb
          ],
          [NAME, VERSION],
          [
            /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i
            // Blink
          ],
          [VERSION, [NAME, "Blink"]],
          [
            /(presto)\/([\w\.]+)/i,
            // Presto
            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna|servo)\/([\w\.]+)/i,
            // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m/Goanna/Servo
            /ekioh(flow)\/([\w\.]+)/i,
            // Flow
            /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,
            // KHTML/Tasman/Links
            /(icab)[\/ ]([23]\.[\d\.]+)/i,
            // iCab
            /\b(libweb)/i
          ],
          [NAME, VERSION],
          [
            /rv\:([\w\.]{1,9})\b.+(gecko)/i
            // Gecko
          ],
          [VERSION, NAME]
        ],
        os: [
          [
            // Windows
            /microsoft (windows) (vista|xp)/i
            // Windows (iTunes)
          ],
          [NAME, VERSION],
          [
            /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i
            // Windows Phone
          ],
          [NAME, [VERSION, strMapper, windowsVersionMap]],
          [
            /windows nt 6\.2; (arm)/i,
            // Windows RT
            /windows[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i,
            /(?:win(?=3|9|n)|win 9x )([nt\d\.]+)/i
          ],
          [[VERSION, strMapper, windowsVersionMap], [NAME, "Windows"]],
          [
            // iOS/macOS
            /ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,
            // iOS
            /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,
            /cfnetwork\/.+darwin/i
          ],
          [[VERSION, /_/g, "."], [NAME, "iOS"]],
          [
            /(mac os x) ?([\w\. ]*)/i,
            /(macintosh|mac_powerpc\b)(?!.+haiku)/i
            // Mac OS
          ],
          [[NAME, MAC_OS], [VERSION, /_/g, "."]],
          [
            // Mobile OSes
            /droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i
            // Android-x86/HarmonyOS
          ],
          [VERSION, NAME],
          [
            // Android/WebOS/QNX/Bada/RIM/Maemo/MeeGo/Sailfish OS/OpenHarmony
            /(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish|openharmony)[-\/ ]?([\w\.]*)/i,
            /(blackberry)\w*\/([\w\.]*)/i,
            // Blackberry
            /(tizen|kaios)[\/ ]([\w\.]+)/i,
            // Tizen/KaiOS
            /\((series40);/i
            // Series 40
          ],
          [NAME, VERSION],
          [
            /\(bb(10);/i
            // BlackBerry 10
          ],
          [VERSION, [NAME, BLACKBERRY]],
          [
            /(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i
            // Symbian
          ],
          [VERSION, [NAME, "Symbian"]],
          [
            /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i
            // Firefox OS
          ],
          [VERSION, [NAME, FIREFOX + " OS"]],
          [
            /web0s;.+rt(tv)/i,
            /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i
            // WebOS
          ],
          [VERSION, [NAME, "webOS"]],
          [
            /watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i
            // watchOS
          ],
          [VERSION, [NAME, "watchOS"]],
          [
            // Google Chromecast
            /crkey\/([\d\.]+)/i
            // Google Chromecast
          ],
          [VERSION, [NAME, CHROME + "cast"]],
          [
            /(cros) [\w]+(?:\)| ([\w\.]+)\b)/i
            // Chromium OS
          ],
          [[NAME, CHROMIUM_OS], VERSION],
          [
            // Smart TVs
            /panasonic;(viera)/i,
            // Panasonic Viera
            /(netrange)mmh/i,
            // Netrange
            /(nettv)\/(\d+\.[\w\.]+)/i,
            // NetTV
            // Console
            /(nintendo|playstation) ([wids345portablevuch]+)/i,
            // Nintendo/Playstation
            /(xbox); +xbox ([^\);]+)/i,
            // Microsoft Xbox (360, One, X, S, Series X, Series S)
            // Other
            /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,
            // Joli/Palm
            /(mint)[\/\(\) ]?(\w*)/i,
            // Mint
            /(mageia|vectorlinux)[; ]/i,
            // Mageia/VectorLinux
            /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
            // Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware/Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus/Raspbian/Plan9/Minix/RISCOS/Contiki/Deepin/Manjaro/elementary/Sabayon/Linspire
            /(hurd|linux) ?([\w\.]*)/i,
            // Hurd/Linux
            /(gnu) ?([\w\.]*)/i,
            // GNU
            /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i,
            // FreeBSD/NetBSD/OpenBSD/PC-BSD/GhostBSD/DragonFly
            /(haiku) (\w+)/i
            // Haiku
          ],
          [NAME, VERSION],
          [
            /(sunos) ?([\w\.\d]*)/i
            // Solaris
          ],
          [[NAME, "Solaris"], VERSION],
          [
            /((?:open)?solaris)[-\/ ]?([\w\.]*)/i,
            // Solaris
            /(aix) ((\d)(?=\.|\)| )[\w\.])*/i,
            // AIX
            /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i,
            // BeOS/OS2/AmigaOS/MorphOS/OpenVMS/Fuchsia/HP-UX/SerenityOS
            /(unix) ?([\w\.]*)/i
            // UNIX
          ],
          [NAME, VERSION]
        ]
      };
      var UAParser2 = function(ua2, extensions) {
        if (typeof ua2 === OBJ_TYPE) {
          extensions = ua2;
          ua2 = undefined2;
        }
        if (!(this instanceof UAParser2)) {
          return new UAParser2(ua2, extensions).getResult();
        }
        var _navigator = typeof window2 !== UNDEF_TYPE && window2.navigator ? window2.navigator : undefined2;
        var _ua = ua2 || (_navigator && _navigator.userAgent ? _navigator.userAgent : EMPTY);
        var _uach = _navigator && _navigator.userAgentData ? _navigator.userAgentData : undefined2;
        var _rgxmap = extensions ? extend(regexes, extensions) : regexes;
        var _isSelfNav = _navigator && _navigator.userAgent == _ua;
        this.getBrowser = function() {
          var _browser = {};
          _browser[NAME] = undefined2;
          _browser[VERSION] = undefined2;
          rgxMapper.call(_browser, _ua, _rgxmap.browser);
          _browser[MAJOR] = majorize(_browser[VERSION]);
          if (_isSelfNav && _navigator && _navigator.brave && typeof _navigator.brave.isBrave == FUNC_TYPE) {
            _browser[NAME] = "Brave";
          }
          return _browser;
        };
        this.getCPU = function() {
          var _cpu = {};
          _cpu[ARCHITECTURE] = undefined2;
          rgxMapper.call(_cpu, _ua, _rgxmap.cpu);
          return _cpu;
        };
        this.getDevice = function() {
          var _device = {};
          _device[VENDOR] = undefined2;
          _device[MODEL] = undefined2;
          _device[TYPE] = undefined2;
          rgxMapper.call(_device, _ua, _rgxmap.device);
          if (_isSelfNav && !_device[TYPE] && _uach && _uach.mobile) {
            _device[TYPE] = MOBILE;
          }
          if (_isSelfNav && _device[MODEL] == "Macintosh" && _navigator && typeof _navigator.standalone !== UNDEF_TYPE && _navigator.maxTouchPoints && _navigator.maxTouchPoints > 2) {
            _device[MODEL] = "iPad";
            _device[TYPE] = TABLET;
          }
          return _device;
        };
        this.getEngine = function() {
          var _engine = {};
          _engine[NAME] = undefined2;
          _engine[VERSION] = undefined2;
          rgxMapper.call(_engine, _ua, _rgxmap.engine);
          return _engine;
        };
        this.getOS = function() {
          var _os = {};
          _os[NAME] = undefined2;
          _os[VERSION] = undefined2;
          rgxMapper.call(_os, _ua, _rgxmap.os);
          if (_isSelfNav && !_os[NAME] && _uach && _uach.platform && _uach.platform != "Unknown") {
            _os[NAME] = _uach.platform.replace(/chrome os/i, CHROMIUM_OS).replace(/macos/i, MAC_OS);
          }
          return _os;
        };
        this.getResult = function() {
          return {
            ua: this.getUA(),
            browser: this.getBrowser(),
            engine: this.getEngine(),
            os: this.getOS(),
            device: this.getDevice(),
            cpu: this.getCPU()
          };
        };
        this.getUA = function() {
          return _ua;
        };
        this.setUA = function(ua3) {
          _ua = typeof ua3 === STR_TYPE && ua3.length > UA_MAX_LENGTH ? trim(ua3, UA_MAX_LENGTH) : ua3;
          return this;
        };
        this.setUA(_ua);
        return this;
      };
      UAParser2.VERSION = LIBVERSION;
      UAParser2.BROWSER = enumerize([NAME, VERSION, MAJOR]);
      UAParser2.CPU = enumerize([ARCHITECTURE]);
      UAParser2.DEVICE = enumerize([MODEL, VENDOR, TYPE, CONSOLE, MOBILE, SMARTTV, TABLET, WEARABLE, EMBEDDED]);
      UAParser2.ENGINE = UAParser2.OS = enumerize([NAME, VERSION]);
      if (typeof exports !== UNDEF_TYPE) {
        if (typeof module !== UNDEF_TYPE && module.exports) {
          exports = module.exports = UAParser2;
        }
        exports.UAParser = UAParser2;
      } else {
        if (typeof define === FUNC_TYPE && define.amd) {
          define(function() {
            return UAParser2;
          });
        } else if (typeof window2 !== UNDEF_TYPE) {
          window2.UAParser = UAParser2;
        }
      }
      var $ = typeof window2 !== UNDEF_TYPE && (window2.jQuery || window2.Zepto);
      if ($ && !$.ua) {
        var parser = new UAParser2();
        $.ua = parser.getResult();
        $.ua.get = function() {
          return parser.getUA();
        };
        $.ua.set = function(ua2) {
          parser.setUA(ua2);
          var result = parser.getResult();
          for (var prop in result) {
            $.ua[prop] = result[prop];
          }
        };
      }
    })(typeof window === "object" ? window : exports);
  }
});

// node_modules/qrcode/lib/can-promise.js
var require_can_promise = __commonJS({
  "node_modules/qrcode/lib/can-promise.js"(exports, module) {
    module.exports = function() {
      return typeof Promise === "function" && Promise.prototype && Promise.prototype.then;
    };
  }
});

// node_modules/qrcode/lib/core/utils.js
var require_utils = __commonJS({
  "node_modules/qrcode/lib/core/utils.js"(exports) {
    var toSJISFunction;
    var CODEWORDS_COUNT = [
      0,
      // Not used
      26,
      44,
      70,
      100,
      134,
      172,
      196,
      242,
      292,
      346,
      404,
      466,
      532,
      581,
      655,
      733,
      815,
      901,
      991,
      1085,
      1156,
      1258,
      1364,
      1474,
      1588,
      1706,
      1828,
      1921,
      2051,
      2185,
      2323,
      2465,
      2611,
      2761,
      2876,
      3034,
      3196,
      3362,
      3532,
      3706
    ];
    exports.getSymbolSize = function getSymbolSize(version2) {
      if (!version2) throw new Error('"version" cannot be null or undefined');
      if (version2 < 1 || version2 > 40) throw new Error('"version" should be in range from 1 to 40');
      return version2 * 4 + 17;
    };
    exports.getSymbolTotalCodewords = function getSymbolTotalCodewords(version2) {
      return CODEWORDS_COUNT[version2];
    };
    exports.getBCHDigit = function(data) {
      let digit = 0;
      while (data !== 0) {
        digit++;
        data >>>= 1;
      }
      return digit;
    };
    exports.setToSJISFunction = function setToSJISFunction(f) {
      if (typeof f !== "function") {
        throw new Error('"toSJISFunc" is not a valid function.');
      }
      toSJISFunction = f;
    };
    exports.isKanjiModeEnabled = function() {
      return typeof toSJISFunction !== "undefined";
    };
    exports.toSJIS = function toSJIS(kanji) {
      return toSJISFunction(kanji);
    };
  }
});

// node_modules/qrcode/lib/core/error-correction-level.js
var require_error_correction_level = __commonJS({
  "node_modules/qrcode/lib/core/error-correction-level.js"(exports) {
    exports.L = { bit: 1 };
    exports.M = { bit: 0 };
    exports.Q = { bit: 3 };
    exports.H = { bit: 2 };
    function fromString5(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "l":
        case "low":
          return exports.L;
        case "m":
        case "medium":
          return exports.M;
        case "q":
        case "quartile":
          return exports.Q;
        case "h":
        case "high":
          return exports.H;
        default:
          throw new Error("Unknown EC Level: " + string);
      }
    }
    exports.isValid = function isValid(level) {
      return level && typeof level.bit !== "undefined" && level.bit >= 0 && level.bit < 4;
    };
    exports.from = function from26(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString5(value);
      } catch (e) {
        return defaultValue;
      }
    };
  }
});

// node_modules/qrcode/lib/core/bit-buffer.js
var require_bit_buffer = __commonJS({
  "node_modules/qrcode/lib/core/bit-buffer.js"(exports, module) {
    function BitBuffer() {
      this.buffer = [];
      this.length = 0;
    }
    BitBuffer.prototype = {
      get: function(index2) {
        const bufIndex = Math.floor(index2 / 8);
        return (this.buffer[bufIndex] >>> 7 - index2 % 8 & 1) === 1;
      },
      put: function(num, length) {
        for (let i = 0; i < length; i++) {
          this.putBit((num >>> length - i - 1 & 1) === 1);
        }
      },
      getLengthInBits: function() {
        return this.length;
      },
      putBit: function(bit) {
        const bufIndex = Math.floor(this.length / 8);
        if (this.buffer.length <= bufIndex) {
          this.buffer.push(0);
        }
        if (bit) {
          this.buffer[bufIndex] |= 128 >>> this.length % 8;
        }
        this.length++;
      }
    };
    module.exports = BitBuffer;
  }
});

// node_modules/qrcode/lib/core/bit-matrix.js
var require_bit_matrix = __commonJS({
  "node_modules/qrcode/lib/core/bit-matrix.js"(exports, module) {
    function BitMatrix(size4) {
      if (!size4 || size4 < 1) {
        throw new Error("BitMatrix size must be defined and greater than 0");
      }
      this.size = size4;
      this.data = new Uint8Array(size4 * size4);
      this.reservedBit = new Uint8Array(size4 * size4);
    }
    BitMatrix.prototype.set = function(row, col, value, reserved) {
      const index2 = row * this.size + col;
      this.data[index2] = value;
      if (reserved) this.reservedBit[index2] = true;
    };
    BitMatrix.prototype.get = function(row, col) {
      return this.data[row * this.size + col];
    };
    BitMatrix.prototype.xor = function(row, col, value) {
      this.data[row * this.size + col] ^= value;
    };
    BitMatrix.prototype.isReserved = function(row, col) {
      return this.reservedBit[row * this.size + col];
    };
    module.exports = BitMatrix;
  }
});

// node_modules/qrcode/lib/core/alignment-pattern.js
var require_alignment_pattern = __commonJS({
  "node_modules/qrcode/lib/core/alignment-pattern.js"(exports) {
    var getSymbolSize = require_utils().getSymbolSize;
    exports.getRowColCoords = function getRowColCoords(version2) {
      if (version2 === 1) return [];
      const posCount = Math.floor(version2 / 7) + 2;
      const size4 = getSymbolSize(version2);
      const intervals = size4 === 145 ? 26 : Math.ceil((size4 - 13) / (2 * posCount - 2)) * 2;
      const positions = [size4 - 7];
      for (let i = 1; i < posCount - 1; i++) {
        positions[i] = positions[i - 1] - intervals;
      }
      positions.push(6);
      return positions.reverse();
    };
    exports.getPositions = function getPositions(version2) {
      const coords = [];
      const pos = exports.getRowColCoords(version2);
      const posLength = pos.length;
      for (let i = 0; i < posLength; i++) {
        for (let j = 0; j < posLength; j++) {
          if (i === 0 && j === 0 || // top-left
          i === 0 && j === posLength - 1 || // bottom-left
          i === posLength - 1 && j === 0) {
            continue;
          }
          coords.push([pos[i], pos[j]]);
        }
      }
      return coords;
    };
  }
});

// node_modules/qrcode/lib/core/finder-pattern.js
var require_finder_pattern = __commonJS({
  "node_modules/qrcode/lib/core/finder-pattern.js"(exports) {
    var getSymbolSize = require_utils().getSymbolSize;
    var FINDER_PATTERN_SIZE = 7;
    exports.getPositions = function getPositions(version2) {
      const size4 = getSymbolSize(version2);
      return [
        // top-left
        [0, 0],
        // top-right
        [size4 - FINDER_PATTERN_SIZE, 0],
        // bottom-left
        [0, size4 - FINDER_PATTERN_SIZE]
      ];
    };
  }
});

// node_modules/qrcode/lib/core/mask-pattern.js
var require_mask_pattern = __commonJS({
  "node_modules/qrcode/lib/core/mask-pattern.js"(exports) {
    exports.Patterns = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7
    };
    var PenaltyScores = {
      N1: 3,
      N2: 3,
      N3: 40,
      N4: 10
    };
    exports.isValid = function isValid(mask) {
      return mask != null && mask !== "" && !isNaN(mask) && mask >= 0 && mask <= 7;
    };
    exports.from = function from26(value) {
      return exports.isValid(value) ? parseInt(value, 10) : void 0;
    };
    exports.getPenaltyN1 = function getPenaltyN1(data) {
      const size4 = data.size;
      let points = 0;
      let sameCountCol = 0;
      let sameCountRow = 0;
      let lastCol = null;
      let lastRow = null;
      for (let row = 0; row < size4; row++) {
        sameCountCol = sameCountRow = 0;
        lastCol = lastRow = null;
        for (let col = 0; col < size4; col++) {
          let module2 = data.get(row, col);
          if (module2 === lastCol) {
            sameCountCol++;
          } else {
            if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
            lastCol = module2;
            sameCountCol = 1;
          }
          module2 = data.get(col, row);
          if (module2 === lastRow) {
            sameCountRow++;
          } else {
            if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
            lastRow = module2;
            sameCountRow = 1;
          }
        }
        if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
        if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
      }
      return points;
    };
    exports.getPenaltyN2 = function getPenaltyN2(data) {
      const size4 = data.size;
      let points = 0;
      for (let row = 0; row < size4 - 1; row++) {
        for (let col = 0; col < size4 - 1; col++) {
          const last = data.get(row, col) + data.get(row, col + 1) + data.get(row + 1, col) + data.get(row + 1, col + 1);
          if (last === 4 || last === 0) points++;
        }
      }
      return points * PenaltyScores.N2;
    };
    exports.getPenaltyN3 = function getPenaltyN3(data) {
      const size4 = data.size;
      let points = 0;
      let bitsCol = 0;
      let bitsRow = 0;
      for (let row = 0; row < size4; row++) {
        bitsCol = bitsRow = 0;
        for (let col = 0; col < size4; col++) {
          bitsCol = bitsCol << 1 & 2047 | data.get(row, col);
          if (col >= 10 && (bitsCol === 1488 || bitsCol === 93)) points++;
          bitsRow = bitsRow << 1 & 2047 | data.get(col, row);
          if (col >= 10 && (bitsRow === 1488 || bitsRow === 93)) points++;
        }
      }
      return points * PenaltyScores.N3;
    };
    exports.getPenaltyN4 = function getPenaltyN4(data) {
      let darkCount = 0;
      const modulesCount = data.data.length;
      for (let i = 0; i < modulesCount; i++) darkCount += data.data[i];
      const k = Math.abs(Math.ceil(darkCount * 100 / modulesCount / 5) - 10);
      return k * PenaltyScores.N4;
    };
    function getMaskAt(maskPattern, i, j) {
      switch (maskPattern) {
        case exports.Patterns.PATTERN000:
          return (i + j) % 2 === 0;
        case exports.Patterns.PATTERN001:
          return i % 2 === 0;
        case exports.Patterns.PATTERN010:
          return j % 3 === 0;
        case exports.Patterns.PATTERN011:
          return (i + j) % 3 === 0;
        case exports.Patterns.PATTERN100:
          return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
        case exports.Patterns.PATTERN101:
          return i * j % 2 + i * j % 3 === 0;
        case exports.Patterns.PATTERN110:
          return (i * j % 2 + i * j % 3) % 2 === 0;
        case exports.Patterns.PATTERN111:
          return (i * j % 3 + (i + j) % 2) % 2 === 0;
        default:
          throw new Error("bad maskPattern:" + maskPattern);
      }
    }
    exports.applyMask = function applyMask(pattern, data) {
      const size4 = data.size;
      for (let col = 0; col < size4; col++) {
        for (let row = 0; row < size4; row++) {
          if (data.isReserved(row, col)) continue;
          data.xor(row, col, getMaskAt(pattern, row, col));
        }
      }
    };
    exports.getBestMask = function getBestMask(data, setupFormatFunc) {
      const numPatterns = Object.keys(exports.Patterns).length;
      let bestPattern = 0;
      let lowerPenalty = Infinity;
      for (let p = 0; p < numPatterns; p++) {
        setupFormatFunc(p);
        exports.applyMask(p, data);
        const penalty = exports.getPenaltyN1(data) + exports.getPenaltyN2(data) + exports.getPenaltyN3(data) + exports.getPenaltyN4(data);
        exports.applyMask(p, data);
        if (penalty < lowerPenalty) {
          lowerPenalty = penalty;
          bestPattern = p;
        }
      }
      return bestPattern;
    };
  }
});

// node_modules/qrcode/lib/core/error-correction-code.js
var require_error_correction_code = __commonJS({
  "node_modules/qrcode/lib/core/error-correction-code.js"(exports) {
    var ECLevel = require_error_correction_level();
    var EC_BLOCKS_TABLE = [
      // L  M  Q  H
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      2,
      2,
      1,
      2,
      2,
      4,
      1,
      2,
      4,
      4,
      2,
      4,
      4,
      4,
      2,
      4,
      6,
      5,
      2,
      4,
      6,
      6,
      2,
      5,
      8,
      8,
      4,
      5,
      8,
      8,
      4,
      5,
      8,
      11,
      4,
      8,
      10,
      11,
      4,
      9,
      12,
      16,
      4,
      9,
      16,
      16,
      6,
      10,
      12,
      18,
      6,
      10,
      17,
      16,
      6,
      11,
      16,
      19,
      6,
      13,
      18,
      21,
      7,
      14,
      21,
      25,
      8,
      16,
      20,
      25,
      8,
      17,
      23,
      25,
      9,
      17,
      23,
      34,
      9,
      18,
      25,
      30,
      10,
      20,
      27,
      32,
      12,
      21,
      29,
      35,
      12,
      23,
      34,
      37,
      12,
      25,
      34,
      40,
      13,
      26,
      35,
      42,
      14,
      28,
      38,
      45,
      15,
      29,
      40,
      48,
      16,
      31,
      43,
      51,
      17,
      33,
      45,
      54,
      18,
      35,
      48,
      57,
      19,
      37,
      51,
      60,
      19,
      38,
      53,
      63,
      20,
      40,
      56,
      66,
      21,
      43,
      59,
      70,
      22,
      45,
      62,
      74,
      24,
      47,
      65,
      77,
      25,
      49,
      68,
      81
    ];
    var EC_CODEWORDS_TABLE = [
      // L  M  Q  H
      7,
      10,
      13,
      17,
      10,
      16,
      22,
      28,
      15,
      26,
      36,
      44,
      20,
      36,
      52,
      64,
      26,
      48,
      72,
      88,
      36,
      64,
      96,
      112,
      40,
      72,
      108,
      130,
      48,
      88,
      132,
      156,
      60,
      110,
      160,
      192,
      72,
      130,
      192,
      224,
      80,
      150,
      224,
      264,
      96,
      176,
      260,
      308,
      104,
      198,
      288,
      352,
      120,
      216,
      320,
      384,
      132,
      240,
      360,
      432,
      144,
      280,
      408,
      480,
      168,
      308,
      448,
      532,
      180,
      338,
      504,
      588,
      196,
      364,
      546,
      650,
      224,
      416,
      600,
      700,
      224,
      442,
      644,
      750,
      252,
      476,
      690,
      816,
      270,
      504,
      750,
      900,
      300,
      560,
      810,
      960,
      312,
      588,
      870,
      1050,
      336,
      644,
      952,
      1110,
      360,
      700,
      1020,
      1200,
      390,
      728,
      1050,
      1260,
      420,
      784,
      1140,
      1350,
      450,
      812,
      1200,
      1440,
      480,
      868,
      1290,
      1530,
      510,
      924,
      1350,
      1620,
      540,
      980,
      1440,
      1710,
      570,
      1036,
      1530,
      1800,
      570,
      1064,
      1590,
      1890,
      600,
      1120,
      1680,
      1980,
      630,
      1204,
      1770,
      2100,
      660,
      1260,
      1860,
      2220,
      720,
      1316,
      1950,
      2310,
      750,
      1372,
      2040,
      2430
    ];
    exports.getBlocksCount = function getBlocksCount(version2, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_BLOCKS_TABLE[(version2 - 1) * 4 + 0];
        case ECLevel.M:
          return EC_BLOCKS_TABLE[(version2 - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_BLOCKS_TABLE[(version2 - 1) * 4 + 2];
        case ECLevel.H:
          return EC_BLOCKS_TABLE[(version2 - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
    exports.getTotalCodewordsCount = function getTotalCodewordsCount(version2, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_CODEWORDS_TABLE[(version2 - 1) * 4 + 0];
        case ECLevel.M:
          return EC_CODEWORDS_TABLE[(version2 - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_CODEWORDS_TABLE[(version2 - 1) * 4 + 2];
        case ECLevel.H:
          return EC_CODEWORDS_TABLE[(version2 - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
  }
});

// node_modules/qrcode/lib/core/galois-field.js
var require_galois_field = __commonJS({
  "node_modules/qrcode/lib/core/galois-field.js"(exports) {
    var EXP_TABLE = new Uint8Array(512);
    var LOG_TABLE = new Uint8Array(256);
    (function initTables() {
      let x = 1;
      for (let i = 0; i < 255; i++) {
        EXP_TABLE[i] = x;
        LOG_TABLE[x] = i;
        x <<= 1;
        if (x & 256) {
          x ^= 285;
        }
      }
      for (let i = 255; i < 512; i++) {
        EXP_TABLE[i] = EXP_TABLE[i - 255];
      }
    })();
    exports.log = function log(n) {
      if (n < 1) throw new Error("log(" + n + ")");
      return LOG_TABLE[n];
    };
    exports.exp = function exp(n) {
      return EXP_TABLE[n];
    };
    exports.mul = function mul(x, y) {
      if (x === 0 || y === 0) return 0;
      return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
    };
  }
});

// node_modules/qrcode/lib/core/polynomial.js
var require_polynomial = __commonJS({
  "node_modules/qrcode/lib/core/polynomial.js"(exports) {
    var GF = require_galois_field();
    exports.mul = function mul(p1, p2) {
      const coeff = new Uint8Array(p1.length + p2.length - 1);
      for (let i = 0; i < p1.length; i++) {
        for (let j = 0; j < p2.length; j++) {
          coeff[i + j] ^= GF.mul(p1[i], p2[j]);
        }
      }
      return coeff;
    };
    exports.mod = function mod2(divident, divisor) {
      let result = new Uint8Array(divident);
      while (result.length - divisor.length >= 0) {
        const coeff = result[0];
        for (let i = 0; i < divisor.length; i++) {
          result[i] ^= GF.mul(divisor[i], coeff);
        }
        let offset = 0;
        while (offset < result.length && result[offset] === 0) offset++;
        result = result.slice(offset);
      }
      return result;
    };
    exports.generateECPolynomial = function generateECPolynomial(degree) {
      let poly = new Uint8Array([1]);
      for (let i = 0; i < degree; i++) {
        poly = exports.mul(poly, new Uint8Array([1, GF.exp(i)]));
      }
      return poly;
    };
  }
});

// node_modules/qrcode/lib/core/reed-solomon-encoder.js
var require_reed_solomon_encoder = __commonJS({
  "node_modules/qrcode/lib/core/reed-solomon-encoder.js"(exports, module) {
    var Polynomial = require_polynomial();
    function ReedSolomonEncoder(degree) {
      this.genPoly = void 0;
      this.degree = degree;
      if (this.degree) this.initialize(this.degree);
    }
    ReedSolomonEncoder.prototype.initialize = function initialize(degree) {
      this.degree = degree;
      this.genPoly = Polynomial.generateECPolynomial(this.degree);
    };
    ReedSolomonEncoder.prototype.encode = function encode7(data) {
      if (!this.genPoly) {
        throw new Error("Encoder not initialized");
      }
      const paddedData = new Uint8Array(data.length + this.degree);
      paddedData.set(data);
      const remainder = Polynomial.mod(paddedData, this.genPoly);
      const start = this.degree - remainder.length;
      if (start > 0) {
        const buff = new Uint8Array(this.degree);
        buff.set(remainder, start);
        return buff;
      }
      return remainder;
    };
    module.exports = ReedSolomonEncoder;
  }
});

// node_modules/qrcode/lib/core/version-check.js
var require_version_check = __commonJS({
  "node_modules/qrcode/lib/core/version-check.js"(exports) {
    exports.isValid = function isValid(version2) {
      return !isNaN(version2) && version2 >= 1 && version2 <= 40;
    };
  }
});

// node_modules/qrcode/lib/core/regex.js
var require_regex = __commonJS({
  "node_modules/qrcode/lib/core/regex.js"(exports) {
    var numeric = "[0-9]+";
    var alphanumeric = "[A-Z $%*+\\-./:]+";
    var kanji = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
    kanji = kanji.replace(/u/g, "\\u");
    var byte = "(?:(?![A-Z0-9 $%*+\\-./:]|" + kanji + ")(?:.|[\r\n]))+";
    exports.KANJI = new RegExp(kanji, "g");
    exports.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
    exports.BYTE = new RegExp(byte, "g");
    exports.NUMERIC = new RegExp(numeric, "g");
    exports.ALPHANUMERIC = new RegExp(alphanumeric, "g");
    var TEST_KANJI = new RegExp("^" + kanji + "$");
    var TEST_NUMERIC = new RegExp("^" + numeric + "$");
    var TEST_ALPHANUMERIC = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
    exports.testKanji = function testKanji(str) {
      return TEST_KANJI.test(str);
    };
    exports.testNumeric = function testNumeric(str) {
      return TEST_NUMERIC.test(str);
    };
    exports.testAlphanumeric = function testAlphanumeric(str) {
      return TEST_ALPHANUMERIC.test(str);
    };
  }
});

// node_modules/qrcode/lib/core/mode.js
var require_mode = __commonJS({
  "node_modules/qrcode/lib/core/mode.js"(exports) {
    var VersionCheck = require_version_check();
    var Regex = require_regex();
    exports.NUMERIC = {
      id: "Numeric",
      bit: 1 << 0,
      ccBits: [10, 12, 14]
    };
    exports.ALPHANUMERIC = {
      id: "Alphanumeric",
      bit: 1 << 1,
      ccBits: [9, 11, 13]
    };
    exports.BYTE = {
      id: "Byte",
      bit: 1 << 2,
      ccBits: [8, 16, 16]
    };
    exports.KANJI = {
      id: "Kanji",
      bit: 1 << 3,
      ccBits: [8, 10, 12]
    };
    exports.MIXED = {
      bit: -1
    };
    exports.getCharCountIndicator = function getCharCountIndicator(mode, version2) {
      if (!mode.ccBits) throw new Error("Invalid mode: " + mode);
      if (!VersionCheck.isValid(version2)) {
        throw new Error("Invalid version: " + version2);
      }
      if (version2 >= 1 && version2 < 10) return mode.ccBits[0];
      else if (version2 < 27) return mode.ccBits[1];
      return mode.ccBits[2];
    };
    exports.getBestModeForData = function getBestModeForData(dataStr) {
      if (Regex.testNumeric(dataStr)) return exports.NUMERIC;
      else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC;
      else if (Regex.testKanji(dataStr)) return exports.KANJI;
      else return exports.BYTE;
    };
    exports.toString = function toString5(mode) {
      if (mode && mode.id) return mode.id;
      throw new Error("Invalid mode");
    };
    exports.isValid = function isValid(mode) {
      return mode && mode.bit && mode.ccBits;
    };
    function fromString5(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "numeric":
          return exports.NUMERIC;
        case "alphanumeric":
          return exports.ALPHANUMERIC;
        case "kanji":
          return exports.KANJI;
        case "byte":
          return exports.BYTE;
        default:
          throw new Error("Unknown mode: " + string);
      }
    }
    exports.from = function from26(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString5(value);
      } catch (e) {
        return defaultValue;
      }
    };
  }
});

// node_modules/qrcode/lib/core/version.js
var require_version = __commonJS({
  "node_modules/qrcode/lib/core/version.js"(exports) {
    var Utils = require_utils();
    var ECCode = require_error_correction_code();
    var ECLevel = require_error_correction_level();
    var Mode = require_mode();
    var VersionCheck = require_version_check();
    var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
    var G18_BCH = Utils.getBCHDigit(G18);
    function getBestVersionForDataLength(mode, length, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    function getReservedBitsCount(mode, version2) {
      return Mode.getCharCountIndicator(mode, version2) + 4;
    }
    function getTotalBitsFromDataArray(segments, version2) {
      let totalBits = 0;
      segments.forEach(function(data) {
        const reservedBits = getReservedBitsCount(data.mode, version2);
        totalBits += reservedBits + data.getBitsLength();
      });
      return totalBits;
    }
    function getBestVersionForMixedData(segments, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        const length = getTotalBitsFromDataArray(segments, currentVersion);
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    exports.from = function from26(value, defaultValue) {
      if (VersionCheck.isValid(value)) {
        return parseInt(value, 10);
      }
      return defaultValue;
    };
    exports.getCapacity = function getCapacity(version2, errorCorrectionLevel, mode) {
      if (!VersionCheck.isValid(version2)) {
        throw new Error("Invalid QR Code version");
      }
      if (typeof mode === "undefined") mode = Mode.BYTE;
      const totalCodewords = Utils.getSymbolTotalCodewords(version2);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version2, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (mode === Mode.MIXED) return dataTotalCodewordsBits;
      const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version2);
      switch (mode) {
        case Mode.NUMERIC:
          return Math.floor(usableBits / 10 * 3);
        case Mode.ALPHANUMERIC:
          return Math.floor(usableBits / 11 * 2);
        case Mode.KANJI:
          return Math.floor(usableBits / 13);
        case Mode.BYTE:
        default:
          return Math.floor(usableBits / 8);
      }
    };
    exports.getBestVersionForData = function getBestVersionForData(data, errorCorrectionLevel) {
      let seg;
      const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);
      if (Array.isArray(data)) {
        if (data.length > 1) {
          return getBestVersionForMixedData(data, ecl);
        }
        if (data.length === 0) {
          return 1;
        }
        seg = data[0];
      } else {
        seg = data;
      }
      return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
    };
    exports.getEncodedBits = function getEncodedBits(version2) {
      if (!VersionCheck.isValid(version2) || version2 < 7) {
        throw new Error("Invalid QR Code version");
      }
      let d = version2 << 12;
      while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
        d ^= G18 << Utils.getBCHDigit(d) - G18_BCH;
      }
      return version2 << 12 | d;
    };
  }
});

// node_modules/qrcode/lib/core/format-info.js
var require_format_info = __commonJS({
  "node_modules/qrcode/lib/core/format-info.js"(exports) {
    var Utils = require_utils();
    var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
    var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
    var G15_BCH = Utils.getBCHDigit(G15);
    exports.getEncodedBits = function getEncodedBits(errorCorrectionLevel, mask) {
      const data = errorCorrectionLevel.bit << 3 | mask;
      let d = data << 10;
      while (Utils.getBCHDigit(d) - G15_BCH >= 0) {
        d ^= G15 << Utils.getBCHDigit(d) - G15_BCH;
      }
      return (data << 10 | d) ^ G15_MASK;
    };
  }
});

// node_modules/qrcode/lib/core/numeric-data.js
var require_numeric_data = __commonJS({
  "node_modules/qrcode/lib/core/numeric-data.js"(exports, module) {
    var Mode = require_mode();
    function NumericData(data) {
      this.mode = Mode.NUMERIC;
      this.data = data.toString();
    }
    NumericData.getBitsLength = function getBitsLength(length) {
      return 10 * Math.floor(length / 3) + (length % 3 ? length % 3 * 3 + 1 : 0);
    };
    NumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    NumericData.prototype.getBitsLength = function getBitsLength() {
      return NumericData.getBitsLength(this.data.length);
    };
    NumericData.prototype.write = function write(bitBuffer) {
      let i, group, value;
      for (i = 0; i + 3 <= this.data.length; i += 3) {
        group = this.data.substr(i, 3);
        value = parseInt(group, 10);
        bitBuffer.put(value, 10);
      }
      const remainingNum = this.data.length - i;
      if (remainingNum > 0) {
        group = this.data.substr(i);
        value = parseInt(group, 10);
        bitBuffer.put(value, remainingNum * 3 + 1);
      }
    };
    module.exports = NumericData;
  }
});

// node_modules/qrcode/lib/core/alphanumeric-data.js
var require_alphanumeric_data = __commonJS({
  "node_modules/qrcode/lib/core/alphanumeric-data.js"(exports, module) {
    var Mode = require_mode();
    var ALPHA_NUM_CHARS = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      " ",
      "$",
      "%",
      "*",
      "+",
      "-",
      ".",
      "/",
      ":"
    ];
    function AlphanumericData(data) {
      this.mode = Mode.ALPHANUMERIC;
      this.data = data;
    }
    AlphanumericData.getBitsLength = function getBitsLength(length) {
      return 11 * Math.floor(length / 2) + 6 * (length % 2);
    };
    AlphanumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    AlphanumericData.prototype.getBitsLength = function getBitsLength() {
      return AlphanumericData.getBitsLength(this.data.length);
    };
    AlphanumericData.prototype.write = function write(bitBuffer) {
      let i;
      for (i = 0; i + 2 <= this.data.length; i += 2) {
        let value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;
        value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);
        bitBuffer.put(value, 11);
      }
      if (this.data.length % 2) {
        bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
      }
    };
    module.exports = AlphanumericData;
  }
});

// node_modules/qrcode/lib/core/byte-data.js
var require_byte_data = __commonJS({
  "node_modules/qrcode/lib/core/byte-data.js"(exports, module) {
    var Mode = require_mode();
    function ByteData(data) {
      this.mode = Mode.BYTE;
      if (typeof data === "string") {
        this.data = new TextEncoder().encode(data);
      } else {
        this.data = new Uint8Array(data);
      }
    }
    ByteData.getBitsLength = function getBitsLength(length) {
      return length * 8;
    };
    ByteData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    ByteData.prototype.getBitsLength = function getBitsLength() {
      return ByteData.getBitsLength(this.data.length);
    };
    ByteData.prototype.write = function(bitBuffer) {
      for (let i = 0, l = this.data.length; i < l; i++) {
        bitBuffer.put(this.data[i], 8);
      }
    };
    module.exports = ByteData;
  }
});

// node_modules/qrcode/lib/core/kanji-data.js
var require_kanji_data = __commonJS({
  "node_modules/qrcode/lib/core/kanji-data.js"(exports, module) {
    var Mode = require_mode();
    var Utils = require_utils();
    function KanjiData(data) {
      this.mode = Mode.KANJI;
      this.data = data;
    }
    KanjiData.getBitsLength = function getBitsLength(length) {
      return length * 13;
    };
    KanjiData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    KanjiData.prototype.getBitsLength = function getBitsLength() {
      return KanjiData.getBitsLength(this.data.length);
    };
    KanjiData.prototype.write = function(bitBuffer) {
      let i;
      for (i = 0; i < this.data.length; i++) {
        let value = Utils.toSJIS(this.data[i]);
        if (value >= 33088 && value <= 40956) {
          value -= 33088;
        } else if (value >= 57408 && value <= 60351) {
          value -= 49472;
        } else {
          throw new Error(
            "Invalid SJIS character: " + this.data[i] + "\nMake sure your charset is UTF-8"
          );
        }
        value = (value >>> 8 & 255) * 192 + (value & 255);
        bitBuffer.put(value, 13);
      }
    };
    module.exports = KanjiData;
  }
});

// node_modules/qrcode/lib/core/segments.js
var require_segments = __commonJS({
  "node_modules/qrcode/lib/core/segments.js"(exports) {
    var Mode = require_mode();
    var NumericData = require_numeric_data();
    var AlphanumericData = require_alphanumeric_data();
    var ByteData = require_byte_data();
    var KanjiData = require_kanji_data();
    var Regex = require_regex();
    var Utils = require_utils();
    var dijkstra = require_dijkstra();
    function getStringByteLength(str) {
      return unescape(encodeURIComponent(str)).length;
    }
    function getSegments(regex, mode, str) {
      const segments = [];
      let result;
      while ((result = regex.exec(str)) !== null) {
        segments.push({
          data: result[0],
          index: result.index,
          mode,
          length: result[0].length
        });
      }
      return segments;
    }
    function getSegmentsFromString(dataStr) {
      const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
      const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
      let byteSegs;
      let kanjiSegs;
      if (Utils.isKanjiModeEnabled()) {
        byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
        kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
      } else {
        byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
        kanjiSegs = [];
      }
      const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);
      return segs.sort(function(s1, s2) {
        return s1.index - s2.index;
      }).map(function(obj) {
        return {
          data: obj.data,
          mode: obj.mode,
          length: obj.length
        };
      });
    }
    function getSegmentBitsLength(length, mode) {
      switch (mode) {
        case Mode.NUMERIC:
          return NumericData.getBitsLength(length);
        case Mode.ALPHANUMERIC:
          return AlphanumericData.getBitsLength(length);
        case Mode.KANJI:
          return KanjiData.getBitsLength(length);
        case Mode.BYTE:
          return ByteData.getBitsLength(length);
      }
    }
    function mergeSegments(segs) {
      return segs.reduce(function(acc, curr) {
        const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
        if (prevSeg && prevSeg.mode === curr.mode) {
          acc[acc.length - 1].data += curr.data;
          return acc;
        }
        acc.push(curr);
        return acc;
      }, []);
    }
    function buildNodes(segs) {
      const nodes = [];
      for (let i = 0; i < segs.length; i++) {
        const seg = segs[i];
        switch (seg.mode) {
          case Mode.NUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.ALPHANUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.KANJI:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
            break;
          case Mode.BYTE:
            nodes.push([
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
        }
      }
      return nodes;
    }
    function buildGraph(nodes, version2) {
      const table = {};
      const graph = { start: {} };
      let prevNodeIds = ["start"];
      for (let i = 0; i < nodes.length; i++) {
        const nodeGroup = nodes[i];
        const currentNodeIds = [];
        for (let j = 0; j < nodeGroup.length; j++) {
          const node = nodeGroup[j];
          const key = "" + i + j;
          currentNodeIds.push(key);
          table[key] = { node, lastCount: 0 };
          graph[key] = {};
          for (let n = 0; n < prevNodeIds.length; n++) {
            const prevNodeId = prevNodeIds[n];
            if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
              graph[prevNodeId][key] = getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) - getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);
              table[prevNodeId].lastCount += node.length;
            } else {
              if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;
              graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) + 4 + Mode.getCharCountIndicator(node.mode, version2);
            }
          }
        }
        prevNodeIds = currentNodeIds;
      }
      for (let n = 0; n < prevNodeIds.length; n++) {
        graph[prevNodeIds[n]].end = 0;
      }
      return { map: graph, table };
    }
    function buildSingleSegment(data, modesHint) {
      let mode;
      const bestMode = Mode.getBestModeForData(data);
      mode = Mode.from(modesHint, bestMode);
      if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
        throw new Error('"' + data + '" cannot be encoded with mode ' + Mode.toString(mode) + ".\n Suggested mode is: " + Mode.toString(bestMode));
      }
      if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
        mode = Mode.BYTE;
      }
      switch (mode) {
        case Mode.NUMERIC:
          return new NumericData(data);
        case Mode.ALPHANUMERIC:
          return new AlphanumericData(data);
        case Mode.KANJI:
          return new KanjiData(data);
        case Mode.BYTE:
          return new ByteData(data);
      }
    }
    exports.fromArray = function fromArray2(array) {
      return array.reduce(function(acc, seg) {
        if (typeof seg === "string") {
          acc.push(buildSingleSegment(seg, null));
        } else if (seg.data) {
          acc.push(buildSingleSegment(seg.data, seg.mode));
        }
        return acc;
      }, []);
    };
    exports.fromString = function fromString5(data, version2) {
      const segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled());
      const nodes = buildNodes(segs);
      const graph = buildGraph(nodes, version2);
      const path2 = dijkstra.find_path(graph.map, "start", "end");
      const optimizedSegs = [];
      for (let i = 1; i < path2.length - 1; i++) {
        optimizedSegs.push(graph.table[path2[i]].node);
      }
      return exports.fromArray(mergeSegments(optimizedSegs));
    };
    exports.rawSplit = function rawSplit(data) {
      return exports.fromArray(
        getSegmentsFromString(data, Utils.isKanjiModeEnabled())
      );
    };
  }
});

// node_modules/qrcode/lib/core/qrcode.js
var require_qrcode = __commonJS({
  "node_modules/qrcode/lib/core/qrcode.js"(exports) {
    var Utils = require_utils();
    var ECLevel = require_error_correction_level();
    var BitBuffer = require_bit_buffer();
    var BitMatrix = require_bit_matrix();
    var AlignmentPattern = require_alignment_pattern();
    var FinderPattern = require_finder_pattern();
    var MaskPattern = require_mask_pattern();
    var ECCode = require_error_correction_code();
    var ReedSolomonEncoder = require_reed_solomon_encoder();
    var Version = require_version();
    var FormatInfo = require_format_info();
    var Mode = require_mode();
    var Segments = require_segments();
    function setupFinderPattern(matrix, version2) {
      const size4 = matrix.size;
      const pos = FinderPattern.getPositions(version2);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -1; r <= 7; r++) {
          if (row + r <= -1 || size4 <= row + r) continue;
          for (let c = -1; c <= 7; c++) {
            if (col + c <= -1 || size4 <= col + c) continue;
            if (r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupTimingPattern(matrix) {
      const size4 = matrix.size;
      for (let r = 8; r < size4 - 8; r++) {
        const value = r % 2 === 0;
        matrix.set(r, 6, value, true);
        matrix.set(6, r, value, true);
      }
    }
    function setupAlignmentPattern(matrix, version2) {
      const pos = AlignmentPattern.getPositions(version2);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || r === 0 && c === 0) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupVersionInfo(matrix, version2) {
      const size4 = matrix.size;
      const bits = Version.getEncodedBits(version2);
      let row, col, mod2;
      for (let i = 0; i < 18; i++) {
        row = Math.floor(i / 3);
        col = i % 3 + size4 - 8 - 3;
        mod2 = (bits >> i & 1) === 1;
        matrix.set(row, col, mod2, true);
        matrix.set(col, row, mod2, true);
      }
    }
    function setupFormatInfo(matrix, errorCorrectionLevel, maskPattern) {
      const size4 = matrix.size;
      const bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern);
      let i, mod2;
      for (i = 0; i < 15; i++) {
        mod2 = (bits >> i & 1) === 1;
        if (i < 6) {
          matrix.set(i, 8, mod2, true);
        } else if (i < 8) {
          matrix.set(i + 1, 8, mod2, true);
        } else {
          matrix.set(size4 - 15 + i, 8, mod2, true);
        }
        if (i < 8) {
          matrix.set(8, size4 - i - 1, mod2, true);
        } else if (i < 9) {
          matrix.set(8, 15 - i - 1 + 1, mod2, true);
        } else {
          matrix.set(8, 15 - i - 1, mod2, true);
        }
      }
      matrix.set(size4 - 8, 8, 1, true);
    }
    function setupData(matrix, data) {
      const size4 = matrix.size;
      let inc = -1;
      let row = size4 - 1;
      let bitIndex = 7;
      let byteIndex = 0;
      for (let col = size4 - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        while (true) {
          for (let c = 0; c < 2; c++) {
            if (!matrix.isReserved(row, col - c)) {
              let dark = false;
              if (byteIndex < data.length) {
                dark = (data[byteIndex] >>> bitIndex & 1) === 1;
              }
              matrix.set(row, col - c, dark);
              bitIndex--;
              if (bitIndex === -1) {
                byteIndex++;
                bitIndex = 7;
              }
            }
          }
          row += inc;
          if (row < 0 || size4 <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    }
    function createData(version2, errorCorrectionLevel, segments) {
      const buffer2 = new BitBuffer();
      segments.forEach(function(data) {
        buffer2.put(data.mode.bit, 4);
        buffer2.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version2));
        data.write(buffer2);
      });
      const totalCodewords = Utils.getSymbolTotalCodewords(version2);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version2, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (buffer2.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
        buffer2.put(0, 4);
      }
      while (buffer2.getLengthInBits() % 8 !== 0) {
        buffer2.putBit(0);
      }
      const remainingByte = (dataTotalCodewordsBits - buffer2.getLengthInBits()) / 8;
      for (let i = 0; i < remainingByte; i++) {
        buffer2.put(i % 2 ? 17 : 236, 8);
      }
      return createCodewords(buffer2, version2, errorCorrectionLevel);
    }
    function createCodewords(bitBuffer, version2, errorCorrectionLevel) {
      const totalCodewords = Utils.getSymbolTotalCodewords(version2);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version2, errorCorrectionLevel);
      const dataTotalCodewords = totalCodewords - ecTotalCodewords;
      const ecTotalBlocks = ECCode.getBlocksCount(version2, errorCorrectionLevel);
      const blocksInGroup2 = totalCodewords % ecTotalBlocks;
      const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;
      const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;
      const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;
      const rs = new ReedSolomonEncoder(ecCount);
      let offset = 0;
      const dcData = new Array(ecTotalBlocks);
      const ecData = new Array(ecTotalBlocks);
      let maxDataSize = 0;
      const buffer2 = new Uint8Array(bitBuffer.buffer);
      for (let b = 0; b < ecTotalBlocks; b++) {
        const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;
        dcData[b] = buffer2.slice(offset, offset + dataSize);
        ecData[b] = rs.encode(dcData[b]);
        offset += dataSize;
        maxDataSize = Math.max(maxDataSize, dataSize);
      }
      const data = new Uint8Array(totalCodewords);
      let index2 = 0;
      let i, r;
      for (i = 0; i < maxDataSize; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          if (i < dcData[r].length) {
            data[index2++] = dcData[r][i];
          }
        }
      }
      for (i = 0; i < ecCount; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          data[index2++] = ecData[r][i];
        }
      }
      return data;
    }
    function createSymbol(data, version2, errorCorrectionLevel, maskPattern) {
      let segments;
      if (Array.isArray(data)) {
        segments = Segments.fromArray(data);
      } else if (typeof data === "string") {
        let estimatedVersion = version2;
        if (!estimatedVersion) {
          const rawSegments = Segments.rawSplit(data);
          estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel);
        }
        segments = Segments.fromString(data, estimatedVersion || 40);
      } else {
        throw new Error("Invalid data");
      }
      const bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel);
      if (!bestVersion) {
        throw new Error("The amount of data is too big to be stored in a QR Code");
      }
      if (!version2) {
        version2 = bestVersion;
      } else if (version2 < bestVersion) {
        throw new Error(
          "\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: " + bestVersion + ".\n"
        );
      }
      const dataBits = createData(version2, errorCorrectionLevel, segments);
      const moduleCount = Utils.getSymbolSize(version2);
      const modules = new BitMatrix(moduleCount);
      setupFinderPattern(modules, version2);
      setupTimingPattern(modules);
      setupAlignmentPattern(modules, version2);
      setupFormatInfo(modules, errorCorrectionLevel, 0);
      if (version2 >= 7) {
        setupVersionInfo(modules, version2);
      }
      setupData(modules, dataBits);
      if (isNaN(maskPattern)) {
        maskPattern = MaskPattern.getBestMask(
          modules,
          setupFormatInfo.bind(null, modules, errorCorrectionLevel)
        );
      }
      MaskPattern.applyMask(maskPattern, modules);
      setupFormatInfo(modules, errorCorrectionLevel, maskPattern);
      return {
        modules,
        version: version2,
        errorCorrectionLevel,
        maskPattern,
        segments
      };
    }
    exports.create = function create3(data, options) {
      if (typeof data === "undefined" || data === "") {
        throw new Error("No input text");
      }
      let errorCorrectionLevel = ECLevel.M;
      let version2;
      let mask;
      if (typeof options !== "undefined") {
        errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
        version2 = Version.from(options.version);
        mask = MaskPattern.from(options.maskPattern);
        if (options.toSJISFunc) {
          Utils.setToSJISFunction(options.toSJISFunc);
        }
      }
      return createSymbol(data, version2, errorCorrectionLevel, mask);
    };
  }
});

// node_modules/qrcode/lib/renderer/utils.js
var require_utils2 = __commonJS({
  "node_modules/qrcode/lib/renderer/utils.js"(exports) {
    function hex2rgba(hex2) {
      if (typeof hex2 === "number") {
        hex2 = hex2.toString();
      }
      if (typeof hex2 !== "string") {
        throw new Error("Color should be defined as hex string");
      }
      let hexCode = hex2.slice().replace("#", "").split("");
      if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
        throw new Error("Invalid hex color: " + hex2);
      }
      if (hexCode.length === 3 || hexCode.length === 4) {
        hexCode = Array.prototype.concat.apply([], hexCode.map(function(c) {
          return [c, c];
        }));
      }
      if (hexCode.length === 6) hexCode.push("F", "F");
      const hexValue = parseInt(hexCode.join(""), 16);
      return {
        r: hexValue >> 24 & 255,
        g: hexValue >> 16 & 255,
        b: hexValue >> 8 & 255,
        a: hexValue & 255,
        hex: "#" + hexCode.slice(0, 6).join("")
      };
    }
    exports.getOptions = function getOptions(options) {
      if (!options) options = {};
      if (!options.color) options.color = {};
      const margin = typeof options.margin === "undefined" || options.margin === null || options.margin < 0 ? 4 : options.margin;
      const width = options.width && options.width >= 21 ? options.width : void 0;
      const scale = options.scale || 4;
      return {
        width,
        scale: width ? 4 : scale,
        margin,
        color: {
          dark: hex2rgba(options.color.dark || "#000000ff"),
          light: hex2rgba(options.color.light || "#ffffffff")
        },
        type: options.type,
        rendererOpts: options.rendererOpts || {}
      };
    };
    exports.getScale = function getScale(qrSize, opts) {
      return opts.width && opts.width >= qrSize + opts.margin * 2 ? opts.width / (qrSize + opts.margin * 2) : opts.scale;
    };
    exports.getImageWidth = function getImageWidth(qrSize, opts) {
      const scale = exports.getScale(qrSize, opts);
      return Math.floor((qrSize + opts.margin * 2) * scale);
    };
    exports.qrToImageData = function qrToImageData(imgData, qr, opts) {
      const size4 = qr.modules.size;
      const data = qr.modules.data;
      const scale = exports.getScale(size4, opts);
      const symbolSize = Math.floor((size4 + opts.margin * 2) * scale);
      const scaledMargin = opts.margin * scale;
      const palette = [opts.color.light, opts.color.dark];
      for (let i = 0; i < symbolSize; i++) {
        for (let j = 0; j < symbolSize; j++) {
          let posDst = (i * symbolSize + j) * 4;
          let pxColor = opts.color.light;
          if (i >= scaledMargin && j >= scaledMargin && i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
            const iSrc = Math.floor((i - scaledMargin) / scale);
            const jSrc = Math.floor((j - scaledMargin) / scale);
            pxColor = palette[data[iSrc * size4 + jSrc] ? 1 : 0];
          }
          imgData[posDst++] = pxColor.r;
          imgData[posDst++] = pxColor.g;
          imgData[posDst++] = pxColor.b;
          imgData[posDst] = pxColor.a;
        }
      }
    };
  }
});

// node_modules/qrcode/lib/renderer/canvas.js
var require_canvas = __commonJS({
  "node_modules/qrcode/lib/renderer/canvas.js"(exports) {
    var Utils = require_utils2();
    function clearCanvas(ctx, canvas, size4) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!canvas.style) canvas.style = {};
      canvas.height = size4;
      canvas.width = size4;
      canvas.style.height = size4 + "px";
      canvas.style.width = size4 + "px";
    }
    function getCanvasElement() {
      try {
        return document.createElement("canvas");
      } catch (e) {
        throw new Error("You need to specify a canvas element");
      }
    }
    exports.render = function render(qrData, canvas, options) {
      let opts = options;
      let canvasEl = canvas;
      if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = void 0;
      }
      if (!canvas) {
        canvasEl = getCanvasElement();
      }
      opts = Utils.getOptions(opts);
      const size4 = Utils.getImageWidth(qrData.modules.size, opts);
      const ctx = canvasEl.getContext("2d");
      const image = ctx.createImageData(size4, size4);
      Utils.qrToImageData(image.data, qrData, opts);
      clearCanvas(ctx, canvasEl, size4);
      ctx.putImageData(image, 0, 0);
      return canvasEl;
    };
    exports.renderToDataURL = function renderToDataURL(qrData, canvas, options) {
      let opts = options;
      if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = void 0;
      }
      if (!opts) opts = {};
      const canvasEl = exports.render(qrData, canvas, opts);
      const type6 = opts.type || "image/png";
      const rendererOpts = opts.rendererOpts || {};
      return canvasEl.toDataURL(type6, rendererOpts.quality);
    };
  }
});

// node_modules/qrcode/lib/renderer/svg-tag.js
var require_svg_tag = __commonJS({
  "node_modules/qrcode/lib/renderer/svg-tag.js"(exports) {
    var Utils = require_utils2();
    function getColorAttrib(color, attrib) {
      const alpha = color.a / 255;
      const str = attrib + '="' + color.hex + '"';
      return alpha < 1 ? str + " " + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"' : str;
    }
    function svgCmd(cmd, x, y) {
      let str = cmd + x;
      if (typeof y !== "undefined") str += " " + y;
      return str;
    }
    function qrToPath(data, size4, margin) {
      let path2 = "";
      let moveBy = 0;
      let newRow = false;
      let lineLength = 0;
      for (let i = 0; i < data.length; i++) {
        const col = Math.floor(i % size4);
        const row = Math.floor(i / size4);
        if (!col && !newRow) newRow = true;
        if (data[i]) {
          lineLength++;
          if (!(i > 0 && col > 0 && data[i - 1])) {
            path2 += newRow ? svgCmd("M", col + margin, 0.5 + row + margin) : svgCmd("m", moveBy, 0);
            moveBy = 0;
            newRow = false;
          }
          if (!(col + 1 < size4 && data[i + 1])) {
            path2 += svgCmd("h", lineLength);
            lineLength = 0;
          }
        } else {
          moveBy++;
        }
      }
      return path2;
    }
    exports.render = function render(qrData, options, cb) {
      const opts = Utils.getOptions(options);
      const size4 = qrData.modules.size;
      const data = qrData.modules.data;
      const qrcodesize = size4 + opts.margin * 2;
      const bg = !opts.color.light.a ? "" : "<path " + getColorAttrib(opts.color.light, "fill") + ' d="M0 0h' + qrcodesize + "v" + qrcodesize + 'H0z"/>';
      const path2 = "<path " + getColorAttrib(opts.color.dark, "stroke") + ' d="' + qrToPath(data, size4, opts.margin) + '"/>';
      const viewBox = 'viewBox="0 0 ' + qrcodesize + " " + qrcodesize + '"';
      const width = !opts.width ? "" : 'width="' + opts.width + '" height="' + opts.width + '" ';
      const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path2 + "</svg>\n";
      if (typeof cb === "function") {
        cb(null, svgTag);
      }
      return svgTag;
    };
  }
});

// node_modules/qrcode/lib/browser.js
var require_browser = __commonJS({
  "node_modules/qrcode/lib/browser.js"(exports) {
    var canPromise = require_can_promise();
    var QRCode2 = require_qrcode();
    var CanvasRenderer = require_canvas();
    var SvgRenderer = require_svg_tag();
    function renderCanvas(renderFunc, canvas, text, opts, cb) {
      const args = [].slice.call(arguments, 1);
      const argsNum = args.length;
      const isLastArgCb = typeof args[argsNum - 1] === "function";
      if (!isLastArgCb && !canPromise()) {
        throw new Error("Callback required as last argument");
      }
      if (isLastArgCb) {
        if (argsNum < 2) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 2) {
          cb = text;
          text = canvas;
          canvas = opts = void 0;
        } else if (argsNum === 3) {
          if (canvas.getContext && typeof cb === "undefined") {
            cb = opts;
            opts = void 0;
          } else {
            cb = opts;
            opts = text;
            text = canvas;
            canvas = void 0;
          }
        }
      } else {
        if (argsNum < 1) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 1) {
          text = canvas;
          canvas = opts = void 0;
        } else if (argsNum === 2 && !canvas.getContext) {
          opts = text;
          text = canvas;
          canvas = void 0;
        }
        return new Promise(function(resolve, reject) {
          try {
            const data = QRCode2.create(text, opts);
            resolve(renderFunc(data, canvas, opts));
          } catch (e) {
            reject(e);
          }
        });
      }
      try {
        const data = QRCode2.create(text, opts);
        cb(null, renderFunc(data, canvas, opts));
      } catch (e) {
        cb(e);
      }
    }
    exports.create = QRCode2.create;
    exports.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
    exports.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL);
    exports.toString = renderCanvas.bind(null, function(data, _, opts) {
      return SvgRenderer.render(data, opts);
    });
  }
});

// node_modules/@rainbow-me/rainbowkit/dist/chunk-DQLAW7KN.js
var systemFontStack = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
var fontStacks = {
  rounded: `SFRounded, ui-rounded, "SF Pro Rounded", ${systemFontStack}`,
  system: systemFontStack
};
var radiusScales = {
  large: {
    actionButton: "9999px",
    connectButton: "12px",
    modal: "24px",
    modalMobile: "28px"
  },
  medium: {
    actionButton: "10px",
    connectButton: "8px",
    modal: "16px",
    modalMobile: "18px"
  },
  none: {
    actionButton: "0px",
    connectButton: "0px",
    modal: "0px",
    modalMobile: "0px"
  },
  small: {
    actionButton: "4px",
    connectButton: "4px",
    modal: "8px",
    modalMobile: "8px"
  }
};
var blurs = {
  large: {
    modalOverlay: "blur(20px)"
  },
  none: {
    modalOverlay: "blur(0px)"
  },
  small: {
    modalOverlay: "blur(4px)"
  }
};
var baseTheme = ({
  borderRadius = "large",
  fontStack = "rounded",
  overlayBlur = "none"
}) => ({
  blurs: {
    modalOverlay: blurs[overlayBlur].modalOverlay
  },
  fonts: {
    body: fontStacks[fontStack]
  },
  radii: {
    actionButton: radiusScales[borderRadius].actionButton,
    connectButton: radiusScales[borderRadius].connectButton,
    menuButton: radiusScales[borderRadius].connectButton,
    modal: radiusScales[borderRadius].modal,
    modalMobile: radiusScales[borderRadius].modalMobile
  }
});

// node_modules/@rainbow-me/rainbowkit/dist/chunk-RZWDCITT.js
var darkGrey = "#1A1B1F";
var accentColors = {
  blue: { accentColor: "#3898FF", accentColorForeground: "#FFF" },
  green: { accentColor: "#4BD166", accentColorForeground: darkGrey },
  orange: { accentColor: "#FF983D", accentColorForeground: darkGrey },
  pink: { accentColor: "#FF7AB8", accentColorForeground: darkGrey },
  purple: { accentColor: "#7A70FF", accentColorForeground: "#FFF" },
  red: { accentColor: "#FF6257", accentColorForeground: "#FFF" }
};
var defaultAccentColor = accentColors.blue;
var darkTheme = ({
  accentColor = defaultAccentColor.accentColor,
  accentColorForeground = defaultAccentColor.accentColorForeground,
  ...baseThemeOptions
} = {}) => ({
  ...baseTheme(baseThemeOptions),
  colors: {
    accentColor,
    accentColorForeground,
    actionButtonBorder: "rgba(255, 255, 255, 0.04)",
    actionButtonBorderMobile: "rgba(255, 255, 255, 0.08)",
    actionButtonSecondaryBackground: "rgba(255, 255, 255, 0.08)",
    closeButton: "rgba(224, 232, 255, 0.6)",
    closeButtonBackground: "rgba(255, 255, 255, 0.08)",
    connectButtonBackground: darkGrey,
    connectButtonBackgroundError: "#FF494A",
    connectButtonInnerBackground: "linear-gradient(0deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.15))",
    connectButtonText: "#FFF",
    connectButtonTextError: "#FFF",
    connectionIndicator: "#30E000",
    downloadBottomCardBackground: "linear-gradient(126deg, rgba(0, 0, 0, 0) 9.49%, rgba(120, 120, 120, 0.2) 71.04%), #1A1B1F",
    downloadTopCardBackground: "linear-gradient(126deg, rgba(120, 120, 120, 0.2) 9.49%, rgba(0, 0, 0, 0) 71.04%), #1A1B1F",
    error: "#FF494A",
    generalBorder: "rgba(255, 255, 255, 0.08)",
    generalBorderDim: "rgba(255, 255, 255, 0.04)",
    menuItemBackground: "rgba(224, 232, 255, 0.1)",
    modalBackdrop: "rgba(0, 0, 0, 0.5)",
    modalBackground: "#1A1B1F",
    modalBorder: "rgba(255, 255, 255, 0.08)",
    modalText: "#FFF",
    modalTextDim: "rgba(224, 232, 255, 0.3)",
    modalTextSecondary: "rgba(255, 255, 255, 0.6)",
    profileAction: "rgba(224, 232, 255, 0.1)",
    profileActionHover: "rgba(224, 232, 255, 0.2)",
    profileForeground: "rgba(224, 232, 255, 0.05)",
    selectedOptionBorder: "rgba(224, 232, 255, 0.1)",
    standby: "#FFD641"
  },
  shadows: {
    connectButton: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    dialog: "0px 8px 32px rgba(0, 0, 0, 0.32)",
    profileDetailsAction: "0px 2px 6px rgba(37, 41, 46, 0.04)",
    selectedOption: "0px 2px 6px rgba(0, 0, 0, 0.24)",
    selectedWallet: "0px 2px 6px rgba(0, 0, 0, 0.24)",
    walletLogo: "0px 2px 16px rgba(0, 0, 0, 0.16)"
  }
});
darkTheme.accentColors = accentColors;

// node_modules/@rainbow-me/rainbowkit/dist/chunk-72HZGUJA.js
var accentColors2 = {
  blue: { accentColor: "#0E76FD", accentColorForeground: "#FFF" },
  green: { accentColor: "#1DB847", accentColorForeground: "#FFF" },
  orange: { accentColor: "#FF801F", accentColorForeground: "#FFF" },
  pink: { accentColor: "#FF5CA0", accentColorForeground: "#FFF" },
  purple: { accentColor: "#5F5AFA", accentColorForeground: "#FFF" },
  red: { accentColor: "#FA423C", accentColorForeground: "#FFF" }
};
var defaultAccentColor2 = accentColors2.blue;
var lightTheme = ({
  accentColor = defaultAccentColor2.accentColor,
  accentColorForeground = defaultAccentColor2.accentColorForeground,
  ...baseThemeOptions
} = {}) => ({
  ...baseTheme(baseThemeOptions),
  colors: {
    accentColor,
    accentColorForeground,
    actionButtonBorder: "rgba(0, 0, 0, 0.04)",
    actionButtonBorderMobile: "rgba(0, 0, 0, 0.06)",
    actionButtonSecondaryBackground: "rgba(0, 0, 0, 0.06)",
    closeButton: "rgba(60, 66, 66, 0.8)",
    closeButtonBackground: "rgba(0, 0, 0, 0.06)",
    connectButtonBackground: "#FFF",
    connectButtonBackgroundError: "#FF494A",
    connectButtonInnerBackground: "linear-gradient(0deg, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.06))",
    connectButtonText: "#25292E",
    connectButtonTextError: "#FFF",
    connectionIndicator: "#30E000",
    downloadBottomCardBackground: "linear-gradient(126deg, rgba(255, 255, 255, 0) 9.49%, rgba(171, 171, 171, 0.04) 71.04%), #FFFFFF",
    downloadTopCardBackground: "linear-gradient(126deg, rgba(171, 171, 171, 0.2) 9.49%, rgba(255, 255, 255, 0) 71.04%), #FFFFFF",
    error: "#FF494A",
    generalBorder: "rgba(0, 0, 0, 0.06)",
    generalBorderDim: "rgba(0, 0, 0, 0.03)",
    menuItemBackground: "rgba(60, 66, 66, 0.1)",
    modalBackdrop: "rgba(0, 0, 0, 0.3)",
    modalBackground: "#FFF",
    modalBorder: "transparent",
    modalText: "#25292E",
    modalTextDim: "rgba(60, 66, 66, 0.3)",
    modalTextSecondary: "rgba(60, 66, 66, 0.6)",
    profileAction: "#FFF",
    profileActionHover: "rgba(255, 255, 255, 0.5)",
    profileForeground: "rgba(60, 66, 66, 0.06)",
    selectedOptionBorder: "rgba(60, 66, 66, 0.1)",
    standby: "#FFD641"
  },
  shadows: {
    connectButton: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    dialog: "0px 8px 32px rgba(0, 0, 0, 0.32)",
    profileDetailsAction: "0px 2px 6px rgba(37, 41, 46, 0.04)",
    selectedOption: "0px 2px 6px rgba(0, 0, 0, 0.24)",
    selectedWallet: "0px 2px 6px rgba(0, 0, 0, 0.12)",
    walletLogo: "0px 2px 16px rgba(0, 0, 0, 0.16)"
  }
});
lightTheme.accentColors = accentColors2;

// node_modules/@rainbow-me/rainbowkit/dist/chunk-7ZP3ENJ2.js
var accentColors3 = {
  blue: { accentColor: "#3898FF", accentColorForeground: "#FFF" },
  green: { accentColor: "#4BD166", accentColorForeground: "#000" },
  orange: { accentColor: "#FF983D", accentColorForeground: "#000" },
  pink: { accentColor: "#FF7AB8", accentColorForeground: "#000" },
  purple: { accentColor: "#7A70FF", accentColorForeground: "#FFF" },
  red: { accentColor: "#FF6257", accentColorForeground: "#FFF" }
};
var defaultAccentColor3 = accentColors3.blue;
var midnightTheme = ({
  accentColor = defaultAccentColor3.accentColor,
  accentColorForeground = defaultAccentColor3.accentColorForeground,
  ...baseThemeOptions
} = {}) => ({
  ...baseTheme(baseThemeOptions),
  colors: {
    accentColor,
    accentColorForeground,
    actionButtonBorder: "rgba(255, 255, 255, 0.04)",
    actionButtonBorderMobile: "rgba(255, 255, 255, 0.1)",
    actionButtonSecondaryBackground: "rgba(255, 255, 255, 0.08)",
    closeButton: "rgba(255, 255, 255, 0.7)",
    closeButtonBackground: "rgba(255, 255, 255, 0.08)",
    connectButtonBackground: "#000",
    connectButtonBackgroundError: "#FF494A",
    connectButtonInnerBackground: "linear-gradient(0deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.12))",
    connectButtonText: "#FFF",
    connectButtonTextError: "#FFF",
    connectionIndicator: "#30E000",
    downloadBottomCardBackground: "linear-gradient(126deg, rgba(0, 0, 0, 0) 9.49%, rgba(120, 120, 120, 0.1) 71.04%), #050505",
    downloadTopCardBackground: "linear-gradient(126deg, rgba(120, 120, 120, 0.1) 9.49%, rgba(0, 0, 0, 0) 71.04%), #050505",
    error: "#FF494A",
    generalBorder: "rgba(255, 255, 255, 0.08)",
    generalBorderDim: "rgba(255, 255, 255, 0.04)",
    menuItemBackground: "rgba(255, 255, 255, 0.08)",
    modalBackdrop: "rgba(0, 0, 0, 0.7)",
    modalBackground: "#000",
    modalBorder: "rgba(255, 255, 255, 0.08)",
    modalText: "#FFF",
    modalTextDim: "rgba(255, 255, 255, 0.2)",
    modalTextSecondary: "rgba(255, 255, 255, 0.6)",
    profileAction: "rgba(255, 255, 255, 0.1)",
    profileActionHover: "rgba(255, 255, 255, 0.2)",
    profileForeground: "rgba(255, 255, 255, 0.06)",
    selectedOptionBorder: "rgba(224, 232, 255, 0.1)",
    standby: "#FFD641"
  },
  shadows: {
    connectButton: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    dialog: "0px 8px 32px rgba(0, 0, 0, 0.32)",
    profileDetailsAction: "0px 2px 6px rgba(37, 41, 46, 0.04)",
    selectedOption: "0px 2px 6px rgba(0, 0, 0, 0.24)",
    selectedWallet: "0px 2px 6px rgba(0, 0, 0, 0.24)",
    walletLogo: "0px 2px 16px rgba(0, 0, 0, 0.16)"
  }
});
midnightTheme.accentColors = accentColors3;

// node_modules/@rainbow-me/rainbowkit/dist/index.js
var import_react4 = __toESM(require_react());

// node_modules/@vanilla-extract/css/functionSerializer/dist/vanilla-extract-css-functionSerializer.browser.esm.js
function addFunctionSerializer(target, recipe) {
  Object.defineProperty(target, "__recipe__", {
    value: recipe,
    writable: false
  });
  return target;
}

// node_modules/@vanilla-extract/css/recipe/dist/vanilla-extract-css-recipe.browser.esm.js
var addRecipe = addFunctionSerializer;

// node_modules/@vanilla-extract/sprinkles/createUtils/dist/vanilla-extract-sprinkles-createUtils.esm.js
function createNormalizeValueFn(properties) {
  var {
    conditions
  } = properties;
  if (!conditions) {
    throw new Error("Styles have no conditions");
  }
  function normalizeValue(value) {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      if (!conditions.defaultCondition) {
        throw new Error("No default condition");
      }
      return {
        [conditions.defaultCondition]: value
      };
    }
    if (Array.isArray(value)) {
      if (!("responsiveArray" in conditions)) {
        throw new Error("Responsive arrays are not supported");
      }
      var returnValue = {};
      for (var index2 in conditions.responsiveArray) {
        if (value[index2] != null) {
          returnValue[conditions.responsiveArray[index2]] = value[index2];
        }
      }
      return returnValue;
    }
    return value;
  }
  return addRecipe(normalizeValue, {
    importPath: "@vanilla-extract/sprinkles/createUtils",
    importName: "createNormalizeValueFn",
    args: [{
      conditions: properties.conditions
    }]
  });
}
function createMapValueFn(properties) {
  var {
    conditions
  } = properties;
  if (!conditions) {
    throw new Error("Styles have no conditions");
  }
  var normalizeValue = createNormalizeValueFn(properties);
  function mapValue(value, mapFn) {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      if (!conditions.defaultCondition) {
        throw new Error("No default condition");
      }
      return mapFn(value, conditions.defaultCondition);
    }
    var normalizedObject = Array.isArray(value) ? normalizeValue(value) : value;
    var mappedObject = {};
    for (var _key in normalizedObject) {
      if (normalizedObject[_key] != null) {
        mappedObject[_key] = mapFn(normalizedObject[_key], _key);
      }
    }
    return mappedObject;
  }
  return addRecipe(mapValue, {
    importPath: "@vanilla-extract/sprinkles/createUtils",
    importName: "createMapValueFn",
    args: [{
      conditions: properties.conditions
    }]
  });
}

// node_modules/@vanilla-extract/sprinkles/dist/createSprinkles-74286718.esm.js
function toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == typeof i ? i : String(i);
}
function _defineProperty(obj, key, value) {
  key = toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
var createSprinkles = (composeStyles2) => function() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  var sprinklesStyles = Object.assign({}, ...args.map((a) => a.styles));
  var sprinklesKeys = Object.keys(sprinklesStyles);
  var shorthandNames = sprinklesKeys.filter((property) => "mappings" in sprinklesStyles[property]);
  var sprinklesFn = (props) => {
    var classNames = [];
    var shorthands = {};
    var nonShorthands = _objectSpread2({}, props);
    var hasShorthands = false;
    for (var shorthand of shorthandNames) {
      var value = props[shorthand];
      if (value != null) {
        var sprinkle = sprinklesStyles[shorthand];
        hasShorthands = true;
        for (var propMapping of sprinkle.mappings) {
          shorthands[propMapping] = value;
          if (nonShorthands[propMapping] == null) {
            delete nonShorthands[propMapping];
          }
        }
      }
    }
    var finalProps = hasShorthands ? _objectSpread2(_objectSpread2({}, shorthands), nonShorthands) : props;
    var _loop = function _loop2() {
      var propValue = finalProps[prop];
      var sprinkle2 = sprinklesStyles[prop];
      try {
        if (sprinkle2.mappings) {
          return 1;
        }
        if (typeof propValue === "string" || typeof propValue === "number") {
          if (true) {
            if (!sprinkle2.values[propValue].defaultClass) {
              throw new Error();
            }
          }
          classNames.push(sprinkle2.values[propValue].defaultClass);
        } else if (Array.isArray(propValue)) {
          for (var responsiveIndex = 0; responsiveIndex < propValue.length; responsiveIndex++) {
            var responsiveValue = propValue[responsiveIndex];
            if (responsiveValue != null) {
              var conditionName = sprinkle2.responsiveArray[responsiveIndex];
              if (true) {
                if (!sprinkle2.values[responsiveValue].conditions[conditionName]) {
                  throw new Error();
                }
              }
              classNames.push(sprinkle2.values[responsiveValue].conditions[conditionName]);
            }
          }
        } else {
          for (var _conditionName in propValue) {
            var _value = propValue[_conditionName];
            if (_value != null) {
              if (true) {
                if (!sprinkle2.values[_value].conditions[_conditionName]) {
                  throw new Error();
                }
              }
              classNames.push(sprinkle2.values[_value].conditions[_conditionName]);
            }
          }
        }
      } catch (e) {
        if (true) {
          class SprinklesError extends Error {
            constructor(message) {
              super(message);
              this.name = "SprinklesError";
            }
          }
          var format6 = (v) => typeof v === "string" ? '"'.concat(v, '"') : v;
          var invalidPropValue = (prop2, value2, possibleValues) => {
            throw new SprinklesError('"'.concat(prop2, '" has no value ').concat(format6(value2), ". Possible values are ").concat(Object.keys(possibleValues).map(format6).join(", ")));
          };
          if (!sprinkle2) {
            throw new SprinklesError('"'.concat(prop, '" is not a valid sprinkle'));
          }
          if (typeof propValue === "string" || typeof propValue === "number") {
            if (!(propValue in sprinkle2.values)) {
              invalidPropValue(prop, propValue, sprinkle2.values);
            }
            if (!sprinkle2.values[propValue].defaultClass) {
              throw new SprinklesError('"'.concat(prop, '" has no default condition. You must specify which conditions to target explicitly. Possible options are ').concat(Object.keys(sprinkle2.values[propValue].conditions).map(format6).join(", ")));
            }
          }
          if (typeof propValue === "object") {
            if (!("conditions" in sprinkle2.values[Object.keys(sprinkle2.values)[0]])) {
              throw new SprinklesError('"'.concat(prop, '" is not a conditional property'));
            }
            if (Array.isArray(propValue)) {
              if (!("responsiveArray" in sprinkle2)) {
                throw new SprinklesError('"'.concat(prop, '" does not support responsive arrays'));
              }
              var breakpointCount = sprinkle2.responsiveArray.length;
              if (breakpointCount < propValue.length) {
                throw new SprinklesError('"'.concat(prop, '" only supports up to ').concat(breakpointCount, " breakpoints. You passed ").concat(propValue.length));
              }
              for (var _responsiveValue of propValue) {
                if (!sprinkle2.values[_responsiveValue]) {
                  invalidPropValue(prop, _responsiveValue, sprinkle2.values);
                }
              }
            } else {
              for (var _conditionName2 in propValue) {
                var _value2 = propValue[_conditionName2];
                if (_value2 != null) {
                  if (!sprinkle2.values[_value2]) {
                    invalidPropValue(prop, _value2, sprinkle2.values);
                  }
                  if (!sprinkle2.values[_value2].conditions[_conditionName2]) {
                    throw new SprinklesError('"'.concat(prop, '" has no condition named ').concat(format6(_conditionName2), ". Possible values are ").concat(Object.keys(sprinkle2.values[_value2].conditions).map(format6).join(", ")));
                  }
                }
              }
            }
          }
        }
        throw e;
      }
    };
    for (var prop in finalProps) {
      if (_loop()) continue;
    }
    return composeStyles2(classNames.join(" "));
  };
  return Object.assign(sprinklesFn, {
    properties: new Set(sprinklesKeys)
  });
};

// node_modules/@vanilla-extract/sprinkles/createRuntimeSprinkles/dist/vanilla-extract-sprinkles-createRuntimeSprinkles.esm.js
var composeStyles = (classList) => classList;
var createSprinkles2 = function createSprinkles3() {
  return createSprinkles(composeStyles)(...arguments);
};

// node_modules/@rainbow-me/rainbowkit/dist/index.js
var import_react5 = __toESM(require_react());
var import_react6 = __toESM(require_react());
var import_react7 = __toESM(require_react());
var import_react8 = __toESM(require_react());
var import_react9 = __toESM(require_react());
var import_react10 = __toESM(require_react());
var import_react11 = __toESM(require_react());
var import_react12 = __toESM(require_react());
var import_react13 = __toESM(require_react());
var import_react14 = __toESM(require_react());
var import_react15 = __toESM(require_react());
var import_react16 = __toESM(require_react());
var import_react17 = __toESM(require_react());
var import_react18 = __toESM(require_react());

// node_modules/ox/_esm/core/Ens.js
var Ens_exports = {};
__export(Ens_exports, {
  labelhash: () => labelhash,
  namehash: () => namehash,
  normalize: () => normalize3
});

// node_modules/@adraffy/ens-normalize/dist/index.mjs
var COMPRESSED$1 = "AEkU4AngDVgB0QKRAQYBOwDqATEAnwDbAIUApABsAOAAbwCRAEYAiQBPAHYAPgA+ACsANwAlAGMAHwAvACsAJQAWAC8AGwAiACIALwAUACsAEQAiAAsAGwARABcAGAA6ACkALAAsADUAFgAsABEAHQAhAA8AGwAdABUAFgAZAA0ADQAXABAAGQAUABIEqgYJAR4UFjfDBdMAsQCuPwFnAKUBA10jAK5/Ly8vLwE/pwUJ6/0HPwbkMQVXBVgAPSs5APa2EQbIwQuUCkEDyJ4zAsUKLwKOoQKG2D+Ob4kCxcsCg/IBH98JAPKtAUECLY0KP48A4wDiChUAF9S5yAwLPZ0EG3cA/QI5GL0P6wkGKekFBIFnDRsHLQCrAGmR76WcfwBbBpMjBukAGwA7DJMAWxVbqfu75wzbIM8IuykDsRQ7APcta6MAoX0YABcEJdcWAR0AuRnNBPoJIEw3CZcJiB4bVllM44NCABMADAAVAA5rVAAhAA4AR+4V2D3zOVjKleYuChAdX01YPewAEwAMABUADmsgXECXAMPrABsAOQzFABsVW6n7Adq4HB0FWwXiAtCfAsSwCkwcpGUUcxptTPUAuw1nAuEACy00iRfJkQKBewETGwC9DWcC4QALLQFIUCWRTAoDLfsFMgnXaRetAddDAEkrEncCMRYhAusnuTdrADnhAfUlAMcOy7UBG2OBALEFAAUAitNJBRvDHwcXAKgn0QGhKy0DmwBnAQoZPu03dAQYFwCqAccCIQDTKxJzOvNQsAWQOncnNUgF+icFWQVYr7gFaTtdQhI6WEGXe5NmX6H4CxMDxQcl8XcjBKNLAlNTAnUbqycBj6OlNVsDRRcEg2EJANEGqz8vIwcpAjldAGsBYR9xAIMdGQCVAUm3ACdpFwGvxQM3LSFDUwFvWQZlAmUA8UkXAykBBQBJQQCrAF0AcwArtQYH8+8ZjX8ACSEAKQCzG0cB0QHbBwsxl3iB6AAKABEANAA9ADgzd3nTwBBfEFwBTQlMbDoVCwKsD6YL5REVDNEqy9PYADSpB+sDUwfrA1MDUwfrB+sDUwfrA1MDUwNTA1McCvAa08AQXw9IBG0FjgWLBNYIgyZJEYEHKAjSVA10HhxHA0UA/CMlSRw7kzMLJUJMDE0DB/w2QmynfTgDRzGrVPWQogPLMk85bAEecRKgACoPcxw1tU5+ekdxoApLT661f0liTmcCvjqoP/gKIQmTb7t3TgY9EBcnoRDzDC8BsQE3DelL1ATtBjcExR95GRUPyZWYCKEt2QzpJt8unYBWI/EqfwXpS/A82QtJUWQPVQthCd86X4FKAx0BCSKHCtkNNQhpEO8KxWcN4RFBBzUD0UmWAKEG/QsNHTEVsSYMYqgLBTlzBvca8guLJqsTJXr4Bc8aHQZJASUa+wDLLuOFrFotXBhPWwX/CyEjwxSkUBwNIUCzeEQaFwcRJaUCjUNsSoNRMh6PIfI8OQ1iLg9ReAfxPAEZSwt9PJpGp0UKEc4+iT1EIkVMKAQxeywrJ4cJyw+BDLV8bgFVCR0JrQxtEy0REzfBCDUHFSmXICcRCB1GkWCWBPObA+8TzQMHBTsJPQcPA7EcKRMqFSUFCYEg0wLvNtEurwKLVnwBEwXHDyEf2xBMR9wO5QiXAmEDfyXnACkVHQATIpcIP18AW4/UUwEuxwjDamgjcANjFONdEW8HjQ5TB6McLxW7HN1wxF4HhgQon6sJVwFxCZUBWwTfCAU1V4ycID1nT4tUGJcgXUE7XfgCLQxhFZtEuYd0AocPZxIXATEBbwc1DP0CcxHpEWcQkQjnhgA1sTP0OiEESyF/IA0KIwNLbMoLIyb1DPRlAZ8SXgMINDl36menYLIgF/kHFTLBQVwh7QuOT8kMmBq9GD5UKhngB7sD7xrvJ+ZBUwX7A58POkkz6gS5C2UIhwk7AEUOnxMH0xhmCm2MzAEthwGzlQNTjX8Ca4sGMwcHAGMHgwV14QAZAqMInwABAMsDUwA1AqkHmQAVAIE9ATkDIysBHeECiwOPCC3HAZErAe8lBBe/DBEA8zNuRgLDrQKAZmaeBdlUAooCRTEBSSEEAUpDTQOrbd0A1wBHBg/bQwERp0bHFt8/AdtrJwDDAPcAATEHAT0ByQHvaQCzAVsLLQmer7EBSeUlAH8AEWcB0wKFANkAMQB77QFPAEkFVfUFzwJLRQENLRQnU10BtwMbAS8BCQB1BseJocUDGwRpB88CEBcV3QLvKgexAyLbE8lCwQK92lEAMhIKNAq1CrQfX/NcLwItbj1MAAofpD7DP0oFTTtPO1Q7TztUO087VDtPO1Q7TztUA5O73rveCmhfQWHnDKIN0ETEOkUT12BNYC4TxC2zFL0VyiVSGTkauCcBJeBVBQ8ALc9mLAgoNHEXuAA7KWSDPWOCHiwKRxzjU41U9C0XAK1LnjOrDagbEUQ8BUN16WImFgoKHgJkfQJiPldJq1c3HAKh8wJolAJmBQKfgDgXBwJmNwJmIgRqBHsDfw8Dfo45AjlzEzl+Oh8fAmwZAjIyOAYCbcMCbarrhi9jQScBYwDaAN0ARgEHlAyJAPoHvgAJsQJ3KwJ2njsCeUc/Ani2GVjXRapG0wJ8OwJ6xAJ9BQJ87AVVBRxH/Eh5XyAAJxFJVEpXERNKyALQ/QLQyEsjA4hLA4fiRMGRLgLynVz/AwOqS8pMKSHLTUhNqwKLOwKK1L0XAxk/YwGzAo4zAo5YPJN9Ao7VAo5YdFGwUzEGUtBUgQKT9wKTCADlABhVGlWrVcwCLBcpkYIy3XhiRTc1ApebAu+uWB2kAFUhApaLApZ4mAClWahaBX1JADcClrEClkpcQFzNApnHAplgXMZdAxUCnJc5vjqZApwSAp+XAp60hgAZCy0mCwKd7QKejgCxOWEwYesCns8CoGoBpQKemxsCnkqhY8RkIyEnAierAiZ6AqD3AqBIAqLZAqHAAqYrAqXKAqf7AHkCp+5oeGit/0VqGGrNAqzfAqyqAq1jAqz+AlcZAlXYArHd0wMfSmyTArK5CQKy5BNs3G1fbURbAyXJArZYNztujAMpQQK4WgK5QxECuSZzcDJw3QK9FQK71nCSAzINAr6Ecf4DM20CvhZzHnNLAsPHAsMAc350RzFBdNwDPKMDPJYDPbsCxXgCxkMCxgyFAshlTQLIQALJSwLJKgJkmQLdznh1XXiqeSFLzAMYn2b+AmHwGe+VIHsHXo5etw0Cz2cCz2grR0/O7w+bAMKpAs9vASXmA04OfkcBAtwjAtuGAtJLA1JYA1NbAP0DVYiAhTvHEulcQYIYgs+CyoOJAtrDAtnahAyERac4A4ahACsDZAqGbVX1AFEC32EC3rRvcwLiK+0QAfMsIwH0lwHyzoMC6+8C6Wx1Aur1AurgAPVDAbUC7oUC65iWppb/Au47A4XcmHVw3HGdAvL/AGUDjhKZjwL3DwORagOSgwL3lAL51QL4YpoYmqe3M5saA51/Av72ARcANZ8Yn68DBYkDpmYDptUAzcEDBmahhKIBBQMMRQELARsHaQZdtWMBALcEZ7sNhx6vCQATcTUAHwMvEkkDhXsBXyMdAIzrAB0A5p8Dm40IswYbn8EApwURu+kdPT4WeAVoNz5AK0IhQrRfcRFfvACWxQUyAJBMGZu5OyZgMhG6zw4vGMYYicn2BVcFWAVXBVgFYwVYBVcFWAVXBVgFVwVYBVcFWEYVCNeFZwICAgpkXukrBMkDsQYvu7sAuwSnuwDnQCkWsgVGPmk+cEI/QrZfdTdf6ABYETOrAIz+zGvL/KbnRno9JiMEKxYnNjV+bd9qwfEZwixpAWvXbjAXBV8FasnBybgIz0lbAAAACnxefYu+ADM/gQADFtEG5a0jBQCMwwsDAQ0A5WUdPSQfSkKxQrxBOCNfJ2A2JzgjCcE9CkQ/Qz54PoE+cD5xAolCvElCO1/LTk9qTQosa1QvagtuH1/gMzobCWebCmIjKzwdJkKrQrwrzAHL/F/JDh8uCQgJIn6d32o6LUoXyavJrAllwcvMCmBBXw/lEKMRAJONHUVCJRupbTnOOAozP0M+cEI/HAcKHUxHbFssLVrhvBIKfe0dK0I/HF0ISgkOM1RDQjcEO0OcLAqBGy1CPxv1CFMiIxgwMQAFj2HwXgpxZMlgC2AtI25DYBk5AhseYLMGAmsQZU5gTREBZOdgFWCVYH1gs2BLYJFoFhcGtQ7cVam8WgtDFqsBuyvNwQIfFQAcAx4BeQJsLzCVUoABigq4RxoA5CN0jgrKDaZN6gGbAoecTwVAXwD39wkANBZXDAulDCQfuq9HAE8MNAAVE58rggh6AtILS2URGwDYTgZ1BAoeWgAxALa4AZonCxZvqyQ4nxkBWwGGCfwD2e0PBqoGSga5AB3LValaCbthE4kLLT8OuwG7ASICR1ooKCggHh8hLBImBiEMjQBUAm5XkEmVAW4fD3FHAdN1D85RIBmpsE3qBxEFTF8A9/cKAHoGJGwKKwulODAtx69WDQsAX7wLAGNAlQh6AOpN7yIbvwAxALa4AZonLTsOzgKQGHtQu1jIdHKO16WbDvWZFT0b7AEpEFwSBg8bAccJOhCTBRArDDYLABEAs84BAgCkAOEAmIIABWtXLwAUAFsbxi5sdioNwRACOyQz0+EcHgsbfQJ7Ls6hHATBCqrxbAA3OS0Opge7CQAQOi7OERkAfavaHA+7GkcczaF3HgE9Kl8cAuugCAHCAULz5B9lAb4Jtwz6CDwKPgAFwAs9AksNuwi8DTwKvC7OoSoJPA67BZgBG2sKD4sa4QHDARELuxY7AKALOxC7BBige9wAO2sMPAACpgm8BRvQ9QUBvgH6bsoGewAHuwG7D00RErwBAQDqAQAAdBVbBhbLFPxvF7sYOwAuuwLrDlaouwAeuwJVICp/AAG7AALjAAg7FTwVuwAbuwG9KOClWw6/xAD0AGj7L7ZtvgNIo7vIqDsDAbuVJ0sAAlsACrsEAOfdGbsIGnsIoQUK/3AA37unuxjbGruji3lyBvupm4MAErsGGwsBvAAAhgBtuwYAC7unOwEaO7oIoZzKAbsL7QfAqTsA4XsBvwAA5QAVuwAG+wAJuwBpiwAauwAOuwIYu45pFfsAAVsADmsALkseAAa7ABe7CCEADUoBwgC3ryYBwAAAtAAOmwG+J+QAsloAHBsBv/7hCqEABcYLFRXbAAebAEK7AQIAabsAC3sAHbsACLsJoQAFygBunxnVAJEIIQAFygABOwAH2wAdmwghAAaaAAl7ABsrAG0bAOa7gAAIWwAUuwkhAAbKAOOLAAk7C6EOxPtfAAc7AG6cQEgARwADOwAJrQM3AAcbABl7Abv/Aab7AAobAAo7AAn7p+sGuwAJGwADCwAQOwAAFDsAEWsAD4sADesADbsAGQsGFhsAFTsAbpsWswG7ALoAEzsDAGkrCgDhSwACOwAEUgAXewUbAAbQABi7AAv7AF+7AGv7AOSLAbsAF3YBvAABcguhAAVKHgF7KFIAOUUA/gcNDHIAKCpwAaQFCF4BvF4jDAkHb0tsXyqJHzwUYi02A6EKtAHYABYC0QNuAXZyR1IUIQNPAhU+ASwGA3NGvHtSekAAKQAxAfsAUwrbAHuQLAErAHblDREyRgFKAFcFAAFQAQeKzAB4OwQgpQBaANYVAJVoNx+LAM1rsQDP1BYIwnVzGxhWHQnRAYiQqyJTU01IEjzCifkAfxw3QCkr4BGXTwByASksMClCGQ8DMFUE98XuAEtl3ABqAnECPxF6Osd4LjXVBgUAEBsdCggMKgQfHSlOU04IuboAChLNACYAARoAhgCJAI41AO4AtADgAJ08ALsAqwCmAKEA8gCfANMAnADrAQwBBwDAAHkAWgDLAM0BBwDXAOsAiACiATUA4wDYANUDAQcqM9TU1NS2wNzN0M5DMhcBTQFXL0cBVQFkAWMBVgFHS0NFaA0BThUHCAMyNgwHACINJCYpLDg6Oj09PT4/DkAeUVFRUVNTUlMpVFVXVlYcXWFhYGJhI2ZocG9ycnJycnJ0dHR0dHR0dHR0dHZ2d3Z1WwBA7ABFAJYAdAAuAGLyAIoAUwBTADMCc+kAh//y8gBgAI/sAJsASwBeAGD5+aoAgQCBAGUAUgCtAB4AsgB/AjwCPwD4AOMA+gD6AOQA+wDlAOUA5ADiACkCdwFNATwBOgFQAToBOgE6ATUBNAE0ATQBGAFUDwArCAAATRcKFgMVFg4AigCSAKIASwBkGAItAHAAaQCRAxIDJCoDHkE+RykAiwJLAMMCUwKgALoCkgKSApICkgKSApIChwKSApICkgKSApICkgKRApEClAKcApMCkgKSApACkAKQApACjgKRAnEB0AKTApsCkgKSApEWeQsA+gUDpwJdAjYXAVAQNQLeEQorEwFKNxNNkQF3pDwBZVkA/wM9RwEAAJMpHhiPagApYABpAC4AiQOUzIvwroRaBborDsIRAZ3VdCoLBCMxbAEzWmwBsgDdfoB/foB+gYKCfoOGhH6FiIaAh4KIgol+in6LfoyKjX6Ofo+CkH6RfpJ+k36Ug5WIloKXftoC2WzhAtdsAIJsJGygAINsbARCBD8EQQREBEIESARFBEAERgRIBEcEQwRFBEgAlmZsAKMDh2wAtGYBBWwAyVFsbADPbAIMbAD2WmwA9gEZAPYA9AD0APUA9AN8XmzUhCNlvwD2APQA9AD1APQcbGwAiVpsAPYAiQEZAPYAiQLsAPYAiQN8XmzUhCNlvxxsAPdabAEZAPYA9gD0APQA9QD0APcA9AD0APUA9AN8XmzUhCNlvxxsbACJWmwBGQD2AIkA9gCJAuwA9gCJA3xebNSEI2W/HGwCQwE2bAJKATlsAkvBbGwCV2xsA54C7AOeA54DnwOfA58DnwN8XmzUhCNlvxxsbACJWmwBGQOeAIkDngCJAuwDngCJA3xebNSEI2W/HGwEN2wAiQQ4AIkGjTFtIC9s1m4DJmwA/QDGWgJsbABVWv4UMgJsbACJAmwAVAEAuV5sAmxebGwAiV5sAmxebD3YAEls1gJsbEZFNiJ9FGVAe8xvEZKvxVfKZszAVTBzYBH2d1iyUXEHH7twNw7eZF5JJRHI5EgaRr5D20/3dfONrFLSq5qSrrgd2CEUq722WBQ/LzpA+bx1oREI5xy4BDSZNun0ZWORUJqInZSyMaioyvfSI0l5uFDzbWaQ28/zdB0hwR4OQZ0/jn9ALSLNikjFYGfqR389qtFlhD3a6KdIh97rhZYpywuLc7o8ql5/X8KCbPU3L/QlmCowhRXhsGDvg6wUNprA9bM/49uxlAj7ZVy3ouEY/BgFXBNyK0TLrSjZWeJm/T4nz6QGLT3cJNtWRZVZTvIdtaxMMJRHgig9+S11LjBh7Inr06ykoch1U097Rw0hvgmOrydQyaWcEQDg0RavuMuT0zYabUZl1e33HNSK1oNUCS03eh+9C2EvF3fq9h+XBaAMFuoWeZf+mfZgL4HzyiKDIUtfNU4oFu0aE9qt3VA3U4D3fOSrAcYVnjG3cSkp1vhXZnp3JQm4JknKdBitO2NVnGCYQwU3YMWHWB87NEd+4AHuOKI8BSIH92reW0pfs+kWCTJxDCbRjFv8Cfc4/DSBYJScJYTeAEgg9wTEvcwd/QuHRHqGzAQ4fXf5FUI1lPrO+fvEcPl4JInM1z9AtBT2bL4QYEREe7KiSnnxTwtmAFjn8lqT3mND8qTktX2F16Ae9cakqJ6/pEQsHURqyqWlRMCzKXRKfCHT7sYHWx9/T/ugYTFY6iVN3Btm58ATJR5alYZybKMWojwOw3HbFn23NFyeLl7+Er82RchyYuBoGQ3j7SAWNxiYvp5U+Fq/DEzB9cG5DlJWsqkosRze92OVlCtQEYo1S1lF72Z8xWc4ld/+fFcfTEDTFb9d8tJGQ75dpJEvcWyGmGBiTbiWDdGOcw93Dmxq5ISUrmasygONfHLvhgo83HQZenbdBtSzBkvYrCEQ/xEDMhMZsN6gqplx5jGG9mSQLhM81UEdEeJ59sdNJDAFy/gPyJoKlwPZgB/MkC/kICLiCB8va+nCdO2ry4aDfkmPFpF/H/SGQ3LJ6aAv9dtJ8DniHtLOckZix0BVb0iR5V3LAp521LBSIi6AtV7r2ZB/hQEvAw54EFNOQcFnl1xGUIc67tqK1INNwD2n/RbwgzO9h45LM6VMuN8V1ZNIQ6t+Xy3lTqyVCD5kqLy/t3/b8MLbgDg8JIWDkSZ+LrGhhr+gYpH+pr1TnCUnZPjpUdw6bSL6MWVXoDDciQDWECwU2e6VEpfrcOBbrSOijqGkEIoJPbpmeJLkcwbvA0yWIixQVjo0HnYh7fji+Dfdq1mtV1lG2Zz9R7eFMHS+FK7nybutu2fwzDpFldO2pZBshsHJWaltn3PWOoGJpCT2jE8EHOuC6FkejNWcfsWCqNqMLP9xTwcWArj2EiiI7D+EaDi7/2cqHL1gPiF6C/J7aUo7RQqogPZ11WqbyP97nsoMxPOC78wZMF7B1Y0g7JNXJV/nN1m4xx8hbqWz07KSaqr5hE4icB326DMR/vUKX9LoNjle/ZWtbUhrTAcsdgrLlG5Ne8aiR0bS/2ZhpNOVVxavWIZsEM/rd68EB4vjbbD13NkMK1qvMk74vGbSkL7ULO0sZ9R6APSCo6KH+Xn98wEdw1bCPAnDTaBsD6sidAGN58uiH4a3ovG1KyZAu2XtyGgF/vgWKGxw9R1lfAVcfuYE71DHuxtTzfGZnHaDpDGWmfEq0N4GawE7yIkaoz8jcmVmzJe1ydM8q0p08YIxFcY1YcqQc1djWBEoNETDFcgk5waRftEJasPREkrV++N/TOKkERF1fCLrXS8DFGYGRBeECMQRNEs0ES3FzUtXCcNxpYEM3Uei6XodZruXUIRnn+UXf2b/r7n1vQutoi6WoIbW7svDNWBbUWcDUc7F9SJK3bvSy9KIqhgyJHoW2Kpvv0J4ob14HFXGWWVsYXJzjwxS+SADShTgCRjhoDgjAYRGxwJ1Vonw+cpnCKhz8NQPrb0SFxHIRbmG95Q2hlC4mDxvPBRbkFa60cvWakd7f0kVBxxktzZ9agPJEWyA63RSHYVqt8cPrs2uFJ3rS3k9ETGKn5+A6F9IOrdZHfT1biEyUJKEvwzuscwshGCBJvd16TrefW03xVnJf4xvs72PdxrMidjJO8EiWyN/VWyB3fv9kc34YIuZTFtXGo9DuG3H1Uka5FgBMwDPEvRcSabi3WakNQkXFecJlFk6buLVk5YHpuKWTw6oF632FPPSVIVl5hgUAeHhj0t/sw/PEEvThLQDDFE34eCg/rLOyXT3r+L98oRKrlTO0MdALYQ3rRQqC7d822dJPGxF1K4J2TtfPSMFaCAg0n0NGk9yiaKKOJD1v2aBX9HUOIawjjfvwCmjHZJTR62R9c9x33JnBjWrN4QYEOmehy0oZMP9XM9Zyi6TYoe07PaLceRXcCWZiY/imRUWW6+mci7+wMxSdwMdbXckXtvhJH8sc4iQcTwm7yp+3f7CaesTTQB2qkgeXh+wFiSMXfMlH7Yil0OoZ2QTtRLTip2O0cLZ4SstqWHZ6H+8A2kZXhpm0kPbL9dUanTOvziqIUh6Ambwa3WrCb2eWbuCN3L1hgWUmjRC3JoL3dBhR3imSQI8xuCMfsszlji7cSShNSYdqCXPxEVwbqO9i5B6hf93YI7aeyI8jxgcVXK0I/klbvhSXjkjOIwZgPdVwmsFW7HGPLUAvDRuKm+itybRg7c8+Yqqjg824Qf+/NxsBSUNAK9KCoJpauFqK0XQULrWYj4FnxeKDuvr54iokpi+D57e6Y1zxRJJdsHnDR3JyraCUufHBRTKODWBVzthjm4k3/Hv+Q990XDVR+KW+TcJX045LW86EKhz/97aqj89A8ZvTk1//tczosU90loIPVaHuWegJU3wP//7XHcO7c0yQM2jM/IhQKrf8hiObHWiWDZManF8Uf/HzbmDfC2wT//aiZ4hGTv/xzgKwdb1sD6cGEkceow0s3b89/zg+3plyRm0HlZi886j5wUwFhdHiDTaBidZRo5cx/tMeLyguOATbzq17ydhzbrpxunuHx6lbFGiO97gsd4dk//7iCIo+Ew+hG2so5kvv+ITG4c1fzHPtu1Xn5QfUnqY3/uByVmB7gmnE/E+5zdm+6nDmoews5fr+NzThdSHzK4bBQOL9c4O8OI0xLSqjJ4lbniLJg1aFpQRLwaSMZmpkC9e/j6FOVrTQ6a/a4alGgfrl2ZL1sbHUQ3DOI7ntq9diHFfm3t1mul3rdJEJCHnlW/hlQntipMrpeMs7fUr6wK370D7VbXH0DUHzdYfRg/6Z11Ult1sffJS+heHbco15Sxy3+rDnPesqH1lajk0yu02hPUvEUqvcUXWXL7Ad0wNGMx5gOle4XJxq/r/YY0xdco2wRSEGwcT7YADlBrHc9ZbvzOL0QwyWCWWChB9Obg800v7tyBWaNvdwz+fL7Ph9i2irEeJkRgOzeEDw+JiD/V93vH9FgMEoFIJMoIuogmicZohf94SBuPn6hXaV9jP4VVVA/bu+Wg8S88GLtmEPSNRLdtlXx2XL/nuM8nKkhnlnjaropiKKLIH94pLIASci0pDBfj9Hi5BfaTSXQg5+PMjQX91Ktk4MOqK1K99l4BRPv5+vNovGZ3IxQv8ICvjV4/diThpoaM8uvd3D9d/DE477w3yAbW3IDm2i73pZ9aEj38JqS6h/s8/xgmUIVcuq2JTgefAyuoafzQxAuRASeg3NtG3ach/JEkyuX+JDt2PnDZTShUhyHHG3ttBg/6lhAchGjLJBtopj4e01MlCp2yqQRTr4sBBXru+lKaoanwYX8y2aWCJiR3KnhCOkYVFSvsO0oDRujUFOEptiNDTYrJoUbvOyvl4AhC9h3wORiTXK1MrpMfnvdnndnR/HRVSusMBgIxwrLdn3vq1VcncPiD0SquTx/kNmxeFyCT4uXVUd9AL+rSGmuq7OOCzDKeVPjiNWVaoP5KOFqYq5Xcuf/xW9S+u9eIq9GAtZWtQlgkRecjRtvG1NR4WXXpn+pwsTBTIy079Ikg8rSef1aVapIFcXCd6C2wHVjLXR+N0tw4Taw6x6H90BFRgNrtlq2up6hHKuV3inM5RJaQWZHd84e6RsKkk9po3dk9by54tpPw7cBkFas/G+GbHwuG+AwP55BZyXILTHCIVrPpXHEaUPYfL6nphJP1Rc10xG4UaCeY4IHCwuur8xmSQDgY4aVwhzWhjbtSHG8JO6P2i2nC9/0Bfx0zk6dYQq3aw7k5vIObD7SEKrxhz0fQ0+YTOfHW23CBNeZci1qNsUDhoeqmfyP6PvjoEjHk8QbrFyQVZPHVWijnb8YCM65iYNoEbvnchStZ/9cKg5Vd45j8KnB6UjzXl/bkyZx7VoD47ocUUi117WwgySSb4rXgLJ52Mv5XJbp3I+uBP81BUvOjy4Cacgi+GWWlC/8dwgqwiojjUBDnEOxyRyowwLQfytFra1OZS4XvRYr4uoamAfG3I/p2bA7G90yqKThH8Ke00Tqd+3l3dmJpaCZelBMYjGqNLVa3SM4+LQeL56gY6Bymy2LQPVOxjWfj5tq4o74swcxhyGJPynkS5xAjOXZP1/FAYcBT3u6qLoIkEfErwo4gozmyI1YCvM0oyI3ghjGPQSsof2sKUhq91WsKy9cYWN+4A2v4pG/Mxpdc6w6kI/HX7Xb0TuihmsiOy2wQIsrZbUmr3OBSUo6oDJNgQp+YqYkgTgYcWZDgawJw3DFfdzT//PhVUidgB2qa8uw/j9ToHBAS33iT8YLhhAfyXG0bQUFp7QmH7oQ3i6Flf4OTZLvJdh8pfuflmWu2ohm5pTiSg1pl3vq9uluTJwqXfh1hqy8e2iHoD+Y35gCIViTo6VOtK5dD8HYClucJucXASzwe2kPj4S4eYQtmkYHagXhAzp/F541xE8YFYqSPszDuz3soWzHy0p3E2jwZNQaIcGU9FNQwQxeDw0ZlK9dxXrj9IUHGUPTOyib8CqXmbZ7Ex54bn1rLx3qqAavu/gh6XjV0GmN1p+yyMK9HN5uYEvxgbAk43tsheREhyI+Q5WLIneKTGPmYiM/lxOp8fvqHy8YgXK0TlMiX0tliLI2JtfmWZP8eVV732sdYm+pcWzDzEmKLJZyeelyaZKkjPnnUO9keDwtgiLnmd5+t+Sr5y8brRnlvxcWEWfCqIALQYHvaXx6jTg4dAlye469uGwwOZVZCILLfGjaMg4LUCNMTtMSp1aC2y/3wR2t1v3w/iNBRQ+bNbtDqL2NAr7K4rUcyqbSpNrXZgAWXvjxBBtfYLK1uRYt3q2pfXJOAL0HtWcEwJLddOSJKV1SwvcvEuzg/4MPnA8MIUJOLqm3qI6wFyN99Ck6zYaV/zGSAzF/PGsaNa4vPLe5QnyuqVUnVQ6xELA6gbe53aGgeke+R/ycb2LJVyc7BhuzI90zA+c6wUDTb7NH//gdDSl2u/aW7lRJm8m1fLtPxcNuEM5JbkOCZKPM88HUsLRoC1pmKKlvWyeAXuxILbu0snpSxf8N+RgtLUSe5n2gdjOjoSTaN7mMZ7bF+cWk/MS8mFD4pcyl5UN7CbpFZH2a+Pm1VAnUTVfbw8qrmz1G9m5aKmRzY1SMhhPrlCn2t4uNUXNA3IFe6NOjSC1DEaAFZAfDlEkQCsbNhsZPj6NQPDSB3tLiTo0ZYoEbIeEIaKtU3Wk60rEszawTFuyHVd365LA/c/uarABN5M5rGq/dqTG3Ilye/5EKiYisisuzqNaZjmWv0z9TORc0CKbaTea214oNM9u2sXUZub/eqM3Pi/PjRSyQiOSwPWif2asTgu6hS6fb5UGosCWxdedMqdViIUUSSdIJx+qQ4KShfTT39VAWZbi+mB+iKICNwpt6cflY57Rcbs6d1kA26Iru73cuxYVlSvuJdcR5VfDYZRk8X0AXePROyw3Le6LaUdmTLzYsoNhhgQpd67xVNiHgk3pakmndeIAtTC4DCXy9oS6eU4CWxDdVmY53pKNbdAKmQsP37lrJZC6iDXMELGKcHjNuuZgcDyY8W/yv6ha3DX7OWm/35fpvhw55oitf4V+GULlcPWYyGGuVBdro19c8u0RDddDun40W7G5cSIzHLh/qZxb59R+EPY+wZ2XerkUim92hhXpKyW6WtAh6zQS97DrPyjCvKi3pCw96LeKynOpyjtsMQc2RmI/20zFOZcSa2AK++PoRcT6zeJyxlBZ7kk5mhqXGkLlM2hFKc+/T544xXP0Ua38Q6xdPTLTeG1PHnLMaOvksUQMrEFTB/lizCirmFQL8zYVU+OTeYQEFaITsBSMMYexS9HkajO2gGIf2micvntCZJsZQEwIH3/4JGJQGflBuH5rNXmnRRYXDQs3ZoEQoMtYDr1kFKUS/siiQSUxcTH9XYeBZiKDDFQoExREO9dddKQLO3BwMHvymCSTFyY+vxn3D27NDx6OlU092D5EDUwilttqVHpjJQDUceJYCLsK2swfXeNUVrBJT/w/sk+7si8rPtiMFis+oxvGdGQxirMBID700T39mULuNHzOyN+xBfcFACZcyngF1aSpv0JPkNUrAZTqfplv509cGXFUiEEm5dZb+OsP/blizqdK45/dSsIrufYTrCPY2lgJD6k6QljTfXVlHfYKSq+MsagyUcaMintyr95bD8kdTAeYNLNsMmo/Wdd8a2nStBP49ARIjqqpUHWY4q4mvO5Cq/CgCP+4/B+5zutGwX5pssgVLr1+fIM7WWLfiUQDk4c6ZdHZOWv5hG3g2dgQ5NXnpIY+BWwJpaouf25bXnjDzbHnQNofH/c6m+dEAS9Gs2h7pFRPKOBDnqswZ8KZjhId1ytHUTs533KwBoSiImoxKQUgZ7z6pA9QB3sZ8Cq0vwutJTTkfbX8AzCpm2cFXx/P22niUMHauU8IGc+78R6TsutoonoqFuoNA3l80t387YHMoL5KGAT1JO4zmx+vJ0LbLHlicHraSVYvJjnO9p++qnWgKw9OwFVVUagvZuf9qfiuum+hIicxP1q4zDnzkHsCNriLxBpxY9N+UOmqzdY1MunLMDgkMyi3uvnN3UBXJeZ8YLs5xr8QrOhimYoKuGBebZHAiBIkViv3DG8k2oNpp5OIgX6ulqaRN8V62QUPjn5tl1kPXhT9bcd8qIm8gi4or/FGbvQ6pgGSHmnayrugmf5E0upGxPRf/3xOtitGMaHLKJVm5zhglmVfI91o0yxhJZVS/5wQ8zfxK8Ylw0WmHXoGfRkoBRx9Hsnl/6sgTjAVwpmNuSeZtBwlX4qB8Bh8lxjqBDIuFGJ4I1wxN0XRlAAslzqMKwQfyA7OkuivCXfv+i+3XmhcBFM2n4jdT+NyUmBnQJPV3F2sZfKvJhUlXzSosFR4VevVVcOkFnnjdiRWc0TeSYxj41sJGYMbZTeLI3GvyZ8/gAAudQ1+4oFX+enX5V49MczGCYVBuoC4kHjp7ZVxj+clBwPr9k+v05SsezQK3enxLs1Nt/N7c7AImVUysjGou4iOohHo83Zs9/MI/OWB+OyXzOBD93NbApGHXrv8CVRHp2bwH+xB55cfNrdqFD35HSMx4iVmtzYAmSCIV8kXsHoq3DIb93riTWbubnjxbBW5zConVtbxLRStXHkIyAByaozME952Gc9aAdAbBpZSVCH88Uwb/4bPTVOVl+WoMYD7JIvK8VcMrJ8zHV4bbG0Dg7Kx17A4ej/ZcZ2Z5pVuVLUH1E/AccUTKm81SE+LQ6STTUDscUk0x2OWIbEORhg69tdoTGNkA1RfkGIRZHr5mCXOpLC55WWzCZoGPFUVtZRHwh0nq039CDdjEPo+JyaxSQAvDgR6Iqvxy0frrtEG1A385N81l05SSzN+IDm9bypF9m92EUqblnauZ5sjc37wRykOdl7w4o8WMgQsjii3EE/aJYDfHs1cH6DNBEujjcCc8qAefYFyIAURDcDnzun5UmkbBQsU4eu/W8I9nBE0qJKTdg2hwjq0+XV7a3TJ7R+alvJZCRia9lJ+grNB9dbrOmWEvUotMjvDhq4wV/kq4fvIBkzUGpDeYH74rne8uU3dgoNZdR9pUL6q9YDNRfOiF6Dyk+SYXQIghTjm9qR4tBHh0gnmF/9q3Qv22EzaLhSvDlDOxMrrCNRmLCl1jApzLrBCPn2mjn5zqK7OYK7VxOfQ5GfBfoPdyQwqFEgCVHkJ9oTnagRM3R0+rsuN5jQv9icCav/p1WqiEXSzCdLd/WEA6z6dDP7tPqPbeDYKAkVcz1lLGbFOC9b7cBd3MV0Ve8dZ89oR7OnxGS7uVpSry8banVZwpJg+nkH1jRBYa2BvBMY2xITH9ERXCjHzdZxs+ipdXP2DY7X+eWiBhtT2L0RRGTLPeazn5tpl4tu8iE2rWig731iuJDRbCHHy+g/Mb9+miAyVqfIpXT/iZeOxOxODO0hEpLM78I1+G2Z45yi3lS1K3m4WMQ559Lp4UML5vZUjYGJuxl+OPpUH5klpyBujkjprhei0TmUik10gjvNUp8mDkWlNKikmYspaVTqewbnOzJrmz8FLIpsT67EJLHIIfeDcWEfiP+DJrZ1jfxpoAb2abeMqLx+9RuZGzQoYtYVGgAWwEM9Kek2vPIeBNAKD6ao7nw6sgvfeLZPoXkbYO/tStHJdKzk+WFSFEU2NcALJAEP6S8pcnqqBBt57dwTrzQNCIdk2SocK4dLRbD/pu/VryKnm65ZYXiJCfHJk3mx9MRSl+nSK6OqEBSoGjz0/LADddwF/HqcfK3K3O+6YUGQcmj8pZL4PhZ6KrGkb8B38FmDvvLd3XQXbvS/FQmrXFTvJNkaN/FGo83KuS43BK1UfVnIqigGkCoP5fBda2MwAGTGNKX9K9t4Bx83pMFc5KSORmWKv+8VoVggWxoaBz3/9IBh6RwLd1tebwy89xvE5z6EEpXpDfrXWfRsMs6+ekUHH6idVosno55+xQ8Zqzelh0bxtJTgCcH3Z3/Cxlx9eNIS4JIFKOAVrDqbrXRszmY55a5+niJGHtkO3b6mnIDxLa1WXc7BAe33mt2KyM4Fbc3R6/WVTQN8QhlqAtave2WsQTqzWeSlKuGUVIJRqtObpv294rS0kDN1RKzdstZTXJebR2HlzsQ4P3NbMHUqFZMZw+/IKXnh4t+lY8qocp/B1oMszR03EFs3bPeND8QkItMvllObeCz3SZAjqZrobmLcrpFyQV7mwBjg3C3C8/bc5goQhv8j/IXMLGnt4mF7tybRDG5G0polxoUScQkPvmnga2/K+aapKeqSL0BTmo1Cm5g+booNOtdyKva2KoefRURaBk7113QKo3y+WTuFKtgETIK8HRluYS9DvlcciCDvnG8UaJRfZE2siZsiTHvRmN80xkUIInHeRZl5Re/+ATL6VhKFi8CZ/n/jbFV6T5pZ+Uoppvsi3qjacVFOJgWWfdlwVHKPW/TJO3na9hRM9bS2yo2rEsC6IBzRReVO6IesJU7PItzOamr+ROFfwGZmZ7ue8HNxAgLJKb7P3p8dMqk6Be5PJaT/5Rdc1deYVihWH9cjVKc9uz5EnfHqxLUkOO8iJUENBNVf5LyNy8zjLu/78k5WNTywiPfYeX3CPk7yc6CI3lum/CEZwfUaNpcI3KsPqfn2lmz3kd/acQjKA1ebkJaiuLD+epQ/Fc1llHXXMzofWzz/Kd29SNmOhcjMWw1jq1g3YfrXZ9rzXDYW4ZttfgfMi6oCUtBs0PkMVuxmq5lxEoCaSXPSqCJJ7MlKdRDidVt0AFlxk5cTdX++sBF2+E35mjwfm8ERVxH0FvuAQtsfA4V2G0TKTUxeyRGVjd/u6F1SvuAiU2/WaQjcNCU4Ep7VunXCYSbZj3U3wzu/LWM5MPlYuyQ3FOOCD/zt7K295hY2JhwF+ODDIZ676vGQFKveEQYkWj7lkK7rVmD7MhU0Y/tF8EcTTpo4/yqOufbd/zWIpMajnbDuWK2vn6OPPtz2rc9MIBNlPd8tt+yf+7SC4wqEPbozKMCwY5Bygx4JmoIEDsixWRDcdHd6S3/dZMHXOJAAv7+NIstl00crgSqHZKAEe4g3G4dzIV51EeZB01r7p8GNlfUnG/GjZgNGsqXZdYMBVtAtFNv3hJWPve4GvqZ2XxuiNkHTz5kxWgr0PjQdJlVywJ9Zf2ZvqeeTbolKtvK54re2Lq5BoyzfsRtvDfyao3kmyFzDQ88nM+qx83w74RDlkngtYiArI05Epre3GgBeSlMig0pE6RGQaFznKkGeb0SozLCyiOtxh7hgwZlbKbClzUUfC8ntMiHUOZE375RhTy9c4DA+oMLkUDkztSybZbdmP1xpaIbjUpPAHBq3cIq+CBFzbMlMMCCkUQ6d9LGV6GYCsYiEWZIy3nBnuxOYXeU4YTGDSin9e4/pCjPtQSHlg5LMEvIlF0ElthqrF129iK2RPBEWd3XWOl3SWV5uz5VUyZYp5kEFmz7QfP/B1W1BBzQ2iTGbSVT79lUHzcGXz3PJceSgz4uknETUwo0xffpr2KUvZF0i/r2sL3IFIClYx8CbIZE6Qt7MDJbOPB3xMScwaOcWG66IJfCnDkb0D2Mb+PHzX+oiCbxeTIogtyN+s2NJirNACk/OACSOTtV6vscwbzW4M168xqaI+RzR47S1nlV/rOoZnid87n/Ima2XYa3un3BuGAisNjb8eLMT9OnMtazQROFCuO1HiZXaOc0oUDbNC4eKLToOx8DzVhMgGA8XIAQ2x3b6I0uEyLssQjJX3QphcUMx4KsMgJ+72km4N2aqkBF2coKmUEt1eqIMGn+5txMT4kYVGd3ALO+y9Z4PP3d3l48JQK8s9ZZ/Qx/+NBKgBEJFlQ32psoJiihGO7FSYM5L81q72kaAYcilEFMG+ZK1BcMqELkflyCV7v8JEXLO4Rf/oZYNZHZVjJhfL6fnpP9Tio3Euue5uS7FMkfGOeRCTrBZ06Caev7tgufeTrX34Ur/Vvc+b8ksiIShNJtuF9WmYxOZ4xg8y6zTdy3KAB2y5kYkcRnXsptWwAFyKZ2I/QGySNeoQLkINUMloC+5L3WuMMx297Q1xUYLKqZ9XHavaobo6QQv4auMm+i84IhxRpPt9nUmcav9NcjCcP+TcMmxsQZ/F3mgeoA0fQgwvTsyXuuTaM3Sqtv2jaaajmaFQpK9W6uIbeqwvSDo34ZrY6elDUHwSCjHRRmlwmyy+eOra64Ssq0XSXYljMHtKY+FShcMkHsEUY/4Bw63dJ6KpwDaxmthlDdbdE+TvYF3v33cGSKqO+1H1pKYhJMvZD5ckQcHyNF8zrtiR5b0ko6NPGoRexUZTYP6VbUdn3zzxGBOi8Z0OqHjGqYxRXwN3mYi0GYEEZYq+Q3QvdKcEHILLLj8S+VFepSfErtmfZCdvxbfIifFSpEzKi+7VJsLMT+zEFeyp1OdwRC1VZrfTLIyR7xTPUcZFYPD9qI7D70uTb4hdpqPXsJIRNYbZtNwch1OI3trh3u2ScoQyM9POnInsUa+OovcwkUP1UfIzPb95n4BaF2ev57NHAej0+BVMF9/Cj9663HN2/JN3SQgslL914bKfiTTDFAz9PlQEL/dSv1H8xl3mtWxh1McFO9EJXlRDaKQDsyKO4vOJW90NFE6yw2tjbc2GeF95sbs0I9enAa6QwQVf/kJQhAD2BzUDKggOyjy1TEhED6sfk+418lQy3c/uj8aw8UEzZ6hIMCd8RohAkumMtIj9m73l2yPWoGHVTPaywkC7Yj9tBM1NxMgcrDwRtk4RO2WHT7Ql5kQCKdJj6kNuOTeyEBYBjLMhGz+O5/YGa84HEiTYEpZ6fFzy26GG2hWtTyteuYrhSyG56BjsT/wQeLRytpTY3D7sIMqZnJ9z1FDrfyjFlGl2TNw9BQysbaxOuwYYZs/7I6BANgkqCknWZC7/BBXvaeKwAmC959I+G39BUE9bExkNlbRoFRyEtNzv+NJ91FuisG3JCS6uYBeRnfv8AkAfKTeg9EYamqnsGfAV7d0f9DghHEQ5IsPGDIUhgoSj7obM4Bu5uhQ3/CYEDTHc92AsFvDK4XGrwUeGBWBHPlS+f4x+CxmmHz2sAGmSFNt65kwZC64mnaoWlu2310laYn8r62AqsR5dfjyK18MEdurdagldzfJtjFXlZs7St4QhdPiye6TPh2/ZAQLU/Fip5s7TDEM16KtRWrK9hmxnQ7bmfa/+7pa10Z8WDPK3NuJ+NN/RAbQ5vHx2uX0Lm7/w7cAEH/hvZA+mt7J7zGw7YtQYwnNN6dpgwkGjjrS3yQoeoYt1EnczmtmJfQZWzUlP3Hlg9Wzlr9IH23q3thGth+QNEANFettxKfskkGOlLk8AqoKJwDqOxAa6UzAx07plSSyNBJSGco9zjnC5gGbDoKvsMDuBR6bGRlGzJ+hFsGa/Izt78aI+WZ6dJlZKp4pGISuv9rV0sAS0MWEwCmfauO7oQZMiakHU35LBxiyJoOMddhUWgcZuC8r4Ksvn75TTcQXLJ7kWtYhGuGqPd9dZuFjBWQHNwosXY5snbHFQq72CvHXhIg+shQxycuLOuWYErwCLZeF24b7F78pO7xw4X6lIAR02hUOf5087Rl0nOaeb6CK4i/KA/EZv76ftOWZtjwxslNr0E/u8rWUmnf3amfg6UZmBAluuoj3Dd7UV+9IAJ6iYcDfSJlgmIImohjfIUMJ27z+opj50Ak9af2LCNrWrBJvMovA1OeNO+MF/MwZvnaCxTgG7Cw4QfSPF6AYCGFt21M8PySZFeV3t2Rqqs5JMzMYzGRgq4o+UaKRgBf9GHi/9X9HXA3wxkCsd/UhnHSh2zUVDiraio/6nP4y3XJqs8ABfALAtCYU7DHPMPRjgcM6Ad/HiSXDAbOdSMkvGZPAkHs8wuQTy6X2Ov/JFvcPuKfV3/r9Q28";
var FENCED = /* @__PURE__ */ new Map([[8217, "apostrophe"], [8260, "fraction slash"], [12539, "middle dot"]]);
var NSM_MAX = 4;
function decode_arithmetic(bytes) {
  let pos = 0;
  function u16() {
    return bytes[pos++] << 8 | bytes[pos++];
  }
  let symbol_count = u16();
  let total = 1;
  let acc = [0, 1];
  for (let i = 1; i < symbol_count; i++) {
    acc.push(total += u16());
  }
  let skip = u16();
  let pos_payload = pos;
  pos += skip;
  let read_width = 0;
  let read_buffer = 0;
  function read_bit() {
    if (read_width == 0) {
      read_buffer = read_buffer << 8 | bytes[pos++];
      read_width = 8;
    }
    return read_buffer >> --read_width & 1;
  }
  const N = 31;
  const FULL = 2 ** N;
  const HALF = FULL >>> 1;
  const QRTR = HALF >> 1;
  const MASK = FULL - 1;
  let register = 0;
  for (let i = 0; i < N; i++) register = register << 1 | read_bit();
  let symbols = [];
  let low = 0;
  let range = FULL;
  while (true) {
    let value = Math.floor(((register - low + 1) * total - 1) / range);
    let start = 0;
    let end = symbol_count;
    while (end - start > 1) {
      let mid = start + end >>> 1;
      if (value < acc[mid]) {
        end = mid;
      } else {
        start = mid;
      }
    }
    if (start == 0) break;
    symbols.push(start);
    let a = low + Math.floor(range * acc[start] / total);
    let b = low + Math.floor(range * acc[start + 1] / total) - 1;
    while (((a ^ b) & HALF) == 0) {
      register = register << 1 & MASK | read_bit();
      a = a << 1 & MASK;
      b = b << 1 & MASK | 1;
    }
    while (a & ~b & QRTR) {
      register = register & HALF | register << 1 & MASK >>> 1 | read_bit();
      a = a << 1 ^ HALF;
      b = (b ^ HALF) << 1 | HALF | 1;
    }
    low = a;
    range = 1 + b - a;
  }
  let offset = symbol_count - 4;
  return symbols.map((x) => {
    switch (x - offset) {
      case 3:
        return offset + 65792 + (bytes[pos_payload++] << 16 | bytes[pos_payload++] << 8 | bytes[pos_payload++]);
      case 2:
        return offset + 256 + (bytes[pos_payload++] << 8 | bytes[pos_payload++]);
      case 1:
        return offset + bytes[pos_payload++];
      default:
        return x - 1;
    }
  });
}
function read_payload(v) {
  let pos = 0;
  return () => v[pos++];
}
function read_compressed_payload(s) {
  return read_payload(decode_arithmetic(unsafe_atob(s)));
}
function unsafe_atob(s) {
  let lookup = [];
  [..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"].forEach((c, i) => lookup[c.charCodeAt(0)] = i);
  let n = s.length;
  let ret = new Uint8Array(6 * n >> 3);
  for (let i = 0, pos = 0, width = 0, carry = 0; i < n; i++) {
    carry = carry << 6 | lookup[s.charCodeAt(i)];
    width += 6;
    if (width >= 8) {
      ret[pos++] = carry >> (width -= 8);
    }
  }
  return ret;
}
function signed(i) {
  return i & 1 ? ~i >> 1 : i >> 1;
}
function read_deltas(n, next) {
  let v = Array(n);
  for (let i = 0, x = 0; i < n; i++) v[i] = x += signed(next());
  return v;
}
function read_sorted(next, prev = 0) {
  let ret = [];
  while (true) {
    let x = next();
    let n = next();
    if (!n) break;
    prev += x;
    for (let i = 0; i < n; i++) {
      ret.push(prev + i);
    }
    prev += n + 1;
  }
  return ret;
}
function read_sorted_arrays(next) {
  return read_array_while(() => {
    let v = read_sorted(next);
    if (v.length) return v;
  });
}
function read_mapped(next) {
  let ret = [];
  while (true) {
    let w = next();
    if (w == 0) break;
    ret.push(read_linear_table(w, next));
  }
  while (true) {
    let w = next() - 1;
    if (w < 0) break;
    ret.push(read_replacement_table(w, next));
  }
  return ret.flat();
}
function read_array_while(next) {
  let v = [];
  while (true) {
    let x = next(v.length);
    if (!x) break;
    v.push(x);
  }
  return v;
}
function read_transposed(n, w, next) {
  let m = Array(n).fill().map(() => []);
  for (let i = 0; i < w; i++) {
    read_deltas(n, next).forEach((x, j) => m[j].push(x));
  }
  return m;
}
function read_linear_table(w, next) {
  let dx = 1 + next();
  let dy = next();
  let vN = read_array_while(next);
  let m = read_transposed(vN.length, 1 + w, next);
  return m.flatMap((v, i) => {
    let [x, ...ys] = v;
    return Array(vN[i]).fill().map((_, j) => {
      let j_dy = j * dy;
      return [x + j * dx, ys.map((y) => y + j_dy)];
    });
  });
}
function read_replacement_table(w, next) {
  let n = 1 + next();
  let m = read_transposed(n, 1 + w, next);
  return m.map((v) => [v[0], v.slice(1)]);
}
function read_trie(next) {
  let ret = [];
  let sorted = read_sorted(next);
  expand(decode4([]), []);
  return ret;
  function decode4(Q) {
    let S = next();
    let B = read_array_while(() => {
      let cps = read_sorted(next).map((i) => sorted[i]);
      if (cps.length) return decode4(cps);
    });
    return { S, B, Q };
  }
  function expand({ S, B }, cps, saved) {
    if (S & 4 && saved === cps[cps.length - 1]) return;
    if (S & 2) saved = cps[cps.length - 1];
    if (S & 1) ret.push(cps);
    for (let br of B) {
      for (let cp of br.Q) {
        expand(br, [...cps, cp], saved);
      }
    }
  }
}
function hex_cp(cp) {
  return cp.toString(16).toUpperCase().padStart(2, "0");
}
function quote_cp(cp) {
  return `{${hex_cp(cp)}}`;
}
function explode_cp(s) {
  let cps = [];
  for (let pos = 0, len = s.length; pos < len; ) {
    let cp = s.codePointAt(pos);
    pos += cp < 65536 ? 1 : 2;
    cps.push(cp);
  }
  return cps;
}
function str_from_cps(cps) {
  const chunk = 4096;
  let len = cps.length;
  if (len < chunk) return String.fromCodePoint(...cps);
  let buf = [];
  for (let i = 0; i < len; ) {
    buf.push(String.fromCodePoint(...cps.slice(i, i += chunk)));
  }
  return buf.join("");
}
function compare_arrays(a, b) {
  let n = a.length;
  let c = n - b.length;
  for (let i = 0; c == 0 && i < n; i++) c = a[i] - b[i];
  return c;
}
var COMPRESSED = "AEUDVgHLCGMATwDUADIAdAAhADQAFAAtABQAIQAPACcADQASAAoAGAAJABIACQARAAUACwAFAAwABQAQAAMABwAEAAoABQAJAAIACgABAAQAFAALAAIACwABAAIAAQAHAAMAAwAEAAsADAAMAAwACwANAA0AAwAKAAkABAAdAAYAZwDTAeYDMwCxCl8B8xhZAqfoC190UGcThgBurwf7PT09Pb09AjgJum8OjDllxHYUKXAPxzq6tABAxgK8ysUvWAgMPT09PT09PSs6LT2HcgWXWwFLoSMEEEl5RFVMKvO0XQ8ExDdJMnIgPi89uj00MsvBXxEPAGPCDwBnQKoEbwRwBHEEcgRzBHQEdQR2BHcEeAR6BHsEfAR+BIAEgfndBQoBYgULAWIFDAFiBNcE2ATZBRAFEQUvBdALFAsVDPcNBw13DYcOMA4xDjMB4BllHI0B2grbAMDpHLkQ7QHVAPRNQQFnGRUEg0yEB2uaJF8AJpIBpob5AERSMAKNoAXqaQLUBMCzEiC+AZ4EWRJJFbEu7QDQLARtEbgECxDwAb/RyAk1AV4nD2cEQQKTAzsAGpobWgAahAGPCrysdy0OAKwAfFIcBAQFUmoA/PtZADkBIadVj2UMUgx5Il4ANQC9vAITAdQZWxDzALN9AhsZVwIcGSkCBAgXOhG7AqMZ4M7+1M0UAPDNAWsC+mcJDe8AAQA99zkEXLICyQozAo6lAobcP5JvjQLFzwKD9gU/OD8FEQCtEQL6bW+nAKUEvzjDHsuRyUvOFHcacUz5AqIFRSE2kzsBEQCuaQL5DQTlcgO6twSpTiUgCwIFCAUXBHQEqQV6swAVxUlmTmsCwjqsP/wKJQmXb793UgZBEBsnpRD3DDMBtQE7De1L2ATxBjsEyR99GRkPzZWcCKUt3QztJuMuoYBaI/UqgwXtS/Q83QtNUWgPWQtlCeM6Y4FOAyEBDSKLCt0NOQhtEPMKyWsN5RFFBzkD1UmaAKUHAQsRHTUVtSYQYqwLCTl3Bvsa9guPJq8TKXr8BdMaIQZNASka/wDPLueFsFoxXBxPXwYDCyUjxxSoUCANJUC3eEgaGwcVJakCkUNwSodRNh6TIfY8PQ1mLhNRfAf1PAUZTwuBPJ5Gq0UOEdI+jT1IIklMLAQ1fywvJ4sJzw+FDLl8cgFZCSEJsQxxEzERFzfFCDkHGS2XJCcVCCFGlWCaBPefA/MT0QMLBT8JQQcTA7UcLRMuFSkFDYEk1wLzNtUuswKPVoABFwXLDyUf3xBQR+AO6QibAmUDgyXrAC0VIQAXIpsIQ2MAX4/YUwUuywjHamwjdANnFOdhEXMHkQ5XB6ccMxW/HOFwyF4Lhggoo68JWwF1CZkBXwTjCAk1W4ygIEFnU4tYGJsgYUE/XfwCMQxlFZ9EvYd4AosPaxIbATUBcwc5DQECdxHtEWsQlQjrhgQ1tTP4OiUETyGDIBEKJwNPbM4LJyb5DPhpAaMSYgMMND137merYLYkF/0HGTLFQWAh8QuST80MnBrBGEJULhnkB78D8xrzJ+pBVwX/A6MDEzpNM+4EvQtpCIsJPwBJDqMXB9cYagpxjNABMYsBt5kDV5GDAm+PBjcHCwBnC4cFeeUAHQKnCKMABQDPA1cAOQKtB50AGQCFQQE9AycvASHlAo8DkwgxywGVLwHzKQQbwwwVAPc3bkoCw7ECgGpmogXdWAKOAkk1AU0lBAVOR1EDr3HhANsASwYT30cBFatKyxrjQwHfbysAxwD7AAU1BwVBAc0B820AtwFfCzEJorO1AU3pKQCDABVrAdcCiQDdADUAf/EBUwBNBVn5BdMCT0kBETEYK1dhAbsDHwEzAQ0AeQbLjaXJBx8EbQfTAhAbFeEC7y4HtQEDIt8TzULFAr3eVaFgAmSBAmJCW02vWzcgAqH3AmiYAmYJAp+EOBsLAmY7AmYmBG4EfwN/EwN+kjkGOXcXOYI6IyMCbB0CMjY4CgJtxwJtru+KM2dFKwFnAN4A4QBKBQeYDI0A/gvCAA21AncvAnaiPwJ5S0MCeLodXNtFrkbXAnw/AnrIAn0JAnzwBVkFIEgASH1jJAKBbQKAAAKABQJ/rklYSlsVF0rMAtEBAtDMSycDiE8Dh+ZExZEyAvKhXQMDA65LzkwtJQPPTUxNrwKLPwKK2MEbBx1DZwW3Ao43Ao5cQJeBAo7ZAo5ceFG0UzUKUtRUhQKT+wKTDADpABxVHlWvVdAGLBsplYYy4XhmRTs5ApefAu+yWCGoAFklApaPApZ8nACpWaxaCYFNADsClrUClk5cRFzRApnLAplkXMpdBxkCnJs5wjqdApwWAp+bAp64igAdDzEqDwKd8QKekgC1PWE0Ye8CntMCoG4BqQKenx8Cnk6lY8hkJyUrAievAiZ+AqD7AqBMAqLdAqHEAqYvAqXOAqf/AH0Cp/JofGixAANJahxq0QKs4wKsrgKtZwKtAgJXHQJV3AKx4dcDH05slwKyvQ0CsugXbOBtY21IXwMlzQK2XDs/bpADKUUCuF4CuUcVArkqd3A2cOECvRkCu9pwlgMyEQK+iHICAzNxAr4acyJzTwLDywLDBHOCdEs1RXTgAzynAzyaAz2/AsV8AsZHAsYQiQLIaVECyEQCyU8CyS4CZJ0C3dJ4eWF4rnklS9ADGKNnAgJh9BnzlSR7C16SXrsRAs9rAs9sL0tT0vMTnwDGrQLPcwEp6gNOEn5LBQLcJwLbigLSTwNSXANTXwEBA1WMgIk/AMsW7WBFghyC04LOg40C2scC2d6EEIRJpzwDhqUALwNkDoZxWfkAVQLfZQLeuHN3AuIv7RQB8zAnAfSbAfLShwLr8wLpcHkC6vkC6uQA+UcBuQLuiQLrnJaqlwMC7j8DheCYeXDgcaEC8wMAaQOOFpmTAvcTA5FuA5KHAveYAvnZAvhmmhyaq7s3mx4DnYMC/voBGwA5nxyfswMFjQOmagOm2QDRxQMGaqGIogUJAwxJAtQAPwMA4UEXUwER8wNrB5dnBQCTLSu3r73bAYmZFH8RBDkB+ykFIQ6dCZ8Akv0TtRQrxQL3LScApQC3BbmOkRc/xqdtQS4UJo0uAUMBgPwBtSYAdQMOBG0ALAIWDKEAAAoCPQJqA90DfgSRASBFBSF8CgAFAEQAEwA2EgJ3AQAF1QNr7wrFAgD3Cp8nv7G35QGRIUFCAekUfxE0wIkABAAbAFoCRQKEiwAGOlM6lI1tALg6jzrQAI04wTrcAKUA6ADLATqBOjs5/Dn5O3aJOls7nok6bzkYAVYBMwFsBS81XTWeNa01ZjV1NbY1xTWCNZE10jXhNZ41rTXuNf01sjXBNgI2ETXGNdU2FjYnNd417TYuNj02LjUtITY6Nj02PDbJNwgEkDxXNjg23TcgNw82yiA3iTcwCgSwPGc2JDcZN2w6jTchQtRDB0LgQwscDw8JmyhtKFFVBgDpfwDpsAD+mxQ91wLpNSMArQC9BbeOkRdLxptzBL8MDAMMAQgDAAkKCwsLCQoGBAVVBI/DvwDz9b29kaUCb0QtsRTNLt4eGBcSHAMZFhYZEhYEARAEBUEcQRxBHEEcQRxBHEEaQRxBHEFCSTxBPElISUhBNkM2QTYbNklISVmBVIgELgEaJZkC7aMAoQCjBcGOmxdNxrsBvwGJAaQcEZ0ePCklMAAhMvAIMAL54gC7Bm8EescjzQMpARQpKgDUHqSvAj5Gqwr7YrMUACT9AN3rlr3JG9m8w9lIAXltp/v8kfWaIaaR9OwpAES/I3ZVamDXSgB/UsOgAG6D0tq+5CIqE15FiAhV3yA2VhCQ7tj+m6xXaF53FIfGi/IAZIskMGAi2MU7MDVJNCbMzERyHZi+osdPtnFVbvq653O8rwaCy4IAf9OOok65AqJUtUriUfYsGPPVbe6jm0s9lbKlPCUKjdkHsFsEhvX4kT39ZCtAAbwQdn/h4TpO5hTByWAmr5n+Wuwhdegv6bmvX4LyOes3z2+cuHv2JFYwVMNuq2gzn8YHTjlUQd39osyWei4NKl3LAdfxlO876hh5ENp/cOvpuI9bF55guEthLLPOXjD4dktTH04P5TvZrWTM0e4+BHJxj7MLApXIFOs0sWKhNkG8iwuM5wR83my6V3wW06abhDzTXYfOr/ZpFXgXzmv4d12FFyP00/dPGbIVGV5ao8UufGzUwp/IHx6v/wDWJr9iaoCulhWwlZ7A8q/NMoD12+mBdNRgJYnThRLtMx1Bgwttn8/4Qn2CDfOSup9GVXEvA21ILgp0owHYxNOkpwLWz0G7K+WREIDjIzUzSn8I99CuJSmSpPyH0Ke6/NERYiNx+3dncSebPnOUnnWD61AhJ1n/tSLZmU5wYO5GfgzyAYJm6VL91LxZ8hL1lfximQxIDMRhIecQZBmeE5R0XlrpvwplVrJwpa8BBCdp93GPP9lyBeZ2zkRr920CR3cYbKpKHfogvm0nV7XdDz6EbjzlxADCMjSLXuXpIpyuizy39yY+I+H9rmpoIF3YwEjlH9MgGgWcCNTjHEWMqAbprn2Ox7rOHupaVE3lNyg3nt5XaZID6Y+uml5Ja+aOPu+BI+DZbiJVfaspUadakWUX6TA4dETkIqdJJHYnU4Z4yKpt5y8rVIahoMUf8A8kWtAQNCTbjp71gx3/zVdqNz1Sutkw0gFIMVm2BF4Xdv/0olw+NaDIR9Bb3DPweZA2K/cw+/b+AwyWl9ZOP67A9nexmeTNjfdzPGf9J6E6BMPKa5lJh+qNsdUz3HBUevU71eQFCqOcxiIYhacAhh/8PX0J5DdSViZ6WazDDx7cukJNpMfEkYLJ5Ao4vLoVd3d25Pg4qaVa2p2D2L3WvYPJ5Yf/A/MSxptjlgXL/KJtP2U0cRv2I09ATAiWCJYuRwiapeKFsqmi18yMMulDp3HdcIldq+7jkwsJUOHLHCzzzBw5XFvL0CAmo1ub456z7zb7shk3KPGCLZzr47oT1k/j06XNnJvG3Udv6XrP+wsqTBlZ5MaNPt9FOs/4Bt/ja/vbVhTNpBFl9Gq7MqINvGlWKOAwQzwOZy+EzSdjAqKJVV2YcskTuM94aIK+kc/AZaXiZLPREUDpkXIV947IFfj+85TrqPqLfkGcxgboMQjosf+az+odLNXdyp1mDNGsqSdK/pJ2Ca04mt/4d6s1X+lncOEYaGBBeW4pApGcjf7/XJCFbj3N3mFb+BtlIcw8ZiDKoClFX9Rf0bxCqtLpicObKJzBVVHr/6u4siH2hK75RNv7w9GfTbhJOQBYiFUZAByY4rn37tZBHT//kqKsNi3ryL9AqXJRzqiMIJMhILjoi/i8LVEsbu+Ih9bsyW16sgQqjYLO0qda6KaCPKj3DQcu6CfV5lKtjS3ZCdqLAZkOey9MR+QutJBGiz/r15GVD6rCVwJR4UUKC4GNJkfDf00OMW8aQtLSAGLXV8MIi9mbbl/qQEpxCm2L5hutFX4ekeLH4QgBWUFKs/2VVMKy46WtFE6AbwgmYm/Z0yHk5veDIrcl2HpVqb/rSE0PC9EbDzJEWqeaPhh7vF369Umq2kSiB3s5rBI6c/7N9bkRu4h2n+/h5nSwy+7n+/I+6oXQVANo2Jb5zDwtiBPf1ySCzHdT6yJShMzqSRZfnykX49CaFaxhoVF4PBhEuECJ1PrFYSpmHuyYsl14DTAV9ZxRms1XiR/kBrjhZjidOt0UNe+GSml7XNgpVw8YsUTmZXLTK+6iYnyW/wYR1W4UXwOi14xpFROHb6HcZzksgF5DbL2AFXzKNwHU2adjdAY+KCyM/cwRTBkkq/a227NI0q6DR2MkMCRu620t79bGcYUmACtqN3mk/0uNwd3JSXHqE1kzf6Yyj0W2083JNDRnIXDlgBxJ6uf58NN1f6FQiRCWB4egF8QDx74AixV8oTyw7PluIjr3/rj/WzgwPSq4xPojaF7V0xqG2u5ti2L1h6yYHv73Isrukr0kURDIEjClBsBx7kdcXUxaYMS0syT3ymLzDzslNDWQOT1Tao1YNmJHARUenhCkmV9tqCPGI5GqZaRpkiPxyjoncWjyOHYGqvbvRX+Bn1pn7EhRNXa1lqJPmoeN5VqdqIDPhEVhFsyG0d4iQEIYX0wZUbY2XbZWYlpZ/l66IrDDY0q1C1YzBDpHC4h05YqHQLqS9anyl22JQ6lEvjvdBwMHfE7z0luCXD34/rFeDa2TmSeEAykSpYO5j1G/nsgpR3qn0qaQEmLjnnLfcz+veoYqPnRqmRGwCJ6FJ3Gm/Z1/aVX5PSb03MMnjAf41ww54sD5k8FrkfBP+K0b1MrYpapWjtpZfve2HVf4ickX3LKSOhu7qI1Vd4c1kNrn2ajy1t4y93JhV4fnWCKq7OmFpcr7FjdJCXPTql0Drr14Ho3Z87+GPQ4Z/DcTiGqtvZxlRYi8cNuhXABveZIwNl/BX1huhVLaFax5OqypUrQRyb9OE3SSkPlDdy5uo5XGg2EIGEjLY1MO5cr1ibfiFWV7zspcTgkBKkwo5jPyAin04LqizZXb2tDRgwKJjGx4cVk3ngAQixwcxjYAg2Q7vmUR/hpwInMdw7OhC2qyf41vTPkudQAORS0DdLtOGQxb4fH2VYGsvJCkeWPeUwtf1/tuIhzXEThoCZzzSJqqjUtbaPI3ntHm3T5uf849hGUA0zU8ni5W+EEn3/0Y6oUhQFw9z0aGjkljBbAlFXc0y82G2wkd7VdgWa5KTgJJNjNwZMfmdnUIUn1JU5LiWX5UZEZbVlKSN76mlmjUR2ku+fucTNlO4IAAahnLjBhlvQNR9pe9swGBgq0YR7P3VCyI/seYwQ4QBzy9X+HPePgoF8WfKaJ4MBOhLCGHae6Z8xkNXwni9QAKvTNtVA56x8YJflZ/VvONRSlsSLmiSyNMnTjTaE1ko81zkzGEnVwEhjCzlwIqpxmpDAqwsEmtpdr3xpc7i/ZX3f2TzT3M0FdxIEQvO1jgmmiN+D1YpMduAzEhBtj2OBkMN/rv6p7Th4pSH6f5aH3aTvwFTl7EOSgGASI7ttyMehzpm4AVyK+bFEaFg9gnZsSUPpsbAe/0RFhrH+EXZ12Z7thf4dzN1+Sn+G8QrDA1VKaN4IFxD1rQz9Xq9Coii9S9/hPbTGjyBwFH3H1UdQuz5KsgPDEHua4/kPg2Gp/IIItsaLWBqiT9XH45MiQxSosGJ56H/0F2cjcCFd72l1665RNHURdC3lspI77esfJsl+rXXabkAy7vxDXG/XGGcKpwiKDPFfvMEgjkAHil4Za1F36RnyxxvdIAzvgfH8knukYDck07tc++DP4TdWeI7HXuq5Yl6VVFrUQtf64/dkXewlKZSHQo6YvCSpREB0GDrz+Ys2GfO8nw2SwrYwaf88AifzlPvP17bf1mI3AuccJvAjZIpBmqvharKFAebEjVKfGAwpQjWoXlm9LROsq9bCk1UeQ3CJxJqprzssS/Q04JeS1ReCCubL3J7sx86spkP4eNpp95UF+8K748icIs8vdILFklk9skQqi1So6cx3X906pvy1vz+KipTJ8fiVJxsV5MmT0XwA";
var S0 = 44032;
var L0 = 4352;
var V0 = 4449;
var T0 = 4519;
var L_COUNT = 19;
var V_COUNT = 21;
var T_COUNT = 28;
var N_COUNT = V_COUNT * T_COUNT;
var S_COUNT = L_COUNT * N_COUNT;
var S1 = S0 + S_COUNT;
var L1 = L0 + L_COUNT;
var V1 = V0 + V_COUNT;
var T1 = T0 + T_COUNT;
function unpack_cc(packed) {
  return packed >> 24 & 255;
}
function unpack_cp(packed) {
  return packed & 16777215;
}
var SHIFTED_RANK;
var EXCLUSIONS;
var DECOMP;
var RECOMP;
function init$1() {
  let r = read_compressed_payload(COMPRESSED);
  SHIFTED_RANK = new Map(read_sorted_arrays(r).flatMap((v, i) => v.map((x) => [x, i + 1 << 24])));
  EXCLUSIONS = new Set(read_sorted(r));
  DECOMP = /* @__PURE__ */ new Map();
  RECOMP = /* @__PURE__ */ new Map();
  for (let [cp, cps] of read_mapped(r)) {
    if (!EXCLUSIONS.has(cp) && cps.length == 2) {
      let [a, b] = cps;
      let bucket = RECOMP.get(a);
      if (!bucket) {
        bucket = /* @__PURE__ */ new Map();
        RECOMP.set(a, bucket);
      }
      bucket.set(b, cp);
    }
    DECOMP.set(cp, cps.reverse());
  }
}
function is_hangul(cp) {
  return cp >= S0 && cp < S1;
}
function compose_pair(a, b) {
  if (a >= L0 && a < L1 && b >= V0 && b < V1) {
    return S0 + (a - L0) * N_COUNT + (b - V0) * T_COUNT;
  } else if (is_hangul(a) && b > T0 && b < T1 && (a - S0) % T_COUNT == 0) {
    return a + (b - T0);
  } else {
    let recomp = RECOMP.get(a);
    if (recomp) {
      recomp = recomp.get(b);
      if (recomp) {
        return recomp;
      }
    }
    return -1;
  }
}
function decomposed(cps) {
  if (!SHIFTED_RANK) init$1();
  let ret = [];
  let buf = [];
  let check_order = false;
  function add(cp) {
    let cc = SHIFTED_RANK.get(cp);
    if (cc) {
      check_order = true;
      cp |= cc;
    }
    ret.push(cp);
  }
  for (let cp of cps) {
    while (true) {
      if (cp < 128) {
        ret.push(cp);
      } else if (is_hangul(cp)) {
        let s_index = cp - S0;
        let l_index = s_index / N_COUNT | 0;
        let v_index = s_index % N_COUNT / T_COUNT | 0;
        let t_index = s_index % T_COUNT;
        add(L0 + l_index);
        add(V0 + v_index);
        if (t_index > 0) add(T0 + t_index);
      } else {
        let mapped = DECOMP.get(cp);
        if (mapped) {
          buf.push(...mapped);
        } else {
          add(cp);
        }
      }
      if (!buf.length) break;
      cp = buf.pop();
    }
  }
  if (check_order && ret.length > 1) {
    let prev_cc = unpack_cc(ret[0]);
    for (let i = 1; i < ret.length; i++) {
      let cc = unpack_cc(ret[i]);
      if (cc == 0 || prev_cc <= cc) {
        prev_cc = cc;
        continue;
      }
      let j = i - 1;
      while (true) {
        let tmp = ret[j + 1];
        ret[j + 1] = ret[j];
        ret[j] = tmp;
        if (!j) break;
        prev_cc = unpack_cc(ret[--j]);
        if (prev_cc <= cc) break;
      }
      prev_cc = unpack_cc(ret[i]);
    }
  }
  return ret;
}
function composed_from_decomposed(v) {
  let ret = [];
  let stack = [];
  let prev_cp = -1;
  let prev_cc = 0;
  for (let packed of v) {
    let cc = unpack_cc(packed);
    let cp = unpack_cp(packed);
    if (prev_cp == -1) {
      if (cc == 0) {
        prev_cp = cp;
      } else {
        ret.push(cp);
      }
    } else if (prev_cc > 0 && prev_cc >= cc) {
      if (cc == 0) {
        ret.push(prev_cp, ...stack);
        stack.length = 0;
        prev_cp = cp;
      } else {
        stack.push(cp);
      }
      prev_cc = cc;
    } else {
      let composed = compose_pair(prev_cp, cp);
      if (composed >= 0) {
        prev_cp = composed;
      } else if (prev_cc == 0 && cc == 0) {
        ret.push(prev_cp);
        prev_cp = cp;
      } else {
        stack.push(cp);
        prev_cc = cc;
      }
    }
  }
  if (prev_cp >= 0) {
    ret.push(prev_cp, ...stack);
  }
  return ret;
}
function nfd(cps) {
  return decomposed(cps).map(unpack_cp);
}
function nfc(cps) {
  return composed_from_decomposed(decomposed(cps));
}
var HYPHEN = 45;
var STOP_CH = ".";
var FE0F = 65039;
var UNIQUE_PH = 1;
var Array_from = (x) => Array.from(x);
function group_has_cp(g, cp) {
  return g.P.has(cp) || g.Q.has(cp);
}
var Emoji = class extends Array {
  get is_emoji() {
    return true;
  }
  // free tagging system
};
var MAPPED;
var IGNORED;
var CM;
var NSM;
var ESCAPE;
var NFC_CHECK;
var GROUPS;
var WHOLE_VALID;
var WHOLE_MAP;
var VALID;
var EMOJI_LIST;
var EMOJI_ROOT;
function init() {
  if (MAPPED) return;
  let r = read_compressed_payload(COMPRESSED$1);
  const read_sorted_array = () => read_sorted(r);
  const read_sorted_set = () => new Set(read_sorted_array());
  const set_add_many = (set, v) => v.forEach((x) => set.add(x));
  MAPPED = new Map(read_mapped(r));
  IGNORED = read_sorted_set();
  CM = read_sorted_array();
  NSM = new Set(read_sorted_array().map((i) => CM[i]));
  CM = new Set(CM);
  ESCAPE = read_sorted_set();
  NFC_CHECK = read_sorted_set();
  let chunks = read_sorted_arrays(r);
  let unrestricted = r();
  const read_chunked = () => {
    let set = /* @__PURE__ */ new Set();
    read_sorted_array().forEach((i) => set_add_many(set, chunks[i]));
    set_add_many(set, read_sorted_array());
    return set;
  };
  GROUPS = read_array_while((i) => {
    let N = read_array_while(r).map((x) => x + 96);
    if (N.length) {
      let R = i >= unrestricted;
      N[0] -= 32;
      N = str_from_cps(N);
      if (R) N = `Restricted[${N}]`;
      let P = read_chunked();
      let Q = read_chunked();
      let M = !r();
      return { N, P, Q, M, R };
    }
  });
  WHOLE_VALID = read_sorted_set();
  WHOLE_MAP = /* @__PURE__ */ new Map();
  let wholes = read_sorted_array().concat(Array_from(WHOLE_VALID)).sort((a, b) => a - b);
  wholes.forEach((cp, i) => {
    let d = r();
    let w = wholes[i] = d ? wholes[i - d] : { V: [], M: /* @__PURE__ */ new Map() };
    w.V.push(cp);
    if (!WHOLE_VALID.has(cp)) {
      WHOLE_MAP.set(cp, w);
    }
  });
  for (let { V, M } of new Set(WHOLE_MAP.values())) {
    let recs = [];
    for (let cp of V) {
      let gs = GROUPS.filter((g) => group_has_cp(g, cp));
      let rec = recs.find(({ G }) => gs.some((g) => G.has(g)));
      if (!rec) {
        rec = { G: /* @__PURE__ */ new Set(), V: [] };
        recs.push(rec);
      }
      rec.V.push(cp);
      set_add_many(rec.G, gs);
    }
    let union = recs.flatMap((x) => Array_from(x.G));
    for (let { G, V: V2 } of recs) {
      let complement = new Set(union.filter((g) => !G.has(g)));
      for (let cp of V2) {
        M.set(cp, complement);
      }
    }
  }
  VALID = /* @__PURE__ */ new Set();
  let multi = /* @__PURE__ */ new Set();
  const add_to_union = (cp) => VALID.has(cp) ? multi.add(cp) : VALID.add(cp);
  for (let g of GROUPS) {
    for (let cp of g.P) add_to_union(cp);
    for (let cp of g.Q) add_to_union(cp);
  }
  for (let cp of VALID) {
    if (!WHOLE_MAP.has(cp) && !multi.has(cp)) {
      WHOLE_MAP.set(cp, UNIQUE_PH);
    }
  }
  set_add_many(VALID, nfd(VALID));
  EMOJI_LIST = read_trie(r).map((v) => Emoji.from(v)).sort(compare_arrays);
  EMOJI_ROOT = /* @__PURE__ */ new Map();
  for (let cps of EMOJI_LIST) {
    let prev = [EMOJI_ROOT];
    for (let cp of cps) {
      let next = prev.map((node) => {
        let child = node.get(cp);
        if (!child) {
          child = /* @__PURE__ */ new Map();
          node.set(cp, child);
        }
        return child;
      });
      if (cp === FE0F) {
        prev.push(...next);
      } else {
        prev = next;
      }
    }
    for (let x of prev) {
      x.V = cps;
    }
  }
}
function quoted_cp(cp) {
  return (should_escape(cp) ? "" : `${bidi_qq(safe_str_from_cps([cp]))} `) + quote_cp(cp);
}
function bidi_qq(s) {
  return `"${s}"‎`;
}
function check_label_extension(cps) {
  if (cps.length >= 4 && cps[2] == HYPHEN && cps[3] == HYPHEN) {
    throw new Error(`invalid label extension: "${str_from_cps(cps.slice(0, 4))}"`);
  }
}
function check_leading_underscore(cps) {
  const UNDERSCORE = 95;
  for (let i = cps.lastIndexOf(UNDERSCORE); i > 0; ) {
    if (cps[--i] !== UNDERSCORE) {
      throw new Error("underscore allowed only at start");
    }
  }
}
function check_fenced(cps) {
  let cp = cps[0];
  let prev = FENCED.get(cp);
  if (prev) throw error_placement(`leading ${prev}`);
  let n = cps.length;
  let last = -1;
  for (let i = 1; i < n; i++) {
    cp = cps[i];
    let match = FENCED.get(cp);
    if (match) {
      if (last == i) throw error_placement(`${prev} + ${match}`);
      last = i + 1;
      prev = match;
    }
  }
  if (last == n) throw error_placement(`trailing ${prev}`);
}
function safe_str_from_cps(cps, max = Infinity, quoter = quote_cp) {
  let buf = [];
  if (is_combining_mark(cps[0])) buf.push("◌");
  if (cps.length > max) {
    max >>= 1;
    cps = [...cps.slice(0, max), 8230, ...cps.slice(-max)];
  }
  let prev = 0;
  let n = cps.length;
  for (let i = 0; i < n; i++) {
    let cp = cps[i];
    if (should_escape(cp)) {
      buf.push(str_from_cps(cps.slice(prev, i)));
      buf.push(quoter(cp));
      prev = i + 1;
    }
  }
  buf.push(str_from_cps(cps.slice(prev, n)));
  return buf.join("");
}
function is_combining_mark(cp, only_nsm) {
  init();
  return only_nsm ? NSM.has(cp) : CM.has(cp);
}
function should_escape(cp) {
  init();
  return ESCAPE.has(cp);
}
function ens_normalize(name) {
  return flatten(split(name, nfc, filter_fe0f));
}
function split(name, nf, ef) {
  if (!name) return [];
  init();
  let offset = 0;
  return name.split(STOP_CH).map((label) => {
    let input = explode_cp(label);
    let info = {
      input,
      offset
      // codepoint, not substring!
    };
    offset += input.length + 1;
    try {
      let tokens = info.tokens = tokens_from_str(input, nf, ef);
      let token_count = tokens.length;
      let type6;
      if (!token_count) {
        throw new Error(`empty label`);
      }
      let norm = info.output = tokens.flat();
      check_leading_underscore(norm);
      let emoji = info.emoji = token_count > 1 || tokens[0].is_emoji;
      if (!emoji && norm.every((cp) => cp < 128)) {
        check_label_extension(norm);
        type6 = "ASCII";
      } else {
        let chars = tokens.flatMap((x) => x.is_emoji ? [] : x);
        if (!chars.length) {
          type6 = "Emoji";
        } else {
          if (CM.has(norm[0])) throw error_placement("leading combining mark");
          for (let i = 1; i < token_count; i++) {
            let cps = tokens[i];
            if (!cps.is_emoji && CM.has(cps[0])) {
              throw error_placement(`emoji + combining mark: "${str_from_cps(tokens[i - 1])} + ${safe_str_from_cps([cps[0]])}"`);
            }
          }
          check_fenced(norm);
          let unique = Array_from(new Set(chars));
          let [g] = determine_group(unique);
          check_group(g, chars);
          check_whole(g, unique);
          type6 = g.N;
        }
      }
      info.type = type6;
    } catch (err) {
      info.error = err;
    }
    return info;
  });
}
function check_whole(group, unique) {
  let maker;
  let shared = [];
  for (let cp of unique) {
    let whole = WHOLE_MAP.get(cp);
    if (whole === UNIQUE_PH) return;
    if (whole) {
      let set = whole.M.get(cp);
      maker = maker ? maker.filter((g) => set.has(g)) : Array_from(set);
      if (!maker.length) return;
    } else {
      shared.push(cp);
    }
  }
  if (maker) {
    for (let g of maker) {
      if (shared.every((cp) => group_has_cp(g, cp))) {
        throw new Error(`whole-script confusable: ${group.N}/${g.N}`);
      }
    }
  }
}
function determine_group(unique) {
  let groups = GROUPS;
  for (let cp of unique) {
    let gs = groups.filter((g) => group_has_cp(g, cp));
    if (!gs.length) {
      if (!GROUPS.some((g) => group_has_cp(g, cp))) {
        throw error_disallowed(cp);
      } else {
        throw error_group_member(groups[0], cp);
      }
    }
    groups = gs;
    if (gs.length == 1) break;
  }
  return groups;
}
function flatten(split2) {
  return split2.map(({ input, error, output }) => {
    if (error) {
      let msg = error.message;
      throw new Error(split2.length == 1 ? msg : `Invalid label ${bidi_qq(safe_str_from_cps(input, 63))}: ${msg}`);
    }
    return str_from_cps(output);
  }).join(STOP_CH);
}
function error_disallowed(cp) {
  return new Error(`disallowed character: ${quoted_cp(cp)}`);
}
function error_group_member(g, cp) {
  let quoted = quoted_cp(cp);
  let gg = GROUPS.find((g2) => g2.P.has(cp));
  if (gg) {
    quoted = `${gg.N} ${quoted}`;
  }
  return new Error(`illegal mixture: ${g.N} + ${quoted}`);
}
function error_placement(where) {
  return new Error(`illegal placement: ${where}`);
}
function check_group(g, cps) {
  for (let cp of cps) {
    if (!group_has_cp(g, cp)) {
      throw error_group_member(g, cp);
    }
  }
  if (g.M) {
    let decomposed2 = nfd(cps);
    for (let i = 1, e = decomposed2.length; i < e; i++) {
      if (NSM.has(decomposed2[i])) {
        let j = i + 1;
        for (let cp; j < e && NSM.has(cp = decomposed2[j]); j++) {
          for (let k = i; k < j; k++) {
            if (decomposed2[k] == cp) {
              throw new Error(`duplicate non-spacing marks: ${quoted_cp(cp)}`);
            }
          }
        }
        if (j - i > NSM_MAX) {
          throw new Error(`excessive non-spacing marks: ${bidi_qq(safe_str_from_cps(decomposed2.slice(i - 1, j)))} (${j - i}/${NSM_MAX})`);
        }
        i = j;
      }
    }
  }
}
function tokens_from_str(input, nf, ef) {
  let ret = [];
  let chars = [];
  input = input.slice().reverse();
  while (input.length) {
    let emoji = consume_emoji_reversed(input);
    if (emoji) {
      if (chars.length) {
        ret.push(nf(chars));
        chars = [];
      }
      ret.push(ef(emoji));
    } else {
      let cp = input.pop();
      if (VALID.has(cp)) {
        chars.push(cp);
      } else {
        let cps = MAPPED.get(cp);
        if (cps) {
          chars.push(...cps);
        } else if (!IGNORED.has(cp)) {
          throw error_disallowed(cp);
        }
      }
    }
  }
  if (chars.length) {
    ret.push(nf(chars));
  }
  return ret;
}
function filter_fe0f(cps) {
  return cps.filter((cp) => cp != FE0F);
}
function consume_emoji_reversed(cps, eaten) {
  let node = EMOJI_ROOT;
  let emoji;
  let pos = cps.length;
  while (pos) {
    node = node.get(cps[--pos]);
    if (!node) break;
    let { V } = node;
    if (V) {
      emoji = V;
      if (eaten) eaten.push(...cps.slice(pos).reverse());
      cps.length = pos;
    }
  }
  return emoji;
}

// node_modules/ox/_esm/core/Abi.js
var Abi_exports = {};
__export(Abi_exports, {
  format: () => format2,
  from: () => from6
});

// node_modules/ox/_esm/core/internal/abi.js
function isSignatures(value) {
  for (const item of value) {
    if (typeof item !== "string")
      return false;
  }
  return true;
}

// node_modules/ox/_esm/core/Abi.js
function format2(abi) {
  return formatAbi(abi);
}
function from6(abi) {
  if (isSignatures(abi))
    return parseAbi(abi);
  return abi;
}

// node_modules/ox/_esm/core/AbiError.js
var AbiError_exports = {};
__export(AbiError_exports, {
  decode: () => decode2,
  encode: () => encode2,
  format: () => format3,
  from: () => from7,
  fromAbi: () => fromAbi2,
  getSelector: () => getSelector2,
  panicReasons: () => panicReasons,
  solidityError: () => solidityError,
  solidityErrorSelector: () => solidityErrorSelector,
  solidityPanic: () => solidityPanic,
  solidityPanicSelector: () => solidityPanicSelector
});
function decode2(abiError, data, options = {}) {
  if (size2(data) < 4)
    throw new InvalidSelectorSizeError({ data });
  if (abiError.inputs.length === 0)
    return void 0;
  const values = decode(abiError.inputs, slice2(data, 4), options);
  if (values && Object.keys(values).length === 1) {
    if (Array.isArray(values))
      return values[0];
    return Object.values(values)[0];
  }
  return values;
}
function encode2(abiError, ...args) {
  const selector = getSelector2(abiError);
  const data = args.length > 0 ? encode(abiError.inputs, args[0]) : void 0;
  return data ? concat2(selector, data) : selector;
}
function format3(abiError) {
  return formatAbiItem(abiError);
}
function from7(abiError, options = {}) {
  return from5(abiError, options);
}
function fromAbi2(abi, name, options) {
  if (name === "Error")
    return solidityError;
  if (name === "Panic")
    return solidityPanic;
  if (validate2(name, { strict: false })) {
    const selector = slice2(name, 0, 4);
    if (selector === solidityErrorSelector)
      return solidityError;
    if (selector === solidityPanicSelector)
      return solidityPanic;
  }
  const item = fromAbi(abi, name, options);
  if (item.type !== "error")
    throw new NotFoundError({ name, type: "error" });
  return item;
}
function getSelector2(abiItem) {
  return getSelector(abiItem);
}
var panicReasons = {
  1: "An `assert` condition failed.",
  17: "Arithmetic operation resulted in underflow or overflow.",
  18: "Division or modulo by zero (e.g. `5 / 0` or `23 % 0`).",
  33: "Attempted to convert to an invalid type.",
  34: "Attempted to access a storage byte array that is incorrectly encoded.",
  49: "Performed `.pop()` on an empty array",
  50: "Array index is out of bounds.",
  65: "Allocated too much memory or created an array which is too large.",
  81: "Attempted to call a zero-initialized variable of internal function type."
};
var solidityError = from7({
  inputs: [
    {
      name: "message",
      type: "string"
    }
  ],
  name: "Error",
  type: "error"
});
var solidityErrorSelector = "0x08c379a0";
var solidityPanic = from7({
  inputs: [
    {
      name: "reason",
      type: "uint8"
    }
  ],
  name: "Panic",
  type: "error"
});
var solidityPanicSelector = "0x4e487b71";

// node_modules/ox/_esm/core/AbiEvent.js
var AbiEvent_exports = {};
__export(AbiEvent_exports, {
  ArgsMismatchError: () => ArgsMismatchError,
  DataMismatchError: () => DataMismatchError,
  FilterTypeNotSupportedError: () => FilterTypeNotSupportedError,
  InputNotFoundError: () => InputNotFoundError,
  SelectorTopicMismatchError: () => SelectorTopicMismatchError,
  TopicsMismatchError: () => TopicsMismatchError,
  assertArgs: () => assertArgs,
  decode: () => decode3,
  encode: () => encode3,
  format: () => format4,
  from: () => from8,
  fromAbi: () => fromAbi3,
  getSelector: () => getSelector3
});
function assertArgs(abiEvent, args, matchArgs) {
  if (!args || !matchArgs)
    throw new ArgsMismatchError({
      abiEvent,
      expected: args,
      given: matchArgs
    });
  function isEqual2(input, value, arg) {
    if (input.type === "address")
      return isEqual(value, arg);
    if (input.type === "string")
      return keccak256(fromString(value)) === arg;
    if (input.type === "bytes")
      return keccak256(value) === arg;
    return value === arg;
  }
  if (Array.isArray(args) && Array.isArray(matchArgs)) {
    for (const [index2, value] of matchArgs.entries()) {
      if (value === null || value === void 0)
        continue;
      const input = abiEvent.inputs[index2];
      if (!input)
        throw new InputNotFoundError({
          abiEvent,
          name: `${index2}`
        });
      const value_ = Array.isArray(value) ? value : [value];
      let equal = false;
      for (const value2 of value_) {
        if (isEqual2(input, value2, args[index2]))
          equal = true;
      }
      if (!equal)
        throw new ArgsMismatchError({
          abiEvent,
          expected: args,
          given: matchArgs
        });
    }
  }
  if (typeof args === "object" && !Array.isArray(args) && typeof matchArgs === "object" && !Array.isArray(matchArgs))
    for (const [key, value] of Object.entries(matchArgs)) {
      if (value === null || value === void 0)
        continue;
      const input = abiEvent.inputs.find((input2) => input2.name === key);
      if (!input)
        throw new InputNotFoundError({ abiEvent, name: key });
      const value_ = Array.isArray(value) ? value : [value];
      let equal = false;
      for (const value2 of value_) {
        if (isEqual2(input, value2, args[key]))
          equal = true;
      }
      if (!equal)
        throw new ArgsMismatchError({
          abiEvent,
          expected: args,
          given: matchArgs
        });
    }
}
function decode3(abiEvent, log) {
  const { data, topics } = log;
  const [selector_, ...argTopics] = topics;
  const selector = getSelector3(abiEvent);
  if (selector_ !== selector)
    throw new SelectorTopicMismatchError({
      abiEvent,
      actual: selector_,
      expected: selector
    });
  const { inputs } = abiEvent;
  const isUnnamed = inputs == null ? void 0 : inputs.every((x) => !("name" in x && x.name));
  let args = isUnnamed ? [] : {};
  const indexedInputs = inputs.filter((x) => "indexed" in x && x.indexed);
  for (let i = 0; i < indexedInputs.length; i++) {
    const param = indexedInputs[i];
    const topic = argTopics[i];
    if (!topic)
      throw new TopicsMismatchError({
        abiEvent,
        param
      });
    args[isUnnamed ? i : param.name || i] = (() => {
      if (param.type === "string" || param.type === "bytes" || param.type === "tuple" || param.type.match(/^(.*)\[(\d+)?\]$/))
        return topic;
      const decoded = decode([param], topic) || [];
      return decoded[0];
    })();
  }
  const nonIndexedInputs = inputs.filter((x) => !("indexed" in x && x.indexed));
  if (nonIndexedInputs.length > 0) {
    if (data && data !== "0x") {
      try {
        const decodedData = decode(nonIndexedInputs, data);
        if (decodedData) {
          if (isUnnamed)
            args = [...args, ...decodedData];
          else {
            for (let i = 0; i < nonIndexedInputs.length; i++) {
              const index2 = inputs.indexOf(nonIndexedInputs[i]);
              args[nonIndexedInputs[i].name || index2] = decodedData[i];
            }
          }
        }
      } catch (err) {
        if (err instanceof DataSizeTooSmallError || err instanceof PositionOutOfBoundsError)
          throw new DataMismatchError({
            abiEvent,
            data,
            parameters: nonIndexedInputs,
            size: size2(data)
          });
        throw err;
      }
    } else {
      throw new DataMismatchError({
        abiEvent,
        data: "0x",
        parameters: nonIndexedInputs,
        size: 0
      });
    }
  }
  return Object.values(args).length > 0 ? args : void 0;
}
function encode3(abiEvent, ...[args]) {
  let topics = [];
  if (args && abiEvent.inputs) {
    const indexedInputs = abiEvent.inputs.filter((param) => "indexed" in param && param.indexed);
    const args_ = Array.isArray(args) ? args : Object.values(args).length > 0 ? (indexedInputs == null ? void 0 : indexedInputs.map((x, i) => args[x.name ?? i])) ?? [] : [];
    if (args_.length > 0) {
      const encode7 = (param, value) => {
        if (param.type === "string")
          return keccak256(fromString2(value));
        if (param.type === "bytes")
          return keccak256(value);
        if (param.type === "tuple" || param.type.match(/^(.*)\[(\d+)?\]$/))
          throw new FilterTypeNotSupportedError(param.type);
        return encode([param], [value]);
      };
      topics = (indexedInputs == null ? void 0 : indexedInputs.map((param, i) => {
        if (Array.isArray(args_[i]))
          return args_[i].map((_, j) => encode7(param, args_[i][j]));
        return args_[i] ? encode7(param, args_[i]) : null;
      })) ?? [];
    }
  }
  const selector = (() => {
    if (abiEvent.hash)
      return abiEvent.hash;
    return getSelector3(abiEvent);
  })();
  return { topics: [selector, ...topics] };
}
function format4(abiEvent) {
  return formatAbiItem(abiEvent);
}
function from8(abiEvent, options = {}) {
  return from5(abiEvent, options);
}
function fromAbi3(abi, name, options) {
  const item = fromAbi(abi, name, options);
  if (item.type !== "event")
    throw new NotFoundError({ name, type: "event" });
  return item;
}
function getSelector3(abiItem) {
  return getSignatureHash(abiItem);
}
var ArgsMismatchError = class extends BaseError {
  constructor({ abiEvent, expected, given }) {
    super("Given arguments do not match the expected arguments.", {
      metaMessages: [
        `Event: ${format4(abiEvent)}`,
        `Expected Arguments: ${!expected ? "None" : ""}`,
        expected ? prettyPrint(expected) : void 0,
        `Given Arguments: ${!given ? "None" : ""}`,
        given ? prettyPrint(given) : void 0
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiEvent.ArgsMismatchError"
    });
  }
};
var InputNotFoundError = class extends BaseError {
  constructor({ abiEvent, name }) {
    super(`Parameter "${name}" not found on \`${format4(abiEvent)}\`.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiEvent.InputNotFoundError"
    });
  }
};
var DataMismatchError = class extends BaseError {
  constructor({ abiEvent, data, parameters, size: size4 }) {
    super([
      `Data size of ${size4} bytes is too small for non-indexed event parameters.`
    ].join("\n"), {
      metaMessages: [
        `Non-indexed Parameters: (${format(parameters)})`,
        `Data:   ${data} (${size4} bytes)`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiEvent.DataMismatchError"
    });
    Object.defineProperty(this, "abiEvent", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "parameters", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "size", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.abiEvent = abiEvent;
    this.data = data;
    this.parameters = parameters;
    this.size = size4;
  }
};
var TopicsMismatchError = class extends BaseError {
  constructor({ abiEvent, param }) {
    super([
      `Expected a topic for indexed event parameter${param.name ? ` "${param.name}"` : ""} for "${format4(abiEvent)}".`
    ].join("\n"));
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiEvent.TopicsMismatchError"
    });
    Object.defineProperty(this, "abiEvent", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.abiEvent = abiEvent;
  }
};
var SelectorTopicMismatchError = class extends BaseError {
  constructor({ abiEvent, actual, expected }) {
    super(`topics[0]="${actual}" does not match the expected topics[0]="${expected}".`, {
      metaMessages: [`Event: ${format4(abiEvent)}`, `Selector: ${expected}`]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiEvent.SelectorTopicMismatchError"
    });
  }
};
var FilterTypeNotSupportedError = class extends BaseError {
  constructor(type6) {
    super(`Filter type "${type6}" is not supported.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiEvent.FilterTypeNotSupportedError"
    });
  }
};

// node_modules/ox/_esm/core/AccessList.js
var AccessList_exports = {};
__export(AccessList_exports, {
  InvalidStorageKeySizeError: () => InvalidStorageKeySizeError,
  fromTupleList: () => fromTupleList,
  toTupleList: () => toTupleList
});
function fromTupleList(accessList) {
  const list = [];
  for (let i = 0; i < accessList.length; i++) {
    const [address, storageKeys] = accessList[i];
    if (address)
      assert(address, { strict: false });
    list.push({
      address,
      storageKeys: storageKeys.map((key) => validate3(key) ? key : trimLeft(key))
    });
  }
  return list;
}
function toTupleList(accessList) {
  if (!accessList || accessList.length === 0)
    return [];
  const tuple = [];
  for (const { address, storageKeys } of accessList) {
    for (let j = 0; j < storageKeys.length; j++)
      if (size2(storageKeys[j]) !== 32)
        throw new InvalidStorageKeySizeError({
          storageKey: storageKeys[j]
        });
    if (address)
      assert(address, { strict: false });
    tuple.push([address, storageKeys]);
  }
  return tuple;
}
var InvalidStorageKeySizeError = class extends BaseError {
  constructor({ storageKey: storageKey6 }) {
    super(`Size for storage key "${storageKey6}" is invalid. Expected 32 bytes. Got ${size2(storageKey6)} bytes.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AccessList.InvalidStorageKeySizeError"
    });
  }
};

// node_modules/ox/_esm/core/AccountProof.js
var AccountProof_exports = {};

// node_modules/ox/_esm/core/AesGcm.js
var AesGcm_exports = {};
__export(AesGcm_exports, {
  decrypt: () => decrypt,
  encrypt: () => encrypt,
  getKey: () => getKey,
  ivLength: () => ivLength,
  randomSalt: () => randomSalt
});
var ivLength = 16;
async function decrypt(value, key, options = {}) {
  const { as = typeof value === "string" ? "Hex" : "Bytes" } = options;
  const encrypted = from(value);
  const iv = encrypted.slice(0, ivLength);
  const data = encrypted.slice(ivLength);
  const decrypted = await globalThis.crypto.subtle.decrypt({
    name: "AES-GCM",
    iv
  }, key, from(data));
  const result = new Uint8Array(decrypted);
  if (as === "Bytes")
    return result;
  return from2(result);
}
async function encrypt(value, key, options = {}) {
  const { as = typeof value === "string" ? "Hex" : "Bytes" } = options;
  const iv = random(ivLength);
  const encrypted = await globalThis.crypto.subtle.encrypt({
    name: "AES-GCM",
    iv
  }, key, from(value));
  const result = concat(iv, new Uint8Array(encrypted));
  if (as === "Bytes")
    return result;
  return from2(result);
}
async function getKey(options) {
  const { iterations = 9e5, password, salt = randomSalt(32) } = options;
  const baseKey = await globalThis.crypto.subtle.importKey("raw", fromString(password), { name: "PBKDF2" }, false, ["deriveBits", "deriveKey"]);
  const key = await globalThis.crypto.subtle.deriveKey({
    name: "PBKDF2",
    salt,
    iterations,
    hash: "SHA-256"
  }, baseKey, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  return key;
}
function randomSalt(size4 = 32) {
  return random(size4);
}

// node_modules/ox/_esm/core/Authorization.js
var Authorization_exports = {};
__export(Authorization_exports, {
  from: () => from11,
  fromRpc: () => fromRpc3,
  fromRpcList: () => fromRpcList,
  fromTuple: () => fromTuple2,
  fromTupleList: () => fromTupleList2,
  getSignPayload: () => getSignPayload,
  hash: () => hash,
  toRpc: () => toRpc3,
  toRpcList: () => toRpcList,
  toTuple: () => toTuple2,
  toTupleList: () => toTupleList2
});

// node_modules/ox/_esm/core/Rlp.js
var Rlp_exports = {};
__export(Rlp_exports, {
  decodeRlpCursor: () => decodeRlpCursor,
  from: () => from9,
  fromBytes: () => fromBytes2,
  fromHex: () => fromHex2,
  readLength: () => readLength,
  readList: () => readList,
  to: () => to,
  toBytes: () => toBytes4,
  toHex: () => toHex3
});
function toBytes4(value) {
  return to(value, "Bytes");
}
function toHex3(value) {
  return to(value, "Hex");
}
function to(value, to3) {
  const to_ = to3 ?? (typeof value === "string" ? "Hex" : "Bytes");
  const bytes = (() => {
    if (typeof value === "string") {
      if (value.length > 3 && value.length % 2 !== 0)
        throw new InvalidLengthError(value);
      return fromHex(value);
    }
    return value;
  })();
  const cursor = create(bytes, {
    recursiveReadLimit: Number.POSITIVE_INFINITY
  });
  const result = decodeRlpCursor(cursor, to_);
  return result;
}
function decodeRlpCursor(cursor, to3 = "Hex") {
  if (cursor.bytes.length === 0)
    return to3 === "Hex" ? fromBytes(cursor.bytes) : cursor.bytes;
  const prefix = cursor.readByte();
  if (prefix < 128)
    cursor.decrementPosition(1);
  if (prefix < 192) {
    const length2 = readLength(cursor, prefix, 128);
    const bytes = cursor.readBytes(length2);
    return to3 === "Hex" ? fromBytes(bytes) : bytes;
  }
  const length = readLength(cursor, prefix, 192);
  return readList(cursor, length, to3);
}
function readLength(cursor, prefix, offset) {
  if (offset === 128 && prefix < 128)
    return 1;
  if (prefix <= offset + 55)
    return prefix - offset;
  if (prefix === offset + 55 + 1)
    return cursor.readUint8();
  if (prefix === offset + 55 + 2)
    return cursor.readUint16();
  if (prefix === offset + 55 + 3)
    return cursor.readUint24();
  if (prefix === offset + 55 + 4)
    return cursor.readUint32();
  throw new BaseError("Invalid RLP prefix");
}
function readList(cursor, length, to3) {
  const position = cursor.position;
  const value = [];
  while (cursor.position - position < length)
    value.push(decodeRlpCursor(cursor, to3));
  return value;
}
function from9(value, options) {
  const { as } = options;
  const encodable = getEncodable(value);
  const cursor = create(new Uint8Array(encodable.length));
  encodable.encode(cursor);
  if (as === "Hex")
    return fromBytes(cursor.bytes);
  return cursor.bytes;
}
function fromBytes2(bytes, options = {}) {
  const { as = "Bytes" } = options;
  return from9(bytes, { as });
}
function fromHex2(hex2, options = {}) {
  const { as = "Hex" } = options;
  return from9(hex2, { as });
}
function getEncodable(bytes) {
  if (Array.isArray(bytes))
    return getEncodableList(bytes.map((x) => getEncodable(x)));
  return getEncodableBytes(bytes);
}
function getEncodableList(list) {
  const bodyLength = list.reduce((acc, x) => acc + x.length, 0);
  const sizeOfBodyLength = getSizeOfLength(bodyLength);
  const length = (() => {
    if (bodyLength <= 55)
      return 1 + bodyLength;
    return 1 + sizeOfBodyLength + bodyLength;
  })();
  return {
    length,
    encode(cursor) {
      if (bodyLength <= 55) {
        cursor.pushByte(192 + bodyLength);
      } else {
        cursor.pushByte(192 + 55 + sizeOfBodyLength);
        if (sizeOfBodyLength === 1)
          cursor.pushUint8(bodyLength);
        else if (sizeOfBodyLength === 2)
          cursor.pushUint16(bodyLength);
        else if (sizeOfBodyLength === 3)
          cursor.pushUint24(bodyLength);
        else
          cursor.pushUint32(bodyLength);
      }
      for (const { encode: encode7 } of list) {
        encode7(cursor);
      }
    }
  };
}
function getEncodableBytes(bytesOrHex) {
  const bytes = typeof bytesOrHex === "string" ? fromHex(bytesOrHex) : bytesOrHex;
  const sizeOfBytesLength = getSizeOfLength(bytes.length);
  const length = (() => {
    if (bytes.length === 1 && bytes[0] < 128)
      return 1;
    if (bytes.length <= 55)
      return 1 + bytes.length;
    return 1 + sizeOfBytesLength + bytes.length;
  })();
  return {
    length,
    encode(cursor) {
      if (bytes.length === 1 && bytes[0] < 128) {
        cursor.pushBytes(bytes);
      } else if (bytes.length <= 55) {
        cursor.pushByte(128 + bytes.length);
        cursor.pushBytes(bytes);
      } else {
        cursor.pushByte(128 + 55 + sizeOfBytesLength);
        if (sizeOfBytesLength === 1)
          cursor.pushUint8(bytes.length);
        else if (sizeOfBytesLength === 2)
          cursor.pushUint16(bytes.length);
        else if (sizeOfBytesLength === 3)
          cursor.pushUint24(bytes.length);
        else
          cursor.pushUint32(bytes.length);
        cursor.pushBytes(bytes);
      }
    }
  };
}
function getSizeOfLength(length) {
  if (length < 2 ** 8)
    return 1;
  if (length < 2 ** 16)
    return 2;
  if (length < 2 ** 24)
    return 3;
  if (length < 2 ** 32)
    return 4;
  throw new BaseError("Length is too large.");
}

// node_modules/ox/_esm/core/Signature.js
var Signature_exports = {};
__export(Signature_exports, {
  InvalidRError: () => InvalidRError,
  InvalidSError: () => InvalidSError,
  InvalidSerializedSizeError: () => InvalidSerializedSizeError,
  InvalidVError: () => InvalidVError,
  InvalidYParityError: () => InvalidYParityError,
  MissingPropertiesError: () => MissingPropertiesError,
  assert: () => assert2,
  extract: () => extract,
  from: () => from10,
  fromBytes: () => fromBytes3,
  fromDerBytes: () => fromDerBytes,
  fromDerHex: () => fromDerHex,
  fromHex: () => fromHex3,
  fromLegacy: () => fromLegacy,
  fromRpc: () => fromRpc2,
  fromTuple: () => fromTuple,
  toBytes: () => toBytes5,
  toDerBytes: () => toDerBytes,
  toDerHex: () => toDerHex,
  toHex: () => toHex4,
  toLegacy: () => toLegacy,
  toRpc: () => toRpc2,
  toTuple: () => toTuple,
  vToYParity: () => vToYParity,
  validate: () => validate5,
  yParityToV: () => yParityToV
});
function assert2(signature, options = {}) {
  const { recovered } = options;
  if (typeof signature.r === "undefined")
    throw new MissingPropertiesError({ signature });
  if (typeof signature.s === "undefined")
    throw new MissingPropertiesError({ signature });
  if (recovered && typeof signature.yParity === "undefined")
    throw new MissingPropertiesError({ signature });
  if (signature.r < 0n || signature.r > maxUint256)
    throw new InvalidRError({ value: signature.r });
  if (signature.s < 0n || signature.s > maxUint256)
    throw new InvalidSError({ value: signature.s });
  if (typeof signature.yParity === "number" && signature.yParity !== 0 && signature.yParity !== 1)
    throw new InvalidYParityError({ value: signature.yParity });
}
function fromBytes3(signature) {
  return fromHex3(fromBytes(signature));
}
function fromHex3(signature) {
  if (signature.length !== 130 && signature.length !== 132)
    throw new InvalidSerializedSizeError({ signature });
  const r = BigInt(slice2(signature, 0, 32));
  const s = BigInt(slice2(signature, 32, 64));
  const yParity = (() => {
    const yParity2 = Number(`0x${signature.slice(130)}`);
    if (Number.isNaN(yParity2))
      return void 0;
    try {
      return vToYParity(yParity2);
    } catch {
      throw new InvalidYParityError({ value: yParity2 });
    }
  })();
  if (typeof yParity === "undefined")
    return {
      r,
      s
    };
  return {
    r,
    s,
    yParity
  };
}
function extract(value) {
  if (typeof value.r === "undefined")
    return void 0;
  if (typeof value.s === "undefined")
    return void 0;
  return from10(value);
}
function from10(signature) {
  const signature_ = (() => {
    if (typeof signature === "string")
      return fromHex3(signature);
    if (signature instanceof Uint8Array)
      return fromBytes3(signature);
    if (typeof signature.r === "string")
      return fromRpc2(signature);
    if (signature.v)
      return fromLegacy(signature);
    return {
      r: signature.r,
      s: signature.s,
      ...typeof signature.yParity !== "undefined" ? { yParity: signature.yParity } : {}
    };
  })();
  assert2(signature_);
  return signature_;
}
function fromDerBytes(signature) {
  return fromDerHex(fromBytes(signature));
}
function fromDerHex(signature) {
  const { r, s } = secp256k1.Signature.fromDER(from2(signature).slice(2));
  return { r, s };
}
function fromLegacy(signature) {
  return {
    r: signature.r,
    s: signature.s,
    yParity: vToYParity(signature.v)
  };
}
function fromRpc2(signature) {
  const yParity = (() => {
    const v = signature.v ? Number(signature.v) : void 0;
    let yParity2 = signature.yParity ? Number(signature.yParity) : void 0;
    if (typeof v === "number" && typeof yParity2 !== "number")
      yParity2 = vToYParity(v);
    if (typeof yParity2 !== "number")
      throw new InvalidYParityError({ value: signature.yParity });
    return yParity2;
  })();
  return {
    r: BigInt(signature.r),
    s: BigInt(signature.s),
    yParity
  };
}
function fromTuple(tuple) {
  const [yParity, r, s] = tuple;
  return from10({
    r: r === "0x" ? 0n : BigInt(r),
    s: s === "0x" ? 0n : BigInt(s),
    yParity: yParity === "0x" ? 0 : Number(yParity)
  });
}
function toBytes5(signature) {
  return fromHex(toHex4(signature));
}
function toHex4(signature) {
  assert2(signature);
  const r = signature.r;
  const s = signature.s;
  const signature_ = concat2(
    fromNumber2(r, { size: 32 }),
    fromNumber2(s, { size: 32 }),
    // If the signature is recovered, add the recovery byte to the signature.
    typeof signature.yParity === "number" ? fromNumber2(yParityToV(signature.yParity), { size: 1 }) : "0x"
  );
  return signature_;
}
function toDerBytes(signature) {
  const sig = new secp256k1.Signature(signature.r, signature.s);
  return sig.toDERRawBytes();
}
function toDerHex(signature) {
  const sig = new secp256k1.Signature(signature.r, signature.s);
  return `0x${sig.toDERHex()}`;
}
function toLegacy(signature) {
  return {
    r: signature.r,
    s: signature.s,
    v: yParityToV(signature.yParity)
  };
}
function toRpc2(signature) {
  const { r, s, yParity } = signature;
  return {
    r: fromNumber2(r, { size: 32 }),
    s: fromNumber2(s, { size: 32 }),
    yParity: yParity === 0 ? "0x0" : "0x1"
  };
}
function toTuple(signature) {
  const { r, s, yParity } = signature;
  return [
    yParity ? "0x01" : "0x",
    r === 0n ? "0x" : trimLeft(fromNumber2(r)),
    s === 0n ? "0x" : trimLeft(fromNumber2(s))
  ];
}
function validate5(signature, options = {}) {
  try {
    assert2(signature, options);
    return true;
  } catch {
    return false;
  }
}
function vToYParity(v) {
  if (v === 0 || v === 27)
    return 0;
  if (v === 1 || v === 28)
    return 1;
  if (v >= 35)
    return v % 2 === 0 ? 1 : 0;
  throw new InvalidVError({ value: v });
}
function yParityToV(yParity) {
  if (yParity === 0)
    return 27;
  if (yParity === 1)
    return 28;
  throw new InvalidYParityError({ value: yParity });
}
var InvalidSerializedSizeError = class extends BaseError {
  constructor({ signature }) {
    super(`Value \`${signature}\` is an invalid signature size.`, {
      metaMessages: [
        "Expected: 64 bytes or 65 bytes.",
        `Received ${size2(from2(signature))} bytes.`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Signature.InvalidSerializedSizeError"
    });
  }
};
var MissingPropertiesError = class extends BaseError {
  constructor({ signature }) {
    super(`Signature \`${stringify(signature)}\` is missing either an \`r\`, \`s\`, or \`yParity\` property.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Signature.MissingPropertiesError"
    });
  }
};
var InvalidRError = class extends BaseError {
  constructor({ value }) {
    super(`Value \`${value}\` is an invalid r value. r must be a positive integer less than 2^256.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Signature.InvalidRError"
    });
  }
};
var InvalidSError = class extends BaseError {
  constructor({ value }) {
    super(`Value \`${value}\` is an invalid s value. s must be a positive integer less than 2^256.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Signature.InvalidSError"
    });
  }
};
var InvalidYParityError = class extends BaseError {
  constructor({ value }) {
    super(`Value \`${value}\` is an invalid y-parity value. Y-parity must be 0 or 1.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Signature.InvalidYParityError"
    });
  }
};
var InvalidVError = class extends BaseError {
  constructor({ value }) {
    super(`Value \`${value}\` is an invalid v value. v must be 27, 28 or >=35.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Signature.InvalidVError"
    });
  }
};

// node_modules/ox/_esm/core/Authorization.js
function from11(authorization, options = {}) {
  if (typeof authorization.chainId === "string")
    return fromRpc3(authorization);
  return { ...authorization, ...options.signature };
}
function fromRpc3(authorization) {
  const { address, chainId, nonce } = authorization;
  const signature = extract(authorization);
  return {
    address,
    chainId: Number(chainId),
    nonce: BigInt(nonce),
    ...signature
  };
}
function fromRpcList(authorizationList) {
  return authorizationList.map(fromRpc3);
}
function fromTuple2(tuple) {
  const [chainId, address, nonce, yParity, r, s] = tuple;
  const signature = yParity && r && s ? fromTuple([yParity, r, s]) : void 0;
  return from11({
    address,
    chainId: Number(chainId),
    nonce: BigInt(nonce),
    ...signature
  });
}
function fromTupleList2(tupleList) {
  const list = [];
  for (const tuple of tupleList)
    list.push(fromTuple2(tuple));
  return list;
}
function getSignPayload(authorization) {
  return hash(authorization);
}
function hash(authorization) {
  return keccak256(concat2("0x05", fromHex2(toTuple2(authorization))));
}
function toRpc3(authorization) {
  const { address, chainId, nonce, ...signature } = authorization;
  return {
    address,
    chainId: fromNumber2(chainId),
    nonce: fromNumber2(nonce),
    ...toRpc2(signature)
  };
}
function toRpcList(authorizationList) {
  return authorizationList.map(toRpc3);
}
function toTuple2(authorization) {
  const { address, chainId, nonce } = authorization;
  const signature = extract(authorization);
  return [
    chainId ? fromNumber2(chainId) : "0x",
    address,
    nonce ? fromNumber2(nonce) : "0x",
    ...signature ? toTuple(signature) : []
  ];
}
function toTupleList2(list) {
  if (!list || list.length === 0)
    return [];
  const tupleList = [];
  for (const authorization of list)
    tupleList.push(toTuple2(authorization));
  return tupleList;
}

// node_modules/ox/_esm/core/Base58.js
var Base58_exports = {};
__export(Base58_exports, {
  fromBytes: () => fromBytes4,
  fromHex: () => fromHex4,
  fromString: () => fromString3,
  toBytes: () => toBytes6,
  toHex: () => toHex5,
  toString: () => toString3
});

// node_modules/ox/_esm/core/internal/base58.js
var integerToAlphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var alphabetToInteger = (
  /* __PURE__ */
  Object.freeze({
    1: 0n,
    2: 1n,
    3: 2n,
    4: 3n,
    5: 4n,
    6: 5n,
    7: 6n,
    8: 7n,
    9: 8n,
    A: 9n,
    B: 10n,
    C: 11n,
    D: 12n,
    E: 13n,
    F: 14n,
    G: 15n,
    H: 16n,
    J: 17n,
    K: 18n,
    L: 19n,
    M: 20n,
    N: 21n,
    P: 22n,
    Q: 23n,
    R: 24n,
    S: 25n,
    T: 26n,
    U: 27n,
    V: 28n,
    W: 29n,
    X: 30n,
    Y: 31n,
    Z: 32n,
    a: 33n,
    b: 34n,
    c: 35n,
    d: 36n,
    e: 37n,
    f: 38n,
    g: 39n,
    h: 40n,
    i: 41n,
    j: 42n,
    k: 43n,
    m: 44n,
    n: 45n,
    o: 46n,
    p: 47n,
    q: 48n,
    r: 49n,
    s: 50n,
    t: 51n,
    u: 52n,
    v: 53n,
    w: 54n,
    x: 55n,
    y: 56n,
    z: 57n
  })
);
function from12(value) {
  let bytes = from(value);
  let integer = (() => {
    let hex2 = value;
    if (value instanceof Uint8Array)
      hex2 = fromBytes(bytes);
    return BigInt(hex2);
  })();
  let result = "";
  while (integer > 0n) {
    const remainder = Number(integer % 58n);
    integer = integer / 58n;
    result = integerToAlphabet[remainder] + result;
  }
  while (bytes.length > 1 && bytes[0] === 0) {
    result = "1" + result;
    bytes = bytes.slice(1);
  }
  return result;
}

// node_modules/ox/_esm/core/Base58.js
function fromBytes4(value) {
  return from12(value);
}
function fromHex4(value) {
  return from12(value);
}
function fromString3(value) {
  return from12(fromString(value));
}
function toBytes6(value) {
  return fromHex(toHex5(value));
}
function toHex5(value) {
  let integer = BigInt(0);
  let pad = 0;
  let checkPad = true;
  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    if (checkPad && char === "1")
      pad++;
    else
      checkPad = false;
    if (typeof alphabetToInteger[char] !== "bigint")
      throw new Error("invalid base58 character: " + char);
    integer = integer * 58n;
    integer = integer + alphabetToInteger[char];
  }
  if (!pad)
    return `0x${integer.toString(16)}`;
  return `0x${"0".repeat(pad * 2)}${integer.toString(16)}`;
}
function toString3(value) {
  return toString2(toHex5(value));
}

// node_modules/ox/_esm/core/Base64.js
var Base64_exports = {};
__export(Base64_exports, {
  fromBytes: () => fromBytes5,
  fromHex: () => fromHex5,
  fromString: () => fromString4,
  toBytes: () => toBytes7,
  toHex: () => toHex6,
  toString: () => toString4
});
var encoder = new TextEncoder();
var decoder = new TextDecoder();
var integerToCharacter = Object.fromEntries(Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/").map((a, i) => [i, a.charCodeAt(0)]));
var characterToInteger = {
  ...Object.fromEntries(Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/").map((a, i) => [a.charCodeAt(0), i])),
  ["=".charCodeAt(0)]: 0,
  ["-".charCodeAt(0)]: 62,
  ["_".charCodeAt(0)]: 63
};
function fromBytes5(value, options = {}) {
  const { pad = true, url = false } = options;
  const encoded = new Uint8Array(Math.ceil(value.length / 3) * 4);
  for (let i = 0, j = 0; j < value.length; i += 4, j += 3) {
    const y = (value[j] << 16) + (value[j + 1] << 8) + (value[j + 2] | 0);
    encoded[i] = integerToCharacter[y >> 18];
    encoded[i + 1] = integerToCharacter[y >> 12 & 63];
    encoded[i + 2] = integerToCharacter[y >> 6 & 63];
    encoded[i + 3] = integerToCharacter[y & 63];
  }
  const k = value.length % 3;
  const end = Math.floor(value.length / 3) * 4 + (k && k + 1);
  let base642 = decoder.decode(new Uint8Array(encoded.buffer, 0, end));
  if (pad && k === 1)
    base642 += "==";
  if (pad && k === 2)
    base642 += "=";
  if (url)
    base642 = base642.replaceAll("+", "-").replaceAll("/", "_");
  return base642;
}
function fromHex5(value, options = {}) {
  return fromBytes5(fromHex(value), options);
}
function fromString4(value, options = {}) {
  return fromBytes5(fromString(value), options);
}
function toBytes7(value) {
  const base642 = value.replace(/=+$/, "");
  const size4 = base642.length;
  const decoded = new Uint8Array(size4 + 3);
  encoder.encodeInto(base642 + "===", decoded);
  for (let i = 0, j = 0; i < base642.length; i += 4, j += 3) {
    const x = (characterToInteger[decoded[i]] << 18) + (characterToInteger[decoded[i + 1]] << 12) + (characterToInteger[decoded[i + 2]] << 6) + characterToInteger[decoded[i + 3]];
    decoded[j] = x >> 16;
    decoded[j + 1] = x >> 8 & 255;
    decoded[j + 2] = x & 255;
  }
  const decodedSize = (size4 >> 2) * 3 + (size4 % 4 && size4 % 4 - 1);
  return new Uint8Array(decoded.buffer, 0, decodedSize);
}
function toHex6(value) {
  return fromBytes(toBytes7(value));
}
function toString4(value) {
  return toString(toBytes7(value));
}

// node_modules/ox/_esm/core/Blobs.js
var Blobs_exports = {};
__export(Blobs_exports, {
  BlobSizeTooLargeError: () => BlobSizeTooLargeError,
  EmptyBlobError: () => EmptyBlobError,
  EmptyBlobVersionedHashesError: () => EmptyBlobVersionedHashesError,
  InvalidVersionedHashSizeError: () => InvalidVersionedHashSizeError,
  InvalidVersionedHashVersionError: () => InvalidVersionedHashVersionError,
  bytesPerBlob: () => bytesPerBlob,
  bytesPerFieldElement: () => bytesPerFieldElement,
  commitmentToVersionedHash: () => commitmentToVersionedHash,
  commitmentsToVersionedHashes: () => commitmentsToVersionedHashes,
  fieldElementsPerBlob: () => fieldElementsPerBlob,
  from: () => from14,
  maxBytesPerTransaction: () => maxBytesPerTransaction,
  sidecarsToVersionedHashes: () => sidecarsToVersionedHashes,
  to: () => to2,
  toBytes: () => toBytes8,
  toCommitments: () => toCommitments,
  toHex: () => toHex7,
  toProofs: () => toProofs,
  toSidecars: () => toSidecars,
  toVersionedHashes: () => toVersionedHashes
});

// node_modules/ox/_esm/core/Kzg.js
var Kzg_exports = {};
__export(Kzg_exports, {
  from: () => from13,
  versionedHashVersion: () => versionedHashVersion
});
var versionedHashVersion = 1;
function from13(value) {
  const { blobToKzgCommitment, computeBlobKzgProof } = value;
  return {
    blobToKzgCommitment,
    computeBlobKzgProof
  };
}

// node_modules/ox/_esm/core/Blobs.js
var blobsPerTransaction = 6;
var bytesPerFieldElement = 32;
var fieldElementsPerBlob = 4096;
var bytesPerBlob = bytesPerFieldElement * fieldElementsPerBlob;
var maxBytesPerTransaction = bytesPerBlob * blobsPerTransaction - // terminator byte (0x80).
1 - // zero byte (0x00) appended to each field element.
1 * fieldElementsPerBlob * blobsPerTransaction;
function commitmentsToVersionedHashes(commitments, options = {}) {
  const { version: version2 } = options;
  const as = options.as ?? (typeof commitments[0] === "string" ? "Hex" : "Bytes");
  const hashes = [];
  for (const commitment of commitments) {
    hashes.push(commitmentToVersionedHash(commitment, {
      as,
      version: version2
    }));
  }
  return hashes;
}
function commitmentToVersionedHash(commitment, options = {}) {
  const { version: version2 = 1 } = options;
  const as = options.as ?? (typeof commitment === "string" ? "Hex" : "Bytes");
  const versionedHash = sha2562(commitment, { as: "Bytes" });
  versionedHash.set([version2], 0);
  return as === "Bytes" ? versionedHash : fromBytes(versionedHash);
}
function from14(data, options = {}) {
  const as = options.as ?? (typeof data === "string" ? "Hex" : "Bytes");
  const data_ = typeof data === "string" ? fromHex(data) : data;
  const size_ = size(data_);
  if (!size_)
    throw new EmptyBlobError();
  if (size_ > maxBytesPerTransaction)
    throw new BlobSizeTooLargeError({
      maxSize: maxBytesPerTransaction,
      size: size_
    });
  const blobs = [];
  let active2 = true;
  let position = 0;
  while (active2) {
    const blob = create(new Uint8Array(bytesPerBlob));
    let size4 = 0;
    while (size4 < fieldElementsPerBlob) {
      const bytes = data_.slice(position, position + (bytesPerFieldElement - 1));
      blob.pushByte(0);
      blob.pushBytes(bytes);
      if (bytes.length < 31) {
        blob.pushByte(128);
        active2 = false;
        break;
      }
      size4++;
      position += 31;
    }
    blobs.push(blob);
  }
  return as === "Bytes" ? blobs.map((x) => x.bytes) : blobs.map((x) => fromBytes(x.bytes));
}
function sidecarsToVersionedHashes(sidecars, options = {}) {
  const { version: version2 } = options;
  const as = options.as ?? (typeof sidecars[0].blob === "string" ? "Hex" : "Bytes");
  const hashes = [];
  for (const { commitment } of sidecars) {
    hashes.push(commitmentToVersionedHash(commitment, {
      as,
      version: version2
    }));
  }
  return hashes;
}
function to2(blobs, to3) {
  const to_ = to3 ?? (typeof blobs[0] === "string" ? "Hex" : "Bytes");
  const blobs_ = typeof blobs[0] === "string" ? blobs.map((x) => fromHex(x)) : blobs;
  const length = blobs_.reduce((length2, blob) => length2 + blob.length, 0);
  const data = create(new Uint8Array(length));
  let active2 = true;
  for (const blob of blobs_) {
    const cursor = create(blob);
    while (active2 && cursor.position < blob.length) {
      cursor.incrementPosition(1);
      let consume = 31;
      if (blob.length - cursor.position < 31)
        consume = blob.length - cursor.position;
      for (const _ in Array.from({ length: consume })) {
        const byte = cursor.readByte();
        const isTerminator = byte === 128 && !cursor.inspectBytes(cursor.remaining).includes(128);
        if (isTerminator) {
          active2 = false;
          break;
        }
        data.pushByte(byte);
      }
    }
  }
  const trimmedData = data.bytes.slice(0, data.position);
  return to_ === "Hex" ? fromBytes(trimmedData) : trimmedData;
}
function toHex7(blobs) {
  return to2(blobs, "Hex");
}
function toBytes8(blobs) {
  return to2(blobs, "Bytes");
}
function toCommitments(blobs, options) {
  const { kzg } = options;
  const as = options.as ?? (typeof blobs[0] === "string" ? "Hex" : "Bytes");
  const blobs_ = typeof blobs[0] === "string" ? blobs.map((x) => fromHex(x)) : blobs;
  const commitments = [];
  for (const blob of blobs_)
    commitments.push(Uint8Array.from(kzg.blobToKzgCommitment(blob)));
  return as === "Bytes" ? commitments : commitments.map((x) => fromBytes(x));
}
function toProofs(blobs, options) {
  const { kzg } = options;
  const as = options.as ?? (typeof blobs[0] === "string" ? "Hex" : "Bytes");
  const blobs_ = typeof blobs[0] === "string" ? blobs.map((x) => fromHex(x)) : blobs;
  const commitments = typeof options.commitments[0] === "string" ? options.commitments.map((x) => fromHex(x)) : options.commitments;
  const proofs = [];
  for (let i = 0; i < blobs_.length; i++) {
    const blob = blobs_[i];
    const commitment = commitments[i];
    proofs.push(Uint8Array.from(kzg.computeBlobKzgProof(blob, commitment)));
  }
  return as === "Bytes" ? proofs : proofs.map((x) => fromBytes(x));
}
function toSidecars(blobs, options) {
  const { kzg } = options;
  const commitments = options.commitments ?? toCommitments(blobs, { kzg });
  const proofs = options.proofs ?? toProofs(blobs, { commitments, kzg });
  const sidecars = [];
  for (let i = 0; i < blobs.length; i++)
    sidecars.push({
      blob: blobs[i],
      commitment: commitments[i],
      proof: proofs[i]
    });
  return sidecars;
}
function toVersionedHashes(blobs, options) {
  const commitments = toCommitments(blobs, options);
  return commitmentsToVersionedHashes(commitments, options);
}
var BlobSizeTooLargeError = class extends BaseError {
  constructor({ maxSize, size: size4 }) {
    super("Blob size is too large.", {
      metaMessages: [`Max: ${maxSize} bytes`, `Given: ${size4} bytes`]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Blobs.BlobSizeTooLargeError"
    });
  }
};
var EmptyBlobError = class extends BaseError {
  constructor() {
    super("Blob data must not be empty.");
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Blobs.EmptyBlobError"
    });
  }
};
var EmptyBlobVersionedHashesError = class extends BaseError {
  constructor() {
    super("Blob versioned hashes must not be empty.");
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Blobs.EmptyBlobVersionedHashesError"
    });
  }
};
var InvalidVersionedHashSizeError = class extends BaseError {
  constructor({ hash: hash7, size: size4 }) {
    super(`Versioned hash "${hash7}" size is invalid.`, {
      metaMessages: ["Expected: 32", `Received: ${size4}`]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Blobs.InvalidVersionedHashSizeError"
    });
  }
};
var InvalidVersionedHashVersionError = class extends BaseError {
  constructor({ hash: hash7, version: version2 }) {
    super(`Versioned hash "${hash7}" version is invalid.`, {
      metaMessages: [
        `Expected: ${versionedHashVersion}`,
        `Received: ${version2}`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Blobs.InvalidVersionedHashVersionError"
    });
  }
};

// node_modules/ox/_esm/core/Block.js
var Block_exports = {};
__export(Block_exports, {
  fromRpc: () => fromRpc5,
  toRpc: () => toRpc5
});

// node_modules/ox/_esm/core/Transaction.js
var Transaction_exports = {};
__export(Transaction_exports, {
  fromRpc: () => fromRpc4,
  fromRpcType: () => fromRpcType,
  toRpc: () => toRpc4,
  toRpcType: () => toRpcType
});
var toRpcType = {
  legacy: "0x0",
  eip2930: "0x1",
  eip1559: "0x2",
  eip4844: "0x3",
  eip7702: "0x4"
};
var fromRpcType = {
  "0x0": "legacy",
  "0x1": "eip2930",
  "0x2": "eip1559",
  "0x3": "eip4844",
  "0x4": "eip7702"
};
function fromRpc4(transaction, _options = {}) {
  if (!transaction)
    return null;
  const signature = extract(transaction);
  const transaction_ = {
    ...transaction,
    ...signature
  };
  transaction_.blockNumber = transaction.blockNumber ? BigInt(transaction.blockNumber) : null;
  transaction_.data = transaction.input;
  transaction_.gas = BigInt(transaction.gas ?? 0n);
  transaction_.nonce = BigInt(transaction.nonce ?? 0n);
  transaction_.transactionIndex = transaction.transactionIndex ? Number(transaction.transactionIndex) : null;
  transaction_.value = BigInt(transaction.value ?? 0n);
  if (transaction.authorizationList)
    transaction_.authorizationList = fromRpcList(transaction.authorizationList);
  if (transaction.chainId)
    transaction_.chainId = Number(transaction.chainId);
  if (transaction.gasPrice)
    transaction_.gasPrice = BigInt(transaction.gasPrice);
  if (transaction.maxFeePerBlobGas)
    transaction_.maxFeePerBlobGas = BigInt(transaction.maxFeePerBlobGas);
  if (transaction.maxFeePerGas)
    transaction_.maxFeePerGas = BigInt(transaction.maxFeePerGas);
  if (transaction.maxPriorityFeePerGas)
    transaction_.maxPriorityFeePerGas = BigInt(transaction.maxPriorityFeePerGas);
  if (transaction.type)
    transaction_.type = fromRpcType[transaction.type] ?? transaction.type;
  if (signature)
    transaction_.v = yParityToV(signature.yParity);
  return transaction_;
}
function toRpc4(transaction, _options) {
  const rpc = {};
  rpc.blockHash = transaction.blockHash;
  rpc.blockNumber = typeof transaction.blockNumber === "bigint" ? fromNumber2(transaction.blockNumber) : null;
  rpc.from = transaction.from;
  rpc.gas = fromNumber2(transaction.gas ?? 0n);
  rpc.hash = transaction.hash;
  rpc.input = transaction.input;
  rpc.nonce = fromNumber2(transaction.nonce ?? 0n);
  rpc.to = transaction.to;
  rpc.transactionIndex = transaction.transactionIndex ? fromNumber2(transaction.transactionIndex) : null;
  rpc.type = toRpcType[transaction.type] ?? transaction.type;
  rpc.value = fromNumber2(transaction.value ?? 0n);
  if (transaction.accessList)
    rpc.accessList = transaction.accessList;
  if (transaction.authorizationList)
    rpc.authorizationList = toRpcList(transaction.authorizationList);
  if (transaction.blobVersionedHashes)
    rpc.blobVersionedHashes = transaction.blobVersionedHashes;
  if (transaction.chainId)
    rpc.chainId = fromNumber2(transaction.chainId);
  if (typeof transaction.gasPrice === "bigint")
    rpc.gasPrice = fromNumber2(transaction.gasPrice);
  if (typeof transaction.maxFeePerBlobGas === "bigint")
    rpc.maxFeePerBlobGas = fromNumber2(transaction.maxFeePerBlobGas);
  if (typeof transaction.maxFeePerGas === "bigint")
    rpc.maxFeePerGas = fromNumber2(transaction.maxFeePerGas);
  if (typeof transaction.maxPriorityFeePerGas === "bigint")
    rpc.maxPriorityFeePerGas = fromNumber2(transaction.maxPriorityFeePerGas);
  if (typeof transaction.r === "bigint")
    rpc.r = fromNumber2(transaction.r, { size: 32 });
  if (typeof transaction.s === "bigint")
    rpc.s = fromNumber2(transaction.s, { size: 32 });
  if (typeof transaction.v === "number")
    rpc.v = fromNumber2(transaction.v, { size: 1 });
  if (typeof transaction.yParity === "number")
    rpc.yParity = transaction.yParity === 0 ? "0x0" : "0x1";
  return rpc;
}

// node_modules/ox/_esm/core/Block.js
function toRpc5(block, _options = {}) {
  var _a;
  const transactions = block.transactions.map((transaction) => {
    if (typeof transaction === "string")
      return transaction;
    return toRpc4(transaction);
  });
  return {
    baseFeePerGas: typeof block.baseFeePerGas === "bigint" ? fromNumber2(block.baseFeePerGas) : void 0,
    blobGasUsed: typeof block.blobGasUsed === "bigint" ? fromNumber2(block.blobGasUsed) : void 0,
    excessBlobGas: typeof block.excessBlobGas === "bigint" ? fromNumber2(block.excessBlobGas) : void 0,
    extraData: block.extraData,
    difficulty: typeof block.difficulty === "bigint" ? fromNumber2(block.difficulty) : void 0,
    gasLimit: fromNumber2(block.gasLimit),
    gasUsed: fromNumber2(block.gasUsed),
    hash: block.hash,
    logsBloom: block.logsBloom,
    miner: block.miner,
    mixHash: block.mixHash,
    nonce: block.nonce,
    number: typeof block.number === "bigint" ? fromNumber2(block.number) : null,
    parentBeaconBlockRoot: block.parentBeaconBlockRoot,
    parentHash: block.parentHash,
    receiptsRoot: block.receiptsRoot,
    sealFields: block.sealFields,
    sha3Uncles: block.sha3Uncles,
    size: fromNumber2(block.size),
    stateRoot: block.stateRoot,
    timestamp: fromNumber2(block.timestamp),
    totalDifficulty: typeof block.totalDifficulty === "bigint" ? fromNumber2(block.totalDifficulty) : void 0,
    transactions,
    transactionsRoot: block.transactionsRoot,
    uncles: block.uncles,
    withdrawals: (_a = block.withdrawals) == null ? void 0 : _a.map(toRpc),
    withdrawalsRoot: block.withdrawalsRoot
  };
}
function fromRpc5(block, _options = {}) {
  var _a;
  if (!block)
    return null;
  const transactions = block.transactions.map((transaction) => {
    if (typeof transaction === "string")
      return transaction;
    return fromRpc4(transaction);
  });
  return {
    ...block,
    baseFeePerGas: block.baseFeePerGas ? BigInt(block.baseFeePerGas) : void 0,
    blobGasUsed: block.blobGasUsed ? BigInt(block.blobGasUsed) : void 0,
    difficulty: block.difficulty ? BigInt(block.difficulty) : void 0,
    excessBlobGas: block.excessBlobGas ? BigInt(block.excessBlobGas) : void 0,
    gasLimit: BigInt(block.gasLimit ?? 0n),
    gasUsed: BigInt(block.gasUsed ?? 0n),
    number: block.number ? BigInt(block.number) : null,
    size: BigInt(block.size ?? 0n),
    stateRoot: block.stateRoot,
    timestamp: BigInt(block.timestamp ?? 0n),
    totalDifficulty: BigInt(block.totalDifficulty ?? 0n),
    transactions,
    withdrawals: (_a = block.withdrawals) == null ? void 0 : _a.map(fromRpc)
  };
}

// node_modules/ox/_esm/core/Bloom.js
var Bloom_exports = {};
__export(Bloom_exports, {
  contains: () => contains,
  validate: () => validate6
});
function contains(bloom, input) {
  const filter = fromHex(bloom);
  const hash7 = keccak256(input, { as: "Bytes" });
  for (const i of [0, 2, 4]) {
    const bit = hash7[i + 1] + (hash7[i] << 8) & 2047;
    if ((filter[256 - 1 - Math.floor(bit / 8)] & 1 << bit % 8) === 0)
      return false;
  }
  return true;
}
function validate6(value) {
  return validate2(value) && size2(value) === 256;
}

// node_modules/ox/_esm/core/Bls.js
var Bls_exports = {};
__export(Bls_exports, {
  aggregate: () => aggregate,
  getPublicKey: () => getPublicKey,
  noble: () => noble,
  randomPrivateKey: () => randomPrivateKey,
  sign: () => sign,
  verify: () => verify
});

// node_modules/@noble/curves/esm/abstract/bls.js
var _0n = BigInt(0);
var _1n = BigInt(1);
var _2n = BigInt(2);
var _3n = BigInt(3);
function NAfDecomposition(a) {
  const res = [];
  for (; a > _1n; a >>= _1n) {
    if ((a & _1n) === _0n)
      res.unshift(0);
    else if ((a & _3n) === _3n) {
      res.unshift(-1);
      a += _1n;
    } else
      res.unshift(1);
  }
  return res;
}
function bls(CURVE) {
  const { Fp: Fp3, Fr: Fr2, Fp2: Fp22, Fp6: Fp62, Fp12: Fp122 } = CURVE.fields;
  const BLS_X_IS_NEGATIVE = CURVE.params.xNegative;
  const TWIST = CURVE.params.twistType;
  const G1_ = weierstrassPoints({ n: Fr2.ORDER, ...CURVE.G1 });
  const G1 = Object.assign(G1_, createHasher(G1_.ProjectivePoint, CURVE.G1.mapToCurve, {
    ...CURVE.htfDefaults,
    ...CURVE.G1.htfDefaults
  }));
  const G2_ = weierstrassPoints({ n: Fr2.ORDER, ...CURVE.G2 });
  const G2 = Object.assign(G2_, createHasher(G2_.ProjectivePoint, CURVE.G2.mapToCurve, {
    ...CURVE.htfDefaults,
    ...CURVE.G2.htfDefaults
  }));
  let lineFunction;
  if (TWIST === "multiplicative") {
    lineFunction = (c0, c1, c2, f, Px, Py) => Fp122.mul014(f, c0, Fp22.mul(c1, Px), Fp22.mul(c2, Py));
  } else if (TWIST === "divisive") {
    lineFunction = (c0, c1, c2, f, Px, Py) => Fp122.mul034(f, Fp22.mul(c2, Py), Fp22.mul(c1, Px), c0);
  } else
    throw new Error("bls: unknown twist type");
  const Fp2div2 = Fp22.div(Fp22.ONE, Fp22.mul(Fp22.ONE, _2n));
  function pointDouble(ell, Rx, Ry, Rz) {
    const t0 = Fp22.sqr(Ry);
    const t1 = Fp22.sqr(Rz);
    const t2 = Fp22.mulByB(Fp22.mul(t1, _3n));
    const t3 = Fp22.mul(t2, _3n);
    const t4 = Fp22.sub(Fp22.sub(Fp22.sqr(Fp22.add(Ry, Rz)), t1), t0);
    const c0 = Fp22.sub(t2, t0);
    const c1 = Fp22.mul(Fp22.sqr(Rx), _3n);
    const c2 = Fp22.neg(t4);
    ell.push([c0, c1, c2]);
    Rx = Fp22.mul(Fp22.mul(Fp22.mul(Fp22.sub(t0, t3), Rx), Ry), Fp2div2);
    Ry = Fp22.sub(Fp22.sqr(Fp22.mul(Fp22.add(t0, t3), Fp2div2)), Fp22.mul(Fp22.sqr(t2), _3n));
    Rz = Fp22.mul(t0, t4);
    return { Rx, Ry, Rz };
  }
  function pointAdd(ell, Rx, Ry, Rz, Qx, Qy) {
    const t0 = Fp22.sub(Ry, Fp22.mul(Qy, Rz));
    const t1 = Fp22.sub(Rx, Fp22.mul(Qx, Rz));
    const c0 = Fp22.sub(Fp22.mul(t0, Qx), Fp22.mul(t1, Qy));
    const c1 = Fp22.neg(t0);
    const c2 = t1;
    ell.push([c0, c1, c2]);
    const t2 = Fp22.sqr(t1);
    const t3 = Fp22.mul(t2, t1);
    const t4 = Fp22.mul(t2, Rx);
    const t5 = Fp22.add(Fp22.sub(t3, Fp22.mul(t4, _2n)), Fp22.mul(Fp22.sqr(t0), Rz));
    Rx = Fp22.mul(t1, t5);
    Ry = Fp22.sub(Fp22.mul(Fp22.sub(t4, t5), t0), Fp22.mul(t3, Ry));
    Rz = Fp22.mul(Rz, t3);
    return { Rx, Ry, Rz };
  }
  const ATE_NAF = NAfDecomposition(CURVE.params.ateLoopSize);
  const calcPairingPrecomputes = memoized((point) => {
    const p = point;
    const { x, y } = p.toAffine();
    const Qx = x, Qy = y, negQy = Fp22.neg(y);
    let Rx = Qx, Ry = Qy, Rz = Fp22.ONE;
    const ell = [];
    for (const bit of ATE_NAF) {
      const cur = [];
      ({ Rx, Ry, Rz } = pointDouble(cur, Rx, Ry, Rz));
      if (bit)
        ({ Rx, Ry, Rz } = pointAdd(cur, Rx, Ry, Rz, Qx, bit === -1 ? negQy : Qy));
      ell.push(cur);
    }
    if (CURVE.postPrecompute) {
      const last = ell[ell.length - 1];
      CURVE.postPrecompute(Rx, Ry, Rz, Qx, Qy, pointAdd.bind(null, last));
    }
    return ell;
  });
  function millerLoopBatch(pairs, withFinalExponent = false) {
    let f12 = Fp122.ONE;
    if (pairs.length) {
      const ellLen = pairs[0][0].length;
      for (let i = 0; i < ellLen; i++) {
        f12 = Fp122.sqr(f12);
        for (const [ell, Px, Py] of pairs) {
          for (const [c0, c1, c2] of ell[i])
            f12 = lineFunction(c0, c1, c2, f12, Px, Py);
        }
      }
    }
    if (BLS_X_IS_NEGATIVE)
      f12 = Fp122.conjugate(f12);
    return withFinalExponent ? Fp122.finalExponentiate(f12) : f12;
  }
  function pairingBatch(pairs, withFinalExponent = true) {
    const res = [];
    G1.ProjectivePoint.normalizeZ(pairs.map(({ g1 }) => g1));
    G2.ProjectivePoint.normalizeZ(pairs.map(({ g2 }) => g2));
    for (const { g1, g2 } of pairs) {
      if (g1.equals(G1.ProjectivePoint.ZERO) || g2.equals(G2.ProjectivePoint.ZERO))
        throw new Error("pairing is not available for ZERO point");
      g1.assertValidity();
      g2.assertValidity();
      const Qa = g1.toAffine();
      res.push([calcPairingPrecomputes(g2), Qa.x, Qa.y]);
    }
    return millerLoopBatch(res, withFinalExponent);
  }
  function pairing(Q, P, withFinalExponent = true) {
    return pairingBatch([{ g1: Q, g2: P }], withFinalExponent);
  }
  const utils2 = {
    randomPrivateKey: () => {
      const length = getMinHashLength(Fr2.ORDER);
      return mapHashToField(CURVE.randomBytes(length), Fr2.ORDER);
    },
    calcPairingPrecomputes
  };
  const { ShortSignature } = CURVE.G1;
  const { Signature } = CURVE.G2;
  function normP1(point) {
    return point instanceof G1.ProjectivePoint ? point : G1.ProjectivePoint.fromHex(point);
  }
  function normP1Hash(point, htfOpts) {
    return point instanceof G1.ProjectivePoint ? point : G1.hashToCurve(ensureBytes("point", point), htfOpts);
  }
  function normP2(point) {
    return point instanceof G2.ProjectivePoint ? point : Signature.fromHex(point);
  }
  function normP2Hash(point, htfOpts) {
    return point instanceof G2.ProjectivePoint ? point : G2.hashToCurve(ensureBytes("point", point), htfOpts);
  }
  function getPublicKey4(privateKey) {
    return G1.ProjectivePoint.fromPrivateKey(privateKey).toRawBytes(true);
  }
  function getPublicKeyForShortSignatures(privateKey) {
    return G2.ProjectivePoint.fromPrivateKey(privateKey).toRawBytes(true);
  }
  function sign6(message, privateKey, htfOpts) {
    const msgPoint = normP2Hash(message, htfOpts);
    msgPoint.assertValidity();
    const sigPoint = msgPoint.multiply(G1.normPrivateKeyToScalar(privateKey));
    if (message instanceof G2.ProjectivePoint)
      return sigPoint;
    return Signature.toRawBytes(sigPoint);
  }
  function signShortSignature(message, privateKey, htfOpts) {
    const msgPoint = normP1Hash(message, htfOpts);
    msgPoint.assertValidity();
    const sigPoint = msgPoint.multiply(G1.normPrivateKeyToScalar(privateKey));
    if (message instanceof G1.ProjectivePoint)
      return sigPoint;
    return ShortSignature.toRawBytes(sigPoint);
  }
  function verify6(signature, message, publicKey, htfOpts) {
    const P = normP1(publicKey);
    const Hm = normP2Hash(message, htfOpts);
    const G = G1.ProjectivePoint.BASE;
    const S = normP2(signature);
    const exp = pairingBatch([
      { g1: P.negate(), g2: Hm },
      // ePHM = pairing(P.negate(), Hm, false);
      { g1: G, g2: S }
      // eGS = pairing(G, S, false);
    ]);
    return Fp122.eql(exp, Fp122.ONE);
  }
  function verifyShortSignature(signature, message, publicKey, htfOpts) {
    const P = normP2(publicKey);
    const Hm = normP1Hash(message, htfOpts);
    const G = G2.ProjectivePoint.BASE;
    const S = normP1(signature);
    const exp = pairingBatch([
      { g1: Hm, g2: P },
      // eHmP = pairing(Hm, P, false);
      { g1: S, g2: G.negate() }
      // eSG = pairing(S, G.negate(), false);
    ]);
    return Fp122.eql(exp, Fp122.ONE);
  }
  function aNonEmpty(arr) {
    if (!Array.isArray(arr) || arr.length === 0)
      throw new Error("expected non-empty array");
  }
  function aggregatePublicKeys(publicKeys) {
    aNonEmpty(publicKeys);
    const agg = publicKeys.map(normP1).reduce((sum, p) => sum.add(p), G1.ProjectivePoint.ZERO);
    const aggAffine = agg;
    if (publicKeys[0] instanceof G1.ProjectivePoint) {
      aggAffine.assertValidity();
      return aggAffine;
    }
    return aggAffine.toRawBytes(true);
  }
  function aggregateSignatures(signatures) {
    aNonEmpty(signatures);
    const agg = signatures.map(normP2).reduce((sum, s) => sum.add(s), G2.ProjectivePoint.ZERO);
    const aggAffine = agg;
    if (signatures[0] instanceof G2.ProjectivePoint) {
      aggAffine.assertValidity();
      return aggAffine;
    }
    return Signature.toRawBytes(aggAffine);
  }
  function aggregateShortSignatures(signatures) {
    aNonEmpty(signatures);
    const agg = signatures.map(normP1).reduce((sum, s) => sum.add(s), G1.ProjectivePoint.ZERO);
    const aggAffine = agg;
    if (signatures[0] instanceof G1.ProjectivePoint) {
      aggAffine.assertValidity();
      return aggAffine;
    }
    return ShortSignature.toRawBytes(aggAffine);
  }
  function verifyBatch(signature, messages, publicKeys, htfOpts) {
    aNonEmpty(messages);
    if (publicKeys.length !== messages.length)
      throw new Error("amount of public keys and messages should be equal");
    const sig = normP2(signature);
    const nMessages = messages.map((i) => normP2Hash(i, htfOpts));
    const nPublicKeys = publicKeys.map(normP1);
    const messagePubKeyMap = /* @__PURE__ */ new Map();
    for (let i = 0; i < nPublicKeys.length; i++) {
      const pub = nPublicKeys[i];
      const msg = nMessages[i];
      let keys = messagePubKeyMap.get(msg);
      if (keys === void 0) {
        keys = [];
        messagePubKeyMap.set(msg, keys);
      }
      keys.push(pub);
    }
    const paired = [];
    try {
      for (const [msg, keys] of messagePubKeyMap) {
        const groupPublicKey = keys.reduce((acc, msg2) => acc.add(msg2));
        paired.push({ g1: groupPublicKey, g2: msg });
      }
      paired.push({ g1: G1.ProjectivePoint.BASE.negate(), g2: sig });
      return Fp122.eql(pairingBatch(paired), Fp122.ONE);
    } catch {
      return false;
    }
  }
  G1.ProjectivePoint.BASE._setWindowSize(4);
  return {
    getPublicKey: getPublicKey4,
    getPublicKeyForShortSignatures,
    sign: sign6,
    signShortSignature,
    verify: verify6,
    verifyBatch,
    verifyShortSignature,
    aggregatePublicKeys,
    aggregateSignatures,
    aggregateShortSignatures,
    millerLoopBatch,
    pairing,
    pairingBatch,
    G1,
    G2,
    Signature,
    ShortSignature,
    fields: {
      Fr: Fr2,
      Fp: Fp3,
      Fp2: Fp22,
      Fp6: Fp62,
      Fp12: Fp122
    },
    params: {
      ateLoopSize: CURVE.params.ateLoopSize,
      r: CURVE.params.r,
      G1b: CURVE.G1.b,
      G2b: CURVE.G2.b
    },
    utils: utils2
  };
}

// node_modules/@noble/curves/esm/abstract/tower.js
var _0n2 = BigInt(0);
var _1n2 = BigInt(1);
var _2n2 = BigInt(2);
var _3n2 = BigInt(3);
function calcFrobeniusCoefficients(Fp3, nonResidue, modulus, degree, num = 1, divisor) {
  const _divisor = BigInt(divisor === void 0 ? degree : divisor);
  const towerModulus = modulus ** BigInt(degree);
  const res = [];
  for (let i = 0; i < num; i++) {
    const a = BigInt(i + 1);
    const powers2 = [];
    for (let j = 0, qPower = _1n2; j < degree; j++) {
      const power = (a * qPower - a) / _divisor % towerModulus;
      powers2.push(Fp3.pow(nonResidue, power));
      qPower *= modulus;
    }
    res.push(powers2);
  }
  return res;
}
function psiFrobenius(Fp3, Fp22, base3) {
  const PSI_X = Fp22.pow(base3, (Fp3.ORDER - _1n2) / _3n2);
  const PSI_Y = Fp22.pow(base3, (Fp3.ORDER - _1n2) / _2n2);
  function psi(x, y) {
    const x2 = Fp22.mul(Fp22.frobeniusMap(x, 1), PSI_X);
    const y2 = Fp22.mul(Fp22.frobeniusMap(y, 1), PSI_Y);
    return [x2, y2];
  }
  const PSI2_X = Fp22.pow(base3, (Fp3.ORDER ** _2n2 - _1n2) / _3n2);
  const PSI2_Y = Fp22.pow(base3, (Fp3.ORDER ** _2n2 - _1n2) / _2n2);
  if (!Fp22.eql(PSI2_Y, Fp22.neg(Fp22.ONE)))
    throw new Error("psiFrobenius: PSI2_Y!==-1");
  function psi2(x, y) {
    return [Fp22.mul(x, PSI2_X), Fp22.neg(y)];
  }
  const mapAffine = (fn) => (c, P) => {
    const affine = P.toAffine();
    const p = fn(affine.x, affine.y);
    return c.fromAffine({ x: p[0], y: p[1] });
  };
  const G2psi3 = mapAffine(psi);
  const G2psi22 = mapAffine(psi2);
  return { psi, psi2, G2psi: G2psi3, G2psi2: G2psi22, PSI_X, PSI_Y, PSI2_X, PSI2_Y };
}
function tower12(opts) {
  const { ORDER } = opts;
  const Fp3 = Field(ORDER);
  const FpNONRESIDUE = Fp3.create(opts.NONRESIDUE || BigInt(-1));
  const FpLegendre2 = FpLegendre(ORDER);
  const Fpdiv2 = Fp3.div(Fp3.ONE, _2n2);
  const FP2_FROBENIUS_COEFFICIENTS = calcFrobeniusCoefficients(Fp3, FpNONRESIDUE, Fp3.ORDER, 2)[0];
  const Fp2Add = ({ c0, c1 }, { c0: r0, c1: r1 }) => ({
    c0: Fp3.add(c0, r0),
    c1: Fp3.add(c1, r1)
  });
  const Fp2Subtract = ({ c0, c1 }, { c0: r0, c1: r1 }) => ({
    c0: Fp3.sub(c0, r0),
    c1: Fp3.sub(c1, r1)
  });
  const Fp2Multiply = ({ c0, c1 }, rhs) => {
    if (typeof rhs === "bigint")
      return { c0: Fp3.mul(c0, rhs), c1: Fp3.mul(c1, rhs) };
    const { c0: r0, c1: r1 } = rhs;
    let t1 = Fp3.mul(c0, r0);
    let t2 = Fp3.mul(c1, r1);
    const o0 = Fp3.sub(t1, t2);
    const o1 = Fp3.sub(Fp3.mul(Fp3.add(c0, c1), Fp3.add(r0, r1)), Fp3.add(t1, t2));
    return { c0: o0, c1: o1 };
  };
  const Fp2Square = ({ c0, c1 }) => {
    const a = Fp3.add(c0, c1);
    const b = Fp3.sub(c0, c1);
    const c = Fp3.add(c0, c0);
    return { c0: Fp3.mul(a, b), c1: Fp3.mul(c, c1) };
  };
  const Fp2fromBigTuple = (tuple) => {
    if (tuple.length !== 2)
      throw new Error("invalid tuple");
    const fps = tuple.map((n) => Fp3.create(n));
    return { c0: fps[0], c1: fps[1] };
  };
  const FP2_ORDER = ORDER * ORDER;
  const Fp2Nonresidue = Fp2fromBigTuple(opts.FP2_NONRESIDUE);
  const Fp22 = {
    ORDER: FP2_ORDER,
    isLE: Fp3.isLE,
    NONRESIDUE: Fp2Nonresidue,
    BITS: bitLen(FP2_ORDER),
    BYTES: Math.ceil(bitLen(FP2_ORDER) / 8),
    MASK: bitMask(bitLen(FP2_ORDER)),
    ZERO: { c0: Fp3.ZERO, c1: Fp3.ZERO },
    ONE: { c0: Fp3.ONE, c1: Fp3.ZERO },
    create: (num) => num,
    isValid: ({ c0, c1 }) => typeof c0 === "bigint" && typeof c1 === "bigint",
    is0: ({ c0, c1 }) => Fp3.is0(c0) && Fp3.is0(c1),
    eql: ({ c0, c1 }, { c0: r0, c1: r1 }) => Fp3.eql(c0, r0) && Fp3.eql(c1, r1),
    neg: ({ c0, c1 }) => ({ c0: Fp3.neg(c0), c1: Fp3.neg(c1) }),
    pow: (num, power) => FpPow(Fp22, num, power),
    invertBatch: (nums) => FpInvertBatch(Fp22, nums),
    // Normalized
    add: Fp2Add,
    sub: Fp2Subtract,
    mul: Fp2Multiply,
    sqr: Fp2Square,
    // NonNormalized stuff
    addN: Fp2Add,
    subN: Fp2Subtract,
    mulN: Fp2Multiply,
    sqrN: Fp2Square,
    // Why inversion for bigint inside Fp instead of Fp2? it is even used in that context?
    div: (lhs, rhs) => Fp22.mul(lhs, typeof rhs === "bigint" ? Fp3.inv(Fp3.create(rhs)) : Fp22.inv(rhs)),
    inv: ({ c0: a, c1: b }) => {
      const factor = Fp3.inv(Fp3.create(a * a + b * b));
      return { c0: Fp3.mul(factor, Fp3.create(a)), c1: Fp3.mul(factor, Fp3.create(-b)) };
    },
    sqrt: (num) => {
      if (opts.Fp2sqrt)
        return opts.Fp2sqrt(num);
      const { c0, c1 } = num;
      if (Fp3.is0(c1)) {
        if (Fp3.eql(FpLegendre2(Fp3, c0), Fp3.ONE))
          return Fp22.create({ c0: Fp3.sqrt(c0), c1: Fp3.ZERO });
        else
          return Fp22.create({ c0: Fp3.ZERO, c1: Fp3.sqrt(Fp3.div(c0, FpNONRESIDUE)) });
      }
      const a = Fp3.sqrt(Fp3.sub(Fp3.sqr(c0), Fp3.mul(Fp3.sqr(c1), FpNONRESIDUE)));
      let d = Fp3.mul(Fp3.add(a, c0), Fpdiv2);
      const legendre = FpLegendre2(Fp3, d);
      if (!Fp3.is0(legendre) && !Fp3.eql(legendre, Fp3.ONE))
        d = Fp3.sub(d, a);
      const a0 = Fp3.sqrt(d);
      const candidateSqrt = Fp22.create({ c0: a0, c1: Fp3.div(Fp3.mul(c1, Fpdiv2), a0) });
      if (!Fp22.eql(Fp22.sqr(candidateSqrt), num))
        throw new Error("Cannot find square root");
      const x1 = candidateSqrt;
      const x2 = Fp22.neg(x1);
      const { re: re1, im: im1 } = Fp22.reim(x1);
      const { re: re2, im: im2 } = Fp22.reim(x2);
      if (im1 > im2 || im1 === im2 && re1 > re2)
        return x1;
      return x2;
    },
    // Same as sgn0_m_eq_2 in RFC 9380
    isOdd: (x) => {
      const { re: x0, im: x1 } = Fp22.reim(x);
      const sign_0 = x0 % _2n2;
      const zero_0 = x0 === _0n2;
      const sign_1 = x1 % _2n2;
      return BigInt(sign_0 || zero_0 && sign_1) == _1n2;
    },
    // Bytes util
    fromBytes(b) {
      if (b.length !== Fp22.BYTES)
        throw new Error("fromBytes invalid length=" + b.length);
      return { c0: Fp3.fromBytes(b.subarray(0, Fp3.BYTES)), c1: Fp3.fromBytes(b.subarray(Fp3.BYTES)) };
    },
    toBytes: ({ c0, c1 }) => concatBytes2(Fp3.toBytes(c0), Fp3.toBytes(c1)),
    cmov: ({ c0, c1 }, { c0: r0, c1: r1 }, c) => ({
      c0: Fp3.cmov(c0, r0, c),
      c1: Fp3.cmov(c1, r1, c)
    }),
    reim: ({ c0, c1 }) => ({ re: c0, im: c1 }),
    // multiply by u + 1
    mulByNonresidue: ({ c0, c1 }) => Fp22.mul({ c0, c1 }, Fp2Nonresidue),
    mulByB: opts.Fp2mulByB,
    fromBigTuple: Fp2fromBigTuple,
    frobeniusMap: ({ c0, c1 }, power) => ({
      c0,
      c1: Fp3.mul(c1, FP2_FROBENIUS_COEFFICIENTS[power % 2])
    })
  };
  const Fp6Add = ({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }) => ({
    c0: Fp22.add(c0, r0),
    c1: Fp22.add(c1, r1),
    c2: Fp22.add(c2, r2)
  });
  const Fp6Subtract = ({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }) => ({
    c0: Fp22.sub(c0, r0),
    c1: Fp22.sub(c1, r1),
    c2: Fp22.sub(c2, r2)
  });
  const Fp6Multiply = ({ c0, c1, c2 }, rhs) => {
    if (typeof rhs === "bigint") {
      return {
        c0: Fp22.mul(c0, rhs),
        c1: Fp22.mul(c1, rhs),
        c2: Fp22.mul(c2, rhs)
      };
    }
    const { c0: r0, c1: r1, c2: r2 } = rhs;
    const t0 = Fp22.mul(c0, r0);
    const t1 = Fp22.mul(c1, r1);
    const t2 = Fp22.mul(c2, r2);
    return {
      // t0 + (c1 + c2) * (r1 * r2) - (T1 + T2) * (u + 1)
      c0: Fp22.add(t0, Fp22.mulByNonresidue(Fp22.sub(Fp22.mul(Fp22.add(c1, c2), Fp22.add(r1, r2)), Fp22.add(t1, t2)))),
      // (c0 + c1) * (r0 + r1) - (T0 + T1) + T2 * (u + 1)
      c1: Fp22.add(Fp22.sub(Fp22.mul(Fp22.add(c0, c1), Fp22.add(r0, r1)), Fp22.add(t0, t1)), Fp22.mulByNonresidue(t2)),
      // T1 + (c0 + c2) * (r0 + r2) - T0 + T2
      c2: Fp22.sub(Fp22.add(t1, Fp22.mul(Fp22.add(c0, c2), Fp22.add(r0, r2))), Fp22.add(t0, t2))
    };
  };
  const Fp6Square = ({ c0, c1, c2 }) => {
    let t0 = Fp22.sqr(c0);
    let t1 = Fp22.mul(Fp22.mul(c0, c1), _2n2);
    let t3 = Fp22.mul(Fp22.mul(c1, c2), _2n2);
    let t4 = Fp22.sqr(c2);
    return {
      c0: Fp22.add(Fp22.mulByNonresidue(t3), t0),
      // T3 * (u + 1) + T0
      c1: Fp22.add(Fp22.mulByNonresidue(t4), t1),
      // T4 * (u + 1) + T1
      // T1 + (c0 - c1 + c2)² + T3 - T0 - T4
      c2: Fp22.sub(Fp22.sub(Fp22.add(Fp22.add(t1, Fp22.sqr(Fp22.add(Fp22.sub(c0, c1), c2))), t3), t0), t4)
    };
  };
  const [FP6_FROBENIUS_COEFFICIENTS_1, FP6_FROBENIUS_COEFFICIENTS_2] = calcFrobeniusCoefficients(Fp22, Fp2Nonresidue, Fp3.ORDER, 6, 2, 3);
  const Fp62 = {
    ORDER: Fp22.ORDER,
    // TODO: unused, but need to verify
    isLE: Fp22.isLE,
    BITS: 3 * Fp22.BITS,
    BYTES: 3 * Fp22.BYTES,
    MASK: bitMask(3 * Fp22.BITS),
    ZERO: { c0: Fp22.ZERO, c1: Fp22.ZERO, c2: Fp22.ZERO },
    ONE: { c0: Fp22.ONE, c1: Fp22.ZERO, c2: Fp22.ZERO },
    create: (num) => num,
    isValid: ({ c0, c1, c2 }) => Fp22.isValid(c0) && Fp22.isValid(c1) && Fp22.isValid(c2),
    is0: ({ c0, c1, c2 }) => Fp22.is0(c0) && Fp22.is0(c1) && Fp22.is0(c2),
    neg: ({ c0, c1, c2 }) => ({ c0: Fp22.neg(c0), c1: Fp22.neg(c1), c2: Fp22.neg(c2) }),
    eql: ({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }) => Fp22.eql(c0, r0) && Fp22.eql(c1, r1) && Fp22.eql(c2, r2),
    sqrt: notImplemented,
    // Do we need division by bigint at all? Should be done via order:
    div: (lhs, rhs) => Fp62.mul(lhs, typeof rhs === "bigint" ? Fp3.inv(Fp3.create(rhs)) : Fp62.inv(rhs)),
    pow: (num, power) => FpPow(Fp62, num, power),
    invertBatch: (nums) => FpInvertBatch(Fp62, nums),
    // Normalized
    add: Fp6Add,
    sub: Fp6Subtract,
    mul: Fp6Multiply,
    sqr: Fp6Square,
    // NonNormalized stuff
    addN: Fp6Add,
    subN: Fp6Subtract,
    mulN: Fp6Multiply,
    sqrN: Fp6Square,
    inv: ({ c0, c1, c2 }) => {
      let t0 = Fp22.sub(Fp22.sqr(c0), Fp22.mulByNonresidue(Fp22.mul(c2, c1)));
      let t1 = Fp22.sub(Fp22.mulByNonresidue(Fp22.sqr(c2)), Fp22.mul(c0, c1));
      let t2 = Fp22.sub(Fp22.sqr(c1), Fp22.mul(c0, c2));
      let t4 = Fp22.inv(Fp22.add(Fp22.mulByNonresidue(Fp22.add(Fp22.mul(c2, t1), Fp22.mul(c1, t2))), Fp22.mul(c0, t0)));
      return { c0: Fp22.mul(t4, t0), c1: Fp22.mul(t4, t1), c2: Fp22.mul(t4, t2) };
    },
    // Bytes utils
    fromBytes: (b) => {
      if (b.length !== Fp62.BYTES)
        throw new Error("fromBytes invalid length=" + b.length);
      return {
        c0: Fp22.fromBytes(b.subarray(0, Fp22.BYTES)),
        c1: Fp22.fromBytes(b.subarray(Fp22.BYTES, 2 * Fp22.BYTES)),
        c2: Fp22.fromBytes(b.subarray(2 * Fp22.BYTES))
      };
    },
    toBytes: ({ c0, c1, c2 }) => concatBytes2(Fp22.toBytes(c0), Fp22.toBytes(c1), Fp22.toBytes(c2)),
    cmov: ({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }, c) => ({
      c0: Fp22.cmov(c0, r0, c),
      c1: Fp22.cmov(c1, r1, c),
      c2: Fp22.cmov(c2, r2, c)
    }),
    fromBigSix: (t) => {
      if (!Array.isArray(t) || t.length !== 6)
        throw new Error("invalid Fp6 usage");
      return {
        c0: Fp22.fromBigTuple(t.slice(0, 2)),
        c1: Fp22.fromBigTuple(t.slice(2, 4)),
        c2: Fp22.fromBigTuple(t.slice(4, 6))
      };
    },
    frobeniusMap: ({ c0, c1, c2 }, power) => ({
      c0: Fp22.frobeniusMap(c0, power),
      c1: Fp22.mul(Fp22.frobeniusMap(c1, power), FP6_FROBENIUS_COEFFICIENTS_1[power % 6]),
      c2: Fp22.mul(Fp22.frobeniusMap(c2, power), FP6_FROBENIUS_COEFFICIENTS_2[power % 6])
    }),
    mulByFp2: ({ c0, c1, c2 }, rhs) => ({
      c0: Fp22.mul(c0, rhs),
      c1: Fp22.mul(c1, rhs),
      c2: Fp22.mul(c2, rhs)
    }),
    mulByNonresidue: ({ c0, c1, c2 }) => ({ c0: Fp22.mulByNonresidue(c2), c1: c0, c2: c1 }),
    // Sparse multiplication
    mul1: ({ c0, c1, c2 }, b1) => ({
      c0: Fp22.mulByNonresidue(Fp22.mul(c2, b1)),
      c1: Fp22.mul(c0, b1),
      c2: Fp22.mul(c1, b1)
    }),
    // Sparse multiplication
    mul01({ c0, c1, c2 }, b0, b1) {
      let t0 = Fp22.mul(c0, b0);
      let t1 = Fp22.mul(c1, b1);
      return {
        // ((c1 + c2) * b1 - T1) * (u + 1) + T0
        c0: Fp22.add(Fp22.mulByNonresidue(Fp22.sub(Fp22.mul(Fp22.add(c1, c2), b1), t1)), t0),
        // (b0 + b1) * (c0 + c1) - T0 - T1
        c1: Fp22.sub(Fp22.sub(Fp22.mul(Fp22.add(b0, b1), Fp22.add(c0, c1)), t0), t1),
        // (c0 + c2) * b0 - T0 + T1
        c2: Fp22.add(Fp22.sub(Fp22.mul(Fp22.add(c0, c2), b0), t0), t1)
      };
    }
  };
  const FP12_FROBENIUS_COEFFICIENTS = calcFrobeniusCoefficients(Fp22, Fp2Nonresidue, Fp3.ORDER, 12, 1, 6)[0];
  const Fp12Add = ({ c0, c1 }, { c0: r0, c1: r1 }) => ({
    c0: Fp62.add(c0, r0),
    c1: Fp62.add(c1, r1)
  });
  const Fp12Subtract = ({ c0, c1 }, { c0: r0, c1: r1 }) => ({
    c0: Fp62.sub(c0, r0),
    c1: Fp62.sub(c1, r1)
  });
  const Fp12Multiply = ({ c0, c1 }, rhs) => {
    if (typeof rhs === "bigint")
      return { c0: Fp62.mul(c0, rhs), c1: Fp62.mul(c1, rhs) };
    let { c0: r0, c1: r1 } = rhs;
    let t1 = Fp62.mul(c0, r0);
    let t2 = Fp62.mul(c1, r1);
    return {
      c0: Fp62.add(t1, Fp62.mulByNonresidue(t2)),
      // T1 + T2 * v
      // (c0 + c1) * (r0 + r1) - (T1 + T2)
      c1: Fp62.sub(Fp62.mul(Fp62.add(c0, c1), Fp62.add(r0, r1)), Fp62.add(t1, t2))
    };
  };
  const Fp12Square = ({ c0, c1 }) => {
    let ab = Fp62.mul(c0, c1);
    return {
      // (c1 * v + c0) * (c0 + c1) - AB - AB * v
      c0: Fp62.sub(Fp62.sub(Fp62.mul(Fp62.add(Fp62.mulByNonresidue(c1), c0), Fp62.add(c0, c1)), ab), Fp62.mulByNonresidue(ab)),
      c1: Fp62.add(ab, ab)
    };
  };
  function Fp4Square2(a, b) {
    const a2 = Fp22.sqr(a);
    const b2 = Fp22.sqr(b);
    return {
      first: Fp22.add(Fp22.mulByNonresidue(b2), a2),
      // b² * Nonresidue + a²
      second: Fp22.sub(Fp22.sub(Fp22.sqr(Fp22.add(a, b)), a2), b2)
      // (a + b)² - a² - b²
    };
  }
  const Fp122 = {
    ORDER: Fp22.ORDER,
    // TODO: unused, but need to verify
    isLE: Fp62.isLE,
    BITS: 2 * Fp22.BITS,
    BYTES: 2 * Fp22.BYTES,
    MASK: bitMask(2 * Fp22.BITS),
    ZERO: { c0: Fp62.ZERO, c1: Fp62.ZERO },
    ONE: { c0: Fp62.ONE, c1: Fp62.ZERO },
    create: (num) => num,
    isValid: ({ c0, c1 }) => Fp62.isValid(c0) && Fp62.isValid(c1),
    is0: ({ c0, c1 }) => Fp62.is0(c0) && Fp62.is0(c1),
    neg: ({ c0, c1 }) => ({ c0: Fp62.neg(c0), c1: Fp62.neg(c1) }),
    eql: ({ c0, c1 }, { c0: r0, c1: r1 }) => Fp62.eql(c0, r0) && Fp62.eql(c1, r1),
    sqrt: notImplemented,
    inv: ({ c0, c1 }) => {
      let t = Fp62.inv(Fp62.sub(Fp62.sqr(c0), Fp62.mulByNonresidue(Fp62.sqr(c1))));
      return { c0: Fp62.mul(c0, t), c1: Fp62.neg(Fp62.mul(c1, t)) };
    },
    div: (lhs, rhs) => Fp122.mul(lhs, typeof rhs === "bigint" ? Fp3.inv(Fp3.create(rhs)) : Fp122.inv(rhs)),
    pow: (num, power) => FpPow(Fp122, num, power),
    invertBatch: (nums) => FpInvertBatch(Fp122, nums),
    // Normalized
    add: Fp12Add,
    sub: Fp12Subtract,
    mul: Fp12Multiply,
    sqr: Fp12Square,
    // NonNormalized stuff
    addN: Fp12Add,
    subN: Fp12Subtract,
    mulN: Fp12Multiply,
    sqrN: Fp12Square,
    // Bytes utils
    fromBytes: (b) => {
      if (b.length !== Fp122.BYTES)
        throw new Error("fromBytes invalid length=" + b.length);
      return {
        c0: Fp62.fromBytes(b.subarray(0, Fp62.BYTES)),
        c1: Fp62.fromBytes(b.subarray(Fp62.BYTES))
      };
    },
    toBytes: ({ c0, c1 }) => concatBytes2(Fp62.toBytes(c0), Fp62.toBytes(c1)),
    cmov: ({ c0, c1 }, { c0: r0, c1: r1 }, c) => ({
      c0: Fp62.cmov(c0, r0, c),
      c1: Fp62.cmov(c1, r1, c)
    }),
    // Utils
    // toString() {
    //   return '' + 'Fp12(' + this.c0 + this.c1 + '* w');
    // },
    // fromTuple(c: [Fp6, Fp6]) {
    //   return new Fp12(...c);
    // }
    fromBigTwelve: (t) => ({
      c0: Fp62.fromBigSix(t.slice(0, 6)),
      c1: Fp62.fromBigSix(t.slice(6, 12))
    }),
    // Raises to q**i -th power
    frobeniusMap(lhs, power) {
      const { c0, c1, c2 } = Fp62.frobeniusMap(lhs.c1, power);
      const coeff = FP12_FROBENIUS_COEFFICIENTS[power % 12];
      return {
        c0: Fp62.frobeniusMap(lhs.c0, power),
        c1: Fp62.create({
          c0: Fp22.mul(c0, coeff),
          c1: Fp22.mul(c1, coeff),
          c2: Fp22.mul(c2, coeff)
        })
      };
    },
    mulByFp2: ({ c0, c1 }, rhs) => ({
      c0: Fp62.mulByFp2(c0, rhs),
      c1: Fp62.mulByFp2(c1, rhs)
    }),
    conjugate: ({ c0, c1 }) => ({ c0, c1: Fp62.neg(c1) }),
    // Sparse multiplication
    mul014: ({ c0, c1 }, o0, o1, o4) => {
      let t0 = Fp62.mul01(c0, o0, o1);
      let t1 = Fp62.mul1(c1, o4);
      return {
        c0: Fp62.add(Fp62.mulByNonresidue(t1), t0),
        // T1 * v + T0
        // (c1 + c0) * [o0, o1+o4] - T0 - T1
        c1: Fp62.sub(Fp62.sub(Fp62.mul01(Fp62.add(c1, c0), o0, Fp22.add(o1, o4)), t0), t1)
      };
    },
    mul034: ({ c0, c1 }, o0, o3, o4) => {
      const a = Fp62.create({
        c0: Fp22.mul(c0.c0, o0),
        c1: Fp22.mul(c0.c1, o0),
        c2: Fp22.mul(c0.c2, o0)
      });
      const b = Fp62.mul01(c1, o3, o4);
      const e = Fp62.mul01(Fp62.add(c0, c1), Fp22.add(o0, o3), o4);
      return {
        c0: Fp62.add(Fp62.mulByNonresidue(b), a),
        c1: Fp62.sub(e, Fp62.add(a, b))
      };
    },
    // A cyclotomic group is a subgroup of Fp^n defined by
    //   GΦₙ(p) = {α ∈ Fpⁿ : α^Φₙ(p) = 1}
    // The result of any pairing is in a cyclotomic subgroup
    // https://eprint.iacr.org/2009/565.pdf
    _cyclotomicSquare: opts.Fp12cyclotomicSquare,
    _cyclotomicExp: opts.Fp12cyclotomicExp,
    // https://eprint.iacr.org/2010/354.pdf
    // https://eprint.iacr.org/2009/565.pdf
    finalExponentiate: opts.Fp12finalExponentiate
  };
  return { Fp: Fp3, Fp2: Fp22, Fp6: Fp62, Fp4Square: Fp4Square2, Fp12: Fp122 };
}

// node_modules/@noble/curves/esm/bls12-381.js
var _0n3 = BigInt(0);
var _1n3 = BigInt(1);
var _2n3 = BigInt(2);
var _3n3 = BigInt(3);
var _4n = BigInt(4);
var BLS_X = BigInt("0xd201000000010000");
var BLS_X_LEN = bitLen(BLS_X);
var { Fp, Fp2, Fp6, Fp4Square, Fp12 } = tower12({
  // Order of Fp
  ORDER: BigInt("0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab"),
  // Finite extension field over irreducible polynominal.
  // Fp(u) / (u² - β) where β = -1
  FP2_NONRESIDUE: [_1n3, _1n3],
  Fp2mulByB: ({ c0, c1 }) => {
    const t0 = Fp.mul(c0, _4n);
    const t1 = Fp.mul(c1, _4n);
    return { c0: Fp.sub(t0, t1), c1: Fp.add(t0, t1) };
  },
  // Fp12
  // A cyclotomic group is a subgroup of Fp^n defined by
  //   GΦₙ(p) = {α ∈ Fpⁿ : α^Φₙ(p) = 1}
  // The result of any pairing is in a cyclotomic subgroup
  // https://eprint.iacr.org/2009/565.pdf
  Fp12cyclotomicSquare: ({ c0, c1 }) => {
    const { c0: c0c0, c1: c0c1, c2: c0c2 } = c0;
    const { c0: c1c0, c1: c1c1, c2: c1c2 } = c1;
    const { first: t3, second: t4 } = Fp4Square(c0c0, c1c1);
    const { first: t5, second: t6 } = Fp4Square(c1c0, c0c2);
    const { first: t7, second: t8 } = Fp4Square(c0c1, c1c2);
    const t9 = Fp2.mulByNonresidue(t8);
    return {
      c0: Fp6.create({
        c0: Fp2.add(Fp2.mul(Fp2.sub(t3, c0c0), _2n3), t3),
        // 2 * (T3 - c0c0)  + T3
        c1: Fp2.add(Fp2.mul(Fp2.sub(t5, c0c1), _2n3), t5),
        // 2 * (T5 - c0c1)  + T5
        c2: Fp2.add(Fp2.mul(Fp2.sub(t7, c0c2), _2n3), t7)
      }),
      // 2 * (T7 - c0c2)  + T7
      c1: Fp6.create({
        c0: Fp2.add(Fp2.mul(Fp2.add(t9, c1c0), _2n3), t9),
        // 2 * (T9 + c1c0) + T9
        c1: Fp2.add(Fp2.mul(Fp2.add(t4, c1c1), _2n3), t4),
        // 2 * (T4 + c1c1) + T4
        c2: Fp2.add(Fp2.mul(Fp2.add(t6, c1c2), _2n3), t6)
      })
    };
  },
  Fp12cyclotomicExp(num, n) {
    let z = Fp12.ONE;
    for (let i = BLS_X_LEN - 1; i >= 0; i--) {
      z = Fp12._cyclotomicSquare(z);
      if (bitGet(n, i))
        z = Fp12.mul(z, num);
    }
    return z;
  },
  // https://eprint.iacr.org/2010/354.pdf
  // https://eprint.iacr.org/2009/565.pdf
  Fp12finalExponentiate: (num) => {
    const x = BLS_X;
    const t0 = Fp12.div(Fp12.frobeniusMap(num, 6), num);
    const t1 = Fp12.mul(Fp12.frobeniusMap(t0, 2), t0);
    const t2 = Fp12.conjugate(Fp12._cyclotomicExp(t1, x));
    const t3 = Fp12.mul(Fp12.conjugate(Fp12._cyclotomicSquare(t1)), t2);
    const t4 = Fp12.conjugate(Fp12._cyclotomicExp(t3, x));
    const t5 = Fp12.conjugate(Fp12._cyclotomicExp(t4, x));
    const t6 = Fp12.mul(Fp12.conjugate(Fp12._cyclotomicExp(t5, x)), Fp12._cyclotomicSquare(t2));
    const t7 = Fp12.conjugate(Fp12._cyclotomicExp(t6, x));
    const t2_t5_pow_q2 = Fp12.frobeniusMap(Fp12.mul(t2, t5), 2);
    const t4_t1_pow_q3 = Fp12.frobeniusMap(Fp12.mul(t4, t1), 3);
    const t6_t1c_pow_q1 = Fp12.frobeniusMap(Fp12.mul(t6, Fp12.conjugate(t1)), 1);
    const t7_t3c_t1 = Fp12.mul(Fp12.mul(t7, Fp12.conjugate(t3)), t1);
    return Fp12.mul(Fp12.mul(Fp12.mul(t2_t5_pow_q2, t4_t1_pow_q3), t6_t1c_pow_q1), t7_t3c_t1);
  }
});
var Fr = Field(BigInt("0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001"));
var isogenyMapG2 = isogenyMap(Fp2, [
  // xNum
  [
    [
      "0x5c759507e8e333ebb5b7a9a47d7ed8532c52d39fd3a042a88b58423c50ae15d5c2638e343d9c71c6238aaaaaaaa97d6",
      "0x5c759507e8e333ebb5b7a9a47d7ed8532c52d39fd3a042a88b58423c50ae15d5c2638e343d9c71c6238aaaaaaaa97d6"
    ],
    [
      "0x0",
      "0x11560bf17baa99bc32126fced787c88f984f87adf7ae0c7f9a208c6b4f20a4181472aaa9cb8d555526a9ffffffffc71a"
    ],
    [
      "0x11560bf17baa99bc32126fced787c88f984f87adf7ae0c7f9a208c6b4f20a4181472aaa9cb8d555526a9ffffffffc71e",
      "0x8ab05f8bdd54cde190937e76bc3e447cc27c3d6fbd7063fcd104635a790520c0a395554e5c6aaaa9354ffffffffe38d"
    ],
    [
      "0x171d6541fa38ccfaed6dea691f5fb614cb14b4e7f4e810aa22d6108f142b85757098e38d0f671c7188e2aaaaaaaa5ed1",
      "0x0"
    ]
  ],
  // xDen
  [
    [
      "0x0",
      "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaa63"
    ],
    [
      "0xc",
      "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaa9f"
    ],
    ["0x1", "0x0"]
    // LAST 1
  ],
  // yNum
  [
    [
      "0x1530477c7ab4113b59a4c18b076d11930f7da5d4a07f649bf54439d87d27e500fc8c25ebf8c92f6812cfc71c71c6d706",
      "0x1530477c7ab4113b59a4c18b076d11930f7da5d4a07f649bf54439d87d27e500fc8c25ebf8c92f6812cfc71c71c6d706"
    ],
    [
      "0x0",
      "0x5c759507e8e333ebb5b7a9a47d7ed8532c52d39fd3a042a88b58423c50ae15d5c2638e343d9c71c6238aaaaaaaa97be"
    ],
    [
      "0x11560bf17baa99bc32126fced787c88f984f87adf7ae0c7f9a208c6b4f20a4181472aaa9cb8d555526a9ffffffffc71c",
      "0x8ab05f8bdd54cde190937e76bc3e447cc27c3d6fbd7063fcd104635a790520c0a395554e5c6aaaa9354ffffffffe38f"
    ],
    [
      "0x124c9ad43b6cf79bfbf7043de3811ad0761b0f37a1e26286b0e977c69aa274524e79097a56dc4bd9e1b371c71c718b10",
      "0x0"
    ]
  ],
  // yDen
  [
    [
      "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffa8fb",
      "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffa8fb"
    ],
    [
      "0x0",
      "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffa9d3"
    ],
    [
      "0x12",
      "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaa99"
    ],
    ["0x1", "0x0"]
    // LAST 1
  ]
].map((i) => i.map((pair) => Fp2.fromBigTuple(pair.map(BigInt)))));
var isogenyMapG1 = isogenyMap(Fp, [
  // xNum
  [
    "0x11a05f2b1e833340b809101dd99815856b303e88a2d7005ff2627b56cdb4e2c85610c2d5f2e62d6eaeac1662734649b7",
    "0x17294ed3e943ab2f0588bab22147a81c7c17e75b2f6a8417f565e33c70d1e86b4838f2a6f318c356e834eef1b3cb83bb",
    "0xd54005db97678ec1d1048c5d10a9a1bce032473295983e56878e501ec68e25c958c3e3d2a09729fe0179f9dac9edcb0",
    "0x1778e7166fcc6db74e0609d307e55412d7f5e4656a8dbf25f1b33289f1b330835336e25ce3107193c5b388641d9b6861",
    "0xe99726a3199f4436642b4b3e4118e5499db995a1257fb3f086eeb65982fac18985a286f301e77c451154ce9ac8895d9",
    "0x1630c3250d7313ff01d1201bf7a74ab5db3cb17dd952799b9ed3ab9097e68f90a0870d2dcae73d19cd13c1c66f652983",
    "0xd6ed6553fe44d296a3726c38ae652bfb11586264f0f8ce19008e218f9c86b2a8da25128c1052ecaddd7f225a139ed84",
    "0x17b81e7701abdbe2e8743884d1117e53356de5ab275b4db1a682c62ef0f2753339b7c8f8c8f475af9ccb5618e3f0c88e",
    "0x80d3cf1f9a78fc47b90b33563be990dc43b756ce79f5574a2c596c928c5d1de4fa295f296b74e956d71986a8497e317",
    "0x169b1f8e1bcfa7c42e0c37515d138f22dd2ecb803a0c5c99676314baf4bb1b7fa3190b2edc0327797f241067be390c9e",
    "0x10321da079ce07e272d8ec09d2565b0dfa7dccdde6787f96d50af36003b14866f69b771f8c285decca67df3f1605fb7b",
    "0x6e08c248e260e70bd1e962381edee3d31d79d7e22c837bc23c0bf1bc24c6b68c24b1b80b64d391fa9c8ba2e8ba2d229"
  ],
  // xDen
  [
    "0x8ca8d548cff19ae18b2e62f4bd3fa6f01d5ef4ba35b48ba9c9588617fc8ac62b558d681be343df8993cf9fa40d21b1c",
    "0x12561a5deb559c4348b4711298e536367041e8ca0cf0800c0126c2588c48bf5713daa8846cb026e9e5c8276ec82b3bff",
    "0xb2962fe57a3225e8137e629bff2991f6f89416f5a718cd1fca64e00b11aceacd6a3d0967c94fedcfcc239ba5cb83e19",
    "0x3425581a58ae2fec83aafef7c40eb545b08243f16b1655154cca8abc28d6fd04976d5243eecf5c4130de8938dc62cd8",
    "0x13a8e162022914a80a6f1d5f43e7a07dffdfc759a12062bb8d6b44e833b306da9bd29ba81f35781d539d395b3532a21e",
    "0xe7355f8e4e667b955390f7f0506c6e9395735e9ce9cad4d0a43bcef24b8982f7400d24bc4228f11c02df9a29f6304a5",
    "0x772caacf16936190f3e0c63e0596721570f5799af53a1894e2e073062aede9cea73b3538f0de06cec2574496ee84a3a",
    "0x14a7ac2a9d64a8b230b3f5b074cf01996e7f63c21bca68a81996e1cdf9822c580fa5b9489d11e2d311f7d99bbdcc5a5e",
    "0xa10ecf6ada54f825e920b3dafc7a3cce07f8d1d7161366b74100da67f39883503826692abba43704776ec3a79a1d641",
    "0x95fc13ab9e92ad4476d6e3eb3a56680f682b4ee96f7d03776df533978f31c1593174e4b4b7865002d6384d168ecdd0a",
    "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001"
    // LAST 1
  ],
  // yNum
  [
    "0x90d97c81ba24ee0259d1f094980dcfa11ad138e48a869522b52af6c956543d3cd0c7aee9b3ba3c2be9845719707bb33",
    "0x134996a104ee5811d51036d776fb46831223e96c254f383d0f906343eb67ad34d6c56711962fa8bfe097e75a2e41c696",
    "0xcc786baa966e66f4a384c86a3b49942552e2d658a31ce2c344be4b91400da7d26d521628b00523b8dfe240c72de1f6",
    "0x1f86376e8981c217898751ad8746757d42aa7b90eeb791c09e4a3ec03251cf9de405aba9ec61deca6355c77b0e5f4cb",
    "0x8cc03fdefe0ff135caf4fe2a21529c4195536fbe3ce50b879833fd221351adc2ee7f8dc099040a841b6daecf2e8fedb",
    "0x16603fca40634b6a2211e11db8f0a6a074a7d0d4afadb7bd76505c3d3ad5544e203f6326c95a807299b23ab13633a5f0",
    "0x4ab0b9bcfac1bbcb2c977d027796b3ce75bb8ca2be184cb5231413c4d634f3747a87ac2460f415ec961f8855fe9d6f2",
    "0x987c8d5333ab86fde9926bd2ca6c674170a05bfe3bdd81ffd038da6c26c842642f64550fedfe935a15e4ca31870fb29",
    "0x9fc4018bd96684be88c9e221e4da1bb8f3abd16679dc26c1e8b6e6a1f20cabe69d65201c78607a360370e577bdba587",
    "0xe1bba7a1186bdb5223abde7ada14a23c42a0ca7915af6fe06985e7ed1e4d43b9b3f7055dd4eba6f2bafaaebca731c30",
    "0x19713e47937cd1be0dfd0b8f1d43fb93cd2fcbcb6caf493fd1183e416389e61031bf3a5cce3fbafce813711ad011c132",
    "0x18b46a908f36f6deb918c143fed2edcc523559b8aaf0c2462e6bfe7f911f643249d9cdf41b44d606ce07c8a4d0074d8e",
    "0xb182cac101b9399d155096004f53f447aa7b12a3426b08ec02710e807b4633f06c851c1919211f20d4c04f00b971ef8",
    "0x245a394ad1eca9b72fc00ae7be315dc757b3b080d4c158013e6632d3c40659cc6cf90ad1c232a6442d9d3f5db980133",
    "0x5c129645e44cf1102a159f748c4a3fc5e673d81d7e86568d9ab0f5d396a7ce46ba1049b6579afb7866b1e715475224b",
    "0x15e6be4e990f03ce4ea50b3b42df2eb5cb181d8f84965a3957add4fa95af01b2b665027efec01c7704b456be69c8b604"
  ],
  // yDen
  [
    "0x16112c4c3a9c98b252181140fad0eae9601a6de578980be6eec3232b5be72e7a07f3688ef60c206d01479253b03663c1",
    "0x1962d75c2381201e1a0cbd6c43c348b885c84ff731c4d59ca4a10356f453e01f78a4260763529e3532f6102c2e49a03d",
    "0x58df3306640da276faaae7d6e8eb15778c4855551ae7f310c35a5dd279cd2eca6757cd636f96f891e2538b53dbf67f2",
    "0x16b7d288798e5395f20d23bf89edb4d1d115c5dbddbcd30e123da489e726af41727364f2c28297ada8d26d98445f5416",
    "0xbe0e079545f43e4b00cc912f8228ddcc6d19c9f0f69bbb0542eda0fc9dec916a20b15dc0fd2ededda39142311a5001d",
    "0x8d9e5297186db2d9fb266eaac783182b70152c65550d881c5ecd87b6f0f5a6449f38db9dfa9cce202c6477faaf9b7ac",
    "0x166007c08a99db2fc3ba8734ace9824b5eecfdfa8d0cf8ef5dd365bc400a0051d5fa9c01a58b1fb93d1a1399126a775c",
    "0x16a3ef08be3ea7ea03bcddfabba6ff6ee5a4375efa1f4fd7feb34fd206357132b920f5b00801dee460ee415a15812ed9",
    "0x1866c8ed336c61231a1be54fd1d74cc4f9fb0ce4c6af5920abc5750c4bf39b4852cfe2f7bb9248836b233d9d55535d4a",
    "0x167a55cda70a6e1cea820597d94a84903216f763e13d87bb5308592e7ea7d4fbc7385ea3d529b35e346ef48bb8913f55",
    "0x4d2f259eea405bd48f010a01ad2911d9c6dd039bb61a6290e591b36e636a5c871a5c29f4f83060400f8b49cba8f6aa8",
    "0xaccbb67481d033ff5852c1e48c50c477f94ff8aefce42d28c0f9a88cea7913516f968986f7ebbea9684b529e2561092",
    "0xad6b9514c767fe3c3613144b45f1496543346d98adf02267d5ceef9a00d9b8693000763e3b90ac11e99b138573345cc",
    "0x2660400eb2e4f3b628bdd0d53cd76f2bf565b94e72927c1cb748df27942480e420517bd8714cc80d1fadc1326ed06f7",
    "0xe0fa1d816ddc03e6b24255e0d7819c171c40f65e273b853324efcd6356caa205ca2f570f13497804415473a1d634b8f",
    "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001"
    // LAST 1
  ]
].map((i) => i.map((j) => BigInt(j))));
var G2_SWU = mapToCurveSimpleSWU(Fp2, {
  A: Fp2.create({ c0: Fp.create(_0n3), c1: Fp.create(BigInt(240)) }),
  // A' = 240 * I
  B: Fp2.create({ c0: Fp.create(BigInt(1012)), c1: Fp.create(BigInt(1012)) }),
  // B' = 1012 * (1 + I)
  Z: Fp2.create({ c0: Fp.create(BigInt(-2)), c1: Fp.create(BigInt(-1)) })
  // Z: -(2 + I)
});
var G1_SWU = mapToCurveSimpleSWU(Fp, {
  A: Fp.create(BigInt("0x144698a3b8e9433d693a02c96d4982b0ea985383ee66a8d8e8981aefd881ac98936f8da0e0f97f5cf428082d584c1d")),
  B: Fp.create(BigInt("0x12e2908d11688030018b12e8753eee3b2016c1f0f24f4070a0b9c14fcef35ef55a23215a316ceaa5d1cc48e98e172be0")),
  Z: Fp.create(BigInt(11))
});
var { G2psi, G2psi2 } = psiFrobenius(Fp, Fp2, Fp2.div(Fp2.ONE, Fp2.NONRESIDUE));
var htfDefaults = Object.freeze({
  // DST: a domain separation tag
  // defined in section 2.2.5
  // Use utils.getDSTLabel(), utils.setDSTLabel(value)
  DST: "BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_NUL_",
  encodeDST: "BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_NUL_",
  // p: the characteristic of F
  //    where F is a finite field of characteristic p and order q = p^m
  p: Fp.ORDER,
  // m: the extension degree of F, m >= 1
  //     where F is a finite field of characteristic p and order q = p^m
  m: 2,
  // k: the target security level for the suite in bits
  // defined in section 5.1
  k: 128,
  // option to use a message that has already been processed by
  // expand_message_xmd
  expand: "xmd",
  // Hash functions for: expand_message_xmd is appropriate for use with a
  // wide range of hash functions, including SHA-2, SHA-3, BLAKE2, and others.
  // BBS+ uses blake2: https://github.com/hyperledger/aries-framework-go/issues/2247
  hash: sha256
});
var COMPRESSED_ZERO = setMask(Fp.toBytes(_0n3), { infinity: true, compressed: true });
function parseMask(bytes) {
  bytes = bytes.slice();
  const mask = bytes[0] & 224;
  const compressed = !!(mask >> 7 & 1);
  const infinity = !!(mask >> 6 & 1);
  const sort = !!(mask >> 5 & 1);
  bytes[0] &= 31;
  return { compressed, infinity, sort, value: bytes };
}
function setMask(bytes, mask) {
  if (bytes[0] & 224)
    throw new Error("setMask: non-empty mask");
  if (mask.compressed)
    bytes[0] |= 128;
  if (mask.infinity)
    bytes[0] |= 64;
  if (mask.sort)
    bytes[0] |= 32;
  return bytes;
}
function signatureG1ToRawBytes(point) {
  point.assertValidity();
  const isZero = point.equals(bls12_381.G1.ProjectivePoint.ZERO);
  const { x, y } = point.toAffine();
  if (isZero)
    return COMPRESSED_ZERO.slice();
  const P = Fp.ORDER;
  const sort = Boolean(y * _2n3 / P);
  return setMask(numberToBytesBE(x, Fp.BYTES), { compressed: true, sort });
}
function signatureG2ToRawBytes(point) {
  point.assertValidity();
  const len = Fp.BYTES;
  if (point.equals(bls12_381.G2.ProjectivePoint.ZERO))
    return concatBytes2(COMPRESSED_ZERO, numberToBytesBE(_0n3, len));
  const { x, y } = point.toAffine();
  const { re: x0, im: x1 } = Fp2.reim(x);
  const { re: y0, im: y1 } = Fp2.reim(y);
  const tmp = y1 > _0n3 ? y1 * _2n3 : y0 * _2n3;
  const sort = Boolean(tmp / Fp.ORDER & _1n3);
  const z2 = x0;
  return concatBytes2(setMask(numberToBytesBE(x1, len), { sort, compressed: true }), numberToBytesBE(z2, len));
}
var bls12_381 = bls({
  // Fields
  fields: {
    Fp,
    Fp2,
    Fp6,
    Fp12,
    Fr
  },
  // G1 is the order-q subgroup of E1(Fp) : y² = x³ + 4, #E1(Fp) = h1q, where
  // characteristic; z + (z⁴ - z² + 1)(z - 1)²/3
  G1: {
    Fp,
    // cofactor; (z - 1)²/3
    h: BigInt("0x396c8c005555e1568c00aaab0000aaab"),
    // generator's coordinates
    // x = 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507
    // y = 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569
    Gx: BigInt("0x17f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb"),
    Gy: BigInt("0x08b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1"),
    a: Fp.ZERO,
    b: _4n,
    htfDefaults: { ...htfDefaults, m: 1, DST: "BLS_SIG_BLS12381G1_XMD:SHA-256_SSWU_RO_NUL_" },
    wrapPrivateKey: true,
    allowInfinityPoint: true,
    // Checks is the point resides in prime-order subgroup.
    // point.isTorsionFree() should return true for valid points
    // It returns false for shitty points.
    // https://eprint.iacr.org/2021/1130.pdf
    isTorsionFree: (c, point) => {
      const cubicRootOfUnityModP = BigInt("0x5f19672fdf76ce51ba69c6076a0f77eaddb3a93be6f89688de17d813620a00022e01fffffffefffe");
      const phi = new c(Fp.mul(point.px, cubicRootOfUnityModP), point.py, point.pz);
      const xP = point.multiplyUnsafe(BLS_X).negate();
      const u2P = xP.multiplyUnsafe(BLS_X);
      return u2P.equals(phi);
    },
    // Clear cofactor of G1
    // https://eprint.iacr.org/2019/403
    clearCofactor: (_c, point) => {
      return point.multiplyUnsafe(BLS_X).add(point);
    },
    mapToCurve: (scalars) => {
      const { x, y } = G1_SWU(Fp.create(scalars[0]));
      return isogenyMapG1(x, y);
    },
    fromBytes: (bytes) => {
      const { compressed, infinity, sort, value } = parseMask(bytes);
      if (value.length === 48 && compressed) {
        const P = Fp.ORDER;
        const compressedValue = bytesToNumberBE(value);
        const x = Fp.create(compressedValue & Fp.MASK);
        if (infinity) {
          if (x !== _0n3)
            throw new Error("G1: non-empty compressed point at infinity");
          return { x: _0n3, y: _0n3 };
        }
        const right = Fp.add(Fp.pow(x, _3n3), Fp.create(bls12_381.params.G1b));
        let y = Fp.sqrt(right);
        if (!y)
          throw new Error("invalid compressed G1 point");
        if (y * _2n3 / P !== BigInt(sort))
          y = Fp.neg(y);
        return { x: Fp.create(x), y: Fp.create(y) };
      } else if (value.length === 96 && !compressed) {
        const x = bytesToNumberBE(value.subarray(0, Fp.BYTES));
        const y = bytesToNumberBE(value.subarray(Fp.BYTES));
        if (infinity) {
          if (x !== _0n3 || y !== _0n3)
            throw new Error("G1: non-empty point at infinity");
          return bls12_381.G1.ProjectivePoint.ZERO.toAffine();
        }
        return { x: Fp.create(x), y: Fp.create(y) };
      } else {
        throw new Error("invalid point G1, expected 48/96 bytes");
      }
    },
    toBytes: (c, point, isCompressed) => {
      const isZero = point.equals(c.ZERO);
      const { x, y } = point.toAffine();
      if (isCompressed) {
        if (isZero)
          return COMPRESSED_ZERO.slice();
        const P = Fp.ORDER;
        const sort = Boolean(y * _2n3 / P);
        return setMask(numberToBytesBE(x, Fp.BYTES), { compressed: true, sort });
      } else {
        if (isZero) {
          const x2 = concatBytes2(new Uint8Array([64]), new Uint8Array(2 * Fp.BYTES - 1));
          return x2;
        } else {
          return concatBytes2(numberToBytesBE(x, Fp.BYTES), numberToBytesBE(y, Fp.BYTES));
        }
      }
    },
    ShortSignature: {
      fromHex(hex2) {
        const { infinity, sort, value } = parseMask(ensureBytes("signatureHex", hex2, 48));
        const P = Fp.ORDER;
        const compressedValue = bytesToNumberBE(value);
        if (infinity)
          return bls12_381.G1.ProjectivePoint.ZERO;
        const x = Fp.create(compressedValue & Fp.MASK);
        const right = Fp.add(Fp.pow(x, _3n3), Fp.create(bls12_381.params.G1b));
        let y = Fp.sqrt(right);
        if (!y)
          throw new Error("invalid compressed G1 point");
        const aflag = BigInt(sort);
        if (y * _2n3 / P !== aflag)
          y = Fp.neg(y);
        const point = bls12_381.G1.ProjectivePoint.fromAffine({ x, y });
        point.assertValidity();
        return point;
      },
      toRawBytes(point) {
        return signatureG1ToRawBytes(point);
      },
      toHex(point) {
        return bytesToHex2(signatureG1ToRawBytes(point));
      }
    }
  },
  // G2 is the order-q subgroup of E2(Fp²) : y² = x³+4(1+√−1),
  // where Fp2 is Fp[√−1]/(x2+1). #E2(Fp2 ) = h2q, where
  // G² - 1
  // h2q
  G2: {
    Fp: Fp2,
    // cofactor
    h: BigInt("0x5d543a95414e7f1091d50792876a202cd91de4547085abaa68a205b2e5a7ddfa628f1cb4d9e82ef21537e293a6691ae1616ec6e786f0c70cf1c38e31c7238e5"),
    Gx: Fp2.fromBigTuple([
      BigInt("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8"),
      BigInt("0x13e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e")
    ]),
    // y =
    // 927553665492332455747201965776037880757740193453592970025027978793976877002675564980949289727957565575433344219582,
    // 1985150602287291935568054521177171638300868978215655730859378665066344726373823718423869104263333984641494340347905
    Gy: Fp2.fromBigTuple([
      BigInt("0x0ce5d527727d6e118cc9cdc6da2e351aadfd9baa8cbdd3a76d429a695160d12c923ac9cc3baca289e193548608b82801"),
      BigInt("0x0606c4a02ea734cc32acd2b02bc28b99cb3e287e85a763af267492ab572e99ab3f370d275cec1da1aaa9075ff05f79be")
    ]),
    a: Fp2.ZERO,
    b: Fp2.fromBigTuple([_4n, _4n]),
    hEff: BigInt("0xbc69f08f2ee75b3584c6a0ea91b352888e2a8e9145ad7689986ff031508ffe1329c2f178731db956d82bf015d1212b02ec0ec69d7477c1ae954cbc06689f6a359894c0adebbf6b4e8020005aaa95551"),
    htfDefaults: { ...htfDefaults },
    wrapPrivateKey: true,
    allowInfinityPoint: true,
    mapToCurve: (scalars) => {
      const { x, y } = G2_SWU(Fp2.fromBigTuple(scalars));
      return isogenyMapG2(x, y);
    },
    // Checks is the point resides in prime-order subgroup.
    // point.isTorsionFree() should return true for valid points
    // It returns false for shitty points.
    // https://eprint.iacr.org/2021/1130.pdf
    isTorsionFree: (c, P) => {
      return P.multiplyUnsafe(BLS_X).negate().equals(G2psi(c, P));
    },
    // Maps the point into the prime-order subgroup G2.
    // clear_cofactor_bls12381_g2 from cfrg-hash-to-curve-11
    // https://eprint.iacr.org/2017/419.pdf
    // prettier-ignore
    clearCofactor: (c, P) => {
      const x = BLS_X;
      let t1 = P.multiplyUnsafe(x).negate();
      let t2 = G2psi(c, P);
      let t3 = P.double();
      t3 = G2psi2(c, t3);
      t3 = t3.subtract(t2);
      t2 = t1.add(t2);
      t2 = t2.multiplyUnsafe(x).negate();
      t3 = t3.add(t2);
      t3 = t3.subtract(t1);
      const Q = t3.subtract(P);
      return Q;
    },
    fromBytes: (bytes) => {
      const { compressed, infinity, sort, value } = parseMask(bytes);
      if (!compressed && !infinity && sort || // 00100000
      !compressed && infinity && sort || // 01100000
      sort && infinity && compressed) {
        throw new Error("invalid encoding flag: " + (bytes[0] & 224));
      }
      const L = Fp.BYTES;
      const slc = (b, from26, to3) => bytesToNumberBE(b.slice(from26, to3));
      if (value.length === 96 && compressed) {
        const b = bls12_381.params.G2b;
        const P = Fp.ORDER;
        if (infinity) {
          if (value.reduce((p, c) => p !== 0 ? c + 1 : c, 0) > 0) {
            throw new Error("invalid compressed G2 point");
          }
          return { x: Fp2.ZERO, y: Fp2.ZERO };
        }
        const x_1 = slc(value, 0, L);
        const x_0 = slc(value, L, 2 * L);
        const x = Fp2.create({ c0: Fp.create(x_0), c1: Fp.create(x_1) });
        const right = Fp2.add(Fp2.pow(x, _3n3), b);
        let y = Fp2.sqrt(right);
        const Y_bit = y.c1 === _0n3 ? y.c0 * _2n3 / P : y.c1 * _2n3 / P ? _1n3 : _0n3;
        y = sort && Y_bit > 0 ? y : Fp2.neg(y);
        return { x, y };
      } else if (value.length === 192 && !compressed) {
        if (infinity) {
          if (value.reduce((p, c) => p !== 0 ? c + 1 : c, 0) > 0) {
            throw new Error("invalid uncompressed G2 point");
          }
          return { x: Fp2.ZERO, y: Fp2.ZERO };
        }
        const x1 = slc(value, 0, L);
        const x0 = slc(value, L, 2 * L);
        const y1 = slc(value, 2 * L, 3 * L);
        const y0 = slc(value, 3 * L, 4 * L);
        return { x: Fp2.fromBigTuple([x0, x1]), y: Fp2.fromBigTuple([y0, y1]) };
      } else {
        throw new Error("invalid point G2, expected 96/192 bytes");
      }
    },
    toBytes: (c, point, isCompressed) => {
      const { BYTES: len, ORDER: P } = Fp;
      const isZero = point.equals(c.ZERO);
      const { x, y } = point.toAffine();
      if (isCompressed) {
        if (isZero)
          return concatBytes2(COMPRESSED_ZERO, numberToBytesBE(_0n3, len));
        const flag = Boolean(y.c1 === _0n3 ? y.c0 * _2n3 / P : y.c1 * _2n3 / P);
        return concatBytes2(setMask(numberToBytesBE(x.c1, len), { compressed: true, sort: flag }), numberToBytesBE(x.c0, len));
      } else {
        if (isZero)
          return concatBytes2(new Uint8Array([64]), new Uint8Array(4 * len - 1));
        const { re: x0, im: x1 } = Fp2.reim(x);
        const { re: y0, im: y1 } = Fp2.reim(y);
        return concatBytes2(numberToBytesBE(x1, len), numberToBytesBE(x0, len), numberToBytesBE(y1, len), numberToBytesBE(y0, len));
      }
    },
    Signature: {
      // TODO: Optimize, it's very slow because of sqrt.
      fromHex(hex2) {
        const { infinity, sort, value } = parseMask(ensureBytes("signatureHex", hex2));
        const P = Fp.ORDER;
        const half = value.length / 2;
        if (half !== 48 && half !== 96)
          throw new Error("invalid compressed signature length, must be 96 or 192");
        const z1 = bytesToNumberBE(value.slice(0, half));
        const z2 = bytesToNumberBE(value.slice(half));
        if (infinity)
          return bls12_381.G2.ProjectivePoint.ZERO;
        const x1 = Fp.create(z1 & Fp.MASK);
        const x2 = Fp.create(z2);
        const x = Fp2.create({ c0: x2, c1: x1 });
        const y2 = Fp2.add(Fp2.pow(x, _3n3), bls12_381.params.G2b);
        let y = Fp2.sqrt(y2);
        if (!y)
          throw new Error("Failed to find a square root");
        const { re: y0, im: y1 } = Fp2.reim(y);
        const aflag1 = BigInt(sort);
        const isGreater = y1 > _0n3 && y1 * _2n3 / P !== aflag1;
        const isZero = y1 === _0n3 && y0 * _2n3 / P !== aflag1;
        if (isGreater || isZero)
          y = Fp2.neg(y);
        const point = bls12_381.G2.ProjectivePoint.fromAffine({ x, y });
        point.assertValidity();
        return point;
      },
      toRawBytes(point) {
        return signatureG2ToRawBytes(point);
      },
      toHex(point) {
        return bytesToHex2(signatureG2ToRawBytes(point));
      }
    }
  },
  params: {
    ateLoopSize: BLS_X,
    // The BLS parameter x for BLS12-381
    r: Fr.ORDER,
    // order; z⁴ − z² + 1; CURVE.n from other curves
    xNegative: true,
    twistType: "multiplicative"
  },
  htfDefaults,
  hash: sha256,
  randomBytes
});

// node_modules/ox/_esm/core/Bls.js
var noble = bls12_381;
function aggregate(points) {
  var _a;
  const group = typeof ((_a = points[0]) == null ? void 0 : _a.x) === "bigint" ? bls12_381.G1 : bls12_381.G2;
  const point = points.reduce((acc, point2) => acc.add(new group.ProjectivePoint(point2.x, point2.y, point2.z)), group.ProjectivePoint.ZERO);
  return {
    x: point.px,
    y: point.py,
    z: point.pz
  };
}
function getPublicKey(options) {
  const { privateKey, size: size4 = "short-key:long-sig" } = options;
  const group = size4 === "short-key:long-sig" ? bls12_381.G1 : bls12_381.G2;
  const { px, py, pz } = group.ProjectivePoint.fromPrivateKey(from2(privateKey).slice(2));
  return { x: px, y: py, z: pz };
}
function randomPrivateKey(options = {}) {
  const { as = "Hex" } = options;
  const bytes = bls12_381.utils.randomPrivateKey();
  if (as === "Hex")
    return fromBytes(bytes);
  return bytes;
}
function sign(options) {
  const { payload, privateKey, suite, size: size4 = "short-key:long-sig" } = options;
  const payloadGroup = size4 === "short-key:long-sig" ? bls12_381.G2 : bls12_381.G1;
  const payloadPoint = payloadGroup.hashToCurve(from(payload), suite ? { DST: fromString(suite) } : void 0);
  const privateKeyGroup = size4 === "short-key:long-sig" ? bls12_381.G1 : bls12_381.G2;
  const signature = payloadPoint.multiply(privateKeyGroup.normPrivateKeyToScalar(privateKey.slice(2)));
  return {
    x: signature.px,
    y: signature.py,
    z: signature.pz
  };
}
function verify(options) {
  const { payload, suite } = options;
  const publicKey = options.publicKey;
  const signature = options.signature;
  const isShortSig = typeof signature.x === "bigint";
  const group = isShortSig ? bls12_381.G1 : bls12_381.G2;
  const payloadPoint = group.hashToCurve(from(payload), suite ? { DST: fromString(suite) } : void 0);
  const shortSigPairing = () => bls12_381.pairingBatch([
    {
      g1: payloadPoint,
      g2: new bls12_381.G2.ProjectivePoint(publicKey.x, publicKey.y, publicKey.z)
    },
    {
      g1: new bls12_381.G1.ProjectivePoint(signature.x, signature.y, signature.z),
      g2: bls12_381.G2.ProjectivePoint.BASE.negate()
    }
  ]);
  const longSigPairing = () => bls12_381.pairingBatch([
    {
      g1: new bls12_381.G1.ProjectivePoint(publicKey.x, publicKey.y, publicKey.z).negate(),
      g2: payloadPoint
    },
    {
      g1: bls12_381.G1.ProjectivePoint.BASE,
      g2: new bls12_381.G2.ProjectivePoint(signature.x, signature.y, signature.z)
    }
  ]);
  return bls12_381.fields.Fp12.eql(isShortSig ? shortSigPairing() : longSigPairing(), bls12_381.fields.Fp12.ONE);
}

// node_modules/ox/_esm/core/BlsPoint.js
var BlsPoint_exports = {};
__export(BlsPoint_exports, {
  fromBytes: () => fromBytes6,
  fromHex: () => fromHex6,
  toBytes: () => toBytes9,
  toHex: () => toHex8
});
function toBytes9(point) {
  const group = typeof point.z === "bigint" ? bls12_381.G1 : bls12_381.G2;
  return new group.ProjectivePoint(point.x, point.y, point.z).toRawBytes();
}
function toHex8(point) {
  return fromBytes(toBytes9(point));
}
function fromBytes6(bytes) {
  const group = bytes.length === 48 ? bls12_381.G1 : bls12_381.G2;
  const point = group.ProjectivePoint.fromHex(bytes);
  return {
    x: point.px,
    y: point.py,
    z: point.pz
  };
}
function fromHex6(hex2, group) {
  return fromBytes6(toBytes2(hex2), group);
}

// node_modules/ox/_esm/core/ContractAddress.js
var ContractAddress_exports = {};
__export(ContractAddress_exports, {
  from: () => from15,
  fromCreate: () => fromCreate,
  fromCreate2: () => fromCreate2
});
function from15(options) {
  if (options.salt)
    return fromCreate2(options);
  return fromCreate(options);
}
function fromCreate(options) {
  const from26 = fromHex(from4(options.from));
  let nonce = fromNumber(options.nonce);
  if (nonce[0] === 0)
    nonce = new Uint8Array([]);
  return from4(`0x${keccak256(fromBytes2([from26, nonce], { as: "Hex" })).slice(26)}`);
}
function fromCreate2(options) {
  const from26 = fromHex(from4(options.from));
  const salt = padLeft(validate(options.salt) ? options.salt : fromHex(options.salt), 32);
  const bytecodeHash = (() => {
    if ("bytecodeHash" in options) {
      if (validate(options.bytecodeHash))
        return options.bytecodeHash;
      return fromHex(options.bytecodeHash);
    }
    return keccak256(options.bytecode, { as: "Bytes" });
  })();
  return from4(slice2(keccak256(concat(fromHex("0xff"), from26, salt, bytecodeHash), { as: "Hex" }), 12));
}

// node_modules/ox/_esm/core/Filter.js
var Filter_exports = {};
__export(Filter_exports, {
  fromRpc: () => fromRpc6,
  toRpc: () => toRpc6
});
function fromRpc6(filter) {
  const { fromBlock, toBlock } = filter;
  return {
    ...filter,
    ...fromBlock && {
      fromBlock: validate2(fromBlock, { strict: false }) ? BigInt(fromBlock) : fromBlock
    },
    ...toBlock && {
      toBlock: validate2(toBlock, { strict: false }) ? BigInt(toBlock) : toBlock
    }
  };
}
function toRpc6(filter) {
  const { address, topics, fromBlock, toBlock } = filter;
  return {
    ...address && { address },
    ...topics && { topics },
    ...typeof fromBlock !== "undefined" ? {
      fromBlock: typeof fromBlock === "bigint" ? fromNumber2(fromBlock) : fromBlock
    } : {},
    ...typeof toBlock !== "undefined" ? {
      toBlock: typeof toBlock === "bigint" ? fromNumber2(toBlock) : toBlock
    } : {}
  };
}

// node_modules/ox/_esm/core/HdKey.js
var HdKey_exports = {};
__export(HdKey_exports, {
  fromExtendedKey: () => fromExtendedKey,
  fromJson: () => fromJson,
  fromSeed: () => fromSeed,
  path: () => path
});

// node_modules/@noble/hashes/esm/sha512.js
var [SHA512_Kh, SHA512_Kl] = (() => u64_default.split([
  "0x428a2f98d728ae22",
  "0x7137449123ef65cd",
  "0xb5c0fbcfec4d3b2f",
  "0xe9b5dba58189dbbc",
  "0x3956c25bf348b538",
  "0x59f111f1b605d019",
  "0x923f82a4af194f9b",
  "0xab1c5ed5da6d8118",
  "0xd807aa98a3030242",
  "0x12835b0145706fbe",
  "0x243185be4ee4b28c",
  "0x550c7dc3d5ffb4e2",
  "0x72be5d74f27b896f",
  "0x80deb1fe3b1696b1",
  "0x9bdc06a725c71235",
  "0xc19bf174cf692694",
  "0xe49b69c19ef14ad2",
  "0xefbe4786384f25e3",
  "0x0fc19dc68b8cd5b5",
  "0x240ca1cc77ac9c65",
  "0x2de92c6f592b0275",
  "0x4a7484aa6ea6e483",
  "0x5cb0a9dcbd41fbd4",
  "0x76f988da831153b5",
  "0x983e5152ee66dfab",
  "0xa831c66d2db43210",
  "0xb00327c898fb213f",
  "0xbf597fc7beef0ee4",
  "0xc6e00bf33da88fc2",
  "0xd5a79147930aa725",
  "0x06ca6351e003826f",
  "0x142929670a0e6e70",
  "0x27b70a8546d22ffc",
  "0x2e1b21385c26c926",
  "0x4d2c6dfc5ac42aed",
  "0x53380d139d95b3df",
  "0x650a73548baf63de",
  "0x766a0abb3c77b2a8",
  "0x81c2c92e47edaee6",
  "0x92722c851482353b",
  "0xa2bfe8a14cf10364",
  "0xa81a664bbc423001",
  "0xc24b8b70d0f89791",
  "0xc76c51a30654be30",
  "0xd192e819d6ef5218",
  "0xd69906245565a910",
  "0xf40e35855771202a",
  "0x106aa07032bbd1b8",
  "0x19a4c116b8d2d0c8",
  "0x1e376c085141ab53",
  "0x2748774cdf8eeb99",
  "0x34b0bcb5e19b48a8",
  "0x391c0cb3c5c95a63",
  "0x4ed8aa4ae3418acb",
  "0x5b9cca4f7763e373",
  "0x682e6ff3d6b2b8a3",
  "0x748f82ee5defb2fc",
  "0x78a5636f43172f60",
  "0x84c87814a1f0ab72",
  "0x8cc702081a6439ec",
  "0x90befffa23631e28",
  "0xa4506cebde82bde9",
  "0xbef9a3f7b2c67915",
  "0xc67178f2e372532b",
  "0xca273eceea26619c",
  "0xd186b8c721c0c207",
  "0xeada7dd6cde0eb1e",
  "0xf57d4f7fee6ed178",
  "0x06f067aa72176fba",
  "0x0a637dc5a2c898a6",
  "0x113f9804bef90dae",
  "0x1b710b35131c471b",
  "0x28db77f523047d84",
  "0x32caab7b40c72493",
  "0x3c9ebe0a15c9bebc",
  "0x431d67c49c100d4c",
  "0x4cc5d4becb3e42b6",
  "0x597f299cfc657e2a",
  "0x5fcb6fab3ad6faec",
  "0x6c44198c4a475817"
].map((n) => BigInt(n))))();
var SHA512_W_H = new Uint32Array(80);
var SHA512_W_L = new Uint32Array(80);
var SHA512 = class extends HashMD {
  constructor() {
    super(128, 64, 16, false);
    this.Ah = 1779033703 | 0;
    this.Al = 4089235720 | 0;
    this.Bh = 3144134277 | 0;
    this.Bl = 2227873595 | 0;
    this.Ch = 1013904242 | 0;
    this.Cl = 4271175723 | 0;
    this.Dh = 2773480762 | 0;
    this.Dl = 1595750129 | 0;
    this.Eh = 1359893119 | 0;
    this.El = 2917565137 | 0;
    this.Fh = 2600822924 | 0;
    this.Fl = 725511199 | 0;
    this.Gh = 528734635 | 0;
    this.Gl = 4215389547 | 0;
    this.Hh = 1541459225 | 0;
    this.Hl = 327033209 | 0;
  }
  // prettier-ignore
  get() {
    const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
  }
  // prettier-ignore
  set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
    this.Ah = Ah | 0;
    this.Al = Al | 0;
    this.Bh = Bh | 0;
    this.Bl = Bl | 0;
    this.Ch = Ch | 0;
    this.Cl = Cl | 0;
    this.Dh = Dh | 0;
    this.Dl = Dl | 0;
    this.Eh = Eh | 0;
    this.El = El | 0;
    this.Fh = Fh | 0;
    this.Fl = Fl | 0;
    this.Gh = Gh | 0;
    this.Gl = Gl | 0;
    this.Hh = Hh | 0;
    this.Hl = Hl | 0;
  }
  process(view, offset) {
    for (let i = 0; i < 16; i++, offset += 4) {
      SHA512_W_H[i] = view.getUint32(offset);
      SHA512_W_L[i] = view.getUint32(offset += 4);
    }
    for (let i = 16; i < 80; i++) {
      const W15h = SHA512_W_H[i - 15] | 0;
      const W15l = SHA512_W_L[i - 15] | 0;
      const s0h = u64_default.rotrSH(W15h, W15l, 1) ^ u64_default.rotrSH(W15h, W15l, 8) ^ u64_default.shrSH(W15h, W15l, 7);
      const s0l = u64_default.rotrSL(W15h, W15l, 1) ^ u64_default.rotrSL(W15h, W15l, 8) ^ u64_default.shrSL(W15h, W15l, 7);
      const W2h = SHA512_W_H[i - 2] | 0;
      const W2l = SHA512_W_L[i - 2] | 0;
      const s1h = u64_default.rotrSH(W2h, W2l, 19) ^ u64_default.rotrBH(W2h, W2l, 61) ^ u64_default.shrSH(W2h, W2l, 6);
      const s1l = u64_default.rotrSL(W2h, W2l, 19) ^ u64_default.rotrBL(W2h, W2l, 61) ^ u64_default.shrSL(W2h, W2l, 6);
      const SUMl = u64_default.add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
      const SUMh = u64_default.add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
      SHA512_W_H[i] = SUMh | 0;
      SHA512_W_L[i] = SUMl | 0;
    }
    let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    for (let i = 0; i < 80; i++) {
      const sigma1h = u64_default.rotrSH(Eh, El, 14) ^ u64_default.rotrSH(Eh, El, 18) ^ u64_default.rotrBH(Eh, El, 41);
      const sigma1l = u64_default.rotrSL(Eh, El, 14) ^ u64_default.rotrSL(Eh, El, 18) ^ u64_default.rotrBL(Eh, El, 41);
      const CHIh = Eh & Fh ^ ~Eh & Gh;
      const CHIl = El & Fl ^ ~El & Gl;
      const T1ll = u64_default.add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
      const T1h = u64_default.add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
      const T1l = T1ll | 0;
      const sigma0h = u64_default.rotrSH(Ah, Al, 28) ^ u64_default.rotrBH(Ah, Al, 34) ^ u64_default.rotrBH(Ah, Al, 39);
      const sigma0l = u64_default.rotrSL(Ah, Al, 28) ^ u64_default.rotrBL(Ah, Al, 34) ^ u64_default.rotrBL(Ah, Al, 39);
      const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
      const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
      Hh = Gh | 0;
      Hl = Gl | 0;
      Gh = Fh | 0;
      Gl = Fl | 0;
      Fh = Eh | 0;
      Fl = El | 0;
      ({ h: Eh, l: El } = u64_default.add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
      Dh = Ch | 0;
      Dl = Cl | 0;
      Ch = Bh | 0;
      Cl = Bl | 0;
      Bh = Ah | 0;
      Bl = Al | 0;
      const All = u64_default.add3L(T1l, sigma0l, MAJl);
      Ah = u64_default.add3H(All, T1h, sigma0h, MAJh);
      Al = All | 0;
    }
    ({ h: Ah, l: Al } = u64_default.add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
    ({ h: Bh, l: Bl } = u64_default.add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
    ({ h: Ch, l: Cl } = u64_default.add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
    ({ h: Dh, l: Dl } = u64_default.add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
    ({ h: Eh, l: El } = u64_default.add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
    ({ h: Fh, l: Fl } = u64_default.add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
    ({ h: Gh, l: Gl } = u64_default.add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
    ({ h: Hh, l: Hl } = u64_default.add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
    this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
  }
  roundClean() {
    SHA512_W_H.fill(0);
    SHA512_W_L.fill(0);
  }
  destroy() {
    this.buffer.fill(0);
    this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
var SHA512_224 = class extends SHA512 {
  constructor() {
    super();
    this.Ah = 2352822216 | 0;
    this.Al = 424955298 | 0;
    this.Bh = 1944164710 | 0;
    this.Bl = 2312950998 | 0;
    this.Ch = 502970286 | 0;
    this.Cl = 855612546 | 0;
    this.Dh = 1738396948 | 0;
    this.Dl = 1479516111 | 0;
    this.Eh = 258812777 | 0;
    this.El = 2077511080 | 0;
    this.Fh = 2011393907 | 0;
    this.Fl = 79989058 | 0;
    this.Gh = 1067287976 | 0;
    this.Gl = 1780299464 | 0;
    this.Hh = 286451373 | 0;
    this.Hl = 2446758561 | 0;
    this.outputLen = 28;
  }
};
var SHA512_256 = class extends SHA512 {
  constructor() {
    super();
    this.Ah = 573645204 | 0;
    this.Al = 4230739756 | 0;
    this.Bh = 2673172387 | 0;
    this.Bl = 3360449730 | 0;
    this.Ch = 596883563 | 0;
    this.Cl = 1867755857 | 0;
    this.Dh = 2520282905 | 0;
    this.Dl = 1497426621 | 0;
    this.Eh = 2519219938 | 0;
    this.El = 2827943907 | 0;
    this.Fh = 3193839141 | 0;
    this.Fl = 1401305490 | 0;
    this.Gh = 721525244 | 0;
    this.Gl = 746961066 | 0;
    this.Hh = 246885852 | 0;
    this.Hl = 2177182882 | 0;
    this.outputLen = 32;
  }
};
var SHA384 = class extends SHA512 {
  constructor() {
    super();
    this.Ah = 3418070365 | 0;
    this.Al = 3238371032 | 0;
    this.Bh = 1654270250 | 0;
    this.Bl = 914150663 | 0;
    this.Ch = 2438529370 | 0;
    this.Cl = 812702999 | 0;
    this.Dh = 355462360 | 0;
    this.Dl = 4144912697 | 0;
    this.Eh = 1731405415 | 0;
    this.El = 4290775857 | 0;
    this.Fh = 2394180231 | 0;
    this.Fl = 1750603025 | 0;
    this.Gh = 3675008525 | 0;
    this.Gl = 1694076839 | 0;
    this.Hh = 1203062813 | 0;
    this.Hl = 3204075428 | 0;
    this.outputLen = 48;
  }
};
var sha512 = wrapConstructor(() => new SHA512());
var sha512_224 = wrapConstructor(() => new SHA512_224());
var sha512_256 = wrapConstructor(() => new SHA512_256());
var sha384 = wrapConstructor(() => new SHA384());

// node_modules/@scure/base/lib/esm/index.js
function isBytes(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function isArrayOf(isString, arr) {
  if (!Array.isArray(arr))
    return false;
  if (arr.length === 0)
    return true;
  if (isString) {
    return arr.every((item) => typeof item === "string");
  } else {
    return arr.every((item) => Number.isSafeInteger(item));
  }
}
function afn(input) {
  if (typeof input !== "function")
    throw new Error("function expected");
  return true;
}
function astr(label, input) {
  if (typeof input !== "string")
    throw new Error(`${label}: string expected`);
  return true;
}
function anumber2(n) {
  if (!Number.isSafeInteger(n))
    throw new Error(`invalid integer: ${n}`);
}
function aArr(input) {
  if (!Array.isArray(input))
    throw new Error("array expected");
}
function astrArr(label, input) {
  if (!isArrayOf(true, input))
    throw new Error(`${label}: array of strings expected`);
}
function anumArr(label, input) {
  if (!isArrayOf(false, input))
    throw new Error(`${label}: array of numbers expected`);
}
function chain(...args) {
  const id = (a) => a;
  const wrap = (a, b) => (c) => a(b(c));
  const encode7 = args.map((x) => x.encode).reduceRight(wrap, id);
  const decode4 = args.map((x) => x.decode).reduce(wrap, id);
  return { encode: encode7, decode: decode4 };
}
function alphabet(letters) {
  const lettersA = typeof letters === "string" ? letters.split("") : letters;
  const len = lettersA.length;
  astrArr("alphabet", lettersA);
  const indexes = new Map(lettersA.map((l, i) => [l, i]));
  return {
    encode: (digits) => {
      aArr(digits);
      return digits.map((i) => {
        if (!Number.isSafeInteger(i) || i < 0 || i >= len)
          throw new Error(`alphabet.encode: digit index outside alphabet "${i}". Allowed: ${letters}`);
        return lettersA[i];
      });
    },
    decode: (input) => {
      aArr(input);
      return input.map((letter) => {
        astr("alphabet.decode", letter);
        const i = indexes.get(letter);
        if (i === void 0)
          throw new Error(`Unknown letter: "${letter}". Allowed: ${letters}`);
        return i;
      });
    }
  };
}
function join(separator = "") {
  astr("join", separator);
  return {
    encode: (from26) => {
      astrArr("join.decode", from26);
      return from26.join(separator);
    },
    decode: (to3) => {
      astr("join.decode", to3);
      return to3.split(separator);
    }
  };
}
function padding(bits, chr = "=") {
  anumber2(bits);
  astr("padding", chr);
  return {
    encode(data) {
      astrArr("padding.encode", data);
      while (data.length * bits % 8)
        data.push(chr);
      return data;
    },
    decode(input) {
      astrArr("padding.decode", input);
      let end = input.length;
      if (end * bits % 8)
        throw new Error("padding: invalid, string should have whole number of bytes");
      for (; end > 0 && input[end - 1] === chr; end--) {
        const last = end - 1;
        const byte = last * bits;
        if (byte % 8 === 0)
          throw new Error("padding: invalid, string has too much padding");
      }
      return input.slice(0, end);
    }
  };
}
function normalize(fn) {
  afn(fn);
  return { encode: (from26) => from26, decode: (to3) => fn(to3) };
}
function convertRadix(data, from26, to3) {
  if (from26 < 2)
    throw new Error(`convertRadix: invalid from=${from26}, base cannot be less than 2`);
  if (to3 < 2)
    throw new Error(`convertRadix: invalid to=${to3}, base cannot be less than 2`);
  aArr(data);
  if (!data.length)
    return [];
  let pos = 0;
  const res = [];
  const digits = Array.from(data, (d) => {
    anumber2(d);
    if (d < 0 || d >= from26)
      throw new Error(`invalid integer: ${d}`);
    return d;
  });
  const dlen = digits.length;
  while (true) {
    let carry = 0;
    let done = true;
    for (let i = pos; i < dlen; i++) {
      const digit = digits[i];
      const fromCarry = from26 * carry;
      const digitBase = fromCarry + digit;
      if (!Number.isSafeInteger(digitBase) || fromCarry / from26 !== carry || digitBase - digit !== fromCarry) {
        throw new Error("convertRadix: carry overflow");
      }
      const div = digitBase / to3;
      carry = digitBase % to3;
      const rounded = Math.floor(div);
      digits[i] = rounded;
      if (!Number.isSafeInteger(rounded) || rounded * to3 + carry !== digitBase)
        throw new Error("convertRadix: carry overflow");
      if (!done)
        continue;
      else if (!rounded)
        pos = i;
      else
        done = false;
    }
    res.push(carry);
    if (done)
      break;
  }
  for (let i = 0; i < data.length - 1 && data[i] === 0; i++)
    res.push(0);
  return res.reverse();
}
var gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
var radix2carry = (from26, to3) => from26 + (to3 - gcd(from26, to3));
var powers = (() => {
  let res = [];
  for (let i = 0; i < 40; i++)
    res.push(2 ** i);
  return res;
})();
function convertRadix2(data, from26, to3, padding2) {
  aArr(data);
  if (from26 <= 0 || from26 > 32)
    throw new Error(`convertRadix2: wrong from=${from26}`);
  if (to3 <= 0 || to3 > 32)
    throw new Error(`convertRadix2: wrong to=${to3}`);
  if (radix2carry(from26, to3) > 32) {
    throw new Error(`convertRadix2: carry overflow from=${from26} to=${to3} carryBits=${radix2carry(from26, to3)}`);
  }
  let carry = 0;
  let pos = 0;
  const max = powers[from26];
  const mask = powers[to3] - 1;
  const res = [];
  for (const n of data) {
    anumber2(n);
    if (n >= max)
      throw new Error(`convertRadix2: invalid data word=${n} from=${from26}`);
    carry = carry << from26 | n;
    if (pos + from26 > 32)
      throw new Error(`convertRadix2: carry overflow pos=${pos} from=${from26}`);
    pos += from26;
    for (; pos >= to3; pos -= to3)
      res.push((carry >> pos - to3 & mask) >>> 0);
    const pow = powers[pos];
    if (pow === void 0)
      throw new Error("invalid carry");
    carry &= pow - 1;
  }
  carry = carry << to3 - pos & mask;
  if (!padding2 && pos >= from26)
    throw new Error("Excess padding");
  if (!padding2 && carry > 0)
    throw new Error(`Non-zero padding: ${carry}`);
  if (padding2 && pos > 0)
    res.push(carry >>> 0);
  return res;
}
function radix(num) {
  anumber2(num);
  const _256 = 2 ** 8;
  return {
    encode: (bytes) => {
      if (!isBytes(bytes))
        throw new Error("radix.encode input should be Uint8Array");
      return convertRadix(Array.from(bytes), _256, num);
    },
    decode: (digits) => {
      anumArr("radix.decode", digits);
      return Uint8Array.from(convertRadix(digits, num, _256));
    }
  };
}
function radix2(bits, revPadding = false) {
  anumber2(bits);
  if (bits <= 0 || bits > 32)
    throw new Error("radix2: bits should be in (0..32]");
  if (radix2carry(8, bits) > 32 || radix2carry(bits, 8) > 32)
    throw new Error("radix2: carry overflow");
  return {
    encode: (bytes) => {
      if (!isBytes(bytes))
        throw new Error("radix2.encode input should be Uint8Array");
      return convertRadix2(Array.from(bytes), 8, bits, !revPadding);
    },
    decode: (digits) => {
      anumArr("radix2.decode", digits);
      return Uint8Array.from(convertRadix2(digits, bits, 8, revPadding));
    }
  };
}
function unsafeWrapper(fn) {
  afn(fn);
  return function(...args) {
    try {
      return fn.apply(null, args);
    } catch (e) {
    }
  };
}
function checksum(len, fn) {
  anumber2(len);
  afn(fn);
  return {
    encode(data) {
      if (!isBytes(data))
        throw new Error("checksum.encode: input should be Uint8Array");
      const sum = fn(data).slice(0, len);
      const res = new Uint8Array(data.length + len);
      res.set(data);
      res.set(sum, data.length);
      return res;
    },
    decode(data) {
      if (!isBytes(data))
        throw new Error("checksum.decode: input should be Uint8Array");
      const payload = data.slice(0, -len);
      const oldChecksum = data.slice(-len);
      const newChecksum = fn(payload).slice(0, len);
      for (let i = 0; i < len; i++)
        if (newChecksum[i] !== oldChecksum[i])
          throw new Error("Invalid checksum");
      return payload;
    }
  };
}
var utils = {
  alphabet,
  chain,
  checksum,
  convertRadix,
  convertRadix2,
  radix,
  radix2,
  join,
  padding
};
var base16 = chain(radix2(4), alphabet("0123456789ABCDEF"), join(""));
var base32 = chain(radix2(5), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), padding(5), join(""));
var base32nopad = chain(radix2(5), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), join(""));
var base32hex = chain(radix2(5), alphabet("0123456789ABCDEFGHIJKLMNOPQRSTUV"), padding(5), join(""));
var base32hexnopad = chain(radix2(5), alphabet("0123456789ABCDEFGHIJKLMNOPQRSTUV"), join(""));
var base32crockford = chain(radix2(5), alphabet("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), join(""), normalize((s) => s.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")));
var base64 = chain(radix2(6), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), padding(6), join(""));
var base64nopad = chain(radix2(6), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), join(""));
var base64url = chain(radix2(6), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), padding(6), join(""));
var base64urlnopad = chain(radix2(6), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), join(""));
var genBase58 = (abc) => chain(radix(58), alphabet(abc), join(""));
var base58 = genBase58("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");
var base58flickr = genBase58("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ");
var base58xrp = genBase58("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");
var createBase58check = (sha2563) => chain(checksum(4, (data) => sha2563(sha2563(data))), base58);
var BECH_ALPHABET = chain(alphabet("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), join(""));
var POLYMOD_GENERATORS = [996825010, 642813549, 513874426, 1027748829, 705979059];
function bech32Polymod(pre) {
  const b = pre >> 25;
  let chk = (pre & 33554431) << 5;
  for (let i = 0; i < POLYMOD_GENERATORS.length; i++) {
    if ((b >> i & 1) === 1)
      chk ^= POLYMOD_GENERATORS[i];
  }
  return chk;
}
function bechChecksum(prefix, words, encodingConst = 1) {
  const len = prefix.length;
  let chk = 1;
  for (let i = 0; i < len; i++) {
    const c = prefix.charCodeAt(i);
    if (c < 33 || c > 126)
      throw new Error(`Invalid prefix (${prefix})`);
    chk = bech32Polymod(chk) ^ c >> 5;
  }
  chk = bech32Polymod(chk);
  for (let i = 0; i < len; i++)
    chk = bech32Polymod(chk) ^ prefix.charCodeAt(i) & 31;
  for (let v of words)
    chk = bech32Polymod(chk) ^ v;
  for (let i = 0; i < 6; i++)
    chk = bech32Polymod(chk);
  chk ^= encodingConst;
  return BECH_ALPHABET.encode(convertRadix2([chk % powers[30]], 30, 5, false));
}
function genBech32(encoding) {
  const ENCODING_CONST = encoding === "bech32" ? 1 : 734539939;
  const _words = radix2(5);
  const fromWords = _words.decode;
  const toWords = _words.encode;
  const fromWordsUnsafe = unsafeWrapper(fromWords);
  function encode7(prefix, words, limit = 90) {
    astr("bech32.encode prefix", prefix);
    if (isBytes(words))
      words = Array.from(words);
    anumArr("bech32.encode", words);
    const plen = prefix.length;
    if (plen === 0)
      throw new TypeError(`Invalid prefix length ${plen}`);
    const actualLength = plen + 7 + words.length;
    if (limit !== false && actualLength > limit)
      throw new TypeError(`Length ${actualLength} exceeds limit ${limit}`);
    const lowered = prefix.toLowerCase();
    const sum = bechChecksum(lowered, words, ENCODING_CONST);
    return `${lowered}1${BECH_ALPHABET.encode(words)}${sum}`;
  }
  function decode4(str, limit = 90) {
    astr("bech32.decode input", str);
    const slen = str.length;
    if (slen < 8 || limit !== false && slen > limit)
      throw new TypeError(`invalid string length: ${slen} (${str}). Expected (8..${limit})`);
    const lowered = str.toLowerCase();
    if (str !== lowered && str !== str.toUpperCase())
      throw new Error(`String must be lowercase or uppercase`);
    const sepIndex = lowered.lastIndexOf("1");
    if (sepIndex === 0 || sepIndex === -1)
      throw new Error(`Letter "1" must be present between prefix and data only`);
    const prefix = lowered.slice(0, sepIndex);
    const data = lowered.slice(sepIndex + 1);
    if (data.length < 6)
      throw new Error("Data must be at least 6 characters long");
    const words = BECH_ALPHABET.decode(data).slice(0, -6);
    const sum = bechChecksum(prefix, words, ENCODING_CONST);
    if (!data.endsWith(sum))
      throw new Error(`Invalid checksum in ${str}: expected "${sum}"`);
    return { prefix, words };
  }
  const decodeUnsafe = unsafeWrapper(decode4);
  function decodeToBytes(str) {
    const { prefix, words } = decode4(str, false);
    return { prefix, words, bytes: fromWords(words) };
  }
  function encodeFromBytes(prefix, bytes) {
    return encode7(prefix, toWords(bytes));
  }
  return {
    encode: encode7,
    decode: decode4,
    encodeFromBytes,
    decodeToBytes,
    decodeUnsafe,
    fromWords,
    fromWordsUnsafe,
    toWords
  };
}
var bech32 = genBech32("bech32");
var bech32m = genBech32("bech32m");
var hex = chain(radix2(4), alphabet("0123456789abcdef"), join(""), normalize((s) => {
  if (typeof s !== "string" || s.length % 2 !== 0)
    throw new TypeError(`hex.decode: expected string, got ${typeof s} with length ${s.length}`);
  return s.toLowerCase();
}));

// node_modules/@scure/bip32/lib/esm/index.js
var Point = secp256k1.ProjectivePoint;
var base58check = createBase58check(sha256);
function bytesToNumber(bytes) {
  abytes(bytes);
  const h = bytes.length === 0 ? "0" : bytesToHex(bytes);
  return BigInt("0x" + h);
}
function numberToBytes(num) {
  if (typeof num !== "bigint")
    throw new Error("bigint expected");
  return hexToBytes(num.toString(16).padStart(64, "0"));
}
var MASTER_SECRET = utf8ToBytes("Bitcoin seed");
var BITCOIN_VERSIONS = { private: 76066276, public: 76067358 };
var HARDENED_OFFSET = 2147483648;
var hash160 = (data) => ripemd160(sha256(data));
var fromU32 = (data) => createView(data).getUint32(0, false);
var toU32 = (n) => {
  if (!Number.isSafeInteger(n) || n < 0 || n > 2 ** 32 - 1) {
    throw new Error("invalid number, should be from 0 to 2**32-1, got " + n);
  }
  const buf = new Uint8Array(4);
  createView(buf).setUint32(0, n, false);
  return buf;
};
var HDKey = class _HDKey {
  get fingerprint() {
    if (!this.pubHash) {
      throw new Error("No publicKey set!");
    }
    return fromU32(this.pubHash);
  }
  get identifier() {
    return this.pubHash;
  }
  get pubKeyHash() {
    return this.pubHash;
  }
  get privateKey() {
    return this.privKeyBytes || null;
  }
  get publicKey() {
    return this.pubKey || null;
  }
  get privateExtendedKey() {
    const priv = this.privateKey;
    if (!priv) {
      throw new Error("No private key");
    }
    return base58check.encode(this.serialize(this.versions.private, concatBytes(new Uint8Array([0]), priv)));
  }
  get publicExtendedKey() {
    if (!this.pubKey) {
      throw new Error("No public key");
    }
    return base58check.encode(this.serialize(this.versions.public, this.pubKey));
  }
  static fromMasterSeed(seed, versions = BITCOIN_VERSIONS) {
    abytes(seed);
    if (8 * seed.length < 128 || 8 * seed.length > 512) {
      throw new Error("HDKey: seed length must be between 128 and 512 bits; 256 bits is advised, got " + seed.length);
    }
    const I = hmac(sha512, MASTER_SECRET, seed);
    return new _HDKey({
      versions,
      chainCode: I.slice(32),
      privateKey: I.slice(0, 32)
    });
  }
  static fromExtendedKey(base58key, versions = BITCOIN_VERSIONS) {
    const keyBuffer = base58check.decode(base58key);
    const keyView = createView(keyBuffer);
    const version2 = keyView.getUint32(0, false);
    const opt = {
      versions,
      depth: keyBuffer[4],
      parentFingerprint: keyView.getUint32(5, false),
      index: keyView.getUint32(9, false),
      chainCode: keyBuffer.slice(13, 45)
    };
    const key = keyBuffer.slice(45);
    const isPriv = key[0] === 0;
    if (version2 !== versions[isPriv ? "private" : "public"]) {
      throw new Error("Version mismatch");
    }
    if (isPriv) {
      return new _HDKey({ ...opt, privateKey: key.slice(1) });
    } else {
      return new _HDKey({ ...opt, publicKey: key });
    }
  }
  static fromJSON(json) {
    return _HDKey.fromExtendedKey(json.xpriv);
  }
  constructor(opt) {
    this.depth = 0;
    this.index = 0;
    this.chainCode = null;
    this.parentFingerprint = 0;
    if (!opt || typeof opt !== "object") {
      throw new Error("HDKey.constructor must not be called directly");
    }
    this.versions = opt.versions || BITCOIN_VERSIONS;
    this.depth = opt.depth || 0;
    this.chainCode = opt.chainCode || null;
    this.index = opt.index || 0;
    this.parentFingerprint = opt.parentFingerprint || 0;
    if (!this.depth) {
      if (this.parentFingerprint || this.index) {
        throw new Error("HDKey: zero depth with non-zero index/parent fingerprint");
      }
    }
    if (opt.publicKey && opt.privateKey) {
      throw new Error("HDKey: publicKey and privateKey at same time.");
    }
    if (opt.privateKey) {
      if (!secp256k1.utils.isValidPrivateKey(opt.privateKey)) {
        throw new Error("Invalid private key");
      }
      this.privKey = typeof opt.privateKey === "bigint" ? opt.privateKey : bytesToNumber(opt.privateKey);
      this.privKeyBytes = numberToBytes(this.privKey);
      this.pubKey = secp256k1.getPublicKey(opt.privateKey, true);
    } else if (opt.publicKey) {
      this.pubKey = Point.fromHex(opt.publicKey).toRawBytes(true);
    } else {
      throw new Error("HDKey: no public or private key provided");
    }
    this.pubHash = hash160(this.pubKey);
  }
  derive(path2) {
    if (!/^[mM]'?/.test(path2)) {
      throw new Error('Path must start with "m" or "M"');
    }
    if (/^[mM]'?$/.test(path2)) {
      return this;
    }
    const parts = path2.replace(/^[mM]'?\//, "").split("/");
    let child = this;
    for (const c of parts) {
      const m = /^(\d+)('?)$/.exec(c);
      const m1 = m && m[1];
      if (!m || m.length !== 3 || typeof m1 !== "string")
        throw new Error("invalid child index: " + c);
      let idx = +m1;
      if (!Number.isSafeInteger(idx) || idx >= HARDENED_OFFSET) {
        throw new Error("Invalid index");
      }
      if (m[2] === "'") {
        idx += HARDENED_OFFSET;
      }
      child = child.deriveChild(idx);
    }
    return child;
  }
  deriveChild(index2) {
    if (!this.pubKey || !this.chainCode) {
      throw new Error("No publicKey or chainCode set");
    }
    let data = toU32(index2);
    if (index2 >= HARDENED_OFFSET) {
      const priv = this.privateKey;
      if (!priv) {
        throw new Error("Could not derive hardened child key");
      }
      data = concatBytes(new Uint8Array([0]), priv, data);
    } else {
      data = concatBytes(this.pubKey, data);
    }
    const I = hmac(sha512, this.chainCode, data);
    const childTweak = bytesToNumber(I.slice(0, 32));
    const chainCode = I.slice(32);
    if (!secp256k1.utils.isValidPrivateKey(childTweak)) {
      throw new Error("Tweak bigger than curve order");
    }
    const opt = {
      versions: this.versions,
      chainCode,
      depth: this.depth + 1,
      parentFingerprint: this.fingerprint,
      index: index2
    };
    try {
      if (this.privateKey) {
        const added = mod(this.privKey + childTweak, secp256k1.CURVE.n);
        if (!secp256k1.utils.isValidPrivateKey(added)) {
          throw new Error("The tweak was out of range or the resulted private key is invalid");
        }
        opt.privateKey = added;
      } else {
        const added = Point.fromHex(this.pubKey).add(Point.fromPrivateKey(childTweak));
        if (added.equals(Point.ZERO)) {
          throw new Error("The tweak was equal to negative P, which made the result key invalid");
        }
        opt.publicKey = added.toRawBytes(true);
      }
      return new _HDKey(opt);
    } catch (err) {
      return this.deriveChild(index2 + 1);
    }
  }
  sign(hash7) {
    if (!this.privateKey) {
      throw new Error("No privateKey set!");
    }
    abytes(hash7, 32);
    return secp256k1.sign(hash7, this.privKey).toCompactRawBytes();
  }
  verify(hash7, signature) {
    abytes(hash7, 32);
    abytes(signature, 64);
    if (!this.publicKey) {
      throw new Error("No publicKey set!");
    }
    let sig;
    try {
      sig = secp256k1.Signature.fromCompact(signature);
    } catch (error) {
      return false;
    }
    return secp256k1.verify(sig, hash7, this.publicKey);
  }
  wipePrivateData() {
    this.privKey = void 0;
    if (this.privKeyBytes) {
      this.privKeyBytes.fill(0);
      this.privKeyBytes = void 0;
    }
    return this;
  }
  toJSON() {
    return {
      xpriv: this.privateExtendedKey,
      xpub: this.publicExtendedKey
    };
  }
  serialize(version2, key) {
    if (!this.chainCode) {
      throw new Error("No chainCode set");
    }
    abytes(key, 33);
    return concatBytes(toU32(version2), new Uint8Array([this.depth]), toU32(this.parentFingerprint), toU32(this.index), this.chainCode, key);
  }
};

// node_modules/ox/_esm/core/Secp256k1.js
var Secp256k1_exports = {};
__export(Secp256k1_exports, {
  getPublicKey: () => getPublicKey2,
  noble: () => noble2,
  randomPrivateKey: () => randomPrivateKey2,
  recoverAddress: () => recoverAddress,
  recoverPublicKey: () => recoverPublicKey,
  sign: () => sign2,
  verify: () => verify2
});

// node_modules/ox/_esm/core/internal/entropy.js
var extraEntropy = false;

// node_modules/ox/_esm/core/Secp256k1.js
var noble2 = secp256k1;
function getPublicKey2(options) {
  const { privateKey } = options;
  const point = secp256k1.ProjectivePoint.fromPrivateKey(from2(privateKey).slice(2));
  return from3(point);
}
function randomPrivateKey2(options = {}) {
  const { as = "Hex" } = options;
  const bytes = secp256k1.utils.randomPrivateKey();
  if (as === "Hex")
    return fromBytes(bytes);
  return bytes;
}
function recoverAddress(options) {
  return fromPublicKey(recoverPublicKey(options));
}
function recoverPublicKey(options) {
  const { payload, signature } = options;
  const { r, s, yParity } = signature;
  const signature_ = new secp256k1.Signature(BigInt(r), BigInt(s)).addRecoveryBit(yParity);
  const point = signature_.recoverPublicKey(from2(payload).substring(2));
  return from3(point);
}
function sign2(options) {
  const { extraEntropy: extraEntropy2 = extraEntropy, hash: hash7, payload, privateKey } = options;
  const { r, s, recovery } = secp256k1.sign(from(payload), from(privateKey), {
    extraEntropy: typeof extraEntropy2 === "boolean" ? extraEntropy2 : from2(extraEntropy2).slice(2),
    lowS: true,
    ...hash7 ? { prehash: true } : {}
  });
  return {
    r,
    s,
    yParity: recovery
  };
}
function verify2(options) {
  const { address, hash: hash7, payload, publicKey, signature } = options;
  if (address)
    return isEqual(address, recoverAddress({ payload, signature }));
  return secp256k1.verify(signature, from(payload), toBytes3(publicKey), ...hash7 ? [{ prehash: true, lowS: true }] : []);
}

// node_modules/ox/_esm/core/internal/hdKey.js
function fromScure(key) {
  return {
    derive: (path2) => fromScure(key.derive(path2)),
    depth: key.depth,
    identifier: fromBytes(key.identifier),
    index: key.index,
    privateKey: fromBytes(key.privateKey),
    privateExtendedKey: key.privateExtendedKey,
    publicKey: getPublicKey2({ privateKey: key.privateKey }),
    publicExtendedKey: key.publicExtendedKey,
    versions: key.versions
  };
}

// node_modules/ox/_esm/core/HdKey.js
function fromExtendedKey(extendedKey) {
  const key = HDKey.fromExtendedKey(extendedKey);
  return fromScure(key);
}
function fromJson(json) {
  return fromScure(HDKey.fromJSON(json));
}
function fromSeed(seed, options = {}) {
  const { versions } = options;
  const key = HDKey.fromMasterSeed(from(seed), versions);
  return fromScure(key);
}
function path(options = {}) {
  const { account = 0, change = 0, index: index2 = 0 } = options;
  return `m/44'/60'/${account}'/${change}/${index2}`;
}

// node_modules/ox/_esm/core/Fee.js
var Fee_exports = {};

// node_modules/ox/_esm/core/Log.js
var Log_exports = {};
__export(Log_exports, {
  fromRpc: () => fromRpc7,
  toRpc: () => toRpc7
});
function fromRpc7(log, _options = {}) {
  return {
    ...log,
    blockNumber: log.blockNumber ? BigInt(log.blockNumber) : null,
    logIndex: log.logIndex ? Number(log.logIndex) : null,
    transactionIndex: log.transactionIndex ? Number(log.transactionIndex) : null
  };
}
function toRpc7(log, _options = {}) {
  return {
    address: log.address,
    blockHash: log.blockHash,
    blockNumber: typeof log.blockNumber === "bigint" ? fromNumber2(log.blockNumber) : null,
    data: log.data,
    logIndex: typeof log.logIndex === "number" ? fromNumber2(log.logIndex) : null,
    topics: log.topics,
    transactionHash: log.transactionHash,
    transactionIndex: typeof log.transactionIndex === "number" ? fromNumber2(log.transactionIndex) : null,
    removed: log.removed
  };
}

// node_modules/ox/_esm/core/Mnemonic.js
var Mnemonic_exports = {};
__export(Mnemonic_exports, {
  czech: () => wordlist,
  english: () => wordlist2,
  french: () => wordlist3,
  italian: () => wordlist4,
  japanese: () => wordlist5,
  korean: () => wordlist6,
  path: () => path,
  portuguese: () => wordlist7,
  random: () => random2,
  simplifiedChinese: () => wordlist8,
  spanish: () => wordlist9,
  toHdKey: () => toHdKey,
  toPrivateKey: () => toPrivateKey,
  toSeed: () => toSeed,
  traditionalChinese: () => wordlist10,
  validate: () => validate7
});

// node_modules/@noble/hashes/esm/pbkdf2.js
function pbkdf2Init(hash7, _password, _salt, _opts) {
  ahash(hash7);
  const opts = checkOpts({ dkLen: 32, asyncTick: 10 }, _opts);
  const { c, dkLen, asyncTick } = opts;
  anumber(c);
  anumber(dkLen);
  anumber(asyncTick);
  if (c < 1)
    throw new Error("PBKDF2: iterations (c) should be >= 1");
  const password = toBytes(_password);
  const salt = toBytes(_salt);
  const DK = new Uint8Array(dkLen);
  const PRF = hmac.create(hash7, password);
  const PRFSalt = PRF._cloneInto().update(salt);
  return { c, dkLen, asyncTick, DK, PRF, PRFSalt };
}
function pbkdf2Output(PRF, PRFSalt, DK, prfW, u) {
  PRF.destroy();
  PRFSalt.destroy();
  if (prfW)
    prfW.destroy();
  u.fill(0);
  return DK;
}
function pbkdf2(hash7, password, salt, opts) {
  const { c, dkLen, DK, PRF, PRFSalt } = pbkdf2Init(hash7, password, salt, opts);
  let prfW;
  const arr = new Uint8Array(4);
  const view = createView(arr);
  const u = new Uint8Array(PRF.outputLen);
  for (let ti = 1, pos = 0; pos < dkLen; ti++, pos += PRF.outputLen) {
    const Ti = DK.subarray(pos, pos + PRF.outputLen);
    view.setInt32(0, ti, false);
    (prfW = PRFSalt._cloneInto(prfW)).update(arr).digestInto(u);
    Ti.set(u.subarray(0, Ti.length));
    for (let ui = 1; ui < c; ui++) {
      PRF._cloneInto(prfW).update(u).digestInto(u);
      for (let i = 0; i < Ti.length; i++)
        Ti[i] ^= u[i];
    }
  }
  return pbkdf2Output(PRF, PRFSalt, DK, prfW, u);
}

// node_modules/@scure/bip39/esm/index.js
var isJapanese = (wordlist11) => wordlist11[0] === "あいこくしん";
function nfkd(str) {
  if (typeof str !== "string")
    throw new TypeError("invalid mnemonic type: " + typeof str);
  return str.normalize("NFKD");
}
function normalize2(str) {
  const norm = nfkd(str);
  const words = norm.split(" ");
  if (![12, 15, 18, 21, 24].includes(words.length))
    throw new Error("Invalid mnemonic");
  return { nfkd: norm, words };
}
function aentropy(ent) {
  abytes(ent, 16, 20, 24, 28, 32);
}
function generateMnemonic(wordlist11, strength = 128) {
  anumber(strength);
  if (strength % 32 !== 0 || strength > 256)
    throw new TypeError("Invalid entropy");
  return entropyToMnemonic(randomBytes(strength / 8), wordlist11);
}
var calcChecksum = (entropy) => {
  const bitsLeft = 8 - entropy.length / 4;
  return new Uint8Array([sha256(entropy)[0] >> bitsLeft << bitsLeft]);
};
function getCoder(wordlist11) {
  if (!Array.isArray(wordlist11) || wordlist11.length !== 2048 || typeof wordlist11[0] !== "string")
    throw new Error("Wordlist: expected array of 2048 strings");
  wordlist11.forEach((i) => {
    if (typeof i !== "string")
      throw new Error("wordlist: non-string element: " + i);
  });
  return utils.chain(utils.checksum(1, calcChecksum), utils.radix2(11, true), utils.alphabet(wordlist11));
}
function mnemonicToEntropy(mnemonic, wordlist11) {
  const { words } = normalize2(mnemonic);
  const entropy = getCoder(wordlist11).decode(words);
  aentropy(entropy);
  return entropy;
}
function entropyToMnemonic(entropy, wordlist11) {
  aentropy(entropy);
  const words = getCoder(wordlist11).encode(entropy);
  return words.join(isJapanese(wordlist11) ? "　" : " ");
}
function validateMnemonic(mnemonic, wordlist11) {
  try {
    mnemonicToEntropy(mnemonic, wordlist11);
  } catch (e) {
    return false;
  }
  return true;
}
var psalt = (passphrase) => nfkd("mnemonic" + passphrase);
function mnemonicToSeedSync(mnemonic, passphrase = "") {
  return pbkdf2(sha512, normalize2(mnemonic).nfkd, psalt(passphrase), { c: 2048, dkLen: 64 });
}

// node_modules/@scure/bip39/esm/wordlists/czech.js
var wordlist = `abdikace
abeceda
adresa
agrese
akce
aktovka
alej
alkohol
amputace
ananas
andulka
anekdota
anketa
antika
anulovat
archa
arogance
asfalt
asistent
aspirace
astma
astronom
atlas
atletika
atol
autobus
azyl
babka
bachor
bacil
baculka
badatel
bageta
bagr
bahno
bakterie
balada
baletka
balkon
balonek
balvan
balza
bambus
bankomat
barbar
baret
barman
baroko
barva
baterka
batoh
bavlna
bazalka
bazilika
bazuka
bedna
beran
beseda
bestie
beton
bezinka
bezmoc
beztak
bicykl
bidlo
biftek
bikiny
bilance
biograf
biolog
bitva
bizon
blahobyt
blatouch
blecha
bledule
blesk
blikat
blizna
blokovat
bloudit
blud
bobek
bobr
bodlina
bodnout
bohatost
bojkot
bojovat
bokorys
bolest
borec
borovice
bota
boubel
bouchat
bouda
boule
bourat
boxer
bradavka
brambora
branka
bratr
brepta
briketa
brko
brloh
bronz
broskev
brunetka
brusinka
brzda
brzy
bublina
bubnovat
buchta
buditel
budka
budova
bufet
bujarost
bukvice
buldok
bulva
bunda
bunkr
burza
butik
buvol
buzola
bydlet
bylina
bytovka
bzukot
capart
carevna
cedr
cedule
cejch
cejn
cela
celer
celkem
celnice
cenina
cennost
cenovka
centrum
cenzor
cestopis
cetka
chalupa
chapadlo
charita
chata
chechtat
chemie
chichot
chirurg
chlad
chleba
chlubit
chmel
chmura
chobot
chochol
chodba
cholera
chomout
chopit
choroba
chov
chrapot
chrlit
chrt
chrup
chtivost
chudina
chutnat
chvat
chvilka
chvost
chyba
chystat
chytit
cibule
cigareta
cihelna
cihla
cinkot
cirkus
cisterna
citace
citrus
cizinec
cizost
clona
cokoliv
couvat
ctitel
ctnost
cudnost
cuketa
cukr
cupot
cvaknout
cval
cvik
cvrkot
cyklista
daleko
dareba
datel
datum
dcera
debata
dechovka
decibel
deficit
deflace
dekl
dekret
demokrat
deprese
derby
deska
detektiv
dikobraz
diktovat
dioda
diplom
disk
displej
divadlo
divoch
dlaha
dlouho
dluhopis
dnes
dobro
dobytek
docent
dochutit
dodnes
dohled
dohoda
dohra
dojem
dojnice
doklad
dokola
doktor
dokument
dolar
doleva
dolina
doma
dominant
domluvit
domov
donutit
dopad
dopis
doplnit
doposud
doprovod
dopustit
dorazit
dorost
dort
dosah
doslov
dostatek
dosud
dosyta
dotaz
dotek
dotknout
doufat
doutnat
dovozce
dozadu
doznat
dozorce
drahota
drak
dramatik
dravec
draze
drdol
drobnost
drogerie
drozd
drsnost
drtit
drzost
duben
duchovno
dudek
duha
duhovka
dusit
dusno
dutost
dvojice
dvorec
dynamit
ekolog
ekonomie
elektron
elipsa
email
emise
emoce
empatie
epizoda
epocha
epopej
epos
esej
esence
eskorta
eskymo
etiketa
euforie
evoluce
exekuce
exkurze
expedice
exploze
export
extrakt
facka
fajfka
fakulta
fanatik
fantazie
farmacie
favorit
fazole
federace
fejeton
fenka
fialka
figurant
filozof
filtr
finance
finta
fixace
fjord
flanel
flirt
flotila
fond
fosfor
fotbal
fotka
foton
frakce
freska
fronta
fukar
funkce
fyzika
galeje
garant
genetika
geolog
gilotina
glazura
glejt
golem
golfista
gotika
graf
gramofon
granule
grep
gril
grog
groteska
guma
hadice
hadr
hala
halenka
hanba
hanopis
harfa
harpuna
havran
hebkost
hejkal
hejno
hejtman
hektar
helma
hematom
herec
herna
heslo
hezky
historik
hladovka
hlasivky
hlava
hledat
hlen
hlodavec
hloh
hloupost
hltat
hlubina
hluchota
hmat
hmota
hmyz
hnis
hnojivo
hnout
hoblina
hoboj
hoch
hodiny
hodlat
hodnota
hodovat
hojnost
hokej
holinka
holka
holub
homole
honitba
honorace
horal
horda
horizont
horko
horlivec
hormon
hornina
horoskop
horstvo
hospoda
hostina
hotovost
houba
houf
houpat
houska
hovor
hradba
hranice
hravost
hrazda
hrbolek
hrdina
hrdlo
hrdost
hrnek
hrobka
hromada
hrot
hrouda
hrozen
hrstka
hrubost
hryzat
hubenost
hubnout
hudba
hukot
humr
husita
hustota
hvozd
hybnost
hydrant
hygiena
hymna
hysterik
idylka
ihned
ikona
iluze
imunita
infekce
inflace
inkaso
inovace
inspekce
internet
invalida
investor
inzerce
ironie
jablko
jachta
jahoda
jakmile
jakost
jalovec
jantar
jarmark
jaro
jasan
jasno
jatka
javor
jazyk
jedinec
jedle
jednatel
jehlan
jekot
jelen
jelito
jemnost
jenom
jepice
jeseter
jevit
jezdec
jezero
jinak
jindy
jinoch
jiskra
jistota
jitrnice
jizva
jmenovat
jogurt
jurta
kabaret
kabel
kabinet
kachna
kadet
kadidlo
kahan
kajak
kajuta
kakao
kaktus
kalamita
kalhoty
kalibr
kalnost
kamera
kamkoliv
kamna
kanibal
kanoe
kantor
kapalina
kapela
kapitola
kapka
kaple
kapota
kapr
kapusta
kapybara
karamel
karotka
karton
kasa
katalog
katedra
kauce
kauza
kavalec
kazajka
kazeta
kazivost
kdekoliv
kdesi
kedluben
kemp
keramika
kino
klacek
kladivo
klam
klapot
klasika
klaun
klec
klenba
klepat
klesnout
klid
klima
klisna
klobouk
klokan
klopa
kloub
klubovna
klusat
kluzkost
kmen
kmitat
kmotr
kniha
knot
koalice
koberec
kobka
kobliha
kobyla
kocour
kohout
kojenec
kokos
koktejl
kolaps
koleda
kolize
kolo
komando
kometa
komik
komnata
komora
kompas
komunita
konat
koncept
kondice
konec
konfese
kongres
konina
konkurs
kontakt
konzerva
kopanec
kopie
kopnout
koprovka
korbel
korektor
kormidlo
koroptev
korpus
koruna
koryto
korzet
kosatec
kostka
kotel
kotleta
kotoul
koukat
koupelna
kousek
kouzlo
kovboj
koza
kozoroh
krabice
krach
krajina
kralovat
krasopis
kravata
kredit
krejcar
kresba
kreveta
kriket
kritik
krize
krkavec
krmelec
krmivo
krocan
krok
kronika
kropit
kroupa
krovka
krtek
kruhadlo
krupice
krutost
krvinka
krychle
krypta
krystal
kryt
kudlanka
kufr
kujnost
kukla
kulajda
kulich
kulka
kulomet
kultura
kuna
kupodivu
kurt
kurzor
kutil
kvalita
kvasinka
kvestor
kynolog
kyselina
kytara
kytice
kytka
kytovec
kyvadlo
labrador
lachtan
ladnost
laik
lakomec
lamela
lampa
lanovka
lasice
laso
lastura
latinka
lavina
lebka
leckdy
leden
lednice
ledovka
ledvina
legenda
legie
legrace
lehce
lehkost
lehnout
lektvar
lenochod
lentilka
lepenka
lepidlo
letadlo
letec
letmo
letokruh
levhart
levitace
levobok
libra
lichotka
lidojed
lidskost
lihovina
lijavec
lilek
limetka
linie
linka
linoleum
listopad
litina
litovat
lobista
lodivod
logika
logoped
lokalita
loket
lomcovat
lopata
lopuch
lord
losos
lotr
loudal
louh
louka
louskat
lovec
lstivost
lucerna
lucifer
lump
lusk
lustrace
lvice
lyra
lyrika
lysina
madam
madlo
magistr
mahagon
majetek
majitel
majorita
makak
makovice
makrela
malba
malina
malovat
malvice
maminka
mandle
manko
marnost
masakr
maskot
masopust
matice
matrika
maturita
mazanec
mazivo
mazlit
mazurka
mdloba
mechanik
meditace
medovina
melasa
meloun
mentolka
metla
metoda
metr
mezera
migrace
mihnout
mihule
mikina
mikrofon
milenec
milimetr
milost
mimika
mincovna
minibar
minomet
minulost
miska
mistr
mixovat
mladost
mlha
mlhovina
mlok
mlsat
mluvit
mnich
mnohem
mobil
mocnost
modelka
modlitba
mohyla
mokro
molekula
momentka
monarcha
monokl
monstrum
montovat
monzun
mosaz
moskyt
most
motivace
motorka
motyka
moucha
moudrost
mozaika
mozek
mozol
mramor
mravenec
mrkev
mrtvola
mrzet
mrzutost
mstitel
mudrc
muflon
mulat
mumie
munice
muset
mutace
muzeum
muzikant
myslivec
mzda
nabourat
nachytat
nadace
nadbytek
nadhoz
nadobro
nadpis
nahlas
nahnat
nahodile
nahradit
naivita
najednou
najisto
najmout
naklonit
nakonec
nakrmit
nalevo
namazat
namluvit
nanometr
naoko
naopak
naostro
napadat
napevno
naplnit
napnout
naposled
naprosto
narodit
naruby
narychlo
nasadit
nasekat
naslepo
nastat
natolik
navenek
navrch
navzdory
nazvat
nebe
nechat
necky
nedaleko
nedbat
neduh
negace
nehet
nehoda
nejen
nejprve
neklid
nelibost
nemilost
nemoc
neochota
neonka
nepokoj
nerost
nerv
nesmysl
nesoulad
netvor
neuron
nevina
nezvykle
nicota
nijak
nikam
nikdy
nikl
nikterak
nitro
nocleh
nohavice
nominace
nora
norek
nositel
nosnost
nouze
noviny
novota
nozdra
nuda
nudle
nuget
nutit
nutnost
nutrie
nymfa
obal
obarvit
obava
obdiv
obec
obehnat
obejmout
obezita
obhajoba
obilnice
objasnit
objekt
obklopit
oblast
oblek
obliba
obloha
obluda
obnos
obohatit
obojek
obout
obrazec
obrna
obruba
obrys
obsah
obsluha
obstarat
obuv
obvaz
obvinit
obvod
obvykle
obyvatel
obzor
ocas
ocel
ocenit
ochladit
ochota
ochrana
ocitnout
odboj
odbyt
odchod
odcizit
odebrat
odeslat
odevzdat
odezva
odhadce
odhodit
odjet
odjinud
odkaz
odkoupit
odliv
odluka
odmlka
odolnost
odpad
odpis
odplout
odpor
odpustit
odpykat
odrazka
odsoudit
odstup
odsun
odtok
odtud
odvaha
odveta
odvolat
odvracet
odznak
ofina
ofsajd
ohlas
ohnisko
ohrada
ohrozit
ohryzek
okap
okenice
oklika
okno
okouzlit
okovy
okrasa
okres
okrsek
okruh
okupant
okurka
okusit
olejnina
olizovat
omak
omeleta
omezit
omladina
omlouvat
omluva
omyl
onehdy
opakovat
opasek
operace
opice
opilost
opisovat
opora
opozice
opravdu
oproti
orbital
orchestr
orgie
orlice
orloj
ortel
osada
oschnout
osika
osivo
oslava
oslepit
oslnit
oslovit
osnova
osoba
osolit
ospalec
osten
ostraha
ostuda
ostych
osvojit
oteplit
otisk
otop
otrhat
otrlost
otrok
otruby
otvor
ovanout
ovar
oves
ovlivnit
ovoce
oxid
ozdoba
pachatel
pacient
padouch
pahorek
pakt
palanda
palec
palivo
paluba
pamflet
pamlsek
panenka
panika
panna
panovat
panstvo
pantofle
paprika
parketa
parodie
parta
paruka
paryba
paseka
pasivita
pastelka
patent
patrona
pavouk
pazneht
pazourek
pecka
pedagog
pejsek
peklo
peloton
penalta
pendrek
penze
periskop
pero
pestrost
petarda
petice
petrolej
pevnina
pexeso
pianista
piha
pijavice
pikle
piknik
pilina
pilnost
pilulka
pinzeta
pipeta
pisatel
pistole
pitevna
pivnice
pivovar
placenta
plakat
plamen
planeta
plastika
platit
plavidlo
plaz
plech
plemeno
plenta
ples
pletivo
plevel
plivat
plnit
plno
plocha
plodina
plomba
plout
pluk
plyn
pobavit
pobyt
pochod
pocit
poctivec
podat
podcenit
podepsat
podhled
podivit
podklad
podmanit
podnik
podoba
podpora
podraz
podstata
podvod
podzim
poezie
pohanka
pohnutka
pohovor
pohroma
pohyb
pointa
pojistka
pojmout
pokazit
pokles
pokoj
pokrok
pokuta
pokyn
poledne
polibek
polknout
poloha
polynom
pomalu
pominout
pomlka
pomoc
pomsta
pomyslet
ponechat
ponorka
ponurost
popadat
popel
popisek
poplach
poprosit
popsat
popud
poradce
porce
porod
porucha
poryv
posadit
posed
posila
poskok
poslanec
posoudit
pospolu
postava
posudek
posyp
potah
potkan
potlesk
potomek
potrava
potupa
potvora
poukaz
pouto
pouzdro
povaha
povidla
povlak
povoz
povrch
povstat
povyk
povzdech
pozdrav
pozemek
poznatek
pozor
pozvat
pracovat
prahory
praktika
prales
praotec
praporek
prase
pravda
princip
prkno
probudit
procento
prodej
profese
prohra
projekt
prolomit
promile
pronikat
propad
prorok
prosba
proton
proutek
provaz
prskavka
prsten
prudkost
prut
prvek
prvohory
psanec
psovod
pstruh
ptactvo
puberta
puch
pudl
pukavec
puklina
pukrle
pult
pumpa
punc
pupen
pusa
pusinka
pustina
putovat
putyka
pyramida
pysk
pytel
racek
rachot
radiace
radnice
radon
raft
ragby
raketa
rakovina
rameno
rampouch
rande
rarach
rarita
rasovna
rastr
ratolest
razance
razidlo
reagovat
reakce
recept
redaktor
referent
reflex
rejnok
reklama
rekord
rekrut
rektor
reputace
revize
revma
revolver
rezerva
riskovat
riziko
robotika
rodokmen
rohovka
rokle
rokoko
romaneto
ropovod
ropucha
rorejs
rosol
rostlina
rotmistr
rotoped
rotunda
roubenka
roucho
roup
roura
rovina
rovnice
rozbor
rozchod
rozdat
rozeznat
rozhodce
rozinka
rozjezd
rozkaz
rozloha
rozmar
rozpad
rozruch
rozsah
roztok
rozum
rozvod
rubrika
ruchadlo
rukavice
rukopis
ryba
rybolov
rychlost
rydlo
rypadlo
rytina
ryzost
sadista
sahat
sako
samec
samizdat
samota
sanitka
sardinka
sasanka
satelit
sazba
sazenice
sbor
schovat
sebranka
secese
sedadlo
sediment
sedlo
sehnat
sejmout
sekera
sekta
sekunda
sekvoje
semeno
seno
servis
sesadit
seshora
seskok
seslat
sestra
sesuv
sesypat
setba
setina
setkat
setnout
setrvat
sever
seznam
shoda
shrnout
sifon
silnice
sirka
sirotek
sirup
situace
skafandr
skalisko
skanzen
skaut
skeptik
skica
skladba
sklenice
sklo
skluz
skoba
skokan
skoro
skripta
skrz
skupina
skvost
skvrna
slabika
sladidlo
slanina
slast
slavnost
sledovat
slepec
sleva
slezina
slib
slina
sliznice
slon
sloupek
slovo
sluch
sluha
slunce
slupka
slza
smaragd
smetana
smilstvo
smlouva
smog
smrad
smrk
smrtka
smutek
smysl
snad
snaha
snob
sobota
socha
sodovka
sokol
sopka
sotva
souboj
soucit
soudce
souhlas
soulad
soumrak
souprava
soused
soutok
souviset
spalovna
spasitel
spis
splav
spodek
spojenec
spolu
sponzor
spornost
spousta
sprcha
spustit
sranda
sraz
srdce
srna
srnec
srovnat
srpen
srst
srub
stanice
starosta
statika
stavba
stehno
stezka
stodola
stolek
stopa
storno
stoupat
strach
stres
strhnout
strom
struna
studna
stupnice
stvol
styk
subjekt
subtropy
suchar
sudost
sukno
sundat
sunout
surikata
surovina
svah
svalstvo
svetr
svatba
svazek
svisle
svitek
svoboda
svodidlo
svorka
svrab
sykavka
sykot
synek
synovec
sypat
sypkost
syrovost
sysel
sytost
tabletka
tabule
tahoun
tajemno
tajfun
tajga
tajit
tajnost
taktika
tamhle
tampon
tancovat
tanec
tanker
tapeta
tavenina
tazatel
technika
tehdy
tekutina
telefon
temnota
tendence
tenista
tenor
teplota
tepna
teprve
terapie
termoska
textil
ticho
tiskopis
titulek
tkadlec
tkanina
tlapka
tleskat
tlukot
tlupa
tmel
toaleta
topinka
topol
torzo
touha
toulec
tradice
traktor
tramp
trasa
traverza
trefit
trest
trezor
trhavina
trhlina
trochu
trojice
troska
trouba
trpce
trpitel
trpkost
trubec
truchlit
truhlice
trus
trvat
tudy
tuhnout
tuhost
tundra
turista
turnaj
tuzemsko
tvaroh
tvorba
tvrdost
tvrz
tygr
tykev
ubohost
uboze
ubrat
ubrousek
ubrus
ubytovna
ucho
uctivost
udivit
uhradit
ujednat
ujistit
ujmout
ukazatel
uklidnit
uklonit
ukotvit
ukrojit
ulice
ulita
ulovit
umyvadlo
unavit
uniforma
uniknout
upadnout
uplatnit
uplynout
upoutat
upravit
uran
urazit
usednout
usilovat
usmrtit
usnadnit
usnout
usoudit
ustlat
ustrnout
utahovat
utkat
utlumit
utonout
utopenec
utrousit
uvalit
uvolnit
uvozovka
uzdravit
uzel
uzenina
uzlina
uznat
vagon
valcha
valoun
vana
vandal
vanilka
varan
varhany
varovat
vcelku
vchod
vdova
vedro
vegetace
vejce
velbloud
veletrh
velitel
velmoc
velryba
venkov
veranda
verze
veselka
veskrze
vesnice
vespodu
vesta
veterina
veverka
vibrace
vichr
videohra
vidina
vidle
vila
vinice
viset
vitalita
vize
vizitka
vjezd
vklad
vkus
vlajka
vlak
vlasec
vlevo
vlhkost
vliv
vlnovka
vloupat
vnucovat
vnuk
voda
vodivost
vodoznak
vodstvo
vojensky
vojna
vojsko
volant
volba
volit
volno
voskovka
vozidlo
vozovna
vpravo
vrabec
vracet
vrah
vrata
vrba
vrcholek
vrhat
vrstva
vrtule
vsadit
vstoupit
vstup
vtip
vybavit
vybrat
vychovat
vydat
vydra
vyfotit
vyhledat
vyhnout
vyhodit
vyhradit
vyhubit
vyjasnit
vyjet
vyjmout
vyklopit
vykonat
vylekat
vymazat
vymezit
vymizet
vymyslet
vynechat
vynikat
vynutit
vypadat
vyplatit
vypravit
vypustit
vyrazit
vyrovnat
vyrvat
vyslovit
vysoko
vystavit
vysunout
vysypat
vytasit
vytesat
vytratit
vyvinout
vyvolat
vyvrhel
vyzdobit
vyznat
vzadu
vzbudit
vzchopit
vzdor
vzduch
vzdychat
vzestup
vzhledem
vzkaz
vzlykat
vznik
vzorek
vzpoura
vztah
vztek
xylofon
zabrat
zabydlet
zachovat
zadarmo
zadusit
zafoukat
zahltit
zahodit
zahrada
zahynout
zajatec
zajet
zajistit
zaklepat
zakoupit
zalepit
zamezit
zamotat
zamyslet
zanechat
zanikat
zaplatit
zapojit
zapsat
zarazit
zastavit
zasunout
zatajit
zatemnit
zatknout
zaujmout
zavalit
zavelet
zavinit
zavolat
zavrtat
zazvonit
zbavit
zbrusu
zbudovat
zbytek
zdaleka
zdarma
zdatnost
zdivo
zdobit
zdroj
zdvih
zdymadlo
zelenina
zeman
zemina
zeptat
zezadu
zezdola
zhatit
zhltnout
zhluboka
zhotovit
zhruba
zima
zimnice
zjemnit
zklamat
zkoumat
zkratka
zkumavka
zlato
zlehka
zloba
zlom
zlost
zlozvyk
zmapovat
zmar
zmatek
zmije
zmizet
zmocnit
zmodrat
zmrzlina
zmutovat
znak
znalost
znamenat
znovu
zobrazit
zotavit
zoubek
zoufale
zplodit
zpomalit
zprava
zprostit
zprudka
zprvu
zrada
zranit
zrcadlo
zrnitost
zrno
zrovna
zrychlit
zrzavost
zticha
ztratit
zubovina
zubr
zvednout
zvenku
zvesela
zvon
zvrat
zvukovod
zvyk`.split("\n");

// node_modules/@scure/bip39/esm/wordlists/english.js
var wordlist2 = `abandon
ability
able
about
above
absent
absorb
abstract
absurd
abuse
access
accident
account
accuse
achieve
acid
acoustic
acquire
across
act
action
actor
actress
actual
adapt
add
addict
address
adjust
admit
adult
advance
advice
aerobic
affair
afford
afraid
again
age
agent
agree
ahead
aim
air
airport
aisle
alarm
album
alcohol
alert
alien
all
alley
allow
almost
alone
alpha
already
also
alter
always
amateur
amazing
among
amount
amused
analyst
anchor
ancient
anger
angle
angry
animal
ankle
announce
annual
another
answer
antenna
antique
anxiety
any
apart
apology
appear
apple
approve
april
arch
arctic
area
arena
argue
arm
armed
armor
army
around
arrange
arrest
arrive
arrow
art
artefact
artist
artwork
ask
aspect
assault
asset
assist
assume
asthma
athlete
atom
attack
attend
attitude
attract
auction
audit
august
aunt
author
auto
autumn
average
avocado
avoid
awake
aware
away
awesome
awful
awkward
axis
baby
bachelor
bacon
badge
bag
balance
balcony
ball
bamboo
banana
banner
bar
barely
bargain
barrel
base
basic
basket
battle
beach
bean
beauty
because
become
beef
before
begin
behave
behind
believe
below
belt
bench
benefit
best
betray
better
between
beyond
bicycle
bid
bike
bind
biology
bird
birth
bitter
black
blade
blame
blanket
blast
bleak
bless
blind
blood
blossom
blouse
blue
blur
blush
board
boat
body
boil
bomb
bone
bonus
book
boost
border
boring
borrow
boss
bottom
bounce
box
boy
bracket
brain
brand
brass
brave
bread
breeze
brick
bridge
brief
bright
bring
brisk
broccoli
broken
bronze
broom
brother
brown
brush
bubble
buddy
budget
buffalo
build
bulb
bulk
bullet
bundle
bunker
burden
burger
burst
bus
business
busy
butter
buyer
buzz
cabbage
cabin
cable
cactus
cage
cake
call
calm
camera
camp
can
canal
cancel
candy
cannon
canoe
canvas
canyon
capable
capital
captain
car
carbon
card
cargo
carpet
carry
cart
case
cash
casino
castle
casual
cat
catalog
catch
category
cattle
caught
cause
caution
cave
ceiling
celery
cement
census
century
cereal
certain
chair
chalk
champion
change
chaos
chapter
charge
chase
chat
cheap
check
cheese
chef
cherry
chest
chicken
chief
child
chimney
choice
choose
chronic
chuckle
chunk
churn
cigar
cinnamon
circle
citizen
city
civil
claim
clap
clarify
claw
clay
clean
clerk
clever
click
client
cliff
climb
clinic
clip
clock
clog
close
cloth
cloud
clown
club
clump
cluster
clutch
coach
coast
coconut
code
coffee
coil
coin
collect
color
column
combine
come
comfort
comic
common
company
concert
conduct
confirm
congress
connect
consider
control
convince
cook
cool
copper
copy
coral
core
corn
correct
cost
cotton
couch
country
couple
course
cousin
cover
coyote
crack
cradle
craft
cram
crane
crash
crater
crawl
crazy
cream
credit
creek
crew
cricket
crime
crisp
critic
crop
cross
crouch
crowd
crucial
cruel
cruise
crumble
crunch
crush
cry
crystal
cube
culture
cup
cupboard
curious
current
curtain
curve
cushion
custom
cute
cycle
dad
damage
damp
dance
danger
daring
dash
daughter
dawn
day
deal
debate
debris
decade
december
decide
decline
decorate
decrease
deer
defense
define
defy
degree
delay
deliver
demand
demise
denial
dentist
deny
depart
depend
deposit
depth
deputy
derive
describe
desert
design
desk
despair
destroy
detail
detect
develop
device
devote
diagram
dial
diamond
diary
dice
diesel
diet
differ
digital
dignity
dilemma
dinner
dinosaur
direct
dirt
disagree
discover
disease
dish
dismiss
disorder
display
distance
divert
divide
divorce
dizzy
doctor
document
dog
doll
dolphin
domain
donate
donkey
donor
door
dose
double
dove
draft
dragon
drama
drastic
draw
dream
dress
drift
drill
drink
drip
drive
drop
drum
dry
duck
dumb
dune
during
dust
dutch
duty
dwarf
dynamic
eager
eagle
early
earn
earth
easily
east
easy
echo
ecology
economy
edge
edit
educate
effort
egg
eight
either
elbow
elder
electric
elegant
element
elephant
elevator
elite
else
embark
embody
embrace
emerge
emotion
employ
empower
empty
enable
enact
end
endless
endorse
enemy
energy
enforce
engage
engine
enhance
enjoy
enlist
enough
enrich
enroll
ensure
enter
entire
entry
envelope
episode
equal
equip
era
erase
erode
erosion
error
erupt
escape
essay
essence
estate
eternal
ethics
evidence
evil
evoke
evolve
exact
example
excess
exchange
excite
exclude
excuse
execute
exercise
exhaust
exhibit
exile
exist
exit
exotic
expand
expect
expire
explain
expose
express
extend
extra
eye
eyebrow
fabric
face
faculty
fade
faint
faith
fall
false
fame
family
famous
fan
fancy
fantasy
farm
fashion
fat
fatal
father
fatigue
fault
favorite
feature
february
federal
fee
feed
feel
female
fence
festival
fetch
fever
few
fiber
fiction
field
figure
file
film
filter
final
find
fine
finger
finish
fire
firm
first
fiscal
fish
fit
fitness
fix
flag
flame
flash
flat
flavor
flee
flight
flip
float
flock
floor
flower
fluid
flush
fly
foam
focus
fog
foil
fold
follow
food
foot
force
forest
forget
fork
fortune
forum
forward
fossil
foster
found
fox
fragile
frame
frequent
fresh
friend
fringe
frog
front
frost
frown
frozen
fruit
fuel
fun
funny
furnace
fury
future
gadget
gain
galaxy
gallery
game
gap
garage
garbage
garden
garlic
garment
gas
gasp
gate
gather
gauge
gaze
general
genius
genre
gentle
genuine
gesture
ghost
giant
gift
giggle
ginger
giraffe
girl
give
glad
glance
glare
glass
glide
glimpse
globe
gloom
glory
glove
glow
glue
goat
goddess
gold
good
goose
gorilla
gospel
gossip
govern
gown
grab
grace
grain
grant
grape
grass
gravity
great
green
grid
grief
grit
grocery
group
grow
grunt
guard
guess
guide
guilt
guitar
gun
gym
habit
hair
half
hammer
hamster
hand
happy
harbor
hard
harsh
harvest
hat
have
hawk
hazard
head
health
heart
heavy
hedgehog
height
hello
helmet
help
hen
hero
hidden
high
hill
hint
hip
hire
history
hobby
hockey
hold
hole
holiday
hollow
home
honey
hood
hope
horn
horror
horse
hospital
host
hotel
hour
hover
hub
huge
human
humble
humor
hundred
hungry
hunt
hurdle
hurry
hurt
husband
hybrid
ice
icon
idea
identify
idle
ignore
ill
illegal
illness
image
imitate
immense
immune
impact
impose
improve
impulse
inch
include
income
increase
index
indicate
indoor
industry
infant
inflict
inform
inhale
inherit
initial
inject
injury
inmate
inner
innocent
input
inquiry
insane
insect
inside
inspire
install
intact
interest
into
invest
invite
involve
iron
island
isolate
issue
item
ivory
jacket
jaguar
jar
jazz
jealous
jeans
jelly
jewel
job
join
joke
journey
joy
judge
juice
jump
jungle
junior
junk
just
kangaroo
keen
keep
ketchup
key
kick
kid
kidney
kind
kingdom
kiss
kit
kitchen
kite
kitten
kiwi
knee
knife
knock
know
lab
label
labor
ladder
lady
lake
lamp
language
laptop
large
later
latin
laugh
laundry
lava
law
lawn
lawsuit
layer
lazy
leader
leaf
learn
leave
lecture
left
leg
legal
legend
leisure
lemon
lend
length
lens
leopard
lesson
letter
level
liar
liberty
library
license
life
lift
light
like
limb
limit
link
lion
liquid
list
little
live
lizard
load
loan
lobster
local
lock
logic
lonely
long
loop
lottery
loud
lounge
love
loyal
lucky
luggage
lumber
lunar
lunch
luxury
lyrics
machine
mad
magic
magnet
maid
mail
main
major
make
mammal
man
manage
mandate
mango
mansion
manual
maple
marble
march
margin
marine
market
marriage
mask
mass
master
match
material
math
matrix
matter
maximum
maze
meadow
mean
measure
meat
mechanic
medal
media
melody
melt
member
memory
mention
menu
mercy
merge
merit
merry
mesh
message
metal
method
middle
midnight
milk
million
mimic
mind
minimum
minor
minute
miracle
mirror
misery
miss
mistake
mix
mixed
mixture
mobile
model
modify
mom
moment
monitor
monkey
monster
month
moon
moral
more
morning
mosquito
mother
motion
motor
mountain
mouse
move
movie
much
muffin
mule
multiply
muscle
museum
mushroom
music
must
mutual
myself
mystery
myth
naive
name
napkin
narrow
nasty
nation
nature
near
neck
need
negative
neglect
neither
nephew
nerve
nest
net
network
neutral
never
news
next
nice
night
noble
noise
nominee
noodle
normal
north
nose
notable
note
nothing
notice
novel
now
nuclear
number
nurse
nut
oak
obey
object
oblige
obscure
observe
obtain
obvious
occur
ocean
october
odor
off
offer
office
often
oil
okay
old
olive
olympic
omit
once
one
onion
online
only
open
opera
opinion
oppose
option
orange
orbit
orchard
order
ordinary
organ
orient
original
orphan
ostrich
other
outdoor
outer
output
outside
oval
oven
over
own
owner
oxygen
oyster
ozone
pact
paddle
page
pair
palace
palm
panda
panel
panic
panther
paper
parade
parent
park
parrot
party
pass
patch
path
patient
patrol
pattern
pause
pave
payment
peace
peanut
pear
peasant
pelican
pen
penalty
pencil
people
pepper
perfect
permit
person
pet
phone
photo
phrase
physical
piano
picnic
picture
piece
pig
pigeon
pill
pilot
pink
pioneer
pipe
pistol
pitch
pizza
place
planet
plastic
plate
play
please
pledge
pluck
plug
plunge
poem
poet
point
polar
pole
police
pond
pony
pool
popular
portion
position
possible
post
potato
pottery
poverty
powder
power
practice
praise
predict
prefer
prepare
present
pretty
prevent
price
pride
primary
print
priority
prison
private
prize
problem
process
produce
profit
program
project
promote
proof
property
prosper
protect
proud
provide
public
pudding
pull
pulp
pulse
pumpkin
punch
pupil
puppy
purchase
purity
purpose
purse
push
put
puzzle
pyramid
quality
quantum
quarter
question
quick
quit
quiz
quote
rabbit
raccoon
race
rack
radar
radio
rail
rain
raise
rally
ramp
ranch
random
range
rapid
rare
rate
rather
raven
raw
razor
ready
real
reason
rebel
rebuild
recall
receive
recipe
record
recycle
reduce
reflect
reform
refuse
region
regret
regular
reject
relax
release
relief
rely
remain
remember
remind
remove
render
renew
rent
reopen
repair
repeat
replace
report
require
rescue
resemble
resist
resource
response
result
retire
retreat
return
reunion
reveal
review
reward
rhythm
rib
ribbon
rice
rich
ride
ridge
rifle
right
rigid
ring
riot
ripple
risk
ritual
rival
river
road
roast
robot
robust
rocket
romance
roof
rookie
room
rose
rotate
rough
round
route
royal
rubber
rude
rug
rule
run
runway
rural
sad
saddle
sadness
safe
sail
salad
salmon
salon
salt
salute
same
sample
sand
satisfy
satoshi
sauce
sausage
save
say
scale
scan
scare
scatter
scene
scheme
school
science
scissors
scorpion
scout
scrap
screen
script
scrub
sea
search
season
seat
second
secret
section
security
seed
seek
segment
select
sell
seminar
senior
sense
sentence
series
service
session
settle
setup
seven
shadow
shaft
shallow
share
shed
shell
sheriff
shield
shift
shine
ship
shiver
shock
shoe
shoot
shop
short
shoulder
shove
shrimp
shrug
shuffle
shy
sibling
sick
side
siege
sight
sign
silent
silk
silly
silver
similar
simple
since
sing
siren
sister
situate
six
size
skate
sketch
ski
skill
skin
skirt
skull
slab
slam
sleep
slender
slice
slide
slight
slim
slogan
slot
slow
slush
small
smart
smile
smoke
smooth
snack
snake
snap
sniff
snow
soap
soccer
social
sock
soda
soft
solar
soldier
solid
solution
solve
someone
song
soon
sorry
sort
soul
sound
soup
source
south
space
spare
spatial
spawn
speak
special
speed
spell
spend
sphere
spice
spider
spike
spin
spirit
split
spoil
sponsor
spoon
sport
spot
spray
spread
spring
spy
square
squeeze
squirrel
stable
stadium
staff
stage
stairs
stamp
stand
start
state
stay
steak
steel
stem
step
stereo
stick
still
sting
stock
stomach
stone
stool
story
stove
strategy
street
strike
strong
struggle
student
stuff
stumble
style
subject
submit
subway
success
such
sudden
suffer
sugar
suggest
suit
summer
sun
sunny
sunset
super
supply
supreme
sure
surface
surge
surprise
surround
survey
suspect
sustain
swallow
swamp
swap
swarm
swear
sweet
swift
swim
swing
switch
sword
symbol
symptom
syrup
system
table
tackle
tag
tail
talent
talk
tank
tape
target
task
taste
tattoo
taxi
teach
team
tell
ten
tenant
tennis
tent
term
test
text
thank
that
theme
then
theory
there
they
thing
this
thought
three
thrive
throw
thumb
thunder
ticket
tide
tiger
tilt
timber
time
tiny
tip
tired
tissue
title
toast
tobacco
today
toddler
toe
together
toilet
token
tomato
tomorrow
tone
tongue
tonight
tool
tooth
top
topic
topple
torch
tornado
tortoise
toss
total
tourist
toward
tower
town
toy
track
trade
traffic
tragic
train
transfer
trap
trash
travel
tray
treat
tree
trend
trial
tribe
trick
trigger
trim
trip
trophy
trouble
truck
true
truly
trumpet
trust
truth
try
tube
tuition
tumble
tuna
tunnel
turkey
turn
turtle
twelve
twenty
twice
twin
twist
two
type
typical
ugly
umbrella
unable
unaware
uncle
uncover
under
undo
unfair
unfold
unhappy
uniform
unique
unit
universe
unknown
unlock
until
unusual
unveil
update
upgrade
uphold
upon
upper
upset
urban
urge
usage
use
used
useful
useless
usual
utility
vacant
vacuum
vague
valid
valley
valve
van
vanish
vapor
various
vast
vault
vehicle
velvet
vendor
venture
venue
verb
verify
version
very
vessel
veteran
viable
vibrant
vicious
victory
video
view
village
vintage
violin
virtual
virus
visa
visit
visual
vital
vivid
vocal
voice
void
volcano
volume
vote
voyage
wage
wagon
wait
walk
wall
walnut
want
warfare
warm
warrior
wash
wasp
waste
water
wave
way
wealth
weapon
wear
weasel
weather
web
wedding
weekend
weird
welcome
west
wet
whale
what
wheat
wheel
when
where
whip
whisper
wide
width
wife
wild
will
win
window
wine
wing
wink
winner
winter
wire
wisdom
wise
wish
witness
wolf
woman
wonder
wood
wool
word
work
world
worry
worth
wrap
wreck
wrestle
wrist
write
wrong
yard
year
yellow
you
young
youth
zebra
zero
zone
zoo`.split("\n");

// node_modules/@scure/bip39/esm/wordlists/french.js
var wordlist3 = `abaisser
abandon
abdiquer
abeille
abolir
aborder
aboutir
aboyer
abrasif
abreuver
abriter
abroger
abrupt
absence
absolu
absurde
abusif
abyssal
académie
acajou
acarien
accabler
accepter
acclamer
accolade
accroche
accuser
acerbe
achat
acheter
aciduler
acier
acompte
acquérir
acronyme
acteur
actif
actuel
adepte
adéquat
adhésif
adjectif
adjuger
admettre
admirer
adopter
adorer
adoucir
adresse
adroit
adulte
adverbe
aérer
aéronef
affaire
affecter
affiche
affreux
affubler
agacer
agencer
agile
agiter
agrafer
agréable
agrume
aider
aiguille
ailier
aimable
aisance
ajouter
ajuster
alarmer
alchimie
alerte
algèbre
algue
aliéner
aliment
alléger
alliage
allouer
allumer
alourdir
alpaga
altesse
alvéole
amateur
ambigu
ambre
aménager
amertume
amidon
amiral
amorcer
amour
amovible
amphibie
ampleur
amusant
analyse
anaphore
anarchie
anatomie
ancien
anéantir
angle
angoisse
anguleux
animal
annexer
annonce
annuel
anodin
anomalie
anonyme
anormal
antenne
antidote
anxieux
apaiser
apéritif
aplanir
apologie
appareil
appeler
apporter
appuyer
aquarium
aqueduc
arbitre
arbuste
ardeur
ardoise
argent
arlequin
armature
armement
armoire
armure
arpenter
arracher
arriver
arroser
arsenic
artériel
article
aspect
asphalte
aspirer
assaut
asservir
assiette
associer
assurer
asticot
astre
astuce
atelier
atome
atrium
atroce
attaque
attentif
attirer
attraper
aubaine
auberge
audace
audible
augurer
aurore
automne
autruche
avaler
avancer
avarice
avenir
averse
aveugle
aviateur
avide
avion
aviser
avoine
avouer
avril
axial
axiome
badge
bafouer
bagage
baguette
baignade
balancer
balcon
baleine
balisage
bambin
bancaire
bandage
banlieue
bannière
banquier
barbier
baril
baron
barque
barrage
bassin
bastion
bataille
bateau
batterie
baudrier
bavarder
belette
bélier
belote
bénéfice
berceau
berger
berline
bermuda
besace
besogne
bétail
beurre
biberon
bicycle
bidule
bijou
bilan
bilingue
billard
binaire
biologie
biopsie
biotype
biscuit
bison
bistouri
bitume
bizarre
blafard
blague
blanchir
blessant
blinder
blond
bloquer
blouson
bobard
bobine
boire
boiser
bolide
bonbon
bondir
bonheur
bonifier
bonus
bordure
borne
botte
boucle
boueux
bougie
boulon
bouquin
bourse
boussole
boutique
boxeur
branche
brasier
brave
brebis
brèche
breuvage
bricoler
brigade
brillant
brioche
brique
brochure
broder
bronzer
brousse
broyeur
brume
brusque
brutal
bruyant
buffle
buisson
bulletin
bureau
burin
bustier
butiner
butoir
buvable
buvette
cabanon
cabine
cachette
cadeau
cadre
caféine
caillou
caisson
calculer
calepin
calibre
calmer
calomnie
calvaire
camarade
caméra
camion
campagne
canal
caneton
canon
cantine
canular
capable
caporal
caprice
capsule
capter
capuche
carabine
carbone
caresser
caribou
carnage
carotte
carreau
carton
cascade
casier
casque
cassure
causer
caution
cavalier
caverne
caviar
cédille
ceinture
céleste
cellule
cendrier
censurer
central
cercle
cérébral
cerise
cerner
cerveau
cesser
chagrin
chaise
chaleur
chambre
chance
chapitre
charbon
chasseur
chaton
chausson
chavirer
chemise
chenille
chéquier
chercher
cheval
chien
chiffre
chignon
chimère
chiot
chlorure
chocolat
choisir
chose
chouette
chrome
chute
cigare
cigogne
cimenter
cinéma
cintrer
circuler
cirer
cirque
citerne
citoyen
citron
civil
clairon
clameur
claquer
classe
clavier
client
cligner
climat
clivage
cloche
clonage
cloporte
cobalt
cobra
cocasse
cocotier
coder
codifier
coffre
cogner
cohésion
coiffer
coincer
colère
colibri
colline
colmater
colonel
combat
comédie
commande
compact
concert
conduire
confier
congeler
connoter
consonne
contact
convexe
copain
copie
corail
corbeau
cordage
corniche
corpus
correct
cortège
cosmique
costume
coton
coude
coupure
courage
couteau
couvrir
coyote
crabe
crainte
cravate
crayon
créature
créditer
crémeux
creuser
crevette
cribler
crier
cristal
critère
croire
croquer
crotale
crucial
cruel
crypter
cubique
cueillir
cuillère
cuisine
cuivre
culminer
cultiver
cumuler
cupide
curatif
curseur
cyanure
cycle
cylindre
cynique
daigner
damier
danger
danseur
dauphin
débattre
débiter
déborder
débrider
débutant
décaler
décembre
déchirer
décider
déclarer
décorer
décrire
décupler
dédale
déductif
déesse
défensif
défiler
défrayer
dégager
dégivrer
déglutir
dégrafer
déjeuner
délice
déloger
demander
demeurer
démolir
dénicher
dénouer
dentelle
dénuder
départ
dépenser
déphaser
déplacer
déposer
déranger
dérober
désastre
descente
désert
désigner
désobéir
dessiner
destrier
détacher
détester
détourer
détresse
devancer
devenir
deviner
devoir
diable
dialogue
diamant
dicter
différer
digérer
digital
digne
diluer
dimanche
diminuer
dioxyde
directif
diriger
discuter
disposer
dissiper
distance
divertir
diviser
docile
docteur
dogme
doigt
domaine
domicile
dompter
donateur
donjon
donner
dopamine
dortoir
dorure
dosage
doseur
dossier
dotation
douanier
double
douceur
douter
doyen
dragon
draper
dresser
dribbler
droiture
duperie
duplexe
durable
durcir
dynastie
éblouir
écarter
écharpe
échelle
éclairer
éclipse
éclore
écluse
école
économie
écorce
écouter
écraser
écrémer
écrivain
écrou
écume
écureuil
édifier
éduquer
effacer
effectif
effigie
effort
effrayer
effusion
égaliser
égarer
éjecter
élaborer
élargir
électron
élégant
éléphant
élève
éligible
élitisme
éloge
élucider
éluder
emballer
embellir
embryon
émeraude
émission
emmener
émotion
émouvoir
empereur
employer
emporter
emprise
émulsion
encadrer
enchère
enclave
encoche
endiguer
endosser
endroit
enduire
énergie
enfance
enfermer
enfouir
engager
engin
englober
énigme
enjamber
enjeu
enlever
ennemi
ennuyeux
enrichir
enrobage
enseigne
entasser
entendre
entier
entourer
entraver
énumérer
envahir
enviable
envoyer
enzyme
éolien
épaissir
épargne
épatant
épaule
épicerie
épidémie
épier
épilogue
épine
épisode
épitaphe
époque
épreuve
éprouver
épuisant
équerre
équipe
ériger
érosion
erreur
éruption
escalier
espadon
espèce
espiègle
espoir
esprit
esquiver
essayer
essence
essieu
essorer
estime
estomac
estrade
étagère
étaler
étanche
étatique
éteindre
étendoir
éternel
éthanol
éthique
ethnie
étirer
étoffer
étoile
étonnant
étourdir
étrange
étroit
étude
euphorie
évaluer
évasion
éventail
évidence
éviter
évolutif
évoquer
exact
exagérer
exaucer
exceller
excitant
exclusif
excuse
exécuter
exemple
exercer
exhaler
exhorter
exigence
exiler
exister
exotique
expédier
explorer
exposer
exprimer
exquis
extensif
extraire
exulter
fable
fabuleux
facette
facile
facture
faiblir
falaise
fameux
famille
farceur
farfelu
farine
farouche
fasciner
fatal
fatigue
faucon
fautif
faveur
favori
fébrile
féconder
fédérer
félin
femme
fémur
fendoir
féodal
fermer
féroce
ferveur
festival
feuille
feutre
février
fiasco
ficeler
fictif
fidèle
figure
filature
filetage
filière
filleul
filmer
filou
filtrer
financer
finir
fiole
firme
fissure
fixer
flairer
flamme
flasque
flatteur
fléau
flèche
fleur
flexion
flocon
flore
fluctuer
fluide
fluvial
folie
fonderie
fongible
fontaine
forcer
forgeron
formuler
fortune
fossile
foudre
fougère
fouiller
foulure
fourmi
fragile
fraise
franchir
frapper
frayeur
frégate
freiner
frelon
frémir
frénésie
frère
friable
friction
frisson
frivole
froid
fromage
frontal
frotter
fruit
fugitif
fuite
fureur
furieux
furtif
fusion
futur
gagner
galaxie
galerie
gambader
garantir
gardien
garnir
garrigue
gazelle
gazon
géant
gélatine
gélule
gendarme
général
génie
genou
gentil
géologie
géomètre
géranium
germe
gestuel
geyser
gibier
gicler
girafe
givre
glace
glaive
glisser
globe
gloire
glorieux
golfeur
gomme
gonfler
gorge
gorille
goudron
gouffre
goulot
goupille
gourmand
goutte
graduel
graffiti
graine
grand
grappin
gratuit
gravir
grenat
griffure
griller
grimper
grogner
gronder
grotte
groupe
gruger
grutier
gruyère
guépard
guerrier
guide
guimauve
guitare
gustatif
gymnaste
gyrostat
habitude
hachoir
halte
hameau
hangar
hanneton
haricot
harmonie
harpon
hasard
hélium
hématome
herbe
hérisson
hermine
héron
hésiter
heureux
hiberner
hibou
hilarant
histoire
hiver
homard
hommage
homogène
honneur
honorer
honteux
horde
horizon
horloge
hormone
horrible
houleux
housse
hublot
huileux
humain
humble
humide
humour
hurler
hydromel
hygiène
hymne
hypnose
idylle
ignorer
iguane
illicite
illusion
image
imbiber
imiter
immense
immobile
immuable
impact
impérial
implorer
imposer
imprimer
imputer
incarner
incendie
incident
incliner
incolore
indexer
indice
inductif
inédit
ineptie
inexact
infini
infliger
informer
infusion
ingérer
inhaler
inhiber
injecter
injure
innocent
inoculer
inonder
inscrire
insecte
insigne
insolite
inspirer
instinct
insulter
intact
intense
intime
intrigue
intuitif
inutile
invasion
inventer
inviter
invoquer
ironique
irradier
irréel
irriter
isoler
ivoire
ivresse
jaguar
jaillir
jambe
janvier
jardin
jauger
jaune
javelot
jetable
jeton
jeudi
jeunesse
joindre
joncher
jongler
joueur
jouissif
journal
jovial
joyau
joyeux
jubiler
jugement
junior
jupon
juriste
justice
juteux
juvénile
kayak
kimono
kiosque
label
labial
labourer
lacérer
lactose
lagune
laine
laisser
laitier
lambeau
lamelle
lampe
lanceur
langage
lanterne
lapin
largeur
larme
laurier
lavabo
lavoir
lecture
légal
léger
légume
lessive
lettre
levier
lexique
lézard
liasse
libérer
libre
licence
licorne
liège
lièvre
ligature
ligoter
ligue
limer
limite
limonade
limpide
linéaire
lingot
lionceau
liquide
lisière
lister
lithium
litige
littoral
livreur
logique
lointain
loisir
lombric
loterie
louer
lourd
loutre
louve
loyal
lubie
lucide
lucratif
lueur
lugubre
luisant
lumière
lunaire
lundi
luron
lutter
luxueux
machine
magasin
magenta
magique
maigre
maillon
maintien
mairie
maison
majorer
malaxer
maléfice
malheur
malice
mallette
mammouth
mandater
maniable
manquant
manteau
manuel
marathon
marbre
marchand
mardi
maritime
marqueur
marron
marteler
mascotte
massif
matériel
matière
matraque
maudire
maussade
mauve
maximal
méchant
méconnu
médaille
médecin
méditer
méduse
meilleur
mélange
mélodie
membre
mémoire
menacer
mener
menhir
mensonge
mentor
mercredi
mérite
merle
messager
mesure
métal
météore
méthode
métier
meuble
miauler
microbe
miette
mignon
migrer
milieu
million
mimique
mince
minéral
minimal
minorer
minute
miracle
miroiter
missile
mixte
mobile
moderne
moelleux
mondial
moniteur
monnaie
monotone
monstre
montagne
monument
moqueur
morceau
morsure
mortier
moteur
motif
mouche
moufle
moulin
mousson
mouton
mouvant
multiple
munition
muraille
murène
murmure
muscle
muséum
musicien
mutation
muter
mutuel
myriade
myrtille
mystère
mythique
nageur
nappe
narquois
narrer
natation
nation
nature
naufrage
nautique
navire
nébuleux
nectar
néfaste
négation
négliger
négocier
neige
nerveux
nettoyer
neurone
neutron
neveu
niche
nickel
nitrate
niveau
noble
nocif
nocturne
noirceur
noisette
nomade
nombreux
nommer
normatif
notable
notifier
notoire
nourrir
nouveau
novateur
novembre
novice
nuage
nuancer
nuire
nuisible
numéro
nuptial
nuque
nutritif
obéir
objectif
obliger
obscur
observer
obstacle
obtenir
obturer
occasion
occuper
océan
octobre
octroyer
octupler
oculaire
odeur
odorant
offenser
officier
offrir
ogive
oiseau
oisillon
olfactif
olivier
ombrage
omettre
onctueux
onduler
onéreux
onirique
opale
opaque
opérer
opinion
opportun
opprimer
opter
optique
orageux
orange
orbite
ordonner
oreille
organe
orgueil
orifice
ornement
orque
ortie
osciller
osmose
ossature
otarie
ouragan
ourson
outil
outrager
ouvrage
ovation
oxyde
oxygène
ozone
paisible
palace
palmarès
palourde
palper
panache
panda
pangolin
paniquer
panneau
panorama
pantalon
papaye
papier
papoter
papyrus
paradoxe
parcelle
paresse
parfumer
parler
parole
parrain
parsemer
partager
parure
parvenir
passion
pastèque
paternel
patience
patron
pavillon
pavoiser
payer
paysage
peigne
peintre
pelage
pélican
pelle
pelouse
peluche
pendule
pénétrer
pénible
pensif
pénurie
pépite
péplum
perdrix
perforer
période
permuter
perplexe
persil
perte
peser
pétale
petit
pétrir
peuple
pharaon
phobie
phoque
photon
phrase
physique
piano
pictural
pièce
pierre
pieuvre
pilote
pinceau
pipette
piquer
pirogue
piscine
piston
pivoter
pixel
pizza
placard
plafond
plaisir
planer
plaque
plastron
plateau
pleurer
plexus
pliage
plomb
plonger
pluie
plumage
pochette
poésie
poète
pointe
poirier
poisson
poivre
polaire
policier
pollen
polygone
pommade
pompier
ponctuel
pondérer
poney
portique
position
posséder
posture
potager
poteau
potion
pouce
poulain
poumon
pourpre
poussin
pouvoir
prairie
pratique
précieux
prédire
préfixe
prélude
prénom
présence
prétexte
prévoir
primitif
prince
prison
priver
problème
procéder
prodige
profond
progrès
proie
projeter
prologue
promener
propre
prospère
protéger
prouesse
proverbe
prudence
pruneau
psychose
public
puceron
puiser
pulpe
pulsar
punaise
punitif
pupitre
purifier
puzzle
pyramide
quasar
querelle
question
quiétude
quitter
quotient
racine
raconter
radieux
ragondin
raideur
raisin
ralentir
rallonge
ramasser
rapide
rasage
ratisser
ravager
ravin
rayonner
réactif
réagir
réaliser
réanimer
recevoir
réciter
réclamer
récolter
recruter
reculer
recycler
rédiger
redouter
refaire
réflexe
réformer
refrain
refuge
régalien
région
réglage
régulier
réitérer
rejeter
rejouer
relatif
relever
relief
remarque
remède
remise
remonter
remplir
remuer
renard
renfort
renifler
renoncer
rentrer
renvoi
replier
reporter
reprise
reptile
requin
réserve
résineux
résoudre
respect
rester
résultat
rétablir
retenir
réticule
retomber
retracer
réunion
réussir
revanche
revivre
révolte
révulsif
richesse
rideau
rieur
rigide
rigoler
rincer
riposter
risible
risque
rituel
rival
rivière
rocheux
romance
rompre
ronce
rondin
roseau
rosier
rotatif
rotor
rotule
rouge
rouille
rouleau
routine
royaume
ruban
rubis
ruche
ruelle
rugueux
ruiner
ruisseau
ruser
rustique
rythme
sabler
saboter
sabre
sacoche
safari
sagesse
saisir
salade
salive
salon
saluer
samedi
sanction
sanglier
sarcasme
sardine
saturer
saugrenu
saumon
sauter
sauvage
savant
savonner
scalpel
scandale
scélérat
scénario
sceptre
schéma
science
scinder
score
scrutin
sculpter
séance
sécable
sécher
secouer
sécréter
sédatif
séduire
seigneur
séjour
sélectif
semaine
sembler
semence
séminal
sénateur
sensible
sentence
séparer
séquence
serein
sergent
sérieux
serrure
sérum
service
sésame
sévir
sevrage
sextuple
sidéral
siècle
siéger
siffler
sigle
signal
silence
silicium
simple
sincère
sinistre
siphon
sirop
sismique
situer
skier
social
socle
sodium
soigneux
soldat
soleil
solitude
soluble
sombre
sommeil
somnoler
sonde
songeur
sonnette
sonore
sorcier
sortir
sosie
sottise
soucieux
soudure
souffle
soulever
soupape
source
soutirer
souvenir
spacieux
spatial
spécial
sphère
spiral
stable
station
sternum
stimulus
stipuler
strict
studieux
stupeur
styliste
sublime
substrat
subtil
subvenir
succès
sucre
suffixe
suggérer
suiveur
sulfate
superbe
supplier
surface
suricate
surmener
surprise
sursaut
survie
suspect
syllabe
symbole
symétrie
synapse
syntaxe
système
tabac
tablier
tactile
tailler
talent
talisman
talonner
tambour
tamiser
tangible
tapis
taquiner
tarder
tarif
tartine
tasse
tatami
tatouage
taupe
taureau
taxer
témoin
temporel
tenaille
tendre
teneur
tenir
tension
terminer
terne
terrible
tétine
texte
thème
théorie
thérapie
thorax
tibia
tiède
timide
tirelire
tiroir
tissu
titane
titre
tituber
toboggan
tolérant
tomate
tonique
tonneau
toponyme
torche
tordre
tornade
torpille
torrent
torse
tortue
totem
toucher
tournage
tousser
toxine
traction
trafic
tragique
trahir
train
trancher
travail
trèfle
tremper
trésor
treuil
triage
tribunal
tricoter
trilogie
triomphe
tripler
triturer
trivial
trombone
tronc
tropical
troupeau
tuile
tulipe
tumulte
tunnel
turbine
tuteur
tutoyer
tuyau
tympan
typhon
typique
tyran
ubuesque
ultime
ultrason
unanime
unifier
union
unique
unitaire
univers
uranium
urbain
urticant
usage
usine
usuel
usure
utile
utopie
vacarme
vaccin
vagabond
vague
vaillant
vaincre
vaisseau
valable
valise
vallon
valve
vampire
vanille
vapeur
varier
vaseux
vassal
vaste
vecteur
vedette
végétal
véhicule
veinard
véloce
vendredi
vénérer
venger
venimeux
ventouse
verdure
vérin
vernir
verrou
verser
vertu
veston
vétéran
vétuste
vexant
vexer
viaduc
viande
victoire
vidange
vidéo
vignette
vigueur
vilain
village
vinaigre
violon
vipère
virement
virtuose
virus
visage
viseur
vision
visqueux
visuel
vital
vitesse
viticole
vitrine
vivace
vivipare
vocation
voguer
voile
voisin
voiture
volaille
volcan
voltiger
volume
vorace
vortex
voter
vouloir
voyage
voyelle
wagon
xénon
yacht
zèbre
zénith
zeste
zoologie`.split("\n");

// node_modules/@scure/bip39/esm/wordlists/italian.js
var wordlist4 = `abaco
abbaglio
abbinato
abete
abisso
abolire
abrasivo
abrogato
accadere
accenno
accusato
acetone
achille
acido
acqua
acre
acrilico
acrobata
acuto
adagio
addebito
addome
adeguato
aderire
adipe
adottare
adulare
affabile
affetto
affisso
affranto
aforisma
afoso
africano
agave
agente
agevole
aggancio
agire
agitare
agonismo
agricolo
agrumeto
aguzzo
alabarda
alato
albatro
alberato
albo
albume
alce
alcolico
alettone
alfa
algebra
aliante
alibi
alimento
allagato
allegro
allievo
allodola
allusivo
almeno
alogeno
alpaca
alpestre
altalena
alterno
alticcio
altrove
alunno
alveolo
alzare
amalgama
amanita
amarena
ambito
ambrato
ameba
america
ametista
amico
ammasso
ammenda
ammirare
ammonito
amore
ampio
ampliare
amuleto
anacardo
anagrafe
analista
anarchia
anatra
anca
ancella
ancora
andare
andrea
anello
angelo
angolare
angusto
anima
annegare
annidato
anno
annuncio
anonimo
anticipo
anzi
apatico
apertura
apode
apparire
appetito
appoggio
approdo
appunto
aprile
arabica
arachide
aragosta
araldica
arancio
aratura
arazzo
arbitro
archivio
ardito
arenile
argento
argine
arguto
aria
armonia
arnese
arredato
arringa
arrosto
arsenico
arso
artefice
arzillo
asciutto
ascolto
asepsi
asettico
asfalto
asino
asola
aspirato
aspro
assaggio
asse
assoluto
assurdo
asta
astenuto
astice
astratto
atavico
ateismo
atomico
atono
attesa
attivare
attorno
attrito
attuale
ausilio
austria
autista
autonomo
autunno
avanzato
avere
avvenire
avviso
avvolgere
azione
azoto
azzimo
azzurro
babele
baccano
bacino
baco
badessa
badilata
bagnato
baita
balcone
baldo
balena
ballata
balzano
bambino
bandire
baraonda
barbaro
barca
baritono
barlume
barocco
basilico
basso
batosta
battuto
baule
bava
bavosa
becco
beffa
belgio
belva
benda
benevole
benigno
benzina
bere
berlina
beta
bibita
bici
bidone
bifido
biga
bilancia
bimbo
binocolo
biologo
bipede
bipolare
birbante
birra
biscotto
bisesto
bisnonno
bisonte
bisturi
bizzarro
blando
blatta
bollito
bonifico
bordo
bosco
botanico
bottino
bozzolo
braccio
bradipo
brama
branca
bravura
bretella
brevetto
brezza
briglia
brillante
brindare
broccolo
brodo
bronzina
brullo
bruno
bubbone
buca
budino
buffone
buio
bulbo
buono
burlone
burrasca
bussola
busta
cadetto
caduco
calamaro
calcolo
calesse
calibro
calmo
caloria
cambusa
camerata
camicia
cammino
camola
campale
canapa
candela
cane
canino
canotto
cantina
capace
capello
capitolo
capogiro
cappero
capra
capsula
carapace
carcassa
cardo
carisma
carovana
carretto
cartolina
casaccio
cascata
caserma
caso
cassone
castello
casuale
catasta
catena
catrame
cauto
cavillo
cedibile
cedrata
cefalo
celebre
cellulare
cena
cenone
centesimo
ceramica
cercare
certo
cerume
cervello
cesoia
cespo
ceto
chela
chiaro
chicca
chiedere
chimera
china
chirurgo
chitarra
ciao
ciclismo
cifrare
cigno
cilindro
ciottolo
circa
cirrosi
citrico
cittadino
ciuffo
civetta
civile
classico
clinica
cloro
cocco
codardo
codice
coerente
cognome
collare
colmato
colore
colposo
coltivato
colza
coma
cometa
commando
comodo
computer
comune
conciso
condurre
conferma
congelare
coniuge
connesso
conoscere
consumo
continuo
convegno
coperto
copione
coppia
copricapo
corazza
cordata
coricato
cornice
corolla
corpo
corredo
corsia
cortese
cosmico
costante
cottura
covato
cratere
cravatta
creato
credere
cremoso
crescita
creta
criceto
crinale
crisi
critico
croce
cronaca
crostata
cruciale
crusca
cucire
cuculo
cugino
cullato
cupola
curatore
cursore
curvo
cuscino
custode
dado
daino
dalmata
damerino
daniela
dannoso
danzare
datato
davanti
davvero
debutto
decennio
deciso
declino
decollo
decreto
dedicato
definito
deforme
degno
delegare
delfino
delirio
delta
demenza
denotato
dentro
deposito
derapata
derivare
deroga
descritto
deserto
desiderio
desumere
detersivo
devoto
diametro
dicembre
diedro
difeso
diffuso
digerire
digitale
diluvio
dinamico
dinnanzi
dipinto
diploma
dipolo
diradare
dire
dirotto
dirupo
disagio
discreto
disfare
disgelo
disposto
distanza
disumano
dito
divano
divelto
dividere
divorato
doblone
docente
doganale
dogma
dolce
domato
domenica
dominare
dondolo
dono
dormire
dote
dottore
dovuto
dozzina
drago
druido
dubbio
dubitare
ducale
duna
duomo
duplice
duraturo
ebano
eccesso
ecco
eclissi
economia
edera
edicola
edile
editoria
educare
egemonia
egli
egoismo
egregio
elaborato
elargire
elegante
elencato
eletto
elevare
elfico
elica
elmo
elsa
eluso
emanato
emblema
emesso
emiro
emotivo
emozione
empirico
emulo
endemico
enduro
energia
enfasi
enoteca
entrare
enzima
epatite
epilogo
episodio
epocale
eppure
equatore
erario
erba
erboso
erede
eremita
erigere
ermetico
eroe
erosivo
errante
esagono
esame
esanime
esaudire
esca
esempio
esercito
esibito
esigente
esistere
esito
esofago
esortato
esoso
espanso
espresso
essenza
esso
esteso
estimare
estonia
estroso
esultare
etilico
etnico
etrusco
etto
euclideo
europa
evaso
evidenza
evitato
evoluto
evviva
fabbrica
faccenda
fachiro
falco
famiglia
fanale
fanfara
fango
fantasma
fare
farfalla
farinoso
farmaco
fascia
fastoso
fasullo
faticare
fato
favoloso
febbre
fecola
fede
fegato
felpa
feltro
femmina
fendere
fenomeno
fermento
ferro
fertile
fessura
festivo
fetta
feudo
fiaba
fiducia
fifa
figurato
filo
finanza
finestra
finire
fiore
fiscale
fisico
fiume
flacone
flamenco
flebo
flemma
florido
fluente
fluoro
fobico
focaccia
focoso
foderato
foglio
folata
folclore
folgore
fondente
fonetico
fonia
fontana
forbito
forchetta
foresta
formica
fornaio
foro
fortezza
forzare
fosfato
fosso
fracasso
frana
frassino
fratello
freccetta
frenata
fresco
frigo
frollino
fronde
frugale
frutta
fucilata
fucsia
fuggente
fulmine
fulvo
fumante
fumetto
fumoso
fune
funzione
fuoco
furbo
furgone
furore
fuso
futile
gabbiano
gaffe
galateo
gallina
galoppo
gambero
gamma
garanzia
garbo
garofano
garzone
gasdotto
gasolio
gastrico
gatto
gaudio
gazebo
gazzella
geco
gelatina
gelso
gemello
gemmato
gene
genitore
gennaio
genotipo
gergo
ghepardo
ghiaccio
ghisa
giallo
gilda
ginepro
giocare
gioiello
giorno
giove
girato
girone
gittata
giudizio
giurato
giusto
globulo
glutine
gnomo
gobba
golf
gomito
gommone
gonfio
gonna
governo
gracile
grado
grafico
grammo
grande
grattare
gravoso
grazia
greca
gregge
grifone
grigio
grinza
grotta
gruppo
guadagno
guaio
guanto
guardare
gufo
guidare
ibernato
icona
identico
idillio
idolo
idra
idrico
idrogeno
igiene
ignaro
ignorato
ilare
illeso
illogico
illudere
imballo
imbevuto
imbocco
imbuto
immane
immerso
immolato
impacco
impeto
impiego
importo
impronta
inalare
inarcare
inattivo
incanto
incendio
inchino
incisivo
incluso
incontro
incrocio
incubo
indagine
india
indole
inedito
infatti
infilare
inflitto
ingaggio
ingegno
inglese
ingordo
ingrosso
innesco
inodore
inoltrare
inondato
insano
insetto
insieme
insonnia
insulina
intasato
intero
intonaco
intuito
inumidire
invalido
invece
invito
iperbole
ipnotico
ipotesi
ippica
iride
irlanda
ironico
irrigato
irrorare
isolato
isotopo
isterico
istituto
istrice
italia
iterare
labbro
labirinto
lacca
lacerato
lacrima
lacuna
laddove
lago
lampo
lancetta
lanterna
lardoso
larga
laringe
lastra
latenza
latino
lattuga
lavagna
lavoro
legale
leggero
lembo
lentezza
lenza
leone
lepre
lesivo
lessato
lesto
letterale
leva
levigato
libero
lido
lievito
lilla
limatura
limitare
limpido
lineare
lingua
liquido
lira
lirica
lisca
lite
litigio
livrea
locanda
lode
logica
lombare
londra
longevo
loquace
lorenzo
loto
lotteria
luce
lucidato
lumaca
luminoso
lungo
lupo
luppolo
lusinga
lusso
lutto
macabro
macchina
macero
macinato
madama
magico
maglia
magnete
magro
maiolica
malafede
malgrado
malinteso
malsano
malto
malumore
mana
mancia
mandorla
mangiare
manifesto
mannaro
manovra
mansarda
mantide
manubrio
mappa
maratona
marcire
maretta
marmo
marsupio
maschera
massaia
mastino
materasso
matricola
mattone
maturo
mazurca
meandro
meccanico
mecenate
medesimo
meditare
mega
melassa
melis
melodia
meninge
meno
mensola
mercurio
merenda
merlo
meschino
mese
messere
mestolo
metallo
metodo
mettere
miagolare
mica
micelio
michele
microbo
midollo
miele
migliore
milano
milite
mimosa
minerale
mini
minore
mirino
mirtillo
miscela
missiva
misto
misurare
mitezza
mitigare
mitra
mittente
mnemonico
modello
modifica
modulo
mogano
mogio
mole
molosso
monastero
monco
mondina
monetario
monile
monotono
monsone
montato
monviso
mora
mordere
morsicato
mostro
motivato
motosega
motto
movenza
movimento
mozzo
mucca
mucosa
muffa
mughetto
mugnaio
mulatto
mulinello
multiplo
mummia
munto
muovere
murale
musa
muscolo
musica
mutevole
muto
nababbo
nafta
nanometro
narciso
narice
narrato
nascere
nastrare
naturale
nautica
naviglio
nebulosa
necrosi
negativo
negozio
nemmeno
neofita
neretto
nervo
nessuno
nettuno
neutrale
neve
nevrotico
nicchia
ninfa
nitido
nobile
nocivo
nodo
nome
nomina
nordico
normale
norvegese
nostrano
notare
notizia
notturno
novella
nucleo
nulla
numero
nuovo
nutrire
nuvola
nuziale
oasi
obbedire
obbligo
obelisco
oblio
obolo
obsoleto
occasione
occhio
occidente
occorrere
occultare
ocra
oculato
odierno
odorare
offerta
offrire
offuscato
oggetto
oggi
ognuno
olandese
olfatto
oliato
oliva
ologramma
oltre
omaggio
ombelico
ombra
omega
omissione
ondoso
onere
onice
onnivoro
onorevole
onta
operato
opinione
opposto
oracolo
orafo
ordine
orecchino
orefice
orfano
organico
origine
orizzonte
orma
ormeggio
ornativo
orologio
orrendo
orribile
ortensia
ortica
orzata
orzo
osare
oscurare
osmosi
ospedale
ospite
ossa
ossidare
ostacolo
oste
otite
otre
ottagono
ottimo
ottobre
ovale
ovest
ovino
oviparo
ovocito
ovunque
ovviare
ozio
pacchetto
pace
pacifico
padella
padrone
paese
paga
pagina
palazzina
palesare
pallido
palo
palude
pandoro
pannello
paolo
paonazzo
paprica
parabola
parcella
parere
pargolo
pari
parlato
parola
partire
parvenza
parziale
passivo
pasticca
patacca
patologia
pattume
pavone
peccato
pedalare
pedonale
peggio
peloso
penare
pendice
penisola
pennuto
penombra
pensare
pentola
pepe
pepita
perbene
percorso
perdonato
perforare
pergamena
periodo
permesso
perno
perplesso
persuaso
pertugio
pervaso
pesatore
pesista
peso
pestifero
petalo
pettine
petulante
pezzo
piacere
pianta
piattino
piccino
picozza
piega
pietra
piffero
pigiama
pigolio
pigro
pila
pilifero
pillola
pilota
pimpante
pineta
pinna
pinolo
pioggia
piombo
piramide
piretico
pirite
pirolisi
pitone
pizzico
placebo
planare
plasma
platano
plenario
pochezza
poderoso
podismo
poesia
poggiare
polenta
poligono
pollice
polmonite
polpetta
polso
poltrona
polvere
pomice
pomodoro
ponte
popoloso
porfido
poroso
porpora
porre
portata
posa
positivo
possesso
postulato
potassio
potere
pranzo
prassi
pratica
precluso
predica
prefisso
pregiato
prelievo
premere
prenotare
preparato
presenza
pretesto
prevalso
prima
principe
privato
problema
procura
produrre
profumo
progetto
prolunga
promessa
pronome
proposta
proroga
proteso
prova
prudente
prugna
prurito
psiche
pubblico
pudica
pugilato
pugno
pulce
pulito
pulsante
puntare
pupazzo
pupilla
puro
quadro
qualcosa
quasi
querela
quota
raccolto
raddoppio
radicale
radunato
raffica
ragazzo
ragione
ragno
ramarro
ramingo
ramo
randagio
rantolare
rapato
rapina
rappreso
rasatura
raschiato
rasente
rassegna
rastrello
rata
ravveduto
reale
recepire
recinto
recluta
recondito
recupero
reddito
redimere
regalato
registro
regola
regresso
relazione
remare
remoto
renna
replica
reprimere
reputare
resa
residente
responso
restauro
rete
retina
retorica
rettifica
revocato
riassunto
ribadire
ribelle
ribrezzo
ricarica
ricco
ricevere
riciclato
ricordo
ricreduto
ridicolo
ridurre
rifasare
riflesso
riforma
rifugio
rigare
rigettato
righello
rilassato
rilevato
rimanere
rimbalzo
rimedio
rimorchio
rinascita
rincaro
rinforzo
rinnovo
rinomato
rinsavito
rintocco
rinuncia
rinvenire
riparato
ripetuto
ripieno
riportare
ripresa
ripulire
risata
rischio
riserva
risibile
riso
rispetto
ristoro
risultato
risvolto
ritardo
ritegno
ritmico
ritrovo
riunione
riva
riverso
rivincita
rivolto
rizoma
roba
robotico
robusto
roccia
roco
rodaggio
rodere
roditore
rogito
rollio
romantico
rompere
ronzio
rosolare
rospo
rotante
rotondo
rotula
rovescio
rubizzo
rubrica
ruga
rullino
rumine
rumoroso
ruolo
rupe
russare
rustico
sabato
sabbiare
sabotato
sagoma
salasso
saldatura
salgemma
salivare
salmone
salone
saltare
saluto
salvo
sapere
sapido
saporito
saraceno
sarcasmo
sarto
sassoso
satellite
satira
satollo
saturno
savana
savio
saziato
sbadiglio
sbalzo
sbancato
sbarra
sbattere
sbavare
sbendare
sbirciare
sbloccato
sbocciato
sbrinare
sbruffone
sbuffare
scabroso
scadenza
scala
scambiare
scandalo
scapola
scarso
scatenare
scavato
scelto
scenico
scettro
scheda
schiena
sciarpa
scienza
scindere
scippo
sciroppo
scivolo
sclerare
scodella
scolpito
scomparto
sconforto
scoprire
scorta
scossone
scozzese
scriba
scrollare
scrutinio
scuderia
scultore
scuola
scuro
scusare
sdebitare
sdoganare
seccatura
secondo
sedano
seggiola
segnalato
segregato
seguito
selciato
selettivo
sella
selvaggio
semaforo
sembrare
seme
seminato
sempre
senso
sentire
sepolto
sequenza
serata
serbato
sereno
serio
serpente
serraglio
servire
sestina
setola
settimana
sfacelo
sfaldare
sfamato
sfarzoso
sfaticato
sfera
sfida
sfilato
sfinge
sfocato
sfoderare
sfogo
sfoltire
sforzato
sfratto
sfruttato
sfuggito
sfumare
sfuso
sgabello
sgarbato
sgonfiare
sgorbio
sgrassato
sguardo
sibilo
siccome
sierra
sigla
signore
silenzio
sillaba
simbolo
simpatico
simulato
sinfonia
singolo
sinistro
sino
sintesi
sinusoide
sipario
sisma
sistole
situato
slitta
slogatura
sloveno
smarrito
smemorato
smentito
smeraldo
smilzo
smontare
smottato
smussato
snellire
snervato
snodo
sobbalzo
sobrio
soccorso
sociale
sodale
soffitto
sogno
soldato
solenne
solido
sollazzo
solo
solubile
solvente
somatico
somma
sonda
sonetto
sonnifero
sopire
soppeso
sopra
sorgere
sorpasso
sorriso
sorso
sorteggio
sorvolato
sospiro
sosta
sottile
spada
spalla
spargere
spatola
spavento
spazzola
specie
spedire
spegnere
spelatura
speranza
spessore
spettrale
spezzato
spia
spigoloso
spillato
spinoso
spirale
splendido
sportivo
sposo
spranga
sprecare
spronato
spruzzo
spuntino
squillo
sradicare
srotolato
stabile
stacco
staffa
stagnare
stampato
stantio
starnuto
stasera
statuto
stelo
steppa
sterzo
stiletto
stima
stirpe
stivale
stizzoso
stonato
storico
strappo
stregato
stridulo
strozzare
strutto
stuccare
stufo
stupendo
subentro
succoso
sudore
suggerito
sugo
sultano
suonare
superbo
supporto
surgelato
surrogato
sussurro
sutura
svagare
svedese
sveglio
svelare
svenuto
svezia
sviluppo
svista
svizzera
svolta
svuotare
tabacco
tabulato
tacciare
taciturno
tale
talismano
tampone
tannino
tara
tardivo
targato
tariffa
tarpare
tartaruga
tasto
tattico
taverna
tavolata
tazza
teca
tecnico
telefono
temerario
tempo
temuto
tendone
tenero
tensione
tentacolo
teorema
terme
terrazzo
terzetto
tesi
tesserato
testato
tetro
tettoia
tifare
tigella
timbro
tinto
tipico
tipografo
tiraggio
tiro
titanio
titolo
titubante
tizio
tizzone
toccare
tollerare
tolto
tombola
tomo
tonfo
tonsilla
topazio
topologia
toppa
torba
tornare
torrone
tortora
toscano
tossire
tostatura
totano
trabocco
trachea
trafila
tragedia
tralcio
tramonto
transito
trapano
trarre
trasloco
trattato
trave
treccia
tremolio
trespolo
tributo
tricheco
trifoglio
trillo
trincea
trio
tristezza
triturato
trivella
tromba
trono
troppo
trottola
trovare
truccato
tubatura
tuffato
tulipano
tumulto
tunisia
turbare
turchino
tuta
tutela
ubicato
uccello
uccisore
udire
uditivo
uffa
ufficio
uguale
ulisse
ultimato
umano
umile
umorismo
uncinetto
ungere
ungherese
unicorno
unificato
unisono
unitario
unte
uovo
upupa
uragano
urgenza
urlo
usanza
usato
uscito
usignolo
usuraio
utensile
utilizzo
utopia
vacante
vaccinato
vagabondo
vagliato
valanga
valgo
valico
valletta
valoroso
valutare
valvola
vampata
vangare
vanitoso
vano
vantaggio
vanvera
vapore
varano
varcato
variante
vasca
vedetta
vedova
veduto
vegetale
veicolo
velcro
velina
velluto
veloce
venato
vendemmia
vento
verace
verbale
vergogna
verifica
vero
verruca
verticale
vescica
vessillo
vestale
veterano
vetrina
vetusto
viandante
vibrante
vicenda
vichingo
vicinanza
vidimare
vigilia
vigneto
vigore
vile
villano
vimini
vincitore
viola
vipera
virgola
virologo
virulento
viscoso
visione
vispo
vissuto
visura
vita
vitello
vittima
vivanda
vivido
viziare
voce
voga
volatile
volere
volpe
voragine
vulcano
zampogna
zanna
zappato
zattera
zavorra
zefiro
zelante
zelo
zenzero
zerbino
zibetto
zinco
zircone
zitto
zolla
zotico
zucchero
zufolo
zulu
zuppa`.split("\n");

// node_modules/@scure/bip39/esm/wordlists/japanese.js
var wordlist5 = `あいこくしん
あいさつ
あいだ
あおぞら
あかちゃん
あきる
あけがた
あける
あこがれる
あさい
あさひ
あしあと
あじわう
あずかる
あずき
あそぶ
あたえる
あたためる
あたりまえ
あたる
あつい
あつかう
あっしゅく
あつまり
あつめる
あてな
あてはまる
あひる
あぶら
あぶる
あふれる
あまい
あまど
あまやかす
あまり
あみもの
あめりか
あやまる
あゆむ
あらいぐま
あらし
あらすじ
あらためる
あらゆる
あらわす
ありがとう
あわせる
あわてる
あんい
あんがい
あんこ
あんぜん
あんてい
あんない
あんまり
いいだす
いおん
いがい
いがく
いきおい
いきなり
いきもの
いきる
いくじ
いくぶん
いけばな
いけん
いこう
いこく
いこつ
いさましい
いさん
いしき
いじゅう
いじょう
いじわる
いずみ
いずれ
いせい
いせえび
いせかい
いせき
いぜん
いそうろう
いそがしい
いだい
いだく
いたずら
いたみ
いたりあ
いちおう
いちじ
いちど
いちば
いちぶ
いちりゅう
いつか
いっしゅん
いっせい
いっそう
いったん
いっち
いってい
いっぽう
いてざ
いてん
いどう
いとこ
いない
いなか
いねむり
いのち
いのる
いはつ
いばる
いはん
いびき
いひん
いふく
いへん
いほう
いみん
いもうと
いもたれ
いもり
いやがる
いやす
いよかん
いよく
いらい
いらすと
いりぐち
いりょう
いれい
いれもの
いれる
いろえんぴつ
いわい
いわう
いわかん
いわば
いわゆる
いんげんまめ
いんさつ
いんしょう
いんよう
うえき
うえる
うおざ
うがい
うかぶ
うかべる
うきわ
うくらいな
うくれれ
うけたまわる
うけつけ
うけとる
うけもつ
うける
うごかす
うごく
うこん
うさぎ
うしなう
うしろがみ
うすい
うすぎ
うすぐらい
うすめる
うせつ
うちあわせ
うちがわ
うちき
うちゅう
うっかり
うつくしい
うったえる
うつる
うどん
うなぎ
うなじ
うなずく
うなる
うねる
うのう
うぶげ
うぶごえ
うまれる
うめる
うもう
うやまう
うよく
うらがえす
うらぐち
うらない
うりあげ
うりきれ
うるさい
うれしい
うれゆき
うれる
うろこ
うわき
うわさ
うんこう
うんちん
うんてん
うんどう
えいえん
えいが
えいきょう
えいご
えいせい
えいぶん
えいよう
えいわ
えおり
えがお
えがく
えきたい
えくせる
えしゃく
えすて
えつらん
えのぐ
えほうまき
えほん
えまき
えもじ
えもの
えらい
えらぶ
えりあ
えんえん
えんかい
えんぎ
えんげき
えんしゅう
えんぜつ
えんそく
えんちょう
えんとつ
おいかける
おいこす
おいしい
おいつく
おうえん
おうさま
おうじ
おうせつ
おうたい
おうふく
おうべい
おうよう
おえる
おおい
おおう
おおどおり
おおや
おおよそ
おかえり
おかず
おがむ
おかわり
おぎなう
おきる
おくさま
おくじょう
おくりがな
おくる
おくれる
おこす
おこなう
おこる
おさえる
おさない
おさめる
おしいれ
おしえる
おじぎ
おじさん
おしゃれ
おそらく
おそわる
おたがい
おたく
おだやか
おちつく
おっと
おつり
おでかけ
おとしもの
おとなしい
おどり
おどろかす
おばさん
おまいり
おめでとう
おもいで
おもう
おもたい
おもちゃ
おやつ
おやゆび
およぼす
おらんだ
おろす
おんがく
おんけい
おんしゃ
おんせん
おんだん
おんちゅう
おんどけい
かあつ
かいが
がいき
がいけん
がいこう
かいさつ
かいしゃ
かいすいよく
かいぜん
かいぞうど
かいつう
かいてん
かいとう
かいふく
がいへき
かいほう
かいよう
がいらい
かいわ
かえる
かおり
かかえる
かがく
かがし
かがみ
かくご
かくとく
かざる
がぞう
かたい
かたち
がちょう
がっきゅう
がっこう
がっさん
がっしょう
かなざわし
かのう
がはく
かぶか
かほう
かほご
かまう
かまぼこ
かめれおん
かゆい
かようび
からい
かるい
かろう
かわく
かわら
がんか
かんけい
かんこう
かんしゃ
かんそう
かんたん
かんち
がんばる
きあい
きあつ
きいろ
ぎいん
きうい
きうん
きえる
きおう
きおく
きおち
きおん
きかい
きかく
きかんしゃ
ききて
きくばり
きくらげ
きけんせい
きこう
きこえる
きこく
きさい
きさく
きさま
きさらぎ
ぎじかがく
ぎしき
ぎじたいけん
ぎじにってい
ぎじゅつしゃ
きすう
きせい
きせき
きせつ
きそう
きぞく
きぞん
きたえる
きちょう
きつえん
ぎっちり
きつつき
きつね
きてい
きどう
きどく
きない
きなが
きなこ
きぬごし
きねん
きのう
きのした
きはく
きびしい
きひん
きふく
きぶん
きぼう
きほん
きまる
きみつ
きむずかしい
きめる
きもだめし
きもち
きもの
きゃく
きやく
ぎゅうにく
きよう
きょうりゅう
きらい
きらく
きりん
きれい
きれつ
きろく
ぎろん
きわめる
ぎんいろ
きんかくじ
きんじょ
きんようび
ぐあい
くいず
くうかん
くうき
くうぐん
くうこう
ぐうせい
くうそう
ぐうたら
くうふく
くうぼ
くかん
くきょう
くげん
ぐこう
くさい
くさき
くさばな
くさる
くしゃみ
くしょう
くすのき
くすりゆび
くせげ
くせん
ぐたいてき
くださる
くたびれる
くちこみ
くちさき
くつした
ぐっすり
くつろぐ
くとうてん
くどく
くなん
くねくね
くのう
くふう
くみあわせ
くみたてる
くめる
くやくしょ
くらす
くらべる
くるま
くれる
くろう
くわしい
ぐんかん
ぐんしょく
ぐんたい
ぐんて
けあな
けいかく
けいけん
けいこ
けいさつ
げいじゅつ
けいたい
げいのうじん
けいれき
けいろ
けおとす
けおりもの
げきか
げきげん
げきだん
げきちん
げきとつ
げきは
げきやく
げこう
げこくじょう
げざい
けさき
げざん
けしき
けしごむ
けしょう
げすと
けたば
けちゃっぷ
けちらす
けつあつ
けつい
けつえき
けっこん
けつじょ
けっせき
けってい
けつまつ
げつようび
げつれい
けつろん
げどく
けとばす
けとる
けなげ
けなす
けなみ
けぬき
げねつ
けねん
けはい
げひん
けぶかい
げぼく
けまり
けみかる
けむし
けむり
けもの
けらい
けろけろ
けわしい
けんい
けんえつ
けんお
けんか
げんき
けんげん
けんこう
けんさく
けんしゅう
けんすう
げんそう
けんちく
けんてい
けんとう
けんない
けんにん
げんぶつ
けんま
けんみん
けんめい
けんらん
けんり
こあくま
こいぬ
こいびと
ごうい
こうえん
こうおん
こうかん
ごうきゅう
ごうけい
こうこう
こうさい
こうじ
こうすい
ごうせい
こうそく
こうたい
こうちゃ
こうつう
こうてい
こうどう
こうない
こうはい
ごうほう
ごうまん
こうもく
こうりつ
こえる
こおり
ごかい
ごがつ
ごかん
こくご
こくさい
こくとう
こくない
こくはく
こぐま
こけい
こける
ここのか
こころ
こさめ
こしつ
こすう
こせい
こせき
こぜん
こそだて
こたい
こたえる
こたつ
こちょう
こっか
こつこつ
こつばん
こつぶ
こてい
こてん
ことがら
ことし
ことば
ことり
こなごな
こねこね
このまま
このみ
このよ
ごはん
こひつじ
こふう
こふん
こぼれる
ごまあぶら
こまかい
ごますり
こまつな
こまる
こむぎこ
こもじ
こもち
こもの
こもん
こやく
こやま
こゆう
こゆび
こよい
こよう
こりる
これくしょん
ころっけ
こわもて
こわれる
こんいん
こんかい
こんき
こんしゅう
こんすい
こんだて
こんとん
こんなん
こんびに
こんぽん
こんまけ
こんや
こんれい
こんわく
ざいえき
さいかい
さいきん
ざいげん
ざいこ
さいしょ
さいせい
ざいたく
ざいちゅう
さいてき
ざいりょう
さうな
さかいし
さがす
さかな
さかみち
さがる
さぎょう
さくし
さくひん
さくら
さこく
さこつ
さずかる
ざせき
さたん
さつえい
ざつおん
ざっか
ざつがく
さっきょく
ざっし
さつじん
ざっそう
さつたば
さつまいも
さてい
さといも
さとう
さとおや
さとし
さとる
さのう
さばく
さびしい
さべつ
さほう
さほど
さます
さみしい
さみだれ
さむけ
さめる
さやえんどう
さゆう
さよう
さよく
さらだ
ざるそば
さわやか
さわる
さんいん
さんか
さんきゃく
さんこう
さんさい
ざんしょ
さんすう
さんせい
さんそ
さんち
さんま
さんみ
さんらん
しあい
しあげ
しあさって
しあわせ
しいく
しいん
しうち
しえい
しおけ
しかい
しかく
じかん
しごと
しすう
じだい
したうけ
したぎ
したて
したみ
しちょう
しちりん
しっかり
しつじ
しつもん
してい
してき
してつ
じてん
じどう
しなぎれ
しなもの
しなん
しねま
しねん
しのぐ
しのぶ
しはい
しばかり
しはつ
しはらい
しはん
しひょう
しふく
じぶん
しへい
しほう
しほん
しまう
しまる
しみん
しむける
じむしょ
しめい
しめる
しもん
しゃいん
しゃうん
しゃおん
じゃがいも
しやくしょ
しゃくほう
しゃけん
しゃこ
しゃざい
しゃしん
しゃせん
しゃそう
しゃたい
しゃちょう
しゃっきん
じゃま
しゃりん
しゃれい
じゆう
じゅうしょ
しゅくはく
じゅしん
しゅっせき
しゅみ
しゅらば
じゅんばん
しょうかい
しょくたく
しょっけん
しょどう
しょもつ
しらせる
しらべる
しんか
しんこう
じんじゃ
しんせいじ
しんちく
しんりん
すあげ
すあし
すあな
ずあん
すいえい
すいか
すいとう
ずいぶん
すいようび
すうがく
すうじつ
すうせん
すおどり
すきま
すくう
すくない
すける
すごい
すこし
ずさん
すずしい
すすむ
すすめる
すっかり
ずっしり
ずっと
すてき
すてる
すねる
すのこ
すはだ
すばらしい
ずひょう
ずぶぬれ
すぶり
すふれ
すべて
すべる
ずほう
すぼん
すまい
すめし
すもう
すやき
すらすら
するめ
すれちがう
すろっと
すわる
すんぜん
すんぽう
せあぶら
せいかつ
せいげん
せいじ
せいよう
せおう
せかいかん
せきにん
せきむ
せきゆ
せきらんうん
せけん
せこう
せすじ
せたい
せたけ
せっかく
せっきゃく
ぜっく
せっけん
せっこつ
せっさたくま
せつぞく
せつだん
せつでん
せっぱん
せつび
せつぶん
せつめい
せつりつ
せなか
せのび
せはば
せびろ
せぼね
せまい
せまる
せめる
せもたれ
せりふ
ぜんあく
せんい
せんえい
せんか
せんきょ
せんく
せんげん
ぜんご
せんさい
せんしゅ
せんすい
せんせい
せんぞ
せんたく
せんちょう
せんてい
せんとう
せんぬき
せんねん
せんぱい
ぜんぶ
ぜんぽう
せんむ
せんめんじょ
せんもん
せんやく
せんゆう
せんよう
ぜんら
ぜんりゃく
せんれい
せんろ
そあく
そいとげる
そいね
そうがんきょう
そうき
そうご
そうしん
そうだん
そうなん
そうび
そうめん
そうり
そえもの
そえん
そがい
そげき
そこう
そこそこ
そざい
そしな
そせい
そせん
そそぐ
そだてる
そつう
そつえん
そっかん
そつぎょう
そっけつ
そっこう
そっせん
そっと
そとがわ
そとづら
そなえる
そなた
そふぼ
そぼく
そぼろ
そまつ
そまる
そむく
そむりえ
そめる
そもそも
そよかぜ
そらまめ
そろう
そんかい
そんけい
そんざい
そんしつ
そんぞく
そんちょう
ぞんび
ぞんぶん
そんみん
たあい
たいいん
たいうん
たいえき
たいおう
だいがく
たいき
たいぐう
たいけん
たいこ
たいざい
だいじょうぶ
だいすき
たいせつ
たいそう
だいたい
たいちょう
たいてい
だいどころ
たいない
たいねつ
たいのう
たいはん
だいひょう
たいふう
たいへん
たいほ
たいまつばな
たいみんぐ
たいむ
たいめん
たいやき
たいよう
たいら
たいりょく
たいる
たいわん
たうえ
たえる
たおす
たおる
たおれる
たかい
たかね
たきび
たくさん
たこく
たこやき
たさい
たしざん
だじゃれ
たすける
たずさわる
たそがれ
たたかう
たたく
ただしい
たたみ
たちばな
だっかい
だっきゃく
だっこ
だっしゅつ
だったい
たてる
たとえる
たなばた
たにん
たぬき
たのしみ
たはつ
たぶん
たべる
たぼう
たまご
たまる
だむる
ためいき
ためす
ためる
たもつ
たやすい
たよる
たらす
たりきほんがん
たりょう
たりる
たると
たれる
たれんと
たろっと
たわむれる
だんあつ
たんい
たんおん
たんか
たんき
たんけん
たんご
たんさん
たんじょうび
だんせい
たんそく
たんたい
だんち
たんてい
たんとう
だんな
たんにん
だんねつ
たんのう
たんぴん
だんぼう
たんまつ
たんめい
だんれつ
だんろ
だんわ
ちあい
ちあん
ちいき
ちいさい
ちえん
ちかい
ちから
ちきゅう
ちきん
ちけいず
ちけん
ちこく
ちさい
ちしき
ちしりょう
ちせい
ちそう
ちたい
ちたん
ちちおや
ちつじょ
ちてき
ちてん
ちぬき
ちぬり
ちのう
ちひょう
ちへいせん
ちほう
ちまた
ちみつ
ちみどろ
ちめいど
ちゃんこなべ
ちゅうい
ちゆりょく
ちょうし
ちょさくけん
ちらし
ちらみ
ちりがみ
ちりょう
ちるど
ちわわ
ちんたい
ちんもく
ついか
ついたち
つうか
つうじょう
つうはん
つうわ
つかう
つかれる
つくね
つくる
つけね
つける
つごう
つたえる
つづく
つつじ
つつむ
つとめる
つながる
つなみ
つねづね
つのる
つぶす
つまらない
つまる
つみき
つめたい
つもり
つもる
つよい
つるぼ
つるみく
つわもの
つわり
てあし
てあて
てあみ
ていおん
ていか
ていき
ていけい
ていこく
ていさつ
ていし
ていせい
ていたい
ていど
ていねい
ていひょう
ていへん
ていぼう
てうち
ておくれ
てきとう
てくび
でこぼこ
てさぎょう
てさげ
てすり
てそう
てちがい
てちょう
てつがく
てつづき
でっぱ
てつぼう
てつや
でぬかえ
てぬき
てぬぐい
てのひら
てはい
てぶくろ
てふだ
てほどき
てほん
てまえ
てまきずし
てみじか
てみやげ
てらす
てれび
てわけ
てわたし
でんあつ
てんいん
てんかい
てんき
てんぐ
てんけん
てんごく
てんさい
てんし
てんすう
でんち
てんてき
てんとう
てんない
てんぷら
てんぼうだい
てんめつ
てんらんかい
でんりょく
でんわ
どあい
といれ
どうかん
とうきゅう
どうぐ
とうし
とうむぎ
とおい
とおか
とおく
とおす
とおる
とかい
とかす
ときおり
ときどき
とくい
とくしゅう
とくてん
とくに
とくべつ
とけい
とける
とこや
とさか
としょかん
とそう
とたん
とちゅう
とっきゅう
とっくん
とつぜん
とつにゅう
とどける
ととのえる
とない
となえる
となり
とのさま
とばす
どぶがわ
とほう
とまる
とめる
ともだち
ともる
どようび
とらえる
とんかつ
どんぶり
ないかく
ないこう
ないしょ
ないす
ないせん
ないそう
なおす
ながい
なくす
なげる
なこうど
なさけ
なたでここ
なっとう
なつやすみ
ななおし
なにごと
なにもの
なにわ
なのか
なふだ
なまいき
なまえ
なまみ
なみだ
なめらか
なめる
なやむ
ならう
ならび
ならぶ
なれる
なわとび
なわばり
にあう
にいがた
にうけ
におい
にかい
にがて
にきび
にくしみ
にくまん
にげる
にさんかたんそ
にしき
にせもの
にちじょう
にちようび
にっか
にっき
にっけい
にっこう
にっさん
にっしょく
にっすう
にっせき
にってい
になう
にほん
にまめ
にもつ
にやり
にゅういん
にりんしゃ
にわとり
にんい
にんか
にんき
にんげん
にんしき
にんずう
にんそう
にんたい
にんち
にんてい
にんにく
にんぷ
にんまり
にんむ
にんめい
にんよう
ぬいくぎ
ぬかす
ぬぐいとる
ぬぐう
ぬくもり
ぬすむ
ぬまえび
ぬめり
ぬらす
ぬんちゃく
ねあげ
ねいき
ねいる
ねいろ
ねぐせ
ねくたい
ねくら
ねこぜ
ねこむ
ねさげ
ねすごす
ねそべる
ねだん
ねつい
ねっしん
ねつぞう
ねったいぎょ
ねぶそく
ねふだ
ねぼう
ねほりはほり
ねまき
ねまわし
ねみみ
ねむい
ねむたい
ねもと
ねらう
ねわざ
ねんいり
ねんおし
ねんかん
ねんきん
ねんぐ
ねんざ
ねんし
ねんちゃく
ねんど
ねんぴ
ねんぶつ
ねんまつ
ねんりょう
ねんれい
のいず
のおづま
のがす
のきなみ
のこぎり
のこす
のこる
のせる
のぞく
のぞむ
のたまう
のちほど
のっく
のばす
のはら
のべる
のぼる
のみもの
のやま
のらいぬ
のらねこ
のりもの
のりゆき
のれん
のんき
ばあい
はあく
ばあさん
ばいか
ばいく
はいけん
はいご
はいしん
はいすい
はいせん
はいそう
はいち
ばいばい
はいれつ
はえる
はおる
はかい
ばかり
はかる
はくしゅ
はけん
はこぶ
はさみ
はさん
はしご
ばしょ
はしる
はせる
ぱそこん
はそん
はたん
はちみつ
はつおん
はっかく
はづき
はっきり
はっくつ
はっけん
はっこう
はっさん
はっしん
はったつ
はっちゅう
はってん
はっぴょう
はっぽう
はなす
はなび
はにかむ
はぶらし
はみがき
はむかう
はめつ
はやい
はやし
はらう
はろうぃん
はわい
はんい
はんえい
はんおん
はんかく
はんきょう
ばんぐみ
はんこ
はんしゃ
はんすう
はんだん
ぱんち
ぱんつ
はんてい
はんとし
はんのう
はんぱ
はんぶん
はんぺん
はんぼうき
はんめい
はんらん
はんろん
ひいき
ひうん
ひえる
ひかく
ひかり
ひかる
ひかん
ひくい
ひけつ
ひこうき
ひこく
ひさい
ひさしぶり
ひさん
びじゅつかん
ひしょ
ひそか
ひそむ
ひたむき
ひだり
ひたる
ひつぎ
ひっこし
ひっし
ひつじゅひん
ひっす
ひつぜん
ぴったり
ぴっちり
ひつよう
ひてい
ひとごみ
ひなまつり
ひなん
ひねる
ひはん
ひびく
ひひょう
ひほう
ひまわり
ひまん
ひみつ
ひめい
ひめじし
ひやけ
ひやす
ひよう
びょうき
ひらがな
ひらく
ひりつ
ひりょう
ひるま
ひるやすみ
ひれい
ひろい
ひろう
ひろき
ひろゆき
ひんかく
ひんけつ
ひんこん
ひんしゅ
ひんそう
ぴんち
ひんぱん
びんぼう
ふあん
ふいうち
ふうけい
ふうせん
ぷうたろう
ふうとう
ふうふ
ふえる
ふおん
ふかい
ふきん
ふくざつ
ふくぶくろ
ふこう
ふさい
ふしぎ
ふじみ
ふすま
ふせい
ふせぐ
ふそく
ぶたにく
ふたん
ふちょう
ふつう
ふつか
ふっかつ
ふっき
ふっこく
ぶどう
ふとる
ふとん
ふのう
ふはい
ふひょう
ふへん
ふまん
ふみん
ふめつ
ふめん
ふよう
ふりこ
ふりる
ふるい
ふんいき
ぶんがく
ぶんぐ
ふんしつ
ぶんせき
ふんそう
ぶんぽう
へいあん
へいおん
へいがい
へいき
へいげん
へいこう
へいさ
へいしゃ
へいせつ
へいそ
へいたく
へいてん
へいねつ
へいわ
へきが
へこむ
べにいろ
べにしょうが
へらす
へんかん
べんきょう
べんごし
へんさい
へんたい
べんり
ほあん
ほいく
ぼうぎょ
ほうこく
ほうそう
ほうほう
ほうもん
ほうりつ
ほえる
ほおん
ほかん
ほきょう
ぼきん
ほくろ
ほけつ
ほけん
ほこう
ほこる
ほしい
ほしつ
ほしゅ
ほしょう
ほせい
ほそい
ほそく
ほたて
ほたる
ぽちぶくろ
ほっきょく
ほっさ
ほったん
ほとんど
ほめる
ほんい
ほんき
ほんけ
ほんしつ
ほんやく
まいにち
まかい
まかせる
まがる
まける
まこと
まさつ
まじめ
ますく
まぜる
まつり
まとめ
まなぶ
まぬけ
まねく
まほう
まもる
まゆげ
まよう
まろやか
まわす
まわり
まわる
まんが
まんきつ
まんぞく
まんなか
みいら
みうち
みえる
みがく
みかた
みかん
みけん
みこん
みじかい
みすい
みすえる
みせる
みっか
みつかる
みつける
みてい
みとめる
みなと
みなみかさい
みねらる
みのう
みのがす
みほん
みもと
みやげ
みらい
みりょく
みわく
みんか
みんぞく
むいか
むえき
むえん
むかい
むかう
むかえ
むかし
むぎちゃ
むける
むげん
むさぼる
むしあつい
むしば
むじゅん
むしろ
むすう
むすこ
むすぶ
むすめ
むせる
むせん
むちゅう
むなしい
むのう
むやみ
むよう
むらさき
むりょう
むろん
めいあん
めいうん
めいえん
めいかく
めいきょく
めいさい
めいし
めいそう
めいぶつ
めいれい
めいわく
めぐまれる
めざす
めした
めずらしい
めだつ
めまい
めやす
めんきょ
めんせき
めんどう
もうしあげる
もうどうけん
もえる
もくし
もくてき
もくようび
もちろん
もどる
もらう
もんく
もんだい
やおや
やける
やさい
やさしい
やすい
やすたろう
やすみ
やせる
やそう
やたい
やちん
やっと
やっぱり
やぶる
やめる
ややこしい
やよい
やわらかい
ゆうき
ゆうびんきょく
ゆうべ
ゆうめい
ゆけつ
ゆしゅつ
ゆせん
ゆそう
ゆたか
ゆちゃく
ゆでる
ゆにゅう
ゆびわ
ゆらい
ゆれる
ようい
ようか
ようきゅう
ようじ
ようす
ようちえん
よかぜ
よかん
よきん
よくせい
よくぼう
よけい
よごれる
よさん
よしゅう
よそう
よそく
よっか
よてい
よどがわく
よねつ
よやく
よゆう
よろこぶ
よろしい
らいう
らくがき
らくご
らくさつ
らくだ
らしんばん
らせん
らぞく
らたい
らっか
られつ
りえき
りかい
りきさく
りきせつ
りくぐん
りくつ
りけん
りこう
りせい
りそう
りそく
りてん
りねん
りゆう
りゅうがく
りよう
りょうり
りょかん
りょくちゃ
りょこう
りりく
りれき
りろん
りんご
るいけい
るいさい
るいじ
るいせき
るすばん
るりがわら
れいかん
れいぎ
れいせい
れいぞうこ
れいとう
れいぼう
れきし
れきだい
れんあい
れんけい
れんこん
れんさい
れんしゅう
れんぞく
れんらく
ろうか
ろうご
ろうじん
ろうそく
ろくが
ろこつ
ろじうら
ろしゅつ
ろせん
ろてん
ろめん
ろれつ
ろんぎ
ろんぱ
ろんぶん
ろんり
わかす
わかめ
わかやま
わかれる
わしつ
わじまし
わすれもの
わらう
われる`.split("\n");

// node_modules/@scure/bip39/esm/wordlists/korean.js
var wordlist6 = `가격
가끔
가난
가능
가득
가르침
가뭄
가방
가상
가슴
가운데
가을
가이드
가입
가장
가정
가족
가죽
각오
각자
간격
간부
간섭
간장
간접
간판
갈등
갈비
갈색
갈증
감각
감기
감소
감수성
감자
감정
갑자기
강남
강당
강도
강력히
강변
강북
강사
강수량
강아지
강원도
강의
강제
강조
같이
개구리
개나리
개방
개별
개선
개성
개인
객관적
거실
거액
거울
거짓
거품
걱정
건강
건물
건설
건조
건축
걸음
검사
검토
게시판
게임
겨울
견해
결과
결국
결론
결석
결승
결심
결정
결혼
경계
경고
경기
경력
경복궁
경비
경상도
경영
경우
경쟁
경제
경주
경찰
경치
경향
경험
계곡
계단
계란
계산
계속
계약
계절
계층
계획
고객
고구려
고궁
고급
고등학생
고무신
고민
고양이
고장
고전
고집
고춧가루
고통
고향
곡식
골목
골짜기
골프
공간
공개
공격
공군
공급
공기
공동
공무원
공부
공사
공식
공업
공연
공원
공장
공짜
공책
공통
공포
공항
공휴일
과목
과일
과장
과정
과학
관객
관계
관광
관념
관람
관련
관리
관습
관심
관점
관찰
광경
광고
광장
광주
괴로움
굉장히
교과서
교문
교복
교실
교양
교육
교장
교직
교통
교환
교훈
구경
구름
구멍
구별
구분
구석
구성
구속
구역
구입
구청
구체적
국가
국기
국내
국립
국물
국민
국수
국어
국왕
국적
국제
국회
군대
군사
군인
궁극적
권리
권위
권투
귀국
귀신
규정
규칙
균형
그날
그냥
그늘
그러나
그룹
그릇
그림
그제서야
그토록
극복
극히
근거
근교
근래
근로
근무
근본
근원
근육
근처
글씨
글자
금강산
금고
금년
금메달
금액
금연
금요일
금지
긍정적
기간
기관
기념
기능
기독교
기둥
기록
기름
기법
기본
기분
기쁨
기숙사
기술
기억
기업
기온
기운
기원
기적
기준
기침
기혼
기획
긴급
긴장
길이
김밥
김치
김포공항
깍두기
깜빡
깨달음
깨소금
껍질
꼭대기
꽃잎
나들이
나란히
나머지
나물
나침반
나흘
낙엽
난방
날개
날씨
날짜
남녀
남대문
남매
남산
남자
남편
남학생
낭비
낱말
내년
내용
내일
냄비
냄새
냇물
냉동
냉면
냉방
냉장고
넥타이
넷째
노동
노란색
노력
노인
녹음
녹차
녹화
논리
논문
논쟁
놀이
농구
농담
농민
농부
농업
농장
농촌
높이
눈동자
눈물
눈썹
뉴욕
느낌
늑대
능동적
능력
다방
다양성
다음
다이어트
다행
단계
단골
단독
단맛
단순
단어
단위
단점
단체
단추
단편
단풍
달걀
달러
달력
달리
닭고기
담당
담배
담요
담임
답변
답장
당근
당분간
당연히
당장
대규모
대낮
대단히
대답
대도시
대략
대량
대륙
대문
대부분
대신
대응
대장
대전
대접
대중
대책
대출
대충
대통령
대학
대한민국
대합실
대형
덩어리
데이트
도대체
도덕
도둑
도망
도서관
도심
도움
도입
도자기
도저히
도전
도중
도착
독감
독립
독서
독일
독창적
동화책
뒷모습
뒷산
딸아이
마누라
마늘
마당
마라톤
마련
마무리
마사지
마약
마요네즈
마을
마음
마이크
마중
마지막
마찬가지
마찰
마흔
막걸리
막내
막상
만남
만두
만세
만약
만일
만점
만족
만화
많이
말기
말씀
말투
맘대로
망원경
매년
매달
매력
매번
매스컴
매일
매장
맥주
먹이
먼저
먼지
멀리
메일
며느리
며칠
면담
멸치
명단
명령
명예
명의
명절
명칭
명함
모금
모니터
모델
모든
모범
모습
모양
모임
모조리
모집
모퉁이
목걸이
목록
목사
목소리
목숨
목적
목표
몰래
몸매
몸무게
몸살
몸속
몸짓
몸통
몹시
무관심
무궁화
무더위
무덤
무릎
무슨
무엇
무역
무용
무조건
무지개
무척
문구
문득
문법
문서
문제
문학
문화
물가
물건
물결
물고기
물론
물리학
물음
물질
물체
미국
미디어
미사일
미술
미역
미용실
미움
미인
미팅
미혼
민간
민족
민주
믿음
밀가루
밀리미터
밑바닥
바가지
바구니
바나나
바늘
바닥
바닷가
바람
바이러스
바탕
박물관
박사
박수
반대
반드시
반말
반발
반성
반응
반장
반죽
반지
반찬
받침
발가락
발걸음
발견
발달
발레
발목
발바닥
발생
발음
발자국
발전
발톱
발표
밤하늘
밥그릇
밥맛
밥상
밥솥
방금
방면
방문
방바닥
방법
방송
방식
방안
방울
방지
방학
방해
방향
배경
배꼽
배달
배드민턴
백두산
백색
백성
백인
백제
백화점
버릇
버섯
버튼
번개
번역
번지
번호
벌금
벌레
벌써
범위
범인
범죄
법률
법원
법적
법칙
베이징
벨트
변경
변동
변명
변신
변호사
변화
별도
별명
별일
병실
병아리
병원
보관
보너스
보라색
보람
보름
보상
보안
보자기
보장
보전
보존
보통
보편적
보험
복도
복사
복숭아
복습
볶음
본격적
본래
본부
본사
본성
본인
본질
볼펜
봉사
봉지
봉투
부근
부끄러움
부담
부동산
부문
부분
부산
부상
부엌
부인
부작용
부장
부정
부족
부지런히
부친
부탁
부품
부회장
북부
북한
분노
분량
분리
분명
분석
분야
분위기
분필
분홍색
불고기
불과
불교
불꽃
불만
불법
불빛
불안
불이익
불행
브랜드
비극
비난
비닐
비둘기
비디오
비로소
비만
비명
비밀
비바람
비빔밥
비상
비용
비율
비중
비타민
비판
빌딩
빗물
빗방울
빗줄기
빛깔
빨간색
빨래
빨리
사건
사계절
사나이
사냥
사람
사랑
사립
사모님
사물
사방
사상
사생활
사설
사슴
사실
사업
사용
사월
사장
사전
사진
사촌
사춘기
사탕
사투리
사흘
산길
산부인과
산업
산책
살림
살인
살짝
삼계탕
삼국
삼십
삼월
삼촌
상관
상금
상대
상류
상반기
상상
상식
상업
상인
상자
상점
상처
상추
상태
상표
상품
상황
새벽
색깔
색연필
생각
생명
생물
생방송
생산
생선
생신
생일
생활
서랍
서른
서명
서민
서비스
서양
서울
서적
서점
서쪽
서클
석사
석유
선거
선물
선배
선생
선수
선원
선장
선전
선택
선풍기
설거지
설날
설렁탕
설명
설문
설사
설악산
설치
설탕
섭씨
성공
성당
성명
성별
성인
성장
성적
성질
성함
세금
세미나
세상
세월
세종대왕
세탁
센터
센티미터
셋째
소규모
소극적
소금
소나기
소년
소득
소망
소문
소설
소속
소아과
소용
소원
소음
소중히
소지품
소질
소풍
소형
속담
속도
속옷
손가락
손길
손녀
손님
손등
손목
손뼉
손실
손질
손톱
손해
솔직히
솜씨
송아지
송이
송편
쇠고기
쇼핑
수건
수년
수단
수돗물
수동적
수면
수명
수박
수상
수석
수술
수시로
수업
수염
수영
수입
수준
수집
수출
수컷
수필
수학
수험생
수화기
숙녀
숙소
숙제
순간
순서
순수
순식간
순위
숟가락
술병
술집
숫자
스님
스물
스스로
스승
스웨터
스위치
스케이트
스튜디오
스트레스
스포츠
슬쩍
슬픔
습관
습기
승객
승리
승부
승용차
승진
시각
시간
시골
시금치
시나리오
시댁
시리즈
시멘트
시민
시부모
시선
시설
시스템
시아버지
시어머니
시월
시인
시일
시작
시장
시절
시점
시중
시즌
시집
시청
시합
시험
식구
식기
식당
식량
식료품
식물
식빵
식사
식생활
식초
식탁
식품
신고
신규
신념
신문
신발
신비
신사
신세
신용
신제품
신청
신체
신화
실감
실내
실력
실례
실망
실수
실습
실시
실장
실정
실질적
실천
실체
실컷
실태
실패
실험
실현
심리
심부름
심사
심장
심정
심판
쌍둥이
씨름
씨앗
아가씨
아나운서
아드님
아들
아쉬움
아스팔트
아시아
아울러
아저씨
아줌마
아직
아침
아파트
아프리카
아픔
아홉
아흔
악기
악몽
악수
안개
안경
안과
안내
안녕
안동
안방
안부
안주
알루미늄
알코올
암시
암컷
압력
앞날
앞문
애인
애정
액수
앨범
야간
야단
야옹
약간
약국
약속
약수
약점
약품
약혼녀
양념
양력
양말
양배추
양주
양파
어둠
어려움
어른
어젯밤
어쨌든
어쩌다가
어쩐지
언니
언덕
언론
언어
얼굴
얼른
얼음
얼핏
엄마
업무
업종
업체
엉덩이
엉망
엉터리
엊그제
에너지
에어컨
엔진
여건
여고생
여관
여군
여권
여대생
여덟
여동생
여든
여론
여름
여섯
여성
여왕
여인
여전히
여직원
여학생
여행
역사
역시
역할
연결
연구
연극
연기
연락
연설
연세
연속
연습
연애
연예인
연인
연장
연주
연출
연필
연합
연휴
열기
열매
열쇠
열심히
열정
열차
열흘
염려
엽서
영국
영남
영상
영양
영역
영웅
영원히
영하
영향
영혼
영화
옆구리
옆방
옆집
예감
예금
예방
예산
예상
예선
예술
예습
예식장
예약
예전
예절
예정
예컨대
옛날
오늘
오락
오랫동안
오렌지
오로지
오른발
오븐
오십
오염
오월
오전
오직
오징어
오페라
오피스텔
오히려
옥상
옥수수
온갖
온라인
온몸
온종일
온통
올가을
올림픽
올해
옷차림
와이셔츠
와인
완성
완전
왕비
왕자
왜냐하면
왠지
외갓집
외국
외로움
외삼촌
외출
외침
외할머니
왼발
왼손
왼쪽
요금
요일
요즘
요청
용기
용서
용어
우산
우선
우승
우연히
우정
우체국
우편
운동
운명
운반
운전
운행
울산
울음
움직임
웃어른
웃음
워낙
원고
원래
원서
원숭이
원인
원장
원피스
월급
월드컵
월세
월요일
웨이터
위반
위법
위성
위원
위험
위협
윗사람
유난히
유럽
유명
유물
유산
유적
유치원
유학
유행
유형
육군
육상
육십
육체
은행
음력
음료
음반
음성
음식
음악
음주
의견
의논
의문
의복
의식
의심
의외로
의욕
의원
의학
이것
이곳
이념
이놈
이달
이대로
이동
이렇게
이력서
이론적
이름
이민
이발소
이별
이불
이빨
이상
이성
이슬
이야기
이용
이웃
이월
이윽고
이익
이전
이중
이튿날
이틀
이혼
인간
인격
인공
인구
인근
인기
인도
인류
인물
인생
인쇄
인연
인원
인재
인종
인천
인체
인터넷
인하
인형
일곱
일기
일단
일대
일등
일반
일본
일부
일상
일생
일손
일요일
일월
일정
일종
일주일
일찍
일체
일치
일행
일회용
임금
임무
입대
입력
입맛
입사
입술
입시
입원
입장
입학
자가용
자격
자극
자동
자랑
자부심
자식
자신
자연
자원
자율
자전거
자정
자존심
자판
작가
작년
작성
작업
작용
작은딸
작품
잔디
잔뜩
잔치
잘못
잠깐
잠수함
잠시
잠옷
잠자리
잡지
장관
장군
장기간
장래
장례
장르
장마
장면
장모
장미
장비
장사
장소
장식
장애인
장인
장점
장차
장학금
재능
재빨리
재산
재생
재작년
재정
재채기
재판
재학
재활용
저것
저고리
저곳
저녁
저런
저렇게
저번
저울
저절로
저축
적극
적당히
적성
적용
적응
전개
전공
전기
전달
전라도
전망
전문
전반
전부
전세
전시
전용
전자
전쟁
전주
전철
전체
전통
전혀
전후
절대
절망
절반
절약
절차
점검
점수
점심
점원
점점
점차
접근
접시
접촉
젓가락
정거장
정도
정류장
정리
정말
정면
정문
정반대
정보
정부
정비
정상
정성
정오
정원
정장
정지
정치
정확히
제공
제과점
제대로
제목
제발
제법
제삿날
제안
제일
제작
제주도
제출
제품
제한
조각
조건
조금
조깅
조명
조미료
조상
조선
조용히
조절
조정
조직
존댓말
존재
졸업
졸음
종교
종로
종류
종소리
종업원
종종
종합
좌석
죄인
주관적
주름
주말
주머니
주먹
주문
주민
주방
주변
주식
주인
주일
주장
주전자
주택
준비
줄거리
줄기
줄무늬
중간
중계방송
중국
중년
중단
중독
중반
중부
중세
중소기업
중순
중앙
중요
중학교
즉석
즉시
즐거움
증가
증거
증권
증상
증세
지각
지갑
지경
지극히
지금
지급
지능
지름길
지리산
지방
지붕
지식
지역
지우개
지원
지적
지점
지진
지출
직선
직업
직원
직장
진급
진동
진로
진료
진리
진짜
진찰
진출
진통
진행
질문
질병
질서
짐작
집단
집안
집중
짜증
찌꺼기
차남
차라리
차량
차림
차별
차선
차츰
착각
찬물
찬성
참가
참기름
참새
참석
참여
참외
참조
찻잔
창가
창고
창구
창문
창밖
창작
창조
채널
채점
책가방
책방
책상
책임
챔피언
처벌
처음
천국
천둥
천장
천재
천천히
철도
철저히
철학
첫날
첫째
청년
청바지
청소
청춘
체계
체력
체온
체육
체중
체험
초등학생
초반
초밥
초상화
초순
초여름
초원
초저녁
초점
초청
초콜릿
촛불
총각
총리
총장
촬영
최근
최상
최선
최신
최악
최종
추석
추억
추진
추천
추측
축구
축소
축제
축하
출근
출발
출산
출신
출연
출입
출장
출판
충격
충고
충돌
충분히
충청도
취업
취직
취향
치약
친구
친척
칠십
칠월
칠판
침대
침묵
침실
칫솔
칭찬
카메라
카운터
칼국수
캐릭터
캠퍼스
캠페인
커튼
컨디션
컬러
컴퓨터
코끼리
코미디
콘서트
콜라
콤플렉스
콩나물
쾌감
쿠데타
크림
큰길
큰딸
큰소리
큰아들
큰어머니
큰일
큰절
클래식
클럽
킬로
타입
타자기
탁구
탁자
탄생
태권도
태양
태풍
택시
탤런트
터널
터미널
테니스
테스트
테이블
텔레비전
토론
토마토
토요일
통계
통과
통로
통신
통역
통일
통장
통제
통증
통합
통화
퇴근
퇴원
퇴직금
튀김
트럭
특급
특별
특성
특수
특징
특히
튼튼히
티셔츠
파란색
파일
파출소
판결
판단
판매
판사
팔십
팔월
팝송
패션
팩스
팩시밀리
팬티
퍼센트
페인트
편견
편의
편지
편히
평가
평균
평생
평소
평양
평일
평화
포스터
포인트
포장
포함
표면
표정
표준
표현
품목
품질
풍경
풍속
풍습
프랑스
프린터
플라스틱
피곤
피망
피아노
필름
필수
필요
필자
필통
핑계
하느님
하늘
하드웨어
하룻밤
하반기
하숙집
하순
하여튼
하지만
하천
하품
하필
학과
학교
학급
학기
학년
학력
학번
학부모
학비
학생
학술
학습
학용품
학원
학위
학자
학점
한계
한글
한꺼번에
한낮
한눈
한동안
한때
한라산
한마디
한문
한번
한복
한식
한여름
한쪽
할머니
할아버지
할인
함께
함부로
합격
합리적
항공
항구
항상
항의
해결
해군
해답
해당
해물
해석
해설
해수욕장
해안
핵심
핸드백
햄버거
햇볕
햇살
행동
행복
행사
행운
행위
향기
향상
향수
허락
허용
헬기
현관
현금
현대
현상
현실
현장
현재
현지
혈액
협력
형부
형사
형수
형식
형제
형태
형편
혜택
호기심
호남
호랑이
호박
호텔
호흡
혹시
홀로
홈페이지
홍보
홍수
홍차
화면
화분
화살
화요일
화장
화학
확보
확인
확장
확정
환갑
환경
환영
환율
환자
활기
활동
활발히
활용
활짝
회견
회관
회복
회색
회원
회장
회전
횟수
횡단보도
효율적
후반
후춧가루
훈련
훨씬
휴식
휴일
흉내
흐름
흑백
흑인
흔적
흔히
흥미
흥분
희곡
희망
희생
흰색
힘껏`.split("\n");

// node_modules/@scure/bip39/esm/wordlists/portuguese.js
var wordlist7 = `abacate
abaixo
abalar
abater
abduzir
abelha
aberto
abismo
abotoar
abranger
abreviar
abrigar
abrupto
absinto
absoluto
absurdo
abutre
acabado
acalmar
acampar
acanhar
acaso
aceitar
acelerar
acenar
acervo
acessar
acetona
achatar
acidez
acima
acionado
acirrar
aclamar
aclive
acolhida
acomodar
acoplar
acordar
acumular
acusador
adaptar
adega
adentro
adepto
adequar
aderente
adesivo
adeus
adiante
aditivo
adjetivo
adjunto
admirar
adorar
adquirir
adubo
adverso
advogado
aeronave
afastar
aferir
afetivo
afinador
afivelar
aflito
afluente
afrontar
agachar
agarrar
agasalho
agenciar
agilizar
agiota
agitado
agora
agradar
agreste
agrupar
aguardar
agulha
ajoelhar
ajudar
ajustar
alameda
alarme
alastrar
alavanca
albergue
albino
alcatra
aldeia
alecrim
alegria
alertar
alface
alfinete
algum
alheio
aliar
alicate
alienar
alinhar
aliviar
almofada
alocar
alpiste
alterar
altitude
alucinar
alugar
aluno
alusivo
alvo
amaciar
amador
amarelo
amassar
ambas
ambiente
ameixa
amenizar
amido
amistoso
amizade
amolador
amontoar
amoroso
amostra
amparar
ampliar
ampola
anagrama
analisar
anarquia
anatomia
andaime
anel
anexo
angular
animar
anjo
anomalia
anotado
ansioso
anterior
anuidade
anunciar
anzol
apagador
apalpar
apanhado
apego
apelido
apertada
apesar
apetite
apito
aplauso
aplicada
apoio
apontar
aposta
aprendiz
aprovar
aquecer
arame
aranha
arara
arcada
ardente
areia
arejar
arenito
aresta
argiloso
argola
arma
arquivo
arraial
arrebate
arriscar
arroba
arrumar
arsenal
arterial
artigo
arvoredo
asfaltar
asilado
aspirar
assador
assinar
assoalho
assunto
astral
atacado
atadura
atalho
atarefar
atear
atender
aterro
ateu
atingir
atirador
ativo
atoleiro
atracar
atrevido
atriz
atual
atum
auditor
aumentar
aura
aurora
autismo
autoria
autuar
avaliar
avante
avaria
avental
avesso
aviador
avisar
avulso
axila
azarar
azedo
azeite
azulejo
babar
babosa
bacalhau
bacharel
bacia
bagagem
baiano
bailar
baioneta
bairro
baixista
bajular
baleia
baliza
balsa
banal
bandeira
banho
banir
banquete
barato
barbado
baronesa
barraca
barulho
baseado
bastante
batata
batedor
batida
batom
batucar
baunilha
beber
beijo
beirada
beisebol
beldade
beleza
belga
beliscar
bendito
bengala
benzer
berimbau
berlinda
berro
besouro
bexiga
bezerro
bico
bicudo
bienal
bifocal
bifurcar
bigorna
bilhete
bimestre
bimotor
biologia
biombo
biosfera
bipolar
birrento
biscoito
bisneto
bispo
bissexto
bitola
bizarro
blindado
bloco
bloquear
boato
bobagem
bocado
bocejo
bochecha
boicotar
bolada
boletim
bolha
bolo
bombeiro
bonde
boneco
bonita
borbulha
borda
boreal
borracha
bovino
boxeador
branco
brasa
braveza
breu
briga
brilho
brincar
broa
brochura
bronzear
broto
bruxo
bucha
budismo
bufar
bule
buraco
busca
busto
buzina
cabana
cabelo
cabide
cabo
cabrito
cacau
cacetada
cachorro
cacique
cadastro
cadeado
cafezal
caiaque
caipira
caixote
cajado
caju
calafrio
calcular
caldeira
calibrar
calmante
calota
camada
cambista
camisa
camomila
campanha
camuflar
canavial
cancelar
caneta
canguru
canhoto
canivete
canoa
cansado
cantar
canudo
capacho
capela
capinar
capotar
capricho
captador
capuz
caracol
carbono
cardeal
careca
carimbar
carneiro
carpete
carreira
cartaz
carvalho
casaco
casca
casebre
castelo
casulo
catarata
cativar
caule
causador
cautelar
cavalo
caverna
cebola
cedilha
cegonha
celebrar
celular
cenoura
censo
centeio
cercar
cerrado
certeiro
cerveja
cetim
cevada
chacota
chaleira
chamado
chapada
charme
chatice
chave
chefe
chegada
cheiro
cheque
chicote
chifre
chinelo
chocalho
chover
chumbo
chutar
chuva
cicatriz
ciclone
cidade
cidreira
ciente
cigana
cimento
cinto
cinza
ciranda
circuito
cirurgia
citar
clareza
clero
clicar
clone
clube
coado
coagir
cobaia
cobertor
cobrar
cocada
coelho
coentro
coeso
cogumelo
coibir
coifa
coiote
colar
coleira
colher
colidir
colmeia
colono
coluna
comando
combinar
comentar
comitiva
comover
complexo
comum
concha
condor
conectar
confuso
congelar
conhecer
conjugar
consumir
contrato
convite
cooperar
copeiro
copiador
copo
coquetel
coragem
cordial
corneta
coronha
corporal
correio
cortejo
coruja
corvo
cosseno
costela
cotonete
couro
couve
covil
cozinha
cratera
cravo
creche
credor
creme
crer
crespo
criada
criminal
crioulo
crise
criticar
crosta
crua
cruzeiro
cubano
cueca
cuidado
cujo
culatra
culminar
culpar
cultura
cumprir
cunhado
cupido
curativo
curral
cursar
curto
cuspir
custear
cutelo
damasco
datar
debater
debitar
deboche
debulhar
decalque
decimal
declive
decote
decretar
dedal
dedicado
deduzir
defesa
defumar
degelo
degrau
degustar
deitado
deixar
delator
delegado
delinear
delonga
demanda
demitir
demolido
dentista
depenado
depilar
depois
depressa
depurar
deriva
derramar
desafio
desbotar
descanso
desenho
desfiado
desgaste
desigual
deslize
desmamar
desova
despesa
destaque
desviar
detalhar
detentor
detonar
detrito
deusa
dever
devido
devotado
dezena
diagrama
dialeto
didata
difuso
digitar
dilatado
diluente
diminuir
dinastia
dinheiro
diocese
direto
discreta
disfarce
disparo
disquete
dissipar
distante
ditador
diurno
diverso
divisor
divulgar
dizer
dobrador
dolorido
domador
dominado
donativo
donzela
dormente
dorsal
dosagem
dourado
doutor
drenagem
drible
drogaria
duelar
duende
dueto
duplo
duquesa
durante
duvidoso
eclodir
ecoar
ecologia
edificar
edital
educado
efeito
efetivar
ejetar
elaborar
eleger
eleitor
elenco
elevador
eliminar
elogiar
embargo
embolado
embrulho
embutido
emenda
emergir
emissor
empatia
empenho
empinado
empolgar
emprego
empurrar
emulador
encaixe
encenado
enchente
encontro
endeusar
endossar
enfaixar
enfeite
enfim
engajado
engenho
englobar
engomado
engraxar
enguia
enjoar
enlatar
enquanto
enraizar
enrolado
enrugar
ensaio
enseada
ensino
ensopado
entanto
enteado
entidade
entortar
entrada
entulho
envergar
enviado
envolver
enxame
enxerto
enxofre
enxuto
epiderme
equipar
ereto
erguido
errata
erva
ervilha
esbanjar
esbelto
escama
escola
escrita
escuta
esfinge
esfolar
esfregar
esfumado
esgrima
esmalte
espanto
espelho
espiga
esponja
espreita
espumar
esquerda
estaca
esteira
esticar
estofado
estrela
estudo
esvaziar
etanol
etiqueta
euforia
europeu
evacuar
evaporar
evasivo
eventual
evidente
evoluir
exagero
exalar
examinar
exato
exausto
excesso
excitar
exclamar
executar
exemplo
exibir
exigente
exonerar
expandir
expelir
expirar
explanar
exposto
expresso
expulsar
externo
extinto
extrato
fabricar
fabuloso
faceta
facial
fada
fadiga
faixa
falar
falta
familiar
fandango
fanfarra
fantoche
fardado
farelo
farinha
farofa
farpa
fartura
fatia
fator
favorita
faxina
fazenda
fechado
feijoada
feirante
felino
feminino
fenda
feno
fera
feriado
ferrugem
ferver
festejar
fetal
feudal
fiapo
fibrose
ficar
ficheiro
figurado
fileira
filho
filme
filtrar
firmeza
fisgada
fissura
fita
fivela
fixador
fixo
flacidez
flamingo
flanela
flechada
flora
flutuar
fluxo
focal
focinho
fofocar
fogo
foguete
foice
folgado
folheto
forjar
formiga
forno
forte
fosco
fossa
fragata
fralda
frango
frasco
fraterno
freira
frente
fretar
frieza
friso
fritura
fronha
frustrar
fruteira
fugir
fulano
fuligem
fundar
fungo
funil
furador
furioso
futebol
gabarito
gabinete
gado
gaiato
gaiola
gaivota
galega
galho
galinha
galocha
ganhar
garagem
garfo
gargalo
garimpo
garoupa
garrafa
gasoduto
gasto
gata
gatilho
gaveta
gazela
gelado
geleia
gelo
gemada
gemer
gemido
generoso
gengiva
genial
genoma
genro
geologia
gerador
germinar
gesso
gestor
ginasta
gincana
gingado
girafa
girino
glacial
glicose
global
glorioso
goela
goiaba
golfe
golpear
gordura
gorjeta
gorro
gostoso
goteira
governar
gracejo
gradual
grafite
gralha
grampo
granada
gratuito
graveto
graxa
grego
grelhar
greve
grilo
grisalho
gritaria
grosso
grotesco
grudado
grunhido
gruta
guache
guarani
guaxinim
guerrear
guiar
guincho
guisado
gula
guloso
guru
habitar
harmonia
haste
haver
hectare
herdar
heresia
hesitar
hiato
hibernar
hidratar
hiena
hino
hipismo
hipnose
hipoteca
hoje
holofote
homem
honesto
honrado
hormonal
hospedar
humorado
iate
ideia
idoso
ignorado
igreja
iguana
ileso
ilha
iludido
iluminar
ilustrar
imagem
imediato
imenso
imersivo
iminente
imitador
imortal
impacto
impedir
implante
impor
imprensa
impune
imunizar
inalador
inapto
inativo
incenso
inchar
incidir
incluir
incolor
indeciso
indireto
indutor
ineficaz
inerente
infantil
infestar
infinito
inflamar
informal
infrator
ingerir
inibido
inicial
inimigo
injetar
inocente
inodoro
inovador
inox
inquieto
inscrito
inseto
insistir
inspetor
instalar
insulto
intacto
integral
intimar
intocado
intriga
invasor
inverno
invicto
invocar
iogurte
iraniano
ironizar
irreal
irritado
isca
isento
isolado
isqueiro
italiano
janeiro
jangada
janta
jararaca
jardim
jarro
jasmim
jato
javali
jazida
jejum
joaninha
joelhada
jogador
joia
jornal
jorrar
jovem
juba
judeu
judoca
juiz
julgador
julho
jurado
jurista
juro
justa
labareda
laboral
lacre
lactante
ladrilho
lagarta
lagoa
laje
lamber
lamentar
laminar
lampejo
lanche
lapidar
lapso
laranja
lareira
largura
lasanha
lastro
lateral
latido
lavanda
lavoura
lavrador
laxante
lazer
lealdade
lebre
legado
legendar
legista
leigo
leiloar
leitura
lembrete
leme
lenhador
lentilha
leoa
lesma
leste
letivo
letreiro
levar
leveza
levitar
liberal
libido
liderar
ligar
ligeiro
limitar
limoeiro
limpador
linda
linear
linhagem
liquidez
listagem
lisura
litoral
livro
lixa
lixeira
locador
locutor
lojista
lombo
lona
longe
lontra
lorde
lotado
loteria
loucura
lousa
louvar
luar
lucidez
lucro
luneta
lustre
lutador
luva
macaco
macete
machado
macio
madeira
madrinha
magnata
magreza
maior
mais
malandro
malha
malote
maluco
mamilo
mamoeiro
mamute
manada
mancha
mandato
manequim
manhoso
manivela
manobrar
mansa
manter
manusear
mapeado
maquinar
marcador
maresia
marfim
margem
marinho
marmita
maroto
marquise
marreco
martelo
marujo
mascote
masmorra
massagem
mastigar
matagal
materno
matinal
matutar
maxilar
medalha
medida
medusa
megafone
meiga
melancia
melhor
membro
memorial
menino
menos
mensagem
mental
merecer
mergulho
mesada
mesclar
mesmo
mesquita
mestre
metade
meteoro
metragem
mexer
mexicano
micro
migalha
migrar
milagre
milenar
milhar
mimado
minerar
minhoca
ministro
minoria
miolo
mirante
mirtilo
misturar
mocidade
moderno
modular
moeda
moer
moinho
moita
moldura
moleza
molho
molinete
molusco
montanha
moqueca
morango
morcego
mordomo
morena
mosaico
mosquete
mostarda
motel
motim
moto
motriz
muda
muito
mulata
mulher
multar
mundial
munido
muralha
murcho
muscular
museu
musical
nacional
nadador
naja
namoro
narina
narrado
nascer
nativa
natureza
navalha
navegar
navio
neblina
nebuloso
negativa
negociar
negrito
nervoso
neta
neural
nevasca
nevoeiro
ninar
ninho
nitidez
nivelar
nobreza
noite
noiva
nomear
nominal
nordeste
nortear
notar
noticiar
noturno
novelo
novilho
novo
nublado
nudez
numeral
nupcial
nutrir
nuvem
obcecado
obedecer
objetivo
obrigado
obscuro
obstetra
obter
obturar
ocidente
ocioso
ocorrer
oculista
ocupado
ofegante
ofensiva
oferenda
oficina
ofuscado
ogiva
olaria
oleoso
olhar
oliveira
ombro
omelete
omisso
omitir
ondulado
oneroso
ontem
opcional
operador
oponente
oportuno
oposto
orar
orbitar
ordem
ordinal
orfanato
orgasmo
orgulho
oriental
origem
oriundo
orla
ortodoxo
orvalho
oscilar
ossada
osso
ostentar
otimismo
ousadia
outono
outubro
ouvido
ovelha
ovular
oxidar
oxigenar
pacato
paciente
pacote
pactuar
padaria
padrinho
pagar
pagode
painel
pairar
paisagem
palavra
palestra
palheta
palito
palmada
palpitar
pancada
panela
panfleto
panqueca
pantanal
papagaio
papelada
papiro
parafina
parcial
pardal
parede
partida
pasmo
passado
pastel
patamar
patente
patinar
patrono
paulada
pausar
peculiar
pedalar
pedestre
pediatra
pedra
pegada
peitoral
peixe
pele
pelicano
penca
pendurar
peneira
penhasco
pensador
pente
perceber
perfeito
pergunta
perito
permitir
perna
perplexo
persiana
pertence
peruca
pescado
pesquisa
pessoa
petiscar
piada
picado
piedade
pigmento
pilastra
pilhado
pilotar
pimenta
pincel
pinguim
pinha
pinote
pintar
pioneiro
pipoca
piquete
piranha
pires
pirueta
piscar
pistola
pitanga
pivete
planta
plaqueta
platina
plebeu
plumagem
pluvial
pneu
poda
poeira
poetisa
polegada
policiar
poluente
polvilho
pomar
pomba
ponderar
pontaria
populoso
porta
possuir
postal
pote
poupar
pouso
povoar
praia
prancha
prato
praxe
prece
predador
prefeito
premiar
prensar
preparar
presilha
pretexto
prevenir
prezar
primata
princesa
prisma
privado
processo
produto
profeta
proibido
projeto
prometer
propagar
prosa
protetor
provador
publicar
pudim
pular
pulmonar
pulseira
punhal
punir
pupilo
pureza
puxador
quadra
quantia
quarto
quase
quebrar
queda
queijo
quente
querido
quimono
quina
quiosque
rabanada
rabisco
rachar
racionar
radial
raiar
rainha
raio
raiva
rajada
ralado
ramal
ranger
ranhura
rapadura
rapel
rapidez
raposa
raquete
raridade
rasante
rascunho
rasgar
raspador
rasteira
rasurar
ratazana
ratoeira
realeza
reanimar
reaver
rebaixar
rebelde
rebolar
recado
recente
recheio
recibo
recordar
recrutar
recuar
rede
redimir
redonda
reduzida
reenvio
refinar
refletir
refogar
refresco
refugiar
regalia
regime
regra
reinado
reitor
rejeitar
relativo
remador
remendo
remorso
renovado
reparo
repelir
repleto
repolho
represa
repudiar
requerer
resenha
resfriar
resgatar
residir
resolver
respeito
ressaca
restante
resumir
retalho
reter
retirar
retomada
retratar
revelar
revisor
revolta
riacho
rica
rigidez
rigoroso
rimar
ringue
risada
risco
risonho
robalo
rochedo
rodada
rodeio
rodovia
roedor
roleta
romano
roncar
rosado
roseira
rosto
rota
roteiro
rotina
rotular
rouco
roupa
roxo
rubro
rugido
rugoso
ruivo
rumo
rupestre
russo
sabor
saciar
sacola
sacudir
sadio
safira
saga
sagrada
saibro
salada
saleiro
salgado
saliva
salpicar
salsicha
saltar
salvador
sambar
samurai
sanar
sanfona
sangue
sanidade
sapato
sarda
sargento
sarjeta
saturar
saudade
saxofone
sazonal
secar
secular
seda
sedento
sediado
sedoso
sedutor
segmento
segredo
segundo
seiva
seleto
selvagem
semanal
semente
senador
senhor
sensual
sentado
separado
sereia
seringa
serra
servo
setembro
setor
sigilo
silhueta
silicone
simetria
simpatia
simular
sinal
sincero
singular
sinopse
sintonia
sirene
siri
situado
soberano
sobra
socorro
sogro
soja
solda
soletrar
solteiro
sombrio
sonata
sondar
sonegar
sonhador
sono
soprano
soquete
sorrir
sorteio
sossego
sotaque
soterrar
sovado
sozinho
suavizar
subida
submerso
subsolo
subtrair
sucata
sucesso
suco
sudeste
sufixo
sugador
sugerir
sujeito
sulfato
sumir
suor
superior
suplicar
suposto
suprimir
surdina
surfista
surpresa
surreal
surtir
suspiro
sustento
tabela
tablete
tabuada
tacho
tagarela
talher
talo
talvez
tamanho
tamborim
tampa
tangente
tanto
tapar
tapioca
tardio
tarefa
tarja
tarraxa
tatuagem
taurino
taxativo
taxista
teatral
tecer
tecido
teclado
tedioso
teia
teimar
telefone
telhado
tempero
tenente
tensor
tentar
termal
terno
terreno
tese
tesoura
testado
teto
textura
texugo
tiara
tigela
tijolo
timbrar
timidez
tingido
tinteiro
tiragem
titular
toalha
tocha
tolerar
tolice
tomada
tomilho
tonel
tontura
topete
tora
torcido
torneio
torque
torrada
torto
tostar
touca
toupeira
toxina
trabalho
tracejar
tradutor
trafegar
trajeto
trama
trancar
trapo
traseiro
tratador
travar
treino
tremer
trepidar
trevo
triagem
tribo
triciclo
tridente
trilogia
trindade
triplo
triturar
triunfal
trocar
trombeta
trova
trunfo
truque
tubular
tucano
tudo
tulipa
tupi
turbo
turma
turquesa
tutelar
tutorial
uivar
umbigo
unha
unidade
uniforme
urologia
urso
urtiga
urubu
usado
usina
usufruir
vacina
vadiar
vagaroso
vaidoso
vala
valente
validade
valores
vantagem
vaqueiro
varanda
vareta
varrer
vascular
vasilha
vassoura
vazar
vazio
veado
vedar
vegetar
veicular
veleiro
velhice
veludo
vencedor
vendaval
venerar
ventre
verbal
verdade
vereador
vergonha
vermelho
verniz
versar
vertente
vespa
vestido
vetorial
viaduto
viagem
viajar
viatura
vibrador
videira
vidraria
viela
viga
vigente
vigiar
vigorar
vilarejo
vinco
vinheta
vinil
violeta
virada
virtude
visitar
visto
vitral
viveiro
vizinho
voador
voar
vogal
volante
voleibol
voltagem
volumoso
vontade
vulto
vuvuzela
xadrez
xarope
xeque
xeretar
xerife
xingar
zangado
zarpar
zebu
zelador
zombar
zoologia
zumbido`.split("\n");

// node_modules/@scure/bip39/esm/wordlists/simplified-chinese.js
var wordlist8 = `的
一
是
在
不
了
有
和
人
这
中
大
为
上
个
国
我
以
要
他
时
来
用
们
生
到
作
地
于
出
就
分
对
成
会
可
主
发
年
动
同
工
也
能
下
过
子
说
产
种
面
而
方
后
多
定
行
学
法
所
民
得
经
十
三
之
进
着
等
部
度
家
电
力
里
如
水
化
高
自
二
理
起
小
物
现
实
加
量
都
两
体
制
机
当
使
点
从
业
本
去
把
性
好
应
开
它
合
还
因
由
其
些
然
前
外
天
政
四
日
那
社
义
事
平
形
相
全
表
间
样
与
关
各
重
新
线
内
数
正
心
反
你
明
看
原
又
么
利
比
或
但
质
气
第
向
道
命
此
变
条
只
没
结
解
问
意
建
月
公
无
系
军
很
情
者
最
立
代
想
已
通
并
提
直
题
党
程
展
五
果
料
象
员
革
位
入
常
文
总
次
品
式
活
设
及
管
特
件
长
求
老
头
基
资
边
流
路
级
少
图
山
统
接
知
较
将
组
见
计
别
她
手
角
期
根
论
运
农
指
几
九
区
强
放
决
西
被
干
做
必
战
先
回
则
任
取
据
处
队
南
给
色
光
门
即
保
治
北
造
百
规
热
领
七
海
口
东
导
器
压
志
世
金
增
争
济
阶
油
思
术
极
交
受
联
什
认
六
共
权
收
证
改
清
美
再
采
转
更
单
风
切
打
白
教
速
花
带
安
场
身
车
例
真
务
具
万
每
目
至
达
走
积
示
议
声
报
斗
完
类
八
离
华
名
确
才
科
张
信
马
节
话
米
整
空
元
况
今
集
温
传
土
许
步
群
广
石
记
需
段
研
界
拉
林
律
叫
且
究
观
越
织
装
影
算
低
持
音
众
书
布
复
容
儿
须
际
商
非
验
连
断
深
难
近
矿
千
周
委
素
技
备
半
办
青
省
列
习
响
约
支
般
史
感
劳
便
团
往
酸
历
市
克
何
除
消
构
府
称
太
准
精
值
号
率
族
维
划
选
标
写
存
候
毛
亲
快
效
斯
院
查
江
型
眼
王
按
格
养
易
置
派
层
片
始
却
专
状
育
厂
京
识
适
属
圆
包
火
住
调
满
县
局
照
参
红
细
引
听
该
铁
价
严
首
底
液
官
德
随
病
苏
失
尔
死
讲
配
女
黄
推
显
谈
罪
神
艺
呢
席
含
企
望
密
批
营
项
防
举
球
英
氧
势
告
李
台
落
木
帮
轮
破
亚
师
围
注
远
字
材
排
供
河
态
封
另
施
减
树
溶
怎
止
案
言
士
均
武
固
叶
鱼
波
视
仅
费
紧
爱
左
章
早
朝
害
续
轻
服
试
食
充
兵
源
判
护
司
足
某
练
差
致
板
田
降
黑
犯
负
击
范
继
兴
似
余
坚
曲
输
修
故
城
夫
够
送
笔
船
占
右
财
吃
富
春
职
觉
汉
画
功
巴
跟
虽
杂
飞
检
吸
助
升
阳
互
初
创
抗
考
投
坏
策
古
径
换
未
跑
留
钢
曾
端
责
站
简
述
钱
副
尽
帝
射
草
冲
承
独
令
限
阿
宣
环
双
请
超
微
让
控
州
良
轴
找
否
纪
益
依
优
顶
础
载
倒
房
突
坐
粉
敌
略
客
袁
冷
胜
绝
析
块
剂
测
丝
协
诉
念
陈
仍
罗
盐
友
洋
错
苦
夜
刑
移
频
逐
靠
混
母
短
皮
终
聚
汽
村
云
哪
既
距
卫
停
烈
央
察
烧
迅
境
若
印
洲
刻
括
激
孔
搞
甚
室
待
核
校
散
侵
吧
甲
游
久
菜
味
旧
模
湖
货
损
预
阻
毫
普
稳
乙
妈
植
息
扩
银
语
挥
酒
守
拿
序
纸
医
缺
雨
吗
针
刘
啊
急
唱
误
训
愿
审
附
获
茶
鲜
粮
斤
孩
脱
硫
肥
善
龙
演
父
渐
血
欢
械
掌
歌
沙
刚
攻
谓
盾
讨
晚
粒
乱
燃
矛
乎
杀
药
宁
鲁
贵
钟
煤
读
班
伯
香
介
迫
句
丰
培
握
兰
担
弦
蛋
沉
假
穿
执
答
乐
谁
顺
烟
缩
征
脸
喜
松
脚
困
异
免
背
星
福
买
染
井
概
慢
怕
磁
倍
祖
皇
促
静
补
评
翻
肉
践
尼
衣
宽
扬
棉
希
伤
操
垂
秋
宜
氢
套
督
振
架
亮
末
宪
庆
编
牛
触
映
雷
销
诗
座
居
抓
裂
胞
呼
娘
景
威
绿
晶
厚
盟
衡
鸡
孙
延
危
胶
屋
乡
临
陆
顾
掉
呀
灯
岁
措
束
耐
剧
玉
赵
跳
哥
季
课
凯
胡
额
款
绍
卷
齐
伟
蒸
殖
永
宗
苗
川
炉
岩
弱
零
杨
奏
沿
露
杆
探
滑
镇
饭
浓
航
怀
赶
库
夺
伊
灵
税
途
灭
赛
归
召
鼓
播
盘
裁
险
康
唯
录
菌
纯
借
糖
盖
横
符
私
努
堂
域
枪
润
幅
哈
竟
熟
虫
泽
脑
壤
碳
欧
遍
侧
寨
敢
彻
虑
斜
薄
庭
纳
弹
饲
伸
折
麦
湿
暗
荷
瓦
塞
床
筑
恶
户
访
塔
奇
透
梁
刀
旋
迹
卡
氯
遇
份
毒
泥
退
洗
摆
灰
彩
卖
耗
夏
择
忙
铜
献
硬
予
繁
圈
雪
函
亦
抽
篇
阵
阴
丁
尺
追
堆
雄
迎
泛
爸
楼
避
谋
吨
野
猪
旗
累
偏
典
馆
索
秦
脂
潮
爷
豆
忽
托
惊
塑
遗
愈
朱
替
纤
粗
倾
尚
痛
楚
谢
奋
购
磨
君
池
旁
碎
骨
监
捕
弟
暴
割
贯
殊
释
词
亡
壁
顿
宝
午
尘
闻
揭
炮
残
冬
桥
妇
警
综
招
吴
付
浮
遭
徐
您
摇
谷
赞
箱
隔
订
男
吹
园
纷
唐
败
宋
玻
巨
耕
坦
荣
闭
湾
键
凡
驻
锅
救
恩
剥
凝
碱
齿
截
炼
麻
纺
禁
废
盛
版
缓
净
睛
昌
婚
涉
筒
嘴
插
岸
朗
庄
街
藏
姑
贸
腐
奴
啦
惯
乘
伙
恢
匀
纱
扎
辩
耳
彪
臣
亿
璃
抵
脉
秀
萨
俄
网
舞
店
喷
纵
寸
汗
挂
洪
贺
闪
柬
爆
烯
津
稻
墙
软
勇
像
滚
厘
蒙
芳
肯
坡
柱
荡
腿
仪
旅
尾
轧
冰
贡
登
黎
削
钻
勒
逃
障
氨
郭
峰
币
港
伏
轨
亩
毕
擦
莫
刺
浪
秘
援
株
健
售
股
岛
甘
泡
睡
童
铸
汤
阀
休
汇
舍
牧
绕
炸
哲
磷
绩
朋
淡
尖
启
陷
柴
呈
徒
颜
泪
稍
忘
泵
蓝
拖
洞
授
镜
辛
壮
锋
贫
虚
弯
摩
泰
幼
廷
尊
窗
纲
弄
隶
疑
氏
宫
姐
震
瑞
怪
尤
琴
循
描
膜
违
夹
腰
缘
珠
穷
森
枝
竹
沟
催
绳
忆
邦
剩
幸
浆
栏
拥
牙
贮
礼
滤
钠
纹
罢
拍
咱
喊
袖
埃
勤
罚
焦
潜
伍
墨
欲
缝
姓
刊
饱
仿
奖
铝
鬼
丽
跨
默
挖
链
扫
喝
袋
炭
污
幕
诸
弧
励
梅
奶
洁
灾
舟
鉴
苯
讼
抱
毁
懂
寒
智
埔
寄
届
跃
渡
挑
丹
艰
贝
碰
拔
爹
戴
码
梦
芽
熔
赤
渔
哭
敬
颗
奔
铅
仲
虎
稀
妹
乏
珍
申
桌
遵
允
隆
螺
仓
魏
锐
晓
氮
兼
隐
碍
赫
拨
忠
肃
缸
牵
抢
博
巧
壳
兄
杜
讯
诚
碧
祥
柯
页
巡
矩
悲
灌
龄
伦
票
寻
桂
铺
圣
恐
恰
郑
趣
抬
荒
腾
贴
柔
滴
猛
阔
辆
妻
填
撤
储
签
闹
扰
紫
砂
递
戏
吊
陶
伐
喂
疗
瓶
婆
抚
臂
摸
忍
虾
蜡
邻
胸
巩
挤
偶
弃
槽
劲
乳
邓
吉
仁
烂
砖
租
乌
舰
伴
瓜
浅
丙
暂
燥
橡
柳
迷
暖
牌
秧
胆
详
簧
踏
瓷
谱
呆
宾
糊
洛
辉
愤
竞
隙
怒
粘
乃
绪
肩
籍
敏
涂
熙
皆
侦
悬
掘
享
纠
醒
狂
锁
淀
恨
牲
霸
爬
赏
逆
玩
陵
祝
秒
浙
貌
役
彼
悉
鸭
趋
凤
晨
畜
辈
秩
卵
署
梯
炎
滩
棋
驱
筛
峡
冒
啥
寿
译
浸
泉
帽
迟
硅
疆
贷
漏
稿
冠
嫩
胁
芯
牢
叛
蚀
奥
鸣
岭
羊
凭
串
塘
绘
酵
融
盆
锡
庙
筹
冻
辅
摄
袭
筋
拒
僚
旱
钾
鸟
漆
沈
眉
疏
添
棒
穗
硝
韩
逼
扭
侨
凉
挺
碗
栽
炒
杯
患
馏
劝
豪
辽
勃
鸿
旦
吏
拜
狗
埋
辊
掩
饮
搬
骂
辞
勾
扣
估
蒋
绒
雾
丈
朵
姆
拟
宇
辑
陕
雕
偿
蓄
崇
剪
倡
厅
咬
驶
薯
刷
斥
番
赋
奉
佛
浇
漫
曼
扇
钙
桃
扶
仔
返
俗
亏
腔
鞋
棱
覆
框
悄
叔
撞
骗
勘
旺
沸
孤
吐
孟
渠
屈
疾
妙
惜
仰
狠
胀
谐
抛
霉
桑
岗
嘛
衰
盗
渗
脏
赖
涌
甜
曹
阅
肌
哩
厉
烃
纬
毅
昨
伪
症
煮
叹
钉
搭
茎
笼
酷
偷
弓
锥
恒
杰
坑
鼻
翼
纶
叙
狱
逮
罐
络
棚
抑
膨
蔬
寺
骤
穆
冶
枯
册
尸
凸
绅
坯
牺
焰
轰
欣
晋
瘦
御
锭
锦
丧
旬
锻
垄
搜
扑
邀
亭
酯
迈
舒
脆
酶
闲
忧
酚
顽
羽
涨
卸
仗
陪
辟
惩
杭
姚
肚
捉
飘
漂
昆
欺
吾
郎
烷
汁
呵
饰
萧
雅
邮
迁
燕
撒
姻
赴
宴
烦
债
帐
斑
铃
旨
醇
董
饼
雏
姿
拌
傅
腹
妥
揉
贤
拆
歪
葡
胺
丢
浩
徽
昂
垫
挡
览
贪
慰
缴
汪
慌
冯
诺
姜
谊
凶
劣
诬
耀
昏
躺
盈
骑
乔
溪
丛
卢
抹
闷
咨
刮
驾
缆
悟
摘
铒
掷
颇
幻
柄
惠
惨
佳
仇
腊
窝
涤
剑
瞧
堡
泼
葱
罩
霍
捞
胎
苍
滨
俩
捅
湘
砍
霞
邵
萄
疯
淮
遂
熊
粪
烘
宿
档
戈
驳
嫂
裕
徙
箭
捐
肠
撑
晒
辨
殿
莲
摊
搅
酱
屏
疫
哀
蔡
堵
沫
皱
畅
叠
阁
莱
敲
辖
钩
痕
坝
巷
饿
祸
丘
玄
溜
曰
逻
彭
尝
卿
妨
艇
吞
韦
怨
矮
歇`.split("\n");

// node_modules/@scure/bip39/esm/wordlists/spanish.js
var wordlist9 = `ábaco
abdomen
abeja
abierto
abogado
abono
aborto
abrazo
abrir
abuelo
abuso
acabar
academia
acceso
acción
aceite
acelga
acento
aceptar
ácido
aclarar
acné
acoger
acoso
activo
acto
actriz
actuar
acudir
acuerdo
acusar
adicto
admitir
adoptar
adorno
aduana
adulto
aéreo
afectar
afición
afinar
afirmar
ágil
agitar
agonía
agosto
agotar
agregar
agrio
agua
agudo
águila
aguja
ahogo
ahorro
aire
aislar
ajedrez
ajeno
ajuste
alacrán
alambre
alarma
alba
álbum
alcalde
aldea
alegre
alejar
alerta
aleta
alfiler
alga
algodón
aliado
aliento
alivio
alma
almeja
almíbar
altar
alteza
altivo
alto
altura
alumno
alzar
amable
amante
amapola
amargo
amasar
ámbar
ámbito
ameno
amigo
amistad
amor
amparo
amplio
ancho
anciano
ancla
andar
andén
anemia
ángulo
anillo
ánimo
anís
anotar
antena
antiguo
antojo
anual
anular
anuncio
añadir
añejo
año
apagar
aparato
apetito
apio
aplicar
apodo
aporte
apoyo
aprender
aprobar
apuesta
apuro
arado
araña
arar
árbitro
árbol
arbusto
archivo
arco
arder
ardilla
arduo
área
árido
aries
armonía
arnés
aroma
arpa
arpón
arreglo
arroz
arruga
arte
artista
asa
asado
asalto
ascenso
asegurar
aseo
asesor
asiento
asilo
asistir
asno
asombro
áspero
astilla
astro
astuto
asumir
asunto
atajo
ataque
atar
atento
ateo
ático
atleta
átomo
atraer
atroz
atún
audaz
audio
auge
aula
aumento
ausente
autor
aval
avance
avaro
ave
avellana
avena
avestruz
avión
aviso
ayer
ayuda
ayuno
azafrán
azar
azote
azúcar
azufre
azul
baba
babor
bache
bahía
baile
bajar
balanza
balcón
balde
bambú
banco
banda
baño
barba
barco
barniz
barro
báscula
bastón
basura
batalla
batería
batir
batuta
baúl
bazar
bebé
bebida
bello
besar
beso
bestia
bicho
bien
bingo
blanco
bloque
blusa
boa
bobina
bobo
boca
bocina
boda
bodega
boina
bola
bolero
bolsa
bomba
bondad
bonito
bono
bonsái
borde
borrar
bosque
bote
botín
bóveda
bozal
bravo
brazo
brecha
breve
brillo
brinco
brisa
broca
broma
bronce
brote
bruja
brusco
bruto
buceo
bucle
bueno
buey
bufanda
bufón
búho
buitre
bulto
burbuja
burla
burro
buscar
butaca
buzón
caballo
cabeza
cabina
cabra
cacao
cadáver
cadena
caer
café
caída
caimán
caja
cajón
cal
calamar
calcio
caldo
calidad
calle
calma
calor
calvo
cama
cambio
camello
camino
campo
cáncer
candil
canela
canguro
canica
canto
caña
cañón
caoba
caos
capaz
capitán
capote
captar
capucha
cara
carbón
cárcel
careta
carga
cariño
carne
carpeta
carro
carta
casa
casco
casero
caspa
castor
catorce
catre
caudal
causa
cazo
cebolla
ceder
cedro
celda
célebre
celoso
célula
cemento
ceniza
centro
cerca
cerdo
cereza
cero
cerrar
certeza
césped
cetro
chacal
chaleco
champú
chancla
chapa
charla
chico
chiste
chivo
choque
choza
chuleta
chupar
ciclón
ciego
cielo
cien
cierto
cifra
cigarro
cima
cinco
cine
cinta
ciprés
circo
ciruela
cisne
cita
ciudad
clamor
clan
claro
clase
clave
cliente
clima
clínica
cobre
cocción
cochino
cocina
coco
código
codo
cofre
coger
cohete
cojín
cojo
cola
colcha
colegio
colgar
colina
collar
colmo
columna
combate
comer
comida
cómodo
compra
conde
conejo
conga
conocer
consejo
contar
copa
copia
corazón
corbata
corcho
cordón
corona
correr
coser
cosmos
costa
cráneo
cráter
crear
crecer
creído
crema
cría
crimen
cripta
crisis
cromo
crónica
croqueta
crudo
cruz
cuadro
cuarto
cuatro
cubo
cubrir
cuchara
cuello
cuento
cuerda
cuesta
cueva
cuidar
culebra
culpa
culto
cumbre
cumplir
cuna
cuneta
cuota
cupón
cúpula
curar
curioso
curso
curva
cutis
dama
danza
dar
dardo
dátil
deber
débil
década
decir
dedo
defensa
definir
dejar
delfín
delgado
delito
demora
denso
dental
deporte
derecho
derrota
desayuno
deseo
desfile
desnudo
destino
desvío
detalle
detener
deuda
día
diablo
diadema
diamante
diana
diario
dibujo
dictar
diente
dieta
diez
difícil
digno
dilema
diluir
dinero
directo
dirigir
disco
diseño
disfraz
diva
divino
doble
doce
dolor
domingo
don
donar
dorado
dormir
dorso
dos
dosis
dragón
droga
ducha
duda
duelo
dueño
dulce
dúo
duque
durar
dureza
duro
ébano
ebrio
echar
eco
ecuador
edad
edición
edificio
editor
educar
efecto
eficaz
eje
ejemplo
elefante
elegir
elemento
elevar
elipse
élite
elixir
elogio
eludir
embudo
emitir
emoción
empate
empeño
empleo
empresa
enano
encargo
enchufe
encía
enemigo
enero
enfado
enfermo
engaño
enigma
enlace
enorme
enredo
ensayo
enseñar
entero
entrar
envase
envío
época
equipo
erizo
escala
escena
escolar
escribir
escudo
esencia
esfera
esfuerzo
espada
espejo
espía
esposa
espuma
esquí
estar
este
estilo
estufa
etapa
eterno
ética
etnia
evadir
evaluar
evento
evitar
exacto
examen
exceso
excusa
exento
exigir
exilio
existir
éxito
experto
explicar
exponer
extremo
fábrica
fábula
fachada
fácil
factor
faena
faja
falda
fallo
falso
faltar
fama
familia
famoso
faraón
farmacia
farol
farsa
fase
fatiga
fauna
favor
fax
febrero
fecha
feliz
feo
feria
feroz
fértil
fervor
festín
fiable
fianza
fiar
fibra
ficción
ficha
fideo
fiebre
fiel
fiera
fiesta
figura
fijar
fijo
fila
filete
filial
filtro
fin
finca
fingir
finito
firma
flaco
flauta
flecha
flor
flota
fluir
flujo
flúor
fobia
foca
fogata
fogón
folio
folleto
fondo
forma
forro
fortuna
forzar
fosa
foto
fracaso
frágil
franja
frase
fraude
freír
freno
fresa
frío
frito
fruta
fuego
fuente
fuerza
fuga
fumar
función
funda
furgón
furia
fusil
fútbol
futuro
gacela
gafas
gaita
gajo
gala
galería
gallo
gamba
ganar
gancho
ganga
ganso
garaje
garza
gasolina
gastar
gato
gavilán
gemelo
gemir
gen
género
genio
gente
geranio
gerente
germen
gesto
gigante
gimnasio
girar
giro
glaciar
globo
gloria
gol
golfo
goloso
golpe
goma
gordo
gorila
gorra
gota
goteo
gozar
grada
gráfico
grano
grasa
gratis
grave
grieta
grillo
gripe
gris
grito
grosor
grúa
grueso
grumo
grupo
guante
guapo
guardia
guerra
guía
guiño
guion
guiso
guitarra
gusano
gustar
haber
hábil
hablar
hacer
hacha
hada
hallar
hamaca
harina
haz
hazaña
hebilla
hebra
hecho
helado
helio
hembra
herir
hermano
héroe
hervir
hielo
hierro
hígado
higiene
hijo
himno
historia
hocico
hogar
hoguera
hoja
hombre
hongo
honor
honra
hora
hormiga
horno
hostil
hoyo
hueco
huelga
huerta
hueso
huevo
huida
huir
humano
húmedo
humilde
humo
hundir
huracán
hurto
icono
ideal
idioma
ídolo
iglesia
iglú
igual
ilegal
ilusión
imagen
imán
imitar
impar
imperio
imponer
impulso
incapaz
índice
inerte
infiel
informe
ingenio
inicio
inmenso
inmune
innato
insecto
instante
interés
íntimo
intuir
inútil
invierno
ira
iris
ironía
isla
islote
jabalí
jabón
jamón
jarabe
jardín
jarra
jaula
jazmín
jefe
jeringa
jinete
jornada
joroba
joven
joya
juerga
jueves
juez
jugador
jugo
juguete
juicio
junco
jungla
junio
juntar
júpiter
jurar
justo
juvenil
juzgar
kilo
koala
labio
lacio
lacra
lado
ladrón
lagarto
lágrima
laguna
laico
lamer
lámina
lámpara
lana
lancha
langosta
lanza
lápiz
largo
larva
lástima
lata
látex
latir
laurel
lavar
lazo
leal
lección
leche
lector
leer
legión
legumbre
lejano
lengua
lento
leña
león
leopardo
lesión
letal
letra
leve
leyenda
libertad
libro
licor
líder
lidiar
lienzo
liga
ligero
lima
límite
limón
limpio
lince
lindo
línea
lingote
lino
linterna
líquido
liso
lista
litera
litio
litro
llaga
llama
llanto
llave
llegar
llenar
llevar
llorar
llover
lluvia
lobo
loción
loco
locura
lógica
logro
lombriz
lomo
lonja
lote
lucha
lucir
lugar
lujo
luna
lunes
lupa
lustro
luto
luz
maceta
macho
madera
madre
maduro
maestro
mafia
magia
mago
maíz
maldad
maleta
malla
malo
mamá
mambo
mamut
manco
mando
manejar
manga
maniquí
manjar
mano
manso
manta
mañana
mapa
máquina
mar
marco
marea
marfil
margen
marido
mármol
marrón
martes
marzo
masa
máscara
masivo
matar
materia
matiz
matriz
máximo
mayor
mazorca
mecha
medalla
medio
médula
mejilla
mejor
melena
melón
memoria
menor
mensaje
mente
menú
mercado
merengue
mérito
mes
mesón
meta
meter
método
metro
mezcla
miedo
miel
miembro
miga
mil
milagro
militar
millón
mimo
mina
minero
mínimo
minuto
miope
mirar
misa
miseria
misil
mismo
mitad
mito
mochila
moción
moda
modelo
moho
mojar
molde
moler
molino
momento
momia
monarca
moneda
monja
monto
moño
morada
morder
moreno
morir
morro
morsa
mortal
mosca
mostrar
motivo
mover
móvil
mozo
mucho
mudar
mueble
muela
muerte
muestra
mugre
mujer
mula
muleta
multa
mundo
muñeca
mural
muro
músculo
museo
musgo
música
muslo
nácar
nación
nadar
naipe
naranja
nariz
narrar
nasal
natal
nativo
natural
náusea
naval
nave
navidad
necio
néctar
negar
negocio
negro
neón
nervio
neto
neutro
nevar
nevera
nicho
nido
niebla
nieto
niñez
niño
nítido
nivel
nobleza
noche
nómina
noria
norma
norte
nota
noticia
novato
novela
novio
nube
nuca
núcleo
nudillo
nudo
nuera
nueve
nuez
nulo
número
nutria
oasis
obeso
obispo
objeto
obra
obrero
observar
obtener
obvio
oca
ocaso
océano
ochenta
ocho
ocio
ocre
octavo
octubre
oculto
ocupar
ocurrir
odiar
odio
odisea
oeste
ofensa
oferta
oficio
ofrecer
ogro
oído
oír
ojo
ola
oleada
olfato
olivo
olla
olmo
olor
olvido
ombligo
onda
onza
opaco
opción
ópera
opinar
oponer
optar
óptica
opuesto
oración
orador
oral
órbita
orca
orden
oreja
órgano
orgía
orgullo
oriente
origen
orilla
oro
orquesta
oruga
osadía
oscuro
osezno
oso
ostra
otoño
otro
oveja
óvulo
óxido
oxígeno
oyente
ozono
pacto
padre
paella
página
pago
país
pájaro
palabra
palco
paleta
pálido
palma
paloma
palpar
pan
panal
pánico
pantera
pañuelo
papá
papel
papilla
paquete
parar
parcela
pared
parir
paro
párpado
parque
párrafo
parte
pasar
paseo
pasión
paso
pasta
pata
patio
patria
pausa
pauta
pavo
payaso
peatón
pecado
pecera
pecho
pedal
pedir
pegar
peine
pelar
peldaño
pelea
peligro
pellejo
pelo
peluca
pena
pensar
peñón
peón
peor
pepino
pequeño
pera
percha
perder
pereza
perfil
perico
perla
permiso
perro
persona
pesa
pesca
pésimo
pestaña
pétalo
petróleo
pez
pezuña
picar
pichón
pie
piedra
pierna
pieza
pijama
pilar
piloto
pimienta
pino
pintor
pinza
piña
piojo
pipa
pirata
pisar
piscina
piso
pista
pitón
pizca
placa
plan
plata
playa
plaza
pleito
pleno
plomo
pluma
plural
pobre
poco
poder
podio
poema
poesía
poeta
polen
policía
pollo
polvo
pomada
pomelo
pomo
pompa
poner
porción
portal
posada
poseer
posible
poste
potencia
potro
pozo
prado
precoz
pregunta
premio
prensa
preso
previo
primo
príncipe
prisión
privar
proa
probar
proceso
producto
proeza
profesor
programa
prole
promesa
pronto
propio
próximo
prueba
público
puchero
pudor
pueblo
puerta
puesto
pulga
pulir
pulmón
pulpo
pulso
puma
punto
puñal
puño
pupa
pupila
puré
quedar
queja
quemar
querer
queso
quieto
química
quince
quitar
rábano
rabia
rabo
ración
radical
raíz
rama
rampa
rancho
rango
rapaz
rápido
rapto
rasgo
raspa
rato
rayo
raza
razón
reacción
realidad
rebaño
rebote
recaer
receta
rechazo
recoger
recreo
recto
recurso
red
redondo
reducir
reflejo
reforma
refrán
refugio
regalo
regir
regla
regreso
rehén
reino
reír
reja
relato
relevo
relieve
relleno
reloj
remar
remedio
remo
rencor
rendir
renta
reparto
repetir
reposo
reptil
res
rescate
resina
respeto
resto
resumen
retiro
retorno
retrato
reunir
revés
revista
rey
rezar
rico
riego
rienda
riesgo
rifa
rígido
rigor
rincón
riñón
río
riqueza
risa
ritmo
rito
rizo
roble
roce
rociar
rodar
rodeo
rodilla
roer
rojizo
rojo
romero
romper
ron
ronco
ronda
ropa
ropero
rosa
rosca
rostro
rotar
rubí
rubor
rudo
rueda
rugir
ruido
ruina
ruleta
rulo
rumbo
rumor
ruptura
ruta
rutina
sábado
saber
sabio
sable
sacar
sagaz
sagrado
sala
saldo
salero
salir
salmón
salón
salsa
salto
salud
salvar
samba
sanción
sandía
sanear
sangre
sanidad
sano
santo
sapo
saque
sardina
sartén
sastre
satán
sauna
saxofón
sección
seco
secreto
secta
sed
seguir
seis
sello
selva
semana
semilla
senda
sensor
señal
señor
separar
sepia
sequía
ser
serie
sermón
servir
sesenta
sesión
seta
setenta
severo
sexo
sexto
sidra
siesta
siete
siglo
signo
sílaba
silbar
silencio
silla
símbolo
simio
sirena
sistema
sitio
situar
sobre
socio
sodio
sol
solapa
soldado
soledad
sólido
soltar
solución
sombra
sondeo
sonido
sonoro
sonrisa
sopa
soplar
soporte
sordo
sorpresa
sorteo
sostén
sótano
suave
subir
suceso
sudor
suegra
suelo
sueño
suerte
sufrir
sujeto
sultán
sumar
superar
suplir
suponer
supremo
sur
surco
sureño
surgir
susto
sutil
tabaco
tabique
tabla
tabú
taco
tacto
tajo
talar
talco
talento
talla
talón
tamaño
tambor
tango
tanque
tapa
tapete
tapia
tapón
taquilla
tarde
tarea
tarifa
tarjeta
tarot
tarro
tarta
tatuaje
tauro
taza
tazón
teatro
techo
tecla
técnica
tejado
tejer
tejido
tela
teléfono
tema
temor
templo
tenaz
tender
tener
tenis
tenso
teoría
terapia
terco
término
ternura
terror
tesis
tesoro
testigo
tetera
texto
tez
tibio
tiburón
tiempo
tienda
tierra
tieso
tigre
tijera
tilde
timbre
tímido
timo
tinta
tío
típico
tipo
tira
tirón
titán
títere
título
tiza
toalla
tobillo
tocar
tocino
todo
toga
toldo
tomar
tono
tonto
topar
tope
toque
tórax
torero
tormenta
torneo
toro
torpedo
torre
torso
tortuga
tos
tosco
toser
tóxico
trabajo
tractor
traer
tráfico
trago
traje
tramo
trance
trato
trauma
trazar
trébol
tregua
treinta
tren
trepar
tres
tribu
trigo
tripa
triste
triunfo
trofeo
trompa
tronco
tropa
trote
trozo
truco
trueno
trufa
tubería
tubo
tuerto
tumba
tumor
túnel
túnica
turbina
turismo
turno
tutor
ubicar
úlcera
umbral
unidad
unir
universo
uno
untar
uña
urbano
urbe
urgente
urna
usar
usuario
útil
utopía
uva
vaca
vacío
vacuna
vagar
vago
vaina
vajilla
vale
válido
valle
valor
válvula
vampiro
vara
variar
varón
vaso
vecino
vector
vehículo
veinte
vejez
vela
velero
veloz
vena
vencer
venda
veneno
vengar
venir
venta
venus
ver
verano
verbo
verde
vereda
verja
verso
verter
vía
viaje
vibrar
vicio
víctima
vida
vídeo
vidrio
viejo
viernes
vigor
vil
villa
vinagre
vino
viñedo
violín
viral
virgo
virtud
visor
víspera
vista
vitamina
viudo
vivaz
vivero
vivir
vivo
volcán
volumen
volver
voraz
votar
voto
voz
vuelo
vulgar
yacer
yate
yegua
yema
yerno
yeso
yodo
yoga
yogur
zafiro
zanja
zapato
zarza
zona
zorro
zumo
zurdo`.split("\n");

// node_modules/@scure/bip39/esm/wordlists/traditional-chinese.js
var wordlist10 = `的
一
是
在
不
了
有
和
人
這
中
大
為
上
個
國
我
以
要
他
時
來
用
們
生
到
作
地
於
出
就
分
對
成
會
可
主
發
年
動
同
工
也
能
下
過
子
說
產
種
面
而
方
後
多
定
行
學
法
所
民
得
經
十
三
之
進
著
等
部
度
家
電
力
裡
如
水
化
高
自
二
理
起
小
物
現
實
加
量
都
兩
體
制
機
當
使
點
從
業
本
去
把
性
好
應
開
它
合
還
因
由
其
些
然
前
外
天
政
四
日
那
社
義
事
平
形
相
全
表
間
樣
與
關
各
重
新
線
內
數
正
心
反
你
明
看
原
又
麼
利
比
或
但
質
氣
第
向
道
命
此
變
條
只
沒
結
解
問
意
建
月
公
無
系
軍
很
情
者
最
立
代
想
已
通
並
提
直
題
黨
程
展
五
果
料
象
員
革
位
入
常
文
總
次
品
式
活
設
及
管
特
件
長
求
老
頭
基
資
邊
流
路
級
少
圖
山
統
接
知
較
將
組
見
計
別
她
手
角
期
根
論
運
農
指
幾
九
區
強
放
決
西
被
幹
做
必
戰
先
回
則
任
取
據
處
隊
南
給
色
光
門
即
保
治
北
造
百
規
熱
領
七
海
口
東
導
器
壓
志
世
金
增
爭
濟
階
油
思
術
極
交
受
聯
什
認
六
共
權
收
證
改
清
美
再
採
轉
更
單
風
切
打
白
教
速
花
帶
安
場
身
車
例
真
務
具
萬
每
目
至
達
走
積
示
議
聲
報
鬥
完
類
八
離
華
名
確
才
科
張
信
馬
節
話
米
整
空
元
況
今
集
溫
傳
土
許
步
群
廣
石
記
需
段
研
界
拉
林
律
叫
且
究
觀
越
織
裝
影
算
低
持
音
眾
書
布
复
容
兒
須
際
商
非
驗
連
斷
深
難
近
礦
千
週
委
素
技
備
半
辦
青
省
列
習
響
約
支
般
史
感
勞
便
團
往
酸
歷
市
克
何
除
消
構
府
稱
太
準
精
值
號
率
族
維
劃
選
標
寫
存
候
毛
親
快
效
斯
院
查
江
型
眼
王
按
格
養
易
置
派
層
片
始
卻
專
狀
育
廠
京
識
適
屬
圓
包
火
住
調
滿
縣
局
照
參
紅
細
引
聽
該
鐵
價
嚴
首
底
液
官
德
隨
病
蘇
失
爾
死
講
配
女
黃
推
顯
談
罪
神
藝
呢
席
含
企
望
密
批
營
項
防
舉
球
英
氧
勢
告
李
台
落
木
幫
輪
破
亞
師
圍
注
遠
字
材
排
供
河
態
封
另
施
減
樹
溶
怎
止
案
言
士
均
武
固
葉
魚
波
視
僅
費
緊
愛
左
章
早
朝
害
續
輕
服
試
食
充
兵
源
判
護
司
足
某
練
差
致
板
田
降
黑
犯
負
擊
范
繼
興
似
餘
堅
曲
輸
修
故
城
夫
夠
送
筆
船
佔
右
財
吃
富
春
職
覺
漢
畫
功
巴
跟
雖
雜
飛
檢
吸
助
昇
陽
互
初
創
抗
考
投
壞
策
古
徑
換
未
跑
留
鋼
曾
端
責
站
簡
述
錢
副
盡
帝
射
草
衝
承
獨
令
限
阿
宣
環
雙
請
超
微
讓
控
州
良
軸
找
否
紀
益
依
優
頂
礎
載
倒
房
突
坐
粉
敵
略
客
袁
冷
勝
絕
析
塊
劑
測
絲
協
訴
念
陳
仍
羅
鹽
友
洋
錯
苦
夜
刑
移
頻
逐
靠
混
母
短
皮
終
聚
汽
村
雲
哪
既
距
衛
停
烈
央
察
燒
迅
境
若
印
洲
刻
括
激
孔
搞
甚
室
待
核
校
散
侵
吧
甲
遊
久
菜
味
舊
模
湖
貨
損
預
阻
毫
普
穩
乙
媽
植
息
擴
銀
語
揮
酒
守
拿
序
紙
醫
缺
雨
嗎
針
劉
啊
急
唱
誤
訓
願
審
附
獲
茶
鮮
糧
斤
孩
脫
硫
肥
善
龍
演
父
漸
血
歡
械
掌
歌
沙
剛
攻
謂
盾
討
晚
粒
亂
燃
矛
乎
殺
藥
寧
魯
貴
鐘
煤
讀
班
伯
香
介
迫
句
豐
培
握
蘭
擔
弦
蛋
沉
假
穿
執
答
樂
誰
順
煙
縮
徵
臉
喜
松
腳
困
異
免
背
星
福
買
染
井
概
慢
怕
磁
倍
祖
皇
促
靜
補
評
翻
肉
踐
尼
衣
寬
揚
棉
希
傷
操
垂
秋
宜
氫
套
督
振
架
亮
末
憲
慶
編
牛
觸
映
雷
銷
詩
座
居
抓
裂
胞
呼
娘
景
威
綠
晶
厚
盟
衡
雞
孫
延
危
膠
屋
鄉
臨
陸
顧
掉
呀
燈
歲
措
束
耐
劇
玉
趙
跳
哥
季
課
凱
胡
額
款
紹
卷
齊
偉
蒸
殖
永
宗
苗
川
爐
岩
弱
零
楊
奏
沿
露
桿
探
滑
鎮
飯
濃
航
懷
趕
庫
奪
伊
靈
稅
途
滅
賽
歸
召
鼓
播
盤
裁
險
康
唯
錄
菌
純
借
糖
蓋
橫
符
私
努
堂
域
槍
潤
幅
哈
竟
熟
蟲
澤
腦
壤
碳
歐
遍
側
寨
敢
徹
慮
斜
薄
庭
納
彈
飼
伸
折
麥
濕
暗
荷
瓦
塞
床
築
惡
戶
訪
塔
奇
透
梁
刀
旋
跡
卡
氯
遇
份
毒
泥
退
洗
擺
灰
彩
賣
耗
夏
擇
忙
銅
獻
硬
予
繁
圈
雪
函
亦
抽
篇
陣
陰
丁
尺
追
堆
雄
迎
泛
爸
樓
避
謀
噸
野
豬
旗
累
偏
典
館
索
秦
脂
潮
爺
豆
忽
托
驚
塑
遺
愈
朱
替
纖
粗
傾
尚
痛
楚
謝
奮
購
磨
君
池
旁
碎
骨
監
捕
弟
暴
割
貫
殊
釋
詞
亡
壁
頓
寶
午
塵
聞
揭
炮
殘
冬
橋
婦
警
綜
招
吳
付
浮
遭
徐
您
搖
谷
贊
箱
隔
訂
男
吹
園
紛
唐
敗
宋
玻
巨
耕
坦
榮
閉
灣
鍵
凡
駐
鍋
救
恩
剝
凝
鹼
齒
截
煉
麻
紡
禁
廢
盛
版
緩
淨
睛
昌
婚
涉
筒
嘴
插
岸
朗
莊
街
藏
姑
貿
腐
奴
啦
慣
乘
夥
恢
勻
紗
扎
辯
耳
彪
臣
億
璃
抵
脈
秀
薩
俄
網
舞
店
噴
縱
寸
汗
掛
洪
賀
閃
柬
爆
烯
津
稻
牆
軟
勇
像
滾
厘
蒙
芳
肯
坡
柱
盪
腿
儀
旅
尾
軋
冰
貢
登
黎
削
鑽
勒
逃
障
氨
郭
峰
幣
港
伏
軌
畝
畢
擦
莫
刺
浪
秘
援
株
健
售
股
島
甘
泡
睡
童
鑄
湯
閥
休
匯
舍
牧
繞
炸
哲
磷
績
朋
淡
尖
啟
陷
柴
呈
徒
顏
淚
稍
忘
泵
藍
拖
洞
授
鏡
辛
壯
鋒
貧
虛
彎
摩
泰
幼
廷
尊
窗
綱
弄
隸
疑
氏
宮
姐
震
瑞
怪
尤
琴
循
描
膜
違
夾
腰
緣
珠
窮
森
枝
竹
溝
催
繩
憶
邦
剩
幸
漿
欄
擁
牙
貯
禮
濾
鈉
紋
罷
拍
咱
喊
袖
埃
勤
罰
焦
潛
伍
墨
欲
縫
姓
刊
飽
仿
獎
鋁
鬼
麗
跨
默
挖
鏈
掃
喝
袋
炭
污
幕
諸
弧
勵
梅
奶
潔
災
舟
鑑
苯
訟
抱
毀
懂
寒
智
埔
寄
屆
躍
渡
挑
丹
艱
貝
碰
拔
爹
戴
碼
夢
芽
熔
赤
漁
哭
敬
顆
奔
鉛
仲
虎
稀
妹
乏
珍
申
桌
遵
允
隆
螺
倉
魏
銳
曉
氮
兼
隱
礙
赫
撥
忠
肅
缸
牽
搶
博
巧
殼
兄
杜
訊
誠
碧
祥
柯
頁
巡
矩
悲
灌
齡
倫
票
尋
桂
鋪
聖
恐
恰
鄭
趣
抬
荒
騰
貼
柔
滴
猛
闊
輛
妻
填
撤
儲
簽
鬧
擾
紫
砂
遞
戲
吊
陶
伐
餵
療
瓶
婆
撫
臂
摸
忍
蝦
蠟
鄰
胸
鞏
擠
偶
棄
槽
勁
乳
鄧
吉
仁
爛
磚
租
烏
艦
伴
瓜
淺
丙
暫
燥
橡
柳
迷
暖
牌
秧
膽
詳
簧
踏
瓷
譜
呆
賓
糊
洛
輝
憤
競
隙
怒
粘
乃
緒
肩
籍
敏
塗
熙
皆
偵
懸
掘
享
糾
醒
狂
鎖
淀
恨
牲
霸
爬
賞
逆
玩
陵
祝
秒
浙
貌
役
彼
悉
鴨
趨
鳳
晨
畜
輩
秩
卵
署
梯
炎
灘
棋
驅
篩
峽
冒
啥
壽
譯
浸
泉
帽
遲
矽
疆
貸
漏
稿
冠
嫩
脅
芯
牢
叛
蝕
奧
鳴
嶺
羊
憑
串
塘
繪
酵
融
盆
錫
廟
籌
凍
輔
攝
襲
筋
拒
僚
旱
鉀
鳥
漆
沈
眉
疏
添
棒
穗
硝
韓
逼
扭
僑
涼
挺
碗
栽
炒
杯
患
餾
勸
豪
遼
勃
鴻
旦
吏
拜
狗
埋
輥
掩
飲
搬
罵
辭
勾
扣
估
蔣
絨
霧
丈
朵
姆
擬
宇
輯
陝
雕
償
蓄
崇
剪
倡
廳
咬
駛
薯
刷
斥
番
賦
奉
佛
澆
漫
曼
扇
鈣
桃
扶
仔
返
俗
虧
腔
鞋
棱
覆
框
悄
叔
撞
騙
勘
旺
沸
孤
吐
孟
渠
屈
疾
妙
惜
仰
狠
脹
諧
拋
黴
桑
崗
嘛
衰
盜
滲
臟
賴
湧
甜
曹
閱
肌
哩
厲
烴
緯
毅
昨
偽
症
煮
嘆
釘
搭
莖
籠
酷
偷
弓
錐
恆
傑
坑
鼻
翼
綸
敘
獄
逮
罐
絡
棚
抑
膨
蔬
寺
驟
穆
冶
枯
冊
屍
凸
紳
坯
犧
焰
轟
欣
晉
瘦
禦
錠
錦
喪
旬
鍛
壟
搜
撲
邀
亭
酯
邁
舒
脆
酶
閒
憂
酚
頑
羽
漲
卸
仗
陪
闢
懲
杭
姚
肚
捉
飄
漂
昆
欺
吾
郎
烷
汁
呵
飾
蕭
雅
郵
遷
燕
撒
姻
赴
宴
煩
債
帳
斑
鈴
旨
醇
董
餅
雛
姿
拌
傅
腹
妥
揉
賢
拆
歪
葡
胺
丟
浩
徽
昂
墊
擋
覽
貪
慰
繳
汪
慌
馮
諾
姜
誼
兇
劣
誣
耀
昏
躺
盈
騎
喬
溪
叢
盧
抹
悶
諮
刮
駕
纜
悟
摘
鉺
擲
頗
幻
柄
惠
慘
佳
仇
臘
窩
滌
劍
瞧
堡
潑
蔥
罩
霍
撈
胎
蒼
濱
倆
捅
湘
砍
霞
邵
萄
瘋
淮
遂
熊
糞
烘
宿
檔
戈
駁
嫂
裕
徙
箭
捐
腸
撐
曬
辨
殿
蓮
攤
攪
醬
屏
疫
哀
蔡
堵
沫
皺
暢
疊
閣
萊
敲
轄
鉤
痕
壩
巷
餓
禍
丘
玄
溜
曰
邏
彭
嘗
卿
妨
艇
吞
韋
怨
矮
歇`.split("\n");

// node_modules/ox/_esm/core/Mnemonic.js
function random2(wordlist11, options = {}) {
  const { strength = 128 } = options;
  return generateMnemonic(wordlist11, strength);
}
function toHdKey(mnemonic, options = {}) {
  const { passphrase } = options;
  const seed = toSeed(mnemonic, { passphrase });
  return fromSeed(seed);
}
function toPrivateKey(mnemonic, options = {}) {
  const { path: path2 = path(), passphrase } = options;
  const hdKey = toHdKey(mnemonic, { passphrase }).derive(path2);
  if (options.as === "Bytes")
    return from(hdKey.privateKey);
  return hdKey.privateKey;
}
function toSeed(mnemonic, options = {}) {
  const { passphrase } = options;
  const seed = mnemonicToSeedSync(mnemonic, passphrase);
  if (options.as === "Hex")
    return toHex(seed);
  return seed;
}
function validate7(mnemonic, wordlist11) {
  return validateMnemonic(mnemonic, wordlist11);
}

// node_modules/ox/_esm/core/PersonalMessage.js
var PersonalMessage_exports = {};
__export(PersonalMessage_exports, {
  encode: () => encode4,
  getSignPayload: () => getSignPayload2
});
function encode4(data) {
  const message = from2(data);
  return concat2(
    // Personal Sign Format: `0x19 ‖ "Ethereum Signed Message:\n" ‖ message.length ‖ message`
    "0x19",
    fromString2("Ethereum Signed Message:\n" + size2(message)),
    message
  );
}
function getSignPayload2(data) {
  return keccak256(encode4(data));
}

// node_modules/ox/_esm/core/Provider.js
var Provider_exports = {};
__export(Provider_exports, {
  ChainDisconnectedError: () => ChainDisconnectedError,
  DisconnectedError: () => DisconnectedError,
  IsUndefinedError: () => IsUndefinedError,
  ProviderRpcError: () => ProviderRpcError,
  UnauthorizedError: () => UnauthorizedError,
  UnsupportedMethodError: () => UnsupportedMethodError,
  UserRejectedRequestError: () => UserRejectedRequestError2,
  createEmitter: () => createEmitter,
  from: () => from17,
  parseError: () => parseError2
});

// node_modules/ox/_esm/core/RpcResponse.js
var RpcResponse_exports = {};
__export(RpcResponse_exports, {
  BaseError: () => BaseError2,
  InternalError: () => InternalError,
  InvalidInputError: () => InvalidInputError2,
  InvalidParamsError: () => InvalidParamsError,
  InvalidRequestError: () => InvalidRequestError,
  LimitExceededError: () => LimitExceededError,
  MethodNotFoundError: () => MethodNotFoundError,
  MethodNotSupportedError: () => MethodNotSupportedError,
  ParseError: () => ParseError,
  ResourceNotFoundError: () => ResourceNotFoundError,
  ResourceUnavailableError: () => ResourceUnavailableError,
  TransactionRejectedError: () => TransactionRejectedError,
  VersionNotSupportedError: () => VersionNotSupportedError,
  from: () => from16,
  parse: () => parse,
  parseError: () => parseError
});
function from16(response, options = {}) {
  const { request } = options;
  return {
    ...response,
    id: response.id ?? (request == null ? void 0 : request.id),
    jsonrpc: response.jsonrpc ?? request.jsonrpc
  };
}
function parse(response, options = {}) {
  const { raw = false } = options;
  const response_ = response;
  if (raw)
    return response;
  if (response_.error)
    throw parseError(response_.error);
  return response_.result;
}
function parseError(errorObject) {
  const errorObject_ = errorObject;
  const { code } = errorObject_;
  if (code === InternalError.code)
    return new InternalError(errorObject_);
  if (code === InvalidInputError2.code)
    return new InvalidInputError2(errorObject_);
  if (code === InvalidParamsError.code)
    return new InvalidParamsError(errorObject_);
  if (code === InvalidRequestError.code)
    return new InvalidRequestError(errorObject_);
  if (code === LimitExceededError.code)
    return new LimitExceededError(errorObject_);
  if (code === MethodNotFoundError.code)
    return new MethodNotFoundError(errorObject_);
  if (code === MethodNotSupportedError.code)
    return new MethodNotSupportedError(errorObject_);
  if (code === ParseError.code)
    return new ParseError(errorObject_);
  if (code === ResourceNotFoundError.code)
    return new ResourceNotFoundError(errorObject_);
  if (code === ResourceUnavailableError.code)
    return new ResourceUnavailableError(errorObject_);
  if (code === TransactionRejectedError.code)
    return new TransactionRejectedError(errorObject_);
  if (code === VersionNotSupportedError.code)
    return new VersionNotSupportedError(errorObject_);
  return new InternalError({
    data: errorObject_,
    message: errorObject_.message
  });
}
var BaseError2 = class extends Error {
  constructor(errorObject) {
    const { code, message, data } = errorObject;
    super(message);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "RpcResponse.BaseError"
    });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.code = code;
    this.data = data;
  }
};
var InvalidInputError2 = class _InvalidInputError extends BaseError2 {
  constructor(parameters = {}) {
    super({
      code: _InvalidInputError.code,
      data: parameters.data,
      message: parameters.message ?? "Missing or invalid parameters."
    });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32e3
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "RpcResponse.InvalidInputError"
    });
  }
};
Object.defineProperty(InvalidInputError2, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32e3
});
var ResourceNotFoundError = class _ResourceNotFoundError extends BaseError2 {
  constructor(parameters = {}) {
    super({
      code: _ResourceNotFoundError.code,
      data: parameters.data,
      message: parameters.message ?? "Requested resource not found."
    });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32001
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "RpcResponse.ResourceNotFoundError"
    });
  }
};
Object.defineProperty(ResourceNotFoundError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32001
});
var ResourceUnavailableError = class _ResourceUnavailableError extends BaseError2 {
  constructor(parameters = {}) {
    super({
      code: _ResourceUnavailableError.code,
      data: parameters.data,
      message: parameters.message ?? "Requested resource not available."
    });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32002
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "RpcResponse.ResourceUnavailableError"
    });
  }
};
Object.defineProperty(ResourceUnavailableError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32002
});
var TransactionRejectedError = class _TransactionRejectedError extends BaseError2 {
  constructor(parameters = {}) {
    super({
      code: _TransactionRejectedError.code,
      data: parameters.data,
      message: parameters.message ?? "Transaction creation failed."
    });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32003
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "RpcResponse.TransactionRejectedError"
    });
  }
};
Object.defineProperty(TransactionRejectedError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32003
});
var MethodNotSupportedError = class _MethodNotSupportedError extends BaseError2 {
  constructor(parameters = {}) {
    super({
      code: _MethodNotSupportedError.code,
      data: parameters.data,
      message: parameters.message ?? "Method is not implemented."
    });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32004
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "RpcResponse.MethodNotSupportedError"
    });
  }
};
Object.defineProperty(MethodNotSupportedError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32004
});
var LimitExceededError = class _LimitExceededError extends BaseError2 {
  constructor(parameters = {}) {
    super({
      code: _LimitExceededError.code,
      data: parameters.data,
      message: parameters.message ?? "Rate limit exceeded."
    });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32005
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "RpcResponse.LimitExceededError"
    });
  }
};
Object.defineProperty(LimitExceededError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32005
});
var VersionNotSupportedError = class _VersionNotSupportedError extends BaseError2 {
  constructor(parameters = {}) {
    super({
      code: _VersionNotSupportedError.code,
      data: parameters.data,
      message: parameters.message ?? "JSON-RPC version not supported."
    });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32006
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "RpcResponse.VersionNotSupportedError"
    });
  }
};
Object.defineProperty(VersionNotSupportedError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32006
});
var InvalidRequestError = class _InvalidRequestError extends BaseError2 {
  constructor(parameters = {}) {
    super({
      code: _InvalidRequestError.code,
      data: parameters.data,
      message: parameters.message ?? "Input is not a valid JSON-RPC request."
    });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32600
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "RpcResponse.InvalidRequestError"
    });
  }
};
Object.defineProperty(InvalidRequestError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32600
});
var MethodNotFoundError = class _MethodNotFoundError extends BaseError2 {
  constructor(parameters = {}) {
    super({
      code: _MethodNotFoundError.code,
      data: parameters.data,
      message: parameters.message ?? "Method does not exist."
    });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32601
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "RpcResponse.MethodNotFoundError"
    });
  }
};
Object.defineProperty(MethodNotFoundError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32601
});
var InvalidParamsError = class _InvalidParamsError extends BaseError2 {
  constructor(parameters = {}) {
    super({
      code: _InvalidParamsError.code,
      data: parameters.data,
      message: parameters.message ?? "Invalid method parameters."
    });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32602
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "RpcResponse.InvalidParamsError"
    });
  }
};
Object.defineProperty(InvalidParamsError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32602
});
var InternalError = class _InternalError extends BaseError2 {
  constructor(parameters = {}) {
    super({
      code: _InternalError.code,
      data: parameters.data,
      message: parameters.message ?? "Internal JSON-RPC error."
    });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32603
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "RpcResponse.InternalError"
    });
  }
};
Object.defineProperty(InternalError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32603
});
var ParseError = class _ParseError extends BaseError2 {
  constructor(parameters = {}) {
    super({
      code: _ParseError.code,
      data: parameters.data,
      message: parameters.message ?? "Failed to parse JSON-RPC response."
    });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32700
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "RpcResponse.ParseError"
    });
  }
};
Object.defineProperty(ParseError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32700
});

// node_modules/ox/_esm/core/Provider.js
var ProviderRpcError = class extends Error {
  constructor(code, message) {
    super(message);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "ProviderRpcError"
    });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "details", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.code = code;
    this.details = message;
  }
};
var UserRejectedRequestError2 = class extends ProviderRpcError {
  constructor({ message = "The user rejected the request." } = {}) {
    super(4001, message);
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4001
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Provider.UserRejectedRequestError"
    });
  }
};
Object.defineProperty(UserRejectedRequestError2, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 4001
});
var UnauthorizedError = class extends ProviderRpcError {
  constructor({ message = "The requested method and/or account has not been authorized by the user." } = {}) {
    super(4100, message);
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4100
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Provider.UnauthorizedError"
    });
  }
};
Object.defineProperty(UnauthorizedError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 4100
});
var UnsupportedMethodError = class extends ProviderRpcError {
  constructor({ message = "The provider does not support the requested method." } = {}) {
    super(4200, message);
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4200
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Provider.UnsupportedMethodError"
    });
  }
};
Object.defineProperty(UnsupportedMethodError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 4200
});
var DisconnectedError = class extends ProviderRpcError {
  constructor({ message = "The provider is disconnected from all chains." } = {}) {
    super(4900, message);
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4900
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Provider.DisconnectedError"
    });
  }
};
Object.defineProperty(DisconnectedError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 4900
});
var ChainDisconnectedError = class extends ProviderRpcError {
  constructor({ message = "The provider is not connected to the requested chain." } = {}) {
    super(4901, message);
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4901
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Provider.ChainDisconnectedError"
    });
  }
};
Object.defineProperty(ChainDisconnectedError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 4901
});
function createEmitter() {
  const emitter = new import_index.default();
  return {
    get eventNames() {
      return emitter.eventNames.bind(emitter);
    },
    get listenerCount() {
      return emitter.listenerCount.bind(emitter);
    },
    get listeners() {
      return emitter.listeners.bind(emitter);
    },
    addListener: emitter.addListener.bind(emitter),
    emit: emitter.emit.bind(emitter),
    off: emitter.off.bind(emitter),
    on: emitter.on.bind(emitter),
    once: emitter.once.bind(emitter),
    removeAllListeners: emitter.removeAllListeners.bind(emitter),
    removeListener: emitter.removeListener.bind(emitter)
  };
}
function from17(provider, options = {}) {
  var _a, _b;
  const { includeEvents = true } = options;
  if (!provider)
    throw new IsUndefinedError();
  return {
    ...includeEvents ? {
      on: (_a = provider.on) == null ? void 0 : _a.bind(provider),
      removeListener: (_b = provider.removeListener) == null ? void 0 : _b.bind(provider)
    } : {},
    async request(args) {
      try {
        const result = await provider.request(args);
        if (result && typeof result === "object" && "jsonrpc" in result)
          return parse(result);
        return result;
      } catch (error) {
        throw parseError2(error);
      }
    }
  };
}
function parseError2(errorObject) {
  const errorObject_ = errorObject;
  const error = parseError(errorObject_);
  if (error instanceof InternalError) {
    if (!error.data)
      return error;
    const { code } = error.data;
    if (code === DisconnectedError.code)
      return new DisconnectedError(errorObject_);
    if (code === ChainDisconnectedError.code)
      return new ChainDisconnectedError(errorObject_);
    if (code === UserRejectedRequestError2.code)
      return new UserRejectedRequestError2(errorObject_);
    if (code === UnauthorizedError.code)
      return new UnauthorizedError(errorObject_);
    if (code === UnsupportedMethodError.code)
      return new UnsupportedMethodError(errorObject_);
  }
  return error;
}
var IsUndefinedError = class extends BaseError {
  constructor() {
    super("`provider` is undefined.");
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Provider.IsUndefinedError"
    });
  }
};

// node_modules/ox/_esm/core/RpcSchema.js
var RpcSchema_exports = {};
__export(RpcSchema_exports, {
  from: () => from18
});
function from18() {
  return null;
}

// node_modules/ox/_esm/core/RpcRequest.js
var RpcRequest_exports = {};
__export(RpcRequest_exports, {
  createStore: () => createStore,
  from: () => from19
});
function createStore(options = {}) {
  let id = options.id ?? 0;
  return {
    prepare(options2) {
      return from19({
        id: id++,
        ...options2
      });
    },
    get id() {
      return id;
    }
  };
}
function from19(options) {
  return {
    ...options,
    jsonrpc: "2.0"
  };
}

// node_modules/ox/_esm/core/RpcTransport.js
var RpcTransport_exports = {};
__export(RpcTransport_exports, {
  HttpError: () => HttpError,
  MalformedResponseError: () => MalformedResponseError,
  fromHttp: () => fromHttp
});

// node_modules/ox/_esm/core/internal/promise.js
function withTimeout2(fn, options) {
  const { errorInstance = new TimeoutError(), timeout, signal } = options;
  return new Promise((resolve, reject) => {
    ;
    (async () => {
      let timeoutId;
      try {
        const controller = new AbortController();
        if (timeout > 0)
          timeoutId = setTimeout(() => {
            if (signal) {
              controller.abort();
            } else {
              reject(errorInstance);
            }
          }, timeout);
        resolve(await fn({ signal: controller.signal }));
      } catch (err) {
        if ((err == null ? void 0 : err.name) === "AbortError")
          reject(errorInstance);
        reject(err);
      } finally {
        clearTimeout(timeoutId);
      }
    })();
  });
}
var TimeoutError = class extends BaseError {
  constructor() {
    super("Operation timed out.");
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Promise.TimeoutError"
    });
  }
};

// node_modules/ox/_esm/core/internal/rpcTransport.js
function create2(transport, options_root) {
  const requestStore = createStore();
  return {
    request: async ({ method, params }, options = {}) => {
      const body = requestStore.prepare({ method, params });
      const data = await transport.request(body, options);
      return parse(data, {
        raw: options.raw ?? (options_root == null ? void 0 : options_root.raw)
      });
    }
  };
}

// node_modules/ox/_esm/core/RpcTransport.js
function fromHttp(url, options = {}) {
  return create2({
    async request(body_, options_) {
      const { fetchFn = options.fetchFn ?? fetch, fetchOptions: fetchOptions_ = options.fetchOptions, timeout = options.timeout ?? 1e4 } = options_;
      const body = JSON.stringify(body_);
      const fetchOptions = typeof fetchOptions_ === "function" ? await fetchOptions_(body_) : fetchOptions_;
      const response = await withTimeout2(({ signal }) => {
        const init2 = {
          ...fetchOptions,
          body,
          headers: {
            "Content-Type": "application/json",
            ...fetchOptions == null ? void 0 : fetchOptions.headers
          },
          method: (fetchOptions == null ? void 0 : fetchOptions.method) ?? "POST",
          signal: (fetchOptions == null ? void 0 : fetchOptions.signal) ?? (timeout > 0 ? signal : null)
        };
        const request = new Request(url, init2);
        return fetchFn(request);
      }, {
        timeout,
        signal: true
      });
      const data = await (async () => {
        var _a;
        if ((_a = response.headers.get("Content-Type")) == null ? void 0 : _a.startsWith("application/json"))
          return response.json();
        return response.text().then((data2) => {
          try {
            return JSON.parse(data2 || "{}");
          } catch (err) {
            if (response.ok)
              throw new MalformedResponseError({
                response: data2
              });
            return { error: data2 };
          }
        });
      })();
      if (!response.ok)
        throw new HttpError({
          body,
          details: JSON.stringify(data.error) ?? response.statusText,
          response,
          url
        });
      return data;
    }
  }, { raw: options.raw });
}
var HttpError = class extends BaseError {
  constructor({ body, details, response, url }) {
    super("HTTP request failed.", {
      details,
      metaMessages: [
        `Status: ${response.status}`,
        `URL: ${getUrl(url)}`,
        body ? `Body: ${JSON.stringify(body)}` : void 0
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "RpcTransport.HttpError"
    });
  }
};
var MalformedResponseError = class extends BaseError {
  constructor({ response }) {
    super("HTTP Response could not be parsed as JSON.", {
      metaMessages: [`Response: ${response}`]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "RpcTransport.MalformedResponseError"
    });
  }
};

// node_modules/ox/_esm/core/P256.js
var P256_exports = {};
__export(P256_exports, {
  getPublicKey: () => getPublicKey3,
  noble: () => noble3,
  randomPrivateKey: () => randomPrivateKey3,
  recoverPublicKey: () => recoverPublicKey2,
  sign: () => sign3,
  verify: () => verify3
});

// node_modules/@noble/curves/esm/p256.js
var Fp256 = Field(BigInt("0xffffffff00000001000000000000000000000000ffffffffffffffffffffffff"));
var CURVE_A = Fp256.create(BigInt("-3"));
var CURVE_B = BigInt("0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b");
var p256 = createCurve({
  a: CURVE_A,
  // Equation params: a, b
  b: CURVE_B,
  Fp: Fp256,
  // Field: 2n**224n * (2n**32n-1n) + 2n**192n + 2n**96n-1n
  // Curve order, total count of valid points in the field
  n: BigInt("0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551"),
  // Base (generator) point (x, y)
  Gx: BigInt("0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296"),
  Gy: BigInt("0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5"),
  h: BigInt(1),
  lowS: false
}, sha256);
var secp256r1 = p256;
var mapSWU = (() => mapToCurveSimpleSWU(Fp256, {
  A: CURVE_A,
  B: CURVE_B,
  Z: Fp256.create(BigInt("-10"))
}))();
var htf = (() => createHasher(secp256r1.ProjectivePoint, (scalars) => mapSWU(scalars[0]), {
  DST: "P256_XMD:SHA-256_SSWU_RO_",
  encodeDST: "P256_XMD:SHA-256_SSWU_NU_",
  p: Fp256.ORDER,
  m: 1,
  k: 128,
  expand: "xmd",
  hash: sha256
}))();
var hashToCurve = (() => htf.hashToCurve)();
var encodeToCurve = (() => htf.encodeToCurve)();

// node_modules/ox/_esm/core/P256.js
var noble3 = secp256r1;
function getPublicKey3(options) {
  const { privateKey } = options;
  const point = secp256r1.ProjectivePoint.fromPrivateKey(typeof privateKey === "string" ? privateKey.slice(2) : fromBytes(privateKey).slice(2));
  return from3(point);
}
function randomPrivateKey3(options = {}) {
  const { as = "Hex" } = options;
  const bytes = secp256r1.utils.randomPrivateKey();
  if (as === "Hex")
    return fromBytes(bytes);
  return bytes;
}
function recoverPublicKey2(options) {
  const { payload, signature } = options;
  const { r, s, yParity } = signature;
  const signature_ = new secp256r1.Signature(BigInt(r), BigInt(s)).addRecoveryBit(yParity);
  const payload_ = payload instanceof Uint8Array ? fromBytes(payload) : payload;
  const point = signature_.recoverPublicKey(payload_.substring(2));
  return from3(point);
}
function sign3(options) {
  const { extraEntropy: extraEntropy2 = extraEntropy, hash: hash7, payload, privateKey } = options;
  const { r, s, recovery } = secp256r1.sign(payload instanceof Uint8Array ? payload : fromHex(payload), privateKey instanceof Uint8Array ? privateKey : fromHex(privateKey), {
    extraEntropy: typeof extraEntropy2 === "boolean" ? extraEntropy2 : from2(extraEntropy2).slice(2),
    lowS: true,
    ...hash7 ? { prehash: true } : {}
  });
  return {
    r,
    s,
    yParity: recovery
  };
}
function verify3(options) {
  const { hash: hash7, payload, publicKey, signature } = options;
  return secp256r1.verify(signature, payload instanceof Uint8Array ? payload : fromHex(payload), toHex2(publicKey).substring(2), ...hash7 ? [{ prehash: true, lowS: true }] : []);
}

// node_modules/ox/_esm/core/Siwe.js
var Siwe_exports = {};
__export(Siwe_exports, {
  InvalidMessageFieldError: () => InvalidMessageFieldError,
  createMessage: () => createMessage,
  domainRegex: () => domainRegex,
  generateNonce: () => generateNonce,
  ipRegex: () => ipRegex,
  isUri: () => isUri,
  localhostRegex: () => localhostRegex,
  nonceRegex: () => nonceRegex,
  parseMessage: () => parseMessage,
  prefixRegex: () => prefixRegex,
  schemeRegex: () => schemeRegex,
  suffixRegex: () => suffixRegex,
  validateMessage: () => validateMessage
});

// node_modules/ox/_esm/core/internal/uid.js
var size3 = 256;
var index = size3;
var buffer;
function uid(length = 11) {
  if (!buffer || index + length > size3 * 2) {
    buffer = "";
    index = 0;
    for (let i = 0; i < size3; i++) {
      buffer += (256 + Math.random() * 256 | 0).toString(16).substring(1);
    }
  }
  return buffer.substring(index, index++ + length);
}

// node_modules/ox/_esm/core/Siwe.js
var domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(:[0-9]{1,5})?$/;
var ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:[0-9]{1,5})?$/;
var localhostRegex = /^localhost(:[0-9]{1,5})?$/;
var nonceRegex = /^[a-zA-Z0-9]{8,}$/;
var schemeRegex = /^([a-zA-Z][a-zA-Z0-9+-.]*)$/;
var prefixRegex = /^(?:(?<scheme>[a-zA-Z][a-zA-Z0-9+-.]*):\/\/)?(?<domain>[a-zA-Z0-9+-.]*(?::[0-9]{1,5})?) (?:wants you to sign in with your Ethereum account:\n)(?<address>0x[a-fA-F0-9]{40})\n\n(?:(?<statement>.*)\n\n)?/;
var suffixRegex = /(?:URI: (?<uri>.+))\n(?:Version: (?<version>.+))\n(?:Chain ID: (?<chainId>\d+))\n(?:Nonce: (?<nonce>[a-zA-Z0-9]+))\n(?:Issued At: (?<issuedAt>.+))(?:\nExpiration Time: (?<expirationTime>.+))?(?:\nNot Before: (?<notBefore>.+))?(?:\nRequest ID: (?<requestId>.+))?/;
function createMessage(value) {
  const { chainId, domain, expirationTime, issuedAt = /* @__PURE__ */ new Date(), nonce, notBefore, requestId, resources, scheme, uri, version: version2 } = value;
  {
    if (chainId !== Math.floor(chainId))
      throw new InvalidMessageFieldError({
        field: "chainId",
        metaMessages: [
          "- Chain ID must be a EIP-155 chain ID.",
          "- See https://eips.ethereum.org/EIPS/eip-155",
          "",
          `Provided value: ${chainId}`
        ]
      });
    if (!(domainRegex.test(domain) || ipRegex.test(domain) || localhostRegex.test(domain)))
      throw new InvalidMessageFieldError({
        field: "domain",
        metaMessages: [
          "- Domain must be an RFC 3986 authority.",
          "- See https://www.rfc-editor.org/rfc/rfc3986",
          "",
          `Provided value: ${domain}`
        ]
      });
    if (!nonceRegex.test(nonce))
      throw new InvalidMessageFieldError({
        field: "nonce",
        metaMessages: [
          "- Nonce must be at least 8 characters.",
          "- Nonce must be alphanumeric.",
          "",
          `Provided value: ${nonce}`
        ]
      });
    if (!isUri(uri))
      throw new InvalidMessageFieldError({
        field: "uri",
        metaMessages: [
          "- URI must be a RFC 3986 URI referring to the resource that is the subject of the signing.",
          "- See https://www.rfc-editor.org/rfc/rfc3986",
          "",
          `Provided value: ${uri}`
        ]
      });
    if (version2 !== "1")
      throw new InvalidMessageFieldError({
        field: "version",
        metaMessages: [
          "- Version must be '1'.",
          "",
          `Provided value: ${version2}`
        ]
      });
    if (scheme && !schemeRegex.test(scheme))
      throw new InvalidMessageFieldError({
        field: "scheme",
        metaMessages: [
          "- Scheme must be an RFC 3986 URI scheme.",
          "- See https://www.rfc-editor.org/rfc/rfc3986#section-3.1",
          "",
          `Provided value: ${scheme}`
        ]
      });
    const statement2 = value.statement;
    if (statement2 == null ? void 0 : statement2.includes("\n"))
      throw new InvalidMessageFieldError({
        field: "statement",
        metaMessages: [
          "- Statement must not include '\\n'.",
          "",
          `Provided value: ${statement2}`
        ]
      });
  }
  const address = from4(value.address, { checksum: true });
  const origin = (() => {
    if (scheme)
      return `${scheme}://${domain}`;
    return domain;
  })();
  const statement = (() => {
    if (!value.statement)
      return "";
    return `${value.statement}
`;
  })();
  const prefix = `${origin} wants you to sign in with your Ethereum account:
${address}

${statement}`;
  let suffix = `URI: ${uri}
Version: ${version2}
Chain ID: ${chainId}
Nonce: ${nonce}
Issued At: ${issuedAt.toISOString()}`;
  if (expirationTime)
    suffix += `
Expiration Time: ${expirationTime.toISOString()}`;
  if (notBefore)
    suffix += `
Not Before: ${notBefore.toISOString()}`;
  if (requestId)
    suffix += `
Request ID: ${requestId}`;
  if (resources) {
    let content2 = "\nResources:";
    for (const resource of resources) {
      if (!isUri(resource))
        throw new InvalidMessageFieldError({
          field: "resources",
          metaMessages: [
            "- Every resource must be a RFC 3986 URI.",
            "- See https://www.rfc-editor.org/rfc/rfc3986",
            "",
            `Provided value: ${resource}`
          ]
        });
      content2 += `
- ${resource}`;
    }
    suffix += content2;
  }
  return `${prefix}
${suffix}`;
}
function generateNonce() {
  return uid(96);
}
function isUri(value) {
  if (/[^a-z0-9\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=\.\-\_\~\%]/i.test(value))
    return false;
  if (/%[^0-9a-f]/i.test(value))
    return false;
  if (/%[0-9a-f](:?[^0-9a-f]|$)/i.test(value))
    return false;
  const splitted = splitUri(value);
  const scheme = splitted[1];
  const authority = splitted[2];
  const path2 = splitted[3];
  const query = splitted[4];
  const fragment = splitted[5];
  if (!((scheme == null ? void 0 : scheme.length) && path2 && path2.length >= 0))
    return false;
  if (authority == null ? void 0 : authority.length) {
    if (!(path2.length === 0 || /^\//.test(path2)))
      return false;
  } else {
    if (/^\/\//.test(path2))
      return false;
  }
  if (!/^[a-z][a-z0-9\+\-\.]*$/.test(scheme.toLowerCase()))
    return false;
  let out = "";
  out += `${scheme}:`;
  if (authority == null ? void 0 : authority.length)
    out += `//${authority}`;
  out += path2;
  if (query == null ? void 0 : query.length)
    out += `?${query}`;
  if (fragment == null ? void 0 : fragment.length)
    out += `#${fragment}`;
  return out;
}
function splitUri(value) {
  return value.match(/(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/);
}
function parseMessage(message) {
  var _a, _b, _c;
  const { scheme, statement, ...prefix } = ((_a = message.match(prefixRegex)) == null ? void 0 : _a.groups) ?? {};
  const { chainId, expirationTime, issuedAt, notBefore, requestId, ...suffix } = ((_b = message.match(suffixRegex)) == null ? void 0 : _b.groups) ?? {};
  const resources = (_c = message.split("Resources:")[1]) == null ? void 0 : _c.split("\n- ").slice(1);
  return {
    ...prefix,
    ...suffix,
    ...chainId ? { chainId: Number(chainId) } : {},
    ...expirationTime ? { expirationTime: new Date(expirationTime) } : {},
    ...issuedAt ? { issuedAt: new Date(issuedAt) } : {},
    ...notBefore ? { notBefore: new Date(notBefore) } : {},
    ...requestId ? { requestId } : {},
    ...resources ? { resources } : {},
    ...scheme ? { scheme } : {},
    ...statement ? { statement } : {}
  };
}
function validateMessage(value) {
  const { address, domain, message, nonce, scheme, time = /* @__PURE__ */ new Date() } = value;
  if (domain && message.domain !== domain)
    return false;
  if (nonce && message.nonce !== nonce)
    return false;
  if (scheme && message.scheme !== scheme)
    return false;
  if (message.expirationTime && time >= message.expirationTime)
    return false;
  if (message.notBefore && time < message.notBefore)
    return false;
  try {
    if (!message.address)
      return false;
    if (address && !isEqual(message.address, address))
      return false;
  } catch {
    return false;
  }
  return true;
}
var InvalidMessageFieldError = class extends BaseError {
  constructor(parameters) {
    const { field, metaMessages } = parameters;
    super(`Invalid Sign-In with Ethereum message field "${field}".`, {
      metaMessages
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Siwe.InvalidMessageFieldError"
    });
  }
};

// node_modules/ox/_esm/core/StateOverrides.js
var StateOverrides_exports = {};
__export(StateOverrides_exports, {
  fromRpc: () => fromRpc8,
  toRpc: () => toRpc8
});
function fromRpc8(rpcStateOverrides) {
  const stateOverrides = {};
  for (const [address, accountOverridesRpc] of Object.entries(rpcStateOverrides)) {
    const accountOverrides = {};
    if (accountOverridesRpc.balance)
      accountOverrides.balance = BigInt(accountOverridesRpc.balance);
    if (accountOverridesRpc.code)
      accountOverrides.code = accountOverridesRpc.code;
    if (accountOverridesRpc.movePrecompileToAddress)
      accountOverrides.movePrecompileToAddress = accountOverridesRpc.movePrecompileToAddress;
    if (accountOverridesRpc.nonce)
      accountOverrides.nonce = BigInt(accountOverridesRpc.nonce);
    if (accountOverridesRpc.state)
      accountOverrides.state = accountOverridesRpc.state;
    if (accountOverridesRpc.stateDiff)
      accountOverrides.stateDiff = accountOverridesRpc.stateDiff;
    stateOverrides[address] = accountOverrides;
  }
  return stateOverrides;
}
function toRpc8(stateOverrides) {
  const rpcStateOverrides = {};
  for (const [address, accountOverrides] of Object.entries(stateOverrides)) {
    const accountOverridesRpc = {};
    if (typeof accountOverrides.balance === "bigint")
      accountOverridesRpc.balance = fromNumber2(accountOverrides.balance);
    if (accountOverrides.code)
      accountOverridesRpc.code = accountOverrides.code;
    if (accountOverrides.movePrecompileToAddress)
      accountOverridesRpc.movePrecompileToAddress = accountOverrides.movePrecompileToAddress;
    if (typeof accountOverrides.nonce === "bigint")
      accountOverridesRpc.nonce = fromNumber2(accountOverrides.nonce);
    if (accountOverrides.state)
      accountOverridesRpc.state = accountOverrides.state;
    if (accountOverrides.stateDiff)
      accountOverridesRpc.stateDiff = accountOverrides.stateDiff;
    rpcStateOverrides[address] = accountOverridesRpc;
  }
  return rpcStateOverrides;
}

// node_modules/ox/_esm/core/TransactionEnvelope.js
var TransactionEnvelope_exports = {};
__export(TransactionEnvelope_exports, {
  FeeCapTooHighError: () => FeeCapTooHighError,
  GasPriceTooHighError: () => GasPriceTooHighError,
  InvalidChainIdError: () => InvalidChainIdError,
  InvalidSerializedError: () => InvalidSerializedError,
  TipAboveFeeCapError: () => TipAboveFeeCapError
});

// node_modules/ox/_esm/core/Value.js
var Value_exports = {};
__export(Value_exports, {
  InvalidDecimalNumberError: () => InvalidDecimalNumberError,
  exponents: () => exponents,
  format: () => format5,
  formatEther: () => formatEther,
  formatGwei: () => formatGwei,
  from: () => from20,
  fromEther: () => fromEther,
  fromGwei: () => fromGwei
});
var exponents = {
  wei: 0,
  gwei: 9,
  szabo: 12,
  finney: 15,
  ether: 18
};
function format5(value, decimals = 0) {
  let display = value.toString();
  const negative = display.startsWith("-");
  if (negative)
    display = display.slice(1);
  display = display.padStart(decimals, "0");
  let [integer, fraction] = [
    display.slice(0, display.length - decimals),
    display.slice(display.length - decimals)
  ];
  fraction = fraction.replace(/(0+)$/, "");
  return `${negative ? "-" : ""}${integer || "0"}${fraction ? `.${fraction}` : ""}`;
}
function formatEther(wei, unit = "wei") {
  return format5(wei, exponents.ether - exponents[unit]);
}
function formatGwei(wei, unit = "wei") {
  return format5(wei, exponents.gwei - exponents[unit]);
}
function from20(value, decimals = 0) {
  if (!/^(-?)([0-9]*)\.?([0-9]*)$/.test(value))
    throw new InvalidDecimalNumberError({ value });
  let [integer = "", fraction = "0"] = value.split(".");
  const negative = integer.startsWith("-");
  if (negative)
    integer = integer.slice(1);
  fraction = fraction.replace(/(0+)$/, "");
  if (decimals === 0) {
    if (Math.round(Number(`.${fraction}`)) === 1)
      integer = `${BigInt(integer) + 1n}`;
    fraction = "";
  } else if (fraction.length > decimals) {
    const [left, unit, right] = [
      fraction.slice(0, decimals - 1),
      fraction.slice(decimals - 1, decimals),
      fraction.slice(decimals)
    ];
    const rounded = Math.round(Number(`${unit}.${right}`));
    if (rounded > 9)
      fraction = `${BigInt(left) + BigInt(1)}0`.padStart(left.length + 1, "0");
    else
      fraction = `${left}${rounded}`;
    if (fraction.length > decimals) {
      fraction = fraction.slice(1);
      integer = `${BigInt(integer) + 1n}`;
    }
    fraction = fraction.slice(0, decimals);
  } else {
    fraction = fraction.padEnd(decimals, "0");
  }
  return BigInt(`${negative ? "-" : ""}${integer}${fraction}`);
}
function fromEther(ether, unit = "wei") {
  return from20(ether, exponents.ether - exponents[unit]);
}
function fromGwei(gwei, unit = "wei") {
  return from20(gwei, exponents.gwei - exponents[unit]);
}
var InvalidDecimalNumberError = class extends BaseError {
  constructor({ value }) {
    super(`Value \`${value}\` is not a valid decimal number.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Value.InvalidDecimalNumberError"
    });
  }
};

// node_modules/ox/_esm/core/TransactionEnvelope.js
var FeeCapTooHighError = class extends BaseError {
  constructor({ feeCap } = {}) {
    super(`The fee cap (\`maxFeePerGas\`/\`maxPriorityFeePerGas\`${feeCap ? ` = ${formatGwei(feeCap)} gwei` : ""}) cannot be higher than the maximum allowed value (2^256-1).`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "TransactionEnvelope.FeeCapTooHighError"
    });
  }
};
var GasPriceTooHighError = class extends BaseError {
  constructor({ gasPrice } = {}) {
    super(`The gas price (\`gasPrice\`${gasPrice ? ` = ${formatGwei(gasPrice)} gwei` : ""}) cannot be higher than the maximum allowed value (2^256-1).`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "TransactionEnvelope.GasPriceTooHighError"
    });
  }
};
var InvalidChainIdError = class extends BaseError {
  constructor({ chainId }) {
    super(typeof chainId !== "undefined" ? `Chain ID "${chainId}" is invalid.` : "Chain ID is invalid.");
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "TransactionEnvelope.InvalidChainIdError"
    });
  }
};
var InvalidSerializedError = class extends BaseError {
  constructor({ attributes, serialized, type: type6 }) {
    const missing = Object.entries(attributes).map(([key, value]) => typeof value === "undefined" ? key : void 0).filter(Boolean);
    super(`Invalid serialized transaction of type "${type6}" was provided.`, {
      metaMessages: [
        `Serialized Transaction: "${serialized}"`,
        missing.length > 0 ? `Missing Attributes: ${missing.join(", ")}` : ""
      ].filter(Boolean)
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "TransactionEnvelope.InvalidSerializedError"
    });
  }
};
var TipAboveFeeCapError = class extends BaseError {
  constructor({ maxPriorityFeePerGas, maxFeePerGas } = {}) {
    super([
      `The provided tip (\`maxPriorityFeePerGas\`${maxPriorityFeePerGas ? ` = ${formatGwei(maxPriorityFeePerGas)} gwei` : ""}) cannot be higher than the fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)} gwei` : ""}).`
    ].join("\n"));
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "TransactionEnvelope.TipAboveFeeCapError"
    });
  }
};

// node_modules/ox/_esm/core/TransactionEnvelopeLegacy.js
var TransactionEnvelopeLegacy_exports = {};
__export(TransactionEnvelopeLegacy_exports, {
  assert: () => assert3,
  deserialize: () => deserialize,
  from: () => from21,
  getSignPayload: () => getSignPayload3,
  hash: () => hash2,
  serialize: () => serialize,
  toRpc: () => toRpc9,
  type: () => type,
  validate: () => validate8
});
var type = "legacy";
function assert3(envelope) {
  const { chainId, gasPrice, to: to3 } = envelope;
  if (to3)
    assert(to3, { strict: false });
  if (typeof chainId !== "undefined" && chainId <= 0)
    throw new InvalidChainIdError({ chainId });
  if (gasPrice && BigInt(gasPrice) > 2n ** 256n - 1n)
    throw new GasPriceTooHighError({ gasPrice });
}
function deserialize(serialized) {
  const tuple = toHex3(serialized);
  const [nonce, gasPrice, gas, to3, value, data, chainIdOrV_, r, s] = tuple;
  if (!(tuple.length === 6 || tuple.length === 9))
    throw new InvalidSerializedError({
      attributes: {
        nonce,
        gasPrice,
        gas,
        to: to3,
        value,
        data,
        ...tuple.length > 6 ? {
          v: chainIdOrV_,
          r,
          s
        } : {}
      },
      serialized,
      type
    });
  const transaction = {
    type
  };
  if (validate2(to3) && to3 !== "0x")
    transaction.to = to3;
  if (validate2(gas) && gas !== "0x")
    transaction.gas = BigInt(gas);
  if (validate2(data) && data !== "0x")
    transaction.data = data;
  if (validate2(nonce) && nonce !== "0x")
    transaction.nonce = BigInt(nonce);
  if (validate2(value) && value !== "0x")
    transaction.value = BigInt(value);
  if (validate2(gasPrice) && gasPrice !== "0x")
    transaction.gasPrice = BigInt(gasPrice);
  if (tuple.length === 6)
    return transaction;
  const chainIdOrV = validate2(chainIdOrV_) && chainIdOrV_ !== "0x" ? Number(chainIdOrV_) : 0;
  if (s === "0x" && r === "0x") {
    if (chainIdOrV > 0)
      transaction.chainId = Number(chainIdOrV);
    return transaction;
  }
  const v = chainIdOrV;
  const chainId = Math.floor((v - 35) / 2);
  if (chainId > 0)
    transaction.chainId = chainId;
  else if (v !== 27 && v !== 28)
    throw new InvalidVError({ value: v });
  transaction.yParity = vToYParity(v);
  transaction.v = v;
  transaction.s = s === "0x" ? 0n : BigInt(s);
  transaction.r = r === "0x" ? 0n : BigInt(r);
  assert3(transaction);
  return transaction;
}
function from21(envelope, options = {}) {
  const { signature } = options;
  const envelope_ = typeof envelope === "string" ? deserialize(envelope) : envelope;
  assert3(envelope_);
  const signature_ = (() => {
    if (!signature)
      return {};
    const s = from10(signature);
    s.v = yParityToV(s.yParity);
    return s;
  })();
  return {
    ...envelope_,
    ...signature_,
    type: "legacy"
  };
}
function getSignPayload3(envelope) {
  return hash2(envelope, { presign: true });
}
function hash2(envelope, options = {}) {
  const { presign } = options;
  return keccak256(serialize({
    ...envelope,
    ...presign ? {
      r: void 0,
      s: void 0,
      yParity: void 0,
      v: void 0
    } : {}
  }));
}
function serialize(envelope, options = {}) {
  const { chainId = 0, gas, data, input, nonce, to: to3, value, gasPrice } = envelope;
  assert3(envelope);
  let serialized = [
    nonce ? fromNumber2(nonce) : "0x",
    gasPrice ? fromNumber2(gasPrice) : "0x",
    gas ? fromNumber2(gas) : "0x",
    to3 ?? "0x",
    value ? fromNumber2(value) : "0x",
    data ?? input ?? "0x"
  ];
  const signature = (() => {
    if (options.signature)
      return {
        r: options.signature.r,
        s: options.signature.s,
        v: yParityToV(options.signature.yParity)
      };
    if (typeof envelope.r === "undefined" || typeof envelope.s === "undefined")
      return void 0;
    return {
      r: envelope.r,
      s: envelope.s,
      v: envelope.v
    };
  })();
  if (signature) {
    const v = (() => {
      if (signature.v >= 35) {
        const inferredChainId = Math.floor((signature.v - 35) / 2);
        if (inferredChainId > 0)
          return signature.v;
        return 27 + (signature.v === 35 ? 0 : 1);
      }
      if (chainId > 0)
        return chainId * 2 + 35 + signature.v - 27;
      const v2 = 27 + (signature.v === 27 ? 0 : 1);
      if (signature.v !== v2)
        throw new InvalidVError({ value: signature.v });
      return v2;
    })();
    serialized = [
      ...serialized,
      fromNumber2(v),
      signature.r === 0n ? "0x" : trimLeft(fromNumber2(signature.r)),
      signature.s === 0n ? "0x" : trimLeft(fromNumber2(signature.s))
    ];
  } else if (chainId > 0)
    serialized = [...serialized, fromNumber2(chainId), "0x", "0x"];
  return fromHex2(serialized);
}
function toRpc9(envelope) {
  const signature = extract(envelope);
  return {
    ...envelope,
    chainId: typeof envelope.chainId === "number" ? fromNumber2(envelope.chainId) : void 0,
    data: envelope.data ?? envelope.input,
    type: "0x0",
    ...typeof envelope.gas === "bigint" ? { gas: fromNumber2(envelope.gas) } : {},
    ...typeof envelope.nonce === "bigint" ? { nonce: fromNumber2(envelope.nonce) } : {},
    ...typeof envelope.value === "bigint" ? { value: fromNumber2(envelope.value) } : {},
    ...typeof envelope.gasPrice === "bigint" ? { gasPrice: fromNumber2(envelope.gasPrice) } : {},
    ...signature ? {
      ...toRpc2(signature),
      v: signature.yParity === 0 ? "0x1b" : "0x1c"
    } : {}
  };
}
function validate8(envelope) {
  try {
    assert3(envelope);
    return true;
  } catch {
    return false;
  }
}

// node_modules/ox/_esm/core/TransactionEnvelopeEip1559.js
var TransactionEnvelopeEip1559_exports = {};
__export(TransactionEnvelopeEip1559_exports, {
  assert: () => assert4,
  deserialize: () => deserialize2,
  from: () => from22,
  getSignPayload: () => getSignPayload4,
  hash: () => hash3,
  serialize: () => serialize2,
  serializedType: () => serializedType,
  toRpc: () => toRpc10,
  type: () => type2,
  validate: () => validate9
});
var serializedType = "0x02";
var type2 = "eip1559";
function assert4(envelope) {
  const { chainId, maxPriorityFeePerGas, maxFeePerGas, to: to3 } = envelope;
  if (chainId <= 0)
    throw new InvalidChainIdError({ chainId });
  if (to3)
    assert(to3, { strict: false });
  if (maxFeePerGas && BigInt(maxFeePerGas) > 2n ** 256n - 1n)
    throw new FeeCapTooHighError({ feeCap: maxFeePerGas });
  if (maxPriorityFeePerGas && maxFeePerGas && maxPriorityFeePerGas > maxFeePerGas)
    throw new TipAboveFeeCapError({
      maxFeePerGas,
      maxPriorityFeePerGas
    });
}
function deserialize2(serialized) {
  const transactionArray = toHex3(slice2(serialized, 1));
  const [chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gas, to3, value, data, accessList, yParity, r, s] = transactionArray;
  if (!(transactionArray.length === 9 || transactionArray.length === 12))
    throw new InvalidSerializedError({
      attributes: {
        chainId,
        nonce,
        maxPriorityFeePerGas,
        maxFeePerGas,
        gas,
        to: to3,
        value,
        data,
        accessList,
        ...transactionArray.length > 9 ? {
          yParity,
          r,
          s
        } : {}
      },
      serialized,
      type: type2
    });
  let transaction = {
    chainId: Number(chainId),
    type: type2
  };
  if (validate2(to3) && to3 !== "0x")
    transaction.to = to3;
  if (validate2(gas) && gas !== "0x")
    transaction.gas = BigInt(gas);
  if (validate2(data) && data !== "0x")
    transaction.data = data;
  if (validate2(nonce) && nonce !== "0x")
    transaction.nonce = BigInt(nonce);
  if (validate2(value) && value !== "0x")
    transaction.value = BigInt(value);
  if (validate2(maxFeePerGas) && maxFeePerGas !== "0x")
    transaction.maxFeePerGas = BigInt(maxFeePerGas);
  if (validate2(maxPriorityFeePerGas) && maxPriorityFeePerGas !== "0x")
    transaction.maxPriorityFeePerGas = BigInt(maxPriorityFeePerGas);
  if (accessList.length !== 0 && accessList !== "0x")
    transaction.accessList = fromTupleList(accessList);
  const signature = r && s && yParity ? fromTuple([yParity, r, s]) : void 0;
  if (signature)
    transaction = {
      ...transaction,
      ...signature
    };
  assert4(transaction);
  return transaction;
}
function from22(envelope, options = {}) {
  const { signature } = options;
  const envelope_ = typeof envelope === "string" ? deserialize2(envelope) : envelope;
  assert4(envelope_);
  return {
    ...envelope_,
    ...signature ? from10(signature) : {},
    type: "eip1559"
  };
}
function getSignPayload4(envelope) {
  return hash3(envelope, { presign: true });
}
function hash3(envelope, options = {}) {
  const { presign } = options;
  return keccak256(serialize2({
    ...envelope,
    ...presign ? {
      r: void 0,
      s: void 0,
      yParity: void 0,
      v: void 0
    } : {}
  }));
}
function serialize2(envelope, options = {}) {
  const { chainId, gas, nonce, to: to3, value, maxFeePerGas, maxPriorityFeePerGas, accessList, data, input } = envelope;
  assert4(envelope);
  const accessTupleList = toTupleList(accessList);
  const signature = extract(options.signature || envelope);
  const serialized = [
    fromNumber2(chainId),
    nonce ? fromNumber2(nonce) : "0x",
    maxPriorityFeePerGas ? fromNumber2(maxPriorityFeePerGas) : "0x",
    maxFeePerGas ? fromNumber2(maxFeePerGas) : "0x",
    gas ? fromNumber2(gas) : "0x",
    to3 ?? "0x",
    value ? fromNumber2(value) : "0x",
    data ?? input ?? "0x",
    accessTupleList,
    ...signature ? toTuple(signature) : []
  ];
  return concat2(serializedType, fromHex2(serialized));
}
function toRpc10(envelope) {
  const signature = extract(envelope);
  return {
    ...envelope,
    chainId: fromNumber2(envelope.chainId),
    data: envelope.data ?? envelope.input,
    type: "0x2",
    ...typeof envelope.gas === "bigint" ? { gas: fromNumber2(envelope.gas) } : {},
    ...typeof envelope.nonce === "bigint" ? { nonce: fromNumber2(envelope.nonce) } : {},
    ...typeof envelope.value === "bigint" ? { value: fromNumber2(envelope.value) } : {},
    ...typeof envelope.maxFeePerGas === "bigint" ? { maxFeePerGas: fromNumber2(envelope.maxFeePerGas) } : {},
    ...typeof envelope.maxPriorityFeePerGas === "bigint" ? {
      maxPriorityFeePerGas: fromNumber2(envelope.maxPriorityFeePerGas)
    } : {},
    ...signature ? toRpc2(signature) : {}
  };
}
function validate9(envelope) {
  try {
    assert4(envelope);
    return true;
  } catch {
    return false;
  }
}

// node_modules/ox/_esm/core/TransactionEnvelopeEip2930.js
var TransactionEnvelopeEip2930_exports = {};
__export(TransactionEnvelopeEip2930_exports, {
  assert: () => assert5,
  deserialize: () => deserialize3,
  from: () => from23,
  getSignPayload: () => getSignPayload5,
  hash: () => hash4,
  serialize: () => serialize3,
  serializedType: () => serializedType2,
  toRpc: () => toRpc11,
  type: () => type3,
  validate: () => validate10
});
var serializedType2 = "0x01";
var type3 = "eip2930";
function assert5(envelope) {
  const { chainId, gasPrice, to: to3 } = envelope;
  if (chainId <= 0)
    throw new InvalidChainIdError({ chainId });
  if (to3)
    assert(to3, { strict: false });
  if (gasPrice && BigInt(gasPrice) > 2n ** 256n - 1n)
    throw new GasPriceTooHighError({ gasPrice });
}
function deserialize3(serialized) {
  const transactionArray = toHex3(slice2(serialized, 1));
  const [chainId, nonce, gasPrice, gas, to3, value, data, accessList, yParity, r, s] = transactionArray;
  if (!(transactionArray.length === 8 || transactionArray.length === 11))
    throw new InvalidSerializedError({
      attributes: {
        chainId,
        nonce,
        gasPrice,
        gas,
        to: to3,
        value,
        data,
        accessList,
        ...transactionArray.length > 8 ? {
          yParity,
          r,
          s
        } : {}
      },
      serialized,
      type: type3
    });
  let transaction = {
    chainId: Number(chainId),
    type: type3
  };
  if (validate2(to3) && to3 !== "0x")
    transaction.to = to3;
  if (validate2(gas) && gas !== "0x")
    transaction.gas = BigInt(gas);
  if (validate2(data) && data !== "0x")
    transaction.data = data;
  if (validate2(nonce) && nonce !== "0x")
    transaction.nonce = BigInt(nonce);
  if (validate2(value) && value !== "0x")
    transaction.value = BigInt(value);
  if (validate2(gasPrice) && gasPrice !== "0x")
    transaction.gasPrice = BigInt(gasPrice);
  if (accessList.length !== 0 && accessList !== "0x")
    transaction.accessList = fromTupleList(accessList);
  const signature = r && s && yParity ? fromTuple([yParity, r, s]) : void 0;
  if (signature)
    transaction = {
      ...transaction,
      ...signature
    };
  assert5(transaction);
  return transaction;
}
function from23(envelope, options = {}) {
  const { signature } = options;
  const envelope_ = typeof envelope === "string" ? deserialize3(envelope) : envelope;
  assert5(envelope_);
  return {
    ...envelope_,
    ...signature ? from10(signature) : {},
    type: "eip2930"
  };
}
function getSignPayload5(envelope) {
  return hash4(envelope, { presign: true });
}
function hash4(envelope, options = {}) {
  const { presign } = options;
  return keccak256(serialize3({
    ...envelope,
    ...presign ? {
      r: void 0,
      s: void 0,
      yParity: void 0,
      v: void 0
    } : {}
  }));
}
function serialize3(envelope, options = {}) {
  const { chainId, gas, data, input, nonce, to: to3, value, accessList, gasPrice } = envelope;
  assert5(envelope);
  const accessTupleList = toTupleList(accessList);
  const signature = extract(options.signature || envelope);
  const serialized = [
    fromNumber2(chainId),
    nonce ? fromNumber2(nonce) : "0x",
    gasPrice ? fromNumber2(gasPrice) : "0x",
    gas ? fromNumber2(gas) : "0x",
    to3 ?? "0x",
    value ? fromNumber2(value) : "0x",
    data ?? input ?? "0x",
    accessTupleList,
    ...signature ? toTuple(signature) : []
  ];
  return concat2("0x01", fromHex2(serialized));
}
function toRpc11(envelope) {
  const signature = extract(envelope);
  return {
    ...envelope,
    chainId: fromNumber2(envelope.chainId),
    data: envelope.data ?? envelope.input,
    ...typeof envelope.gas === "bigint" ? { gas: fromNumber2(envelope.gas) } : {},
    ...typeof envelope.nonce === "bigint" ? { nonce: fromNumber2(envelope.nonce) } : {},
    ...typeof envelope.value === "bigint" ? { value: fromNumber2(envelope.value) } : {},
    ...typeof envelope.gasPrice === "bigint" ? { gasPrice: fromNumber2(envelope.gasPrice) } : {},
    type: "0x1",
    ...signature ? toRpc2(signature) : {}
  };
}
function validate10(envelope) {
  try {
    assert5(envelope);
    return true;
  } catch {
    return false;
  }
}

// node_modules/ox/_esm/core/TransactionEnvelopeEip4844.js
var TransactionEnvelopeEip4844_exports = {};
__export(TransactionEnvelopeEip4844_exports, {
  assert: () => assert6,
  deserialize: () => deserialize4,
  from: () => from24,
  getSignPayload: () => getSignPayload6,
  hash: () => hash5,
  serialize: () => serialize4,
  serializedType: () => serializedType3,
  toRpc: () => toRpc12,
  type: () => type4,
  validate: () => validate11
});
var serializedType3 = "0x03";
var type4 = "eip4844";
function assert6(envelope) {
  const { blobVersionedHashes } = envelope;
  if (blobVersionedHashes) {
    if (blobVersionedHashes.length === 0)
      throw new EmptyBlobVersionedHashesError();
    for (const hash7 of blobVersionedHashes) {
      const size4 = size2(hash7);
      const version2 = toNumber(slice2(hash7, 0, 1));
      if (size4 !== 32)
        throw new InvalidVersionedHashSizeError({ hash: hash7, size: size4 });
      if (version2 !== versionedHashVersion)
        throw new InvalidVersionedHashVersionError({
          hash: hash7,
          version: version2
        });
    }
  }
  assert4(envelope);
}
function deserialize4(serialized) {
  const transactionOrWrapperArray = toHex3(slice2(serialized, 1));
  const hasNetworkWrapper = transactionOrWrapperArray.length === 4;
  const transactionArray = hasNetworkWrapper ? transactionOrWrapperArray[0] : transactionOrWrapperArray;
  const wrapperArray = hasNetworkWrapper ? transactionOrWrapperArray.slice(1) : [];
  const [chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gas, to3, value, data, accessList, maxFeePerBlobGas, blobVersionedHashes, yParity, r, s] = transactionArray;
  const [blobs, commitments, proofs] = wrapperArray;
  if (!(transactionArray.length === 11 || transactionArray.length === 14))
    throw new InvalidSerializedError({
      attributes: {
        chainId,
        nonce,
        maxPriorityFeePerGas,
        maxFeePerGas,
        gas,
        to: to3,
        value,
        data,
        accessList,
        ...transactionArray.length > 9 ? {
          yParity,
          r,
          s
        } : {}
      },
      serialized,
      type: type4
    });
  let transaction = {
    blobVersionedHashes,
    chainId: Number(chainId),
    type: type4
  };
  if (validate2(to3) && to3 !== "0x")
    transaction.to = to3;
  if (validate2(gas) && gas !== "0x")
    transaction.gas = BigInt(gas);
  if (validate2(data) && data !== "0x")
    transaction.data = data;
  if (validate2(nonce) && nonce !== "0x")
    transaction.nonce = BigInt(nonce);
  if (validate2(value) && value !== "0x")
    transaction.value = BigInt(value);
  if (validate2(maxFeePerBlobGas) && maxFeePerBlobGas !== "0x")
    transaction.maxFeePerBlobGas = BigInt(maxFeePerBlobGas);
  if (validate2(maxFeePerGas) && maxFeePerGas !== "0x")
    transaction.maxFeePerGas = BigInt(maxFeePerGas);
  if (validate2(maxPriorityFeePerGas) && maxPriorityFeePerGas !== "0x")
    transaction.maxPriorityFeePerGas = BigInt(maxPriorityFeePerGas);
  if ((accessList == null ? void 0 : accessList.length) !== 0 && accessList !== "0x")
    transaction.accessList = fromTupleList(accessList);
  if (blobs && commitments && proofs)
    transaction.sidecars = toSidecars(blobs, {
      commitments,
      proofs
    });
  const signature = r && s && yParity ? fromTuple([yParity, r, s]) : void 0;
  if (signature)
    transaction = {
      ...transaction,
      ...signature
    };
  assert6(transaction);
  return transaction;
}
function from24(envelope, options = {}) {
  const { signature } = options;
  const envelope_ = typeof envelope === "string" ? deserialize4(envelope) : envelope;
  assert6(envelope_);
  return {
    ...envelope_,
    ...signature ? from10(signature) : {},
    type: "eip4844"
  };
}
function getSignPayload6(envelope) {
  return hash5(envelope, { presign: true });
}
function hash5(envelope, options = {}) {
  const { presign } = options;
  return keccak256(serialize4({
    ...envelope,
    ...presign ? {
      sidecars: void 0,
      r: void 0,
      s: void 0,
      yParity: void 0,
      v: void 0
    } : {}
  }));
}
function serialize4(envelope, options = {}) {
  const { blobVersionedHashes, chainId, gas, nonce, to: to3, value, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, accessList, data } = envelope;
  assert6(envelope);
  const accessTupleList = toTupleList(accessList);
  const signature = extract(options.signature || envelope);
  const serialized = [
    fromNumber2(chainId),
    nonce ? fromNumber2(nonce) : "0x",
    maxPriorityFeePerGas ? fromNumber2(maxPriorityFeePerGas) : "0x",
    maxFeePerGas ? fromNumber2(maxFeePerGas) : "0x",
    gas ? fromNumber2(gas) : "0x",
    to3 ?? "0x",
    value ? fromNumber2(value) : "0x",
    data ?? "0x",
    accessTupleList,
    maxFeePerBlobGas ? fromNumber2(maxFeePerBlobGas) : "0x",
    blobVersionedHashes ?? [],
    ...signature ? toTuple(signature) : []
  ];
  const sidecars = options.sidecars || envelope.sidecars;
  const blobs = [];
  const commitments = [];
  const proofs = [];
  if (sidecars)
    for (let i = 0; i < sidecars.length; i++) {
      const { blob, commitment, proof } = sidecars[i];
      blobs.push(blob);
      commitments.push(commitment);
      proofs.push(proof);
    }
  return concat2("0x03", sidecars ? (
    // If sidecars are provided, envelope turns into a "network wrapper":
    fromHex2([serialized, blobs, commitments, proofs])
  ) : (
    // Otherwise, standard envelope is used:
    fromHex2(serialized)
  ));
}
function toRpc12(envelope) {
  const signature = extract(envelope);
  return {
    ...envelope,
    chainId: fromNumber2(envelope.chainId),
    data: envelope.data ?? envelope.input,
    ...typeof envelope.gas === "bigint" ? { gas: fromNumber2(envelope.gas) } : {},
    ...typeof envelope.nonce === "bigint" ? { nonce: fromNumber2(envelope.nonce) } : {},
    ...typeof envelope.value === "bigint" ? { value: fromNumber2(envelope.value) } : {},
    ...typeof envelope.maxFeePerBlobGas === "bigint" ? { maxFeePerBlobGas: fromNumber2(envelope.maxFeePerBlobGas) } : {},
    ...typeof envelope.maxFeePerGas === "bigint" ? { maxFeePerGas: fromNumber2(envelope.maxFeePerGas) } : {},
    ...typeof envelope.maxPriorityFeePerGas === "bigint" ? { maxPriorityFeePerGas: fromNumber2(envelope.maxPriorityFeePerGas) } : {},
    type: "0x3",
    ...signature ? toRpc2(signature) : {}
  };
}
function validate11(envelope) {
  try {
    assert6(envelope);
    return true;
  } catch {
    return false;
  }
}

// node_modules/ox/_esm/core/TransactionEnvelopeEip7702.js
var TransactionEnvelopeEip7702_exports = {};
__export(TransactionEnvelopeEip7702_exports, {
  assert: () => assert7,
  deserialize: () => deserialize5,
  from: () => from25,
  getSignPayload: () => getSignPayload7,
  hash: () => hash6,
  serialize: () => serialize5,
  serializedType: () => serializedType4,
  type: () => type5,
  validate: () => validate12
});
var serializedType4 = "0x04";
var type5 = "eip7702";
function assert7(envelope) {
  const { authorizationList } = envelope;
  if (authorizationList) {
    for (const authorization of authorizationList) {
      const { address, chainId } = authorization;
      if (address)
        assert(address, { strict: false });
      if (Number(chainId) < 0)
        throw new InvalidChainIdError({ chainId });
    }
  }
  assert4(envelope);
}
function deserialize5(serialized) {
  const transactionArray = toHex3(slice2(serialized, 1));
  const [chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gas, to3, value, data, accessList, authorizationList, yParity, r, s] = transactionArray;
  if (!(transactionArray.length === 10 || transactionArray.length === 13))
    throw new InvalidSerializedError({
      attributes: {
        chainId,
        nonce,
        maxPriorityFeePerGas,
        maxFeePerGas,
        gas,
        to: to3,
        value,
        data,
        accessList,
        authorizationList,
        ...transactionArray.length > 9 ? {
          yParity,
          r,
          s
        } : {}
      },
      serialized,
      type: type5
    });
  let transaction = {
    chainId: Number(chainId),
    type: type5
  };
  if (validate2(to3) && to3 !== "0x")
    transaction.to = to3;
  if (validate2(gas) && gas !== "0x")
    transaction.gas = BigInt(gas);
  if (validate2(data) && data !== "0x")
    transaction.data = data;
  if (validate2(nonce) && nonce !== "0x")
    transaction.nonce = BigInt(nonce);
  if (validate2(value) && value !== "0x")
    transaction.value = BigInt(value);
  if (validate2(maxFeePerGas) && maxFeePerGas !== "0x")
    transaction.maxFeePerGas = BigInt(maxFeePerGas);
  if (validate2(maxPriorityFeePerGas) && maxPriorityFeePerGas !== "0x")
    transaction.maxPriorityFeePerGas = BigInt(maxPriorityFeePerGas);
  if (accessList.length !== 0 && accessList !== "0x")
    transaction.accessList = fromTupleList(accessList);
  if (authorizationList !== "0x")
    transaction.authorizationList = fromTupleList2(authorizationList);
  const signature = r && s && yParity ? fromTuple([yParity, r, s]) : void 0;
  if (signature)
    transaction = {
      ...transaction,
      ...signature
    };
  assert7(transaction);
  return transaction;
}
function from25(envelope, options = {}) {
  const { signature } = options;
  const envelope_ = typeof envelope === "string" ? deserialize5(envelope) : envelope;
  assert7(envelope_);
  return {
    ...envelope_,
    ...signature ? from10(signature) : {},
    type: "eip7702"
  };
}
function getSignPayload7(envelope) {
  return hash6(envelope, { presign: true });
}
function hash6(envelope, options = {}) {
  const { presign } = options;
  return keccak256(serialize5({
    ...envelope,
    ...presign ? {
      r: void 0,
      s: void 0,
      yParity: void 0
    } : {}
  }));
}
function serialize5(envelope, options = {}) {
  const { authorizationList, chainId, gas, nonce, to: to3, value, maxFeePerGas, maxPriorityFeePerGas, accessList, data, input } = envelope;
  assert7(envelope);
  const accessTupleList = toTupleList(accessList);
  const authorizationTupleList = toTupleList2(authorizationList);
  const signature = extract(options.signature || envelope);
  const serialized = [
    fromNumber2(chainId),
    nonce ? fromNumber2(nonce) : "0x",
    maxPriorityFeePerGas ? fromNumber2(maxPriorityFeePerGas) : "0x",
    maxFeePerGas ? fromNumber2(maxFeePerGas) : "0x",
    gas ? fromNumber2(gas) : "0x",
    to3 ?? "0x",
    value ? fromNumber2(value) : "0x",
    data ?? input ?? "0x",
    accessTupleList,
    authorizationTupleList,
    ...signature ? toTuple(signature) : []
  ];
  return concat2(serializedType4, fromHex2(serialized));
}
function validate12(envelope) {
  try {
    assert7(envelope);
    return true;
  } catch {
    return false;
  }
}

// node_modules/ox/_esm/core/TransactionReceipt.js
var TransactionReceipt_exports = {};
__export(TransactionReceipt_exports, {
  fromRpc: () => fromRpc9,
  fromRpcStatus: () => fromRpcStatus,
  fromRpcType: () => fromRpcType2,
  toRpc: () => toRpc13,
  toRpcStatus: () => toRpcStatus,
  toRpcType: () => toRpcType2
});
var fromRpcStatus = {
  "0x0": "reverted",
  "0x1": "success"
};
var toRpcStatus = {
  reverted: "0x0",
  success: "0x1"
};
var fromRpcType2 = {
  "0x0": "legacy",
  "0x1": "eip2930",
  "0x2": "eip1559",
  "0x3": "eip4844",
  "0x4": "eip7702"
};
var toRpcType2 = {
  legacy: "0x0",
  eip2930: "0x1",
  eip1559: "0x2",
  eip4844: "0x3",
  eip7702: "0x4"
};
function fromRpc9(receipt) {
  if (!receipt)
    return null;
  return {
    ...receipt,
    blobGasPrice: receipt.blobGasPrice ? BigInt(receipt.blobGasPrice) : void 0,
    blobGasUsed: receipt.blobGasUsed ? BigInt(receipt.blobGasUsed) : void 0,
    blockNumber: BigInt(receipt.blockNumber ?? 0n),
    cumulativeGasUsed: BigInt(receipt.cumulativeGasUsed ?? 0n),
    effectiveGasPrice: BigInt(receipt.effectiveGasPrice ?? 0n),
    gasUsed: BigInt(receipt.gasUsed ?? 0n),
    logs: receipt.logs.map((log) => fromRpc7(log, { pending: false })),
    status: fromRpcStatus[receipt.status],
    transactionIndex: Number(receipt.transactionIndex ?? 0),
    type: fromRpcType2[receipt.type] || receipt.type
  };
}
function toRpc13(receipt) {
  return {
    blobGasPrice: receipt.blobGasPrice ? fromNumber2(receipt.blobGasPrice) : void 0,
    blobGasUsed: receipt.blobGasUsed ? fromNumber2(receipt.blobGasUsed) : void 0,
    blockHash: receipt.blockHash,
    blockNumber: fromNumber2(receipt.blockNumber),
    contractAddress: receipt.contractAddress,
    cumulativeGasUsed: fromNumber2(receipt.cumulativeGasUsed),
    effectiveGasPrice: fromNumber2(receipt.effectiveGasPrice),
    from: receipt.from,
    gasUsed: fromNumber2(receipt.gasUsed),
    logs: receipt.logs.map(toRpc7),
    logsBloom: receipt.logsBloom,
    root: receipt.root,
    status: toRpcStatus[receipt.status],
    to: receipt.to,
    transactionHash: receipt.transactionHash,
    transactionIndex: fromNumber2(receipt.transactionIndex),
    type: toRpcType2[receipt.type] ?? receipt.type
  };
}

// node_modules/ox/_esm/core/TransactionRequest.js
var TransactionRequest_exports = {};
__export(TransactionRequest_exports, {
  toRpc: () => toRpc14
});
function toRpc14(request) {
  const request_rpc = {};
  if (typeof request.accessList !== "undefined")
    request_rpc.accessList = request.accessList;
  if (typeof request.authorizationList !== "undefined")
    request_rpc.authorizationList = toRpcList(request.authorizationList);
  if (typeof request.blobVersionedHashes !== "undefined")
    request_rpc.blobVersionedHashes = request.blobVersionedHashes;
  if (typeof request.blobs !== "undefined")
    request_rpc.blobs = request.blobs;
  if (typeof request.chainId !== "undefined")
    request_rpc.chainId = fromNumber2(request.chainId);
  if (typeof request.data !== "undefined") {
    request_rpc.data = request.data;
    request_rpc.input = request.data;
  } else if (typeof request.input !== "undefined") {
    request_rpc.data = request.input;
    request_rpc.input = request.input;
  }
  if (typeof request.from !== "undefined")
    request_rpc.from = request.from;
  if (typeof request.gas !== "undefined")
    request_rpc.gas = fromNumber2(request.gas);
  if (typeof request.gasPrice !== "undefined")
    request_rpc.gasPrice = fromNumber2(request.gasPrice);
  if (typeof request.maxFeePerBlobGas !== "undefined")
    request_rpc.maxFeePerBlobGas = fromNumber2(request.maxFeePerBlobGas);
  if (typeof request.maxFeePerGas !== "undefined")
    request_rpc.maxFeePerGas = fromNumber2(request.maxFeePerGas);
  if (typeof request.maxPriorityFeePerGas !== "undefined")
    request_rpc.maxPriorityFeePerGas = fromNumber2(request.maxPriorityFeePerGas);
  if (typeof request.maxPriorityFeePerGas !== "undefined")
    request_rpc.maxPriorityFeePerGas = fromNumber2(request.maxPriorityFeePerGas);
  if (typeof request.nonce !== "undefined")
    request_rpc.nonce = fromNumber2(request.nonce);
  if (typeof request.to !== "undefined")
    request_rpc.to = request.to;
  if (typeof request.type !== "undefined")
    request_rpc.type = request.type;
  if (typeof request.value !== "undefined")
    request_rpc.value = fromNumber2(request.value);
  return request_rpc;
}

// node_modules/ox/_esm/core/TypedData.js
var TypedData_exports = {};
__export(TypedData_exports, {
  BytesSizeMismatchError: () => BytesSizeMismatchError,
  InvalidDomainError: () => InvalidDomainError,
  InvalidPrimaryTypeError: () => InvalidPrimaryTypeError,
  InvalidStructTypeError: () => InvalidStructTypeError,
  assert: () => assert8,
  domainSeparator: () => domainSeparator,
  encode: () => encode5,
  encodeData: () => encodeData,
  encodeField: () => encodeField,
  encodeType: () => encodeType,
  extractEip712DomainTypes: () => extractEip712DomainTypes,
  findTypeDependencies: () => findTypeDependencies,
  getSignPayload: () => getSignPayload8,
  hashDomain: () => hashDomain,
  hashStruct: () => hashStruct,
  hashType: () => hashType,
  serialize: () => serialize6,
  validate: () => validate13
});
function assert8(value) {
  const { domain, message, primaryType, types } = value;
  const validateData = (struct, data) => {
    for (const param of struct) {
      const { name, type: type6 } = param;
      const value2 = data[name];
      const integerMatch = type6.match(integerRegex);
      if (integerMatch && (typeof value2 === "number" || typeof value2 === "bigint")) {
        const [, base3, size_] = integerMatch;
        fromNumber2(value2, {
          signed: base3 === "int",
          size: Number.parseInt(size_ ?? "") / 8
        });
      }
      if (type6 === "address" && typeof value2 === "string" && !validate4(value2))
        throw new InvalidAddressError({
          address: value2,
          cause: new InvalidInputError()
        });
      const bytesMatch = type6.match(bytesRegex);
      if (bytesMatch) {
        const [, size4] = bytesMatch;
        if (size4 && size2(value2) !== Number.parseInt(size4))
          throw new BytesSizeMismatchError({
            expectedSize: Number.parseInt(size4),
            givenSize: size2(value2)
          });
      }
      const struct2 = types[type6];
      if (struct2) {
        validateReference(type6);
        validateData(struct2, value2);
      }
    }
  };
  if (types.EIP712Domain && domain) {
    if (typeof domain !== "object")
      throw new InvalidDomainError({ domain });
    validateData(types.EIP712Domain, domain);
  }
  if (primaryType !== "EIP712Domain") {
    if (types[primaryType])
      validateData(types[primaryType], message);
    else
      throw new InvalidPrimaryTypeError({ primaryType, types });
  }
}
function domainSeparator(domain) {
  return hashDomain({
    domain
  });
}
function encode5(value) {
  const { domain = {}, message, primaryType } = value;
  const types = {
    EIP712Domain: extractEip712DomainTypes(domain),
    ...value.types
  };
  assert8({
    domain,
    message,
    primaryType,
    types
  });
  const parts = ["0x19", "0x01"];
  if (domain)
    parts.push(hashDomain({
      domain,
      types
    }));
  if (primaryType !== "EIP712Domain")
    parts.push(hashStruct({
      data: message,
      primaryType,
      types
    }));
  return concat2(...parts);
}
function encodeType(value) {
  const { primaryType, types } = value;
  let result = "";
  const unsortedDeps = findTypeDependencies({ primaryType, types });
  unsortedDeps.delete(primaryType);
  const deps = [primaryType, ...Array.from(unsortedDeps).sort()];
  for (const type6 of deps) {
    result += `${type6}(${(types[type6] ?? []).map(({ name, type: t }) => `${t} ${name}`).join(",")})`;
  }
  return result;
}
function extractEip712DomainTypes(domain) {
  return [
    typeof (domain == null ? void 0 : domain.name) === "string" && { name: "name", type: "string" },
    (domain == null ? void 0 : domain.version) && { name: "version", type: "string" },
    typeof (domain == null ? void 0 : domain.chainId) === "number" && {
      name: "chainId",
      type: "uint256"
    },
    (domain == null ? void 0 : domain.verifyingContract) && {
      name: "verifyingContract",
      type: "address"
    },
    (domain == null ? void 0 : domain.salt) && { name: "salt", type: "bytes32" }
  ].filter(Boolean);
}
function getSignPayload8(value) {
  return keccak256(encode5(value));
}
function hashDomain(value) {
  const { domain, types } = value;
  return hashStruct({
    data: domain,
    primaryType: "EIP712Domain",
    types: {
      ...types,
      EIP712Domain: (types == null ? void 0 : types.EIP712Domain) || extractEip712DomainTypes(domain)
    }
  });
}
function hashStruct(value) {
  const { data, primaryType, types } = value;
  const encoded = encodeData({
    data,
    primaryType,
    types
  });
  return keccak256(encoded);
}
function serialize6(value) {
  const { domain: domain_, message: message_, primaryType, types } = value;
  const normalizeData = (struct, value2) => {
    const data = { ...value2 };
    for (const param of struct) {
      const { name, type: type6 } = param;
      if (type6 === "address")
        data[name] = data[name].toLowerCase();
    }
    return data;
  };
  const domain = (() => {
    if (!domain_)
      return {};
    const type6 = types.EIP712Domain ?? extractEip712DomainTypes(domain_);
    return normalizeData(type6, domain_);
  })();
  const message = (() => {
    if (primaryType === "EIP712Domain")
      return void 0;
    if (!types[primaryType])
      return {};
    return normalizeData(types[primaryType], message_);
  })();
  return stringify({ domain, message, primaryType, types }, (_, value2) => {
    if (typeof value2 === "bigint")
      return value2.toString();
    return value2;
  });
}
function validate13(value) {
  try {
    assert8(value);
    return true;
  } catch {
    return false;
  }
}
var BytesSizeMismatchError = class extends BaseError {
  constructor({ expectedSize, givenSize }) {
    super(`Expected bytes${expectedSize}, got bytes${givenSize}.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "TypedData.BytesSizeMismatchError"
    });
  }
};
var InvalidDomainError = class extends BaseError {
  constructor({ domain }) {
    super(`Invalid domain "${stringify(domain)}".`, {
      metaMessages: ["Must be a valid EIP-712 domain."]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "TypedData.InvalidDomainError"
    });
  }
};
var InvalidPrimaryTypeError = class extends BaseError {
  constructor({ primaryType, types }) {
    super(`Invalid primary type \`${primaryType}\` must be one of \`${JSON.stringify(Object.keys(types))}\`.`, {
      metaMessages: ["Check that the primary type is a key in `types`."]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "TypedData.InvalidPrimaryTypeError"
    });
  }
};
var InvalidStructTypeError = class extends BaseError {
  constructor({ type: type6 }) {
    super(`Struct type "${type6}" is invalid.`, {
      metaMessages: ["Struct type must not be a Solidity type."]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "TypedData.InvalidStructTypeError"
    });
  }
};
function encodeData(value) {
  const { data, primaryType, types } = value;
  const encodedTypes = [{ type: "bytes32" }];
  const encodedValues = [hashType({ primaryType, types })];
  for (const field of types[primaryType] ?? []) {
    const [type6, value2] = encodeField({
      types,
      name: field.name,
      type: field.type,
      value: data[field.name]
    });
    encodedTypes.push(type6);
    encodedValues.push(value2);
  }
  return encode(encodedTypes, encodedValues);
}
function hashType(value) {
  const { primaryType, types } = value;
  const encodedHashType = fromString2(encodeType({ primaryType, types }));
  return keccak256(encodedHashType);
}
function encodeField(properties) {
  let { types, name, type: type6, value } = properties;
  if (types[type6] !== void 0)
    return [
      { type: "bytes32" },
      keccak256(encodeData({ data: value, primaryType: type6, types }))
    ];
  if (type6 === "bytes") {
    const prepend = value.length % 2 ? "0" : "";
    value = `0x${prepend + value.slice(2)}`;
    return [{ type: "bytes32" }, keccak256(value, { as: "Hex" })];
  }
  if (type6 === "string")
    return [
      { type: "bytes32" },
      keccak256(fromString(value), { as: "Hex" })
    ];
  if (type6.lastIndexOf("]") === type6.length - 1) {
    const parsedType = type6.slice(0, type6.lastIndexOf("["));
    const typeValuePairs = value.map((item) => encodeField({
      name,
      type: parsedType,
      types,
      value: item
    }));
    return [
      { type: "bytes32" },
      keccak256(encode(typeValuePairs.map(([t]) => t), typeValuePairs.map(([, v]) => v)))
    ];
  }
  return [{ type: type6 }, value];
}
function findTypeDependencies(value, results = /* @__PURE__ */ new Set()) {
  const { primaryType: primaryType_, types } = value;
  const match = primaryType_.match(/^\w*/u);
  const primaryType = match == null ? void 0 : match[0];
  if (results.has(primaryType) || types[primaryType] === void 0)
    return results;
  results.add(primaryType);
  for (const field of types[primaryType])
    findTypeDependencies({ primaryType: field.type, types }, results);
  return results;
}
function validateReference(type6) {
  if (type6 === "address" || type6 === "bool" || type6 === "string" || type6.startsWith("bytes") || type6.startsWith("uint") || type6.startsWith("int"))
    throw new InvalidStructTypeError({ type: type6 });
}

// node_modules/ox/_esm/core/ValidatorData.js
var ValidatorData_exports = {};
__export(ValidatorData_exports, {
  encode: () => encode6,
  getSignPayload: () => getSignPayload9
});
function encode6(value) {
  const { data, validator } = value;
  return concat2(
    // Validator Data Format: `0x19 ‖ 0x00 ‖ <intended validator address> ‖ <data to sign>`
    "0x19",
    "0x00",
    validator,
    from2(data)
  );
}
function getSignPayload9(value) {
  return keccak256(encode6(value));
}

// node_modules/ox/_esm/core/WebAuthnP256.js
var WebAuthnP256_exports = {};
__export(WebAuthnP256_exports, {
  CredentialCreationFailedError: () => CredentialCreationFailedError,
  CredentialRequestFailedError: () => CredentialRequestFailedError,
  createChallenge: () => createChallenge,
  createCredential: () => createCredential,
  getAuthenticatorData: () => getAuthenticatorData,
  getClientDataJSON: () => getClientDataJSON,
  getCredentialCreationOptions: () => getCredentialCreationOptions,
  getCredentialRequestOptions: () => getCredentialRequestOptions,
  getSignPayload: () => getSignPayload10,
  sign: () => sign4,
  verify: () => verify4
});

// node_modules/ox/_esm/core/internal/webauthn.js
function parseAsn1Signature(bytes) {
  const r_start = bytes[4] === 0 ? 5 : 4;
  const r_end = r_start + 32;
  const s_start = bytes[r_end + 2] === 0 ? r_end + 3 : r_end + 2;
  const r = BigInt(fromBytes(bytes.slice(r_start, r_end)));
  const s = BigInt(fromBytes(bytes.slice(s_start)));
  return {
    r,
    s: s > p256.CURVE.n / 2n ? p256.CURVE.n - s : s
  };
}
async function parseCredentialPublicKey(response) {
  try {
    const publicKeyBuffer = response.getPublicKey();
    if (!publicKeyBuffer)
      throw new CredentialCreationFailedError();
    const publicKeyBytes = new Uint8Array(publicKeyBuffer);
    const cryptoKey = await crypto.subtle.importKey("spki", new Uint8Array(publicKeyBytes), {
      name: "ECDSA",
      namedCurve: "P-256",
      hash: "SHA-256"
    }, true, ["verify"]);
    const publicKey = new Uint8Array(await crypto.subtle.exportKey("raw", cryptoKey));
    return from3(publicKey);
  } catch (error) {
    if (error.message !== "Permission denied to access object")
      throw error;
    const data = new Uint8Array(response.attestationObject);
    const coordinateLength = 32;
    const cborPrefix = 88;
    const findStart = (key) => {
      const coordinate = new Uint8Array([key, cborPrefix, coordinateLength]);
      for (let i = 0; i < data.length - coordinate.length; i++)
        if (coordinate.every((byte, j) => data[i + j] === byte))
          return i + coordinate.length;
      throw new CredentialCreationFailedError();
    };
    const xStart = findStart(33);
    const yStart = findStart(34);
    return from3(new Uint8Array([
      4,
      ...data.slice(xStart, xStart + coordinateLength),
      ...data.slice(yStart, yStart + coordinateLength)
    ]));
  }
}

// node_modules/ox/_esm/core/WebAuthnP256.js
var createChallenge = Uint8Array.from([
  105,
  171,
  180,
  181,
  160,
  222,
  75,
  198,
  42,
  42,
  32,
  31,
  141,
  37,
  186,
  233
]);
async function createCredential(options) {
  const { createFn = window.navigator.credentials.create.bind(window.navigator.credentials), ...rest } = options;
  const creationOptions = getCredentialCreationOptions(rest);
  try {
    const credential = await createFn(creationOptions);
    if (!credential)
      throw new CredentialCreationFailedError();
    const response = credential.response;
    const publicKey = await parseCredentialPublicKey(response);
    return {
      id: credential.id,
      publicKey,
      raw: credential
    };
  } catch (error) {
    throw new CredentialCreationFailedError({
      cause: error
    });
  }
}
function getAuthenticatorData(options = {}) {
  const { flag = 5, rpId = window.location.hostname, signCount = 0 } = options;
  const rpIdHash = sha2562(fromString2(rpId));
  const flag_bytes = fromNumber2(flag, { size: 1 });
  const signCount_bytes = fromNumber2(signCount, { size: 4 });
  return concat2(rpIdHash, flag_bytes, signCount_bytes);
}
function getClientDataJSON(options) {
  const { challenge, crossOrigin = false, extraClientData, origin = window.location.origin } = options;
  return JSON.stringify({
    type: "webauthn.get",
    challenge: fromHex5(challenge, { url: true, pad: false }),
    origin,
    crossOrigin,
    ...extraClientData
  });
}
function getCredentialCreationOptions(options) {
  const { attestation = "none", authenticatorSelection = {
    residentKey: "preferred",
    requireResidentKey: false,
    userVerification: "required"
  }, challenge = createChallenge, excludeCredentialIds, name: name_, rp = {
    id: window.location.hostname,
    name: window.document.title
  }, user, extensions } = options;
  const name = (user == null ? void 0 : user.name) ?? name_;
  return {
    publicKey: {
      attestation,
      authenticatorSelection,
      challenge,
      ...excludeCredentialIds ? {
        excludeCredentials: excludeCredentialIds == null ? void 0 : excludeCredentialIds.map((id) => ({
          id: toBytes7(id),
          type: "public-key"
        }))
      } : {},
      pubKeyCredParams: [
        {
          type: "public-key",
          alg: -7
          // p256
        }
      ],
      rp,
      user: {
        id: (user == null ? void 0 : user.id) ?? keccak256(fromString(name), { as: "Bytes" }),
        name,
        displayName: (user == null ? void 0 : user.displayName) ?? name
      },
      extensions
    }
  };
}
function getCredentialRequestOptions(options) {
  const { credentialId, challenge, rpId = window.location.hostname, userVerification = "required" } = options;
  return {
    publicKey: {
      ...credentialId ? {
        allowCredentials: [
          {
            id: toBytes7(credentialId),
            type: "public-key"
          }
        ]
      } : {},
      challenge: fromHex(challenge),
      rpId,
      userVerification
    }
  };
}
function getSignPayload10(options) {
  const { challenge, crossOrigin, extraClientData, flag, origin, rpId, signCount, userVerification = "required" } = options;
  const authenticatorData = getAuthenticatorData({
    flag,
    rpId,
    signCount
  });
  const clientDataJSON = getClientDataJSON({
    challenge,
    crossOrigin,
    extraClientData,
    origin
  });
  const clientDataJSONHash = sha2562(fromString2(clientDataJSON));
  const challengeIndex = clientDataJSON.indexOf('"challenge"');
  const typeIndex = clientDataJSON.indexOf('"type"');
  const metadata = {
    authenticatorData,
    clientDataJSON,
    challengeIndex,
    typeIndex,
    userVerificationRequired: userVerification === "required"
  };
  const payload = concat2(authenticatorData, clientDataJSONHash);
  return { metadata, payload };
}
async function sign4(options) {
  const { getFn = window.navigator.credentials.get.bind(window.navigator.credentials), ...rest } = options;
  const requestOptions = getCredentialRequestOptions(rest);
  try {
    const credential = await getFn(requestOptions);
    if (!credential)
      throw new CredentialRequestFailedError();
    const response = credential.response;
    const clientDataJSON = String.fromCharCode(...new Uint8Array(response.clientDataJSON));
    const challengeIndex = clientDataJSON.indexOf('"challenge"');
    const typeIndex = clientDataJSON.indexOf('"type"');
    const signature = parseAsn1Signature(new Uint8Array(response.signature));
    return {
      metadata: {
        authenticatorData: fromBytes(new Uint8Array(response.authenticatorData)),
        clientDataJSON,
        challengeIndex,
        typeIndex,
        userVerificationRequired: requestOptions.publicKey.userVerification === "required"
      },
      signature,
      raw: credential
    };
  } catch (error) {
    throw new CredentialRequestFailedError({
      cause: error
    });
  }
}
function verify4(options) {
  const { challenge, hash: hash7 = true, metadata, publicKey, signature } = options;
  const { authenticatorData, challengeIndex, clientDataJSON, typeIndex, userVerificationRequired } = metadata;
  const authenticatorDataBytes = fromHex(authenticatorData);
  if (authenticatorDataBytes.length < 37)
    return false;
  const flag = authenticatorDataBytes[32];
  if ((flag & 1) !== 1)
    return false;
  if (userVerificationRequired && (flag & 4) !== 4)
    return false;
  if ((flag & 8) !== 8 && (flag & 16) === 16)
    return false;
  const type6 = '"type":"webauthn.get"';
  if (type6 !== clientDataJSON.slice(Number(typeIndex), type6.length + 1))
    return false;
  const match = clientDataJSON.slice(Number(challengeIndex)).match(/^"challenge":"(.*?)"/);
  if (!match)
    return false;
  const [_, challenge_extracted] = match;
  if (fromBytes(toBytes7(challenge_extracted)) !== challenge)
    return false;
  const clientDataJSONHash = sha2562(fromString(clientDataJSON), {
    as: "Bytes"
  });
  const payload = concat(authenticatorDataBytes, clientDataJSONHash);
  return verify3({
    hash: hash7,
    payload,
    publicKey,
    signature
  });
}
var CredentialCreationFailedError = class extends BaseError {
  constructor({ cause } = {}) {
    super("Failed to create credential.", {
      cause
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "WebAuthnP256.CredentialCreationFailedError"
    });
  }
};
var CredentialRequestFailedError = class extends BaseError {
  constructor({ cause } = {}) {
    super("Failed to request credential.", {
      cause
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "WebAuthnP256.CredentialRequestFailedError"
    });
  }
};

// node_modules/ox/_esm/core/WebCryptoP256.js
var WebCryptoP256_exports = {};
__export(WebCryptoP256_exports, {
  createKeyPair: () => createKeyPair,
  sign: () => sign5,
  verify: () => verify5
});
async function createKeyPair(options = {}) {
  const { extractable = false } = options;
  const keypair = await globalThis.crypto.subtle.generateKey({
    name: "ECDSA",
    namedCurve: "P-256"
  }, extractable, ["sign", "verify"]);
  const publicKey_raw = await globalThis.crypto.subtle.exportKey("raw", keypair.publicKey);
  const publicKey = from3(new Uint8Array(publicKey_raw));
  return {
    privateKey: keypair.privateKey,
    publicKey
  };
}
async function sign5(options) {
  const { payload, privateKey } = options;
  const signature = await globalThis.crypto.subtle.sign({
    name: "ECDSA",
    hash: "SHA-256"
  }, privateKey, from(payload));
  const signature_bytes = fromArray(new Uint8Array(signature));
  const r = toBigInt(slice(signature_bytes, 0, 32));
  let s = toBigInt(slice(signature_bytes, 32, 64));
  if (s > p256.CURVE.n / 2n)
    s = p256.CURVE.n - s;
  return { r, s };
}
async function verify5(options) {
  const { payload, signature } = options;
  const publicKey = await globalThis.crypto.subtle.importKey("raw", toBytes3(options.publicKey), { name: "ECDSA", namedCurve: "P-256" }, true, ["verify"]);
  return await globalThis.crypto.subtle.verify({
    name: "ECDSA",
    hash: "SHA-256"
  }, publicKey, concat(fromNumber(signature.r), fromNumber(signature.s)), from(payload));
}

// node_modules/ox/_esm/core/internal/ens.js
function unwrapLabelhash(label) {
  if (label.length !== 66)
    return null;
  if (label.indexOf("[") !== 0)
    return null;
  if (label.indexOf("]") !== 65)
    return null;
  const hash7 = `0x${label.slice(1, 65)}`;
  if (!validate2(hash7, { strict: true }))
    return null;
  return hash7;
}

// node_modules/ox/_esm/core/Ens.js
function labelhash(label) {
  const result = new Uint8Array(32).fill(0);
  if (!label)
    return fromBytes(result);
  return unwrapLabelhash(label) || keccak256(fromString2(label));
}
function namehash(name) {
  let result = new Uint8Array(32).fill(0);
  if (!name)
    return fromBytes(result);
  const labels = name.split(".");
  for (let i = labels.length - 1; i >= 0; i -= 1) {
    const hashFromEncodedLabel = unwrapLabelhash(labels[i]);
    const hashed = hashFromEncodedLabel ? fromHex(hashFromEncodedLabel) : keccak256(fromString(labels[i]), { as: "Bytes" });
    result = keccak256(concat(result, hashed), { as: "Bytes" });
  }
  return fromBytes(result);
}
function normalize3(name) {
  return ens_normalize(name);
}

// node_modules/viem/_esm/utils/ens/normalize.js
function normalize4(name) {
  return normalize3(name);
}

// node_modules/@rainbow-me/rainbowkit/dist/index.js
var import_react19 = __toESM(require_react());
var import_react20 = __toESM(require_react());
var import_react21 = __toESM(require_react());
var import_react22 = __toESM(require_react());
var import_react23 = __toESM(require_react());
var import_react_dom = __toESM(require_react_dom());

// node_modules/react-remove-scroll/dist/es2015/Combination.js
init_tslib_es6();
var React9 = __toESM(require_react());

// node_modules/react-remove-scroll/dist/es2015/UI.js
init_tslib_es6();
var React5 = __toESM(require_react());

// node_modules/react-remove-scroll-bar/dist/es2015/constants.js
var zeroRightClassName = "right-scroll-bar-position";
var fullWidthClassName = "width-before-scroll-bar";
var noScrollbarsClassName = "with-scroll-bars-hidden";
var removedBarSizeVariable = "--removed-body-scroll-bar-size";

// node_modules/use-callback-ref/dist/es2015/assignRef.js
function assignRef(ref, value) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
  return ref;
}

// node_modules/use-callback-ref/dist/es2015/useRef.js
var import_react = __toESM(require_react());
function useCallbackRef(initialValue, callback) {
  var ref = (0, import_react.useState)(function() {
    return {
      // value
      value: initialValue,
      // last callback
      callback,
      // "memoized" public interface
      facade: {
        get current() {
          return ref.value;
        },
        set current(value) {
          var last = ref.value;
          if (last !== value) {
            ref.value = value;
            ref.callback(value, last);
          }
        }
      }
    };
  })[0];
  ref.callback = callback;
  return ref.facade;
}

// node_modules/use-callback-ref/dist/es2015/useMergeRef.js
var React = __toESM(require_react());
var useIsomorphicLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;
var currentValues = /* @__PURE__ */ new WeakMap();
function useMergeRefs(refs, defaultValue) {
  var callbackRef = useCallbackRef(defaultValue || null, function(newValue) {
    return refs.forEach(function(ref) {
      return assignRef(ref, newValue);
    });
  });
  useIsomorphicLayoutEffect(function() {
    var oldValue = currentValues.get(callbackRef);
    if (oldValue) {
      var prevRefs_1 = new Set(oldValue);
      var nextRefs_1 = new Set(refs);
      var current_1 = callbackRef.current;
      prevRefs_1.forEach(function(ref) {
        if (!nextRefs_1.has(ref)) {
          assignRef(ref, null);
        }
      });
      nextRefs_1.forEach(function(ref) {
        if (!prevRefs_1.has(ref)) {
          assignRef(ref, current_1);
        }
      });
    }
    currentValues.set(callbackRef, refs);
  }, [refs]);
  return callbackRef;
}

// node_modules/use-sidecar/dist/es2015/hoc.js
init_tslib_es6();
var React2 = __toESM(require_react());

// node_modules/use-sidecar/dist/es2015/hook.js
var import_react2 = __toESM(require_react());

// node_modules/use-sidecar/dist/es2015/medium.js
init_tslib_es6();
function ItoI(a) {
  return a;
}
function innerCreateMedium(defaults, middleware) {
  if (middleware === void 0) {
    middleware = ItoI;
  }
  var buffer2 = [];
  var assigned = false;
  var medium = {
    read: function() {
      if (assigned) {
        throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
      }
      if (buffer2.length) {
        return buffer2[buffer2.length - 1];
      }
      return defaults;
    },
    useMedium: function(data) {
      var item = middleware(data, assigned);
      buffer2.push(item);
      return function() {
        buffer2 = buffer2.filter(function(x) {
          return x !== item;
        });
      };
    },
    assignSyncMedium: function(cb) {
      assigned = true;
      while (buffer2.length) {
        var cbs = buffer2;
        buffer2 = [];
        cbs.forEach(cb);
      }
      buffer2 = {
        push: function(x) {
          return cb(x);
        },
        filter: function() {
          return buffer2;
        }
      };
    },
    assignMedium: function(cb) {
      assigned = true;
      var pendingQueue = [];
      if (buffer2.length) {
        var cbs = buffer2;
        buffer2 = [];
        cbs.forEach(cb);
        pendingQueue = buffer2;
      }
      var executeQueue = function() {
        var cbs2 = pendingQueue;
        pendingQueue = [];
        cbs2.forEach(cb);
      };
      var cycle = function() {
        return Promise.resolve().then(executeQueue);
      };
      cycle();
      buffer2 = {
        push: function(x) {
          pendingQueue.push(x);
          cycle();
        },
        filter: function(filter) {
          pendingQueue = pendingQueue.filter(filter);
          return buffer2;
        }
      };
    }
  };
  return medium;
}
function createSidecarMedium(options) {
  if (options === void 0) {
    options = {};
  }
  var medium = innerCreateMedium(null);
  medium.options = __assign({ async: true, ssr: false }, options);
  return medium;
}

// node_modules/use-sidecar/dist/es2015/renderProp.js
init_tslib_es6();
var React3 = __toESM(require_react());
var import_react3 = __toESM(require_react());

// node_modules/use-sidecar/dist/es2015/exports.js
init_tslib_es6();
var React4 = __toESM(require_react());
var SideCar = function(_a) {
  var sideCar = _a.sideCar, rest = __rest(_a, ["sideCar"]);
  if (!sideCar) {
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  }
  var Target = sideCar.read();
  if (!Target) {
    throw new Error("Sidecar medium not found");
  }
  return React4.createElement(Target, __assign({}, rest));
};
SideCar.isSideCarExport = true;
function exportSidecar(medium, exported) {
  medium.useMedium(exported);
  return SideCar;
}

// node_modules/react-remove-scroll/dist/es2015/medium.js
var effectCar = createSidecarMedium();

// node_modules/react-remove-scroll/dist/es2015/UI.js
var nothing = function() {
  return;
};
var RemoveScroll = React5.forwardRef(function(props, parentRef) {
  var ref = React5.useRef(null);
  var _a = React5.useState({
    onScrollCapture: nothing,
    onWheelCapture: nothing,
    onTouchMoveCapture: nothing
  }), callbacks = _a[0], setCallbacks = _a[1];
  var forwardProps = props.forwardProps, children = props.children, className = props.className, removeScrollBar = props.removeScrollBar, enabled = props.enabled, shards = props.shards, sideCar = props.sideCar, noIsolation = props.noIsolation, inert = props.inert, allowPinchZoom = props.allowPinchZoom, _b = props.as, Container = _b === void 0 ? "div" : _b, gapMode = props.gapMode, rest = __rest(props, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]);
  var SideCar2 = sideCar;
  var containerRef = useMergeRefs([ref, parentRef]);
  var containerProps = __assign(__assign({}, rest), callbacks);
  return React5.createElement(
    React5.Fragment,
    null,
    enabled && React5.createElement(SideCar2, { sideCar: effectCar, removeScrollBar, shards, noIsolation, inert, setCallbacks, allowPinchZoom: !!allowPinchZoom, lockRef: ref, gapMode }),
    forwardProps ? React5.cloneElement(React5.Children.only(children), __assign(__assign({}, containerProps), { ref: containerRef })) : React5.createElement(Container, __assign({}, containerProps, { className, ref: containerRef }), children)
  );
});
RemoveScroll.defaultProps = {
  enabled: true,
  removeScrollBar: true,
  inert: false
};
RemoveScroll.classNames = {
  fullWidth: fullWidthClassName,
  zeroRight: zeroRightClassName
};

// node_modules/react-remove-scroll/dist/es2015/SideEffect.js
init_tslib_es6();
var React8 = __toESM(require_react());

// node_modules/react-remove-scroll-bar/dist/es2015/component.js
var React7 = __toESM(require_react());

// node_modules/react-style-singleton/dist/es2015/hook.js
var React6 = __toESM(require_react());

// node_modules/get-nonce/dist/es2015/index.js
var currentNonce;
var getNonce = function() {
  if (currentNonce) {
    return currentNonce;
  }
  if (typeof __webpack_nonce__ !== "undefined") {
    return __webpack_nonce__;
  }
  return void 0;
};

// node_modules/react-style-singleton/dist/es2015/singleton.js
function makeStyleTag() {
  if (!document)
    return null;
  var tag = document.createElement("style");
  tag.type = "text/css";
  var nonce = getNonce();
  if (nonce) {
    tag.setAttribute("nonce", nonce);
  }
  return tag;
}
function injectStyles(tag, css) {
  if (tag.styleSheet) {
    tag.styleSheet.cssText = css;
  } else {
    tag.appendChild(document.createTextNode(css));
  }
}
function insertStyleTag(tag) {
  var head = document.head || document.getElementsByTagName("head")[0];
  head.appendChild(tag);
}
var stylesheetSingleton = function() {
  var counter = 0;
  var stylesheet = null;
  return {
    add: function(style) {
      if (counter == 0) {
        if (stylesheet = makeStyleTag()) {
          injectStyles(stylesheet, style);
          insertStyleTag(stylesheet);
        }
      }
      counter++;
    },
    remove: function() {
      counter--;
      if (!counter && stylesheet) {
        stylesheet.parentNode && stylesheet.parentNode.removeChild(stylesheet);
        stylesheet = null;
      }
    }
  };
};

// node_modules/react-style-singleton/dist/es2015/hook.js
var styleHookSingleton = function() {
  var sheet = stylesheetSingleton();
  return function(styles, isDynamic) {
    React6.useEffect(function() {
      sheet.add(styles);
      return function() {
        sheet.remove();
      };
    }, [styles && isDynamic]);
  };
};

// node_modules/react-style-singleton/dist/es2015/component.js
var styleSingleton = function() {
  var useStyle = styleHookSingleton();
  var Sheet = function(_a) {
    var styles = _a.styles, dynamic = _a.dynamic;
    useStyle(styles, dynamic);
    return null;
  };
  return Sheet;
};

// node_modules/react-remove-scroll-bar/dist/es2015/utils.js
var zeroGap = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
};
var parse2 = function(x) {
  return parseInt(x || "", 10) || 0;
};
var getOffset = function(gapMode) {
  var cs = window.getComputedStyle(document.body);
  var left = cs[gapMode === "padding" ? "paddingLeft" : "marginLeft"];
  var top = cs[gapMode === "padding" ? "paddingTop" : "marginTop"];
  var right = cs[gapMode === "padding" ? "paddingRight" : "marginRight"];
  return [parse2(left), parse2(top), parse2(right)];
};
var getGapWidth = function(gapMode) {
  if (gapMode === void 0) {
    gapMode = "margin";
  }
  if (typeof window === "undefined") {
    return zeroGap;
  }
  var offsets = getOffset(gapMode);
  var documentWidth = document.documentElement.clientWidth;
  var windowWidth = window.innerWidth;
  return {
    left: offsets[0],
    top: offsets[1],
    right: offsets[2],
    gap: Math.max(0, windowWidth - documentWidth + offsets[2] - offsets[0])
  };
};

// node_modules/react-remove-scroll-bar/dist/es2015/component.js
var Style = styleSingleton();
var lockAttribute = "data-scroll-locked";
var getStyles = function(_a, allowRelative, gapMode, important) {
  var left = _a.left, top = _a.top, right = _a.right, gap = _a.gap;
  if (gapMode === void 0) {
    gapMode = "margin";
  }
  return "\n  .".concat(noScrollbarsClassName, " {\n   overflow: hidden ").concat(important, ";\n   padding-right: ").concat(gap, "px ").concat(important, ";\n  }\n  body[").concat(lockAttribute, "] {\n    overflow: hidden ").concat(important, ";\n    overscroll-behavior: contain;\n    ").concat([
    allowRelative && "position: relative ".concat(important, ";"),
    gapMode === "margin" && "\n    padding-left: ".concat(left, "px;\n    padding-top: ").concat(top, "px;\n    padding-right: ").concat(right, "px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: ").concat(gap, "px ").concat(important, ";\n    "),
    gapMode === "padding" && "padding-right: ".concat(gap, "px ").concat(important, ";")
  ].filter(Boolean).join(""), "\n  }\n  \n  .").concat(zeroRightClassName, " {\n    right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " {\n    margin-right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(zeroRightClassName, " .").concat(zeroRightClassName, " {\n    right: 0 ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " .").concat(fullWidthClassName, " {\n    margin-right: 0 ").concat(important, ";\n  }\n  \n  body[").concat(lockAttribute, "] {\n    ").concat(removedBarSizeVariable, ": ").concat(gap, "px;\n  }\n");
};
var getCurrentUseCounter = function() {
  var counter = parseInt(document.body.getAttribute(lockAttribute) || "0", 10);
  return isFinite(counter) ? counter : 0;
};
var useLockAttribute = function() {
  React7.useEffect(function() {
    document.body.setAttribute(lockAttribute, (getCurrentUseCounter() + 1).toString());
    return function() {
      var newCounter = getCurrentUseCounter() - 1;
      if (newCounter <= 0) {
        document.body.removeAttribute(lockAttribute);
      } else {
        document.body.setAttribute(lockAttribute, newCounter.toString());
      }
    };
  }, []);
};
var RemoveScrollBar = function(_a) {
  var noRelative = _a.noRelative, noImportant = _a.noImportant, _b = _a.gapMode, gapMode = _b === void 0 ? "margin" : _b;
  useLockAttribute();
  var gap = React7.useMemo(function() {
    return getGapWidth(gapMode);
  }, [gapMode]);
  return React7.createElement(Style, { styles: getStyles(gap, !noRelative, gapMode, !noImportant ? "!important" : "") });
};

// node_modules/react-remove-scroll/dist/es2015/aggresiveCapture.js
var passiveSupported = false;
if (typeof window !== "undefined") {
  try {
    options = Object.defineProperty({}, "passive", {
      get: function() {
        passiveSupported = true;
        return true;
      }
    });
    window.addEventListener("test", options, options);
    window.removeEventListener("test", options, options);
  } catch (err) {
    passiveSupported = false;
  }
}
var options;
var nonPassive = passiveSupported ? { passive: false } : false;

// node_modules/react-remove-scroll/dist/es2015/handleScroll.js
var alwaysContainsScroll = function(node) {
  return node.tagName === "TEXTAREA";
};
var elementCanBeScrolled = function(node, overflow) {
  if (!(node instanceof Element)) {
    return false;
  }
  var styles = window.getComputedStyle(node);
  return (
    // not-not-scrollable
    styles[overflow] !== "hidden" && // contains scroll inside self
    !(styles.overflowY === styles.overflowX && !alwaysContainsScroll(node) && styles[overflow] === "visible")
  );
};
var elementCouldBeVScrolled = function(node) {
  return elementCanBeScrolled(node, "overflowY");
};
var elementCouldBeHScrolled = function(node) {
  return elementCanBeScrolled(node, "overflowX");
};
var locationCouldBeScrolled = function(axis, node) {
  var ownerDocument = node.ownerDocument;
  var current = node;
  do {
    if (typeof ShadowRoot !== "undefined" && current instanceof ShadowRoot) {
      current = current.host;
    }
    var isScrollable = elementCouldBeScrolled(axis, current);
    if (isScrollable) {
      var _a = getScrollVariables(axis, current), scrollHeight = _a[1], clientHeight = _a[2];
      if (scrollHeight > clientHeight) {
        return true;
      }
    }
    current = current.parentNode;
  } while (current && current !== ownerDocument.body);
  return false;
};
var getVScrollVariables = function(_a) {
  var scrollTop = _a.scrollTop, scrollHeight = _a.scrollHeight, clientHeight = _a.clientHeight;
  return [
    scrollTop,
    scrollHeight,
    clientHeight
  ];
};
var getHScrollVariables = function(_a) {
  var scrollLeft = _a.scrollLeft, scrollWidth = _a.scrollWidth, clientWidth = _a.clientWidth;
  return [
    scrollLeft,
    scrollWidth,
    clientWidth
  ];
};
var elementCouldBeScrolled = function(axis, node) {
  return axis === "v" ? elementCouldBeVScrolled(node) : elementCouldBeHScrolled(node);
};
var getScrollVariables = function(axis, node) {
  return axis === "v" ? getVScrollVariables(node) : getHScrollVariables(node);
};
var getDirectionFactor = function(axis, direction) {
  return axis === "h" && direction === "rtl" ? -1 : 1;
};
var handleScroll = function(axis, endTarget, event, sourceDelta, noOverscroll) {
  var directionFactor = getDirectionFactor(axis, window.getComputedStyle(endTarget).direction);
  var delta = directionFactor * sourceDelta;
  var target = event.target;
  var targetInLock = endTarget.contains(target);
  var shouldCancelScroll = false;
  var isDeltaPositive = delta > 0;
  var availableScroll = 0;
  var availableScrollTop = 0;
  do {
    var _a = getScrollVariables(axis, target), position = _a[0], scroll_1 = _a[1], capacity = _a[2];
    var elementScroll = scroll_1 - capacity - directionFactor * position;
    if (position || elementScroll) {
      if (elementCouldBeScrolled(axis, target)) {
        availableScroll += elementScroll;
        availableScrollTop += position;
      }
    }
    if (target instanceof ShadowRoot) {
      target = target.host;
    } else {
      target = target.parentNode;
    }
  } while (
    // portaled content
    !targetInLock && target !== document.body || // self content
    targetInLock && (endTarget.contains(target) || endTarget === target)
  );
  if (isDeltaPositive && (noOverscroll && Math.abs(availableScroll) < 1 || !noOverscroll && delta > availableScroll)) {
    shouldCancelScroll = true;
  } else if (!isDeltaPositive && (noOverscroll && Math.abs(availableScrollTop) < 1 || !noOverscroll && -delta > availableScrollTop)) {
    shouldCancelScroll = true;
  }
  return shouldCancelScroll;
};

// node_modules/react-remove-scroll/dist/es2015/SideEffect.js
var getTouchXY = function(event) {
  return "changedTouches" in event ? [event.changedTouches[0].clientX, event.changedTouches[0].clientY] : [0, 0];
};
var getDeltaXY = function(event) {
  return [event.deltaX, event.deltaY];
};
var extractRef = function(ref) {
  return ref && "current" in ref ? ref.current : ref;
};
var deltaCompare = function(x, y) {
  return x[0] === y[0] && x[1] === y[1];
};
var generateStyle = function(id) {
  return "\n  .block-interactivity-".concat(id, " {pointer-events: none;}\n  .allow-interactivity-").concat(id, " {pointer-events: all;}\n");
};
var idCounter = 0;
var lockStack = [];
function RemoveScrollSideCar(props) {
  var shouldPreventQueue = React8.useRef([]);
  var touchStartRef = React8.useRef([0, 0]);
  var activeAxis = React8.useRef();
  var id = React8.useState(idCounter++)[0];
  var Style2 = React8.useState(styleSingleton)[0];
  var lastProps = React8.useRef(props);
  React8.useEffect(function() {
    lastProps.current = props;
  }, [props]);
  React8.useEffect(function() {
    if (props.inert) {
      document.body.classList.add("block-interactivity-".concat(id));
      var allow_1 = __spreadArray([props.lockRef.current], (props.shards || []).map(extractRef), true).filter(Boolean);
      allow_1.forEach(function(el) {
        return el.classList.add("allow-interactivity-".concat(id));
      });
      return function() {
        document.body.classList.remove("block-interactivity-".concat(id));
        allow_1.forEach(function(el) {
          return el.classList.remove("allow-interactivity-".concat(id));
        });
      };
    }
    return;
  }, [props.inert, props.lockRef.current, props.shards]);
  var shouldCancelEvent = React8.useCallback(function(event, parent) {
    if ("touches" in event && event.touches.length === 2 || event.type === "wheel" && event.ctrlKey) {
      return !lastProps.current.allowPinchZoom;
    }
    var touch = getTouchXY(event);
    var touchStart = touchStartRef.current;
    var deltaX = "deltaX" in event ? event.deltaX : touchStart[0] - touch[0];
    var deltaY = "deltaY" in event ? event.deltaY : touchStart[1] - touch[1];
    var currentAxis;
    var target = event.target;
    var moveDirection = Math.abs(deltaX) > Math.abs(deltaY) ? "h" : "v";
    if ("touches" in event && moveDirection === "h" && target.type === "range") {
      return false;
    }
    var canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
    if (!canBeScrolledInMainDirection) {
      return true;
    }
    if (canBeScrolledInMainDirection) {
      currentAxis = moveDirection;
    } else {
      currentAxis = moveDirection === "v" ? "h" : "v";
      canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
    }
    if (!canBeScrolledInMainDirection) {
      return false;
    }
    if (!activeAxis.current && "changedTouches" in event && (deltaX || deltaY)) {
      activeAxis.current = currentAxis;
    }
    if (!currentAxis) {
      return true;
    }
    var cancelingAxis = activeAxis.current || currentAxis;
    return handleScroll(cancelingAxis, parent, event, cancelingAxis === "h" ? deltaX : deltaY, true);
  }, []);
  var shouldPrevent = React8.useCallback(function(_event) {
    var event = _event;
    if (!lockStack.length || lockStack[lockStack.length - 1] !== Style2) {
      return;
    }
    var delta = "deltaY" in event ? getDeltaXY(event) : getTouchXY(event);
    var sourceEvent = shouldPreventQueue.current.filter(function(e) {
      return e.name === event.type && (e.target === event.target || event.target === e.shadowParent) && deltaCompare(e.delta, delta);
    })[0];
    if (sourceEvent && sourceEvent.should) {
      if (event.cancelable) {
        event.preventDefault();
      }
      return;
    }
    if (!sourceEvent) {
      var shardNodes = (lastProps.current.shards || []).map(extractRef).filter(Boolean).filter(function(node) {
        return node.contains(event.target);
      });
      var shouldStop = shardNodes.length > 0 ? shouldCancelEvent(event, shardNodes[0]) : !lastProps.current.noIsolation;
      if (shouldStop) {
        if (event.cancelable) {
          event.preventDefault();
        }
      }
    }
  }, []);
  var shouldCancel = React8.useCallback(function(name, delta, target, should) {
    var event = { name, delta, target, should, shadowParent: getOutermostShadowParent(target) };
    shouldPreventQueue.current.push(event);
    setTimeout(function() {
      shouldPreventQueue.current = shouldPreventQueue.current.filter(function(e) {
        return e !== event;
      });
    }, 1);
  }, []);
  var scrollTouchStart = React8.useCallback(function(event) {
    touchStartRef.current = getTouchXY(event);
    activeAxis.current = void 0;
  }, []);
  var scrollWheel = React8.useCallback(function(event) {
    shouldCancel(event.type, getDeltaXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
  }, []);
  var scrollTouchMove = React8.useCallback(function(event) {
    shouldCancel(event.type, getTouchXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
  }, []);
  React8.useEffect(function() {
    lockStack.push(Style2);
    props.setCallbacks({
      onScrollCapture: scrollWheel,
      onWheelCapture: scrollWheel,
      onTouchMoveCapture: scrollTouchMove
    });
    document.addEventListener("wheel", shouldPrevent, nonPassive);
    document.addEventListener("touchmove", shouldPrevent, nonPassive);
    document.addEventListener("touchstart", scrollTouchStart, nonPassive);
    return function() {
      lockStack = lockStack.filter(function(inst) {
        return inst !== Style2;
      });
      document.removeEventListener("wheel", shouldPrevent, nonPassive);
      document.removeEventListener("touchmove", shouldPrevent, nonPassive);
      document.removeEventListener("touchstart", scrollTouchStart, nonPassive);
    };
  }, []);
  var removeScrollBar = props.removeScrollBar, inert = props.inert;
  return React8.createElement(
    React8.Fragment,
    null,
    inert ? React8.createElement(Style2, { styles: generateStyle(id) }) : null,
    removeScrollBar ? React8.createElement(RemoveScrollBar, { gapMode: props.gapMode }) : null
  );
}
function getOutermostShadowParent(node) {
  var shadowParent = null;
  while (node !== null) {
    if (node instanceof ShadowRoot) {
      shadowParent = node.host;
      node = node.host;
    }
    node = node.parentNode;
  }
  return shadowParent;
}

// node_modules/react-remove-scroll/dist/es2015/sidecar.js
var sidecar_default = exportSidecar(effectCar, RemoveScrollSideCar);

// node_modules/react-remove-scroll/dist/es2015/Combination.js
var ReactRemoveScroll = React9.forwardRef(function(props, ref) {
  return React9.createElement(RemoveScroll, __assign({}, props, { ref, sideCar: sidecar_default }));
});
ReactRemoveScroll.classNames = RemoveScroll.classNames;
var Combination_default = ReactRemoveScroll;

// node_modules/@rainbow-me/rainbowkit/dist/index.js
var import_react24 = __toESM(require_react());

// node_modules/@vanilla-extract/private/dist/vanilla-extract-private.esm.js
function getVarName(variable) {
  var matches = variable.match(/^var\((.*)\)$/);
  if (matches) {
    return matches[1];
  }
  return variable;
}
function get(obj, path2) {
  var result = obj;
  for (var key of path2) {
    if (!(key in result)) {
      throw new Error("Path ".concat(path2.join(" -> "), " does not exist in object"));
    }
    result = result[key];
  }
  return result;
}
function walkObject(obj, fn) {
  var path2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
  var clone = {};
  for (var key in obj) {
    var _value = obj[key];
    var currentPath = [...path2, key];
    if (typeof _value === "string" || typeof _value === "number" || _value == null) {
      clone[key] = fn(_value, currentPath);
    } else if (typeof _value === "object" && !Array.isArray(_value)) {
      clone[key] = walkObject(_value, fn, currentPath);
    } else {
      console.warn('Skipping invalid key "'.concat(currentPath.join("."), '". Should be a string, number, null or object. Received: "').concat(Array.isArray(_value) ? "Array" : typeof _value, '"'));
    }
  }
  return clone;
}

// node_modules/@vanilla-extract/dynamic/dist/vanilla-extract-dynamic.esm.js
function assignInlineVars(varsOrContract, tokens) {
  var styles = {};
  if (typeof tokens === "object") {
    var _contract = varsOrContract;
    walkObject(tokens, (value2, path2) => {
      if (value2 == null) {
        return;
      }
      var varName2 = get(_contract, path2);
      styles[getVarName(varName2)] = String(value2);
    });
  } else {
    var _vars = varsOrContract;
    for (var varName in _vars) {
      var value = _vars[varName];
      if (value == null) {
        continue;
      }
      styles[getVarName(varName)] = value;
    }
  }
  Object.defineProperty(styles, "toString", {
    value: function value2() {
      return Object.keys(this).map((key) => "".concat(key, ":").concat(this[key])).join(";");
    },
    writable: false
  });
  return styles;
}

// node_modules/@rainbow-me/rainbowkit/dist/index.js
var import_react25 = __toESM(require_react());
var import_react26 = __toESM(require_react());
var import_react27 = __toESM(require_react());
var import_react28 = __toESM(require_react());
var import_react29 = __toESM(require_react());
var import_react30 = __toESM(require_react());
var import_react31 = __toESM(require_react());
var import_react32 = __toESM(require_react());
var import_ua_parser_js = __toESM(require_ua_parser());
var import_react33 = __toESM(require_react());
var import_react34 = __toESM(require_react());
var import_react35 = __toESM(require_react());
var import_react36 = __toESM(require_react());
var import_react37 = __toESM(require_react());
var import_react38 = __toESM(require_react());
var import_react39 = __toESM(require_react());
var import_react40 = __toESM(require_react());
var import_react41 = __toESM(require_react());
var import_react42 = __toESM(require_react());
var import_react43 = __toESM(require_react());
var import_react44 = __toESM(require_react());
var import_react45 = __toESM(require_react());
var import_react46 = __toESM(require_react());
var import_react47 = __toESM(require_react());
var import_react48 = __toESM(require_react());
var import_react49 = __toESM(require_react());
var import_react50 = __toESM(require_react());
var import_react51 = __toESM(require_react());
var import_react52 = __toESM(require_react());
var import_react53 = __toESM(require_react());
var import_react54 = __toESM(require_react());
var import_react55 = __toESM(require_react());
var import_react56 = __toESM(require_react());
var import_react57 = __toESM(require_react());
var import_react58 = __toESM(require_react());
var import_react59 = __toESM(require_react());
var import_react60 = __toESM(require_react());
var import_react61 = __toESM(require_react());
var import_react62 = __toESM(require_react());
var import_react63 = __toESM(require_react());
var import_react64 = __toESM(require_react());
var import_react65 = __toESM(require_react());
var import_react66 = __toESM(require_react());
var import_react67 = __toESM(require_react());
var import_react68 = __toESM(require_react());
var import_react69 = __toESM(require_react());
var import_react70 = __toESM(require_react());
var import_react71 = __toESM(require_react());
var import_react72 = __toESM(require_react());
var import_react73 = __toESM(require_react());
var import_qrcode = __toESM(require_browser());
var import_react74 = __toESM(require_react());
var import_react75 = __toESM(require_react());
var import_react76 = __toESM(require_react());
var import_react77 = __toESM(require_react());
var import_react78 = __toESM(require_react());

// node_modules/@wagmi/connectors/dist/esm/coinbaseWallet.js
coinbaseWallet.type = "coinbaseWallet";
function coinbaseWallet(parameters = {}) {
  if (parameters.version === "3" || parameters.headlessMode)
    return version3(parameters);
  return version4(parameters);
}
function version4(parameters) {
  let walletProvider;
  let accountsChanged;
  let chainChanged;
  let disconnect;
  return createConnector((config) => ({
    id: "coinbaseWalletSDK",
    name: "Coinbase Wallet",
    rdns: "com.coinbase.wallet",
    type: coinbaseWallet.type,
    async connect({ chainId, ...rest } = {}) {
      try {
        const provider = await this.getProvider();
        const accounts = (await provider.request({
          method: "eth_requestAccounts",
          params: "instantOnboarding" in rest && rest.instantOnboarding ? [{ onboarding: "instant" }] : []
        })).map((x) => getAddress(x));
        if (!accountsChanged) {
          accountsChanged = this.onAccountsChanged.bind(this);
          provider.on("accountsChanged", accountsChanged);
        }
        if (!chainChanged) {
          chainChanged = this.onChainChanged.bind(this);
          provider.on("chainChanged", chainChanged);
        }
        if (!disconnect) {
          disconnect = this.onDisconnect.bind(this);
          provider.on("disconnect", disconnect);
        }
        let currentChainId = await this.getChainId();
        if (chainId && currentChainId !== chainId) {
          const chain2 = await this.switchChain({ chainId }).catch((error) => {
            if (error.code === UserRejectedRequestError.code)
              throw error;
            return { id: currentChainId };
          });
          currentChainId = (chain2 == null ? void 0 : chain2.id) ?? currentChainId;
        }
        return { accounts, chainId: currentChainId };
      } catch (error) {
        if (/(user closed modal|accounts received is empty|user denied account|request rejected)/i.test(error.message))
          throw new UserRejectedRequestError(error);
        throw error;
      }
    },
    async disconnect() {
      var _a;
      const provider = await this.getProvider();
      if (accountsChanged) {
        provider.removeListener("accountsChanged", accountsChanged);
        accountsChanged = void 0;
      }
      if (chainChanged) {
        provider.removeListener("chainChanged", chainChanged);
        chainChanged = void 0;
      }
      if (disconnect) {
        provider.removeListener("disconnect", disconnect);
        disconnect = void 0;
      }
      provider.disconnect();
      (_a = provider.close) == null ? void 0 : _a.call(provider);
    },
    async getAccounts() {
      const provider = await this.getProvider();
      return (await provider.request({
        method: "eth_accounts"
      })).map((x) => getAddress(x));
    },
    async getChainId() {
      const provider = await this.getProvider();
      const chainId = await provider.request({
        method: "eth_chainId"
      });
      return Number(chainId);
    },
    async getProvider() {
      if (!walletProvider) {
        const preference = (() => {
          var _a;
          if (typeof parameters.preference === "string")
            return { options: parameters.preference };
          return {
            ...parameters.preference,
            options: ((_a = parameters.preference) == null ? void 0 : _a.options) ?? "all"
          };
        })();
        const { createCoinbaseWalletSDK } = await import("./dist-2TARYAKD.js");
        const sdk = createCoinbaseWalletSDK({
          ...parameters,
          appChainIds: config.chains.map((x) => x.id),
          preference
        });
        walletProvider = sdk.getProvider();
      }
      return walletProvider;
    },
    async isAuthorized() {
      try {
        const accounts = await this.getAccounts();
        return !!accounts.length;
      } catch {
        return false;
      }
    },
    async switchChain({ addEthereumChainParameter, chainId }) {
      var _a, _b, _c, _d;
      const chain2 = config.chains.find((chain3) => chain3.id === chainId);
      if (!chain2)
        throw new SwitchChainError(new ChainNotConfiguredError());
      const provider = await this.getProvider();
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: numberToHex(chain2.id) }]
        });
        return chain2;
      } catch (error) {
        if (error.code === 4902) {
          try {
            let blockExplorerUrls;
            if (addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.blockExplorerUrls)
              blockExplorerUrls = addEthereumChainParameter.blockExplorerUrls;
            else
              blockExplorerUrls = ((_a = chain2.blockExplorers) == null ? void 0 : _a.default.url) ? [(_b = chain2.blockExplorers) == null ? void 0 : _b.default.url] : [];
            let rpcUrls;
            if ((_c = addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.rpcUrls) == null ? void 0 : _c.length)
              rpcUrls = addEthereumChainParameter.rpcUrls;
            else
              rpcUrls = [((_d = chain2.rpcUrls.default) == null ? void 0 : _d.http[0]) ?? ""];
            const addEthereumChain = {
              blockExplorerUrls,
              chainId: numberToHex(chainId),
              chainName: (addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.chainName) ?? chain2.name,
              iconUrls: addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.iconUrls,
              nativeCurrency: (addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.nativeCurrency) ?? chain2.nativeCurrency,
              rpcUrls
            };
            await provider.request({
              method: "wallet_addEthereumChain",
              params: [addEthereumChain]
            });
            return chain2;
          } catch (error2) {
            throw new UserRejectedRequestError(error2);
          }
        }
        throw new SwitchChainError(error);
      }
    },
    onAccountsChanged(accounts) {
      if (accounts.length === 0)
        this.onDisconnect();
      else
        config.emitter.emit("change", {
          accounts: accounts.map((x) => getAddress(x))
        });
    },
    onChainChanged(chain2) {
      const chainId = Number(chain2);
      config.emitter.emit("change", { chainId });
    },
    async onDisconnect(_error) {
      config.emitter.emit("disconnect");
      const provider = await this.getProvider();
      if (accountsChanged) {
        provider.removeListener("accountsChanged", accountsChanged);
        accountsChanged = void 0;
      }
      if (chainChanged) {
        provider.removeListener("chainChanged", chainChanged);
        chainChanged = void 0;
      }
      if (disconnect) {
        provider.removeListener("disconnect", disconnect);
        disconnect = void 0;
      }
    }
  }));
}
function version3(parameters) {
  const reloadOnDisconnect = false;
  let sdk;
  let walletProvider;
  let accountsChanged;
  let chainChanged;
  let disconnect;
  return createConnector((config) => ({
    id: "coinbaseWalletSDK",
    name: "Coinbase Wallet",
    type: coinbaseWallet.type,
    async connect({ chainId } = {}) {
      try {
        const provider = await this.getProvider();
        const accounts = (await provider.request({
          method: "eth_requestAccounts"
        })).map((x) => getAddress(x));
        if (!accountsChanged) {
          accountsChanged = this.onAccountsChanged.bind(this);
          provider.on("accountsChanged", accountsChanged);
        }
        if (!chainChanged) {
          chainChanged = this.onChainChanged.bind(this);
          provider.on("chainChanged", chainChanged);
        }
        if (!disconnect) {
          disconnect = this.onDisconnect.bind(this);
          provider.on("disconnect", disconnect);
        }
        let currentChainId = await this.getChainId();
        if (chainId && currentChainId !== chainId) {
          const chain2 = await this.switchChain({ chainId }).catch((error) => {
            if (error.code === UserRejectedRequestError.code)
              throw error;
            return { id: currentChainId };
          });
          currentChainId = (chain2 == null ? void 0 : chain2.id) ?? currentChainId;
        }
        return { accounts, chainId: currentChainId };
      } catch (error) {
        if (/(user closed modal|accounts received is empty|user denied account)/i.test(error.message))
          throw new UserRejectedRequestError(error);
        throw error;
      }
    },
    async disconnect() {
      const provider = await this.getProvider();
      if (accountsChanged) {
        provider.removeListener("accountsChanged", accountsChanged);
        accountsChanged = void 0;
      }
      if (chainChanged) {
        provider.removeListener("chainChanged", chainChanged);
        chainChanged = void 0;
      }
      if (disconnect) {
        provider.removeListener("disconnect", disconnect);
        disconnect = void 0;
      }
      provider.disconnect();
      provider.close();
    },
    async getAccounts() {
      const provider = await this.getProvider();
      return (await provider.request({
        method: "eth_accounts"
      })).map((x) => getAddress(x));
    },
    async getChainId() {
      const provider = await this.getProvider();
      const chainId = await provider.request({
        method: "eth_chainId"
      });
      return Number(chainId);
    },
    async getProvider() {
      var _a;
      if (!walletProvider) {
        const CoinbaseWalletSDK = await (async () => {
          const { default: SDK } = await import("./dist-M2RANSO5.js");
          if (typeof SDK !== "function" && typeof SDK.default === "function")
            return SDK.default;
          return SDK;
        })();
        sdk = new CoinbaseWalletSDK({ ...parameters, reloadOnDisconnect });
        const walletExtensionChainId = (_a = sdk.walletExtension) == null ? void 0 : _a.getChainId();
        const chain2 = config.chains.find((chain3) => parameters.chainId ? chain3.id === parameters.chainId : chain3.id === walletExtensionChainId) || config.chains[0];
        const chainId = parameters.chainId || (chain2 == null ? void 0 : chain2.id);
        const jsonRpcUrl = parameters.jsonRpcUrl || (chain2 == null ? void 0 : chain2.rpcUrls.default.http[0]);
        walletProvider = sdk.makeWeb3Provider(jsonRpcUrl, chainId);
      }
      return walletProvider;
    },
    async isAuthorized() {
      try {
        const accounts = await this.getAccounts();
        return !!accounts.length;
      } catch {
        return false;
      }
    },
    async switchChain({ addEthereumChainParameter, chainId }) {
      var _a, _b, _c, _d;
      const chain2 = config.chains.find((chain3) => chain3.id === chainId);
      if (!chain2)
        throw new SwitchChainError(new ChainNotConfiguredError());
      const provider = await this.getProvider();
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: numberToHex(chain2.id) }]
        });
        return chain2;
      } catch (error) {
        if (error.code === 4902) {
          try {
            let blockExplorerUrls;
            if (addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.blockExplorerUrls)
              blockExplorerUrls = addEthereumChainParameter.blockExplorerUrls;
            else
              blockExplorerUrls = ((_a = chain2.blockExplorers) == null ? void 0 : _a.default.url) ? [(_b = chain2.blockExplorers) == null ? void 0 : _b.default.url] : [];
            let rpcUrls;
            if ((_c = addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.rpcUrls) == null ? void 0 : _c.length)
              rpcUrls = addEthereumChainParameter.rpcUrls;
            else
              rpcUrls = [((_d = chain2.rpcUrls.default) == null ? void 0 : _d.http[0]) ?? ""];
            const addEthereumChain = {
              blockExplorerUrls,
              chainId: numberToHex(chainId),
              chainName: (addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.chainName) ?? chain2.name,
              iconUrls: addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.iconUrls,
              nativeCurrency: (addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.nativeCurrency) ?? chain2.nativeCurrency,
              rpcUrls
            };
            await provider.request({
              method: "wallet_addEthereumChain",
              params: [addEthereumChain]
            });
            return chain2;
          } catch (error2) {
            throw new UserRejectedRequestError(error2);
          }
        }
        throw new SwitchChainError(error);
      }
    },
    onAccountsChanged(accounts) {
      if (accounts.length === 0)
        this.onDisconnect();
      else
        config.emitter.emit("change", {
          accounts: accounts.map((x) => getAddress(x))
        });
    },
    onChainChanged(chain2) {
      const chainId = Number(chain2);
      config.emitter.emit("change", { chainId });
    },
    async onDisconnect(_error) {
      config.emitter.emit("disconnect");
      const provider = await this.getProvider();
      if (accountsChanged) {
        provider.removeListener("accountsChanged", accountsChanged);
        accountsChanged = void 0;
      }
      if (chainChanged) {
        provider.removeListener("chainChanged", chainChanged);
        chainChanged = void 0;
      }
      if (disconnect) {
        provider.removeListener("disconnect", disconnect);
        disconnect = void 0;
      }
    }
  }));
}

// node_modules/@wagmi/connectors/dist/esm/metaMask.js
metaMask.type = "metaMask";
function metaMask(parameters = {}) {
  let sdk;
  let provider;
  let providerPromise;
  let accountsChanged;
  let chainChanged;
  let connect;
  let displayUri;
  let disconnect;
  return createConnector((config) => ({
    id: "metaMaskSDK",
    name: "MetaMask",
    rdns: ["io.metamask", "io.metamask.mobile"],
    type: metaMask.type,
    async setup() {
      const provider2 = await this.getProvider();
      if (provider2 == null ? void 0 : provider2.on) {
        if (!connect) {
          connect = this.onConnect.bind(this);
          provider2.on("connect", connect);
        }
        if (!accountsChanged) {
          accountsChanged = this.onAccountsChanged.bind(this);
          provider2.on("accountsChanged", accountsChanged);
        }
      }
    },
    async connect({ chainId, isReconnecting } = {}) {
      const provider2 = await this.getProvider();
      if (!displayUri) {
        displayUri = this.onDisplayUri;
        provider2.on("display_uri", displayUri);
      }
      let accounts = [];
      if (isReconnecting)
        accounts = await this.getAccounts().catch(() => []);
      try {
        let signResponse;
        let connectWithResponse;
        if (!(accounts == null ? void 0 : accounts.length)) {
          if (parameters.connectAndSign || parameters.connectWith) {
            if (parameters.connectAndSign)
              signResponse = await sdk.connectAndSign({
                msg: parameters.connectAndSign
              });
            else if (parameters.connectWith)
              connectWithResponse = await sdk.connectWith({
                method: parameters.connectWith.method,
                params: parameters.connectWith.params
              });
            accounts = await this.getAccounts();
          } else {
            const requestedAccounts = await sdk.connect();
            accounts = requestedAccounts.map((x) => getAddress(x));
          }
        }
        let currentChainId = await this.getChainId();
        if (chainId && currentChainId !== chainId) {
          const chain2 = await this.switchChain({ chainId }).catch((error) => {
            if (error.code === UserRejectedRequestError.code)
              throw error;
            return { id: currentChainId };
          });
          currentChainId = (chain2 == null ? void 0 : chain2.id) ?? currentChainId;
        }
        if (displayUri) {
          provider2.removeListener("display_uri", displayUri);
          displayUri = void 0;
        }
        if (signResponse)
          provider2.emit("connectAndSign", {
            accounts,
            chainId: currentChainId,
            signResponse
          });
        else if (connectWithResponse)
          provider2.emit("connectWith", {
            accounts,
            chainId: currentChainId,
            connectWithResponse
          });
        if (connect) {
          provider2.removeListener("connect", connect);
          connect = void 0;
        }
        if (!accountsChanged) {
          accountsChanged = this.onAccountsChanged.bind(this);
          provider2.on("accountsChanged", accountsChanged);
        }
        if (!chainChanged) {
          chainChanged = this.onChainChanged.bind(this);
          provider2.on("chainChanged", chainChanged);
        }
        if (!disconnect) {
          disconnect = this.onDisconnect.bind(this);
          provider2.on("disconnect", disconnect);
        }
        return { accounts, chainId: currentChainId };
      } catch (err) {
        const error = err;
        if (error.code === UserRejectedRequestError.code)
          throw new UserRejectedRequestError(error);
        if (error.code === ResourceUnavailableRpcError.code)
          throw new ResourceUnavailableRpcError(error);
        throw error;
      }
    },
    async disconnect() {
      const provider2 = await this.getProvider();
      if (chainChanged) {
        provider2.removeListener("chainChanged", chainChanged);
        chainChanged = void 0;
      }
      if (disconnect) {
        provider2.removeListener("disconnect", disconnect);
        disconnect = void 0;
      }
      if (!connect) {
        connect = this.onConnect.bind(this);
        provider2.on("connect", connect);
      }
      await sdk.terminate();
    },
    async getAccounts() {
      const provider2 = await this.getProvider();
      const accounts = await provider2.request({
        method: "eth_accounts"
      });
      return accounts.map((x) => getAddress(x));
    },
    async getChainId() {
      const provider2 = await this.getProvider();
      const chainId = provider2.getChainId() || await (provider2 == null ? void 0 : provider2.request({ method: "eth_chainId" }));
      return Number(chainId);
    },
    async getProvider() {
      async function initProvider() {
        var _a, _b, _c, _d, _e;
        const MetaMaskSDK = await (async () => {
          const { default: SDK } = await import("./metamask-sdk-RHM7RLVW.js");
          if (typeof SDK !== "function" && typeof SDK.default === "function")
            return SDK.default;
          return SDK;
        })();
        const readonlyRPCMap = {};
        for (const chain2 of config.chains)
          readonlyRPCMap[numberToHex(chain2.id)] = (_a = extractRpcUrls({
            chain: chain2,
            transports: config.transports
          })) == null ? void 0 : _a[0];
        sdk = new MetaMaskSDK({
          _source: "wagmi",
          forceDeleteProvider: false,
          forceInjectProvider: false,
          injectProvider: false,
          // Workaround cast since MetaMask SDK does not support `'exactOptionalPropertyTypes'`
          ...parameters,
          readonlyRPCMap,
          dappMetadata: {
            ...parameters.dappMetadata,
            // Test if name and url are set AND not empty
            name: ((_b = parameters.dappMetadata) == null ? void 0 : _b.name) ? (_c = parameters.dappMetadata) == null ? void 0 : _c.name : "wagmi",
            url: ((_d = parameters.dappMetadata) == null ? void 0 : _d.url) ? (_e = parameters.dappMetadata) == null ? void 0 : _e.url : typeof window !== "undefined" ? window.location.origin : "https://wagmi.sh"
          },
          useDeeplink: parameters.useDeeplink ?? true
        });
        const result = await sdk.init();
        const provider2 = (() => {
          if (result == null ? void 0 : result.activeProvider)
            return result.activeProvider;
          return sdk.getProvider();
        })();
        if (!provider2)
          throw new ProviderNotFoundError();
        return provider2;
      }
      if (!provider) {
        if (!providerPromise)
          providerPromise = initProvider();
        provider = await providerPromise;
      }
      return provider;
    },
    async isAuthorized() {
      try {
        const timeout = 200;
        const accounts = await withRetry(() => withTimeout(() => this.getAccounts(), { timeout }), {
          delay: timeout + 1,
          retryCount: 3
        });
        return !!accounts.length;
      } catch {
        return false;
      }
    },
    async switchChain({ addEthereumChainParameter, chainId }) {
      const provider2 = await this.getProvider();
      const chain2 = config.chains.find((x) => x.id === chainId);
      if (!chain2)
        throw new SwitchChainError(new ChainNotConfiguredError());
      const isDefaultChain = (() => {
        const metaMaskDefaultChains = [
          1,
          11155111,
          59144,
          59141
        ];
        return metaMaskDefaultChains.find((x) => x === chainId);
      })();
      try {
        if (!isDefaultChain)
          await provider2.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                blockExplorerUrls: (() => {
                  const { default: blockExplorer, ...blockExplorers } = chain2.blockExplorers ?? {};
                  if (addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.blockExplorerUrls)
                    return addEthereumChainParameter.blockExplorerUrls;
                  if (blockExplorer)
                    return [
                      blockExplorer.url,
                      ...Object.values(blockExplorers).map((x) => x.url)
                    ];
                  return;
                })(),
                chainId: numberToHex(chainId),
                chainName: (addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.chainName) ?? chain2.name,
                iconUrls: addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.iconUrls,
                nativeCurrency: (addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.nativeCurrency) ?? chain2.nativeCurrency,
                rpcUrls: (() => {
                  var _a, _b;
                  if ((_a = addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.rpcUrls) == null ? void 0 : _a.length)
                    return addEthereumChainParameter.rpcUrls;
                  return [((_b = chain2.rpcUrls.default) == null ? void 0 : _b.http[0]) ?? ""];
                })()
              }
            ]
          });
        else
          await provider2.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: numberToHex(chainId) }]
          });
        await waitForChainIdToSync();
        await sendAndWaitForChangeEvent(chainId);
        async function waitForChainIdToSync() {
          await withRetry(async () => {
            const value = hexToNumber(
              // `'eth_chainId'` is cached by the MetaMask SDK side to avoid unnecessary deeplinks
              await provider2.request({ method: "eth_chainId" })
            );
            if (value !== chainId)
              throw new Error("User rejected switch after adding network.");
            return value;
          }, {
            delay: 50,
            retryCount: 20
            // android device encryption is slower
          });
        }
        async function sendAndWaitForChangeEvent(chainId2) {
          await new Promise((resolve) => {
            const listener = (data) => {
              if ("chainId" in data && data.chainId === chainId2) {
                config.emitter.off("change", listener);
                resolve();
              }
            };
            config.emitter.on("change", listener);
            config.emitter.emit("change", { chainId: chainId2 });
          });
        }
        return chain2;
      } catch (err) {
        const error = err;
        if (error.code === UserRejectedRequestError.code)
          throw new UserRejectedRequestError(error);
        throw new SwitchChainError(error);
      }
    },
    async onAccountsChanged(accounts) {
      if (accounts.length === 0) {
        if (sdk.isExtensionActive())
          this.onDisconnect();
        else
          return;
      } else if (config.emitter.listenerCount("connect")) {
        const chainId = (await this.getChainId()).toString();
        this.onConnect({ chainId });
      } else
        config.emitter.emit("change", {
          accounts: accounts.map((x) => getAddress(x))
        });
    },
    onChainChanged(chain2) {
      const chainId = Number(chain2);
      config.emitter.emit("change", { chainId });
    },
    async onConnect(connectInfo) {
      const accounts = await this.getAccounts();
      if (accounts.length === 0)
        return;
      const chainId = Number(connectInfo.chainId);
      config.emitter.emit("connect", { accounts, chainId });
      const provider2 = await this.getProvider();
      if (connect) {
        provider2.removeListener("connect", connect);
        connect = void 0;
      }
      if (!accountsChanged) {
        accountsChanged = this.onAccountsChanged.bind(this);
        provider2.on("accountsChanged", accountsChanged);
      }
      if (!chainChanged) {
        chainChanged = this.onChainChanged.bind(this);
        provider2.on("chainChanged", chainChanged);
      }
      if (!disconnect) {
        disconnect = this.onDisconnect.bind(this);
        provider2.on("disconnect", disconnect);
      }
    },
    async onDisconnect(error) {
      const provider2 = await this.getProvider();
      if (error && error.code === 1013) {
        if (provider2 && !!(await this.getAccounts()).length)
          return;
      }
      config.emitter.emit("disconnect");
      if (chainChanged) {
        provider2.removeListener("chainChanged", chainChanged);
        chainChanged = void 0;
      }
      if (disconnect) {
        provider2.removeListener("disconnect", disconnect);
        disconnect = void 0;
      }
      if (!connect) {
        connect = this.onConnect.bind(this);
        provider2.on("connect", connect);
      }
    },
    onDisplayUri(uri) {
      config.emitter.emit("message", { type: "display_uri", data: uri });
    }
  }));
}

// node_modules/@wagmi/connectors/dist/esm/safe.js
safe.type = "safe";
function safe(parameters = {}) {
  const { shimDisconnect = false } = parameters;
  let provider_;
  let disconnect;
  return createConnector((config) => ({
    id: "safe",
    name: "Safe",
    type: safe.type,
    async connect() {
      var _a;
      const provider = await this.getProvider();
      if (!provider)
        throw new ProviderNotFoundError();
      const accounts = await this.getAccounts();
      const chainId = await this.getChainId();
      if (!disconnect) {
        disconnect = this.onDisconnect.bind(this);
        provider.on("disconnect", disconnect);
      }
      if (shimDisconnect)
        await ((_a = config.storage) == null ? void 0 : _a.removeItem("safe.disconnected"));
      return { accounts, chainId };
    },
    async disconnect() {
      var _a;
      const provider = await this.getProvider();
      if (!provider)
        throw new ProviderNotFoundError();
      if (disconnect) {
        provider.removeListener("disconnect", disconnect);
        disconnect = void 0;
      }
      if (shimDisconnect)
        await ((_a = config.storage) == null ? void 0 : _a.setItem("safe.disconnected", true));
    },
    async getAccounts() {
      const provider = await this.getProvider();
      if (!provider)
        throw new ProviderNotFoundError();
      return (await provider.request({ method: "eth_accounts" })).map(getAddress);
    },
    async getProvider() {
      const isIframe = typeof window !== "undefined" && (window == null ? void 0 : window.parent) !== window;
      if (!isIframe)
        return;
      if (!provider_) {
        const { default: SDK } = await import("./esm-VC26VORX.js");
        const sdk = new SDK(parameters);
        const safe2 = await withTimeout(() => sdk.safe.getInfo(), {
          timeout: parameters.unstable_getInfoTimeout ?? 10
        });
        if (!safe2)
          throw new Error("Could not load Safe information");
        const SafeAppProvider = await (async () => {
          const Provider = await import("./dist-UFMYVLZY.js");
          if (typeof Provider.SafeAppProvider !== "function" && typeof Provider.default.SafeAppProvider === "function")
            return Provider.default.SafeAppProvider;
          return Provider.SafeAppProvider;
        })();
        provider_ = new SafeAppProvider(safe2, sdk);
      }
      return provider_;
    },
    async getChainId() {
      const provider = await this.getProvider();
      if (!provider)
        throw new ProviderNotFoundError();
      return Number(provider.chainId);
    },
    async isAuthorized() {
      var _a;
      try {
        const isDisconnected = shimDisconnect && // If shim exists in storage, connector is disconnected
        await ((_a = config.storage) == null ? void 0 : _a.getItem("safe.disconnected"));
        if (isDisconnected)
          return false;
        const accounts = await this.getAccounts();
        return !!accounts.length;
      } catch {
        return false;
      }
    },
    onAccountsChanged() {
    },
    onChainChanged() {
    },
    onDisconnect() {
      config.emitter.emit("disconnect");
    }
  }));
}

// node_modules/@wagmi/connectors/dist/esm/walletConnect.js
walletConnect.type = "walletConnect";
function walletConnect(parameters) {
  const isNewChainsStale = parameters.isNewChainsStale ?? true;
  let provider_;
  let providerPromise;
  const NAMESPACE = "eip155";
  let accountsChanged;
  let chainChanged;
  let connect;
  let displayUri;
  let sessionDelete;
  let disconnect;
  return createConnector((config) => ({
    id: "walletConnect",
    name: "WalletConnect",
    type: walletConnect.type,
    async setup() {
      const provider = await this.getProvider().catch(() => null);
      if (!provider)
        return;
      if (!connect) {
        connect = this.onConnect.bind(this);
        provider.on("connect", connect);
      }
      if (!sessionDelete) {
        sessionDelete = this.onSessionDelete.bind(this);
        provider.on("session_delete", sessionDelete);
      }
    },
    async connect({ chainId, ...rest } = {}) {
      var _a, _b;
      try {
        const provider = await this.getProvider();
        if (!provider)
          throw new ProviderNotFoundError();
        if (!displayUri) {
          displayUri = this.onDisplayUri;
          provider.on("display_uri", displayUri);
        }
        let targetChainId = chainId;
        if (!targetChainId) {
          const state = await ((_a = config.storage) == null ? void 0 : _a.getItem("state")) ?? {};
          const isChainSupported = config.chains.some((x) => x.id === state.chainId);
          if (isChainSupported)
            targetChainId = state.chainId;
          else
            targetChainId = (_b = config.chains[0]) == null ? void 0 : _b.id;
        }
        if (!targetChainId)
          throw new Error("No chains found on connector.");
        const isChainsStale = await this.isChainsStale();
        if (provider.session && isChainsStale)
          await provider.disconnect();
        if (!provider.session || isChainsStale) {
          const optionalChains = config.chains.filter((chain2) => chain2.id !== targetChainId).map((optionalChain) => optionalChain.id);
          await provider.connect({
            optionalChains: [targetChainId, ...optionalChains],
            ..."pairingTopic" in rest ? { pairingTopic: rest.pairingTopic } : {}
          });
          this.setRequestedChainsIds(config.chains.map((x) => x.id));
        }
        const accounts = (await provider.enable()).map((x) => getAddress(x));
        const currentChainId = await this.getChainId();
        if (displayUri) {
          provider.removeListener("display_uri", displayUri);
          displayUri = void 0;
        }
        if (connect) {
          provider.removeListener("connect", connect);
          connect = void 0;
        }
        if (!accountsChanged) {
          accountsChanged = this.onAccountsChanged.bind(this);
          provider.on("accountsChanged", accountsChanged);
        }
        if (!chainChanged) {
          chainChanged = this.onChainChanged.bind(this);
          provider.on("chainChanged", chainChanged);
        }
        if (!disconnect) {
          disconnect = this.onDisconnect.bind(this);
          provider.on("disconnect", disconnect);
        }
        if (!sessionDelete) {
          sessionDelete = this.onSessionDelete.bind(this);
          provider.on("session_delete", sessionDelete);
        }
        return { accounts, chainId: currentChainId };
      } catch (error) {
        if (/(user rejected|connection request reset)/i.test(error == null ? void 0 : error.message)) {
          throw new UserRejectedRequestError(error);
        }
        throw error;
      }
    },
    async disconnect() {
      const provider = await this.getProvider();
      try {
        await (provider == null ? void 0 : provider.disconnect());
      } catch (error) {
        if (!/No matching key/i.test(error.message))
          throw error;
      } finally {
        if (chainChanged) {
          provider == null ? void 0 : provider.removeListener("chainChanged", chainChanged);
          chainChanged = void 0;
        }
        if (disconnect) {
          provider == null ? void 0 : provider.removeListener("disconnect", disconnect);
          disconnect = void 0;
        }
        if (!connect) {
          connect = this.onConnect.bind(this);
          provider == null ? void 0 : provider.on("connect", connect);
        }
        if (accountsChanged) {
          provider == null ? void 0 : provider.removeListener("accountsChanged", accountsChanged);
          accountsChanged = void 0;
        }
        if (sessionDelete) {
          provider == null ? void 0 : provider.removeListener("session_delete", sessionDelete);
          sessionDelete = void 0;
        }
        this.setRequestedChainsIds([]);
      }
    },
    async getAccounts() {
      const provider = await this.getProvider();
      return provider.accounts.map((x) => getAddress(x));
    },
    async getProvider({ chainId } = {}) {
      var _a;
      async function initProvider() {
        const optionalChains = config.chains.map((x) => x.id);
        if (!optionalChains.length)
          return;
        const { EthereumProvider } = await import("./index.es-V3IPJUEM.js");
        return await EthereumProvider.init({
          ...parameters,
          disableProviderPing: true,
          optionalChains,
          projectId: parameters.projectId,
          rpcMap: Object.fromEntries(config.chains.map((chain2) => {
            const [url] = extractRpcUrls({
              chain: chain2,
              transports: config.transports
            });
            return [chain2.id, url];
          })),
          showQrModal: parameters.showQrModal ?? true
        });
      }
      if (!provider_) {
        if (!providerPromise)
          providerPromise = initProvider();
        provider_ = await providerPromise;
        provider_ == null ? void 0 : provider_.events.setMaxListeners(Number.POSITIVE_INFINITY);
      }
      if (chainId)
        await ((_a = this.switchChain) == null ? void 0 : _a.call(this, { chainId }));
      return provider_;
    },
    async getChainId() {
      const provider = await this.getProvider();
      return provider.chainId;
    },
    async isAuthorized() {
      try {
        const [accounts, provider] = await Promise.all([
          this.getAccounts(),
          this.getProvider()
        ]);
        if (!accounts.length)
          return false;
        const isChainsStale = await this.isChainsStale();
        if (isChainsStale && provider.session) {
          await provider.disconnect().catch(() => {
          });
          return false;
        }
        return true;
      } catch {
        return false;
      }
    },
    async switchChain({ addEthereumChainParameter, chainId }) {
      var _a, _b, _c;
      const provider = await this.getProvider();
      if (!provider)
        throw new ProviderNotFoundError();
      const chain2 = config.chains.find((x) => x.id === chainId);
      if (!chain2)
        throw new SwitchChainError(new ChainNotConfiguredError());
      try {
        await Promise.all([
          new Promise((resolve) => {
            const listener = ({ chainId: currentChainId }) => {
              if (currentChainId === chainId) {
                config.emitter.off("change", listener);
                resolve();
              }
            };
            config.emitter.on("change", listener);
          }),
          provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: numberToHex(chainId) }]
          })
        ]);
        const requestedChains = await this.getRequestedChainsIds();
        this.setRequestedChainsIds([...requestedChains, chainId]);
        return chain2;
      } catch (err) {
        const error = err;
        if (/(user rejected)/i.test(error.message))
          throw new UserRejectedRequestError(error);
        try {
          let blockExplorerUrls;
          if (addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.blockExplorerUrls)
            blockExplorerUrls = addEthereumChainParameter.blockExplorerUrls;
          else
            blockExplorerUrls = ((_a = chain2.blockExplorers) == null ? void 0 : _a.default.url) ? [(_b = chain2.blockExplorers) == null ? void 0 : _b.default.url] : [];
          let rpcUrls;
          if ((_c = addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.rpcUrls) == null ? void 0 : _c.length)
            rpcUrls = addEthereumChainParameter.rpcUrls;
          else
            rpcUrls = [...chain2.rpcUrls.default.http];
          const addEthereumChain = {
            blockExplorerUrls,
            chainId: numberToHex(chainId),
            chainName: (addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.chainName) ?? chain2.name,
            iconUrls: addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.iconUrls,
            nativeCurrency: (addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.nativeCurrency) ?? chain2.nativeCurrency,
            rpcUrls
          };
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [addEthereumChain]
          });
          const requestedChains = await this.getRequestedChainsIds();
          this.setRequestedChainsIds([...requestedChains, chainId]);
          return chain2;
        } catch (error2) {
          throw new UserRejectedRequestError(error2);
        }
      }
    },
    onAccountsChanged(accounts) {
      if (accounts.length === 0)
        this.onDisconnect();
      else
        config.emitter.emit("change", {
          accounts: accounts.map((x) => getAddress(x))
        });
    },
    onChainChanged(chain2) {
      const chainId = Number(chain2);
      config.emitter.emit("change", { chainId });
    },
    async onConnect(connectInfo) {
      const chainId = Number(connectInfo.chainId);
      const accounts = await this.getAccounts();
      config.emitter.emit("connect", { accounts, chainId });
    },
    async onDisconnect(_error) {
      this.setRequestedChainsIds([]);
      config.emitter.emit("disconnect");
      const provider = await this.getProvider();
      if (accountsChanged) {
        provider.removeListener("accountsChanged", accountsChanged);
        accountsChanged = void 0;
      }
      if (chainChanged) {
        provider.removeListener("chainChanged", chainChanged);
        chainChanged = void 0;
      }
      if (disconnect) {
        provider.removeListener("disconnect", disconnect);
        disconnect = void 0;
      }
      if (sessionDelete) {
        provider.removeListener("session_delete", sessionDelete);
        sessionDelete = void 0;
      }
      if (!connect) {
        connect = this.onConnect.bind(this);
        provider.on("connect", connect);
      }
    },
    onDisplayUri(uri) {
      config.emitter.emit("message", { type: "display_uri", data: uri });
    },
    onSessionDelete() {
      this.onDisconnect();
    },
    getNamespaceChainsIds() {
      var _a, _b, _c;
      if (!provider_)
        return [];
      const chainIds = (_c = (_b = (_a = provider_.session) == null ? void 0 : _a.namespaces[NAMESPACE]) == null ? void 0 : _b.accounts) == null ? void 0 : _c.map((account) => Number.parseInt(account.split(":")[1] || ""));
      return chainIds ?? [];
    },
    async getRequestedChainsIds() {
      var _a;
      return await ((_a = config.storage) == null ? void 0 : _a.getItem(this.requestedChainsStorageKey)) ?? [];
    },
    /**
     * Checks if the target chains match the chains that were
     * initially requested by the connector for the WalletConnect session.
     * If there is a mismatch, this means that the chains on the connector
     * are considered stale, and need to be revalidated at a later point (via
     * connection).
     *
     * There may be a scenario where a dapp adds a chain to the
     * connector later on, however, this chain will not have been approved or rejected
     * by the wallet. In this case, the chain is considered stale.
     */
    async isChainsStale() {
      if (!isNewChainsStale)
        return false;
      const connectorChains = config.chains.map((x) => x.id);
      const namespaceChains = this.getNamespaceChainsIds();
      if (namespaceChains.length && !namespaceChains.some((id) => connectorChains.includes(id)))
        return false;
      const requestedChains = await this.getRequestedChainsIds();
      return !connectorChains.every((id) => requestedChains.includes(id));
    },
    async setRequestedChainsIds(chains) {
      var _a;
      await ((_a = config.storage) == null ? void 0 : _a.setItem(this.requestedChainsStorageKey, chains));
    },
    get requestedChainsStorageKey() {
      return `${this.id}.requestedChains`;
    }
  }));
}

// node_modules/@rainbow-me/rainbowkit/dist/index.js
var import_react79 = __toESM(require_react());
var largeScreenMinWidth = 768;
var mapResponsiveValue = createMapValueFn({ conditions: { defaultCondition: "smallScreen", conditionNames: ["smallScreen", "largeScreen"], responsiveArray: void 0 } });
var normalizeResponsiveValue = createNormalizeValueFn({ conditions: { defaultCondition: "smallScreen", conditionNames: ["smallScreen", "largeScreen"], responsiveArray: void 0 } });
var sprinkles = createSprinkles2({ conditions: { defaultCondition: "base", conditionNames: ["base", "hover", "active"], responsiveArray: void 0 }, styles: { background: { values: { accentColor: { conditions: { base: "ju367v9i", hover: "ju367v9j", active: "ju367v9k" }, defaultClass: "ju367v9i" }, accentColorForeground: { conditions: { base: "ju367v9l", hover: "ju367v9m", active: "ju367v9n" }, defaultClass: "ju367v9l" }, actionButtonBorder: { conditions: { base: "ju367v9o", hover: "ju367v9p", active: "ju367v9q" }, defaultClass: "ju367v9o" }, actionButtonBorderMobile: { conditions: { base: "ju367v9r", hover: "ju367v9s", active: "ju367v9t" }, defaultClass: "ju367v9r" }, actionButtonSecondaryBackground: { conditions: { base: "ju367v9u", hover: "ju367v9v", active: "ju367v9w" }, defaultClass: "ju367v9u" }, closeButton: { conditions: { base: "ju367v9x", hover: "ju367v9y", active: "ju367v9z" }, defaultClass: "ju367v9x" }, closeButtonBackground: { conditions: { base: "ju367va0", hover: "ju367va1", active: "ju367va2" }, defaultClass: "ju367va0" }, connectButtonBackground: { conditions: { base: "ju367va3", hover: "ju367va4", active: "ju367va5" }, defaultClass: "ju367va3" }, connectButtonBackgroundError: { conditions: { base: "ju367va6", hover: "ju367va7", active: "ju367va8" }, defaultClass: "ju367va6" }, connectButtonInnerBackground: { conditions: { base: "ju367va9", hover: "ju367vaa", active: "ju367vab" }, defaultClass: "ju367va9" }, connectButtonText: { conditions: { base: "ju367vac", hover: "ju367vad", active: "ju367vae" }, defaultClass: "ju367vac" }, connectButtonTextError: { conditions: { base: "ju367vaf", hover: "ju367vag", active: "ju367vah" }, defaultClass: "ju367vaf" }, connectionIndicator: { conditions: { base: "ju367vai", hover: "ju367vaj", active: "ju367vak" }, defaultClass: "ju367vai" }, downloadBottomCardBackground: { conditions: { base: "ju367val", hover: "ju367vam", active: "ju367van" }, defaultClass: "ju367val" }, downloadTopCardBackground: { conditions: { base: "ju367vao", hover: "ju367vap", active: "ju367vaq" }, defaultClass: "ju367vao" }, error: { conditions: { base: "ju367var", hover: "ju367vas", active: "ju367vat" }, defaultClass: "ju367var" }, generalBorder: { conditions: { base: "ju367vau", hover: "ju367vav", active: "ju367vaw" }, defaultClass: "ju367vau" }, generalBorderDim: { conditions: { base: "ju367vax", hover: "ju367vay", active: "ju367vaz" }, defaultClass: "ju367vax" }, menuItemBackground: { conditions: { base: "ju367vb0", hover: "ju367vb1", active: "ju367vb2" }, defaultClass: "ju367vb0" }, modalBackdrop: { conditions: { base: "ju367vb3", hover: "ju367vb4", active: "ju367vb5" }, defaultClass: "ju367vb3" }, modalBackground: { conditions: { base: "ju367vb6", hover: "ju367vb7", active: "ju367vb8" }, defaultClass: "ju367vb6" }, modalBorder: { conditions: { base: "ju367vb9", hover: "ju367vba", active: "ju367vbb" }, defaultClass: "ju367vb9" }, modalText: { conditions: { base: "ju367vbc", hover: "ju367vbd", active: "ju367vbe" }, defaultClass: "ju367vbc" }, modalTextDim: { conditions: { base: "ju367vbf", hover: "ju367vbg", active: "ju367vbh" }, defaultClass: "ju367vbf" }, modalTextSecondary: { conditions: { base: "ju367vbi", hover: "ju367vbj", active: "ju367vbk" }, defaultClass: "ju367vbi" }, profileAction: { conditions: { base: "ju367vbl", hover: "ju367vbm", active: "ju367vbn" }, defaultClass: "ju367vbl" }, profileActionHover: { conditions: { base: "ju367vbo", hover: "ju367vbp", active: "ju367vbq" }, defaultClass: "ju367vbo" }, profileForeground: { conditions: { base: "ju367vbr", hover: "ju367vbs", active: "ju367vbt" }, defaultClass: "ju367vbr" }, selectedOptionBorder: { conditions: { base: "ju367vbu", hover: "ju367vbv", active: "ju367vbw" }, defaultClass: "ju367vbu" }, standby: { conditions: { base: "ju367vbx", hover: "ju367vby", active: "ju367vbz" }, defaultClass: "ju367vbx" } } }, borderColor: { values: { accentColor: { conditions: { base: "ju367vc0", hover: "ju367vc1", active: "ju367vc2" }, defaultClass: "ju367vc0" }, accentColorForeground: { conditions: { base: "ju367vc3", hover: "ju367vc4", active: "ju367vc5" }, defaultClass: "ju367vc3" }, actionButtonBorder: { conditions: { base: "ju367vc6", hover: "ju367vc7", active: "ju367vc8" }, defaultClass: "ju367vc6" }, actionButtonBorderMobile: { conditions: { base: "ju367vc9", hover: "ju367vca", active: "ju367vcb" }, defaultClass: "ju367vc9" }, actionButtonSecondaryBackground: { conditions: { base: "ju367vcc", hover: "ju367vcd", active: "ju367vce" }, defaultClass: "ju367vcc" }, closeButton: { conditions: { base: "ju367vcf", hover: "ju367vcg", active: "ju367vch" }, defaultClass: "ju367vcf" }, closeButtonBackground: { conditions: { base: "ju367vci", hover: "ju367vcj", active: "ju367vck" }, defaultClass: "ju367vci" }, connectButtonBackground: { conditions: { base: "ju367vcl", hover: "ju367vcm", active: "ju367vcn" }, defaultClass: "ju367vcl" }, connectButtonBackgroundError: { conditions: { base: "ju367vco", hover: "ju367vcp", active: "ju367vcq" }, defaultClass: "ju367vco" }, connectButtonInnerBackground: { conditions: { base: "ju367vcr", hover: "ju367vcs", active: "ju367vct" }, defaultClass: "ju367vcr" }, connectButtonText: { conditions: { base: "ju367vcu", hover: "ju367vcv", active: "ju367vcw" }, defaultClass: "ju367vcu" }, connectButtonTextError: { conditions: { base: "ju367vcx", hover: "ju367vcy", active: "ju367vcz" }, defaultClass: "ju367vcx" }, connectionIndicator: { conditions: { base: "ju367vd0", hover: "ju367vd1", active: "ju367vd2" }, defaultClass: "ju367vd0" }, downloadBottomCardBackground: { conditions: { base: "ju367vd3", hover: "ju367vd4", active: "ju367vd5" }, defaultClass: "ju367vd3" }, downloadTopCardBackground: { conditions: { base: "ju367vd6", hover: "ju367vd7", active: "ju367vd8" }, defaultClass: "ju367vd6" }, error: { conditions: { base: "ju367vd9", hover: "ju367vda", active: "ju367vdb" }, defaultClass: "ju367vd9" }, generalBorder: { conditions: { base: "ju367vdc", hover: "ju367vdd", active: "ju367vde" }, defaultClass: "ju367vdc" }, generalBorderDim: { conditions: { base: "ju367vdf", hover: "ju367vdg", active: "ju367vdh" }, defaultClass: "ju367vdf" }, menuItemBackground: { conditions: { base: "ju367vdi", hover: "ju367vdj", active: "ju367vdk" }, defaultClass: "ju367vdi" }, modalBackdrop: { conditions: { base: "ju367vdl", hover: "ju367vdm", active: "ju367vdn" }, defaultClass: "ju367vdl" }, modalBackground: { conditions: { base: "ju367vdo", hover: "ju367vdp", active: "ju367vdq" }, defaultClass: "ju367vdo" }, modalBorder: { conditions: { base: "ju367vdr", hover: "ju367vds", active: "ju367vdt" }, defaultClass: "ju367vdr" }, modalText: { conditions: { base: "ju367vdu", hover: "ju367vdv", active: "ju367vdw" }, defaultClass: "ju367vdu" }, modalTextDim: { conditions: { base: "ju367vdx", hover: "ju367vdy", active: "ju367vdz" }, defaultClass: "ju367vdx" }, modalTextSecondary: { conditions: { base: "ju367ve0", hover: "ju367ve1", active: "ju367ve2" }, defaultClass: "ju367ve0" }, profileAction: { conditions: { base: "ju367ve3", hover: "ju367ve4", active: "ju367ve5" }, defaultClass: "ju367ve3" }, profileActionHover: { conditions: { base: "ju367ve6", hover: "ju367ve7", active: "ju367ve8" }, defaultClass: "ju367ve6" }, profileForeground: { conditions: { base: "ju367ve9", hover: "ju367vea", active: "ju367veb" }, defaultClass: "ju367ve9" }, selectedOptionBorder: { conditions: { base: "ju367vec", hover: "ju367ved", active: "ju367vee" }, defaultClass: "ju367vec" }, standby: { conditions: { base: "ju367vef", hover: "ju367veg", active: "ju367veh" }, defaultClass: "ju367vef" } } }, boxShadow: { values: { connectButton: { conditions: { base: "ju367vei", hover: "ju367vej", active: "ju367vek" }, defaultClass: "ju367vei" }, dialog: { conditions: { base: "ju367vel", hover: "ju367vem", active: "ju367ven" }, defaultClass: "ju367vel" }, profileDetailsAction: { conditions: { base: "ju367veo", hover: "ju367vep", active: "ju367veq" }, defaultClass: "ju367veo" }, selectedOption: { conditions: { base: "ju367ver", hover: "ju367ves", active: "ju367vet" }, defaultClass: "ju367ver" }, selectedWallet: { conditions: { base: "ju367veu", hover: "ju367vev", active: "ju367vew" }, defaultClass: "ju367veu" }, walletLogo: { conditions: { base: "ju367vex", hover: "ju367vey", active: "ju367vez" }, defaultClass: "ju367vex" } } }, color: { values: { accentColor: { conditions: { base: "ju367vf0", hover: "ju367vf1", active: "ju367vf2" }, defaultClass: "ju367vf0" }, accentColorForeground: { conditions: { base: "ju367vf3", hover: "ju367vf4", active: "ju367vf5" }, defaultClass: "ju367vf3" }, actionButtonBorder: { conditions: { base: "ju367vf6", hover: "ju367vf7", active: "ju367vf8" }, defaultClass: "ju367vf6" }, actionButtonBorderMobile: { conditions: { base: "ju367vf9", hover: "ju367vfa", active: "ju367vfb" }, defaultClass: "ju367vf9" }, actionButtonSecondaryBackground: { conditions: { base: "ju367vfc", hover: "ju367vfd", active: "ju367vfe" }, defaultClass: "ju367vfc" }, closeButton: { conditions: { base: "ju367vff", hover: "ju367vfg", active: "ju367vfh" }, defaultClass: "ju367vff" }, closeButtonBackground: { conditions: { base: "ju367vfi", hover: "ju367vfj", active: "ju367vfk" }, defaultClass: "ju367vfi" }, connectButtonBackground: { conditions: { base: "ju367vfl", hover: "ju367vfm", active: "ju367vfn" }, defaultClass: "ju367vfl" }, connectButtonBackgroundError: { conditions: { base: "ju367vfo", hover: "ju367vfp", active: "ju367vfq" }, defaultClass: "ju367vfo" }, connectButtonInnerBackground: { conditions: { base: "ju367vfr", hover: "ju367vfs", active: "ju367vft" }, defaultClass: "ju367vfr" }, connectButtonText: { conditions: { base: "ju367vfu", hover: "ju367vfv", active: "ju367vfw" }, defaultClass: "ju367vfu" }, connectButtonTextError: { conditions: { base: "ju367vfx", hover: "ju367vfy", active: "ju367vfz" }, defaultClass: "ju367vfx" }, connectionIndicator: { conditions: { base: "ju367vg0", hover: "ju367vg1", active: "ju367vg2" }, defaultClass: "ju367vg0" }, downloadBottomCardBackground: { conditions: { base: "ju367vg3", hover: "ju367vg4", active: "ju367vg5" }, defaultClass: "ju367vg3" }, downloadTopCardBackground: { conditions: { base: "ju367vg6", hover: "ju367vg7", active: "ju367vg8" }, defaultClass: "ju367vg6" }, error: { conditions: { base: "ju367vg9", hover: "ju367vga", active: "ju367vgb" }, defaultClass: "ju367vg9" }, generalBorder: { conditions: { base: "ju367vgc", hover: "ju367vgd", active: "ju367vge" }, defaultClass: "ju367vgc" }, generalBorderDim: { conditions: { base: "ju367vgf", hover: "ju367vgg", active: "ju367vgh" }, defaultClass: "ju367vgf" }, menuItemBackground: { conditions: { base: "ju367vgi", hover: "ju367vgj", active: "ju367vgk" }, defaultClass: "ju367vgi" }, modalBackdrop: { conditions: { base: "ju367vgl", hover: "ju367vgm", active: "ju367vgn" }, defaultClass: "ju367vgl" }, modalBackground: { conditions: { base: "ju367vgo", hover: "ju367vgp", active: "ju367vgq" }, defaultClass: "ju367vgo" }, modalBorder: { conditions: { base: "ju367vgr", hover: "ju367vgs", active: "ju367vgt" }, defaultClass: "ju367vgr" }, modalText: { conditions: { base: "ju367vgu", hover: "ju367vgv", active: "ju367vgw" }, defaultClass: "ju367vgu" }, modalTextDim: { conditions: { base: "ju367vgx", hover: "ju367vgy", active: "ju367vgz" }, defaultClass: "ju367vgx" }, modalTextSecondary: { conditions: { base: "ju367vh0", hover: "ju367vh1", active: "ju367vh2" }, defaultClass: "ju367vh0" }, profileAction: { conditions: { base: "ju367vh3", hover: "ju367vh4", active: "ju367vh5" }, defaultClass: "ju367vh3" }, profileActionHover: { conditions: { base: "ju367vh6", hover: "ju367vh7", active: "ju367vh8" }, defaultClass: "ju367vh6" }, profileForeground: { conditions: { base: "ju367vh9", hover: "ju367vha", active: "ju367vhb" }, defaultClass: "ju367vh9" }, selectedOptionBorder: { conditions: { base: "ju367vhc", hover: "ju367vhd", active: "ju367vhe" }, defaultClass: "ju367vhc" }, standby: { conditions: { base: "ju367vhf", hover: "ju367vhg", active: "ju367vhh" }, defaultClass: "ju367vhf" } } } } }, { conditions: { defaultCondition: "smallScreen", conditionNames: ["smallScreen", "largeScreen"], responsiveArray: void 0 }, styles: { alignItems: { values: { "flex-start": { conditions: { smallScreen: "ju367v0", largeScreen: "ju367v1" }, defaultClass: "ju367v0" }, "flex-end": { conditions: { smallScreen: "ju367v2", largeScreen: "ju367v3" }, defaultClass: "ju367v2" }, center: { conditions: { smallScreen: "ju367v4", largeScreen: "ju367v5" }, defaultClass: "ju367v4" } } }, display: { values: { none: { conditions: { smallScreen: "ju367v6", largeScreen: "ju367v7" }, defaultClass: "ju367v6" }, block: { conditions: { smallScreen: "ju367v8", largeScreen: "ju367v9" }, defaultClass: "ju367v8" }, flex: { conditions: { smallScreen: "ju367va", largeScreen: "ju367vb" }, defaultClass: "ju367va" }, inline: { conditions: { smallScreen: "ju367vc", largeScreen: "ju367vd" }, defaultClass: "ju367vc" } } } } }, { conditions: void 0, styles: { margin: { mappings: ["marginTop", "marginBottom", "marginLeft", "marginRight"] }, marginX: { mappings: ["marginLeft", "marginRight"] }, marginY: { mappings: ["marginTop", "marginBottom"] }, padding: { mappings: ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"] }, paddingX: { mappings: ["paddingLeft", "paddingRight"] }, paddingY: { mappings: ["paddingTop", "paddingBottom"] }, alignSelf: { values: { "flex-start": { defaultClass: "ju367ve" }, "flex-end": { defaultClass: "ju367vf" }, center: { defaultClass: "ju367vg" } } }, backgroundSize: { values: { cover: { defaultClass: "ju367vh" } } }, borderRadius: { values: { "1": { defaultClass: "ju367vi" }, "6": { defaultClass: "ju367vj" }, "10": { defaultClass: "ju367vk" }, "13": { defaultClass: "ju367vl" }, actionButton: { defaultClass: "ju367vm" }, connectButton: { defaultClass: "ju367vn" }, menuButton: { defaultClass: "ju367vo" }, modal: { defaultClass: "ju367vp" }, modalMobile: { defaultClass: "ju367vq" }, "25%": { defaultClass: "ju367vr" }, full: { defaultClass: "ju367vs" } } }, borderStyle: { values: { solid: { defaultClass: "ju367vt" } } }, borderWidth: { values: { "0": { defaultClass: "ju367vu" }, "1": { defaultClass: "ju367vv" }, "2": { defaultClass: "ju367vw" }, "4": { defaultClass: "ju367vx" } } }, cursor: { values: { pointer: { defaultClass: "ju367vy" }, none: { defaultClass: "ju367vz" } } }, pointerEvents: { values: { none: { defaultClass: "ju367v10" }, all: { defaultClass: "ju367v11" } } }, minHeight: { values: { "8": { defaultClass: "ju367v12" }, "44": { defaultClass: "ju367v13" } } }, flexDirection: { values: { row: { defaultClass: "ju367v14" }, column: { defaultClass: "ju367v15" } } }, fontFamily: { values: { body: { defaultClass: "ju367v16" } } }, fontSize: { values: { "12": { defaultClass: "ju367v17" }, "13": { defaultClass: "ju367v18" }, "14": { defaultClass: "ju367v19" }, "16": { defaultClass: "ju367v1a" }, "18": { defaultClass: "ju367v1b" }, "20": { defaultClass: "ju367v1c" }, "23": { defaultClass: "ju367v1d" } } }, fontWeight: { values: { regular: { defaultClass: "ju367v1e" }, medium: { defaultClass: "ju367v1f" }, semibold: { defaultClass: "ju367v1g" }, bold: { defaultClass: "ju367v1h" }, heavy: { defaultClass: "ju367v1i" } } }, gap: { values: { "0": { defaultClass: "ju367v1j" }, "1": { defaultClass: "ju367v1k" }, "2": { defaultClass: "ju367v1l" }, "3": { defaultClass: "ju367v1m" }, "4": { defaultClass: "ju367v1n" }, "5": { defaultClass: "ju367v1o" }, "6": { defaultClass: "ju367v1p" }, "8": { defaultClass: "ju367v1q" }, "10": { defaultClass: "ju367v1r" }, "12": { defaultClass: "ju367v1s" }, "14": { defaultClass: "ju367v1t" }, "16": { defaultClass: "ju367v1u" }, "18": { defaultClass: "ju367v1v" }, "20": { defaultClass: "ju367v1w" }, "24": { defaultClass: "ju367v1x" }, "28": { defaultClass: "ju367v1y" }, "32": { defaultClass: "ju367v1z" }, "36": { defaultClass: "ju367v20" }, "44": { defaultClass: "ju367v21" }, "64": { defaultClass: "ju367v22" }, "-1": { defaultClass: "ju367v23" } } }, height: { values: { "1": { defaultClass: "ju367v24" }, "2": { defaultClass: "ju367v25" }, "4": { defaultClass: "ju367v26" }, "8": { defaultClass: "ju367v27" }, "12": { defaultClass: "ju367v28" }, "20": { defaultClass: "ju367v29" }, "24": { defaultClass: "ju367v2a" }, "28": { defaultClass: "ju367v2b" }, "30": { defaultClass: "ju367v2c" }, "32": { defaultClass: "ju367v2d" }, "34": { defaultClass: "ju367v2e" }, "36": { defaultClass: "ju367v2f" }, "40": { defaultClass: "ju367v2g" }, "44": { defaultClass: "ju367v2h" }, "48": { defaultClass: "ju367v2i" }, "54": { defaultClass: "ju367v2j" }, "60": { defaultClass: "ju367v2k" }, "200": { defaultClass: "ju367v2l" }, full: { defaultClass: "ju367v2m" }, max: { defaultClass: "ju367v2n" } } }, justifyContent: { values: { "flex-start": { defaultClass: "ju367v2o" }, "flex-end": { defaultClass: "ju367v2p" }, center: { defaultClass: "ju367v2q" }, "space-between": { defaultClass: "ju367v2r" }, "space-around": { defaultClass: "ju367v2s" } } }, textAlign: { values: { left: { defaultClass: "ju367v2t" }, center: { defaultClass: "ju367v2u" }, inherit: { defaultClass: "ju367v2v" } } }, marginBottom: { values: { "0": { defaultClass: "ju367v2w" }, "1": { defaultClass: "ju367v2x" }, "2": { defaultClass: "ju367v2y" }, "3": { defaultClass: "ju367v2z" }, "4": { defaultClass: "ju367v30" }, "5": { defaultClass: "ju367v31" }, "6": { defaultClass: "ju367v32" }, "8": { defaultClass: "ju367v33" }, "10": { defaultClass: "ju367v34" }, "12": { defaultClass: "ju367v35" }, "14": { defaultClass: "ju367v36" }, "16": { defaultClass: "ju367v37" }, "18": { defaultClass: "ju367v38" }, "20": { defaultClass: "ju367v39" }, "24": { defaultClass: "ju367v3a" }, "28": { defaultClass: "ju367v3b" }, "32": { defaultClass: "ju367v3c" }, "36": { defaultClass: "ju367v3d" }, "44": { defaultClass: "ju367v3e" }, "64": { defaultClass: "ju367v3f" }, "-1": { defaultClass: "ju367v3g" } } }, marginLeft: { values: { "0": { defaultClass: "ju367v3h" }, "1": { defaultClass: "ju367v3i" }, "2": { defaultClass: "ju367v3j" }, "3": { defaultClass: "ju367v3k" }, "4": { defaultClass: "ju367v3l" }, "5": { defaultClass: "ju367v3m" }, "6": { defaultClass: "ju367v3n" }, "8": { defaultClass: "ju367v3o" }, "10": { defaultClass: "ju367v3p" }, "12": { defaultClass: "ju367v3q" }, "14": { defaultClass: "ju367v3r" }, "16": { defaultClass: "ju367v3s" }, "18": { defaultClass: "ju367v3t" }, "20": { defaultClass: "ju367v3u" }, "24": { defaultClass: "ju367v3v" }, "28": { defaultClass: "ju367v3w" }, "32": { defaultClass: "ju367v3x" }, "36": { defaultClass: "ju367v3y" }, "44": { defaultClass: "ju367v3z" }, "64": { defaultClass: "ju367v40" }, "-1": { defaultClass: "ju367v41" } } }, marginRight: { values: { "0": { defaultClass: "ju367v42" }, "1": { defaultClass: "ju367v43" }, "2": { defaultClass: "ju367v44" }, "3": { defaultClass: "ju367v45" }, "4": { defaultClass: "ju367v46" }, "5": { defaultClass: "ju367v47" }, "6": { defaultClass: "ju367v48" }, "8": { defaultClass: "ju367v49" }, "10": { defaultClass: "ju367v4a" }, "12": { defaultClass: "ju367v4b" }, "14": { defaultClass: "ju367v4c" }, "16": { defaultClass: "ju367v4d" }, "18": { defaultClass: "ju367v4e" }, "20": { defaultClass: "ju367v4f" }, "24": { defaultClass: "ju367v4g" }, "28": { defaultClass: "ju367v4h" }, "32": { defaultClass: "ju367v4i" }, "36": { defaultClass: "ju367v4j" }, "44": { defaultClass: "ju367v4k" }, "64": { defaultClass: "ju367v4l" }, "-1": { defaultClass: "ju367v4m" } } }, marginTop: { values: { "0": { defaultClass: "ju367v4n" }, "1": { defaultClass: "ju367v4o" }, "2": { defaultClass: "ju367v4p" }, "3": { defaultClass: "ju367v4q" }, "4": { defaultClass: "ju367v4r" }, "5": { defaultClass: "ju367v4s" }, "6": { defaultClass: "ju367v4t" }, "8": { defaultClass: "ju367v4u" }, "10": { defaultClass: "ju367v4v" }, "12": { defaultClass: "ju367v4w" }, "14": { defaultClass: "ju367v4x" }, "16": { defaultClass: "ju367v4y" }, "18": { defaultClass: "ju367v4z" }, "20": { defaultClass: "ju367v50" }, "24": { defaultClass: "ju367v51" }, "28": { defaultClass: "ju367v52" }, "32": { defaultClass: "ju367v53" }, "36": { defaultClass: "ju367v54" }, "44": { defaultClass: "ju367v55" }, "64": { defaultClass: "ju367v56" }, "-1": { defaultClass: "ju367v57" } } }, maxWidth: { values: { "1": { defaultClass: "ju367v58" }, "2": { defaultClass: "ju367v59" }, "4": { defaultClass: "ju367v5a" }, "8": { defaultClass: "ju367v5b" }, "12": { defaultClass: "ju367v5c" }, "20": { defaultClass: "ju367v5d" }, "24": { defaultClass: "ju367v5e" }, "28": { defaultClass: "ju367v5f" }, "30": { defaultClass: "ju367v5g" }, "32": { defaultClass: "ju367v5h" }, "34": { defaultClass: "ju367v5i" }, "36": { defaultClass: "ju367v5j" }, "40": { defaultClass: "ju367v5k" }, "44": { defaultClass: "ju367v5l" }, "48": { defaultClass: "ju367v5m" }, "54": { defaultClass: "ju367v5n" }, "60": { defaultClass: "ju367v5o" }, "200": { defaultClass: "ju367v5p" }, full: { defaultClass: "ju367v5q" }, max: { defaultClass: "ju367v5r" } } }, minWidth: { values: { "1": { defaultClass: "ju367v5s" }, "2": { defaultClass: "ju367v5t" }, "4": { defaultClass: "ju367v5u" }, "8": { defaultClass: "ju367v5v" }, "12": { defaultClass: "ju367v5w" }, "20": { defaultClass: "ju367v5x" }, "24": { defaultClass: "ju367v5y" }, "28": { defaultClass: "ju367v5z" }, "30": { defaultClass: "ju367v60" }, "32": { defaultClass: "ju367v61" }, "34": { defaultClass: "ju367v62" }, "36": { defaultClass: "ju367v63" }, "40": { defaultClass: "ju367v64" }, "44": { defaultClass: "ju367v65" }, "48": { defaultClass: "ju367v66" }, "54": { defaultClass: "ju367v67" }, "60": { defaultClass: "ju367v68" }, "200": { defaultClass: "ju367v69" }, full: { defaultClass: "ju367v6a" }, max: { defaultClass: "ju367v6b" } } }, overflow: { values: { hidden: { defaultClass: "ju367v6c" } } }, paddingBottom: { values: { "0": { defaultClass: "ju367v6d" }, "1": { defaultClass: "ju367v6e" }, "2": { defaultClass: "ju367v6f" }, "3": { defaultClass: "ju367v6g" }, "4": { defaultClass: "ju367v6h" }, "5": { defaultClass: "ju367v6i" }, "6": { defaultClass: "ju367v6j" }, "8": { defaultClass: "ju367v6k" }, "10": { defaultClass: "ju367v6l" }, "12": { defaultClass: "ju367v6m" }, "14": { defaultClass: "ju367v6n" }, "16": { defaultClass: "ju367v6o" }, "18": { defaultClass: "ju367v6p" }, "20": { defaultClass: "ju367v6q" }, "24": { defaultClass: "ju367v6r" }, "28": { defaultClass: "ju367v6s" }, "32": { defaultClass: "ju367v6t" }, "36": { defaultClass: "ju367v6u" }, "44": { defaultClass: "ju367v6v" }, "64": { defaultClass: "ju367v6w" }, "-1": { defaultClass: "ju367v6x" } } }, paddingLeft: { values: { "0": { defaultClass: "ju367v6y" }, "1": { defaultClass: "ju367v6z" }, "2": { defaultClass: "ju367v70" }, "3": { defaultClass: "ju367v71" }, "4": { defaultClass: "ju367v72" }, "5": { defaultClass: "ju367v73" }, "6": { defaultClass: "ju367v74" }, "8": { defaultClass: "ju367v75" }, "10": { defaultClass: "ju367v76" }, "12": { defaultClass: "ju367v77" }, "14": { defaultClass: "ju367v78" }, "16": { defaultClass: "ju367v79" }, "18": { defaultClass: "ju367v7a" }, "20": { defaultClass: "ju367v7b" }, "24": { defaultClass: "ju367v7c" }, "28": { defaultClass: "ju367v7d" }, "32": { defaultClass: "ju367v7e" }, "36": { defaultClass: "ju367v7f" }, "44": { defaultClass: "ju367v7g" }, "64": { defaultClass: "ju367v7h" }, "-1": { defaultClass: "ju367v7i" } } }, paddingRight: { values: { "0": { defaultClass: "ju367v7j" }, "1": { defaultClass: "ju367v7k" }, "2": { defaultClass: "ju367v7l" }, "3": { defaultClass: "ju367v7m" }, "4": { defaultClass: "ju367v7n" }, "5": { defaultClass: "ju367v7o" }, "6": { defaultClass: "ju367v7p" }, "8": { defaultClass: "ju367v7q" }, "10": { defaultClass: "ju367v7r" }, "12": { defaultClass: "ju367v7s" }, "14": { defaultClass: "ju367v7t" }, "16": { defaultClass: "ju367v7u" }, "18": { defaultClass: "ju367v7v" }, "20": { defaultClass: "ju367v7w" }, "24": { defaultClass: "ju367v7x" }, "28": { defaultClass: "ju367v7y" }, "32": { defaultClass: "ju367v7z" }, "36": { defaultClass: "ju367v80" }, "44": { defaultClass: "ju367v81" }, "64": { defaultClass: "ju367v82" }, "-1": { defaultClass: "ju367v83" } } }, paddingTop: { values: { "0": { defaultClass: "ju367v84" }, "1": { defaultClass: "ju367v85" }, "2": { defaultClass: "ju367v86" }, "3": { defaultClass: "ju367v87" }, "4": { defaultClass: "ju367v88" }, "5": { defaultClass: "ju367v89" }, "6": { defaultClass: "ju367v8a" }, "8": { defaultClass: "ju367v8b" }, "10": { defaultClass: "ju367v8c" }, "12": { defaultClass: "ju367v8d" }, "14": { defaultClass: "ju367v8e" }, "16": { defaultClass: "ju367v8f" }, "18": { defaultClass: "ju367v8g" }, "20": { defaultClass: "ju367v8h" }, "24": { defaultClass: "ju367v8i" }, "28": { defaultClass: "ju367v8j" }, "32": { defaultClass: "ju367v8k" }, "36": { defaultClass: "ju367v8l" }, "44": { defaultClass: "ju367v8m" }, "64": { defaultClass: "ju367v8n" }, "-1": { defaultClass: "ju367v8o" } } }, position: { values: { absolute: { defaultClass: "ju367v8p" }, fixed: { defaultClass: "ju367v8q" }, relative: { defaultClass: "ju367v8r" } } }, WebkitUserSelect: { values: { none: { defaultClass: "ju367v8s" } } }, right: { values: { "0": { defaultClass: "ju367v8t" } } }, transition: { values: { "default": { defaultClass: "ju367v8u" }, transform: { defaultClass: "ju367v8v" } } }, userSelect: { values: { none: { defaultClass: "ju367v8w" } } }, width: { values: { "1": { defaultClass: "ju367v8x" }, "2": { defaultClass: "ju367v8y" }, "4": { defaultClass: "ju367v8z" }, "8": { defaultClass: "ju367v90" }, "12": { defaultClass: "ju367v91" }, "20": { defaultClass: "ju367v92" }, "24": { defaultClass: "ju367v93" }, "28": { defaultClass: "ju367v94" }, "30": { defaultClass: "ju367v95" }, "32": { defaultClass: "ju367v96" }, "34": { defaultClass: "ju367v97" }, "36": { defaultClass: "ju367v98" }, "40": { defaultClass: "ju367v99" }, "44": { defaultClass: "ju367v9a" }, "48": { defaultClass: "ju367v9b" }, "54": { defaultClass: "ju367v9c" }, "60": { defaultClass: "ju367v9d" }, "200": { defaultClass: "ju367v9e" }, full: { defaultClass: "ju367v9f" }, max: { defaultClass: "ju367v9g" } } }, backdropFilter: { values: { modalOverlay: { defaultClass: "ju367v9h" } } } } });
var themeVars = { colors: { accentColor: "var(--rk-colors-accentColor)", accentColorForeground: "var(--rk-colors-accentColorForeground)", actionButtonBorder: "var(--rk-colors-actionButtonBorder)", actionButtonBorderMobile: "var(--rk-colors-actionButtonBorderMobile)", actionButtonSecondaryBackground: "var(--rk-colors-actionButtonSecondaryBackground)", closeButton: "var(--rk-colors-closeButton)", closeButtonBackground: "var(--rk-colors-closeButtonBackground)", connectButtonBackground: "var(--rk-colors-connectButtonBackground)", connectButtonBackgroundError: "var(--rk-colors-connectButtonBackgroundError)", connectButtonInnerBackground: "var(--rk-colors-connectButtonInnerBackground)", connectButtonText: "var(--rk-colors-connectButtonText)", connectButtonTextError: "var(--rk-colors-connectButtonTextError)", connectionIndicator: "var(--rk-colors-connectionIndicator)", downloadBottomCardBackground: "var(--rk-colors-downloadBottomCardBackground)", downloadTopCardBackground: "var(--rk-colors-downloadTopCardBackground)", error: "var(--rk-colors-error)", generalBorder: "var(--rk-colors-generalBorder)", generalBorderDim: "var(--rk-colors-generalBorderDim)", menuItemBackground: "var(--rk-colors-menuItemBackground)", modalBackdrop: "var(--rk-colors-modalBackdrop)", modalBackground: "var(--rk-colors-modalBackground)", modalBorder: "var(--rk-colors-modalBorder)", modalText: "var(--rk-colors-modalText)", modalTextDim: "var(--rk-colors-modalTextDim)", modalTextSecondary: "var(--rk-colors-modalTextSecondary)", profileAction: "var(--rk-colors-profileAction)", profileActionHover: "var(--rk-colors-profileActionHover)", profileForeground: "var(--rk-colors-profileForeground)", selectedOptionBorder: "var(--rk-colors-selectedOptionBorder)", standby: "var(--rk-colors-standby)" }, fonts: { body: "var(--rk-fonts-body)" }, radii: { actionButton: "var(--rk-radii-actionButton)", connectButton: "var(--rk-radii-connectButton)", menuButton: "var(--rk-radii-menuButton)", modal: "var(--rk-radii-modal)", modalMobile: "var(--rk-radii-modalMobile)" }, shadows: { connectButton: "var(--rk-shadows-connectButton)", dialog: "var(--rk-shadows-dialog)", profileDetailsAction: "var(--rk-shadows-profileDetailsAction)", selectedOption: "var(--rk-shadows-selectedOption)", selectedWallet: "var(--rk-shadows-selectedWallet)", walletLogo: "var(--rk-shadows-walletLogo)" }, blurs: { modalOverlay: "var(--rk-blurs-modalOverlay)" } };
var active = { shrink: "_12cbo8i6", shrinkSm: "_12cbo8i7" };
var base = "_12cbo8i3 ju367v8r";
var hover = { grow: "_12cbo8i4", growLg: "_12cbo8i5" };
function touchableStyles({ active: active2, hover: hover2 }) {
  return [base, hover2 && hover[hover2], active[active2]];
}
function createAuthenticationAdapter(adapter) {
  return adapter;
}
var AuthenticationContext = (0, import_react5.createContext)(
  null
);
function RainbowKitAuthenticationProvider({
  adapter,
  children,
  enabled = true,
  status
}) {
  const { connector } = useAccount();
  const [currentConnectorUid, setCurrentConnectorUid] = (0, import_react5.useState)();
  useAccountEffect({
    onDisconnect: () => {
      adapter.signOut();
      setCurrentConnectorUid(void 0);
    }
  });
  const handleChangedAccount = (data) => {
    if (data.accounts) {
      setCurrentConnectorUid(void 0);
      adapter.signOut();
    }
  };
  (0, import_react5.useEffect)(() => {
    var _a;
    if (typeof ((_a = connector == null ? void 0 : connector.emitter) == null ? void 0 : _a.on) === "function" && status === "authenticated") {
      setCurrentConnectorUid(connector == null ? void 0 : connector.uid);
      connector.emitter.on("change", handleChangedAccount);
      return () => {
        connector.emitter.off("change", handleChangedAccount);
      };
    }
  }, [connector == null ? void 0 : connector.emitter, status]);
  (0, import_react5.useEffect)(() => {
    var _a;
    if (currentConnectorUid && typeof ((_a = connector == null ? void 0 : connector.emitter) == null ? void 0 : _a.on) === "function" && status === "authenticated") {
      if ((connector == null ? void 0 : connector.uid) !== currentConnectorUid) {
        setCurrentConnectorUid(void 0);
        adapter.signOut();
      }
    }
  }, [connector == null ? void 0 : connector.emitter, currentConnectorUid, status]);
  return import_react5.default.createElement(
    AuthenticationContext.Provider,
    {
      value: (0, import_react5.useMemo)(
        () => enabled ? { adapter, status } : null,
        [enabled, adapter, status]
      )
    },
    children
  );
}
function useAuthenticationAdapter() {
  const { adapter } = (0, import_react5.useContext)(AuthenticationContext) ?? {};
  if (!adapter) {
    throw new Error("No authentication adapter found");
  }
  return adapter;
}
function useAuthenticationStatus() {
  const contextValue = (0, import_react5.useContext)(AuthenticationContext);
  return (contextValue == null ? void 0 : contextValue.status) ?? null;
}
function useConnectionStatus() {
  const authenticationStatus = useAuthenticationStatus();
  const { isConnected } = useAccount();
  if (!isConnected) {
    return "disconnected";
  }
  if (!authenticationStatus) {
    return "connected";
  }
  if (authenticationStatus === "loading" || authenticationStatus === "unauthenticated") {
    return authenticationStatus;
  }
  return "connected";
}
function isAndroid() {
  return typeof navigator !== "undefined" && /android/i.test(navigator.userAgent);
}
function isSmallIOS() {
  return typeof navigator !== "undefined" && /iPhone|iPod/.test(navigator.userAgent);
}
function isLargeIOS() {
  return typeof navigator !== "undefined" && (/iPad/.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}
function isIOS() {
  return isSmallIOS() || isLargeIOS();
}
function isMobile() {
  return isAndroid() || isIOS();
}
var base2 = "iekbcc0";
var element = { a: "iekbcca", blockquote: "iekbcc2", button: "iekbcc9", input: "iekbcc8 iekbcc5 iekbcc4", mark: "iekbcc6", ol: "iekbcc1", q: "iekbcc2", select: "iekbcc7 iekbcc5 iekbcc4", table: "iekbcc3", textarea: "iekbcc5 iekbcc4", ul: "iekbcc1" };
var atoms = ({ reset, ...rest }) => {
  if (!reset)
    return sprinkles(rest);
  const elementReset = element[reset];
  const sprinklesClasses = sprinkles(rest);
  return clsx_default(base2, elementReset, sprinklesClasses);
};
var Box = import_react7.default.forwardRef(
  ({ as = "div", className, testId, ...props }, ref) => {
    const atomProps = {};
    const nativeProps = {};
    for (const key in props) {
      if (sprinkles.properties.has(key)) {
        atomProps[key] = props[key];
      } else {
        nativeProps[key] = props[key];
      }
    }
    const atomicClasses = atoms({
      reset: typeof as === "string" ? as : "div",
      ...atomProps
    });
    return import_react7.default.createElement(as, {
      className: clsx_default(atomicClasses, className),
      ...nativeProps,
      "data-testid": testId ? `rk-${testId.replace(/^rk-/, "")}` : void 0,
      ref
    });
  }
);
Box.displayName = "Box";
var cachedUrls = /* @__PURE__ */ new Map();
var cachedRequestPromises = /* @__PURE__ */ new Map();
async function loadAsyncImage(asyncImage) {
  const cachedRequestPromise = cachedRequestPromises.get(asyncImage);
  if (cachedRequestPromise) {
    return cachedRequestPromise;
  }
  const load = async () => asyncImage().then(async (url) => {
    cachedUrls.set(asyncImage, url);
    return url;
  });
  const requestPromise = load().catch((_err) => {
    return load().catch((_err2) => {
      cachedRequestPromises.delete(asyncImage);
    });
  });
  cachedRequestPromises.set(asyncImage, requestPromise);
  return requestPromise;
}
async function loadImages(...urls) {
  return await Promise.all(
    urls.map((url) => typeof url === "function" ? loadAsyncImage(url) : url)
  );
}
function useForceUpdate() {
  const [, forceUpdate] = (0, import_react8.useReducer)((x) => x + 1, 0);
  return forceUpdate;
}
function useAsyncImage(url) {
  const cachedUrl = typeof url === "function" ? cachedUrls.get(url) : void 0;
  const forceUpdate = useForceUpdate();
  (0, import_react8.useEffect)(() => {
    if (typeof url === "function" && !cachedUrl) {
      loadAsyncImage(url).then(forceUpdate);
    }
  }, [url, cachedUrl, forceUpdate]);
  return typeof url === "function" ? cachedUrl : url;
}
function AsyncImage({
  alt,
  background,
  borderColor,
  borderRadius,
  useAsImage,
  boxShadow,
  height,
  src: srcProp,
  width,
  testId
}) {
  const ios = isIOS();
  const src7 = useAsyncImage(srcProp);
  const isRemoteImage = src7 && /^http/.test(src7);
  const [isRemoteImageLoaded, setRemoteImageLoaded] = (0, import_react6.useReducer)(
    () => true,
    false
  );
  return import_react6.default.createElement(
    Box,
    {
      "aria-label": alt,
      borderRadius,
      boxShadow,
      height: typeof height === "string" ? height : void 0,
      overflow: "hidden",
      position: "relative",
      role: "img",
      style: {
        background,
        height: typeof height === "number" ? height : void 0,
        width: typeof width === "number" ? width : void 0
      },
      width: typeof width === "string" ? width : void 0,
      testId
    },
    import_react6.default.createElement(
      Box,
      {
        ...isRemoteImage ? (
          // biome-ignore format: design system keys
          {
            "aria-hidden": true,
            as: "img",
            onLoad: setRemoteImageLoaded,
            src: src7
          }
        ) : { "aria-hidden": true, as: "img", src: src7 },
        height: "full",
        position: "absolute",
        ...ios ? { WebkitUserSelect: "none" } : {},
        style: {
          WebkitTouchCallout: "none",
          transition: "opacity .15s linear",
          userSelect: "none",
          ...!useAsImage && isRemoteImage ? {
            opacity: isRemoteImageLoaded ? 1 : 0
          } : {}
        },
        width: "full"
      }
    ),
    borderColor ? import_react6.default.createElement(
      Box,
      {
        ...typeof borderColor === "object" && "custom" in borderColor ? { style: { borderColor: borderColor.custom } } : { borderColor },
        borderRadius,
        borderStyle: "solid",
        borderWidth: "1",
        height: "full",
        position: "relative",
        width: "full"
      }
    ) : null
  );
}
var SpinnerIconClassName = "_1luule42";
var SpinnerIconPathClassName = "_1luule43";
var useRandomId = (prefix) => (0, import_react10.useMemo)(
  () => `${prefix}_${Math.round(Math.random() * 1e9)}`,
  [prefix]
);
var SpinnerIcon = ({
  height = 21,
  width = 21
}) => {
  const id = useRandomId("spinner");
  return import_react10.default.createElement(
    "svg",
    {
      className: SpinnerIconClassName,
      fill: "none",
      height,
      viewBox: "0 0 21 21",
      width,
      xmlns: "http://www.w3.org/2000/svg"
    },
    import_react10.default.createElement("title", null, "Loading"),
    import_react10.default.createElement("clipPath", { id }, import_react10.default.createElement("path", { d: "M10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18C11.3284 18 12 18.6716 12 19.5C12 20.3284 11.3284 21 10.5 21C4.70101 21 0 16.299 0 10.5C0 4.70101 4.70101 0 10.5 0C16.299 0 21 4.70101 21 10.5C21 11.3284 20.3284 12 19.5 12C18.6716 12 18 11.3284 18 10.5C18 6.35786 14.6421 3 10.5 3Z" })),
    import_react10.default.createElement(
      "foreignObject",
      {
        clipPath: `url(#${id})`,
        height: "21",
        width: "21",
        x: "0",
        y: "0"
      },
      import_react10.default.createElement("div", { className: SpinnerIconPathClassName })
    )
  );
};
var colors = [
  "#FC5C54",
  "#FFD95A",
  "#E95D72",
  "#6A87C8",
  "#5FD0F3",
  "#75C06B",
  "#FFDD86",
  "#5FC6D4",
  "#FF949A",
  "#FF8024",
  "#9BA1A4",
  "#EC66FF",
  "#FF8CBC",
  "#FF9A23",
  "#C5DADB",
  "#A8CE63",
  "#71ABFF",
  "#FFE279",
  "#B6B1B6",
  "#FF6780",
  "#A575FF",
  "#4D82FF",
  "#FFB35A"
];
var avatars = [
  { color: colors[0], emoji: "🌶" },
  { color: colors[1], emoji: "🤑" },
  { color: colors[2], emoji: "🐙" },
  { color: colors[3], emoji: "🫐" },
  { color: colors[4], emoji: "🐳" },
  { color: colors[0], emoji: "🤶" },
  { color: colors[5], emoji: "🌲" },
  { color: colors[6], emoji: "🌞" },
  { color: colors[7], emoji: "🐒" },
  { color: colors[8], emoji: "🐵" },
  { color: colors[9], emoji: "🦊" },
  { color: colors[10], emoji: "🐼" },
  { color: colors[11], emoji: "🦄" },
  { color: colors[12], emoji: "🐷" },
  { color: colors[13], emoji: "🐧" },
  { color: colors[8], emoji: "🦩" },
  { color: colors[14], emoji: "👽" },
  { color: colors[0], emoji: "🎈" },
  { color: colors[8], emoji: "🍉" },
  { color: colors[1], emoji: "🎉" },
  { color: colors[15], emoji: "🐲" },
  { color: colors[16], emoji: "🌎" },
  { color: colors[17], emoji: "🍊" },
  { color: colors[18], emoji: "🐭" },
  { color: colors[19], emoji: "🍣" },
  { color: colors[1], emoji: "🐥" },
  { color: colors[20], emoji: "👾" },
  { color: colors[15], emoji: "🥦" },
  { color: colors[0], emoji: "👹" },
  { color: colors[17], emoji: "🙀" },
  { color: colors[4], emoji: "⛱" },
  { color: colors[21], emoji: "⛵️" },
  { color: colors[17], emoji: "🥳" },
  { color: colors[8], emoji: "🤯" },
  { color: colors[22], emoji: "🤠" }
];
function hashCode(text) {
  let hash7 = 0;
  if (text.length === 0)
    return hash7;
  for (let i = 0; i < text.length; i++) {
    const chr = text.charCodeAt(i);
    hash7 = (hash7 << 5) - hash7 + chr;
    hash7 |= 0;
  }
  return hash7;
}
function emojiAvatarForAddress(address) {
  const resolvedAddress = typeof address === "string" ? address : "";
  const avatarIndex = Math.abs(
    hashCode(resolvedAddress.toLowerCase()) % avatars.length
  );
  return avatars[avatarIndex ?? 0];
}
var EmojiAvatar = ({ address, ensImage, size: size4 }) => {
  const [loaded, setLoaded] = (0, import_react12.useState)(false);
  (0, import_react12.useEffect)(() => {
    if (ensImage) {
      const img = new Image();
      img.src = ensImage;
      img.onload = () => setLoaded(true);
    }
  }, [ensImage]);
  const { color: backgroundColor, emoji } = (0, import_react12.useMemo)(
    () => emojiAvatarForAddress(address),
    [address]
  );
  return ensImage ? loaded ? import_react12.default.createElement(
    Box,
    {
      backgroundSize: "cover",
      borderRadius: "full",
      position: "absolute",
      style: {
        backgroundImage: `url(${ensImage})`,
        backgroundPosition: "center",
        height: size4,
        width: size4
      }
    }
  ) : import_react12.default.createElement(
    Box,
    {
      alignItems: "center",
      backgroundSize: "cover",
      borderRadius: "full",
      color: "modalText",
      display: "flex",
      justifyContent: "center",
      position: "absolute",
      style: {
        height: size4,
        width: size4
      }
    },
    import_react12.default.createElement(SpinnerIcon, null)
  ) : import_react12.default.createElement(
    Box,
    {
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
      overflow: "hidden",
      style: {
        ...!ensImage && { backgroundColor },
        height: size4,
        width: size4
      }
    },
    emoji
  );
};
var defaultAvatar = EmojiAvatar;
var AvatarContext = (0, import_react11.createContext)(defaultAvatar);
function Avatar({ address, imageUrl, loading, size: size4 }) {
  const AvatarComponent = (0, import_react9.useContext)(AvatarContext);
  return import_react9.default.createElement(
    Box,
    {
      "aria-hidden": true,
      borderRadius: "full",
      overflow: "hidden",
      position: "relative",
      style: {
        height: `${size4}px`,
        width: `${size4}px`
      },
      userSelect: "none"
    },
    import_react9.default.createElement(
      Box,
      {
        alignItems: "center",
        borderRadius: "full",
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
        position: "absolute",
        style: {
          fontSize: `${Math.round(size4 * 0.55)}px`,
          height: `${size4}px`,
          transform: loading ? "scale(0.72)" : void 0,
          transition: ".25s ease",
          transitionDelay: loading ? void 0 : ".1s",
          width: `${size4}px`,
          willChange: "transform"
        },
        userSelect: "none"
      },
      import_react9.default.createElement(AvatarComponent, { address, ensImage: imageUrl, size: size4 })
    ),
    loading && import_react9.default.createElement(
      Box,
      {
        color: "accentColor",
        display: "flex",
        height: "full",
        position: "absolute",
        width: "full"
      },
      import_react9.default.createElement(SpinnerIcon, { height: "100%", width: "100%" })
    )
  );
}
var DropdownIcon = () => import_react13.default.createElement("svg", { fill: "none", height: "7", width: "14", xmlns: "http://www.w3.org/2000/svg" }, import_react13.default.createElement("title", null, "Dropdown"), import_react13.default.createElement(
  "path",
  {
    d: "M12.75 1.54001L8.51647 5.0038C7.77974 5.60658 6.72026 5.60658 5.98352 5.0038L1.75 1.54001",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2.5",
    xmlns: "http://www.w3.org/2000/svg"
  }
));
var defaultOptions = {
  defaultLocale: "en",
  locale: "en"
};
var I18n = class {
  constructor(localeTranslations) {
    this.listeners = /* @__PURE__ */ new Set();
    this.defaultLocale = defaultOptions.defaultLocale;
    this.enableFallback = false;
    this.locale = defaultOptions.locale;
    this.cachedLocales = [];
    this.translations = {};
    for (const [locale, translation] of Object.entries(localeTranslations)) {
      this.cachedLocales = [...this.cachedLocales, locale];
      this.translations = {
        ...this.translations,
        ...this.flattenTranslation(translation, locale)
      };
    }
  }
  missingMessage(key) {
    return `[missing: "${this.locale}.${key}" translation]`;
  }
  flattenTranslation(translationObject, locale) {
    const result = {};
    const flatten2 = (currentTranslationObj, parentKey) => {
      for (const key of Object.keys(currentTranslationObj)) {
        const newKey = `${parentKey}.${key}`;
        const currentValue = currentTranslationObj[key];
        if (typeof currentValue === "object" && currentValue !== null) {
          flatten2(currentValue, newKey);
        } else {
          result[newKey] = currentValue;
        }
      }
    };
    flatten2(translationObject, locale);
    return result;
  }
  translateWithReplacements(translation, replacements = {}) {
    let translatedString = translation;
    for (const placeholder in replacements) {
      const replacementValue = replacements[placeholder];
      translatedString = translatedString.replace(
        `%{${placeholder}}`,
        replacementValue
      );
    }
    return translatedString;
  }
  t(key, replacements, options) {
    const translationKey = `${this.locale}.${key}`;
    const translation = this.translations[translationKey];
    if (!translation) {
      if (this.enableFallback) {
        const fallbackTranslationKey = `${this.defaultLocale}.${key}`;
        const fallbackTranslation = this.translations[fallbackTranslationKey];
        if (fallbackTranslation) {
          return this.translateWithReplacements(
            fallbackTranslation,
            replacements
          );
        }
      }
      if (options == null ? void 0 : options.rawKeyIfTranslationMissing)
        return key;
      return this.missingMessage(key);
    }
    return this.translateWithReplacements(translation, replacements);
  }
  isLocaleCached(locale) {
    return this.cachedLocales.includes(locale);
  }
  updateLocale(locale) {
    this.locale = locale;
    this.notifyListeners();
  }
  setTranslations(locale, translations) {
    const cachedLocale = this.isLocaleCached(locale);
    if (!cachedLocale) {
      this.cachedLocales = [...this.cachedLocales, locale];
      this.translations = {
        ...this.translations,
        ...this.flattenTranslation(translations, locale)
      };
    }
    this.locale = locale;
    this.notifyListeners();
  }
  notifyListeners() {
    for (const listener of this.listeners) {
      listener();
    }
  }
  onChange(fn) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }
};
var i18n = new I18n({
  en: JSON.parse(en_US_default),
  "en-US": JSON.parse(en_US_default)
});
i18n.defaultLocale = "en-US";
i18n.locale = "en-US";
i18n.enableFallback = true;
var fetchTranslations = async (locale) => {
  switch (locale) {
    case "ar":
    case "ar-AR":
      return (await import("./ar_AR-ZRPPM56D-ZKSRXSGL.js")).default;
    case "de":
    case "de-DE":
      return (await import("./de_DE-GYZFZXWH-PT3Y2VVL.js")).default;
    case "en":
    case "en-US":
      return (await import("./en_US-AV7YDYDW-DBWD34S6.js")).default;
    case "es":
    case "es-419":
      return (await import("./es_419-OGVOQEFZ-Y3KKXKHY.js")).default;
    case "fr":
    case "fr-FR":
      return (await import("./fr_FR-Q5QBQBX2-ZSVREKM7.js")).default;
    case "hi":
    case "hi-IN":
      return (await import("./hi_IN-7I7LRHGW-2SFDRZ2S.js")).default;
    case "id":
    case "id-ID":
      return (await import("./id_ID-ZMGZ2JFV-EVBBN2TA.js")).default;
    case "ja":
    case "ja-JP":
      return (await import("./ja_JP-NYBCHQTZ-ME2WLWEY.js")).default;
    case "ko":
    case "ko-KR":
      return (await import("./ko_KR-67WE736M-BW5JQIDC.js")).default;
    case "ms":
    case "ms-MY":
      return (await import("./ms_MY-65AJIBUS-HBDJ3PL3.js")).default;
    case "pt":
    case "pt-BR":
      return (await import("./pt_BR-DMJANC65-7TD5UWWG.js")).default;
    case "ru":
    case "ru-RU":
      return (await import("./ru_RU-WER7RQ6A-VJPYUKZD.js")).default;
    case "th":
    case "th-TH":
      return (await import("./th_TH-JOSHEZ6D-U6H5ROGZ.js")).default;
    case "tr":
    case "tr-TR":
      return (await import("./tr_TR-EAMG2YPO-UELUUNAD.js")).default;
    case "ua":
    case "uk-UA":
      return (await import("./uk_UA-GO2TRVWA-BDK42OHK.js")).default;
    case "vi":
    case "vi-VN":
      return (await import("./vi_VN-5HLLSOJA-GK27D2DY.js")).default;
    case "zh":
    case "zh-CN":
    case "zh-Hans":
      return (await import("./zh_CN-THPIFVWJ-ENBJRNLV.js")).default;
    case "zh-HK":
      return (await import("./zh_HK-R7XP4TGF-PASA67MK.js")).default;
    case "zh-Hant":
    case "zh-TW":
      return (await import("./zh_TW-F5LD752V-5IV2BHQO.js")).default;
    default:
      return (await import("./en_US-AV7YDYDW-DBWD34S6.js")).default;
  }
};
async function setLocale(locale) {
  const isCached = i18n.isLocaleCached(locale);
  if (isCached) {
    i18n.updateLocale(locale);
    return;
  }
  const translations = await fetchTranslations(locale);
  i18n.setTranslations(locale, JSON.parse(translations));
}
var detectedBrowserLocale = () => {
  var _a;
  if (typeof window !== "undefined" && typeof navigator !== "undefined") {
    if ((_a = navigator.languages) == null ? void 0 : _a.length) {
      return navigator.languages[0];
    }
    if (navigator.language) {
      return navigator.language;
    }
  }
};
var I18nContext = (0, import_react14.createContext)({ i18n });
var I18nProvider = ({ children, locale }) => {
  const [updateCount, setUpdateCount] = (0, import_react14.useState)(0);
  const browserLocale = (0, import_react14.useMemo)(
    () => detectedBrowserLocale(),
    []
  );
  (0, import_react14.useEffect)(() => {
    const unsubscribe = i18n.onChange(() => {
      setUpdateCount((count) => count + 1);
    });
    return unsubscribe;
  }, []);
  (0, import_react14.useEffect)(() => {
    if (locale && locale !== i18n.locale) {
      setLocale(locale);
    } else if (!locale && browserLocale && browserLocale !== i18n.locale) {
      setLocale(browserLocale);
    }
  }, [locale, browserLocale]);
  const memoizedValue = (0, import_react14.useMemo)(() => {
    const t = (key, options) => i18n.t(key, options);
    return { t, i18n };
  }, [updateCount]);
  return import_react14.default.createElement(I18nContext.Provider, { value: memoizedValue }, children);
};
function isNotNullish(value) {
  return value != null;
}
var arbitrumIcon = {
  iconBackground: "#96bedc",
  iconUrl: async () => (await import("./arbitrum-IA4OWRTN-VD72I64H.js")).default
};
var avalancheIcon = {
  iconBackground: "#e84141",
  iconUrl: async () => (await import("./avalanche-MXEFEDSW-4CXXO43Z.js")).default
};
var baseIcon = {
  iconBackground: "#0052ff",
  iconUrl: async () => (await import("./base-Z4LFBE5D-T2GOMOMX.js")).default
};
var blastIcon = {
  iconBackground: "#000000",
  iconUrl: async () => (await import("./blast-TN2WIMWF-LVSRJVRZ.js")).default
};
var bscIcon = {
  iconBackground: "#ebac0e",
  iconUrl: async () => (await import("./bsc-RVE67I5L-3BZBYXNQ.js")).default
};
var celoIcon = {
  iconBackground: "#FCFF52",
  iconUrl: async () => (await import("./celo-E6XU57FO-AYLL4SWP.js")).default
};
var cronosIcon = {
  iconBackground: "#002D74",
  iconUrl: async () => (await import("./cronos-ROYR77VZ-2BKBJYFO.js")).default
};
var ethereumIcon = {
  iconBackground: "#484c50",
  iconUrl: async () => (await import("./ethereum-RFBAMUVK-YSGKIOUB.js")).default
};
var flowIcon = {
  iconBackground: "transparent",
  iconUrl: async () => (await import("./flow-NBCRNYVF-MFU5RLOO.js")).default
};
var gnosisIcon = {
  iconBackground: "#04795c",
  iconUrl: async () => (await import("./gnosis-T7U5EW2Q-GVPWSQNM.js")).default
};
var hardhatIcon = {
  iconBackground: "#f9f7ec",
  iconUrl: async () => (await import("./hardhat-NEEC6JX7-MPT4HMXN.js")).default
};
var klaytnIcon = {
  iconBackground: "transparent",
  iconUrl: async () => (await import("./klaytn-QTDBZIB3-WVOYT3CS.js")).default
};
var optimismIcon = {
  iconBackground: "#ff5a57",
  iconUrl: async () => (await import("./optimism-VD7XDD2W-P7MMGXGE.js")).default
};
var mantaIcon = {
  iconBackground: "#ffffff",
  iconUrl: async () => (await import("./manta-5V6W5D7G-4VG3RQXQ.js")).default
};
var mantleIcon = {
  iconBackground: "#000000",
  iconUrl: async () => (await import("./mantle-KBL3OIYT-VM6FER2M.js")).default
};
var polygonIcon = {
  iconBackground: "#9f71ec",
  iconUrl: async () => (await import("./polygon-WWEUOMKW-ZR4Z2IFH.js")).default
};
var xdcIcon = {
  iconBackground: "#f9f7ec",
  iconUrl: async () => (await import("./xdc-X7V4QFNF-2WAHO66R.js")).default
};
var zetachainIcon = {
  iconBackground: "#000000",
  iconUrl: async () => (await import("./zetachain-BMJKVYBN-QTJHCIHR.js")).default
};
var zkSyncIcon = {
  iconBackground: "#f9f7ec",
  iconUrl: async () => (await import("./zkSync-JL26RB7U-FEKYMTMJ.js")).default
};
var zoraIcon = {
  iconBackground: "#000000",
  iconUrl: async () => (await import("./zora-YZH32HP3-IP34F6WZ.js")).default
};
var roninIcon = {
  iconBackground: "#1273EA",
  iconUrl: async () => (await import("./ronin-PNHX5V6H-NDKFC7NC.js")).default
};
var scrollIcon = {
  iconBackground: "#000000",
  iconUrl: async () => (await import("./scroll-NMZWDUQH-VDB46WN2.js")).default
};
var chainMetadataByName = {
  arbitrum: { chainId: 42161, name: "Arbitrum", ...arbitrumIcon },
  arbitrumGoerli: { chainId: 421613, ...arbitrumIcon },
  arbitrumSepolia: { chainId: 421614, ...arbitrumIcon },
  avalanche: { chainId: 43114, ...avalancheIcon },
  avalancheFuji: { chainId: 43113, ...avalancheIcon },
  base: { chainId: 8453, name: "Base", ...baseIcon },
  baseGoerli: { chainId: 84531, ...baseIcon },
  baseSepolia: { chainId: 84532, ...baseIcon },
  blast: { chainId: 81457, name: "Blast", ...blastIcon },
  blastSepolia: { chainId: 168587773, ...blastIcon },
  bsc: { chainId: 56, name: "BSC", ...bscIcon },
  bscTestnet: { chainId: 97, ...bscIcon },
  celo: { chainId: 42220, name: "Celo", ...celoIcon },
  celoAlfajores: { chainId: 44787, name: "Celo Alfajores", ...celoIcon },
  cronos: { chainId: 25, ...cronosIcon },
  cronosTestnet: { chainId: 338, ...cronosIcon },
  flow: { chainId: 747, ...flowIcon },
  flowTestnet: { chainId: 545, ...flowIcon },
  goerli: { chainId: 5, ...ethereumIcon },
  gnosis: { chainId: 100, name: "Gnosis", ...gnosisIcon },
  hardhat: { chainId: 31337, ...hardhatIcon },
  holesky: { chainId: 17e3, ...ethereumIcon },
  kovan: { chainId: 42, ...ethereumIcon },
  klaytn: { chainId: 8217, name: "Klaytn", ...klaytnIcon },
  klaytnBaobab: { chainId: 1001, name: "Klaytn Baobab", ...klaytnIcon },
  localhost: { chainId: 1337, ...ethereumIcon },
  mainnet: { chainId: 1, name: "Ethereum", ...ethereumIcon },
  manta: { chainId: 169, name: "Manta", ...mantaIcon },
  mantaSepolia: { chainId: 3441006, ...mantaIcon },
  mantaTestnet: { chainId: 3441005, ...mantaIcon },
  mantle: { chainId: 5e3, ...mantleIcon },
  mantleTestnet: { chainId: 5001, ...mantleIcon },
  optimism: { chainId: 10, name: "Optimism", ...optimismIcon },
  optimismGoerli: { chainId: 420, ...optimismIcon },
  optimismKovan: { chainId: 69, ...optimismIcon },
  optimismSepolia: { chainId: 11155420, ...optimismIcon },
  polygon: { chainId: 137, name: "Polygon", ...polygonIcon },
  polygonAmoy: { chainId: 80002, ...polygonIcon },
  polygonMumbai: { chainId: 80001, ...polygonIcon },
  rinkeby: { chainId: 4, ...ethereumIcon },
  ropsten: { chainId: 3, ...ethereumIcon },
  ronin: { chainId: 2020, ...roninIcon },
  sepolia: { chainId: 11155111, ...ethereumIcon },
  xdc: { chainId: 50, name: "XinFin", ...xdcIcon },
  xdcTestnet: { chainId: 51, ...xdcIcon },
  zetachain: { chainId: 7e3, name: "ZetaChain", ...zetachainIcon },
  zetachainAthensTestnet: {
    chainId: 7001,
    name: "Zeta Athens",
    ...zetachainIcon
  },
  zkSync: { chainId: 324, name: "zkSync", ...zkSyncIcon },
  zkSyncTestnet: { chainId: 280, ...zkSyncIcon },
  zora: { chainId: 7777777, name: "Zora", ...zoraIcon },
  zoraSepolia: { chainId: 999999999, ...zoraIcon },
  zoraTestnet: { chainId: 999, ...zoraIcon },
  scroll: { chainId: 534352, ...scrollIcon },
  scrollSepolia: { chainId: 534351, ...scrollIcon }
};
var chainMetadataById = Object.fromEntries(
  Object.values(chainMetadataByName).filter(isNotNullish).map(({ chainId, ...metadata }) => [chainId, metadata])
);
var provideRainbowKitChains = (chains) => chains.map((chain2) => {
  const defaultMetadata = chainMetadataById[chain2.id] ?? {};
  return {
    ...chain2,
    name: defaultMetadata.name ?? chain2.name,
    // favor colloquial names
    iconUrl: chain2.iconUrl ?? defaultMetadata.iconUrl,
    iconBackground: chain2.iconBackground ?? defaultMetadata.iconBackground
  };
});
var RainbowKitChainContext = (0, import_react15.createContext)({
  chains: []
});
function RainbowKitChainProvider({
  children,
  initialChain
}) {
  const { chains } = useConfig();
  return import_react15.default.createElement(
    RainbowKitChainContext.Provider,
    {
      value: (0, import_react15.useMemo)(
        () => ({
          chains: provideRainbowKitChains(chains),
          initialChainId: typeof initialChain === "number" ? initialChain : initialChain == null ? void 0 : initialChain.id
        }),
        [chains, initialChain]
      )
    },
    children
  );
}
var useRainbowKitChains = () => (0, import_react15.useContext)(RainbowKitChainContext).chains;
var useInitialChainId = () => (0, import_react15.useContext)(RainbowKitChainContext).initialChainId;
var useRainbowKitChainsById = () => {
  const rainbowkitChains = useRainbowKitChains();
  return (0, import_react15.useMemo)(() => {
    const rainbowkitChainsById = {};
    for (const rkChain of rainbowkitChains) {
      rainbowkitChainsById[rkChain.id] = rkChain;
    }
    return rainbowkitChainsById;
  }, [rainbowkitChains]);
};
var ShowBalanceContext = (0, import_react16.createContext)({
  showBalance: void 0,
  setShowBalance: () => {
  }
});
function ShowBalanceProvider({ children }) {
  const [showBalance, setShowBalance] = (0, import_react16.useState)();
  return import_react16.default.createElement(ShowBalanceContext.Provider, { value: { showBalance, setShowBalance } }, children);
}
var useShowBalance = () => (0, import_react16.useContext)(ShowBalanceContext);
function useIsMounted() {
  const [isMounted, setIsMounted] = (0, import_react18.useState)(false);
  (0, import_react18.useEffect)(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);
  return (0, import_react18.useCallback)(() => isMounted, [isMounted]);
}
function useIsMainnetConfigured() {
  const rainbowKitChains = useRainbowKitChains();
  const chainId = mainnet.id;
  const configured = rainbowKitChains.some(
    (rainbowKitChain) => rainbowKitChain.id === chainId
  );
  return configured;
}
function useMainnetEnsAvatar(name) {
  const mainnetConfigured = useIsMainnetConfigured();
  const safeNormalize = (ensName) => {
    try {
      return normalize4(ensName);
    } catch {
    }
  };
  const { data: ensAvatar } = useEnsAvatar({
    chainId: mainnet.id,
    name: name ? safeNormalize(name) : void 0,
    query: {
      enabled: mainnetConfigured
    }
  });
  return ensAvatar;
}
async function rainbowFetch(url, opts) {
  opts = {
    headers: {},
    method: "get",
    ...opts,
    // Any other fetch options
    timeout: opts.timeout ?? 1e4
    // 10 secs
  };
  if (!url)
    throw new Error("rainbowFetch: Missing url argument");
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), opts.timeout);
  const { body, params, headers, ...otherOpts } = opts;
  const requestBody = body && typeof body === "object" ? JSON.stringify(opts.body) : opts.body;
  const response = await fetch(`${url}${createParams(params)}`, {
    ...otherOpts,
    body: requestBody,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers
    },
    signal: controller.signal
  });
  clearTimeout(id);
  const responseBody = await getBody(response);
  if (response.ok) {
    const { headers: headers2, status } = response;
    return { data: responseBody, headers: headers2, status };
  }
  const errorResponseBody = typeof responseBody === "string" ? { error: responseBody } : responseBody;
  const error = generateError({
    requestBody: body,
    response,
    responseBody: errorResponseBody
  });
  throw error;
}
function getBody(response) {
  const contentType = response.headers.get("Content-Type");
  if (contentType == null ? void 0 : contentType.startsWith("application/json")) {
    return response.json();
  }
  return response.text();
}
function createParams(params) {
  return params && Object.keys(params).length ? `?${new URLSearchParams(params)}` : "";
}
function generateError({
  requestBody,
  response,
  responseBody
}) {
  const message = (responseBody == null ? void 0 : responseBody.error) || (response == null ? void 0 : response.statusText) || "There was an error with the request.";
  const error = new Error(message);
  error.response = response;
  error.responseBody = responseBody;
  error.requestBody = requestBody;
  return error;
}
var RainbowFetchClient = class {
  constructor(opts = {}) {
    const { baseUrl = "", ...otherOpts } = opts;
    this.baseUrl = baseUrl;
    this.opts = otherOpts;
  }
  /**
   * Perform a GET request with the RainbowFetchClient.
   */
  get(url, opts) {
    return rainbowFetch(`${this.baseUrl}${url}`, {
      ...this.opts,
      ...opts || {},
      method: "get"
    });
  }
  /**
   * Perform a DELETE request with the RainbowFetchClient.
   */
  delete(url, opts) {
    return rainbowFetch(`${this.baseUrl}${url}`, {
      ...this.opts,
      ...opts || {},
      method: "delete"
    });
  }
  /**
   * Perform a HEAD request with the RainbowFetchClient.
   */
  head(url, opts) {
    return rainbowFetch(`${this.baseUrl}${url}`, {
      ...this.opts,
      ...opts || {},
      method: "head"
    });
  }
  /**
   * Perform a OPTIONS request with the RainbowFetchClient.
   */
  options(url, opts) {
    return rainbowFetch(`${this.baseUrl}${url}`, {
      ...this.opts,
      ...opts || {},
      method: "options"
    });
  }
  /**
   * Perform a POST request with the RainbowFetchClient.
   */
  post(url, body, opts) {
    return rainbowFetch(`${this.baseUrl}${url}`, {
      ...this.opts,
      ...opts || {},
      body,
      method: "post"
    });
  }
  /**
   * Perform a PUT request with the RainbowFetchClient.
   */
  put(url, body, opts) {
    return rainbowFetch(`${this.baseUrl}${url}`, {
      ...this.opts,
      ...opts || {},
      body,
      method: "put"
    });
  }
  /**
   * Perform a PATCH request with the RainbowFetchClient.
   */
  patch(url, body, opts) {
    return rainbowFetch(`${this.baseUrl}${url}`, {
      ...this.opts,
      ...opts || {},
      body,
      method: "patch"
    });
  }
};
function createHttpClient({
  baseUrl,
  headers,
  params,
  timeout
}) {
  return new RainbowFetchClient({ baseUrl, headers, params, timeout });
}
var ENHANCED_PROVIDER_ENABLED = Boolean(
  typeof process !== "undefined" && typeof process.env !== "undefined" && process.env.RAINBOW_PROVIDER_API_KEY
);
var enhancedProviderHttp = createHttpClient({
  baseUrl: "https://enhanced-provider.rainbow.me",
  headers: {
    "x-api-key": typeof process !== "undefined" && typeof process.env !== "undefined" && process.env.RAINBOW_PROVIDER_API_KEY || "LzbasoBiLqltex3VkcQ7LRmL4PtfiiZ1EMJrizrgfonWN6byJReu/l6yrUoo3zLW"
  }
});
function createQueryKey(key, args, config = {}) {
  return [key, args, config];
}
function getStorageEnsNameKey(address) {
  return `rk-ens-name-${address}`;
}
function safeParseJsonData(string) {
  try {
    const value = string ? JSON.parse(string) : null;
    return typeof value === "object" ? value : null;
  } catch {
    return null;
  }
}
function addEnsName(address, ensName) {
  if (!isAddress(address))
    return;
  const now = /* @__PURE__ */ new Date();
  const expiry = new Date(now.getTime() + 180 * 6e4);
  localStorage.setItem(
    getStorageEnsNameKey(address),
    JSON.stringify({
      ensName,
      expires: expiry.getTime()
    })
  );
}
function getEnsName2(address) {
  const data = safeParseJsonData(
    localStorage.getItem(getStorageEnsNameKey(address))
  );
  if (!data)
    return null;
  const { ensName, expires } = data;
  if (typeof ensName !== "string" || Number.isNaN(Number(expires))) {
    localStorage.removeItem(getStorageEnsNameKey(address));
    return null;
  }
  const now = /* @__PURE__ */ new Date();
  if (now.getTime() > Number(expires)) {
    localStorage.removeItem(getStorageEnsNameKey(address));
    return null;
  }
  return ensName;
}
async function getEnhancedProviderEnsName({ address }) {
  const ensName = getEnsName2(address);
  if (ensName)
    return ensName;
  const response = await enhancedProviderHttp.get("/v1/resolve-ens", { params: { address } });
  const enhancedProviderEnsName = response.data.data;
  if (enhancedProviderEnsName) {
    addEnsName(address, enhancedProviderEnsName);
  }
  return enhancedProviderEnsName;
}
function useMainnetEnsName(address) {
  const mainnetConfigured = useIsMainnetConfigured();
  const { data: ensName } = useEnsName({
    chainId: mainnet.id,
    address,
    query: {
      enabled: mainnetConfigured
    }
  });
  const { data: enhancedProviderEnsName } = useQuery({
    queryKey: createQueryKey("address", address),
    queryFn: () => getEnhancedProviderEnsName({ address }),
    enabled: !mainnetConfigured && !!address && ENHANCED_PROVIDER_ENABLED,
    staleTime: 10 * (60 * 1e3),
    // 10 minutes
    retry: 1
    // Retry once before returning undefined if the request fails
  });
  return ensName || enhancedProviderEnsName;
}
function useProfile({ address, includeBalance }) {
  const ensName = useMainnetEnsName(address);
  const ensAvatar = useMainnetEnsAvatar(ensName);
  const { data: balance } = useBalance({
    address: includeBalance ? address : void 0
  });
  return { ensName, ensAvatar, balance };
}
function useChainId() {
  const { chain: activeChain } = useAccount();
  return (activeChain == null ? void 0 : activeChain.id) ?? null;
}
var storageKey = "rk-transactions";
function safeParseJsonData2(string) {
  try {
    const value = string ? JSON.parse(string) : {};
    return typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}
function loadData() {
  return safeParseJsonData2(
    typeof localStorage !== "undefined" ? localStorage.getItem(storageKey) : null
  );
}
var transactionHashRegex = /^0x([A-Fa-f0-9]{64})$/;
function validateTransaction(transaction) {
  const errors = [];
  if (!transactionHashRegex.test(transaction.hash)) {
    errors.push("Invalid transaction hash");
  }
  if (typeof transaction.description !== "string") {
    errors.push("Transaction must have a description");
  }
  if (typeof transaction.confirmations !== "undefined" && (!Number.isInteger(transaction.confirmations) || transaction.confirmations < 1)) {
    errors.push("Transaction confirmations must be a positiver integer");
  }
  return errors;
}
function createTransactionStore({
  provider: initialProvider
}) {
  let data = loadData();
  let provider = initialProvider;
  const listeners = /* @__PURE__ */ new Set();
  const transactionListeners = /* @__PURE__ */ new Set();
  const transactionRequestCache = /* @__PURE__ */ new Map();
  function setProvider(newProvider) {
    provider = newProvider;
  }
  function getTransactions(account, chainId) {
    var _a;
    return ((_a = data[account]) == null ? void 0 : _a[chainId]) ?? [];
  }
  function addTransaction(account, chainId, transaction) {
    const errors = validateTransaction(transaction);
    if (errors.length > 0) {
      throw new Error(["Unable to add transaction", ...errors].join("\n"));
    }
    updateTransactions(account, chainId, (transactions) => {
      return [
        { ...transaction, status: "pending" },
        ...transactions.filter(({ hash: hash7 }) => {
          return hash7 !== transaction.hash;
        })
      ];
    });
  }
  function clearTransactions(account, chainId) {
    updateTransactions(account, chainId, () => {
      return [];
    });
  }
  function setTransactionStatus(account, chainId, hash7, status) {
    updateTransactions(account, chainId, (transactions) => {
      return transactions.map(
        (transaction) => transaction.hash === hash7 ? { ...transaction, status } : transaction
      );
    });
  }
  async function waitForPendingTransactions(account, chainId) {
    await Promise.all(
      getTransactions(account, chainId).filter((transaction) => transaction.status === "pending").map(async (transaction) => {
        const { confirmations, hash: hash7 } = transaction;
        const existingRequest = transactionRequestCache.get(hash7);
        if (existingRequest) {
          return await existingRequest;
        }
        const requestPromise = provider.waitForTransactionReceipt({
          confirmations,
          hash: hash7,
          timeout: 3e5
          // 5 minutes
        }).then(({ status }) => {
          transactionRequestCache.delete(hash7);
          if (status === void 0) {
            return;
          }
          setTransactionStatus(
            account,
            chainId,
            hash7,
            // @ts-ignore - types changed with viem@1.1.0
            status === 0 || status === "reverted" ? "failed" : "confirmed"
          );
          notifyTransactionListeners(status);
        }).catch(() => {
          setTransactionStatus(account, chainId, hash7, "failed");
        });
        transactionRequestCache.set(hash7, requestPromise);
        return await requestPromise;
      })
    );
  }
  function updateTransactions(account, chainId, updateFn) {
    data = loadData();
    data[account] = data[account] ?? {};
    let completedTransactionCount = 0;
    const MAX_COMPLETED_TRANSACTIONS = 10;
    const transactions = updateFn(data[account][chainId] ?? []).filter(({ status }) => {
      return status === "pending" ? true : completedTransactionCount++ <= MAX_COMPLETED_TRANSACTIONS;
    });
    data[account][chainId] = transactions.length > 0 ? transactions : void 0;
    persistData();
    notifyListeners();
    waitForPendingTransactions(account, chainId);
  }
  function persistData() {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }
  function notifyListeners() {
    for (const listener of listeners) {
      listener();
    }
  }
  function notifyTransactionListeners(txStatus) {
    for (const transactionListener of transactionListeners) {
      transactionListener(txStatus);
    }
  }
  function onChange(fn) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }
  function onTransactionStatus(fn) {
    transactionListeners.add(fn);
    return () => {
      transactionListeners.delete(fn);
    };
  }
  return {
    addTransaction,
    clearTransactions,
    getTransactions,
    onTransactionStatus,
    onChange,
    setProvider,
    waitForPendingTransactions
  };
}
var storeSingleton;
var TransactionStoreContext = import_react20.default.createContext(
  null
);
function TransactionStoreProvider({
  children
}) {
  const provider = usePublicClient();
  const { address } = useAccount();
  const chainId = useChainId();
  const { refetch } = useBalance({
    address,
    query: {
      enabled: false
    }
  });
  const [store] = import_react20.default.useState(
    () => storeSingleton ?? (storeSingleton = createTransactionStore({ provider }))
  );
  const onTransactionStatus = import_react20.default.useCallback(
    (txStatus) => {
      if (txStatus === "success")
        refetch();
    },
    [refetch]
  );
  import_react20.default.useEffect(() => {
    store.setProvider(provider);
  }, [store, provider]);
  import_react20.default.useEffect(() => {
    if (address && chainId) {
      store.waitForPendingTransactions(address, chainId);
    }
  }, [store, address, chainId]);
  import_react20.default.useEffect(() => {
    if (store && address && chainId) {
      return store.onTransactionStatus(onTransactionStatus);
    }
  }, [store, address, chainId, onTransactionStatus]);
  return import_react20.default.createElement(TransactionStoreContext.Provider, { value: store }, children);
}
function useTransactionStore() {
  const store = import_react20.default.useContext(TransactionStoreContext);
  if (!store) {
    throw new Error("Transaction hooks must be used within RainbowKitProvider");
  }
  return store;
}
function useRecentTransactions() {
  const store = useTransactionStore();
  const { address } = useAccount();
  const chainId = useChainId();
  const [transactions, setTransactions] = (0, import_react19.useState)(
    () => store && address && chainId ? store.getTransactions(address, chainId) : []
  );
  (0, import_react19.useEffect)(() => {
    if (store && address && chainId) {
      setTransactions(store.getTransactions(address, chainId));
      return store.onChange(() => {
        setTransactions(store.getTransactions(address, chainId));
      });
    }
  }, [store, address, chainId]);
  return transactions;
}
var resolveThemeVars = (theme) => typeof theme === "function" ? theme() : theme;
function cssObjectFromTheme(theme, { extends: baseTheme2 } = {}) {
  const resolvedThemeVars = {
    // We use an object spread here to ensure it's a plain object since vanilla-extract's
    // var objects have a custom 'toString' method that returns a CSS string, but we don't
    // want to leak this to our consumers since they're unaware we're using vanilla-extract.
    // Instead, we want them to handle this explicitly via our 'cssStringFromTheme' function.
    ...assignInlineVars(themeVars, resolveThemeVars(theme))
  };
  if (!baseTheme2) {
    return resolvedThemeVars;
  }
  const resolvedBaseThemeVars = assignInlineVars(
    themeVars,
    resolveThemeVars(baseTheme2)
  );
  const filteredVars = Object.fromEntries(
    Object.entries(resolvedThemeVars).filter(
      ([varName, value]) => value !== resolvedBaseThemeVars[varName]
    )
  );
  return filteredVars;
}
function cssStringFromTheme(theme, options = {}) {
  return Object.entries(cssObjectFromTheme(theme, options)).map(([key, value]) => `${key}:${value.replace(/[:;{}</>]/g, "")};`).join("");
}
var defaultAppInfo = {
  appName: void 0,
  disclaimer: void 0,
  learnMoreUrl: "https://learn.rainbow.me/understanding-web3?utm_source=rainbowkit&utm_campaign=learnmore"
};
var AppContext = (0, import_react25.createContext)(defaultAppInfo);
var CoolModeContext = (0, import_react26.createContext)(false);
function debounce(fn, ms) {
  let timer;
  return () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      fn();
    }, ms);
  };
}
var useWindowSize = () => {
  const [windowSize, setWindowSize] = (0, import_react28.useState)({
    height: void 0,
    width: void 0
  });
  (0, import_react28.useEffect)(() => {
    const handleResize = debounce(() => {
      setWindowSize({
        height: window.innerHeight,
        width: window.innerWidth
      });
    }, 500);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
};
var WalletButtonContext = (0, import_react29.createContext)({
  connector: null,
  setConnector: () => {
  }
});
function WalletButtonProvider({ children }) {
  const [connector, setConnector] = (0, import_react29.useState)(null);
  return import_react29.default.createElement(
    WalletButtonContext.Provider,
    {
      value: (0, import_react29.useMemo)(
        () => ({
          connector,
          setConnector
        }),
        [connector]
      )
    },
    children
  );
}
var ModalSizeOptions = {
  COMPACT: "compact",
  WIDE: "wide"
};
var ModalSizeContext = (0, import_react27.createContext)(
  ModalSizeOptions.WIDE
);
function ModalSizeProvider({
  children,
  modalSize
}) {
  const { width } = useWindowSize();
  const isSmallScreen = width && width < largeScreenMinWidth;
  const { connector } = (0, import_react27.useContext)(WalletButtonContext);
  return import_react27.default.createElement(
    ModalSizeContext.Provider,
    {
      value: isSmallScreen || connector ? ModalSizeOptions.COMPACT : modalSize
    },
    children
  );
}
var ShowRecentTransactionsContext = (0, import_react30.createContext)(false);
var storageKey2 = "rk-version";
function setRainbowKitVersion({ version: version2 }) {
  localStorage.setItem(storageKey2, version2);
}
function useFingerprint() {
  const fingerprint = (0, import_react31.useCallback)(() => {
    setRainbowKitVersion({ version: "2.2.2" });
  }, []);
  (0, import_react31.useEffect)(() => {
    fingerprint();
  }, [fingerprint]);
}
function indexBy(items, getKey2) {
  const indexedItems = {};
  for (const item of items) {
    const key = getKey2(item);
    if (!key) {
      continue;
    }
    indexedItems[key] = item;
  }
  return indexedItems;
}
function isSafari() {
  return typeof navigator !== "undefined" && typeof navigator.userAgent !== "undefined" && /Version\/([0-9._]+).*Safari/.test(navigator.userAgent);
}
function isArc() {
  return typeof document !== "undefined" && getComputedStyle(document.body).getPropertyValue("--arc-palette-focus") !== "";
}
function getBrowser() {
  var _a, _b;
  if (typeof navigator === "undefined")
    return "Browser";
  const ua2 = (_a = navigator.userAgent) == null ? void 0 : _a.toLowerCase();
  if ((_b = navigator.brave) == null ? void 0 : _b.isBrave)
    return "Brave";
  if ((ua2 == null ? void 0 : ua2.indexOf("edg/")) > -1)
    return "Edge";
  if ((ua2 == null ? void 0 : ua2.indexOf("op")) > -1)
    return "Opera";
  if (isArc())
    return "Arc";
  if ((ua2 == null ? void 0 : ua2.indexOf("chrome")) > -1)
    return "Chrome";
  if ((ua2 == null ? void 0 : ua2.indexOf("firefox")) > -1)
    return "Firefox";
  if (isSafari())
    return "Safari";
  return "Browser";
}
var ua = (0, import_ua_parser_js.UAParser)();
var { os } = ua;
function isWindows() {
  return os.name === "Windows";
}
function isMacOS() {
  return os.name === "Mac OS";
}
function isLinux() {
  return ["Ubuntu", "Mint", "Fedora", "Debian", "Arch", "Linux"].includes(
    os.name
  );
}
function getPlatform() {
  if (isWindows())
    return "Windows";
  if (isMacOS())
    return "macOS";
  if (isLinux())
    return "Linux";
  return "Desktop";
}
var getExtensionDownloadUrl = (wallet) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const browser = getBrowser();
  return {
    [
      "Arc"
      /* Arc */
    ]: (_a = wallet == null ? void 0 : wallet.downloadUrls) == null ? void 0 : _a.chrome,
    [
      "Brave"
      /* Brave */
    ]: (_b = wallet == null ? void 0 : wallet.downloadUrls) == null ? void 0 : _b.chrome,
    [
      "Chrome"
      /* Chrome */
    ]: (_c = wallet == null ? void 0 : wallet.downloadUrls) == null ? void 0 : _c.chrome,
    [
      "Edge"
      /* Edge */
    ]: ((_d = wallet == null ? void 0 : wallet.downloadUrls) == null ? void 0 : _d.edge) || ((_e = wallet == null ? void 0 : wallet.downloadUrls) == null ? void 0 : _e.chrome),
    [
      "Firefox"
      /* Firefox */
    ]: (_f = wallet == null ? void 0 : wallet.downloadUrls) == null ? void 0 : _f.firefox,
    [
      "Opera"
      /* Opera */
    ]: ((_g = wallet == null ? void 0 : wallet.downloadUrls) == null ? void 0 : _g.opera) || ((_h = wallet == null ? void 0 : wallet.downloadUrls) == null ? void 0 : _h.chrome),
    [
      "Safari"
      /* Safari */
    ]: (_i = wallet == null ? void 0 : wallet.downloadUrls) == null ? void 0 : _i.safari,
    [
      "Browser"
      /* Browser */
    ]: (_j = wallet == null ? void 0 : wallet.downloadUrls) == null ? void 0 : _j.browserExtension
  }[browser] ?? ((_k = wallet == null ? void 0 : wallet.downloadUrls) == null ? void 0 : _k.browserExtension);
};
var getMobileDownloadUrl = (wallet) => {
  var _a, _b, _c;
  const ios = isIOS();
  return (ios ? (_a = wallet == null ? void 0 : wallet.downloadUrls) == null ? void 0 : _a.ios : (_b = wallet == null ? void 0 : wallet.downloadUrls) == null ? void 0 : _b.android) ?? ((_c = wallet == null ? void 0 : wallet.downloadUrls) == null ? void 0 : _c.mobile);
};
var getDesktopDownloadUrl = (wallet) => {
  var _a, _b, _c, _d, _e;
  const platform = getPlatform();
  return {
    [
      "Windows"
      /* Windows */
    ]: (_a = wallet == null ? void 0 : wallet.downloadUrls) == null ? void 0 : _a.windows,
    [
      "macOS"
      /* MacOS */
    ]: (_b = wallet == null ? void 0 : wallet.downloadUrls) == null ? void 0 : _b.macos,
    [
      "Linux"
      /* Linux */
    ]: (_c = wallet == null ? void 0 : wallet.downloadUrls) == null ? void 0 : _c.linux,
    [
      "Desktop"
      /* Desktop */
    ]: (_d = wallet == null ? void 0 : wallet.downloadUrls) == null ? void 0 : _d.desktop
  }[platform] ?? ((_e = wallet == null ? void 0 : wallet.downloadUrls) == null ? void 0 : _e.desktop);
};
var isRecentWallet = (recentWallets, walletId) => {
  return recentWallets.some((recentWallet) => recentWallet.id === walletId);
};
var isRainbowKitConnector = (wallet) => {
  return !!wallet.isRainbowKitConnector;
};
var isEIP6963Connector = (wallet) => {
  var _a;
  return !!(!wallet.isRainbowKitConnector && ((_a = wallet.icon) == null ? void 0 : _a.replace(/\n/g, "").startsWith("data:image")) && wallet.uid && wallet.name);
};
var rainbowKitConnectorWithWalletConnect = (wallet, walletConnectModalConnector) => {
  const shouldUseWalletConnectModal = wallet.id === "walletConnect" && walletConnectModalConnector;
  return shouldUseWalletConnectModal ? { ...wallet, walletConnectModalConnector } : wallet;
};
var connectorsWithRecentWallets = ({
  wallets,
  recentWallets
}) => {
  return [
    ...recentWallets,
    ...wallets.filter((wallet) => !isRecentWallet(recentWallets, wallet.id))
  ];
};
var storageKey3 = "rk-recent";
function safeParseJsonArray(string) {
  try {
    const value = string ? JSON.parse(string) : [];
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}
function getRecentWalletIds() {
  return typeof localStorage !== "undefined" ? safeParseJsonArray(localStorage.getItem(storageKey3)) : [];
}
function dedupe(array) {
  return [...new Set(array)];
}
function addRecentWalletId(walletId) {
  const newValue = dedupe([walletId, ...getRecentWalletIds()]);
  localStorage.setItem(storageKey3, JSON.stringify(newValue));
}
function useWalletConnectors(mergeEIP6963WithRkConnectors = false) {
  var _a, _b, _c;
  const rainbowKitChains = useRainbowKitChains();
  const intialChainId = useInitialChainId();
  const { connectAsync, connectors: defaultConnectors_untyped } = useConnect();
  const defaultCreatedConnectors = defaultConnectors_untyped;
  const { setIsWalletConnectModalOpen } = useWalletConnectOpenState();
  const defaultConnectors = defaultCreatedConnectors.map((connector) => ({
    ...connector,
    // rkDetails is optional it does not exist in eip6963 connectors.
    // We only inject `rkDetails` in `connectorsForWallets` when we
    // want to have additional information in the connector.
    ...connector.rkDetails || {}
  }));
  async function connectWallet(connector) {
    var _a2, _b2;
    const walletChainId = await connector.getChainId();
    const result = await connectAsync({
      chainId: (
        // The goal here is to ensure users are always on a supported chain when connecting.
        // If an `initialChain` prop was provided to RainbowKitProvider, use that.
        intialChainId ?? // Otherwise, if the wallet is already on a supported chain, use that to avoid a chain switch prompt.
        ((_a2 = rainbowKitChains.find(({ id }) => id === walletChainId)) == null ? void 0 : _a2.id) ?? // Finally, fall back to the first chain provided to RainbowKitProvider.
        ((_b2 = rainbowKitChains[0]) == null ? void 0 : _b2.id)
      ),
      connector
    });
    if (result) {
      addRecentWalletId(connector.id);
    }
    return result;
  }
  async function connectToWalletConnectModal(walletConnectModalConnector2) {
    try {
      setIsWalletConnectModalOpen(true);
      await connectWallet(walletConnectModalConnector2);
      setIsWalletConnectModalOpen(false);
    } catch (err) {
      const isUserRejection = (
        // @ts-expect-error - Web3Modal v1 error name
        err.name === "UserRejectedRequestError" || // @ts-expect-error - Web3Modal v2 error message on desktop
        err.message === "Connection request reset. Please try again."
      );
      setIsWalletConnectModalOpen(false);
      if (!isUserRejection) {
        throw err;
      }
    }
  }
  const getWalletConnectUri = async (connector, uriConverter) => {
    const provider = await connector.getProvider();
    if (connector.id === "coinbase") {
      return provider.qrUrl;
    }
    return new Promise(
      (resolve) => (
        // Wagmi v2 doesn't have a return type for provider yet
        // @ts-expect-error
        provider.once("display_uri", (uri) => {
          resolve(uriConverter(uri));
        })
      )
    );
  };
  const walletConnectModalConnector = defaultConnectors.find(
    (connector) => connector.id === "walletConnect" && connector.isWalletConnectModalConnector
  );
  const eip6963Connectors = defaultConnectors.filter(isEIP6963Connector).map((connector) => {
    return {
      ...connector,
      groupIndex: 0
    };
  });
  const rainbowKitConnectors = defaultConnectors.filter(isRainbowKitConnector).filter((wallet) => !wallet.isWalletConnectModalConnector).filter((wallet) => {
    if (!mergeEIP6963WithRkConnectors)
      return true;
    const existsInEIP6963Connectors = eip6963Connectors.some(
      (eip6963) => eip6963.id === wallet.rdns
    );
    return !existsInEIP6963Connectors;
  }).map(
    (wallet) => rainbowKitConnectorWithWalletConnect(
      wallet,
      walletConnectModalConnector
    )
  );
  const combinedConnectors = [...eip6963Connectors, ...rainbowKitConnectors];
  const walletInstanceById = indexBy(
    combinedConnectors,
    (walletInstance) => walletInstance.id
  );
  const MAX_RECENT_WALLETS = 3;
  const recentWallets = getRecentWalletIds().map((walletId) => walletInstanceById[walletId]).filter(Boolean).slice(0, MAX_RECENT_WALLETS);
  const walletConnectors = [];
  const combinedConnectorsWithRecentWallets = connectorsWithRecentWallets({
    wallets: combinedConnectors,
    recentWallets
  });
  for (const wallet of combinedConnectorsWithRecentWallets) {
    if (!wallet)
      continue;
    const eip6963 = isEIP6963Connector(wallet);
    const recent = isRecentWallet(recentWallets, wallet.id);
    if (eip6963) {
      walletConnectors.push({
        ...wallet,
        iconUrl: wallet.icon,
        ready: true,
        connect: () => connectWallet(wallet),
        groupName: "Installed",
        recent
      });
      continue;
    }
    walletConnectors.push({
      ...wallet,
      ready: wallet.installed ?? true,
      connect: () => connectWallet(wallet),
      desktopDownloadUrl: getDesktopDownloadUrl(wallet),
      extensionDownloadUrl: getExtensionDownloadUrl(wallet),
      groupName: wallet.groupName,
      mobileDownloadUrl: getMobileDownloadUrl(wallet),
      getQrCodeUri: ((_a = wallet.qrCode) == null ? void 0 : _a.getUri) ? () => getWalletConnectUri(wallet, wallet.qrCode.getUri) : void 0,
      getDesktopUri: ((_b = wallet.desktop) == null ? void 0 : _b.getUri) ? () => getWalletConnectUri(wallet, wallet.desktop.getUri) : void 0,
      getMobileUri: ((_c = wallet.mobile) == null ? void 0 : _c.getUri) ? () => {
        var _a2;
        return getWalletConnectUri(wallet, (_a2 = wallet.mobile) == null ? void 0 : _a2.getUri);
      } : void 0,
      recent,
      showWalletConnectModal: wallet.walletConnectModalConnector ? () => connectToWalletConnectModal(wallet.walletConnectModalConnector) : void 0
    });
  }
  return walletConnectors;
}
var src = async () => (await import("./assets-NU2OP443-BNWVZLKK.js")).default;
var preloadAssetsIcon = () => loadImages(src);
var AssetsIcon = () => import_react33.default.createElement(
  AsyncImage,
  {
    background: "#d0d5de",
    borderRadius: "10",
    height: "48",
    src,
    width: "48"
  }
);
var src2 = async () => (await import("./login-CWDTIDNK-UP7EFTGT.js")).default;
var preloadLoginIcon = () => loadImages(src2);
var LoginIcon = () => import_react34.default.createElement(
  AsyncImage,
  {
    background: "#d0d5de",
    borderRadius: "10",
    height: "48",
    src: src2,
    width: "48"
  }
);
var Text = import_react37.default.forwardRef(
  ({
    as = "div",
    children,
    className,
    color,
    display,
    font = "body",
    id,
    size: size4 = "16",
    style,
    tabIndex,
    textAlign = "inherit",
    weight = "regular",
    testId
  }, ref) => {
    return import_react37.default.createElement(
      Box,
      {
        as,
        className,
        color,
        display,
        fontFamily: font,
        fontSize: size4,
        fontWeight: weight,
        id,
        ref,
        style,
        tabIndex,
        textAlign,
        testId
      },
      children
    );
  }
);
Text.displayName = "Text";
var sizeVariants = {
  large: {
    fontSize: "16",
    paddingX: "24",
    paddingY: "10"
  },
  medium: {
    fontSize: "14",
    height: "28",
    paddingX: "12",
    paddingY: "4"
  },
  small: {
    fontSize: "14",
    paddingX: "10",
    paddingY: "5"
  }
};
function ActionButton({
  disabled = false,
  href,
  label,
  onClick,
  rel = "noreferrer noopener",
  size: size4 = "medium",
  target = "_blank",
  testId,
  type: type6 = "primary"
}) {
  const isPrimary = type6 === "primary";
  const isNotLarge = size4 !== "large";
  const mobile = isMobile();
  const background = !disabled ? isPrimary ? "accentColor" : isNotLarge ? "actionButtonSecondaryBackground" : null : "actionButtonSecondaryBackground";
  const { fontSize, height, paddingX, paddingY } = sizeVariants[size4];
  const hasBorder = !mobile || !isNotLarge;
  return import_react36.default.createElement(
    Box,
    {
      ...href ? !disabled ? { as: "a", href, rel, target } : {} : { as: "button", type: "button" },
      onClick: !disabled ? onClick : void 0,
      ...hasBorder ? {
        borderColor: mobile && !isNotLarge && !isPrimary ? "actionButtonBorderMobile" : "actionButtonBorder",
        borderStyle: "solid",
        borderWidth: "1"
      } : {},
      borderRadius: "actionButton",
      className: !disabled && touchableStyles({ active: "shrinkSm", hover: "grow" }),
      display: "block",
      paddingX,
      paddingY,
      style: { willChange: "transform" },
      testId,
      textAlign: "center",
      transition: "transform",
      ...background ? { background } : {},
      ...height ? { height } : {}
    },
    import_react36.default.createElement(
      Text,
      {
        color: !disabled ? isPrimary ? "accentColorForeground" : "accentColor" : "modalTextSecondary",
        size: fontSize,
        weight: "bold"
      },
      label
    )
  );
}
var CloseIcon = () => {
  return isMobile() ? import_react39.default.createElement(
    "svg",
    {
      "aria-hidden": true,
      fill: "none",
      height: "11.5",
      viewBox: "0 0 11.5 11.5",
      width: "11.5",
      xmlns: "http://www.w3.org/2000/svg"
    },
    import_react39.default.createElement("title", null, "Close"),
    import_react39.default.createElement(
      "path",
      {
        d: "M2.13388 0.366117C1.64573 -0.122039 0.854272 -0.122039 0.366117 0.366117C-0.122039 0.854272 -0.122039 1.64573 0.366117 2.13388L3.98223 5.75L0.366117 9.36612C-0.122039 9.85427 -0.122039 10.6457 0.366117 11.1339C0.854272 11.622 1.64573 11.622 2.13388 11.1339L5.75 7.51777L9.36612 11.1339C9.85427 11.622 10.6457 11.622 11.1339 11.1339C11.622 10.6457 11.622 9.85427 11.1339 9.36612L7.51777 5.75L11.1339 2.13388C11.622 1.64573 11.622 0.854272 11.1339 0.366117C10.6457 -0.122039 9.85427 -0.122039 9.36612 0.366117L5.75 3.98223L2.13388 0.366117Z",
        fill: "currentColor"
      }
    )
  ) : import_react39.default.createElement(
    "svg",
    {
      "aria-hidden": true,
      fill: "none",
      height: "10",
      viewBox: "0 0 10 10",
      width: "10",
      xmlns: "http://www.w3.org/2000/svg"
    },
    import_react39.default.createElement("title", null, "Close"),
    import_react39.default.createElement(
      "path",
      {
        d: "M1.70711 0.292893C1.31658 -0.0976311 0.683417 -0.0976311 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L3.58579 5L0.292893 8.29289C-0.0976311 8.68342 -0.0976311 9.31658 0.292893 9.70711C0.683417 10.0976 1.31658 10.0976 1.70711 9.70711L5 6.41421L8.29289 9.70711C8.68342 10.0976 9.31658 10.0976 9.70711 9.70711C10.0976 9.31658 10.0976 8.68342 9.70711 8.29289L6.41421 5L9.70711 1.70711C10.0976 1.31658 10.0976 0.683417 9.70711 0.292893C9.31658 -0.0976311 8.68342 -0.0976311 8.29289 0.292893L5 3.58579L1.70711 0.292893Z",
        fill: "currentColor"
      }
    )
  );
};
var CloseButton = ({
  "aria-label": ariaLabel = "Close",
  onClose
}) => {
  const mobile = isMobile();
  return import_react38.default.createElement(
    Box,
    {
      alignItems: "center",
      "aria-label": ariaLabel,
      as: "button",
      background: "closeButtonBackground",
      borderColor: "actionButtonBorder",
      borderRadius: "full",
      borderStyle: "solid",
      borderWidth: mobile ? "0" : "1",
      className: touchableStyles({ active: "shrinkSm", hover: "growLg" }),
      color: "closeButton",
      display: "flex",
      height: mobile ? "30" : "28",
      justifyContent: "center",
      onClick: onClose,
      style: { willChange: "transform" },
      transition: "default",
      type: "button",
      width: mobile ? "30" : "28"
    },
    import_react38.default.createElement(CloseIcon, null)
  );
};
var signInIcon = async () => (await import("./sign-A7IJEUT5-GNWDXFV6.js")).default;
function SignIn({
  onClose,
  onCloseModal
}) {
  const { i18n: i18n2 } = (0, import_react35.useContext)(I18nContext);
  const [{ status, ...state }, setState] = import_react35.default.useState({ status: "idle" });
  const authAdapter = useAuthenticationAdapter();
  const getNonce2 = (0, import_react35.useCallback)(async () => {
    try {
      const nonce = await authAdapter.getNonce();
      setState((x) => ({ ...x, nonce }));
    } catch {
      setState((x) => ({
        ...x,
        errorMessage: i18n2.t("sign_in.message.preparing_error"),
        status: "idle"
      }));
    }
  }, [authAdapter, i18n2.t]);
  const onceRef = (0, import_react35.useRef)(false);
  import_react35.default.useEffect(() => {
    if (onceRef.current)
      return;
    onceRef.current = true;
    getNonce2();
  }, [getNonce2]);
  const mobile = isMobile();
  const { address, chain: activeChain } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const signIn = async () => {
    try {
      const chainId = activeChain == null ? void 0 : activeChain.id;
      const { nonce } = state;
      if (!address || !chainId || !nonce) {
        return;
      }
      setState((x) => ({
        ...x,
        errorMessage: void 0,
        status: "signing"
      }));
      const message = authAdapter.createMessage({ address, chainId, nonce });
      let signature;
      try {
        signature = await signMessageAsync({
          message
        });
      } catch (error) {
        if (error instanceof UserRejectedRequestError) {
          return setState((x) => ({
            ...x,
            status: "idle"
          }));
        }
        return setState((x) => ({
          ...x,
          errorMessage: i18n2.t("sign_in.signature.signing_error"),
          status: "idle"
        }));
      }
      setState((x) => ({ ...x, status: "verifying" }));
      try {
        const verified = await authAdapter.verify({ message, signature });
        if (verified) {
          onCloseModal();
          return;
        }
        throw new Error();
      } catch {
        return setState((x) => ({
          ...x,
          errorMessage: i18n2.t("sign_in.signature.verifying_error"),
          status: "idle"
        }));
      }
    } catch {
      setState({
        errorMessage: i18n2.t("sign_in.signature.oops_error"),
        status: "idle"
      });
    }
  };
  return import_react35.default.createElement(Box, { position: "relative" }, import_react35.default.createElement(
    Box,
    {
      display: "flex",
      paddingRight: "16",
      paddingTop: "16",
      position: "absolute",
      right: "0"
    },
    import_react35.default.createElement(CloseButton, { onClose })
  ), import_react35.default.createElement(
    Box,
    {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      gap: mobile ? "32" : "24",
      padding: "24",
      paddingX: "18",
      style: { paddingTop: mobile ? "60px" : "36px" }
    },
    import_react35.default.createElement(
      Box,
      {
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: mobile ? "6" : "4",
        style: { maxWidth: mobile ? 320 : 280 }
      },
      import_react35.default.createElement(
        Box,
        {
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: mobile ? "32" : "16"
        },
        import_react35.default.createElement(AsyncImage, { height: 40, src: signInIcon, width: 40 }),
        import_react35.default.createElement(
          Text,
          {
            color: "modalText",
            size: mobile ? "20" : "18",
            textAlign: "center",
            weight: "heavy"
          },
          i18n2.t("sign_in.label")
        )
      ),
      import_react35.default.createElement(
        Box,
        {
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: mobile ? "16" : "12"
        },
        import_react35.default.createElement(
          Text,
          {
            color: "modalTextSecondary",
            size: mobile ? "16" : "14",
            textAlign: "center"
          },
          i18n2.t("sign_in.description")
        ),
        status === "idle" && state.errorMessage ? import_react35.default.createElement(
          Text,
          {
            color: "error",
            size: mobile ? "16" : "14",
            textAlign: "center",
            weight: "bold"
          },
          state.errorMessage
        ) : null
      )
    ),
    import_react35.default.createElement(
      Box,
      {
        alignItems: !mobile ? "center" : void 0,
        display: "flex",
        flexDirection: "column",
        gap: "8",
        width: "full"
      },
      import_react35.default.createElement(
        ActionButton,
        {
          disabled: !state.nonce || status === "signing" || status === "verifying",
          label: !state.nonce ? i18n2.t("sign_in.message.preparing") : status === "signing" ? i18n2.t("sign_in.signature.waiting") : status === "verifying" ? i18n2.t("sign_in.signature.verifying") : i18n2.t("sign_in.message.send"),
          onClick: signIn,
          size: mobile ? "large" : "medium",
          testId: "auth-message-button"
        }
      ),
      mobile ? import_react35.default.createElement(
        ActionButton,
        {
          label: "Cancel",
          onClick: onClose,
          size: "large",
          type: "secondary"
        }
      ) : import_react35.default.createElement(
        Box,
        {
          as: "button",
          borderRadius: "full",
          className: touchableStyles({ active: "shrink", hover: "grow" }),
          display: "block",
          onClick: onClose,
          paddingX: "10",
          paddingY: "5",
          rel: "noreferrer",
          style: { willChange: "transform" },
          target: "_blank",
          transition: "default"
        },
        import_react35.default.createElement(
          Text,
          {
            color: "closeButton",
            size: mobile ? "16" : "14",
            weight: "bold"
          },
          i18n2.t("sign_in.message.cancel")
        )
      )
    )
  ));
}
function usePreloadImages() {
  const rainbowKitChains = useRainbowKitChains();
  const walletConnectors = useWalletConnectors();
  const isUnauthenticated = useAuthenticationStatus() === "unauthenticated";
  const preloadImages = (0, import_react32.useCallback)(() => {
    loadImages(
      ...walletConnectors.map((wallet) => wallet.iconUrl),
      ...rainbowKitChains.map((chain2) => chain2.iconUrl).filter(isNotNullish)
    );
    if (!isMobile()) {
      preloadAssetsIcon();
      preloadLoginIcon();
    }
    if (isUnauthenticated) {
      loadImages(signInIcon);
    }
  }, [walletConnectors, rainbowKitChains, isUnauthenticated]);
  (0, import_react32.useEffect)(() => {
    preloadImages();
  }, [preloadImages]);
}
var storageKey4 = "WALLETCONNECT_DEEPLINK_CHOICE";
function setWalletConnectDeepLink({
  mobileUri,
  name
}) {
  localStorage.setItem(
    storageKey4,
    JSON.stringify({
      href: mobileUri.split("?")[0],
      name
    })
  );
}
function clearWalletConnectDeepLink() {
  localStorage.removeItem(storageKey4);
}
var ThemeIdContext = (0, import_react24.createContext)(void 0);
var attr = "data-rk";
var createThemeRootProps = (id) => ({ [attr]: id || "" });
var createThemeRootSelector = (id) => {
  if (id && !/^[a-zA-Z0-9_]+$/.test(id)) {
    throw new Error(`Invalid ID: ${id}`);
  }
  return id ? `[${attr}="${id}"]` : `[${attr}]`;
};
var useThemeRootProps = () => {
  const id = (0, import_react24.useContext)(ThemeIdContext);
  return createThemeRootProps(id);
};
var defaultTheme = lightTheme();
function RainbowKitProvider({
  appInfo,
  avatar,
  children,
  coolMode = false,
  id,
  initialChain,
  locale,
  modalSize = ModalSizeOptions.WIDE,
  showRecentTransactions = false,
  theme = defaultTheme
}) {
  usePreloadImages();
  useFingerprint();
  useAccountEffect({ onDisconnect: clearWalletConnectDeepLink });
  if (typeof theme === "function") {
    throw new Error(
      'A theme function was provided to the "theme" prop instead of a theme object. You must execute this function to get the resulting theme object.'
    );
  }
  const selector = createThemeRootSelector(id);
  const appContext = {
    ...defaultAppInfo,
    ...appInfo
  };
  const avatarContext = avatar ?? defaultAvatar;
  return import_react24.default.createElement(RainbowKitChainProvider, { initialChain }, import_react24.default.createElement(WalletButtonProvider, null, import_react24.default.createElement(I18nProvider, { locale }, import_react24.default.createElement(CoolModeContext.Provider, { value: coolMode }, import_react24.default.createElement(ModalSizeProvider, { modalSize }, import_react24.default.createElement(
    ShowRecentTransactionsContext.Provider,
    {
      value: showRecentTransactions
    },
    import_react24.default.createElement(TransactionStoreProvider, null, import_react24.default.createElement(AvatarContext.Provider, { value: avatarContext }, import_react24.default.createElement(AppContext.Provider, { value: appContext }, import_react24.default.createElement(ThemeIdContext.Provider, { value: id }, import_react24.default.createElement(ShowBalanceProvider, null, import_react24.default.createElement(ModalProvider, null, theme ? import_react24.default.createElement("div", { ...createThemeRootProps(id) }, import_react24.default.createElement(
      "style",
      {
        dangerouslySetInnerHTML: {
          // Selectors are sanitized to only contain alphanumeric
          // and underscore characters. Theme values generated by
          // cssStringFromTheme are sanitized, removing
          // characters that terminate values / HTML tags.
          __html: [
            `${selector}{${cssStringFromTheme(
              "lightMode" in theme ? theme.lightMode : theme
            )}}`,
            "darkMode" in theme ? `@media(prefers-color-scheme:dark){${selector}{${cssStringFromTheme(
              theme.darkMode,
              { extends: theme.lightMode }
            )}}}` : null
          ].join("")
        }
      }
    ), children) : children))))))
  ))))));
}
var content = "_9pm4ki5 ju367va ju367v15 ju367v8r";
var overlay = "_9pm4ki3 ju367v9h ju367vb3 ju367va ju367v2q ju367v8q";
var moveFocusWithin = (element2, position) => {
  const focusableElements = element2.querySelectorAll(
    "button:not(:disabled), a[href]"
  );
  if (focusableElements.length === 0)
    return;
  focusableElements[position === "end" ? focusableElements.length - 1 : 0].focus();
};
function FocusTrap(props) {
  const contentRef = (0, import_react41.useRef)(null);
  (0, import_react41.useEffect)(() => {
    const previouslyActiveElement = document.activeElement;
    return () => {
      var _a;
      (_a = previouslyActiveElement.focus) == null ? void 0 : _a.call(previouslyActiveElement);
    };
  }, []);
  (0, import_react41.useEffect)(() => {
    if (contentRef.current) {
      const elementToFocus = contentRef.current.querySelector("[data-auto-focus]");
      if (elementToFocus) {
        elementToFocus.focus();
      } else {
        contentRef.current.focus();
      }
    }
  }, []);
  return import_react40.default.createElement(import_react40.default.Fragment, null, import_react40.default.createElement(
    "div",
    {
      onFocus: (0, import_react41.useCallback)(
        () => contentRef.current && moveFocusWithin(contentRef.current, "end"),
        []
      ),
      tabIndex: 0
    }
  ), import_react40.default.createElement(
    "div",
    {
      ref: contentRef,
      style: { outline: "none" },
      tabIndex: -1,
      ...props
    }
  ), import_react40.default.createElement(
    "div",
    {
      onFocus: (0, import_react41.useCallback)(
        () => contentRef.current && moveFocusWithin(contentRef.current, "start"),
        []
      ),
      tabIndex: 0
    }
  ));
}
var stopPropagation = (event) => event.stopPropagation();
function Dialog({ children, onClose, open, titleId }) {
  (0, import_react23.useEffect)(() => {
    const handleEscape = (event) => open && event.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);
  const [bodyScrollable, setBodyScrollable] = (0, import_react23.useState)(true);
  (0, import_react23.useEffect)(() => {
    setBodyScrollable(
      getComputedStyle(window.document.body).overflow !== "hidden"
    );
  }, []);
  const handleBackdropClick = (0, import_react23.useCallback)(() => onClose(), [onClose]);
  const themeRootProps = useThemeRootProps();
  const mobile = isMobile();
  return import_react23.default.createElement(import_react23.default.Fragment, null, open ? (0, import_react_dom.createPortal)(
    import_react23.default.createElement(Combination_default, { enabled: bodyScrollable }, import_react23.default.createElement(Box, { ...themeRootProps }, import_react23.default.createElement(
      Box,
      {
        ...themeRootProps,
        alignItems: mobile ? "flex-end" : "center",
        "aria-labelledby": titleId,
        "aria-modal": true,
        className: overlay,
        onClick: handleBackdropClick,
        position: "fixed",
        role: "dialog"
      },
      import_react23.default.createElement(
        FocusTrap,
        {
          className: content,
          onClick: stopPropagation,
          role: "document"
        },
        children
      )
    ))),
    document.body
  ) : null);
}
var bottomSheetOverrides = "_1ckjpok7";
var dialogContent = "_1ckjpok1 ju367vb6 ju367vdr ju367vp ju367vt ju367vv ju367vel ju367va ju367v15 ju367v6c ju367v8r";
var dialogContentCompactMode = "_1ckjpok4 _1ckjpok1 ju367vb6 ju367vdr ju367vp ju367vt ju367vv ju367vel ju367va ju367v15 ju367v6c ju367v8r";
var dialogContentMobile = "_1ckjpok6 ju367vq";
var dialogContentWideDesktop = "_1ckjpok3 _1ckjpok1 ju367vb6 ju367vdr ju367vp ju367vt ju367vv ju367vel ju367va ju367v15 ju367v6c ju367v8r";
var dialogContentWideMobile = "_1ckjpok2 _1ckjpok1 ju367vb6 ju367vdr ju367vp ju367vt ju367vv ju367vel ju367va ju367v15 ju367v6c ju367v8r";
function DialogContent({
  bottomSheetOnMobile = false,
  children,
  marginTop,
  padding: padding2 = "16",
  paddingBottom,
  wide = false
}) {
  const mobile = isMobile();
  const modalSize = (0, import_react42.useContext)(ModalSizeContext);
  const compactModeEnabled = modalSize === ModalSizeOptions.COMPACT;
  return import_react42.default.createElement(Box, { marginTop }, import_react42.default.createElement(
    Box,
    {
      className: [
        wide ? mobile ? dialogContentWideMobile : compactModeEnabled ? dialogContentCompactMode : dialogContentWideDesktop : dialogContent,
        mobile ? dialogContentMobile : null,
        mobile && bottomSheetOnMobile ? bottomSheetOverrides : null
      ].join(" ")
    },
    import_react42.default.createElement(Box, { padding: padding2, paddingBottom: paddingBottom ?? padding2 }, children)
  ));
}
var units = ["k", "m", "b", "t"];
function toPrecision(number, precision = 1) {
  return number.toString().replace(new RegExp(`(.+\\.\\d{${precision}})\\d+`), "$1").replace(/(\.[1-9]*)0+$/, "$1").replace(/\.$/, "");
}
function abbreviateETHBalance(number) {
  if (number < 1)
    return toPrecision(number, 3);
  if (number < 10 ** 2)
    return toPrecision(number, 2);
  if (number < 10 ** 4)
    return new Intl.NumberFormat().format(
      Number.parseFloat(toPrecision(number, 1))
    );
  const decimalsDivisor = 10 ** 1;
  let result = String(number);
  for (let i = units.length - 1; i >= 0; i--) {
    const size4 = 10 ** ((i + 1) * 3);
    if (size4 <= number) {
      number = number * decimalsDivisor / size4 / decimalsDivisor;
      result = toPrecision(number, 1) + units[i];
      break;
    }
  }
  return result;
}
function formatAddress(address) {
  const leadingChars = 4;
  const trailingChars = 4;
  return address.length < leadingChars + trailingChars ? address : `${address.substring(0, leadingChars)}…${address.substring(
    address.length - trailingChars
  )}`;
}
function formatENS(name) {
  if (!name)
    return "";
  const parts = name.split(".");
  const last = parts.pop();
  if (parts.join(".").length > 24) {
    return `${parts.join(".").substring(0, 24)}...`;
  }
  return `${parts.join(".")}.${last}`;
}
var CopiedIcon = () => import_react44.default.createElement(
  "svg",
  {
    fill: "none",
    height: "13",
    viewBox: "0 0 13 13",
    width: "13",
    xmlns: "http://www.w3.org/2000/svg"
  },
  import_react44.default.createElement("title", null, "Copied"),
  import_react44.default.createElement(
    "path",
    {
      d: "M4.94568 12.2646C5.41052 12.2646 5.77283 12.0869 6.01892 11.7109L12.39 1.96973C12.5677 1.69629 12.6429 1.44336 12.6429 1.2041C12.6429 0.561523 12.1644 0.0966797 11.5082 0.0966797C11.057 0.0966797 10.7767 0.260742 10.5033 0.691406L4.9115 9.50977L2.07458 5.98926C1.82166 5.68848 1.54822 5.55176 1.16541 5.55176C0.502319 5.55176 0.0238037 6.02344 0.0238037 6.66602C0.0238037 6.95312 0.112671 7.20605 0.358765 7.48633L3.88611 11.7588C4.18005 12.1074 4.50818 12.2646 4.94568 12.2646Z",
      fill: "currentColor"
    }
  )
);
var CopyIcon = () => import_react45.default.createElement(
  "svg",
  {
    fill: "none",
    height: "16",
    viewBox: "0 0 17 16",
    width: "17",
    xmlns: "http://www.w3.org/2000/svg"
  },
  import_react45.default.createElement("title", null, "Copy"),
  import_react45.default.createElement(
    "path",
    {
      d: "M3.04236 12.3027H4.18396V13.3008C4.18396 14.8525 5.03845 15.7002 6.59705 15.7002H13.6244C15.183 15.7002 16.0375 14.8525 16.0375 13.3008V6.24609C16.0375 4.69434 15.183 3.84668 13.6244 3.84668H12.4828V2.8418C12.4828 1.29688 11.6283 0.442383 10.0697 0.442383H3.04236C1.48376 0.442383 0.629272 1.29004 0.629272 2.8418V9.90332C0.629272 11.4551 1.48376 12.3027 3.04236 12.3027ZM3.23376 10.5391C2.68689 10.5391 2.39294 10.2656 2.39294 9.68457V3.06055C2.39294 2.47949 2.68689 2.21289 3.23376 2.21289H9.8783C10.4252 2.21289 10.7191 2.47949 10.7191 3.06055V3.84668H6.59705C5.03845 3.84668 4.18396 4.69434 4.18396 6.24609V10.5391H3.23376ZM6.78845 13.9365C6.24158 13.9365 5.94763 13.6699 5.94763 13.0889V6.45801C5.94763 5.87695 6.24158 5.61035 6.78845 5.61035H13.433C13.9799 5.61035 14.2738 5.87695 14.2738 6.45801V13.0889C14.2738 13.6699 13.9799 13.9365 13.433 13.9365H6.78845Z",
      fill: "currentColor"
    }
  )
);
var DisconnectIcon = () => import_react46.default.createElement(
  "svg",
  {
    fill: "none",
    height: "16",
    viewBox: "0 0 18 16",
    width: "18",
    xmlns: "http://www.w3.org/2000/svg"
  },
  import_react46.default.createElement("title", null, "Disconnect"),
  import_react46.default.createElement(
    "path",
    {
      d: "M2.67834 15.5908H9.99963C11.5514 15.5908 12.399 14.7432 12.399 13.1777V10.2656H10.6354V12.9863C10.6354 13.5332 10.3688 13.8271 9.78772 13.8271H2.89026C2.3092 13.8271 2.0426 13.5332 2.0426 12.9863V3.15625C2.0426 2.60254 2.3092 2.30859 2.89026 2.30859H9.78772C10.3688 2.30859 10.6354 2.60254 10.6354 3.15625V5.89746H12.399V2.95801C12.399 1.39941 11.5514 0.544922 9.99963 0.544922H2.67834C1.12659 0.544922 0.278931 1.39941 0.278931 2.95801V13.1777C0.278931 14.7432 1.12659 15.5908 2.67834 15.5908ZM7.43616 8.85059H14.0875L15.0924 8.78906L14.566 9.14453L13.6842 9.96484C13.5406 10.1016 13.4586 10.2861 13.4586 10.4844C13.4586 10.8398 13.7321 11.168 14.1217 11.168C14.3199 11.168 14.4635 11.0928 14.6002 10.9561L16.7809 8.68652C16.986 8.48145 17.0543 8.27637 17.0543 8.06445C17.0543 7.85254 16.986 7.64746 16.7809 7.43555L14.6002 5.17285C14.4635 5.03613 14.3199 4.9541 14.1217 4.9541C13.7321 4.9541 13.4586 5.27539 13.4586 5.6377C13.4586 5.83594 13.5406 6.02734 13.6842 6.15723L14.566 6.98438L15.0924 7.33984L14.0875 7.27148H7.43616C7.01917 7.27148 6.65686 7.62012 6.65686 8.06445C6.65686 8.50195 7.01917 8.85059 7.43616 8.85059Z",
      fill: "currentColor"
    }
  )
);
function useClearRecentTransactions() {
  const store = useTransactionStore();
  const { address } = useAccount();
  const chainId = useChainId();
  return (0, import_react48.useCallback)(() => {
    if (!address || !chainId) {
      throw new Error("No address or chain ID found");
    }
    store.clearTransactions(address, chainId);
  }, [store, address, chainId]);
}
var chainToExplorerUrl = (chain2) => {
  var _a, _b;
  return (_b = (_a = chain2 == null ? void 0 : chain2.blockExplorers) == null ? void 0 : _a.default) == null ? void 0 : _b.url;
};
var ExternalLinkIcon = () => import_react49.default.createElement(
  "svg",
  {
    fill: "none",
    height: "19",
    viewBox: "0 0 20 19",
    width: "20",
    xmlns: "http://www.w3.org/2000/svg"
  },
  import_react49.default.createElement("title", null, "Link"),
  import_react49.default.createElement(
    "path",
    {
      d: "M10 18.9443C15.0977 18.9443 19.2812 14.752 19.2812 9.6543C19.2812 4.56543 15.0889 0.373047 10 0.373047C4.90234 0.373047 0.71875 4.56543 0.71875 9.6543C0.71875 14.752 4.91113 18.9443 10 18.9443ZM10 16.6328C6.1416 16.6328 3.03906 13.5215 3.03906 9.6543C3.03906 5.7959 6.13281 2.68457 10 2.68457C13.8584 2.68457 16.9697 5.7959 16.9697 9.6543C16.9785 13.5215 13.8672 16.6328 10 16.6328ZM12.7158 12.1416C13.2432 12.1416 13.5684 11.7549 13.5684 11.1836V7.19336C13.5684 6.44629 13.1377 6.05957 12.417 6.05957H8.40918C7.8291 6.05957 7.45117 6.38477 7.45117 6.91211C7.45117 7.43945 7.8291 7.77344 8.40918 7.77344H9.69238L10.7207 7.63281L9.53418 8.67871L6.73047 11.4912C6.53711 11.6758 6.41406 11.9395 6.41406 12.2031C6.41406 12.7832 6.85352 13.1699 7.39844 13.1699C7.68848 13.1699 7.92578 13.0732 8.1543 12.8623L10.9316 10.0762L11.9775 8.89844L11.8545 9.98828V11.1836C11.8545 11.7725 12.1885 12.1416 12.7158 12.1416Z",
      fill: "currentColor"
    }
  )
);
var CancelIcon = () => import_react51.default.createElement(
  "svg",
  {
    fill: "none",
    height: "19",
    viewBox: "0 0 20 19",
    width: "20",
    xmlns: "http://www.w3.org/2000/svg"
  },
  import_react51.default.createElement("title", null, "Cancel"),
  import_react51.default.createElement(
    "path",
    {
      d: "M10 18.9443C15.0977 18.9443 19.2812 14.752 19.2812 9.6543C19.2812 4.56543 15.0889 0.373047 10 0.373047C4.90234 0.373047 0.71875 4.56543 0.71875 9.6543C0.71875 14.752 4.91113 18.9443 10 18.9443ZM10 16.6328C6.1416 16.6328 3.03906 13.5215 3.03906 9.6543C3.03906 5.7959 6.13281 2.68457 10 2.68457C13.8584 2.68457 16.9697 5.7959 16.9697 9.6543C16.9785 13.5215 13.8672 16.6328 10 16.6328ZM7.29297 13.3018C7.58301 13.3018 7.81152 13.2139 7.99609 13.0205L10 11.0166L12.0127 13.0205C12.1973 13.2051 12.4258 13.3018 12.707 13.3018C13.2432 13.3018 13.6562 12.8887 13.6562 12.3525C13.6562 12.0977 13.5508 11.8691 13.3662 11.6934L11.3535 9.67188L13.375 7.6416C13.5596 7.44824 13.6562 7.22852 13.6562 6.98242C13.6562 6.44629 13.2432 6.0332 12.7158 6.0332C12.4346 6.0332 12.2148 6.12109 12.0215 6.31445L10 8.32715L7.9873 6.32324C7.80273 6.12988 7.58301 6.04199 7.29297 6.04199C6.76562 6.04199 6.35254 6.45508 6.35254 6.99121C6.35254 7.2373 6.44922 7.46582 6.63379 7.6416L8.65527 9.67188L6.63379 11.6934C6.44922 11.8691 6.35254 12.1064 6.35254 12.3525C6.35254 12.8887 6.76562 13.3018 7.29297 13.3018Z",
      fill: "currentColor"
    }
  )
);
var SuccessIcon = () => import_react52.default.createElement(
  "svg",
  {
    fill: "none",
    height: "20",
    viewBox: "0 0 20 20",
    width: "20",
    xmlns: "http://www.w3.org/2000/svg"
  },
  import_react52.default.createElement("title", null, "Success"),
  import_react52.default.createElement(
    "path",
    {
      d: "M10 19.4443C15.0977 19.4443 19.2812 15.252 19.2812 10.1543C19.2812 5.06543 15.0889 0.873047 10 0.873047C4.90234 0.873047 0.71875 5.06543 0.71875 10.1543C0.71875 15.252 4.91113 19.4443 10 19.4443ZM10 17.1328C6.1416 17.1328 3.03906 14.0215 3.03906 10.1543C3.03906 6.2959 6.13281 3.18457 10 3.18457C13.8584 3.18457 16.9697 6.2959 16.9697 10.1543C16.9785 14.0215 13.8672 17.1328 10 17.1328ZM9.07715 14.3379C9.4375 14.3379 9.7627 14.1533 9.97363 13.8369L13.7441 8.00977C13.8848 7.79883 13.9814 7.5791 13.9814 7.36816C13.9814 6.84961 13.5244 6.48926 13.0322 6.48926C12.707 6.48926 12.4258 6.66504 12.2148 7.0166L9.05957 12.0967L7.5918 10.2949C7.37207 10.0225 7.13477 9.9082 6.84473 9.9082C6.33496 9.9082 5.92188 10.3125 5.92188 10.8223C5.92188 11.0684 6.00098 11.2793 6.18555 11.5078L8.1543 13.8545C8.40918 14.1709 8.70801 14.3379 9.07715 14.3379Z",
      fill: "currentColor"
    }
  )
);
var getTxStatusIcon = (status) => {
  switch (status) {
    case "pending":
      return SpinnerIcon;
    case "confirmed":
      return SuccessIcon;
    case "failed":
      return CancelIcon;
    default:
      return SpinnerIcon;
  }
};
function TxItem({ tx }) {
  const mobile = isMobile();
  const Icon = getTxStatusIcon(tx.status);
  const color = tx.status === "failed" ? "error" : "accentColor";
  const { chain: activeChain } = useAccount();
  const confirmationStatus = tx.status === "confirmed" ? "Confirmed" : tx.status === "failed" ? "Failed" : "Pending";
  const explorerLink = chainToExplorerUrl(activeChain);
  return import_react50.default.createElement(import_react50.default.Fragment, null, import_react50.default.createElement(
    Box,
    {
      ...explorerLink ? {
        as: "a",
        background: { hover: "profileForeground" },
        borderRadius: "menuButton",
        className: touchableStyles({ active: "shrink" }),
        href: `${explorerLink}/tx/${tx.hash}`,
        rel: "noreferrer noopener",
        target: "_blank",
        transition: "default"
      } : {},
      color: "modalText",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      padding: "8",
      width: "full"
    },
    import_react50.default.createElement(
      Box,
      {
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        gap: mobile ? "16" : "14"
      },
      import_react50.default.createElement(Box, { color }, import_react50.default.createElement(Icon, null)),
      import_react50.default.createElement(Box, { display: "flex", flexDirection: "column", gap: mobile ? "3" : "1" }, import_react50.default.createElement(Box, null, import_react50.default.createElement(
        Text,
        {
          color: "modalText",
          font: "body",
          size: mobile ? "16" : "14",
          weight: "bold"
        },
        tx == null ? void 0 : tx.description
      )), import_react50.default.createElement(Box, null, import_react50.default.createElement(
        Text,
        {
          color: tx.status === "pending" ? "modalTextSecondary" : color,
          font: "body",
          size: "14",
          weight: mobile ? "medium" : "regular"
        },
        confirmationStatus
      )))
    ),
    explorerLink && import_react50.default.createElement(Box, { alignItems: "center", color: "modalTextDim", display: "flex" }, import_react50.default.createElement(ExternalLinkIcon, null))
  ));
}
var NUMBER_OF_VISIBLE_TXS = 3;
function TxList({ address }) {
  const recentTransactions = useRecentTransactions();
  const clearRecentTransactions = useClearRecentTransactions();
  const { chain: activeChain } = useAccount();
  const explorerLink = chainToExplorerUrl(activeChain);
  const visibleTxs = recentTransactions.slice(0, NUMBER_OF_VISIBLE_TXS);
  const hasTransactions = visibleTxs.length > 0;
  const mobile = isMobile();
  const { appName } = (0, import_react47.useContext)(AppContext);
  const { i18n: i18n2 } = (0, import_react47.useContext)(I18nContext);
  return import_react47.default.createElement(import_react47.default.Fragment, null, import_react47.default.createElement(
    Box,
    {
      display: "flex",
      flexDirection: "column",
      gap: "10",
      paddingBottom: "2",
      paddingTop: "16",
      paddingX: mobile ? "8" : "18"
    },
    hasTransactions && import_react47.default.createElement(
      Box,
      {
        paddingBottom: mobile ? "4" : "0",
        paddingTop: "8",
        paddingX: mobile ? "12" : "6"
      },
      import_react47.default.createElement(Box, { display: "flex", justifyContent: "space-between" }, import_react47.default.createElement(
        Text,
        {
          color: "modalTextSecondary",
          size: mobile ? "16" : "14",
          weight: "semibold"
        },
        i18n2.t("profile.transactions.recent.title")
      ), import_react47.default.createElement(
        Box,
        {
          style: {
            marginBottom: -6,
            marginLeft: -10,
            marginRight: -10,
            marginTop: -6
          }
        },
        import_react47.default.createElement(
          Box,
          {
            as: "button",
            background: {
              hover: "profileForeground"
            },
            borderRadius: "actionButton",
            className: touchableStyles({ active: "shrink" }),
            onClick: clearRecentTransactions,
            paddingX: mobile ? "8" : "12",
            paddingY: mobile ? "4" : "5",
            transition: "default",
            type: "button"
          },
          import_react47.default.createElement(
            Text,
            {
              color: "modalTextSecondary",
              size: mobile ? "16" : "14",
              weight: "semibold"
            },
            i18n2.t("profile.transactions.clear.label")
          )
        )
      ))
    ),
    import_react47.default.createElement(Box, { display: "flex", flexDirection: "column", gap: "4" }, hasTransactions ? visibleTxs.map((tx) => import_react47.default.createElement(TxItem, { key: tx.hash, tx })) : import_react47.default.createElement(import_react47.default.Fragment, null, import_react47.default.createElement(Box, { padding: mobile ? "12" : "8" }, import_react47.default.createElement(
      Text,
      {
        color: "modalTextDim",
        size: mobile ? "16" : "14",
        weight: mobile ? "medium" : "bold"
      },
      appName ? i18n2.t("profile.transactions.description", {
        appName
      }) : i18n2.t("profile.transactions.description_fallback")
    )), mobile && import_react47.default.createElement(
      Box,
      {
        background: "generalBorderDim",
        height: "1",
        marginX: "12",
        marginY: "8"
      }
    )))
  ), explorerLink && import_react47.default.createElement(Box, { paddingBottom: "18", paddingX: mobile ? "8" : "18" }, import_react47.default.createElement(
    Box,
    {
      alignItems: "center",
      as: "a",
      background: { hover: "profileForeground" },
      borderRadius: "menuButton",
      className: touchableStyles({ active: "shrink" }),
      color: "modalTextDim",
      display: "flex",
      flexDirection: "row",
      href: `${explorerLink}/address/${address}`,
      justifyContent: "space-between",
      paddingX: "8",
      paddingY: "12",
      rel: "noreferrer noopener",
      style: { willChange: "transform" },
      target: "_blank",
      transition: "default",
      width: "full",
      ...mobile ? { paddingLeft: "12" } : {}
    },
    import_react47.default.createElement(
      Text,
      {
        color: "modalText",
        font: "body",
        size: mobile ? "16" : "14",
        weight: mobile ? "semibold" : "bold"
      },
      i18n2.t("profile.explorer.label")
    ),
    import_react47.default.createElement(ExternalLinkIcon, null)
  )));
}
function ProfileDetailsAction({
  action,
  icon,
  label,
  testId,
  url
}) {
  const mobile = isMobile();
  return import_react53.default.createElement(
    Box,
    {
      ...url ? { as: "a", href: url, rel: "noreferrer noopener", target: "_blank" } : { as: "button", type: "button" },
      background: {
        base: "profileAction",
        ...!mobile ? { hover: "profileActionHover" } : {}
      },
      borderRadius: "menuButton",
      boxShadow: "profileDetailsAction",
      className: touchableStyles({
        active: "shrinkSm",
        hover: !mobile ? "grow" : void 0
      }),
      display: "flex",
      onClick: action,
      padding: mobile ? "6" : "8",
      style: { willChange: "transform" },
      testId,
      transition: "default",
      width: "full"
    },
    import_react53.default.createElement(
      Box,
      {
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: "1",
        justifyContent: "center",
        paddingTop: "2",
        width: "full"
      },
      import_react53.default.createElement(Box, { color: "modalText", height: "max" }, icon),
      import_react53.default.createElement(Box, null, import_react53.default.createElement(Text, { color: "modalText", size: mobile ? "12" : "13", weight: "semibold" }, label))
    )
  );
}
function ProfileDetails({
  address,
  ensAvatar,
  ensName,
  balance,
  onClose,
  onDisconnect
}) {
  const showRecentTransactions = (0, import_react43.useContext)(ShowRecentTransactionsContext);
  const [copiedAddress, setCopiedAddress] = (0, import_react43.useState)(false);
  const copyAddressAction = (0, import_react43.useCallback)(() => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopiedAddress(true);
    }
  }, [address]);
  (0, import_react43.useEffect)(() => {
    if (copiedAddress) {
      const timer = setTimeout(() => {
        setCopiedAddress(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [copiedAddress]);
  if (!address) {
    return null;
  }
  const accountName = ensName ? formatENS(ensName) : formatAddress(address);
  const ethBalance = balance == null ? void 0 : balance.formatted;
  const displayBalance = ethBalance ? abbreviateETHBalance(Number.parseFloat(ethBalance)) : void 0;
  const titleId = "rk_profile_title";
  const mobile = isMobile();
  const { i18n: i18n2 } = (0, import_react43.useContext)(I18nContext);
  return import_react43.default.createElement(import_react43.default.Fragment, null, import_react43.default.createElement(Box, { display: "flex", flexDirection: "column" }, import_react43.default.createElement(Box, { background: "profileForeground", padding: "16" }, import_react43.default.createElement(
    Box,
    {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      gap: mobile ? "16" : "12",
      justifyContent: "center",
      margin: "8",
      style: { textAlign: "center" }
    },
    import_react43.default.createElement(
      Box,
      {
        style: {
          position: "absolute",
          right: 16,
          top: 16,
          willChange: "transform"
        }
      },
      import_react43.default.createElement(CloseButton, { onClose })
    ),
    " ",
    import_react43.default.createElement(Box, { marginTop: mobile ? "24" : "0" }, import_react43.default.createElement(
      Avatar,
      {
        address,
        imageUrl: ensAvatar,
        size: mobile ? 82 : 74
      }
    )),
    import_react43.default.createElement(
      Box,
      {
        display: "flex",
        flexDirection: "column",
        gap: mobile ? "4" : "0",
        textAlign: "center"
      },
      import_react43.default.createElement(Box, { textAlign: "center" }, import_react43.default.createElement(
        Text,
        {
          as: "h1",
          color: "modalText",
          id: titleId,
          size: mobile ? "20" : "18",
          weight: "heavy"
        },
        accountName
      )),
      !!balance && import_react43.default.createElement(Box, { textAlign: "center" }, import_react43.default.createElement(
        Text,
        {
          as: "h1",
          color: "modalTextSecondary",
          id: titleId,
          size: mobile ? "16" : "14",
          weight: "semibold"
        },
        displayBalance,
        " ",
        balance.symbol
      ))
    )
  ), import_react43.default.createElement(
    Box,
    {
      display: "flex",
      flexDirection: "row",
      gap: "8",
      margin: "2",
      marginTop: "16"
    },
    import_react43.default.createElement(
      ProfileDetailsAction,
      {
        action: copyAddressAction,
        icon: copiedAddress ? import_react43.default.createElement(CopiedIcon, null) : import_react43.default.createElement(CopyIcon, null),
        label: copiedAddress ? i18n2.t("profile.copy_address.copied") : i18n2.t("profile.copy_address.label")
      }
    ),
    import_react43.default.createElement(
      ProfileDetailsAction,
      {
        action: onDisconnect,
        icon: import_react43.default.createElement(DisconnectIcon, null),
        label: i18n2.t("profile.disconnect.label"),
        testId: "disconnect-button"
      }
    )
  )), showRecentTransactions && import_react43.default.createElement(import_react43.default.Fragment, null, import_react43.default.createElement(Box, { background: "generalBorder", height: "1", marginTop: "-1" }), import_react43.default.createElement(Box, null, import_react43.default.createElement(TxList, { address })))));
}
function AccountModal({ onClose, open }) {
  const { address } = useAccount();
  const { balance, ensAvatar, ensName } = useProfile({
    address,
    includeBalance: open
  });
  const { disconnect } = useDisconnect();
  if (!address) {
    return null;
  }
  const titleId = "rk_account_modal_title";
  return import_react22.default.createElement(import_react22.default.Fragment, null, address && import_react22.default.createElement(Dialog, { onClose, open, titleId }, import_react22.default.createElement(DialogContent, { bottomSheetOnMobile: true, padding: "0" }, import_react22.default.createElement(
    ProfileDetails,
    {
      address,
      ensAvatar,
      ensName,
      balance,
      onClose,
      onDisconnect: disconnect
    }
  ))));
}
var DisconnectSqIcon = ({ size: size4 }) => import_react55.default.createElement(
  "svg",
  {
    fill: "none",
    height: size4,
    viewBox: "0 0 28 28",
    width: size4,
    xmlns: "http://www.w3.org/2000/svg"
  },
  import_react55.default.createElement("title", null, "Disconnect"),
  import_react55.default.createElement(
    "path",
    {
      d: "M6.742 22.195h8.367c1.774 0 2.743-.968 2.743-2.758V16.11h-2.016v3.11c0 .625-.305.96-.969.96H6.984c-.664 0-.968-.335-.968-.96V7.984c0-.632.304-.968.968-.968h7.883c.664 0 .969.336.969.968v3.133h2.016v-3.36c0-1.78-.97-2.757-2.743-2.757H6.742C4.97 5 4 5.977 4 7.758v11.68c0 1.789.969 2.757 2.742 2.757Zm5.438-7.703h7.601l1.149-.07-.602.406-1.008.938a.816.816 0 0 0-.258.593c0 .407.313.782.758.782.227 0 .39-.086.547-.243l2.492-2.593c.235-.235.313-.47.313-.711 0-.242-.078-.477-.313-.719l-2.492-2.586c-.156-.156-.32-.25-.547-.25-.445 0-.758.367-.758.781 0 .227.094.446.258.594l1.008.945.602.407-1.149-.079H12.18a.904.904 0 0 0 0 1.805Z",
      fill: "currentColor"
    }
  )
);
var unsetBackgroundOnHover = "v9horb0";
var MenuButton = import_react56.default.forwardRef(
  ({
    children,
    currentlySelected = false,
    onClick,
    testId,
    ...urlProps
  }, ref) => {
    const mobile = isMobile();
    return import_react56.default.createElement(
      Box,
      {
        as: "button",
        borderRadius: "menuButton",
        disabled: currentlySelected,
        display: "flex",
        onClick,
        ref,
        testId,
        type: "button"
      },
      import_react56.default.createElement(
        Box,
        {
          borderRadius: "menuButton",
          className: [
            mobile ? unsetBackgroundOnHover : void 0,
            !currentlySelected && touchableStyles({ active: "shrink" })
          ],
          padding: mobile ? "8" : "6",
          transition: "default",
          width: "full",
          ...currentlySelected ? {
            background: "accentColor",
            borderColor: "selectedOptionBorder",
            borderStyle: "solid",
            borderWidth: "1",
            boxShadow: "selectedOption",
            color: "accentColorForeground"
          } : {
            background: { hover: "menuItemBackground" },
            color: "modalText",
            transition: "default"
          },
          ...urlProps
        },
        children
      )
    );
  }
);
MenuButton.displayName = "MenuButton";
var Chain = ({
  chainId,
  currentChainId,
  switchChain,
  chainIconSize,
  isLoading,
  src: src7,
  name,
  iconBackground,
  idx
}) => {
  const mobile = isMobile();
  const { i18n: i18n2 } = (0, import_react57.useContext)(I18nContext);
  const rainbowkitChains = useRainbowKitChains();
  const isCurrentChain = currentChainId === chainId;
  return import_react57.default.createElement(import_react57.Fragment, null, import_react57.default.createElement(
    MenuButton,
    {
      currentlySelected: isCurrentChain,
      onClick: isCurrentChain ? void 0 : () => switchChain({ chainId }),
      testId: `chain-option-${chainId}`
    },
    import_react57.default.createElement(Box, { fontFamily: "body", fontSize: "16", fontWeight: "bold" }, import_react57.default.createElement(
      Box,
      {
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
      },
      import_react57.default.createElement(
        Box,
        {
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
          gap: "4",
          height: chainIconSize
        },
        src7 && import_react57.default.createElement(Box, { height: "full", marginRight: "8" }, import_react57.default.createElement(
          AsyncImage,
          {
            alt: name,
            background: iconBackground,
            borderRadius: "full",
            height: chainIconSize,
            src: src7,
            width: chainIconSize,
            testId: `chain-option-${chainId}-icon`
          }
        )),
        import_react57.default.createElement("div", null, name ?? name)
      ),
      isCurrentChain && import_react57.default.createElement(
        Box,
        {
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
          marginRight: "6"
        },
        import_react57.default.createElement(Text, { color: "accentColorForeground", size: "14", weight: "medium" }, i18n2.t("chains.connected")),
        import_react57.default.createElement(
          Box,
          {
            background: "connectionIndicator",
            borderColor: "selectedOptionBorder",
            borderRadius: "full",
            borderStyle: "solid",
            borderWidth: "1",
            height: "8",
            marginLeft: "8",
            width: "8"
          }
        )
      ),
      isLoading && import_react57.default.createElement(
        Box,
        {
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
          marginRight: "6"
        },
        import_react57.default.createElement(Text, { color: "modalText", size: "14", weight: "medium" }, i18n2.t("chains.confirm")),
        import_react57.default.createElement(
          Box,
          {
            background: "standby",
            borderRadius: "full",
            height: "8",
            marginLeft: "8",
            width: "8"
          }
        )
      )
    ))
  ), mobile && idx < rainbowkitChains.length - 1 && import_react57.default.createElement(Box, { background: "generalBorderDim", height: "1", marginX: "8" }));
};
var Chain_default = Chain;
var DesktopScrollClassName = "_18dqw9x0";
var MobileScrollClassName = "_18dqw9x1";
function ChainModal({ onClose, open }) {
  const { chainId } = useAccount();
  const { chains } = useConfig();
  const [pendingChainId, setPendingChainId] = (0, import_react54.useState)(null);
  const { switchChain } = useSwitchChain({
    mutation: {
      onMutate: ({ chainId: _chainId }) => {
        setPendingChainId(_chainId);
      },
      onSuccess: () => {
        if (pendingChainId)
          setPendingChainId(null);
      },
      onError: () => {
        if (pendingChainId)
          setPendingChainId(null);
      },
      onSettled: () => {
        onClose();
      }
    }
  });
  const { i18n: i18n2 } = (0, import_react54.useContext)(I18nContext);
  const { disconnect } = useDisconnect();
  const titleId = "rk_chain_modal_title";
  const mobile = isMobile();
  const isCurrentChainSupported = chains.some((chain2) => chain2.id === chainId);
  const chainIconSize = mobile ? "36" : "28";
  const rainbowkitChains = useRainbowKitChains();
  if (!chainId) {
    return null;
  }
  return import_react54.default.createElement(Dialog, { onClose, open, titleId }, import_react54.default.createElement(DialogContent, { bottomSheetOnMobile: true, paddingBottom: "0" }, import_react54.default.createElement(Box, { display: "flex", flexDirection: "column", gap: "14" }, import_react54.default.createElement(
    Box,
    {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between"
    },
    mobile && import_react54.default.createElement(Box, { width: "30" }),
    import_react54.default.createElement(Box, { paddingBottom: "0", paddingLeft: "8", paddingTop: "4" }, import_react54.default.createElement(
      Text,
      {
        as: "h1",
        color: "modalText",
        id: titleId,
        size: mobile ? "20" : "18",
        weight: "heavy"
      },
      i18n2.t("chains.title")
    )),
    import_react54.default.createElement(CloseButton, { onClose })
  ), !isCurrentChainSupported && import_react54.default.createElement(Box, { marginX: "8", textAlign: mobile ? "center" : "left" }, import_react54.default.createElement(Text, { color: "modalTextSecondary", size: "14", weight: "medium" }, i18n2.t("chains.wrong_network"))), import_react54.default.createElement(
    Box,
    {
      className: mobile ? MobileScrollClassName : DesktopScrollClassName,
      display: "flex",
      flexDirection: "column",
      gap: "4",
      padding: "2",
      paddingBottom: "16"
    },
    rainbowkitChains.map(
      ({ iconBackground, iconUrl, id, name }, idx) => {
        return import_react54.default.createElement(
          Chain_default,
          {
            key: id,
            chainId: id,
            currentChainId: chainId,
            switchChain,
            chainIconSize,
            isLoading: pendingChainId === id,
            src: iconUrl,
            name,
            iconBackground,
            idx
          }
        );
      }
    ),
    !isCurrentChainSupported && import_react54.default.createElement(import_react54.default.Fragment, null, import_react54.default.createElement(Box, { background: "generalBorderDim", height: "1", marginX: "8" }), import_react54.default.createElement(
      MenuButton,
      {
        onClick: () => disconnect(),
        testId: "chain-option-disconnect"
      },
      import_react54.default.createElement(
        Box,
        {
          color: "error",
          fontFamily: "body",
          fontSize: "16",
          fontWeight: "bold"
        },
        import_react54.default.createElement(
          Box,
          {
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between"
          },
          import_react54.default.createElement(
            Box,
            {
              alignItems: "center",
              display: "flex",
              flexDirection: "row",
              gap: "4",
              height: chainIconSize
            },
            import_react54.default.createElement(
              Box,
              {
                alignItems: "center",
                color: "error",
                height: chainIconSize,
                justifyContent: "center",
                marginRight: "8"
              },
              import_react54.default.createElement(DisconnectSqIcon, { size: Number(chainIconSize) })
            ),
            import_react54.default.createElement("div", null, i18n2.t("chains.disconnect"))
          )
        )
      )
    ))
  ))));
}
function groupBy(items, getKey2) {
  const groupedItems = {};
  for (const item of items) {
    const key = getKey2(item);
    if (!key) {
      continue;
    }
    if (!groupedItems[key]) {
      groupedItems[key] = [];
    }
    groupedItems[key].push(item);
  }
  return groupedItems;
}
var DisclaimerLink = ({
  children,
  href
}) => {
  return import_react62.default.createElement(
    Box,
    {
      as: "a",
      color: "accentColor",
      href,
      rel: "noreferrer",
      target: "_blank"
    },
    children
  );
};
var DisclaimerText = ({ children }) => {
  return import_react63.default.createElement(Text, { color: "modalTextSecondary", size: "12", weight: "medium" }, children);
};
function ConnectModalIntro({
  compactModeEnabled = false,
  getWallet
}) {
  const { disclaimer: Disclaimer, learnMoreUrl } = (0, import_react61.useContext)(AppContext);
  const { i18n: i18n2 } = (0, import_react61.useContext)(I18nContext);
  return import_react61.default.createElement(import_react61.default.Fragment, null, import_react61.default.createElement(
    Box,
    {
      alignItems: "center",
      color: "accentColor",
      display: "flex",
      flexDirection: "column",
      height: "full",
      justifyContent: "space-around"
    },
    import_react61.default.createElement(Box, { marginBottom: "10" }, !compactModeEnabled && import_react61.default.createElement(Text, { color: "modalText", size: "18", weight: "heavy" }, i18n2.t("intro.title"))),
    import_react61.default.createElement(
      Box,
      {
        display: "flex",
        flexDirection: "column",
        gap: "32",
        justifyContent: "center",
        marginY: "20",
        style: { maxWidth: 312 }
      },
      import_react61.default.createElement(Box, { alignItems: "center", display: "flex", flexDirection: "row", gap: "16" }, import_react61.default.createElement(Box, { borderRadius: "6", height: "48", minWidth: "48", width: "48" }, import_react61.default.createElement(AssetsIcon, null)), import_react61.default.createElement(Box, { display: "flex", flexDirection: "column", gap: "4" }, import_react61.default.createElement(Text, { color: "modalText", size: "14", weight: "bold" }, i18n2.t("intro.digital_asset.title")), import_react61.default.createElement(Text, { color: "modalTextSecondary", size: "14", weight: "medium" }, i18n2.t("intro.digital_asset.description")))),
      import_react61.default.createElement(Box, { alignItems: "center", display: "flex", flexDirection: "row", gap: "16" }, import_react61.default.createElement(Box, { borderRadius: "6", height: "48", minWidth: "48", width: "48" }, import_react61.default.createElement(LoginIcon, null)), import_react61.default.createElement(Box, { display: "flex", flexDirection: "column", gap: "4" }, import_react61.default.createElement(Text, { color: "modalText", size: "14", weight: "bold" }, i18n2.t("intro.login.title")), import_react61.default.createElement(Text, { color: "modalTextSecondary", size: "14", weight: "medium" }, i18n2.t("intro.login.description"))))
    ),
    import_react61.default.createElement(
      Box,
      {
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: "12",
        justifyContent: "center",
        margin: "10"
      },
      import_react61.default.createElement(ActionButton, { label: i18n2.t("intro.get.label"), onClick: getWallet }),
      import_react61.default.createElement(
        Box,
        {
          as: "a",
          className: touchableStyles({ active: "shrink", hover: "grow" }),
          display: "block",
          href: learnMoreUrl,
          paddingX: "12",
          paddingY: "4",
          rel: "noreferrer",
          style: { willChange: "transform" },
          target: "_blank",
          transition: "default"
        },
        import_react61.default.createElement(Text, { color: "accentColor", size: "14", weight: "bold" }, i18n2.t("intro.learn_more.label"))
      )
    ),
    Disclaimer && !compactModeEnabled && import_react61.default.createElement(Box, { marginBottom: "8", marginTop: "12", textAlign: "center" }, import_react61.default.createElement(Disclaimer, { Link: DisclaimerLink, Text: DisclaimerText }))
  ));
}
var BackIcon = () => import_react64.default.createElement(
  "svg",
  {
    fill: "none",
    height: "17",
    viewBox: "0 0 11 17",
    width: "11",
    xmlns: "http://www.w3.org/2000/svg"
  },
  import_react64.default.createElement("title", null, "Back"),
  import_react64.default.createElement(
    "path",
    {
      d: "M0.99707 8.6543C0.99707 9.08496 1.15527 9.44531 1.51562 9.79688L8.16016 16.3096C8.43262 16.5732 8.74902 16.7051 9.13574 16.7051C9.90918 16.7051 10.5508 16.0811 10.5508 15.3076C10.5508 14.9121 10.3838 14.5605 10.0938 14.2705L4.30176 8.64551L10.0938 3.0293C10.3838 2.74805 10.5508 2.3877 10.5508 2.00098C10.5508 1.23633 9.90918 0.603516 9.13574 0.603516C8.74902 0.603516 8.43262 0.735352 8.16016 0.999023L1.51562 7.51172C1.15527 7.85449 1.00586 8.21484 0.99707 8.6543Z",
      fill: "currentColor"
    }
  )
);
var InfoIcon = () => import_react66.default.createElement(
  "svg",
  {
    fill: "none",
    height: "12",
    viewBox: "0 0 8 12",
    width: "8",
    xmlns: "http://www.w3.org/2000/svg"
  },
  import_react66.default.createElement("title", null, "Info"),
  import_react66.default.createElement(
    "path",
    {
      d: "M3.64258 7.99609C4.19336 7.99609 4.5625 7.73828 4.68555 7.24609C4.69141 7.21094 4.70312 7.16406 4.70898 7.13477C4.80859 6.60742 5.05469 6.35547 6.04492 5.76367C7.14648 5.10156 7.67969 4.3457 7.67969 3.24414C7.67969 1.39844 6.17383 0.255859 3.95898 0.255859C2.32422 0.255859 1.05859 0.894531 0.548828 1.86719C0.396484 2.14844 0.320312 2.44727 0.320312 2.74023C0.314453 3.37305 0.742188 3.79492 1.42188 3.79492C1.91406 3.79492 2.33594 3.54883 2.53516 3.11523C2.78711 2.47656 3.23242 2.21289 3.83594 2.21289C4.55664 2.21289 5.10742 2.65234 5.10742 3.29102C5.10742 3.9707 4.7793 4.29883 3.81836 4.87891C3.02148 5.36523 2.50586 5.92773 2.50586 6.76562V6.90039C2.50586 7.55664 2.96289 7.99609 3.64258 7.99609ZM3.67188 11.4473C4.42773 11.4473 5.04297 10.8672 5.04297 10.1406C5.04297 9.41406 4.42773 8.83984 3.67188 8.83984C2.91602 8.83984 2.30664 9.41406 2.30664 10.1406C2.30664 10.8672 2.91602 11.4473 3.67188 11.4473Z",
      fill: "currentColor"
    }
  )
);
var InfoButton = ({
  "aria-label": ariaLabel = "Info",
  onClick
}) => {
  const mobile = isMobile();
  return import_react65.default.createElement(
    Box,
    {
      alignItems: "center",
      "aria-label": ariaLabel,
      as: "button",
      background: "closeButtonBackground",
      borderColor: "actionButtonBorder",
      borderRadius: "full",
      borderStyle: "solid",
      borderWidth: mobile ? "0" : "1",
      className: touchableStyles({ active: "shrinkSm", hover: "growLg" }),
      color: "closeButton",
      display: "flex",
      height: mobile ? "30" : "28",
      justifyContent: "center",
      onClick,
      style: { willChange: "transform" },
      transition: "default",
      type: "button",
      width: mobile ? "30" : "28"
    },
    import_react65.default.createElement(InfoIcon, null)
  );
};
var useCoolMode = (imageUrl) => {
  const ref = (0, import_react68.useRef)(null);
  const coolModeEnabled = (0, import_react68.useContext)(CoolModeContext);
  const resolvedImageUrl = useAsyncImage(imageUrl);
  (0, import_react68.useEffect)(() => {
    if (coolModeEnabled && ref.current && resolvedImageUrl) {
      return makeElementCool(ref.current, resolvedImageUrl);
    }
  }, [coolModeEnabled, resolvedImageUrl]);
  return ref;
};
var getContainer = () => {
  const id = "_rk_coolMode";
  const existingContainer = document.getElementById(id);
  if (existingContainer) {
    return existingContainer;
  }
  const container = document.createElement("div");
  container.setAttribute("id", id);
  container.setAttribute(
    "style",
    [
      "overflow:hidden",
      "position:fixed",
      "height:100%",
      "top:0",
      "left:0",
      "right:0",
      "bottom:0",
      "pointer-events:none",
      "z-index:2147483647"
    ].join(";")
  );
  document.body.appendChild(container);
  return container;
};
var instanceCounter = 0;
function makeElementCool(element2, imageUrl) {
  instanceCounter++;
  const sizes = [15, 20, 25, 35, 45];
  const limit = 35;
  let particles = [];
  let autoAddParticle = false;
  let mouseX = 0;
  let mouseY = 0;
  const container = getContainer();
  function createParticle() {
    const size4 = sizes[Math.floor(Math.random() * sizes.length)];
    const speedHorz = Math.random() * 10;
    const speedUp = Math.random() * 25;
    const spinVal = Math.random() * 360;
    const spinSpeed = Math.random() * 35 * (Math.random() <= 0.5 ? -1 : 1);
    const top = mouseY - size4 / 2;
    const left = mouseX - size4 / 2;
    const direction = Math.random() <= 0.5 ? -1 : 1;
    const particle = document.createElement("div");
    particle.innerHTML = `<img src="${imageUrl}" width="${size4}" height="${size4}" style="border-radius: 25%">`;
    particle.setAttribute(
      "style",
      [
        "position:absolute",
        "will-change:transform",
        `top:${top}px`,
        `left:${left}px`,
        `transform:rotate(${spinVal}deg)`
      ].join(";")
    );
    container.appendChild(particle);
    particles.push({
      direction,
      element: particle,
      left,
      size: size4,
      speedHorz,
      speedUp,
      spinSpeed,
      spinVal,
      top
    });
  }
  function updateParticles() {
    for (const p of particles) {
      p.left = p.left - p.speedHorz * p.direction;
      p.top = p.top - p.speedUp;
      p.speedUp = Math.min(p.size, p.speedUp - 1);
      p.spinVal = p.spinVal + p.spinSpeed;
      if (p.top >= Math.max(window.innerHeight, document.body.clientHeight) + p.size) {
        particles = particles.filter((o) => o !== p);
        p.element.remove();
      }
      p.element.setAttribute(
        "style",
        [
          "position:absolute",
          "will-change:transform",
          `top:${p.top}px`,
          `left:${p.left}px`,
          `transform:rotate(${p.spinVal}deg)`
        ].join(";")
      );
    }
  }
  let animationFrame;
  function loop() {
    if (autoAddParticle && particles.length < limit) {
      createParticle();
    }
    updateParticles();
    animationFrame = requestAnimationFrame(loop);
  }
  loop();
  const isTouchInteraction = "ontouchstart" in window || // @ts-expect-error
  navigator.msMaxTouchPoints;
  const tap = isTouchInteraction ? "touchstart" : "mousedown";
  const tapEnd = isTouchInteraction ? "touchend" : "mouseup";
  const move = isTouchInteraction ? "touchmove" : "mousemove";
  const updateMousePosition = (e) => {
    var _a, _b;
    if ("touches" in e) {
      mouseX = (_a = e.touches) == null ? void 0 : _a[0].clientX;
      mouseY = (_b = e.touches) == null ? void 0 : _b[0].clientY;
    } else {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }
  };
  const tapHandler = (e) => {
    updateMousePosition(e);
    autoAddParticle = true;
  };
  const disableAutoAddParticle = () => {
    autoAddParticle = false;
  };
  element2.addEventListener(move, updateMousePosition, { passive: false });
  element2.addEventListener(tap, tapHandler);
  element2.addEventListener(tapEnd, disableAutoAddParticle);
  element2.addEventListener("mouseleave", disableAutoAddParticle);
  return () => {
    element2.removeEventListener(move, updateMousePosition);
    element2.removeEventListener(tap, tapHandler);
    element2.removeEventListener(tapEnd, disableAutoAddParticle);
    element2.removeEventListener("mouseleave", disableAutoAddParticle);
    const interval = setInterval(() => {
      if (animationFrame && particles.length === 0) {
        cancelAnimationFrame(animationFrame);
        clearInterval(interval);
        if (--instanceCounter === 0) {
          container.remove();
        }
      }
    }, 500);
  };
}
var transparentBorder = "g5kl0l0";
var ModalSelection = ({
  as = "button",
  currentlySelected = false,
  iconBackground,
  iconUrl,
  name,
  onClick,
  ready,
  recent,
  testId,
  isRainbowKitConnector: isRainbowKitConnector2,
  ...urlProps
}) => {
  const coolModeRef = useCoolMode(iconUrl);
  const [isMouseOver, setIsMouseOver] = import_react67.default.useState(false);
  const { i18n: i18n2 } = import_react67.default.useContext(I18nContext);
  return import_react67.default.createElement(
    Box,
    {
      display: "flex",
      flexDirection: "column",
      onMouseEnter: () => setIsMouseOver(true),
      onMouseLeave: () => setIsMouseOver(false),
      ref: coolModeRef
    },
    import_react67.default.createElement(
      Box,
      {
        as,
        borderRadius: "menuButton",
        borderStyle: "solid",
        borderWidth: "1",
        className: !currentlySelected ? [
          transparentBorder,
          touchableStyles({
            active: "shrink"
          })
        ] : void 0,
        disabled: currentlySelected,
        onClick,
        padding: "5",
        style: { willChange: "transform" },
        testId,
        transition: "default",
        width: "full",
        ...currentlySelected ? {
          background: "accentColor",
          borderColor: "selectedOptionBorder",
          boxShadow: "selectedWallet"
        } : {
          background: { hover: "menuItemBackground" }
        },
        ...urlProps
      },
      import_react67.default.createElement(
        Box,
        {
          color: currentlySelected ? "accentColorForeground" : "modalText",
          disabled: !ready,
          fontFamily: "body",
          fontSize: "16",
          fontWeight: "bold",
          transition: "default"
        },
        import_react67.default.createElement(Box, { alignItems: "center", display: "flex", flexDirection: "row", gap: "12" }, import_react67.default.createElement(
          AsyncImage,
          {
            background: iconBackground,
            ...!isMouseOver && isRainbowKitConnector2 ? { borderColor: "actionButtonBorder" } : {},
            useAsImage: !isRainbowKitConnector2,
            borderRadius: "6",
            height: "28",
            src: iconUrl,
            width: "28"
          }
        ), import_react67.default.createElement(Box, null, import_react67.default.createElement(
          Box,
          {
            style: { marginTop: recent ? -2 : void 0 },
            maxWidth: "200"
          },
          name
        ), recent && import_react67.default.createElement(
          Text,
          {
            color: currentlySelected ? "accentColorForeground" : "accentColor",
            size: "12",
            style: { lineHeight: 1, marginTop: -1 },
            weight: "medium"
          },
          i18n2.t("connect.recent")
        )))
      )
    )
  );
};
ModalSelection.displayName = "ModalSelection";
var storageKey5 = "rk-latest-id";
function getLatestWalletId() {
  return typeof localStorage !== "undefined" ? localStorage.getItem(storageKey5) || "" : "";
}
function addLatestWalletId(walletId) {
  localStorage.setItem(storageKey5, walletId);
}
function clearLatestWalletId() {
  localStorage.removeItem(storageKey5);
}
var convertHexToRGBA = (hexCode, opacity = 1) => {
  let hex2 = hexCode.replace("#", "");
  if (hex2.length === 3) {
    hex2 = `${hex2[0]}${hex2[0]}${hex2[1]}${hex2[1]}${hex2[2]}${hex2[2]}`;
  }
  const r = Number.parseInt(hex2.substring(0, 2), 16);
  const g = Number.parseInt(hex2.substring(2, 4), 16);
  const b = Number.parseInt(hex2.substring(4, 6), 16);
  if (opacity > 1 && opacity <= 100) {
    opacity = opacity / 100;
  }
  return `rgba(${r},${g},${b},${opacity})`;
};
var getGradientRGBAs = (hexColor) => {
  if (!hexColor)
    return null;
  return [
    convertHexToRGBA(hexColor, 0.2),
    convertHexToRGBA(hexColor, 0.14),
    convertHexToRGBA(hexColor, 0.1)
  ];
};
var isHexString = (color) => {
  return /^#([0-9a-f]{3}){1,2}$/i.test(color);
};
var src3 = async () => (await import("./connect-MR6XDLIE-2ZIZI74I.js")).default;
var preloadConnectIcon = () => loadImages(src3);
var ConnectIcon = () => import_react70.default.createElement(
  AsyncImage,
  {
    background: "#515a70",
    borderColor: "generalBorder",
    borderRadius: "10",
    height: "48",
    src: src3,
    width: "48"
  }
);
var src4 = async () => (await import("./create-X4WFHLCW-STWTVUMK.js")).default;
var preloadCreateIcon = () => loadImages(src4);
var CreateIcon = () => import_react71.default.createElement(
  AsyncImage,
  {
    background: "#e3a5e8",
    borderColor: "generalBorder",
    borderRadius: "10",
    height: "48",
    src: src4,
    width: "48"
  }
);
var src5 = async () => (await import("./refresh-HJGJRASX-X4BGKFMT.js")).default;
var preloadRefreshIcon = () => loadImages(src5);
var RefreshIcon = () => import_react72.default.createElement(
  AsyncImage,
  {
    background: "#515a70",
    borderColor: "generalBorder",
    borderRadius: "10",
    height: "48",
    src: src5,
    width: "48"
  }
);
var src6 = async () => (await import("./scan-DEOT2M37-ZVXG5T2W.js")).default;
var preloadScanIcon = () => loadImages(src6);
var ScanIcon = () => import_react73.default.createElement(
  AsyncImage,
  {
    background: "#515a70",
    borderColor: "generalBorder",
    borderRadius: "10",
    height: "48",
    src: src6,
    width: "48"
  }
);
var QRCodeBackgroundClassName = "_1vwt0cg0";
var ScrollClassName = "_1vwt0cg2 ju367v7a ju367v7v";
var sidebar = "_1vwt0cg3";
var sidebarCompactMode = "_1vwt0cg4";
var generateMatrix = (value, errorCorrectionLevel) => {
  const arr = Array.prototype.slice.call(
    import_qrcode.default.create(value, { errorCorrectionLevel }).modules.data,
    0
  );
  const sqrt = Math.sqrt(arr.length);
  return arr.reduce(
    (rows, key, index2) => (index2 % sqrt === 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows,
    []
  );
};
function QRCode({
  ecl = "M",
  logoBackground,
  logoMargin = 10,
  logoSize = 50,
  logoUrl,
  size: sizeProp = 200,
  uri
}) {
  const padding2 = "20";
  const size4 = sizeProp - Number.parseInt(padding2, 10) * 2;
  const dots = (0, import_react74.useMemo)(() => {
    const dots2 = [];
    const matrix = generateMatrix(uri, ecl);
    const cellSize = size4 / matrix.length;
    const qrList = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 }
    ];
    qrList.forEach(({ x, y }) => {
      const x1 = (matrix.length - 7) * cellSize * x;
      const y1 = (matrix.length - 7) * cellSize * y;
      for (let i = 0; i < 3; i++) {
        dots2.push(
          import_react74.default.createElement(
            "rect",
            {
              fill: i % 2 !== 0 ? "white" : "black",
              height: cellSize * (7 - i * 2),
              key: `${i}-${x}-${y}`,
              rx: (i - 2) * -5 + (i === 0 ? 2 : 0),
              ry: (i - 2) * -5 + (i === 0 ? 2 : 0),
              width: cellSize * (7 - i * 2),
              x: x1 + cellSize * i,
              y: y1 + cellSize * i
            }
          )
        );
      }
    });
    const clearArenaSize = Math.floor((logoSize + 25) / cellSize);
    const matrixMiddleStart = matrix.length / 2 - clearArenaSize / 2;
    const matrixMiddleEnd = matrix.length / 2 + clearArenaSize / 2 - 1;
    matrix.forEach((row, i) => {
      row.forEach((_, j) => {
        if (matrix[i][j]) {
          if (!(i < 7 && j < 7 || i > matrix.length - 8 && j < 7 || i < 7 && j > matrix.length - 8)) {
            if (!(i > matrixMiddleStart && i < matrixMiddleEnd && j > matrixMiddleStart && j < matrixMiddleEnd)) {
              dots2.push(
                import_react74.default.createElement(
                  "circle",
                  {
                    cx: i * cellSize + cellSize / 2,
                    cy: j * cellSize + cellSize / 2,
                    fill: "black",
                    key: `circle-${i}-${j}`,
                    r: cellSize / 3
                  }
                )
              );
            }
          }
        }
      });
    });
    return dots2;
  }, [ecl, logoSize, size4, uri]);
  const logoPosition = size4 / 2 - logoSize / 2;
  const logoWrapperSize = logoSize + logoMargin * 2;
  return import_react74.default.createElement(
    Box,
    {
      borderColor: "generalBorder",
      borderRadius: "menuButton",
      borderStyle: "solid",
      borderWidth: "1",
      className: QRCodeBackgroundClassName,
      padding: padding2,
      width: "max"
    },
    import_react74.default.createElement(
      Box,
      {
        style: {
          height: size4,
          userSelect: "none",
          width: size4
        },
        userSelect: "none"
      },
      import_react74.default.createElement(
        Box,
        {
          display: "flex",
          justifyContent: "center",
          position: "relative",
          style: {
            height: 0,
            top: logoPosition,
            width: size4
          },
          width: "full"
        },
        import_react74.default.createElement(
          AsyncImage,
          {
            background: logoBackground,
            borderColor: { custom: "rgba(0, 0, 0, 0.06)" },
            borderRadius: "13",
            height: logoSize,
            src: logoUrl,
            width: logoSize
          }
        )
      ),
      import_react74.default.createElement("svg", { height: size4, style: { all: "revert" }, width: size4 }, import_react74.default.createElement("title", null, "QR Code"), import_react74.default.createElement("defs", null, import_react74.default.createElement("clipPath", { id: "clip-wrapper" }, import_react74.default.createElement("rect", { height: logoWrapperSize, width: logoWrapperSize })), import_react74.default.createElement("clipPath", { id: "clip-logo" }, import_react74.default.createElement("rect", { height: logoSize, width: logoSize }))), import_react74.default.createElement("rect", { fill: "transparent", height: size4, width: size4 }), dots)
    )
  );
}
var getBrowserSrc = async () => {
  const browser = getBrowser();
  switch (browser) {
    case "Arc":
      return (await import("./Arc-R3PUWRPJ-CTE2HW4R.js")).default;
    case "Brave":
      return (await import("./Brave-24BM36UM-XRXDTP4R.js")).default;
    case "Chrome":
      return (await import("./Chrome-TLI42HDP-VF5YFCWV.js")).default;
    case "Edge":
      return (await import("./Edge-AZ34LAFM-LCYOCNTG.js")).default;
    case "Firefox":
      return (await import("./Firefox-ZDK7RHKK-I5RFT7BA.js")).default;
    case "Opera":
      return (await import("./Opera-BKMCKUXC-ARLOSFHK.js")).default;
    case "Safari":
      return (await import("./Safari-PXQIVS6N-OJGIRPVZ.js")).default;
    default:
      return (await import("./Browser-4R4QKTV2-43XOSOGQ.js")).default;
  }
};
var preloadBrowserIcon = () => loadImages(getBrowserSrc);
var getPlatformSrc = async () => {
  const platform = getPlatform();
  switch (platform) {
    case "Windows":
      return (await import("./Windows-GTAT3OTE-NDI4K7JT.js")).default;
    case "macOS":
      return (await import("./Macos-5QL4JBJE-OJEMSZTA.js")).default;
    case "Linux":
      return (await import("./Linux-VYP66PDO-QHZU73JD.js")).default;
    default:
      return (await import("./Linux-VYP66PDO-QHZU73JD.js")).default;
  }
};
var preloadPlatformIcon = () => loadImages(getPlatformSrc);
function GetDetail({
  getWalletDownload,
  compactModeEnabled
}) {
  const wallets = useWalletConnectors().filter(
    (wallet) => wallet.isRainbowKitConnector
  );
  const shownWallets = wallets.splice(0, 5);
  const { i18n: i18n2 } = (0, import_react69.useContext)(I18nContext);
  return import_react69.default.createElement(
    Box,
    {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      height: "full",
      marginTop: "18",
      width: "full"
    },
    import_react69.default.createElement(
      Box,
      {
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: "28",
        height: "full",
        width: "full"
      },
      shownWallets == null ? void 0 : shownWallets.filter(
        (wallet) => {
          var _a;
          return wallet.extensionDownloadUrl || wallet.desktopDownloadUrl || wallet.qrCode && ((_a = wallet.downloadUrls) == null ? void 0 : _a.qrCode);
        }
      ).map((wallet) => {
        const { downloadUrls, iconBackground, iconUrl, id, name, qrCode } = wallet;
        const hasMobileCompanionApp = (downloadUrls == null ? void 0 : downloadUrls.qrCode) && qrCode;
        const hasExtension = !!wallet.extensionDownloadUrl;
        const hasMobileAndExtension = (downloadUrls == null ? void 0 : downloadUrls.qrCode) && hasExtension;
        const hasMobileAndDesktop = (downloadUrls == null ? void 0 : downloadUrls.qrCode) && !!wallet.desktopDownloadUrl;
        return import_react69.default.createElement(
          Box,
          {
            alignItems: "center",
            display: "flex",
            gap: "16",
            justifyContent: "space-between",
            key: wallet.id,
            width: "full"
          },
          import_react69.default.createElement(
            Box,
            {
              alignItems: "center",
              display: "flex",
              flexDirection: "row",
              gap: "16"
            },
            import_react69.default.createElement(
              AsyncImage,
              {
                background: iconBackground,
                borderColor: "actionButtonBorder",
                borderRadius: "10",
                height: "48",
                src: iconUrl,
                width: "48"
              }
            ),
            import_react69.default.createElement(Box, { display: "flex", flexDirection: "column", gap: "2" }, import_react69.default.createElement(Text, { color: "modalText", size: "14", weight: "bold" }, name), import_react69.default.createElement(Text, { color: "modalTextSecondary", size: "14", weight: "medium" }, hasMobileAndExtension ? i18n2.t("get.mobile_and_extension.description") : hasMobileAndDesktop ? i18n2.t("get.mobile_and_desktop.description") : hasMobileCompanionApp ? i18n2.t("get.mobile.description") : hasExtension ? i18n2.t("get.extension.description") : null))
          ),
          import_react69.default.createElement(Box, { display: "flex", flexDirection: "column", gap: "4" }, import_react69.default.createElement(
            ActionButton,
            {
              label: i18n2.t("get.action.label"),
              onClick: () => getWalletDownload(id),
              type: "secondary"
            }
          ))
        );
      })
    ),
    import_react69.default.createElement(
      Box,
      {
        alignItems: "center",
        borderRadius: "10",
        display: "flex",
        flexDirection: "column",
        gap: "8",
        justifyContent: "space-between",
        marginBottom: "4",
        paddingY: "8",
        style: { maxWidth: 275, textAlign: "center" }
      },
      import_react69.default.createElement(Text, { color: "modalText", size: "14", weight: "bold" }, i18n2.t("get.looking_for.title")),
      import_react69.default.createElement(Text, { color: "modalTextSecondary", size: "14", weight: "medium" }, compactModeEnabled ? i18n2.t("get.looking_for.desktop.compact_description") : i18n2.t("get.looking_for.desktop.wide_description"))
    )
  );
}
var LOGO_SIZE = "44";
function ConnectDetail({
  changeWalletStep,
  compactModeEnabled,
  connectionError,
  onClose,
  qrCodeUri,
  reconnect,
  wallet
}) {
  const {
    downloadUrls,
    iconBackground,
    iconUrl,
    name,
    qrCode,
    ready,
    showWalletConnectModal,
    getDesktopUri
  } = wallet;
  const isDesktopDeepLinkAvailable = !!getDesktopUri;
  const safari = isSafari();
  const { i18n: i18n2 } = (0, import_react69.useContext)(I18nContext);
  const hasExtension = !!wallet.extensionDownloadUrl;
  const hasQrCodeAndExtension = (downloadUrls == null ? void 0 : downloadUrls.qrCode) && hasExtension;
  const hasQrCodeAndDesktop = (downloadUrls == null ? void 0 : downloadUrls.qrCode) && !!wallet.desktopDownloadUrl;
  const hasQrCode = qrCode && qrCodeUri;
  const onDesktopUri = async () => {
    const uri = await (getDesktopUri == null ? void 0 : getDesktopUri());
    window.open(uri, safari ? "_blank" : "_self");
  };
  const secondaryAction = showWalletConnectModal ? {
    description: !compactModeEnabled ? i18n2.t("connect.walletconnect.description.full") : i18n2.t("connect.walletconnect.description.compact"),
    label: i18n2.t("connect.walletconnect.open.label"),
    onClick: () => {
      onClose();
      showWalletConnectModal();
    }
  } : hasQrCode ? {
    description: i18n2.t("connect.secondary_action.get.description", {
      wallet: name
    }),
    label: i18n2.t("connect.secondary_action.get.label"),
    onClick: () => changeWalletStep(
      hasQrCodeAndExtension || hasQrCodeAndDesktop ? "DOWNLOAD_OPTIONS" : "DOWNLOAD"
      /* Download */
    )
  } : null;
  const { width: windowWidth } = useWindowSize();
  const smallWindow = windowWidth && windowWidth < 768;
  (0, import_react69.useEffect)(() => {
    preloadBrowserIcon();
    preloadPlatformIcon();
  }, []);
  return import_react69.default.createElement(Box, { display: "flex", flexDirection: "column", height: "full", width: "full" }, hasQrCode ? import_react69.default.createElement(
    Box,
    {
      alignItems: "center",
      display: "flex",
      height: "full",
      justifyContent: "center"
    },
    import_react69.default.createElement(
      QRCode,
      {
        logoBackground: iconBackground,
        logoSize: compactModeEnabled ? 60 : 72,
        logoUrl: iconUrl,
        size: compactModeEnabled ? 318 : smallWindow ? Math.max(280, Math.min(windowWidth - 308, 382)) : 382,
        uri: qrCodeUri
      }
    )
  ) : import_react69.default.createElement(
    Box,
    {
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
      style: { flexGrow: 1 }
    },
    import_react69.default.createElement(
      Box,
      {
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: "8"
      },
      import_react69.default.createElement(Box, { borderRadius: "10", height: LOGO_SIZE, overflow: "hidden" }, import_react69.default.createElement(
        AsyncImage,
        {
          useAsImage: !wallet.isRainbowKitConnector,
          height: LOGO_SIZE,
          src: iconUrl,
          width: LOGO_SIZE
        }
      )),
      import_react69.default.createElement(
        Box,
        {
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: "4",
          paddingX: "32",
          style: { textAlign: "center" }
        },
        import_react69.default.createElement(Text, { color: "modalText", size: "18", weight: "bold" }, ready ? i18n2.t("connect.status.opening", {
          wallet: name
        }) : hasExtension ? i18n2.t("connect.status.not_installed", {
          wallet: name
        }) : i18n2.t("connect.status.not_available", {
          wallet: name
        })),
        !ready && hasExtension ? import_react69.default.createElement(Box, { paddingTop: "20" }, import_react69.default.createElement(
          ActionButton,
          {
            href: wallet.extensionDownloadUrl,
            label: i18n2.t("connect.secondary_action.install.label"),
            type: "secondary"
          }
        )) : null,
        ready && !hasQrCode && import_react69.default.createElement(import_react69.default.Fragment, null, import_react69.default.createElement(
          Box,
          {
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          },
          import_react69.default.createElement(
            Text,
            {
              color: "modalTextSecondary",
              size: "14",
              textAlign: "center",
              weight: "medium"
            },
            i18n2.t("connect.status.confirm")
          )
        ), import_react69.default.createElement(
          Box,
          {
            alignItems: "center",
            color: "modalText",
            display: "flex",
            flexDirection: "row",
            height: "32",
            marginTop: "8"
          },
          connectionError ? import_react69.default.createElement(
            ActionButton,
            {
              label: i18n2.t("connect.secondary_action.retry.label"),
              onClick: async () => {
                if (isDesktopDeepLinkAvailable)
                  onDesktopUri();
                reconnect(wallet);
              }
            }
          ) : import_react69.default.createElement(Box, { color: "modalTextSecondary" }, import_react69.default.createElement(SpinnerIcon, null))
        ))
      )
    )
  ), import_react69.default.createElement(
    Box,
    {
      alignItems: "center",
      borderRadius: "10",
      display: "flex",
      flexDirection: "row",
      gap: "8",
      height: "28",
      justifyContent: "space-between",
      marginTop: "12"
    },
    ready && secondaryAction && import_react69.default.createElement(import_react69.default.Fragment, null, import_react69.default.createElement(Text, { color: "modalTextSecondary", size: "14", weight: "medium" }, secondaryAction.description), import_react69.default.createElement(
      ActionButton,
      {
        label: secondaryAction.label,
        onClick: secondaryAction.onClick,
        type: "secondary"
      }
    ))
  ));
}
var DownloadOptionsBox = ({
  actionLabel,
  description,
  iconAccent,
  iconBackground,
  iconUrl,
  isCompact,
  onAction,
  title,
  url,
  variant
}) => {
  const isBrowserCard = variant === "browser";
  const gradientRgbas = !isBrowserCard && iconAccent && getGradientRGBAs(iconAccent);
  return import_react69.default.createElement(
    Box,
    {
      alignItems: "center",
      borderRadius: "13",
      display: "flex",
      justifyContent: "center",
      overflow: "hidden",
      paddingX: isCompact ? "18" : "44",
      position: "relative",
      style: { flex: 1, isolation: "isolate" },
      width: "full"
    },
    import_react69.default.createElement(
      Box,
      {
        borderColor: "actionButtonBorder",
        borderRadius: "13",
        borderStyle: "solid",
        borderWidth: "1",
        style: {
          bottom: "0",
          left: "0",
          position: "absolute",
          right: "0",
          top: "0",
          zIndex: 1
        }
      }
    ),
    isBrowserCard && import_react69.default.createElement(
      Box,
      {
        background: "downloadTopCardBackground",
        height: "full",
        position: "absolute",
        style: {
          zIndex: 0
        },
        width: "full"
      },
      import_react69.default.createElement(
        Box,
        {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          style: {
            bottom: "0",
            filter: "blur(20px)",
            left: "0",
            position: "absolute",
            right: "0",
            top: "0",
            transform: "translate3d(0, 0, 0)"
          }
        },
        import_react69.default.createElement(
          Box,
          {
            style: {
              filter: "blur(100px)",
              marginLeft: -27,
              marginTop: -20,
              opacity: 0.6,
              transform: "translate3d(0, 0, 0)"
            }
          },
          import_react69.default.createElement(
            AsyncImage,
            {
              borderRadius: "full",
              height: "200",
              src: iconUrl,
              width: "200"
            }
          )
        ),
        import_react69.default.createElement(
          Box,
          {
            style: {
              filter: "blur(100px)",
              marginRight: 0,
              marginTop: 105,
              opacity: 0.6,
              overflow: "auto",
              transform: "translate3d(0, 0, 0)"
            }
          },
          import_react69.default.createElement(
            AsyncImage,
            {
              borderRadius: "full",
              height: "200",
              src: iconUrl,
              width: "200"
            }
          )
        )
      )
    ),
    !isBrowserCard && gradientRgbas && import_react69.default.createElement(
      Box,
      {
        background: "downloadBottomCardBackground",
        style: {
          bottom: "0",
          left: "0",
          position: "absolute",
          right: "0",
          top: "0"
        }
      },
      import_react69.default.createElement(
        Box,
        {
          position: "absolute",
          style: {
            background: `radial-gradient(50% 50% at 50% 50%, ${gradientRgbas[0]} 0%, ${gradientRgbas[1]} 25%, rgba(0,0,0,0) 100%)`,
            height: 564,
            left: -215,
            top: -197,
            transform: "translate3d(0, 0, 0)",
            width: 564
          }
        }
      ),
      import_react69.default.createElement(
        Box,
        {
          position: "absolute",
          style: {
            background: `radial-gradient(50% 50% at 50% 50%, ${gradientRgbas[2]} 0%, rgba(0, 0, 0, 0) 100%)`,
            height: 564,
            left: -1,
            top: -76,
            transform: "translate3d(0, 0, 0)",
            width: 564
          }
        }
      )
    ),
    import_react69.default.createElement(
      Box,
      {
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "row",
        gap: "24",
        height: "max",
        justifyContent: "center",
        style: { zIndex: 1 }
      },
      import_react69.default.createElement(Box, null, import_react69.default.createElement(
        AsyncImage,
        {
          height: "60",
          src: iconUrl,
          width: "60",
          ...iconBackground ? {
            background: iconBackground,
            borderColor: "generalBorder",
            borderRadius: "10"
          } : null
        }
      )),
      import_react69.default.createElement(
        Box,
        {
          display: "flex",
          flexDirection: "column",
          gap: "4",
          style: { flex: 1 },
          width: "full"
        },
        import_react69.default.createElement(Text, { color: "modalText", size: "14", weight: "bold" }, title),
        import_react69.default.createElement(Text, { color: "modalTextSecondary", size: "14", weight: "medium" }, description),
        import_react69.default.createElement(Box, { marginTop: "14", width: "max" }, import_react69.default.createElement(
          ActionButton,
          {
            href: url,
            label: actionLabel,
            onClick: onAction,
            size: "medium"
          }
        ))
      )
    )
  );
};
function DownloadOptionsDetail({
  changeWalletStep,
  wallet
}) {
  const browser = getBrowser();
  const platform = getPlatform();
  const modalSize = (0, import_react69.useContext)(ModalSizeContext);
  const isCompact = modalSize === "compact";
  const {
    desktop,
    desktopDownloadUrl,
    extension,
    extensionDownloadUrl,
    mobileDownloadUrl
  } = wallet;
  const { i18n: i18n2 } = (0, import_react69.useContext)(I18nContext);
  (0, import_react69.useEffect)(() => {
    preloadCreateIcon();
    preloadScanIcon();
    preloadRefreshIcon();
    preloadConnectIcon();
  }, []);
  return import_react69.default.createElement(
    Box,
    {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      gap: "24",
      height: "full",
      marginBottom: "8",
      marginTop: "4",
      width: "full"
    },
    import_react69.default.createElement(
      Box,
      {
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: "8",
        height: "full",
        justifyContent: "center",
        width: "full"
      },
      extensionDownloadUrl && import_react69.default.createElement(
        DownloadOptionsBox,
        {
          actionLabel: i18n2.t("get_options.extension.download.label", {
            browser
          }),
          description: i18n2.t("get_options.extension.description"),
          iconUrl: getBrowserSrc,
          isCompact,
          onAction: () => changeWalletStep(
            (extension == null ? void 0 : extension.instructions) ? "INSTRUCTIONS_EXTENSION" : "CONNECT"
            /* Connect */
          ),
          title: i18n2.t("get_options.extension.title", {
            wallet: wallet.name,
            browser
          }),
          url: extensionDownloadUrl,
          variant: "browser"
        }
      ),
      desktopDownloadUrl && import_react69.default.createElement(
        DownloadOptionsBox,
        {
          actionLabel: i18n2.t("get_options.desktop.download.label", {
            platform
          }),
          description: i18n2.t("get_options.desktop.description"),
          iconUrl: getPlatformSrc,
          isCompact,
          onAction: () => changeWalletStep(
            (desktop == null ? void 0 : desktop.instructions) ? "INSTRUCTIONS_DESKTOP" : "CONNECT"
            /* Connect */
          ),
          title: i18n2.t("get_options.desktop.title", {
            wallet: wallet.name,
            platform
          }),
          url: desktopDownloadUrl,
          variant: "desktop"
        }
      ),
      mobileDownloadUrl && import_react69.default.createElement(
        DownloadOptionsBox,
        {
          actionLabel: i18n2.t("get_options.mobile.download.label", {
            wallet: wallet.name
          }),
          description: i18n2.t("get_options.mobile.description"),
          iconAccent: wallet.iconAccent,
          iconBackground: wallet.iconBackground,
          iconUrl: wallet.iconUrl,
          isCompact,
          onAction: () => {
            changeWalletStep(
              "DOWNLOAD"
              /* Download */
            );
          },
          title: i18n2.t("get_options.mobile.title", { wallet: wallet.name }),
          variant: "app"
        }
      )
    )
  );
}
function DownloadDetail({
  changeWalletStep,
  wallet
}) {
  const { downloadUrls, qrCode } = wallet;
  const { i18n: i18n2 } = (0, import_react69.useContext)(I18nContext);
  (0, import_react69.useEffect)(() => {
    preloadCreateIcon();
    preloadScanIcon();
  }, []);
  return import_react69.default.createElement(
    Box,
    {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      gap: "24",
      height: "full",
      width: "full"
    },
    import_react69.default.createElement(Box, { style: { maxWidth: 220, textAlign: "center" } }, import_react69.default.createElement(Text, { color: "modalTextSecondary", size: "14", weight: "semibold" }, i18n2.t("get_mobile.description"))),
    import_react69.default.createElement(Box, { height: "full" }, (downloadUrls == null ? void 0 : downloadUrls.qrCode) ? import_react69.default.createElement(QRCode, { logoSize: 0, size: 268, uri: downloadUrls.qrCode }) : null),
    import_react69.default.createElement(
      Box,
      {
        alignItems: "center",
        borderRadius: "10",
        display: "flex",
        flexDirection: "row",
        gap: "8",
        height: "34",
        justifyContent: "space-between",
        marginBottom: "12",
        paddingY: "8"
      },
      import_react69.default.createElement(
        ActionButton,
        {
          label: i18n2.t("get_mobile.continue.label"),
          onClick: () => changeWalletStep(
            (qrCode == null ? void 0 : qrCode.instructions) ? "INSTRUCTIONS_MOBILE" : "CONNECT"
            /* Connect */
          )
        }
      )
    )
  );
}
var stepIcons = {
  connect: () => import_react69.default.createElement(ConnectIcon, null),
  create: () => import_react69.default.createElement(CreateIcon, null),
  install: (wallet) => import_react69.default.createElement(
    AsyncImage,
    {
      background: wallet.iconBackground,
      borderColor: "generalBorder",
      borderRadius: "10",
      height: "48",
      src: wallet.iconUrl,
      width: "48"
    }
  ),
  refresh: () => import_react69.default.createElement(RefreshIcon, null),
  scan: () => import_react69.default.createElement(ScanIcon, null)
};
function InstructionMobileDetail({
  connectWallet,
  wallet
}) {
  var _a, _b, _c, _d;
  const { i18n: i18n2 } = (0, import_react69.useContext)(I18nContext);
  return import_react69.default.createElement(
    Box,
    {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      height: "full",
      width: "full"
    },
    import_react69.default.createElement(
      Box,
      {
        display: "flex",
        flexDirection: "column",
        gap: "28",
        height: "full",
        justifyContent: "center",
        paddingY: "32",
        style: { maxWidth: 320 }
      },
      (_b = (_a = wallet == null ? void 0 : wallet.qrCode) == null ? void 0 : _a.instructions) == null ? void 0 : _b.steps.map((d, idx) => {
        var _a2;
        return import_react69.default.createElement(
          Box,
          {
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
            gap: "16",
            key: idx
          },
          import_react69.default.createElement(
            Box,
            {
              borderRadius: "10",
              height: "48",
              minWidth: "48",
              overflow: "hidden",
              position: "relative",
              width: "48"
            },
            (_a2 = stepIcons[d.step]) == null ? void 0 : _a2.call(stepIcons, wallet)
          ),
          import_react69.default.createElement(Box, { display: "flex", flexDirection: "column", gap: "4" }, import_react69.default.createElement(Text, { color: "modalText", size: "14", weight: "bold" }, i18n2.t(d.title, void 0, {
            rawKeyIfTranslationMissing: true
          })), import_react69.default.createElement(Text, { color: "modalTextSecondary", size: "14", weight: "medium" }, i18n2.t(d.description, void 0, {
            rawKeyIfTranslationMissing: true
          })))
        );
      })
    ),
    import_react69.default.createElement(
      Box,
      {
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: "12",
        justifyContent: "center",
        marginBottom: "16"
      },
      import_react69.default.createElement(
        ActionButton,
        {
          label: i18n2.t("get_instructions.mobile.connect.label"),
          onClick: () => connectWallet(wallet)
        }
      ),
      import_react69.default.createElement(
        Box,
        {
          as: "a",
          className: touchableStyles({ active: "shrink", hover: "grow" }),
          display: "block",
          href: (_d = (_c = wallet == null ? void 0 : wallet.qrCode) == null ? void 0 : _c.instructions) == null ? void 0 : _d.learnMoreUrl,
          paddingX: "12",
          paddingY: "4",
          rel: "noreferrer",
          style: { willChange: "transform" },
          target: "_blank",
          transition: "default"
        },
        import_react69.default.createElement(Text, { color: "accentColor", size: "14", weight: "bold" }, i18n2.t("get_instructions.mobile.learn_more.label"))
      )
    )
  );
}
function InstructionExtensionDetail({
  wallet
}) {
  var _a, _b, _c, _d;
  const { i18n: i18n2 } = (0, import_react69.useContext)(I18nContext);
  return import_react69.default.createElement(
    Box,
    {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      height: "full",
      width: "full"
    },
    import_react69.default.createElement(
      Box,
      {
        display: "flex",
        flexDirection: "column",
        gap: "28",
        height: "full",
        justifyContent: "center",
        paddingY: "32",
        style: { maxWidth: 320 }
      },
      (_b = (_a = wallet == null ? void 0 : wallet.extension) == null ? void 0 : _a.instructions) == null ? void 0 : _b.steps.map((d, idx) => {
        var _a2;
        return import_react69.default.createElement(
          Box,
          {
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
            gap: "16",
            key: idx
          },
          import_react69.default.createElement(
            Box,
            {
              borderRadius: "10",
              height: "48",
              minWidth: "48",
              overflow: "hidden",
              position: "relative",
              width: "48"
            },
            (_a2 = stepIcons[d.step]) == null ? void 0 : _a2.call(stepIcons, wallet)
          ),
          import_react69.default.createElement(Box, { display: "flex", flexDirection: "column", gap: "4" }, import_react69.default.createElement(Text, { color: "modalText", size: "14", weight: "bold" }, i18n2.t(d.title, void 0, {
            rawKeyIfTranslationMissing: true
          })), import_react69.default.createElement(Text, { color: "modalTextSecondary", size: "14", weight: "medium" }, i18n2.t(d.description, void 0, {
            rawKeyIfTranslationMissing: true
          })))
        );
      })
    ),
    import_react69.default.createElement(
      Box,
      {
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: "12",
        justifyContent: "center",
        marginBottom: "16"
      },
      import_react69.default.createElement(
        ActionButton,
        {
          label: i18n2.t("get_instructions.extension.refresh.label"),
          onClick: window.location.reload.bind(window.location)
        }
      ),
      import_react69.default.createElement(
        Box,
        {
          as: "a",
          className: touchableStyles({ active: "shrink", hover: "grow" }),
          display: "block",
          href: (_d = (_c = wallet == null ? void 0 : wallet.extension) == null ? void 0 : _c.instructions) == null ? void 0 : _d.learnMoreUrl,
          paddingX: "12",
          paddingY: "4",
          rel: "noreferrer",
          style: { willChange: "transform" },
          target: "_blank",
          transition: "default"
        },
        import_react69.default.createElement(Text, { color: "accentColor", size: "14", weight: "bold" }, i18n2.t("get_instructions.extension.learn_more.label"))
      )
    )
  );
}
function InstructionDesktopDetail({
  connectWallet,
  wallet
}) {
  var _a, _b, _c, _d;
  const { i18n: i18n2 } = (0, import_react69.useContext)(I18nContext);
  return import_react69.default.createElement(
    Box,
    {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      height: "full",
      width: "full"
    },
    import_react69.default.createElement(
      Box,
      {
        display: "flex",
        flexDirection: "column",
        gap: "28",
        height: "full",
        justifyContent: "center",
        paddingY: "32",
        style: { maxWidth: 320 }
      },
      (_b = (_a = wallet == null ? void 0 : wallet.desktop) == null ? void 0 : _a.instructions) == null ? void 0 : _b.steps.map((d, idx) => {
        var _a2;
        return import_react69.default.createElement(
          Box,
          {
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
            gap: "16",
            key: idx
          },
          import_react69.default.createElement(
            Box,
            {
              borderRadius: "10",
              height: "48",
              minWidth: "48",
              overflow: "hidden",
              position: "relative",
              width: "48"
            },
            (_a2 = stepIcons[d.step]) == null ? void 0 : _a2.call(stepIcons, wallet)
          ),
          import_react69.default.createElement(Box, { display: "flex", flexDirection: "column", gap: "4" }, import_react69.default.createElement(Text, { color: "modalText", size: "14", weight: "bold" }, i18n2.t(d.title, void 0, {
            rawKeyIfTranslationMissing: true
          })), import_react69.default.createElement(Text, { color: "modalTextSecondary", size: "14", weight: "medium" }, i18n2.t(d.description, void 0, {
            rawKeyIfTranslationMissing: true
          })))
        );
      })
    ),
    import_react69.default.createElement(
      Box,
      {
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: "12",
        justifyContent: "center",
        marginBottom: "16"
      },
      import_react69.default.createElement(
        ActionButton,
        {
          label: i18n2.t("get_instructions.desktop.connect.label"),
          onClick: () => connectWallet(wallet)
        }
      ),
      import_react69.default.createElement(
        Box,
        {
          as: "a",
          className: touchableStyles({ active: "shrink", hover: "grow" }),
          display: "block",
          href: (_d = (_c = wallet == null ? void 0 : wallet.desktop) == null ? void 0 : _c.instructions) == null ? void 0 : _d.learnMoreUrl,
          paddingX: "12",
          paddingY: "4",
          rel: "noreferrer",
          style: { willChange: "transform" },
          target: "_blank",
          transition: "default"
        },
        import_react69.default.createElement(Text, { color: "accentColor", size: "14", weight: "bold" }, i18n2.t("get_instructions.desktop.learn_more.label"))
      )
    )
  );
}
function DesktopOptions({ onClose }) {
  const titleId = "rk_connect_title";
  const [selectedOptionId, setSelectedOptionId] = (0, import_react60.useState)();
  const [selectedWallet, setSelectedWallet] = (0, import_react60.useState)();
  const [qrCodeUri, setQrCodeUri] = (0, import_react60.useState)();
  const hasQrCode = !!(selectedWallet == null ? void 0 : selectedWallet.qrCode) && qrCodeUri;
  const [connectionError, setConnectionError] = (0, import_react60.useState)(false);
  const modalSize = (0, import_react60.useContext)(ModalSizeContext);
  const compactModeEnabled = modalSize === ModalSizeOptions.COMPACT;
  const { disclaimer: Disclaimer } = (0, import_react60.useContext)(AppContext);
  const { i18n: i18n2 } = (0, import_react60.useContext)(I18nContext);
  const safari = isSafari();
  const initialized = (0, import_react60.useRef)(false);
  const { connector } = (0, import_react60.useContext)(WalletButtonContext);
  const mergeEIP6963WithRkConnectors = !connector;
  const wallets = useWalletConnectors(mergeEIP6963WithRkConnectors).filter((wallet) => wallet.ready || !!wallet.extensionDownloadUrl).sort((a, b) => a.groupIndex - b.groupIndex);
  const unfilteredWallets = useWalletConnectors();
  const groupedWallets = groupBy(wallets, (wallet) => wallet.groupName);
  const supportedI18nGroupNames = [
    "Recommended",
    "Other",
    "Popular",
    "More",
    "Others",
    "Installed"
  ];
  (0, import_react60.useEffect)(() => {
    if (connector && !initialized.current) {
      changeWalletStep(
        "CONNECT"
        /* Connect */
      );
      selectWallet(connector);
      initialized.current = true;
    }
  }, [connector]);
  const connectToWallet = (wallet) => {
    var _a, _b;
    setConnectionError(false);
    if (wallet.ready) {
      (_b = (_a = wallet == null ? void 0 : wallet.connect) == null ? void 0 : _a.call(wallet)) == null ? void 0 : _b.catch(() => {
        setConnectionError(true);
      });
    }
  };
  const onDesktopUri = async (wallet) => {
    const sWallet = wallets.find((w) => wallet.id === w.id);
    if (!(sWallet == null ? void 0 : sWallet.getDesktopUri))
      return;
    setTimeout(async () => {
      var _a;
      const uri = await ((_a = sWallet == null ? void 0 : sWallet.getDesktopUri) == null ? void 0 : _a.call(sWallet));
      if (uri)
        window.open(uri, safari ? "_blank" : "_self");
    }, 0);
  };
  const onQrCode = async (wallet) => {
    var _a;
    const sWallet = wallets.find((w) => wallet.id === w.id);
    const uri = await ((_a = sWallet == null ? void 0 : sWallet.getQrCodeUri) == null ? void 0 : _a.call(sWallet));
    setQrCodeUri(uri);
    setTimeout(
      () => {
        setSelectedWallet(sWallet);
        changeWalletStep(
          "CONNECT"
          /* Connect */
        );
      },
      uri ? 0 : 50
    );
  };
  const selectWallet = async (wallet) => {
    addLatestWalletId(wallet.id);
    if (wallet.ready) {
      onQrCode(wallet);
      onDesktopUri(wallet);
    }
    connectToWallet(wallet);
    setSelectedOptionId(wallet.id);
    if (!wallet.ready) {
      setSelectedWallet(wallet);
      changeWalletStep(
        (wallet == null ? void 0 : wallet.extensionDownloadUrl) ? "DOWNLOAD_OPTIONS" : "CONNECT"
        /* Connect */
      );
    }
  };
  const getWalletDownload = (id) => {
    var _a;
    const sWallet = unfilteredWallets.find((w) => id === w.id);
    const isMobile2 = (_a = sWallet == null ? void 0 : sWallet.downloadUrls) == null ? void 0 : _a.qrCode;
    const isDesktop = !!(sWallet == null ? void 0 : sWallet.desktopDownloadUrl);
    const isExtension = !!(sWallet == null ? void 0 : sWallet.extensionDownloadUrl);
    setSelectedWallet(sWallet);
    if (isMobile2 && (isExtension || isDesktop)) {
      changeWalletStep(
        "DOWNLOAD_OPTIONS"
        /* DownloadOptions */
      );
    } else if (isMobile2) {
      changeWalletStep(
        "DOWNLOAD"
        /* Download */
      );
    } else if (isDesktop) {
      changeWalletStep(
        "INSTRUCTIONS_DESKTOP"
        /* InstructionsDesktop */
      );
    } else {
      changeWalletStep(
        "INSTRUCTIONS_EXTENSION"
        /* InstructionsExtension */
      );
    }
  };
  const clearSelectedWallet = () => {
    setSelectedOptionId(void 0);
    setSelectedWallet(void 0);
    setQrCodeUri(void 0);
  };
  const changeWalletStep = (newWalletStep, isBack = false) => {
    if (isBack && newWalletStep === "GET" && initialWalletStep === "GET") {
      clearSelectedWallet();
    } else if (!isBack && newWalletStep === "GET") {
      setInitialWalletStep(
        "GET"
        /* Get */
      );
    } else if (!isBack && newWalletStep === "CONNECT") {
      setInitialWalletStep(
        "CONNECT"
        /* Connect */
      );
    }
    setWalletStep(newWalletStep);
  };
  const [initialWalletStep, setInitialWalletStep] = (0, import_react60.useState)(
    "NONE"
    /* None */
  );
  const [walletStep, setWalletStep] = (0, import_react60.useState)(
    "NONE"
    /* None */
  );
  let walletContent = null;
  let headerLabel = null;
  let headerBackButtonLink = null;
  let headerBackButtonCallback;
  (0, import_react60.useEffect)(() => {
    setConnectionError(false);
  }, [walletStep, selectedWallet]);
  const hasExtension = !!(selectedWallet == null ? void 0 : selectedWallet.extensionDownloadUrl);
  const hasExtensionAndMobile = !!(hasExtension && (selectedWallet == null ? void 0 : selectedWallet.mobileDownloadUrl));
  switch (walletStep) {
    case "NONE":
      walletContent = import_react60.default.createElement(ConnectModalIntro, { getWallet: () => changeWalletStep(
        "GET"
        /* Get */
      ) });
      break;
    case "LEARN_COMPACT":
      walletContent = import_react60.default.createElement(
        ConnectModalIntro,
        {
          compactModeEnabled,
          getWallet: () => changeWalletStep(
            "GET"
            /* Get */
          )
        }
      );
      headerLabel = i18n2.t("intro.title");
      headerBackButtonLink = "NONE";
      break;
    case "GET":
      walletContent = import_react60.default.createElement(
        GetDetail,
        {
          getWalletDownload,
          compactModeEnabled
        }
      );
      headerLabel = i18n2.t("get.title");
      headerBackButtonLink = compactModeEnabled ? "LEARN_COMPACT" : "NONE";
      break;
    case "CONNECT":
      walletContent = selectedWallet && import_react60.default.createElement(
        ConnectDetail,
        {
          changeWalletStep,
          compactModeEnabled,
          connectionError,
          onClose,
          qrCodeUri,
          reconnect: connectToWallet,
          wallet: selectedWallet
        }
      );
      headerLabel = hasQrCode && (selectedWallet.name === "WalletConnect" ? i18n2.t("connect_scan.fallback_title") : i18n2.t("connect_scan.title", {
        wallet: selectedWallet.name
      }));
      headerBackButtonLink = compactModeEnabled ? connector ? null : "NONE" : null;
      headerBackButtonCallback = compactModeEnabled ? !connector ? clearSelectedWallet : () => {
      } : () => {
      };
      break;
    case "DOWNLOAD_OPTIONS":
      walletContent = selectedWallet && import_react60.default.createElement(
        DownloadOptionsDetail,
        {
          changeWalletStep,
          wallet: selectedWallet
        }
      );
      headerLabel = selectedWallet && i18n2.t("get_options.short_title", { wallet: selectedWallet.name });
      headerBackButtonLink = connector ? "CONNECT" : compactModeEnabled ? "NONE" : initialWalletStep;
      break;
    case "DOWNLOAD":
      walletContent = selectedWallet && import_react60.default.createElement(
        DownloadDetail,
        {
          changeWalletStep,
          wallet: selectedWallet
        }
      );
      headerLabel = selectedWallet && i18n2.t("get_mobile.title", { wallet: selectedWallet.name });
      headerBackButtonLink = hasExtensionAndMobile ? "DOWNLOAD_OPTIONS" : initialWalletStep;
      break;
    case "INSTRUCTIONS_MOBILE":
      walletContent = selectedWallet && import_react60.default.createElement(
        InstructionMobileDetail,
        {
          connectWallet: selectWallet,
          wallet: selectedWallet
        }
      );
      headerLabel = selectedWallet && i18n2.t("get_options.title", {
        wallet: compactModeEnabled ? selectedWallet.shortName || selectedWallet.name : selectedWallet.name
      });
      headerBackButtonLink = "DOWNLOAD";
      break;
    case "INSTRUCTIONS_EXTENSION":
      walletContent = selectedWallet && import_react60.default.createElement(InstructionExtensionDetail, { wallet: selectedWallet });
      headerLabel = selectedWallet && i18n2.t("get_options.title", {
        wallet: compactModeEnabled ? selectedWallet.shortName || selectedWallet.name : selectedWallet.name
      });
      headerBackButtonLink = "DOWNLOAD_OPTIONS";
      break;
    case "INSTRUCTIONS_DESKTOP":
      walletContent = selectedWallet && import_react60.default.createElement(
        InstructionDesktopDetail,
        {
          connectWallet: selectWallet,
          wallet: selectedWallet
        }
      );
      headerLabel = selectedWallet && i18n2.t("get_options.title", {
        wallet: compactModeEnabled ? selectedWallet.shortName || selectedWallet.name : selectedWallet.name
      });
      headerBackButtonLink = "DOWNLOAD_OPTIONS";
      break;
    default:
      break;
  }
  return import_react60.default.createElement(
    Box,
    {
      display: "flex",
      flexDirection: "row",
      style: { maxHeight: compactModeEnabled ? 468 : 504 }
    },
    (compactModeEnabled ? walletStep === "NONE" : true) && import_react60.default.createElement(
      Box,
      {
        className: compactModeEnabled ? sidebarCompactMode : sidebar,
        display: "flex",
        flexDirection: "column",
        marginTop: "16"
      },
      import_react60.default.createElement(Box, { display: "flex", justifyContent: "space-between" }, compactModeEnabled && Disclaimer && import_react60.default.createElement(Box, { marginLeft: "16", width: "28" }, import_react60.default.createElement(
        InfoButton,
        {
          onClick: () => changeWalletStep(
            "LEARN_COMPACT"
            /* LearnCompact */
          )
        }
      )), compactModeEnabled && !Disclaimer && import_react60.default.createElement(Box, { marginLeft: "16", width: "28" }), import_react60.default.createElement(
        Box,
        {
          marginLeft: compactModeEnabled ? "0" : "6",
          paddingBottom: "8",
          paddingTop: "2",
          paddingX: "18"
        },
        import_react60.default.createElement(
          Text,
          {
            as: "h1",
            color: "modalText",
            id: titleId,
            size: "18",
            weight: "heavy",
            testId: "connect-header-label"
          },
          i18n2.t("connect.title")
        )
      ), compactModeEnabled && import_react60.default.createElement(Box, { marginRight: "16" }, import_react60.default.createElement(CloseButton, { onClose }))),
      import_react60.default.createElement(Box, { className: ScrollClassName, paddingBottom: "18" }, Object.entries(groupedWallets).map(
        ([groupName, wallets2], index2) => wallets2.length > 0 && import_react60.default.createElement(import_react60.Fragment, { key: index2 }, groupName ? import_react60.default.createElement(Box, { marginBottom: "8", marginTop: "16", marginX: "6" }, import_react60.default.createElement(
          Text,
          {
            color: groupName === "Installed" ? "accentColor" : "modalTextSecondary",
            size: "14",
            weight: "bold"
          },
          supportedI18nGroupNames.includes(groupName) ? i18n2.t(
            `connector_group.${groupName.toLowerCase()}`
          ) : groupName
        )) : null, import_react60.default.createElement(Box, { display: "flex", flexDirection: "column", gap: "4" }, wallets2.map((wallet) => {
          return import_react60.default.createElement(
            ModalSelection,
            {
              currentlySelected: wallet.id === selectedOptionId,
              iconBackground: wallet.iconBackground,
              iconUrl: wallet.iconUrl,
              key: wallet.id,
              name: wallet.name,
              onClick: () => selectWallet(wallet),
              ready: wallet.ready,
              recent: wallet.recent,
              testId: `wallet-option-${wallet.id}`,
              isRainbowKitConnector: wallet.isRainbowKitConnector
            }
          );
        })))
      )),
      compactModeEnabled && import_react60.default.createElement(import_react60.default.Fragment, null, import_react60.default.createElement(Box, { background: "generalBorder", height: "1", marginTop: "-1" }), Disclaimer ? import_react60.default.createElement(Box, { paddingX: "24", paddingY: "16", textAlign: "center" }, import_react60.default.createElement(Disclaimer, { Link: DisclaimerLink, Text: DisclaimerText })) : import_react60.default.createElement(
        Box,
        {
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          paddingX: "24",
          paddingY: "16"
        },
        import_react60.default.createElement(Box, { paddingY: "4" }, import_react60.default.createElement(Text, { color: "modalTextSecondary", size: "14", weight: "medium" }, i18n2.t("connect.new_to_ethereum.description"))),
        import_react60.default.createElement(
          Box,
          {
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
            gap: "4",
            justifyContent: "center"
          },
          import_react60.default.createElement(
            Box,
            {
              className: touchableStyles({
                active: "shrink",
                hover: "grow"
              }),
              cursor: "pointer",
              onClick: () => changeWalletStep(
                "LEARN_COMPACT"
                /* LearnCompact */
              ),
              paddingY: "4",
              style: { willChange: "transform" },
              transition: "default"
            },
            import_react60.default.createElement(Text, { color: "accentColor", size: "14", weight: "bold" }, i18n2.t("connect.new_to_ethereum.learn_more.label"))
          )
        )
      ))
    ),
    (compactModeEnabled ? walletStep !== "NONE" : true) && import_react60.default.createElement(import_react60.default.Fragment, null, !compactModeEnabled && import_react60.default.createElement(Box, { background: "generalBorder", minWidth: "1", width: "1" }), import_react60.default.createElement(
      Box,
      {
        display: "flex",
        flexDirection: "column",
        margin: "16",
        style: { flexGrow: 1 }
      },
      import_react60.default.createElement(
        Box,
        {
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "12"
        },
        import_react60.default.createElement(Box, { width: "28" }, headerBackButtonLink && import_react60.default.createElement(
          Box,
          {
            as: "button",
            className: touchableStyles({
              active: "shrinkSm",
              hover: "growLg"
            }),
            color: "accentColor",
            onClick: () => {
              headerBackButtonLink && changeWalletStep(headerBackButtonLink, true);
              headerBackButtonCallback == null ? void 0 : headerBackButtonCallback();
            },
            paddingX: "8",
            paddingY: "4",
            style: {
              boxSizing: "content-box",
              height: 17,
              willChange: "transform"
            },
            transition: "default",
            type: "button"
          },
          import_react60.default.createElement(BackIcon, null)
        )),
        import_react60.default.createElement(
          Box,
          {
            display: "flex",
            justifyContent: "center",
            style: { flexGrow: 1 }
          },
          headerLabel && import_react60.default.createElement(
            Text,
            {
              color: "modalText",
              size: "18",
              textAlign: "center",
              weight: "heavy"
            },
            headerLabel
          )
        ),
        import_react60.default.createElement(CloseButton, { onClose })
      ),
      import_react60.default.createElement(
        Box,
        {
          display: "flex",
          flexDirection: "column",
          style: { minHeight: compactModeEnabled ? 396 : 432 }
        },
        import_react60.default.createElement(
          Box,
          {
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            gap: "6",
            height: "full",
            justifyContent: "center",
            marginX: "8"
          },
          walletContent
        )
      )
    ))
  );
}
var rotatingBorder = "_1am14412";
var scroll = "_1am14410";
var spinner = "_1am14413";
var LoadingSpinner = ({ wallet }) => {
  const width = 80;
  const height = 80;
  const radiusFactor = 20;
  const perimeter = 2 * (width + height - 4 * radiusFactor);
  return import_react75.default.createElement("svg", { className: spinner, viewBox: "0 0 86 86", width: "86", height: "86" }, import_react75.default.createElement("title", null, "Loading"), import_react75.default.createElement(
    "rect",
    {
      x: "3",
      y: "3",
      width,
      height,
      rx: radiusFactor,
      ry: radiusFactor,
      strokeDasharray: `${perimeter / 3} ${2 * perimeter / 3}`,
      strokeDashoffset: perimeter,
      className: rotatingBorder,
      style: {
        // Prop style passing works only in `@vanilla-extract/recipes`.
        // Instead downloading packages we can do this
        // manually without passing props
        stroke: (wallet == null ? void 0 : wallet.iconAccent) || "#0D3887"
      }
    }
  ));
};
function WalletButton({
  onClose,
  wallet,
  connecting
}) {
  const {
    connect,
    iconBackground,
    iconUrl,
    id,
    name,
    getMobileUri,
    ready,
    shortName,
    showWalletConnectModal
  } = wallet;
  const coolModeRef = useCoolMode(iconUrl);
  const initialized = (0, import_react75.useRef)(false);
  const { i18n: i18n2 } = (0, import_react75.useContext)(I18nContext);
  const onConnect = (0, import_react75.useCallback)(async () => {
    const onMobileUri = async () => {
      const mobileUri = await (getMobileUri == null ? void 0 : getMobileUri());
      if (!mobileUri)
        return;
      if (mobileUri) {
        setWalletConnectDeepLink({ mobileUri, name });
      }
      if (mobileUri.startsWith("http")) {
        const link = document.createElement("a");
        link.href = mobileUri;
        link.target = "_blank";
        link.rel = "noreferrer noopener";
        link.click();
      } else {
        window.location.href = mobileUri;
      }
    };
    if (id !== "walletConnect")
      onMobileUri();
    if (showWalletConnectModal) {
      showWalletConnectModal();
      onClose == null ? void 0 : onClose();
      return;
    }
    connect == null ? void 0 : connect();
  }, [connect, getMobileUri, showWalletConnectModal, onClose, name, id]);
  (0, import_react75.useEffect)(() => {
    if (connecting && !initialized.current) {
      onConnect();
      initialized.current = true;
    }
  }, [connecting, onConnect]);
  return import_react75.default.createElement(
    Box,
    {
      as: "button",
      color: ready ? "modalText" : "modalTextSecondary",
      disabled: !ready,
      fontFamily: "body",
      key: id,
      onClick: onConnect,
      ref: coolModeRef,
      style: { overflow: "visible", textAlign: "center" },
      testId: `wallet-option-${id}`,
      type: "button",
      width: "full"
    },
    import_react75.default.createElement(
      Box,
      {
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      },
      import_react75.default.createElement(
        Box,
        {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: "8",
          paddingTop: "10",
          position: "relative"
        },
        connecting ? import_react75.default.createElement(LoadingSpinner, { wallet }) : null,
        import_react75.default.createElement(
          AsyncImage,
          {
            background: iconBackground,
            borderRadius: "13",
            boxShadow: "walletLogo",
            height: "60",
            src: iconUrl,
            width: "60"
          }
        )
      ),
      !connecting ? import_react75.default.createElement(Box, { display: "flex", flexDirection: "column", textAlign: "center" }, import_react75.default.createElement(
        Text,
        {
          as: "h2",
          color: wallet.ready ? "modalText" : "modalTextSecondary",
          size: "13",
          weight: "medium"
        },
        import_react75.default.createElement(Box, { as: "span", position: "relative" }, shortName ?? name, !wallet.ready && " (unsupported)")
      ), wallet.recent && import_react75.default.createElement(Text, { color: "accentColor", size: "12", weight: "medium" }, i18n2.t("connect.recent"))) : null
    )
  );
}
function MobileOptions({ onClose }) {
  var _a;
  const titleId = "rk_connect_title";
  const wallets = useWalletConnectors().filter(
    (wallet) => wallet.isRainbowKitConnector
  );
  const { disclaimer: Disclaimer, learnMoreUrl } = (0, import_react75.useContext)(AppContext);
  let headerLabel = null;
  let walletContent = null;
  let headerBackgroundContrast = false;
  let headerBackButtonLink = null;
  const [walletStep, setWalletStep] = (0, import_react75.useState)(
    "CONNECT"
    /* Connect */
  );
  const { i18n: i18n2 } = (0, import_react75.useContext)(I18nContext);
  const ios = isIOS();
  switch (walletStep) {
    case "CONNECT": {
      headerLabel = i18n2.t("connect.title");
      headerBackgroundContrast = true;
      walletContent = import_react75.default.createElement(Box, null, import_react75.default.createElement(
        Box,
        {
          background: "profileForeground",
          className: scroll,
          display: "flex",
          paddingBottom: "20",
          paddingTop: "6"
        },
        import_react75.default.createElement(Box, { display: "flex", style: { margin: "0 auto" } }, wallets.filter((wallet) => wallet.ready).map((wallet) => {
          return import_react75.default.createElement(Box, { key: wallet.id, paddingX: "20" }, import_react75.default.createElement(Box, { width: "60" }, import_react75.default.createElement(WalletButton, { onClose, wallet })));
        }))
      ), import_react75.default.createElement(
        Box,
        {
          background: "generalBorder",
          height: "1",
          marginBottom: "32",
          marginTop: "-1"
        }
      ), import_react75.default.createElement(
        Box,
        {
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: "32",
          paddingX: "32",
          style: { textAlign: "center" }
        },
        import_react75.default.createElement(
          Box,
          {
            display: "flex",
            flexDirection: "column",
            gap: "8",
            textAlign: "center"
          },
          import_react75.default.createElement(Text, { color: "modalText", size: "16", weight: "bold" }, i18n2.t("intro.title")),
          import_react75.default.createElement(Text, { color: "modalTextSecondary", size: "16" }, i18n2.t("intro.description"))
        )
      ), import_react75.default.createElement(Box, { paddingTop: "32", paddingX: "20" }, import_react75.default.createElement(Box, { display: "flex", gap: "14", justifyContent: "center" }, import_react75.default.createElement(
        ActionButton,
        {
          label: i18n2.t("intro.get.label"),
          onClick: () => setWalletStep(
            "GET"
            /* Get */
          ),
          size: "large",
          type: "secondary"
        }
      ), import_react75.default.createElement(
        ActionButton,
        {
          href: learnMoreUrl,
          label: i18n2.t("intro.learn_more.label"),
          size: "large",
          type: "secondary"
        }
      ))), Disclaimer && import_react75.default.createElement(Box, { marginTop: "28", marginX: "32", textAlign: "center" }, import_react75.default.createElement(Disclaimer, { Link: DisclaimerLink, Text: DisclaimerText })));
      break;
    }
    case "GET": {
      headerLabel = i18n2.t("get.title");
      headerBackButtonLink = "CONNECT";
      const mobileWallets = (_a = wallets == null ? void 0 : wallets.filter(
        (wallet) => {
          var _a2, _b, _c;
          return ((_a2 = wallet.downloadUrls) == null ? void 0 : _a2.ios) || ((_b = wallet.downloadUrls) == null ? void 0 : _b.android) || ((_c = wallet.downloadUrls) == null ? void 0 : _c.mobile);
        }
      )) == null ? void 0 : _a.splice(0, 3);
      walletContent = import_react75.default.createElement(Box, null, import_react75.default.createElement(
        Box,
        {
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          height: "full",
          marginBottom: "36",
          marginTop: "5",
          paddingTop: "12",
          width: "full"
        },
        mobileWallets.map((wallet, index2) => {
          const { downloadUrls, iconBackground, iconUrl, name } = wallet;
          if (!(downloadUrls == null ? void 0 : downloadUrls.ios) && !(downloadUrls == null ? void 0 : downloadUrls.android) && !(downloadUrls == null ? void 0 : downloadUrls.mobile)) {
            return null;
          }
          return import_react75.default.createElement(
            Box,
            {
              display: "flex",
              gap: "16",
              key: wallet.id,
              paddingX: "20",
              width: "full"
            },
            import_react75.default.createElement(Box, { style: { minHeight: 48, minWidth: 48 } }, import_react75.default.createElement(
              AsyncImage,
              {
                background: iconBackground,
                borderColor: "generalBorder",
                borderRadius: "10",
                height: "48",
                src: iconUrl,
                width: "48"
              }
            )),
            import_react75.default.createElement(Box, { display: "flex", flexDirection: "column", width: "full" }, import_react75.default.createElement(Box, { alignItems: "center", display: "flex", height: "48" }, import_react75.default.createElement(Box, { width: "full" }, import_react75.default.createElement(Text, { color: "modalText", size: "18", weight: "bold" }, name)), import_react75.default.createElement(
              ActionButton,
              {
                href: (ios ? downloadUrls == null ? void 0 : downloadUrls.ios : downloadUrls == null ? void 0 : downloadUrls.android) || (downloadUrls == null ? void 0 : downloadUrls.mobile),
                label: i18n2.t("get.action.label"),
                size: "small",
                type: "secondary"
              }
            )), index2 < mobileWallets.length - 1 && import_react75.default.createElement(
              Box,
              {
                background: "generalBorderDim",
                height: "1",
                marginY: "10",
                width: "full"
              }
            ))
          );
        })
      ), import_react75.default.createElement(Box, { style: { marginBottom: "42px" } }), import_react75.default.createElement(
        Box,
        {
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: "36",
          paddingX: "36",
          style: { textAlign: "center" }
        },
        import_react75.default.createElement(
          Box,
          {
            display: "flex",
            flexDirection: "column",
            gap: "12",
            textAlign: "center"
          },
          import_react75.default.createElement(Text, { color: "modalText", size: "16", weight: "bold" }, i18n2.t("get.looking_for.title")),
          import_react75.default.createElement(Text, { color: "modalTextSecondary", size: "16" }, i18n2.t("get.looking_for.mobile.description"))
        )
      ));
      break;
    }
  }
  return import_react75.default.createElement(Box, { display: "flex", flexDirection: "column", paddingBottom: "36" }, import_react75.default.createElement(
    Box,
    {
      background: headerBackgroundContrast ? "profileForeground" : "modalBackground",
      display: "flex",
      flexDirection: "column",
      paddingBottom: "4",
      paddingTop: "14"
    },
    import_react75.default.createElement(
      Box,
      {
        display: "flex",
        justifyContent: "center",
        paddingBottom: "6",
        paddingX: "20",
        position: "relative"
      },
      headerBackButtonLink && import_react75.default.createElement(
        Box,
        {
          display: "flex",
          position: "absolute",
          style: {
            left: 0,
            marginBottom: -20,
            marginTop: -20
          }
        },
        import_react75.default.createElement(
          Box,
          {
            alignItems: "center",
            as: "button",
            className: touchableStyles({
              active: "shrinkSm",
              hover: "growLg"
            }),
            color: "accentColor",
            display: "flex",
            marginLeft: "4",
            marginTop: "20",
            onClick: () => setWalletStep(headerBackButtonLink),
            padding: "16",
            style: { height: 17, willChange: "transform" },
            transition: "default",
            type: "button"
          },
          import_react75.default.createElement(BackIcon, null)
        )
      ),
      import_react75.default.createElement(Box, { marginTop: "4", textAlign: "center", width: "full" }, import_react75.default.createElement(
        Text,
        {
          as: "h1",
          color: "modalText",
          id: titleId,
          size: "20",
          weight: "bold"
        },
        headerLabel
      )),
      import_react75.default.createElement(
        Box,
        {
          alignItems: "center",
          display: "flex",
          height: "32",
          paddingRight: "14",
          position: "absolute",
          right: "0"
        },
        import_react75.default.createElement(
          Box,
          {
            style: { marginBottom: -20, marginTop: -20 }
          },
          import_react75.default.createElement(CloseButton, { onClose })
        )
      )
    )
  ), import_react75.default.createElement(Box, { display: "flex", flexDirection: "column" }, walletContent));
}
var MobileStatus = ({ onClose }) => {
  const { connector } = (0, import_react76.useContext)(WalletButtonContext);
  const { i18n: i18n2 } = (0, import_react76.useContext)(I18nContext);
  const connectorName = (connector == null ? void 0 : connector.name) || "";
  return import_react76.default.createElement(Box, null, import_react76.default.createElement(
    Box,
    {
      display: "flex",
      paddingBottom: "32",
      justifyContent: "center",
      alignItems: "center",
      background: "profileForeground",
      flexDirection: "column"
    },
    import_react76.default.createElement(
      Box,
      {
        width: "full",
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "18",
        marginRight: "24"
      },
      import_react76.default.createElement(CloseButton, { onClose })
    ),
    import_react76.default.createElement(Box, { width: "60" }, import_react76.default.createElement(WalletButton, { onClose, wallet: connector, connecting: true })),
    import_react76.default.createElement(Box, { marginTop: "20" }, import_react76.default.createElement(
      Text,
      {
        textAlign: "center",
        color: "modalText",
        size: "18",
        weight: "semibold"
      },
      i18n2.t("connect.status.connect_mobile", {
        wallet: connectorName
      })
    )),
    import_react76.default.createElement(Box, { maxWidth: "full", marginTop: "8" }, import_react76.default.createElement(Text, { textAlign: "center", color: "modalText", size: "16", weight: "medium" }, i18n2.t("connect.status.confirm_mobile", {
      wallet: connectorName
    })))
  ));
};
function ConnectOptions({ onClose }) {
  const { connector } = (0, import_react59.useContext)(WalletButtonContext);
  return isMobile() ? connector ? import_react59.default.createElement(MobileStatus, { onClose }) : import_react59.default.createElement(MobileOptions, { onClose }) : import_react59.default.createElement(DesktopOptions, { onClose });
}
function ConnectModal({ onClose, open }) {
  const titleId = "rk_connect_title";
  const connectionStatus = useConnectionStatus();
  const { disconnect } = useDisconnect();
  const { isConnecting } = useAccount();
  const onAuthCancel = import_react58.default.useCallback(() => {
    onClose();
    disconnect();
  }, [onClose, disconnect]);
  const onConnectModalCancel = import_react58.default.useCallback(() => {
    if (isConnecting)
      disconnect();
    onClose();
  }, [onClose, disconnect, isConnecting]);
  if (connectionStatus === "disconnected") {
    return import_react58.default.createElement(Dialog, { onClose: onConnectModalCancel, open, titleId }, import_react58.default.createElement(DialogContent, { bottomSheetOnMobile: true, padding: "0", wide: true }, import_react58.default.createElement(ConnectOptions, { onClose: onConnectModalCancel })));
  }
  if (connectionStatus === "unauthenticated") {
    return import_react58.default.createElement(Dialog, { onClose: onAuthCancel, open, titleId }, import_react58.default.createElement(DialogContent, { bottomSheetOnMobile: true, padding: "0" }, import_react58.default.createElement(SignIn, { onClose: onAuthCancel, onCloseModal: onClose })));
  }
  return null;
}
function useModalStateValue() {
  const [isModalOpen, setModalOpen] = (0, import_react21.useState)(false);
  return {
    closeModal: (0, import_react21.useCallback)(() => setModalOpen(false), []),
    isModalOpen,
    openModal: (0, import_react21.useCallback)(() => setModalOpen(true), [])
  };
}
var ModalContext = (0, import_react21.createContext)({
  accountModalOpen: false,
  chainModalOpen: false,
  connectModalOpen: false,
  isWalletConnectModalOpen: false,
  setIsWalletConnectModalOpen: () => {
  }
});
function ModalProvider({ children }) {
  const {
    closeModal: closeConnectModal,
    isModalOpen: connectModalOpen,
    openModal: openConnectModal
  } = useModalStateValue();
  const {
    closeModal: closeAccountModal,
    isModalOpen: accountModalOpen,
    openModal: openAccountModal
  } = useModalStateValue();
  const {
    closeModal: closeChainModal,
    isModalOpen: chainModalOpen,
    openModal: openChainModal
  } = useModalStateValue();
  const [isWalletConnectModalOpen, setIsWalletConnectModalOpen] = (0, import_react21.useState)(false);
  const connectionStatus = useConnectionStatus();
  const { chainId } = useAccount();
  const { chains } = useConfig();
  const isCurrentChainSupported = chains.some((chain2) => chain2.id === chainId);
  const closeModals = (0, import_react21.useCallback)(
    ({ keepConnectModalOpen = false } = {}) => {
      if (!keepConnectModalOpen) {
        closeConnectModal();
      }
      closeAccountModal();
      closeChainModal();
    },
    [closeConnectModal, closeAccountModal, closeChainModal]
  );
  const isUnauthenticated = useAuthenticationStatus() === "unauthenticated";
  useAccountEffect({
    onConnect: () => closeModals({ keepConnectModalOpen: isUnauthenticated }),
    onDisconnect: () => closeModals()
  });
  (0, import_react21.useEffect)(() => {
    if (isUnauthenticated)
      closeModals();
  }, [isUnauthenticated, closeModals]);
  return import_react21.default.createElement(
    ModalContext.Provider,
    {
      value: (0, import_react21.useMemo)(
        () => ({
          accountModalOpen,
          chainModalOpen,
          connectModalOpen,
          isWalletConnectModalOpen,
          openAccountModal: isCurrentChainSupported && connectionStatus === "connected" ? openAccountModal : void 0,
          openChainModal: connectionStatus === "connected" ? openChainModal : void 0,
          openConnectModal: connectionStatus === "disconnected" || connectionStatus === "unauthenticated" ? openConnectModal : void 0,
          setIsWalletConnectModalOpen
        }),
        [
          connectionStatus,
          accountModalOpen,
          chainModalOpen,
          connectModalOpen,
          openAccountModal,
          openChainModal,
          openConnectModal,
          isCurrentChainSupported,
          isWalletConnectModalOpen
        ]
      )
    },
    children,
    import_react21.default.createElement(ConnectModal, { onClose: closeConnectModal, open: connectModalOpen }),
    import_react21.default.createElement(AccountModal, { onClose: closeAccountModal, open: accountModalOpen }),
    import_react21.default.createElement(ChainModal, { onClose: closeChainModal, open: chainModalOpen })
  );
}
function useModalState() {
  const { accountModalOpen, chainModalOpen, connectModalOpen } = (0, import_react21.useContext)(ModalContext);
  return {
    accountModalOpen,
    chainModalOpen,
    connectModalOpen
  };
}
function useAccountModal() {
  const { accountModalOpen, openAccountModal } = (0, import_react21.useContext)(ModalContext);
  return { accountModalOpen, openAccountModal };
}
function useChainModal() {
  const { chainModalOpen, openChainModal } = (0, import_react21.useContext)(ModalContext);
  return { chainModalOpen, openChainModal };
}
function useWalletConnectOpenState() {
  const { isWalletConnectModalOpen, setIsWalletConnectModalOpen } = (0, import_react21.useContext)(ModalContext);
  return { isWalletConnectModalOpen, setIsWalletConnectModalOpen };
}
function useConnectModal() {
  const { connectModalOpen, openConnectModal } = (0, import_react21.useContext)(ModalContext);
  const { isWalletConnectModalOpen } = useWalletConnectOpenState();
  return {
    connectModalOpen: connectModalOpen || isWalletConnectModalOpen,
    openConnectModal
  };
}
var noop = () => {
};
function ConnectButtonRenderer({
  children
}) {
  const isMounted = useIsMounted();
  const { address } = useAccount();
  const { chainId } = useAccount();
  const { chains: wagmiChains } = useConfig();
  const isCurrentChainSupported = wagmiChains.some(
    (chain2) => chain2.id === chainId
  );
  const rainbowkitChainsById = useRainbowKitChainsById();
  const authenticationStatus = useAuthenticationStatus() ?? void 0;
  const rainbowKitChain = chainId ? rainbowkitChainsById[chainId] : void 0;
  const chainName = (rainbowKitChain == null ? void 0 : rainbowKitChain.name) ?? void 0;
  const chainIconUrl = (rainbowKitChain == null ? void 0 : rainbowKitChain.iconUrl) ?? void 0;
  const chainIconBackground = (rainbowKitChain == null ? void 0 : rainbowKitChain.iconBackground) ?? void 0;
  const resolvedChainIconUrl = useAsyncImage(chainIconUrl);
  const showRecentTransactions = (0, import_react17.useContext)(ShowRecentTransactionsContext);
  const hasPendingTransactions = useRecentTransactions().some(({ status }) => status === "pending") && showRecentTransactions;
  const { showBalance } = useShowBalance();
  const computeShouldShowBalance = () => {
    if (typeof showBalance === "boolean") {
      return showBalance;
    }
    if (showBalance) {
      return normalizeResponsiveValue(showBalance)[isMobile() ? "smallScreen" : "largeScreen"];
    }
    return true;
  };
  const shouldShowBalance = computeShouldShowBalance();
  const { balance, ensAvatar, ensName } = useProfile({
    address,
    includeBalance: shouldShowBalance
  });
  const displayBalance = balance ? `${abbreviateETHBalance(Number.parseFloat(balance.formatted))} ${balance.symbol}` : void 0;
  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  const { openAccountModal } = useAccountModal();
  const { accountModalOpen, chainModalOpen, connectModalOpen } = useModalState();
  return import_react17.default.createElement(import_react17.default.Fragment, null, children({
    account: address ? {
      address,
      balanceDecimals: balance == null ? void 0 : balance.decimals,
      balanceFormatted: balance == null ? void 0 : balance.formatted,
      balanceSymbol: balance == null ? void 0 : balance.symbol,
      displayBalance,
      displayName: ensName ? formatENS(ensName) : formatAddress(address),
      ensAvatar: ensAvatar ?? void 0,
      ensName: ensName ?? void 0,
      hasPendingTransactions
    } : void 0,
    accountModalOpen,
    authenticationStatus,
    chain: chainId ? {
      hasIcon: Boolean(chainIconUrl),
      iconBackground: chainIconBackground,
      iconUrl: resolvedChainIconUrl,
      id: chainId,
      name: chainName,
      unsupported: !isCurrentChainSupported
    } : void 0,
    chainModalOpen,
    connectModalOpen,
    mounted: isMounted(),
    openAccountModal: openAccountModal ?? noop,
    openChainModal: openChainModal ?? noop,
    openConnectModal: openConnectModal ?? noop
  }));
}
ConnectButtonRenderer.displayName = "ConnectButton.Custom";
var defaultProps = {
  accountStatus: "full",
  chainStatus: { largeScreen: "full", smallScreen: "icon" },
  label: "Connect Wallet",
  showBalance: { largeScreen: true, smallScreen: false }
};
function ConnectButton({
  accountStatus = defaultProps.accountStatus,
  chainStatus = defaultProps.chainStatus,
  label = defaultProps.label,
  showBalance = defaultProps.showBalance
}) {
  const chains = useRainbowKitChains();
  const connectionStatus = useConnectionStatus();
  const { setShowBalance } = useShowBalance();
  const [ready, setReady] = (0, import_react4.useState)(false);
  const { i18n: i18n2 } = (0, import_react4.useContext)(I18nContext);
  (0, import_react4.useEffect)(() => {
    setShowBalance(showBalance);
    if (!ready)
      setReady(true);
  }, [showBalance, setShowBalance]);
  return ready ? import_react4.default.createElement(ConnectButtonRenderer, null, ({
    account,
    chain: chain2,
    mounted,
    openAccountModal,
    openChainModal,
    openConnectModal
  }) => {
    const ready2 = mounted && connectionStatus !== "loading";
    const unsupportedChain = (chain2 == null ? void 0 : chain2.unsupported) ?? false;
    return import_react4.default.createElement(
      Box,
      {
        display: "flex",
        gap: "12",
        ...!ready2 && {
          "aria-hidden": true,
          style: {
            opacity: 0,
            pointerEvents: "none",
            userSelect: "none"
          }
        }
      },
      ready2 && account && connectionStatus === "connected" ? import_react4.default.createElement(import_react4.default.Fragment, null, chain2 && (chains.length > 1 || unsupportedChain) && import_react4.default.createElement(
        Box,
        {
          alignItems: "center",
          "aria-label": "Chain Selector",
          as: "button",
          background: unsupportedChain ? "connectButtonBackgroundError" : "connectButtonBackground",
          borderRadius: "connectButton",
          boxShadow: "connectButton",
          className: touchableStyles({
            active: "shrink",
            hover: "grow"
          }),
          color: unsupportedChain ? "connectButtonTextError" : "connectButtonText",
          display: mapResponsiveValue(
            chainStatus,
            (value) => value === "none" ? "none" : "flex"
          ),
          fontFamily: "body",
          fontWeight: "bold",
          gap: "6",
          key: (
            // Force re-mount to prevent CSS transition
            unsupportedChain ? "unsupported" : "supported"
          ),
          onClick: openChainModal,
          paddingX: "10",
          paddingY: "8",
          testId: unsupportedChain ? "wrong-network-button" : "chain-button",
          transition: "default",
          type: "button"
        },
        unsupportedChain ? import_react4.default.createElement(
          Box,
          {
            alignItems: "center",
            display: "flex",
            height: "24",
            paddingX: "4"
          },
          i18n2.t("connect_wallet.wrong_network.label")
        ) : import_react4.default.createElement(Box, { alignItems: "center", display: "flex", gap: "6" }, chain2.hasIcon ? import_react4.default.createElement(
          Box,
          {
            display: mapResponsiveValue(
              chainStatus,
              (value) => value === "full" || value === "icon" ? "block" : "none"
            ),
            height: "24",
            width: "24"
          },
          import_react4.default.createElement(
            AsyncImage,
            {
              alt: chain2.name ?? "Chain icon",
              background: chain2.iconBackground,
              borderRadius: "full",
              height: "24",
              src: chain2.iconUrl,
              width: "24"
            }
          )
        ) : null, import_react4.default.createElement(
          Box,
          {
            display: mapResponsiveValue(chainStatus, (value) => {
              if (value === "icon" && !chain2.iconUrl) {
                return "block";
              }
              return value === "full" || value === "name" ? "block" : "none";
            })
          },
          chain2.name ?? chain2.id
        )),
        import_react4.default.createElement(DropdownIcon, null)
      ), !unsupportedChain && import_react4.default.createElement(
        Box,
        {
          alignItems: "center",
          as: "button",
          background: "connectButtonBackground",
          borderRadius: "connectButton",
          boxShadow: "connectButton",
          className: touchableStyles({
            active: "shrink",
            hover: "grow"
          }),
          color: "connectButtonText",
          display: "flex",
          fontFamily: "body",
          fontWeight: "bold",
          onClick: openAccountModal,
          testId: "account-button",
          transition: "default",
          type: "button"
        },
        account.displayBalance && import_react4.default.createElement(
          Box,
          {
            display: mapResponsiveValue(
              showBalance,
              (value) => value ? "block" : "none"
            ),
            padding: "8",
            paddingLeft: "12"
          },
          account.displayBalance
        ),
        import_react4.default.createElement(
          Box,
          {
            background: normalizeResponsiveValue(showBalance)[isMobile() ? "smallScreen" : "largeScreen"] ? "connectButtonInnerBackground" : "connectButtonBackground",
            borderColor: "connectButtonBackground",
            borderRadius: "connectButton",
            borderStyle: "solid",
            borderWidth: "2",
            color: "connectButtonText",
            fontFamily: "body",
            fontWeight: "bold",
            paddingX: "8",
            paddingY: "6",
            transition: "default"
          },
          import_react4.default.createElement(
            Box,
            {
              alignItems: "center",
              display: "flex",
              gap: "6",
              height: "24"
            },
            import_react4.default.createElement(
              Box,
              {
                display: mapResponsiveValue(
                  accountStatus,
                  (value) => value === "full" || value === "avatar" ? "block" : "none"
                )
              },
              import_react4.default.createElement(
                Avatar,
                {
                  address: account.address,
                  imageUrl: account.ensAvatar,
                  loading: account.hasPendingTransactions,
                  size: 24
                }
              )
            ),
            import_react4.default.createElement(Box, { alignItems: "center", display: "flex", gap: "6" }, import_react4.default.createElement(
              Box,
              {
                display: mapResponsiveValue(
                  accountStatus,
                  (value) => value === "full" || value === "address" ? "block" : "none"
                )
              },
              account.displayName
            ), import_react4.default.createElement(DropdownIcon, null))
          )
        )
      )) : import_react4.default.createElement(
        Box,
        {
          as: "button",
          background: "accentColor",
          borderRadius: "connectButton",
          boxShadow: "connectButton",
          className: touchableStyles({
            active: "shrink",
            hover: "grow"
          }),
          color: "accentColorForeground",
          fontFamily: "body",
          fontWeight: "bold",
          height: "40",
          key: "connect",
          onClick: openConnectModal,
          paddingX: "14",
          testId: "connect-button",
          transition: "default",
          type: "button"
        },
        mounted && label === "Connect Wallet" ? i18n2.t("connect_wallet.label") : label
      )
    );
  }) : import_react4.default.createElement(import_react4.default.Fragment, null);
}
ConnectButton.__defaultProps = defaultProps;
ConnectButton.Custom = ConnectButtonRenderer;
var border = "_1y2lnfi0";
var maxWidth = "_1y2lnfi1";
function WalletButtonRenderer({
  // Wallet is the same as `connector.id` which is injected into
  // wagmi connectors
  wallet = "rainbow",
  children
}) {
  const isMounted = useIsMounted();
  const { openConnectModal } = useConnectModal();
  const { connectModalOpen } = useModalState();
  const { connector, setConnector } = (0, import_react78.useContext)(WalletButtonContext);
  const [firstConnector] = useWalletConnectors().filter((wallet2) => wallet2.isRainbowKitConnector).filter((_wallet) => _wallet.id.toLowerCase() === wallet.toLowerCase()).sort((a, b) => a.groupIndex - b.groupIndex);
  if (!firstConnector) {
    throw new Error("Connector not found");
  }
  const connectionStatus = useConnectionStatus();
  const [loading, setLoading] = (0, import_react78.useState)(false);
  const [isError, setIsError] = (0, import_react78.useState)(false);
  const mobile = isMobile();
  (0, import_react78.useEffect)(() => {
    if (!connectModalOpen && connector)
      setConnector(null);
  }, [connectModalOpen, connector, setConnector]);
  const { isConnected, isConnecting } = useAccount();
  useAccountEffect({
    onConnect: () => {
      if (isError)
        setIsError(false);
    },
    onDisconnect: clearLatestWalletId
  });
  const isLastWalletIdConnected = (0, import_react78.useMemo)(() => {
    const lastWalletId = getLatestWalletId();
    if (!lastWalletId || !(firstConnector == null ? void 0 : firstConnector.id)) {
      return false;
    }
    if (!isConnected)
      return false;
    return lastWalletId === (firstConnector == null ? void 0 : firstConnector.id);
  }, [isConnected, firstConnector]);
  const connectWallet = async () => {
    var _a;
    try {
      setLoading(true);
      if (isError)
        setIsError(false);
      await ((_a = firstConnector == null ? void 0 : firstConnector.connect) == null ? void 0 : _a.call(firstConnector));
    } catch {
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };
  const isStatusLoading = connectionStatus === "loading";
  const ready = !isConnecting && !!openConnectModal && firstConnector && !isStatusLoading;
  const isNotSupported = !(firstConnector == null ? void 0 : firstConnector.installed) || !(firstConnector == null ? void 0 : firstConnector.ready);
  return import_react78.default.createElement(import_react78.default.Fragment, null, children({
    error: isError,
    loading,
    connected: isLastWalletIdConnected,
    ready,
    mounted: isMounted(),
    connector: firstConnector,
    connect: async () => {
      addLatestWalletId((firstConnector == null ? void 0 : firstConnector.id) || "");
      if (mobile || isNotSupported) {
        openConnectModal == null ? void 0 : openConnectModal();
        setConnector(firstConnector);
        return;
      }
      await connectWallet();
    }
  }));
}
var WalletButton2 = ({ wallet }) => {
  return import_react77.default.createElement(WalletButtonRenderer, { wallet }, ({ ready, connect, connected, mounted, connector, loading }) => {
    const isDisabled = !ready || loading;
    const { i18n: i18n2 } = (0, import_react77.useContext)(I18nContext);
    const connectorName = (connector == null ? void 0 : connector.name) || "";
    if (!mounted)
      return;
    return import_react77.default.createElement(
      Box,
      {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        disabled: isDisabled,
        pointerEvents: isDisabled ? "none" : "all"
      },
      import_react77.default.createElement(
        Box,
        {
          as: "button",
          borderRadius: "menuButton",
          borderStyle: "solid",
          borderWidth: "1",
          className: [
            maxWidth,
            border,
            touchableStyles({
              active: "shrink",
              hover: "grow"
            })
          ],
          minHeight: "44",
          onClick: connect,
          disabled: !ready || loading,
          padding: "6",
          style: { willChange: "transform" },
          testId: `wallet-button-${(connector == null ? void 0 : connector.id) || ""}`,
          transition: "default",
          width: "full",
          background: "connectButtonBackground"
        },
        import_react77.default.createElement(
          Box,
          {
            color: "modalText",
            fontFamily: "body",
            fontSize: "16",
            fontWeight: "bold",
            transition: "default",
            display: "flex",
            alignItems: "center"
          },
          import_react77.default.createElement(
            Box,
            {
              alignItems: "center",
              display: "flex",
              flexDirection: "row",
              gap: "12",
              paddingRight: "6"
            },
            import_react77.default.createElement(Box, null, loading ? import_react77.default.createElement(SpinnerIcon, null) : import_react77.default.createElement(
              AsyncImage,
              {
                background: connector == null ? void 0 : connector.iconBackground,
                borderRadius: "6",
                height: "28",
                src: connector == null ? void 0 : connector.iconUrl,
                width: "28"
              }
            )),
            import_react77.default.createElement(
              Box,
              {
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                color: "modalText"
              },
              import_react77.default.createElement(Box, { testId: `wallet-button-label-${(connector == null ? void 0 : connector.id) || ""}` }, loading ? i18n2.t("connect.status.connecting", {
                wallet: connectorName
              }) : connectorName)
            ),
            connected ? import_react77.default.createElement(
              Box,
              {
                background: "connectionIndicator",
                borderColor: "selectedOptionBorder",
                borderRadius: "full",
                borderStyle: "solid",
                borderWidth: "1",
                height: "8",
                width: "8"
              }
            ) : null
          )
        )
      )
    );
  });
};
WalletButton2.Custom = WalletButtonRenderer;
var computeWalletConnectMetaData = ({
  appName,
  appDescription,
  appUrl,
  appIcon
}) => {
  return {
    name: appName,
    description: appDescription ?? appName,
    url: appUrl ?? (typeof window !== "undefined" ? window.location.href : ""),
    icons: [...appIcon ? [appIcon] : []]
  };
};
function omitUndefinedValues(obj) {
  return Object.fromEntries(
    //@ts-ignore
    Object.entries(obj).filter(([_key, value]) => value !== void 0)
  );
}
function uniqueBy(items, key) {
  const filtered = [];
  for (const item of items) {
    if (!filtered.some((x) => x[key] === item[key])) {
      filtered.push(item);
    }
  }
  return filtered;
}
var connectorsForWallets = (walletList, {
  projectId,
  walletConnectParameters,
  appName,
  appDescription,
  appUrl,
  appIcon
}) => {
  if (!walletList.length) {
    throw new Error("No wallet list was provided");
  }
  for (const { wallets, groupName } of walletList) {
    if (!wallets.length) {
      throw new Error(`No wallets provided for group: ${groupName}`);
    }
  }
  let index2 = -1;
  const connectors = [];
  const visibleWallets = [];
  const potentiallyHiddenWallets = [];
  const walletConnectMetaData = computeWalletConnectMetaData({
    appName,
    appDescription,
    appUrl,
    appIcon
  });
  for (const [groupIndex, { groupName, wallets }] of walletList.entries()) {
    for (const createWallet of wallets) {
      index2++;
      const wallet = createWallet({
        projectId,
        appName,
        appIcon,
        // `option` is being used only for `walletConnectWallet` wallet
        options: {
          metadata: walletConnectMetaData,
          ...walletConnectParameters
        },
        // Every other wallet that supports walletConnect flow and is not
        // `walletConnectWallet` wallet will have `walletConnectParameters` property
        walletConnectParameters: {
          metadata: walletConnectMetaData,
          ...walletConnectParameters
        }
      });
      if ((wallet == null ? void 0 : wallet.iconAccent) && !isHexString(wallet == null ? void 0 : wallet.iconAccent)) {
        throw new Error(
          `Property \`iconAccent\` is not a hex value for wallet: ${wallet.name}`
        );
      }
      const walletListItem = {
        ...wallet,
        groupIndex: groupIndex + 1,
        groupName,
        index: index2
      };
      if (typeof wallet.hidden === "function") {
        potentiallyHiddenWallets.push(walletListItem);
      } else {
        visibleWallets.push(walletListItem);
      }
    }
  }
  const walletListItems = uniqueBy(
    [...visibleWallets, ...potentiallyHiddenWallets],
    "id"
  );
  for (const {
    createConnector: createConnector5,
    groupIndex,
    groupName,
    hidden,
    ...walletMeta
  } of walletListItems) {
    if (typeof hidden === "function") {
      const isHidden = hidden();
      if (isHidden) {
        continue;
      }
    }
    const walletMetaData = (additionalRkParams) => {
      return {
        rkDetails: omitUndefinedValues({
          ...walletMeta,
          groupIndex,
          groupName,
          isRainbowKitConnector: true,
          // These additional params will be used in rainbowkit react tree to
          // merge `walletConnectWallet` and `walletConnect` connector from wagmi with
          // showQrModal: true. This way we can let the user choose if they want to
          // connect via QR code or open the official walletConnect modal instead
          ...additionalRkParams ? additionalRkParams : {}
        })
      };
    };
    const isWalletConnectConnector = walletMeta.id === "walletConnect";
    if (isWalletConnectConnector) {
      connectors.push(
        createConnector5(
          walletMetaData({
            isWalletConnectModalConnector: true,
            showQrModal: true
          })
        )
      );
    }
    const connector = createConnector5(walletMetaData());
    connectors.push(connector);
  }
  return connectors;
};
var walletConnectInstances = /* @__PURE__ */ new Map();
var getOrCreateWalletConnectInstance = ({
  projectId,
  walletConnectParameters,
  rkDetailsShowQrModal
}) => {
  let config = {
    ...walletConnectParameters ? walletConnectParameters : {},
    projectId,
    showQrModal: false
    // Required. Otherwise WalletConnect modal (Web3Modal) will popup during time of connection for a wallet
  };
  if (rkDetailsShowQrModal) {
    config = { ...config, showQrModal: true };
  }
  const serializedConfig = JSON.stringify(config);
  const sharedWalletConnector = walletConnectInstances.get(serializedConfig);
  if (sharedWalletConnector) {
    return sharedWalletConnector;
  }
  const newWalletConnectInstance = walletConnect(config);
  walletConnectInstances.set(serializedConfig, newWalletConnectInstance);
  return newWalletConnectInstance;
};
function createWalletConnectConnector({
  projectId,
  walletDetails,
  walletConnectParameters
}) {
  return createConnector((config) => ({
    ...getOrCreateWalletConnectInstance({
      projectId,
      walletConnectParameters,
      // Used in `connectorsForWallets` to add another
      // walletConnect wallet into rainbowkit with modal popup option
      rkDetailsShowQrModal: walletDetails.rkDetails.showQrModal
    })(config),
    ...walletDetails
  }));
}
function getWalletConnectConnector({
  projectId,
  walletConnectParameters
}) {
  const exampleProjectId = "21fef48091f12692cad574a6f7753643";
  if (!projectId || projectId === "") {
    throw new Error(
      "No projectId found. Every dApp must now provide a WalletConnect Cloud projectId to enable WalletConnect v2 https://www.rainbowkit.com/docs/installation#configure"
    );
  }
  if (projectId === "YOUR_PROJECT_ID") {
    projectId = exampleProjectId;
  }
  return (walletDetails) => createWalletConnectConnector({
    projectId,
    walletDetails,
    walletConnectParameters
  });
}
function getExplicitInjectedProvider(flag) {
  const _window = typeof window !== "undefined" ? window : void 0;
  if (typeof _window === "undefined" || typeof _window.ethereum === "undefined")
    return;
  const providers = _window.ethereum.providers;
  return providers ? providers.find((provider) => provider[flag]) : _window.ethereum[flag] ? _window.ethereum : void 0;
}
function getWindowProviderNamespace(namespace) {
  const providerSearch = (provider, namespace2) => {
    const [property, ...path2] = namespace2.split(".");
    const _provider = provider[property];
    if (_provider) {
      if (path2.length === 0)
        return _provider;
      return providerSearch(_provider, path2.join("."));
    }
  };
  if (typeof window !== "undefined")
    return providerSearch(window, namespace);
}
function hasInjectedProvider({
  flag,
  namespace
}) {
  if (namespace && typeof getWindowProviderNamespace(namespace) !== "undefined")
    return true;
  if (flag && typeof getExplicitInjectedProvider(flag) !== "undefined")
    return true;
  return false;
}
function getInjectedProvider({
  flag,
  namespace
}) {
  var _a;
  const _window = typeof window !== "undefined" ? window : void 0;
  if (typeof _window === "undefined")
    return;
  if (namespace) {
    const windowProvider = getWindowProviderNamespace(namespace);
    if (windowProvider)
      return windowProvider;
  }
  const providers = (_a = _window.ethereum) == null ? void 0 : _a.providers;
  if (flag) {
    const provider = getExplicitInjectedProvider(flag);
    if (provider)
      return provider;
  }
  if (typeof providers !== "undefined" && providers.length > 0)
    return providers[0];
  return _window.ethereum;
}
function createInjectedConnector(provider) {
  return (walletDetails) => {
    const injectedConfig = provider ? {
      target: () => ({
        id: walletDetails.rkDetails.id,
        name: walletDetails.rkDetails.name,
        provider
      })
    } : {};
    return createConnector((config) => ({
      // Spread the injectedConfig object, which may be empty or contain the target function
      ...injected(injectedConfig)(config),
      ...walletDetails
    }));
  };
}
function getInjectedConnector({
  flag,
  namespace,
  target
}) {
  const provider = target ? target : getInjectedProvider({ flag, namespace });
  return createInjectedConnector(provider);
}
var coinbaseWallet2 = ({ appName, appIcon }) => {
  const getUri = (uri) => uri;
  const ios = isIOS();
  return {
    id: "coinbase",
    name: "Coinbase Wallet",
    shortName: "Coinbase",
    rdns: "com.coinbase.wallet",
    iconUrl: async () => (await import("./coinbaseWallet-WWX6LF36-QPR7BZ7H.js")).default,
    iconAccent: "#2c5ff6",
    iconBackground: "#2c5ff6",
    // If the coinbase wallet browser extension is not installed, a popup will appear
    // prompting the user to connect or create a wallet via passkey. This means if you either have
    // or don't have the coinbase wallet browser extension installed it'll do some action anyways
    installed: true,
    downloadUrls: {
      android: "https://play.google.com/store/apps/details?id=org.toshi",
      ios: "https://apps.apple.com/us/app/coinbase-wallet-store-crypto/id1278383455",
      mobile: "https://coinbase.com/wallet/downloads",
      qrCode: "https://coinbase-wallet.onelink.me/q5Sx/fdb9b250",
      chrome: "https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad",
      browserExtension: "https://coinbase.com/wallet"
    },
    ...ios ? {} : {
      qrCode: {
        getUri,
        instructions: {
          learnMoreUrl: "https://coinbase.com/wallet/articles/getting-started-mobile",
          steps: [
            {
              description: "wallet_connectors.coinbase.qr_code.step1.description",
              step: "install",
              title: "wallet_connectors.coinbase.qr_code.step1.title"
            },
            {
              description: "wallet_connectors.coinbase.qr_code.step2.description",
              step: "create",
              title: "wallet_connectors.coinbase.qr_code.step2.title"
            },
            {
              description: "wallet_connectors.coinbase.qr_code.step3.description",
              step: "scan",
              title: "wallet_connectors.coinbase.qr_code.step3.title"
            }
          ]
        }
      },
      extension: {
        instructions: {
          learnMoreUrl: "https://coinbase.com/wallet/articles/getting-started-extension",
          steps: [
            {
              description: "wallet_connectors.coinbase.extension.step1.description",
              step: "install",
              title: "wallet_connectors.coinbase.extension.step1.title"
            },
            {
              description: "wallet_connectors.coinbase.extension.step2.description",
              step: "create",
              title: "wallet_connectors.coinbase.extension.step2.title"
            },
            {
              description: "wallet_connectors.coinbase.extension.step3.description",
              step: "refresh",
              title: "wallet_connectors.coinbase.extension.step3.title"
            }
          ]
        }
      }
    },
    createConnector: (walletDetails) => {
      const connector = coinbaseWallet({
        appName,
        appLogoUrl: appIcon,
        preference: coinbaseWallet2.preference
      });
      return createConnector((config) => ({
        ...connector(config),
        ...walletDetails
      }));
    }
  };
};
function isMetaMask(ethereum) {
  if (!(ethereum == null ? void 0 : ethereum.isMetaMask))
    return false;
  if (ethereum.isBraveWallet && !ethereum._events && !ethereum._state)
    return false;
  if (ethereum.isApexWallet)
    return false;
  if (ethereum.isAvalanche)
    return false;
  if (ethereum.isBackpack)
    return false;
  if (ethereum.isBifrost)
    return false;
  if (ethereum.isBitKeep)
    return false;
  if (ethereum.isBitski)
    return false;
  if (ethereum.isBlockWallet)
    return false;
  if (ethereum.isCoinbaseWallet)
    return false;
  if (ethereum.isDawn)
    return false;
  if (ethereum.isEnkrypt)
    return false;
  if (ethereum.isExodus)
    return false;
  if (ethereum.isFrame)
    return false;
  if (ethereum.isFrontier)
    return false;
  if (ethereum.isGamestop)
    return false;
  if (ethereum.isHyperPay)
    return false;
  if (ethereum.isImToken)
    return false;
  if (ethereum.isKuCoinWallet)
    return false;
  if (ethereum.isMathWallet)
    return false;
  if (ethereum.isNestWallet)
    return false;
  if (ethereum.isOkxWallet || ethereum.isOKExWallet)
    return false;
  if (ethereum.isOneInchIOSWallet || ethereum.isOneInchAndroidWallet)
    return false;
  if (ethereum.isOpera)
    return false;
  if (ethereum.isPhantom)
    return false;
  if (ethereum.isPortal)
    return false;
  if (ethereum.isRabby)
    return false;
  if (ethereum.isRainbow)
    return false;
  if (ethereum.isStatus)
    return false;
  if (ethereum.isTalisman)
    return false;
  if (ethereum.isTally)
    return false;
  if (ethereum.isTokenPocket)
    return false;
  if (ethereum.isTokenary)
    return false;
  if (ethereum.isTrust || ethereum.isTrustWallet)
    return false;
  if (ethereum.isXDEFI)
    return false;
  if (ethereum.isZeal)
    return false;
  if (ethereum.isZerion)
    return false;
  if (ethereum.__seif)
    return false;
  return true;
}
var metaMaskWallet = ({
  projectId,
  walletConnectParameters
}) => {
  var _a, _b;
  const isMetaMaskInjected = hasInjectedProvider({ flag: "isMetaMask" });
  const shouldUseWalletConnect = !isMetaMaskInjected;
  const getUri = (uri) => {
    return isAndroid() ? uri : isIOS() ? (
      // currently broken in MetaMask v6.5.0 https://github.com/MetaMask/metamask-mobile/issues/6457
      `metamask://wc?uri=${encodeURIComponent(uri)}`
    ) : `https://metamask.app.link/wc?uri=${encodeURIComponent(uri)}`;
  };
  return {
    id: "metaMask",
    name: "MetaMask",
    rdns: "io.metamask",
    iconUrl: async () => (await import("./metaMaskWallet-YFHEHW7V-YA4KOQQN.js")).default,
    iconAccent: "#f6851a",
    iconBackground: "#fff",
    installed: !shouldUseWalletConnect ? isMetaMaskInjected : void 0,
    downloadUrls: {
      android: "https://play.google.com/store/apps/details?id=io.metamask",
      ios: "https://apps.apple.com/us/app/metamask/id1438144202",
      mobile: "https://metamask.io/download",
      qrCode: "https://metamask.io/download",
      chrome: "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
      edge: "https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm",
      firefox: "https://addons.mozilla.org/firefox/addon/ether-metamask",
      opera: "https://addons.opera.com/extensions/details/metamask-10",
      browserExtension: "https://metamask.io/download"
    },
    mobile: {
      getUri: shouldUseWalletConnect ? getUri : void 0
    },
    qrCode: shouldUseWalletConnect ? {
      getUri,
      instructions: {
        learnMoreUrl: "https://metamask.io/faqs/",
        steps: [
          {
            description: "wallet_connectors.metamask.qr_code.step1.description",
            step: "install",
            title: "wallet_connectors.metamask.qr_code.step1.title"
          },
          {
            description: "wallet_connectors.metamask.qr_code.step2.description",
            step: "create",
            title: "wallet_connectors.metamask.qr_code.step2.title"
          },
          {
            description: "wallet_connectors.metamask.qr_code.step3.description",
            step: "refresh",
            title: "wallet_connectors.metamask.qr_code.step3.title"
          }
        ]
      }
    } : void 0,
    extension: {
      instructions: {
        learnMoreUrl: "https://metamask.io/faqs/",
        steps: [
          {
            description: "wallet_connectors.metamask.extension.step1.description",
            step: "install",
            title: "wallet_connectors.metamask.extension.step1.title"
          },
          {
            description: "wallet_connectors.metamask.extension.step2.description",
            step: "create",
            title: "wallet_connectors.metamask.extension.step2.title"
          },
          {
            description: "wallet_connectors.metamask.extension.step3.description",
            step: "refresh",
            title: "wallet_connectors.metamask.extension.step3.title"
          }
        ]
      }
    },
    createConnector: shouldUseWalletConnect ? getWalletConnectConnector({
      projectId,
      walletConnectParameters
    }) : getInjectedConnector({
      target: typeof window !== "undefined" ? ((_b = (_a = window.ethereum) == null ? void 0 : _a.providers) == null ? void 0 : _b.find(
        isMetaMask
      )) ?? window.ethereum : void 0
    })
  };
};
var rainbowWallet = ({
  projectId,
  walletConnectParameters
}) => {
  const isRainbowInjected = hasInjectedProvider({ flag: "isRainbow" });
  const shouldUseWalletConnect = !isRainbowInjected;
  const getUri = (uri) => {
    return isAndroid() ? uri : isIOS() ? `rainbow://wc?uri=${encodeURIComponent(uri)}&connector=rainbowkit` : `https://rnbwapp.com/wc?uri=${encodeURIComponent(
      uri
    )}&connector=rainbowkit`;
  };
  return {
    id: "rainbow",
    name: "Rainbow",
    rdns: "me.rainbow",
    iconUrl: async () => (await import("./rainbowWallet-2SR6TVBF-VCZT2CNF.js")).default,
    iconBackground: "#0c2f78",
    installed: !shouldUseWalletConnect ? isRainbowInjected : void 0,
    downloadUrls: {
      android: "https://play.google.com/store/apps/details?id=me.rainbow&referrer=utm_source%3Drainbowkit&utm_source=rainbowkit",
      ios: "https://apps.apple.com/app/apple-store/id1457119021?pt=119997837&ct=rainbowkit&mt=8",
      mobile: "https://rainbow.download?utm_source=rainbowkit",
      qrCode: "https://rainbow.download?utm_source=rainbowkit&utm_medium=qrcode",
      browserExtension: "https://rainbow.me/extension?utm_source=rainbowkit"
    },
    mobile: { getUri: shouldUseWalletConnect ? getUri : void 0 },
    qrCode: shouldUseWalletConnect ? {
      getUri,
      instructions: {
        learnMoreUrl: "https://learn.rainbow.me/connect-to-a-website-or-app?utm_source=rainbowkit&utm_medium=connector&utm_campaign=learnmore",
        steps: [
          {
            description: "wallet_connectors.rainbow.qr_code.step1.description",
            step: "install",
            title: "wallet_connectors.rainbow.qr_code.step1.title"
          },
          {
            description: "wallet_connectors.rainbow.qr_code.step2.description",
            step: "create",
            title: "wallet_connectors.rainbow.qr_code.step2.title"
          },
          {
            description: "wallet_connectors.rainbow.qr_code.step3.description",
            step: "scan",
            title: "wallet_connectors.rainbow.qr_code.step3.title"
          }
        ]
      }
    } : void 0,
    createConnector: shouldUseWalletConnect ? getWalletConnectConnector({
      projectId,
      walletConnectParameters
    }) : getInjectedConnector({ flag: "isRainbow" })
  };
};
var safeWallet = () => ({
  id: "safe",
  name: "Safe",
  iconAccent: "#12ff80",
  iconBackground: "#fff",
  iconUrl: async () => (await import("./safeWallet-VUYZPLY4-M2445BK3.js")).default,
  installed: (
    // Only allowed in iframe context
    // borrowed from wagmi safe connector
    !(typeof window === "undefined") && (window == null ? void 0 : window.parent) !== window
  ),
  downloadUrls: {
    // We're opting not to provide a download prompt if the application is not
    // already running as a Safe App within the context of the Safe browser,
    // since it's unlikely to be a desired behavior for users.
  },
  createConnector: (walletDetails) => {
    return createConnector((config) => ({
      ...safe()(config),
      ...walletDetails
    }));
  }
});
var walletConnectWallet = ({
  projectId,
  options
}) => {
  const getUri = (uri) => uri;
  return {
    id: "walletConnect",
    name: "WalletConnect",
    installed: void 0,
    iconUrl: async () => (await import("./walletConnectWallet-FNSU4KNU-7DMS4U5G.js")).default,
    iconBackground: "#3b99fc",
    qrCode: { getUri },
    createConnector: getWalletConnectConnector({
      projectId,
      walletConnectParameters: options
    })
  };
};
var createDefaultTransports = (chains) => {
  const transportsObject = chains.reduce((acc, chain2) => {
    const key = chain2.id;
    acc[key] = http();
    return acc;
  }, {});
  return transportsObject;
};
var getDefaultConfig = ({
  appName,
  appDescription,
  appUrl,
  appIcon,
  wallets,
  projectId,
  ...wagmiParameters
}) => {
  const { transports, chains, ...restWagmiParameters } = wagmiParameters;
  const metadata = computeWalletConnectMetaData({
    appName,
    appDescription,
    appUrl,
    appIcon
  });
  const connectors = connectorsForWallets(
    wallets || [
      {
        groupName: "Popular",
        wallets: [
          safeWallet,
          rainbowWallet,
          coinbaseWallet2,
          metaMaskWallet,
          walletConnectWallet
        ]
      }
    ],
    {
      projectId,
      appName,
      appDescription,
      appUrl,
      appIcon,
      walletConnectParameters: { metadata }
    }
  );
  return createConfig({
    connectors,
    chains,
    transports: transports || createDefaultTransports(chains),
    ...restWagmiParameters
  });
};
function getDefaultWallets(parameters) {
  const wallets = [
    {
      groupName: "Popular",
      wallets: [
        safeWallet,
        rainbowWallet,
        coinbaseWallet2,
        metaMaskWallet,
        walletConnectWallet
      ]
    }
  ];
  if (parameters) {
    return {
      connectors: connectorsForWallets(wallets, parameters),
      wallets
    };
  }
  return {
    wallets
  };
}
function useAddRecentTransaction() {
  const store = useTransactionStore();
  const { address } = useAccount();
  const chainId = useChainId();
  return (0, import_react79.useCallback)(
    (transaction) => {
      if (!address || !chainId) {
        throw new Error("No address or chain ID found");
      }
      store.addTransaction(address, chainId, transaction);
    },
    [store, address, chainId]
  );
}
var __private__ = {
  DesktopOptions,
  dialogContent,
  dialogContentMobile,
  MobileOptions
};
export {
  ConnectButton,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
  WalletButton2 as WalletButton,
  __private__,
  connectorsForWallets,
  createAuthenticationAdapter,
  cssObjectFromTheme,
  cssStringFromTheme,
  darkTheme,
  getDefaultConfig,
  getDefaultWallets,
  getWalletConnectConnector,
  lightTheme,
  midnightTheme,
  useAccountModal,
  useAddRecentTransaction,
  useChainModal,
  useConnectModal
};
/*! Bundled license information:

@noble/curves/esm/abstract/bls.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/tower.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/bls12-381.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@scure/base/lib/esm/index.js:
  (*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@scure/bip32/lib/esm/index.js:
  (*! scure-bip32 - MIT License (c) 2022 Patricio Palladino, Paul Miller (paulmillr.com) *)

@scure/bip39/esm/index.js:
  (*! scure-bip39 - MIT License (c) 2022 Patricio Palladino, Paul Miller (paulmillr.com) *)

@noble/curves/esm/p256.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
//# sourceMappingURL=@rainbow-me_rainbowkit.js.map
