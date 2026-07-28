import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '1g7tc639',
    dataset: 'production'
  },
  studioHost: 'inventari-admin',
  deployment: {
    appId: 'aoq85g8yky2r3saaie21f3ip',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
