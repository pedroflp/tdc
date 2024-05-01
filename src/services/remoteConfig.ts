'use client';

import { getRemoteConfig } from 'firebase/remote-config';
import { app } from './firebase';
import { remoteConfigs } from './constants';

export const remoteConfig = getRemoteConfig(app)

remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
remoteConfig.defaultConfig = {
  [remoteConfigs.QUEUE_COMPOSITION_LIMIT]: 4
};