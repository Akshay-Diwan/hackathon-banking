let dailyQuest = {

}
const setDailyQuest = (quest, date)=>{
    dailyQuest = {quest, date}
}
const getDailyQuest = ()=>{
    return dailyQuest;
}
module.exports = {setDailyQuest, getDailyQuest}