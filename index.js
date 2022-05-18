require('dotenv').config()
const { Telegraf } = require('telegraf')
const axios = require('axios').default
const consObj = require('./const')

const bot = new Telegraf(process.env.BOT_TOKEN)
let data

bot.start((ctx) => {
    ctx.reply(`Здравствуйте, ${ctx.message.chat.first_name}`)
})
bot.help((ctx) => ctx.reply(consObj.currencies))


bot.on('message', ctx => {
    try {
        axios.get('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5')
            .then((response) => {
                data = response.data.filter(item => item.ccy === ctx.message.text.toUpperCase())
                if (data.length > 0) {
                    const answer = `  
                Валюта: ${data[0].ccy} ➔ ${data[0].base_ccy} 
Покупка: ${data[0].buy}
Продажа: ${data[0].sale}
                               `
                    ctx.reply(answer)
                } else {
                    ctx.reply('Неизвестная валюта')
                }
            })
    } catch (error) {
        ctx.reply('Произошла ошибка. Попробуйте снова')
        console.error(error);
    }
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))