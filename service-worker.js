/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["/2020/11/30/hexo-note/index.html","269b54ae93e5ceaad546039071c09102"],["/2020/12/06/ticktick-startup/index.html","a5dc2c58c40dedeef557b948abc452ba"],["/2021/03/10/data-protection-key/index.html","f21058a7b326f5b2b612e7c994b3e002"],["/2021/04/05/aspnetcore-chinese-encoding/index.html","47c3b18fb21af7db5b35c397e5c201e8"],["/2021/05/12/aspnetcore-model-binding/index.html","a36b49c9227b3ca45517d7da60ae3527"],["/2021/06/20/security-risk-of-autofill/index.html","db3661a53a9c7b3672050bf836ec5a7c"],["/2021/08/23/fiddler/index.html","4664bc3f89f027ba53601c475f7cf26d"],["/2022/07/19/negotiation/index.html","11be2096512b89b10657f8554c828299"],["/2022/07/22/targetframeworks-setting/index.html","1fad2ca58c32d8e1c13fb7293944940a"],["/2022/10/26/leetcode-array/index.html","75288fc6720509ffb061b6a22468ba35"],["/2022/10/27/leetcode-array-2/index.html","2fd3f198ce2fc752cc8801d8972b21be"],["/2022/10/28/leetcode-linked-list/index.html","2ca8a0d9f4603ede4881de9a9ca96058"],["/2022/10/29/leetcode-linked-list-2/index.html","cb4b1a6145b2a627dfcf9e9921f65e22"],["/2022/10/31/leetcode-hashtable/index.html","6fc15be4d764bfc5ce335a7903cd7f95"],["/2022/11/01/leetcode-hashtable-2/index.html","737a1bc381574412ee62bff1e0832ba5"],["/2023/06/04/penetration-test/index.html","43e9d5e5d9f4a4be239239a0814e1d1f"],["/404.html","0dc06635be4c1a5c2bb35b0b327fba62"],["/about/index.html","996f4c7989d11c4d1c3f92512a7384d2"],["/archives/2020/11/index.html","568d3d7953ff62b36bf6dd287b942ed7"],["/archives/2020/12/index.html","e55428e0a79a2155cca90333997a661c"],["/archives/2020/index.html","3858abe6af78d67ec921a37836dbaba7"],["/archives/2021/03/index.html","c00ee46dc160c3df683e5c7b1d4fcd54"],["/archives/2021/04/index.html","a823c4c7302f318958c6f9c4a175d42c"],["/archives/2021/05/index.html","eca190f55735f018f28d25facca5b35a"],["/archives/2021/06/index.html","f6738296679fde47af4ec83864cbdbc8"],["/archives/2021/08/index.html","88f7ee37db5f9b2efbe76841dabce5e3"],["/archives/2021/index.html","26f8df987569a2c2a866cbdb0e25d149"],["/archives/2022/07/index.html","6302cd9842dd1ca356162127abbe2b78"],["/archives/2022/10/index.html","9cc8748bbd0147ac48692c89992d6b45"],["/archives/2022/11/index.html","b64accf3908b4e9165d93e21f5203853"],["/archives/2022/index.html","78c5b8c65b611e8dd179dc80f38eae38"],["/archives/2023/06/index.html","db8faa05360aa2af6ad40a3671246863"],["/archives/2023/index.html","321412fc04401e67f3173864b354325e"],["/archives/index.html","f9d51201037e107c390af29ecc83721c"],["/archives/page/2/index.html","24686e4a494bc3fcb6fb1c43103b572f"],["/categories/ASP-NET-Core/index.html","f782893dbee2329506c4be23742516f0"],["/categories/Blog/Hexo/index.html","76cf1abae2c05170000ad326b052463d"],["/categories/Blog/index.html","2cb3c294576e342091d95ed645664176"],["/categories/DevTools/index.html","705d7be1b7605b977e1ded323a67bae7"],["/categories/LeetCode/index.html","7f7b6ba9c4c3f05ba0f0eb1c431d25f5"],["/categories/Relationship/index.html","ebe823f2e6280cf9ed795be2ad411840"],["/categories/Security/index.html","1436b530fbca9ccf8ab871bfb37ccd78"],["/categories/ToDoList/TickTick/index.html","8b62aeab2d01b5381b32794f39938c63"],["/categories/ToDoList/index.html","14c885bb6d114ee904bc4bf26ebd7333"],["/categories/index.html","e72b486aed928436d53427fc7b957c18"],["/css/index.css","d78c1ac0f7025c22c65dd58e51375feb"],["/css/var.css","d41d8cd98f00b204e9800998ecf8427e"],["/image/1p9juay.png","51bdaa137e0316616dff95b48f9bf26e"],["/image/1s5M74Z.png","4955c8ae6d110d31d96dc955e057acc6"],["/image/22sLdkA.png","4418fa3eb4459141572a2e8d8dafa009"],["/image/2D17zLa.png","27376eb64aa481c46771e6099f6f9249"],["/image/2HtjTOX.png","67b48edfeb894f52fa21ed711c6508b1"],["/image/2IHwCj5.png","a6292c4df0e6797ef786baf573daac60"],["/image/34SMiCa.png","7d5e23fc80ac0f1229472ab611553df6"],["/image/3mcptNJ.png","c4e5a82e46a048e488e574b386883daf"],["/image/3ozLMgr.jpg","35941db6a295e4a43c92929d704acf8d"],["/image/3vEzlK2.png","72a325c2f46859b8d8462d97ee5c6b79"],["/image/48rFEDp.png","86655bb088b4746fb037f263ff5eb1e4"],["/image/4mGvj6p.png","353dd9398c0172274ab4e199ec419448"],["/image/4sJrxYr.png","bd97abf38f1b452e240057a426368275"],["/image/6QZkv1C.png","5f44a6c26dbe5a7ac7ee4e342f393348"],["/image/753PDvM.jpg","c2c71c765ca3130f064369587adcff80"],["/image/77MuXJH.jpg","f01fcd54b2ab05fa0743d2dac2c5bfb5"],["/image/7lbRVWX.jpg","e4e8fecf84940d8454842ac858258474"],["/image/80gy0XZ.png","f48f9909b5c0e3b11c92571a4bc22ce9"],["/image/91vlvhY.png","ea23f2c96ced374242fa6b1e206a424a"],["/image/BAzIWMC.png","79e247d7d1b526205b09518f234a2ad6"],["/image/BS10ym5.png","ea25aed0a7cb0c2b8583044229fc39c6"],["/image/C7qDfxV.png","e061c45ec493eda7c2acd9c8fe59550a"],["/image/CJk6e2Q.png","982bf5c9ae799c330962b92602614a88"],["/image/COFpcwG.png","e0b1522e9f3ac63a36f7ca813bfcad68"],["/image/CRzLCcT.png","e3a33fb9a4fcfcbf152ee0ad8b992d85"],["/image/CbaYuJo.png","da6a3a9d4fe0451e8e3c8e4cf0c6693f"],["/image/D3Is1fC.jpg","f6acb0565f47b199bd8853075ce97b0b"],["/image/DrhGPLX.png","3f8dd39070b672b80f9f23b7978b0d6b"],["/image/Du5DHSY.png","0cb0687fa7538641201a0ac9a91c0d7b"],["/image/DzRkKI7.png","381ec2b28ead08c32116c374791210b9"],["/image/EQx1teR.png","9c96ac6ce0d21efd0a24638acc335dbf"],["/image/En1dssX.jpg","43afa63a81d809724dcacbe3ae94d4d5"],["/image/EwN1ni6.png","1cc5cb0c2abf0f2c8a10de17bdbf58c9"],["/image/Fxcz1hP.png","9f6c425cf8a902a09c7cfc5ff53a5f5b"],["/image/GNmKUGi.png","ea3fefcf92a9fa8d5f1e9d92ac47594f"],["/image/GcX1MKD.png","4c7c7d2c1efed4f092605800e9a7ba37"],["/image/GgbBBxz.png","49f9b942f2e6f15189f43e8e6e64798e"],["/image/Gvkitkh.png","d4300163d1bc624b66f5cd16ac537f8f"],["/image/GwJFByj.png","ea25aed0a7cb0c2b8583044229fc39c6"],["/image/HHgTNpc.jpg","3348595b9b2a3e503798eb20722b46b8"],["/image/Hpnzwvq.png","4780896a46300943b1a87ec06495e193"],["/image/IHyd7Eh.png","746bebe71becb99fc8e9f6bb32b63c2e"],["/image/J1exQWd.png","56c8c78933aa648eb554b96e3f34d850"],["/image/KFyOKte.png","aa31c7aa0606b94ab9cd4ff7bbb8dac6"],["/image/KULvD7j.png","fbbf9c69bf585d70de220348d13d696c"],["/image/KWl5dbR.png","4b99aae831c3386ee894671b78fb325b"],["/image/KuqBwqX.png","63d89382a9a5fcac464e1763faee5bdd"],["/image/LpuHmfC.png","1824c1d13a3fb9ca7c62fdfe02668715"],["/image/M4miOHk.png","9725dec260b9d2892405c3ae963d9125"],["/image/MlGcmqL.png","97ecb3b68c61842f713df82c05463aca"],["/image/MmhP191.png","c8daf2e17a6a91e1ef972331b51488c2"],["/image/MytQ6LZ.jpg","2aabd706fa00615561981a5a934c2de2"],["/image/N4ti2xc.png","19c34c0b554f9f24b12abc7197c05c01"],["/image/NyD7I10.jpg","b52c3188c59d64cb767118d564646346"],["/image/OXRInZY.jpg","5a40b1b6e357deb4682333f16b7e012c"],["/image/OXm9IqG.png","b07a860dd41316549b7f7e2b8861e647"],["/image/OcVu3gP.png","34ceb129628b50a680e002085b1a20ce"],["/image/P0LauKM.jpg","ae48281d6a548d36345753ae16347b45"],["/image/POKIs05.jpg","83b557ff162e2f99207b6d2d571ea4c3"],["/image/PfZNzxO.png","0c9f09cce4629807e9b36c95b7eea6d0"],["/image/QQOn1Q7.png","d52d1d24efc972d708e8ce19fa32f132"],["/image/RSFTsSA.png","b96e4164699e39e76a1658bd698cffe1"],["/image/RVoe1bB.png","f5cc46a28d8efe5ca83882c14af1e1d1"],["/image/RgIcvAq.png","37b4d4bf8164ec0ed6029258824f1a1a"],["/image/STYzbcG.png","074cae00b167f4113bbc513b5a6c9591"],["/image/TrngHLI.png","f09132765a2466e1166151247e310406"],["/image/TuwlhcI.png","efab2e9c65f9688404781bf5ab6139aa"],["/image/U2Q0kb5.png","e96678e1b08ac25b1450897b2ba0f1e8"],["/image/UMDdyXQ.png","29fb9051bf3162a5cc3154b8e55edd56"],["/image/UQZgIER.png","7884c71329583e6737084a99e01c3402"],["/image/UW1OwYH.png","64e6fdc27a86ac432bb36644f874f150"],["/image/VSd8CpI.jpg","2496a9f46d87fd95f58af158fb056472"],["/image/VawRThK.png","62ef5fc38623e7ee566e9b7b4199ba5c"],["/image/VpyDeAb.jpg","23d1e81665fe2dba0b64c1415bb347b4"],["/image/WFEDZF0.png","efca3b30daddbdfc48750bde6ab0c20d"],["/image/WIS0mNw.png","18fe7098a9228b3494ee828e31edbb68"],["/image/WLpJeTu.png","c712be5f66e66f7fe3b5b3c3902b5b03"],["/image/Wk4FQMS.png","1f5c1b90651dd02e82a4be9b859efa19"],["/image/XJbEZbb.png","9fec6be6b4b13d5cdb66d8c8db8c9a81"],["/image/XQ61rU2.png","c8ae992b8d876dc94428887a83bbba50"],["/image/XWC627z.png","89303e18e0daeb02494ec37e1ced1061"],["/image/XdjaPqr.jpg","199de677d1f62c32f07ff861c6d3b192"],["/image/XutLuQk.png","6347a7a1479c4520af4975e76b6f02a7"],["/image/Y2rWxu3.png","d6a564f4e7c1f190ed01e1be19647177"],["/image/YEh5zkQ.jpg","509a52d7882666a1aacc4ce9ae2dd8bc"],["/image/ZWPC6nA.png","2a9d3016185974bf30704533d01356f0"],["/image/ZciUF7y.png","5a591809cff88e50f466e68e01b1bee0"],["/image/ZzQ8dIK.png","a525bdb0e07b09751d3c3c0c3e3e5234"],["/image/bqh3Yka.png","9228b60e9e01d7720e0a5ada7aeee999"],["/image/bvu41t9.png","088c1e99b5b01f44ec08897b712c5723"],["/image/c5MHWtF.png","609a00052fd3ddcc1388177130f877bf"],["/image/d8BlxwE.png","bebe32644d0cb39163d8771b6d262c15"],["/image/e00YuXh.jpg","003a63c42d3374ef96b986d272f06684"],["/image/eC9mrmw.png","a6bb6dca3d7f41139a937c0bcd36b1d5"],["/image/eMJxVp0.png","846d8b35e4f5f843f49084aeed4e82dd"],["/image/fQ8YXDo.png","1ef1bd7025a97a8783ebf68f01db1b62"],["/image/fWb7GzK.png","c8ae992b8d876dc94428887a83bbba50"],["/image/ft7dDbQ.png","7a21c89e53ff16d4374cbf766970038d"],["/image/fy3fJMT.png","e97c6edbadd44ce7570349a13b0a4e26"],["/image/g4PUUYE.png","5751ba6a5d636d9bdfcc58d3d68c9435"],["/image/gI6WNFf.png","2629d05496f27deb9e9a3e27ab466c87"],["/image/gmomyBd.png","ef4e81d2fb29b0f01e75576d03de5fdb"],["/image/gu1BzvL.png","0b584a6865ea1f196061060225c23a8a"],["/image/hCMbYtW.jpg","bc878168e669da52b45c03c7413f9d56"],["/image/hV4x1I7.png","468d4fba9e2c9cb5216b50ab8545215c"],["/image/i10XPqF.png","21416b2570cd2a4614b80be6dcc73409"],["/image/jCD6gvu.png","d34d7312042ff1870ba71c35e4279ce2"],["/image/jP6eZ3O.png","4e0930c999594eb528816f6219ecc2cc"],["/image/jtdbZzi.png","b18be29ec07ac3ef83a54ece05927fe5"],["/image/kCZGwrU.png","47137b86b9fc9ba717850698a4ef7a68"],["/image/kGFQD2B.png","9783029640b15425aafef52185611d7e"],["/image/lVoJVrY.png","746bebe71becb99fc8e9f6bb32b63c2e"],["/image/mjW6nib.jpg","de3fa9931b1030f6d90986e42ec0a34a"],["/image/n7Z8S2O.png","98f8ce74831c04368e0ca89b83733caf"],["/image/ozDG5vU.png","846140606368e8ee20988847708b7ddc"],["/image/p9YQNVV.png","fa89c5c8cc7cd17414e3aa4daf1121ed"],["/image/penetration-test/0.jpg","0ef7a01675dcc00e817fc88971c47e22"],["/image/penetration-test/1.jpg","472de0e31bf631ad3ad8e6fcc2a79b1d"],["/image/penetration-test/10.jpg","a2d96805316f469171fc3d0e10ac8564"],["/image/penetration-test/11.jpg","23de57e4513041bc551d169c8905755d"],["/image/penetration-test/12.jpg","8d41cdb6ed4a1a80519db6babebd48c7"],["/image/penetration-test/13.jpg","5696a50655d48fad2a99a9e4ce8f7e03"],["/image/penetration-test/14.jpg","cb8d7d739c5bdd1b411e9cf0695aac28"],["/image/penetration-test/15.jpg","bae975a15228e1c2c1098ca5b0ca5489"],["/image/penetration-test/16.jpg","407288691f1f142bcac2759b76393319"],["/image/penetration-test/17.jpg","4a283e6d77d01092c66d93842304212c"],["/image/penetration-test/18.jpg","e22ad35663a11cc45ca341374f5cffd8"],["/image/penetration-test/19.jpg","d6a3b7f4d124bd7057b18874ae0fcee6"],["/image/penetration-test/2.jpg","b361bb7b7692c4e4e97c3d1c8fd949d8"],["/image/penetration-test/20.jpg","15b08408bbf8dcb55e1cf2dce448b4e7"],["/image/penetration-test/21.jpg","64271d9d1fd1b52309791317017d16cc"],["/image/penetration-test/22.jpg","614f63a11da0490b90c1064b68228b47"],["/image/penetration-test/23.jpg","89efa8ebf866eff805dc78214955baa4"],["/image/penetration-test/24.jpg","a9b629ac09aa35a10904dda85d252f86"],["/image/penetration-test/25.jpg","4d1e5d2578d893d0b9ecb3cd6c1f7bd0"],["/image/penetration-test/26.jpg","ec7d3b5b9257e14ab5ef2af4d417b977"],["/image/penetration-test/27.jpg","b17ee90e23567052f6a6908cdeca0a6e"],["/image/penetration-test/28.jpg","42022fb829721b46c38fae1121ff7fbb"],["/image/penetration-test/29.jpg","2b62546e00a4146b51d34a235244e07d"],["/image/penetration-test/3.jpg","c8d52cf2e372e9cdd79eb1942f5422fd"],["/image/penetration-test/30.jpg","ba2f1924f129c2ae4524ad97a9cc153c"],["/image/penetration-test/31.jpg","91d09589885b66c6812411f3a760933a"],["/image/penetration-test/32.jpg","b83021f783823e763e072b0383220e5c"],["/image/penetration-test/33.jpg","14b9d1a10285dabf26f17911d347c892"],["/image/penetration-test/34.jpg","17f11c8c326c4363fd95e59cb312a5af"],["/image/penetration-test/35.jpg","d1eb4c6e8b31f082f587c2b3d708990b"],["/image/penetration-test/36.jpg","c0c3217c6770ddfbe1452e52003d7295"],["/image/penetration-test/37.jpg","80d18c0230f9e933a690dd0fbe535bf0"],["/image/penetration-test/38.jpg","8d1281b26f59a821080d4c4cb37fa316"],["/image/penetration-test/39.jpg","2874ea941f6e372c771ba47632fc50e3"],["/image/penetration-test/4.jpg","b3b5d157c8877f21f52850e554868793"],["/image/penetration-test/5.jpg","1c5061451fe7a5989fe2d3d4dd2ccdf7"],["/image/penetration-test/6.jpg","8c9696c8831301d166f2502f1a413013"],["/image/penetration-test/7.jpg","b3e79abf3d750d78752a9ca099538298"],["/image/penetration-test/8.jpg","e6857f51b8ad92a1668dc90c39184b95"],["/image/penetration-test/9.jpg","5eba44fee49bb43de895f35b560c366c"],["/image/penetration-test/bg.jpg","bb742f32de2a48a493959113c8371045"],["/image/qFiXnnj.png","d2b11cc54dfda82154d33b718c00995b"],["/image/qQH76xd.png","ca8686eb9ef3155e619e4fffccf523d2"],["/image/qYskUcE.png","ffbf7b30737c44292601874b11ebf6ce"],["/image/ry0xZCB.png","74109aedadde31ea8109c8d00e738992"],["/image/sTqqAME.jpg","d7395f46f2549f801ead48a716f0b402"],["/image/tB5aLDi.png","91f02582bd84742202eceadc5354cdbb"],["/image/tfiVAJ1.png","bb6d9008824ab7f0c79fb501fd634aa5"],["/image/twJWzAv.png","0e8da8cd9de0e05de7fbe2ede870c40d"],["/image/wnrYIHy.png","c4acc98b4212330f0f5dc914c75e4918"],["/image/xfqZH3L.png","522f0c324fc9246a5c01f01f037c19a8"],["/image/xmsrSJG.png","716c137bb6033b0c8426655aafee423b"],["/image/zFWIMqk.jpg","e3fdcd4af7a1371c406aeb55d6d6e8b2"],["/image/zGv7BAv.png","0515177823670585ef10652919bdd896"],["/img/404.jpg","4ef3cfb882b6dd4128da4c8745e9a507"],["/img/404_background.png","7ade9a88a5ced2c311e69b0b16680591"],["/img/algolia.svg","88450dd56ea1a00ba772424b30b7d34d"],["/img/bg.jpg","2508662bab15082c353095baef4f983d"],["/img/bg2.jpg","2280e74939b0e67cebac525efe8f2117"],["/img/bg3.jpg","fd5f65562b9da7340a019080f5826842"],["/img/favicon.png","318db473085178cbf5064b94e975c9fa"],["/img/favicon1.png","9080901979d6d2314d01bf2f65c95a12"],["/img/favicon2.png","7a8c47cb5a2149c1a1af21e90ecd9ca7"],["/img/friend_404.gif","68af0be9d22722e74665ef44dd532ba8"],["/img/icp.png","6e26aed5ced63bc60524cc736611d39e"],["/img/loading.gif","d1cf8d9ccb6a2b3514a7d14332035a3c"],["/img/photo.jpg","1c86ced46b1352eb562054cb1c9036f9"],["/img/photo_old.jpg","57697ef581b3895855e74ac129f2e68a"],["/img/pwa/128.png","65f43cf47c166d03ee14eb4b1455b383"],["/img/pwa/16.png","5fd833a1c8a29f909a651a782de01659"],["/img/pwa/256.png","c493e64ca03cdf93f7975392c1a46b6b"],["/img/pwa/32.png","318db473085178cbf5064b94e975c9fa"],["/img/pwa/512.png","8abc99199825e59ae7f2a8bfc32b16aa"],["/img/pwa/64.png","a0e2954c37a36e41804521ae62cc0506"],["/index.html","4febf620b91087fc6fdcf618836c875d"],["/js/main.js","1c7d6eb8f8b1a9e2a06c37906146eb84"],["/js/search/algolia.js","e6a9c3f8fa43a7d3421169ea96eef44e"],["/js/search/local-search.js","86e7fcbc5aa273e6c3d2c94b0054809b"],["/js/tw_cn.js","bd869d5fd54e2fe1f1eeee7c46fa46bc"],["/js/utils.js","5720a78dca20fab16f21914ae3ac0757"],["/page/2/index.html","be340e4c9e88420429ef46776de7b908"],["/privacy-policy/index.html","1ef5d1e1259ce73872cc4bc02b504b21"],["/tags/3sum/index.html","e4b1824e8ac1ac9b2b5a8873e41f781f"],["/tags/4sum-ii/index.html","82803f5bb0f27328c79a0aa159ebc72e"],["/tags/4sum/index.html","5ed24487afe6836ff4ffb53685652ef1"],["/tags/Butterfly/index.html","bd43ed2492403cfa4854c1237fe7684a"],["/tags/Calendar/index.html","0923d90a7db61fbac9dff08493754dc1"],["/tags/Cookie/index.html","45c1075d76dc3d0923e585fe86915061"],["/tags/Data-Protection/index.html","443af8cb5e87eadd5c2fa7286ab9bd15"],["/tags/Facebook-Comment/index.html","23087adef3f7858d96f0d5f0c21b5776"],["/tags/Fiddler/index.html","a82cc3bbacecd0f6d9ea3e304ef6a372"],["/tags/Hexo/index.html","2ba3c1d1ad110528f94fba4999128086"],["/tags/Http-Proxy/index.html","856edb31ad97dbf4c3f02708c581e46f"],["/tags/Kanban/index.html","431f1e5072149e2ca0097902f76f5189"],["/tags/Model-Binding/index.html","d8d183598c67e297ec8418c03e0649a6"],["/tags/SSO/index.html","96b6b0e000763c81c65d251a85a2e281"],["/tags/TickTick/index.html","99f14bd8ddd76d7dc5a6efda128a0200"],["/tags/ToDoList/index.html","8ccb17f7ffb30caff874f4946fd60e2e"],["/tags/autofill/index.html","98b16e98bc548e25a5ffd411353d9bdc"],["/tags/binary-search/index.html","7799afafe3995df3b2c3b8b493c558e4"],["/tags/browser/index.html","5d88dec93ad11c3065c94a89646153b4"],["/tags/cshtml/index.html","3e16fd484e5144a876ed55ab1ba18719"],["/tags/design-linked-list/index.html","86be4b93b26ba6ddc23243bbc19790db"],["/tags/encoding/index.html","3e6e3e17d45f815db4b1547146855213"],["/tags/find-common-characters/index.html","74b83cdb97e51eb2a8ce25756cb8e548"],["/tags/happy-number/index.html","cb370b8ba091166852a865c17fb8422c"],["/tags/index.html","7ef4db101304af7dd7e9dcaba53baa97"],["/tags/intersection-of-two-arrays/index.html","9df49ab7d9019f2524575487ca2ce2ba"],["/tags/intersection-of-two-linked-lists/index.html","de2b5867f5e97d38856a0e9227163d23"],["/tags/linked-list-cycle-ii/index.html","84b681b5636dcfd190782e76aac67c5f"],["/tags/minimum-size-subarray-sum/index.html","70a4bed326df81ee81df1c737872dd06"],["/tags/penetration-test/index.html","b8cac485e1f0581a54d75a00678ed0c1"],["/tags/ransom-note/index.html","de783807faf52a6192cc75016df490ff"],["/tags/red-team/index.html","9b8b6d6fee168401e3d2ad2a1918e0fe"],["/tags/remove-element/index.html","8d1024fa31384707323e8e2eda160f00"],["/tags/remove-linked-list-elements/index.html","89cf1da6d7361b1cc3826b4dbca22f0d"],["/tags/remove-nth-node-from-end-of-list/index.html","ad45b29f3259ec1578af6668a2b112c8"],["/tags/reverse-linked-list/index.html","c4982145323fd899987dab969151c511"],["/tags/squares-of-a-sorted-array/index.html","793603cec0088554fe9c62190427e285"],["/tags/swap-nodes-in-pairs/index.html","b1ddd8e48bd87af0f3dc2c9b2e260a5b"],["/tags/targetframeworks/index.html","8352c8e2a18d7f9a304b7fde2f11d142"],["/tags/two-sum/index.html","8fef2acf8d2603346e962395cb25e0f2"],["/tags/valid-anagram/index.html","ebf6738702b355cccbd2f94139123ca6"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function(originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function(originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function(originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function(whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function(originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});


// *** Start of auto-included sw-toolbox code. ***
/* 
 Copyright 2016 Google Inc. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.toolbox=e()}}(function(){return function e(t,n,r){function o(c,s){if(!n[c]){if(!t[c]){var a="function"==typeof require&&require;if(!s&&a)return a(c,!0);if(i)return i(c,!0);var u=new Error("Cannot find module '"+c+"'");throw u.code="MODULE_NOT_FOUND",u}var f=n[c]={exports:{}};t[c][0].call(f.exports,function(e){var n=t[c][1][e];return o(n?n:e)},f,f.exports,e,t,n,r)}return n[c].exports}for(var i="function"==typeof require&&require,c=0;c<r.length;c++)o(r[c]);return o}({1:[function(e,t,n){"use strict";function r(e,t){t=t||{};var n=t.debug||m.debug;n&&console.log("[sw-toolbox] "+e)}function o(e){var t;return e&&e.cache&&(t=e.cache.name),t=t||m.cache.name,caches.open(t)}function i(e,t){t=t||{};var n=t.successResponses||m.successResponses;return fetch(e.clone()).then(function(r){return"GET"===e.method&&n.test(r.status)&&o(t).then(function(n){n.put(e,r).then(function(){var r=t.cache||m.cache;(r.maxEntries||r.maxAgeSeconds)&&r.name&&c(e,n,r)})}),r.clone()})}function c(e,t,n){var r=s.bind(null,e,t,n);d=d?d.then(r):r()}function s(e,t,n){var o=e.url,i=n.maxAgeSeconds,c=n.maxEntries,s=n.name,a=Date.now();return r("Updating LRU order for "+o+". Max entries is "+c+", max age is "+i),g.getDb(s).then(function(e){return g.setTimestampForUrl(e,o,a)}).then(function(e){return g.expireEntries(e,c,i,a)}).then(function(e){r("Successfully updated IDB.");var n=e.map(function(e){return t.delete(e)});return Promise.all(n).then(function(){r("Done with cache cleanup.")})}).catch(function(e){r(e)})}function a(e,t,n){return r("Renaming cache: ["+e+"] to ["+t+"]",n),caches.delete(t).then(function(){return Promise.all([caches.open(e),caches.open(t)]).then(function(t){var n=t[0],r=t[1];return n.keys().then(function(e){return Promise.all(e.map(function(e){return n.match(e).then(function(t){return r.put(e,t)})}))}).then(function(){return caches.delete(e)})})})}function u(e,t){return o(t).then(function(t){return t.add(e)})}function f(e,t){return o(t).then(function(t){return t.delete(e)})}function h(e){e instanceof Promise||p(e),m.preCacheItems=m.preCacheItems.concat(e)}function p(e){var t=Array.isArray(e);if(t&&e.forEach(function(e){"string"==typeof e||e instanceof Request||(t=!1)}),!t)throw new TypeError("The precache method expects either an array of strings and/or Requests or a Promise that resolves to an array of strings and/or Requests.");return e}function l(e,t,n){if(!e)return!1;if(t){var r=e.headers.get("date");if(r){var o=new Date(r);if(o.getTime()+1e3*t<n)return!1}}return!0}var d,m=e("./options"),g=e("./idb-cache-expiration");t.exports={debug:r,fetchAndCache:i,openCache:o,renameCache:a,cache:u,uncache:f,precache:h,validatePrecacheInput:p,isResponseFresh:l}},{"./idb-cache-expiration":2,"./options":4}],2:[function(e,t,n){"use strict";function r(e){return new Promise(function(t,n){var r=indexedDB.open(u+e,f);r.onupgradeneeded=function(){var e=r.result.createObjectStore(h,{keyPath:p});e.createIndex(l,l,{unique:!1})},r.onsuccess=function(){t(r.result)},r.onerror=function(){n(r.error)}})}function o(e){return e in d||(d[e]=r(e)),d[e]}function i(e,t,n){return new Promise(function(r,o){var i=e.transaction(h,"readwrite"),c=i.objectStore(h);c.put({url:t,timestamp:n}),i.oncomplete=function(){r(e)},i.onabort=function(){o(i.error)}})}function c(e,t,n){return t?new Promise(function(r,o){var i=1e3*t,c=[],s=e.transaction(h,"readwrite"),a=s.objectStore(h),u=a.index(l);u.openCursor().onsuccess=function(e){var t=e.target.result;if(t&&n-i>t.value[l]){var r=t.value[p];c.push(r),a.delete(r),t.continue()}},s.oncomplete=function(){r(c)},s.onabort=o}):Promise.resolve([])}function s(e,t){return t?new Promise(function(n,r){var o=[],i=e.transaction(h,"readwrite"),c=i.objectStore(h),s=c.index(l),a=s.count();s.count().onsuccess=function(){var e=a.result;e>t&&(s.openCursor().onsuccess=function(n){var r=n.target.result;if(r){var i=r.value[p];o.push(i),c.delete(i),e-o.length>t&&r.continue()}})},i.oncomplete=function(){n(o)},i.onabort=r}):Promise.resolve([])}function a(e,t,n,r){return c(e,n,r).then(function(n){return s(e,t).then(function(e){return n.concat(e)})})}var u="sw-toolbox-",f=1,h="store",p="url",l="timestamp",d={};t.exports={getDb:o,setTimestampForUrl:i,expireEntries:a}},{}],3:[function(e,t,n){"use strict";function r(e){var t=a.match(e.request);t?e.respondWith(t(e.request)):a.default&&"GET"===e.request.method&&0===e.request.url.indexOf("http")&&e.respondWith(a.default(e.request))}function o(e){s.debug("activate event fired");var t=u.cache.name+"$$$inactive$$$";e.waitUntil(s.renameCache(t,u.cache.name))}function i(e){return e.reduce(function(e,t){return e.concat(t)},[])}function c(e){var t=u.cache.name+"$$$inactive$$$";s.debug("install event fired"),s.debug("creating cache ["+t+"]"),e.waitUntil(s.openCache({cache:{name:t}}).then(function(e){return Promise.all(u.preCacheItems).then(i).then(s.validatePrecacheInput).then(function(t){return s.debug("preCache list: "+(t.join(", ")||"(none)")),e.addAll(t)})}))}e("serviceworker-cache-polyfill");var s=e("./helpers"),a=e("./router"),u=e("./options");t.exports={fetchListener:r,activateListener:o,installListener:c}},{"./helpers":1,"./options":4,"./router":6,"serviceworker-cache-polyfill":16}],4:[function(e,t,n){"use strict";var r;r=self.registration?self.registration.scope:self.scope||new URL("./",self.location).href,t.exports={cache:{name:"$$$toolbox-cache$$$"+r+"$$$",maxAgeSeconds:null,maxEntries:null},debug:!1,networkTimeoutSeconds:null,preCacheItems:[],successResponses:/^0|([123]\d\d)|(40[14567])|410$/}},{}],5:[function(e,t,n){"use strict";var r=new URL("./",self.location),o=r.pathname,i=e("path-to-regexp"),c=function(e,t,n,r){t instanceof RegExp?this.fullUrlRegExp=t:(0!==t.indexOf("/")&&(t=o+t),this.keys=[],this.regexp=i(t,this.keys)),this.method=e,this.options=r,this.handler=n};c.prototype.makeHandler=function(e){var t;if(this.regexp){var n=this.regexp.exec(e);t={},this.keys.forEach(function(e,r){t[e.name]=n[r+1]})}return function(e){return this.handler(e,t,this.options)}.bind(this)},t.exports=c},{"path-to-regexp":15}],6:[function(e,t,n){"use strict";function r(e){return e.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}var o=e("./route"),i=e("./helpers"),c=function(e,t){for(var n=e.entries(),r=n.next(),o=[];!r.done;){var i=new RegExp(r.value[0]);i.test(t)&&o.push(r.value[1]),r=n.next()}return o},s=function(){this.routes=new Map,this.routes.set(RegExp,new Map),this.default=null};["get","post","put","delete","head","any"].forEach(function(e){s.prototype[e]=function(t,n,r){return this.add(e,t,n,r)}}),s.prototype.add=function(e,t,n,c){c=c||{};var s;t instanceof RegExp?s=RegExp:(s=c.origin||self.location.origin,s=s instanceof RegExp?s.source:r(s)),e=e.toLowerCase();var a=new o(e,t,n,c);this.routes.has(s)||this.routes.set(s,new Map);var u=this.routes.get(s);u.has(e)||u.set(e,new Map);var f=u.get(e),h=a.regexp||a.fullUrlRegExp;f.has(h.source)&&i.debug('"'+t+'" resolves to same regex as existing route.'),f.set(h.source,a)},s.prototype.matchMethod=function(e,t){var n=new URL(t),r=n.origin,o=n.pathname;return this._match(e,c(this.routes,r),o)||this._match(e,[this.routes.get(RegExp)],t)},s.prototype._match=function(e,t,n){if(0===t.length)return null;for(var r=0;r<t.length;r++){var o=t[r],i=o&&o.get(e.toLowerCase());if(i){var s=c(i,n);if(s.length>0)return s[0].makeHandler(n)}}return null},s.prototype.match=function(e){return this.matchMethod(e.method,e.url)||this.matchMethod("any",e.url)},t.exports=new s},{"./helpers":1,"./route":5}],7:[function(e,t,n){"use strict";function r(e,t,n){return n=n||{},i.debug("Strategy: cache first ["+e.url+"]",n),i.openCache(n).then(function(t){return t.match(e).then(function(t){var r=n.cache||o.cache,c=Date.now();return i.isResponseFresh(t,r.maxAgeSeconds,c)?t:i.fetchAndCache(e,n)})})}var o=e("../options"),i=e("../helpers");t.exports=r},{"../helpers":1,"../options":4}],8:[function(e,t,n){"use strict";function r(e,t,n){return n=n||{},i.debug("Strategy: cache only ["+e.url+"]",n),i.openCache(n).then(function(t){return t.match(e).then(function(e){var t=n.cache||o.cache,r=Date.now();if(i.isResponseFresh(e,t.maxAgeSeconds,r))return e})})}var o=e("../options"),i=e("../helpers");t.exports=r},{"../helpers":1,"../options":4}],9:[function(e,t,n){"use strict";function r(e,t,n){return o.debug("Strategy: fastest ["+e.url+"]",n),new Promise(function(r,c){var s=!1,a=[],u=function(e){a.push(e.toString()),s?c(new Error('Both cache and network failed: "'+a.join('", "')+'"')):s=!0},f=function(e){e instanceof Response?r(e):u("No result returned")};o.fetchAndCache(e.clone(),n).then(f,u),i(e,t,n).then(f,u)})}var o=e("../helpers"),i=e("./cacheOnly");t.exports=r},{"../helpers":1,"./cacheOnly":8}],10:[function(e,t,n){t.exports={networkOnly:e("./networkOnly"),networkFirst:e("./networkFirst"),cacheOnly:e("./cacheOnly"),cacheFirst:e("./cacheFirst"),fastest:e("./fastest")}},{"./cacheFirst":7,"./cacheOnly":8,"./fastest":9,"./networkFirst":11,"./networkOnly":12}],11:[function(e,t,n){"use strict";function r(e,t,n){n=n||{};var r=n.successResponses||o.successResponses,c=n.networkTimeoutSeconds||o.networkTimeoutSeconds;return i.debug("Strategy: network first ["+e.url+"]",n),i.openCache(n).then(function(t){var s,a,u=[];if(c){var f=new Promise(function(r){s=setTimeout(function(){t.match(e).then(function(e){var t=n.cache||o.cache,c=Date.now(),s=t.maxAgeSeconds;i.isResponseFresh(e,s,c)&&r(e)})},1e3*c)});u.push(f)}var h=i.fetchAndCache(e,n).then(function(e){if(s&&clearTimeout(s),r.test(e.status))return e;throw i.debug("Response was an HTTP error: "+e.statusText,n),a=e,new Error("Bad response")}).catch(function(r){return i.debug("Network or response error, fallback to cache ["+e.url+"]",n),t.match(e).then(function(e){if(e)return e;if(a)return a;throw r})});return u.push(h),Promise.race(u)})}var o=e("../options"),i=e("../helpers");t.exports=r},{"../helpers":1,"../options":4}],12:[function(e,t,n){"use strict";function r(e,t,n){return o.debug("Strategy: network only ["+e.url+"]",n),fetch(e)}var o=e("../helpers");t.exports=r},{"../helpers":1}],13:[function(e,t,n){"use strict";var r=e("./options"),o=e("./router"),i=e("./helpers"),c=e("./strategies"),s=e("./listeners");i.debug("Service Worker Toolbox is loading"),self.addEventListener("install",s.installListener),self.addEventListener("activate",s.activateListener),self.addEventListener("fetch",s.fetchListener),t.exports={networkOnly:c.networkOnly,networkFirst:c.networkFirst,cacheOnly:c.cacheOnly,cacheFirst:c.cacheFirst,fastest:c.fastest,router:o,options:r,cache:i.cache,uncache:i.uncache,precache:i.precache}},{"./helpers":1,"./listeners":3,"./options":4,"./router":6,"./strategies":10}],14:[function(e,t,n){t.exports=Array.isArray||function(e){return"[object Array]"==Object.prototype.toString.call(e)}},{}],15:[function(e,t,n){function r(e,t){for(var n,r=[],o=0,i=0,c="",s=t&&t.delimiter||"/";null!=(n=x.exec(e));){var f=n[0],h=n[1],p=n.index;if(c+=e.slice(i,p),i=p+f.length,h)c+=h[1];else{var l=e[i],d=n[2],m=n[3],g=n[4],v=n[5],w=n[6],y=n[7];c&&(r.push(c),c="");var b=null!=d&&null!=l&&l!==d,E="+"===w||"*"===w,R="?"===w||"*"===w,k=n[2]||s,$=g||v;r.push({name:m||o++,prefix:d||"",delimiter:k,optional:R,repeat:E,partial:b,asterisk:!!y,pattern:$?u($):y?".*":"[^"+a(k)+"]+?"})}}return i<e.length&&(c+=e.substr(i)),c&&r.push(c),r}function o(e,t){return s(r(e,t))}function i(e){return encodeURI(e).replace(/[\/?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function c(e){return encodeURI(e).replace(/[?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function s(e){for(var t=new Array(e.length),n=0;n<e.length;n++)"object"==typeof e[n]&&(t[n]=new RegExp("^(?:"+e[n].pattern+")$"));return function(n,r){for(var o="",s=n||{},a=r||{},u=a.pretty?i:encodeURIComponent,f=0;f<e.length;f++){var h=e[f];if("string"!=typeof h){var p,l=s[h.name];if(null==l){if(h.optional){h.partial&&(o+=h.prefix);continue}throw new TypeError('Expected "'+h.name+'" to be defined')}if(v(l)){if(!h.repeat)throw new TypeError('Expected "'+h.name+'" to not repeat, but received `'+JSON.stringify(l)+"`");if(0===l.length){if(h.optional)continue;throw new TypeError('Expected "'+h.name+'" to not be empty')}for(var d=0;d<l.length;d++){if(p=u(l[d]),!t[f].test(p))throw new TypeError('Expected all "'+h.name+'" to match "'+h.pattern+'", but received `'+JSON.stringify(p)+"`");o+=(0===d?h.prefix:h.delimiter)+p}}else{if(p=h.asterisk?c(l):u(l),!t[f].test(p))throw new TypeError('Expected "'+h.name+'" to match "'+h.pattern+'", but received "'+p+'"');o+=h.prefix+p}}else o+=h}return o}}function a(e){return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g,"\\$1")}function u(e){return e.replace(/([=!:$\/()])/g,"\\$1")}function f(e,t){return e.keys=t,e}function h(e){return e.sensitive?"":"i"}function p(e,t){var n=e.source.match(/\((?!\?)/g);if(n)for(var r=0;r<n.length;r++)t.push({name:r,prefix:null,delimiter:null,optional:!1,repeat:!1,partial:!1,asterisk:!1,pattern:null});return f(e,t)}function l(e,t,n){for(var r=[],o=0;o<e.length;o++)r.push(g(e[o],t,n).source);var i=new RegExp("(?:"+r.join("|")+")",h(n));return f(i,t)}function d(e,t,n){return m(r(e,n),t,n)}function m(e,t,n){v(t)||(n=t||n,t=[]),n=n||{};for(var r=n.strict,o=n.end!==!1,i="",c=0;c<e.length;c++){var s=e[c];if("string"==typeof s)i+=a(s);else{var u=a(s.prefix),p="(?:"+s.pattern+")";t.push(s),s.repeat&&(p+="(?:"+u+p+")*"),p=s.optional?s.partial?u+"("+p+")?":"(?:"+u+"("+p+"))?":u+"("+p+")",i+=p}}var l=a(n.delimiter||"/"),d=i.slice(-l.length)===l;return r||(i=(d?i.slice(0,-l.length):i)+"(?:"+l+"(?=$))?"),i+=o?"$":r&&d?"":"(?="+l+"|$)",f(new RegExp("^"+i,h(n)),t)}function g(e,t,n){return v(t)||(n=t||n,t=[]),n=n||{},e instanceof RegExp?p(e,t):v(e)?l(e,t,n):d(e,t,n)}var v=e("isarray");t.exports=g,t.exports.parse=r,t.exports.compile=o,t.exports.tokensToFunction=s,t.exports.tokensToRegExp=m;var x=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"),"g")},{isarray:14}],16:[function(e,t,n){!function(){var e=Cache.prototype.addAll,t=navigator.userAgent.match(/(Firefox|Chrome)\/(\d+\.)/);if(t)var n=t[1],r=parseInt(t[2]);e&&(!t||"Firefox"===n&&r>=46||"Chrome"===n&&r>=50)||(Cache.prototype.addAll=function(e){function t(e){this.name="NetworkError",this.code=19,this.message=e}var n=this;return t.prototype=Object.create(Error.prototype),Promise.resolve().then(function(){if(arguments.length<1)throw new TypeError;return e=e.map(function(e){return e instanceof Request?e:String(e)}),Promise.all(e.map(function(e){"string"==typeof e&&(e=new Request(e));var n=new URL(e.url).protocol;if("http:"!==n&&"https:"!==n)throw new t("Invalid scheme");return fetch(e.clone())}))}).then(function(r){if(r.some(function(e){return!e.ok}))throw new t("Incorrect response status");return Promise.all(r.map(function(t,r){return n.put(e[r],t)}))}).then(function(){})},Cache.prototype.add=function(e){return this.addAll([e])})}()},{}]},{},[13])(13)});


// *** End of auto-included sw-toolbox code. ***



// Runtime cache configuration, using the sw-toolbox library.

toolbox.router.get("/*", toolbox.cacheFirst, {"origin":"cdn.pixabay.com"});
toolbox.router.get("/*", toolbox.cacheFirst, {"origin":"cdn.jsdelivr.net"});
toolbox.router.get("/*", toolbox.cacheFirst, {"origin":"i.imgur.com"});




