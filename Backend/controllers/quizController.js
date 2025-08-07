const { getDailyQuest, setDailyQuest } = require('../dailyQuest');
const { PrismaClient } = require('../generate/prisma')
const prisma = PrismaClient()
const quizController = async (req, res)=> {
    const currentDate = new Date()
    if(currentDate - getDailyQuest() > 24 * 60 * 60 * 1000){
        const quest = await prisma.$queryRaw`
        SELECT * FROM "YourTableName"
        ORDER BY RANDOM()
        LIMIT 1;
        `;
        setDailyQuest(quest, Date.now())
    }
    res.send(getDailyQuest.quest)
    
}
module.exports = quizController