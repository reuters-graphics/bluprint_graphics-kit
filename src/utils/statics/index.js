import { assets } from '$app/paths';
import urljoin from 'url-join';

export const getPath = (staticAssetPath) => urljoin(assets, staticAssetPath);