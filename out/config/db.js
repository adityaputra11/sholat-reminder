"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveCityID = saveCityID;
exports.getCityID = getCityID;
function saveCityID(context, cityID) {
    return context.globalState.update("cityID", cityID);
}
function getCityID(context) {
    return context.globalState.get("cityID");
}
//# sourceMappingURL=db.js.map