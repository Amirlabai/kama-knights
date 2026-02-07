import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point, polygon } from '@turf/helpers';
import { IRegion } from '../models/Region';

export const isPointInRegion = (ptCoords: { lat: number, lng: number }, region: IRegion): boolean => {
    if (!region || !region.polygon || !region.polygon.coordinates) return false;

    const pt = point([ptCoords.lng, ptCoords.lat]); // Note: Turf uses [lng, lat]
    const poly = polygon(region.polygon.coordinates);

    return booleanPointInPolygon(pt, poly);
};
