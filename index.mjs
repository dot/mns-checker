import * as cheerio from 'cheerio';
import notifier from 'node-notifier';
import fetch from 'node-fetch';
import cron from 'node-cron';

const url = 'https://store-jp.nintendo.com/list/hardware-accessory/controller/HAC_A_FSSKA.html';
const str = '品切れ';

cron.schedule('30 */2 * * * *', () => {
  fetch(url)
    .then(res => res.text())
    .then(html => {
      const $ = cheerio.load(html);
      $('.productDetail--buttons__container > button').each((i, t) => {
        const n = $(t);
        const text = n.text();
        if (text.indexOf(str) == -1) {
          notifier.notify({
            title: 'My Nintendo Store',
            message: 'Nintendo Switch Pro Controller is available!',
            sound: true,
            open: url,
            wait: true,
            timeout: false,
          });
        } else {
          const date = new Date();
          console.log(new Intl.DateTimeFormat('ja-JP', {
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            timeZone: 'Asia/Tokyo'}).format(date));
        }
      });
    });
});
