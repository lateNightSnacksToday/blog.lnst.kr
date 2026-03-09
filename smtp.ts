import * as nodemailer from "nodemailer";
import * as Config from "./smtp.json";

const transporter = nodemailer.createTransport({
    service: Config.service,
    host: Config.host,
    port: Config.port,
    secure: Config.secure,
    requireTLS: Config.requireTLS,
    auth: {
        user: Config.email,
        pass: Config.pass
    }
});

export async function sendVerifyEmail(to: string, code: string) {
    let res = await transporter.sendMail({
        from: Config.email,
        to: to,
        subject: "blog.lnst.kr Authentication Code",
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:60px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background-color:#141414;border-radius:24px;padding:48px 40px;border:1px solid #2a2a2a;">
          <tr>
            <td align="center" style="padding-bottom:12px;">
              <span style="font-size:13px;font-weight:600;letter-spacing:4px;text-transform:uppercase;color:#555555;">VERIFICATION</span>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:8px;">
              <span style="font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">인증 코드를 입력하세요</span>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:40px;">
              <span style="font-size:14px;color:#666666;line-height:1.6;">아래 6자리 코드를 입력창에 입력해주세요.<br>코드는 10분간 유효합니다.</span>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:40px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  ${code.split('').map(n => `
                  <td style="padding:0 5px;">
                    <div style="
                      width:56px;
                      height:68px;
                      background-color:#1e1e1e;
                      border:1.5px solid #333333;
                      border-radius:12px;
                      display:inline-block;
                      text-align:center;
                      line-height:68px;
                      font-size:32px;
                      font-weight:700;
                      color:#ffffff;
                      letter-spacing:0;
                      font-family:'Courier New',monospace;
                    ">${n}</div>
                  </td>`).join('')}
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="border-top:1px solid #222222;padding-top:28px;">
              <span style="font-size:12px;color:#444444;">요청하지 않으셨다면 이 이메일을 무시하세요.</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
    });
    return res;
}