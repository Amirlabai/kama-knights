"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPointInRegion = void 0;
const boolean_point_in_polygon_1 = __importDefault(require("@turf/boolean-point-in-polygon"));
const helpers_1 = require("@turf/helpers");
const isPointInRegion = (ptCoords, region) => {
    if (!region || !region.polygon || !region.polygon.coordinates)
        return false;
    const pt = (0, helpers_1.point)([ptCoords.lng, ptCoords.lat]); // Note: Turf uses [lng, lat]
    const poly = (0, helpers_1.polygon)(region.polygon.coordinates);
    return (0, boolean_point_in_polygon_1.default)(pt, poly);
};
exports.isPointInRegion = isPointInRegion;
