const { Api } = require('@top-gg/sdk');
const TopGGApi = new Api(process.env.TOPGG)

export default async (userId) => {

    if (!userId) return false

    const user = await client.users.fetch(userId).catch(() => null)
    if (!user) return false
    giveRewards()

    async function giveRewards() {

        return await Database.User.updateOne().then(() => {
                return { /* enviar log de voto */  }
            }).catch(() => false)

    }
}