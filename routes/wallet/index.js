var express = require("express");
var router = express.Router();
const lightwallet = require("eth-lightwallet");
const fs = require("fs");

// TODO : lightwallet 모듈을 사용하여 랜덤한 니모닉 코드를 얻습니다.
router.post("/newMnemonic", async (req, res) => {
  let mnemonic;
  try {
    mnemonic = lightwallet.keystore.generateRandomSeed();
    res.json({ mnemonic });
  } catch (err) {
    console.log(err);
  }
});

// TODO : 니모닉 코드와 패스워드를 이용해 keystore와 address를 생성합니다.
router.post("/newWallet", async (req, res) => {
  // 요청에 포함되어 있는 passworddhk mnemonic을 할당
  let password = req.body.password;
  let mnemonic = req.body.mnemonic;

  try {
    // 키스토어 생성
    lightwallet.keystore.createVault(
      // 첫번째 인자(options), 두번째 인자(callback)
      {
        password: password,
        seedPhrase: mnemonic,
        hdPathString: "m/0'/0'/0'",
      },
      // 키스토어를 인자로 사용하는 함수
      function (err, ks) {
        ks.keyFromPassword(password, (err, pwDerivedKey) => {
          // 새로운 주소 생성
          ks.generateNewAddress(pwDerivedKey, 1);

          let address = ks.getAddresses().toString();
          let keystore = ks.serialize();

          // 응답으로 보냄
          // res.json({ keystore: keystore, address: address });

          // 로컬에 json으로 저장
          fs.writeFile("wallet.json", keystore, (err, data) => {
            if (err) {
              res.json({ code: 999, message: "실패" });
            } else {
              res.json({ code: 1, message: "성공" });
            }
          });
        });
      }
    );
  } catch (exception) {
    console.log("NewWallet => " + exception);
  }
});

module.exports = router;
