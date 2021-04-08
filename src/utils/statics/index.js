import { assets } from '$app/paths';
import urljoin from 'proper-url-join';

export const getPath = (staticAssetPath = '') => urljoin(assets, staticAssetPath);
