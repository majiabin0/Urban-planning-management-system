import { rsaDecrypt, aesDecrypt, respond } from "./utils";

export default {
  "POST /api/signin": (req: any, res: any) => {
    res.writeHead(200, {
      "Content-Type": "application/json",
      charset: "utf-8"
    });

    if (req.headers["x-aes-key"]) {
      const key = rsaDecrypt(req.headers["x-aes-key"]);

      let { username, password, code } = req.body;
      username = aesDecrypt(username, key);
      password = aesDecrypt(password, key);
      code = aesDecrypt(code, key);

      let errors = [];
      if (username !== "root" || password !== "secret") {
        errors.push({
          name: "username",
          errors: ["用户名或密码错误"]
        });
        errors.push({
          name: "password",
          errors: [""]
        });
      }
      if (code !== "1234") {
        errors.push({
          name: "code",
          errors: ["验证码错误"]
        });
      }
      if (errors.length > 0) {
        res.end(JSON.stringify(respond(errors, 422)));
      }
      res.end(
        JSON.stringify(
          respond({
            token:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ",
            expired_in: 7200
          })
        )
      );
    } else {
      res.end(JSON.stringify(respond({}, 422)));
    }
  },

  "POST /api/signout": respond({}, 200),

  "GET /api/captcha": respond(
    {
      captcha:
        "http://www.51mbalunwen.com/api.php?op=checkcode&code_len=4&font_size=20&width=130&height=50&font_color=&background="
    },
    200
  )
};
