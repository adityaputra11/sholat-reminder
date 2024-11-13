"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToQuickPickItems = convertToQuickPickItems;
function convertToQuickPickItems(data) {
    return data.data.map((location) => ({
        label: location.lokasi,
        detail: location.id,
        description: `ID: ${location.id}`,
    }));
}
//# sourceMappingURL=location.js.map