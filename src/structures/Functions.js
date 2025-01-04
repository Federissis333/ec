const client = require(`${process.cwd()}/index.js`);
const moment = require("moment");
require("moment-duration-format");

function toMoney(number, precision = 2) { return number.toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: precision }); }

function toTime(number) { return moment.duration(number).format("D[d], H[h], m[m], s[s]"); }

async function VerifyUserLevel(membro, interaction) {

    let userdb = await client.userdb.findOne({ userID: membro })

    if (!userdb) {
        const newuser = new client.userdb({ userID: membro })
        await newuser.save();
        userdb = await client.userdb.findOne({ userID: membro })
    }

    let userXp = userdb.infos.xp ?? 0;
    let getLevelfromDB = userdb.infos.level ?? 0;
    let requiredXp = getLevelfromDB * 2 * 250 + 250;
    let newLevel = Number(getLevelfromDB) + 1;

    if (userXp >= requiredXp) {
        await client.userdb.updateOne({ userID: membro }, { $set: { "infos.level": newLevel } });
        return interaction.send({ content: `🎉 <@!${membro}>, você subiu para o level **${newLevel}**.` });
    }

}

module.exports = { toMoney, toTime, VerifyUserLevel };