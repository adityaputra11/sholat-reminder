"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCownDown = calculateCownDown;
exports.getTomorrowDate = getTomorrowDate;
function calculateCownDown(selisihWaktu) {
    const hours = Math.floor((selisihWaktu / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((selisihWaktu / (1000 * 60)) % 60);
    const seconds = Math.floor((selisihWaktu / 1000) % 60);
    return {
        hours,
        minutes,
        seconds,
    };
}
function getTomorrowDate() {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 1);
    const stringDate = newDate.toISOString().split("T")[0];
    return [newDate, stringDate];
}
//# sourceMappingURL=time.js.map