var engine;
var response = {};
var MsCreateRoomInfo;

try {
    engine = new window.MatchvsEngine();
    response = new window.MatchvsResponse();
    MsCreateRoomInfo = new window.MsCreateRoomInfo();

} catch (e) {
    console.log("load matchvs is fail:" + e.message);
}
module.exports = {
    engine: engine,
    response: response,
    CreateRoomInfo: MsCreateRoomInfo
};