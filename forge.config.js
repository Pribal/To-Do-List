module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        appDirectory : "/home/pribal/Bureau/Développement/Electron/to_do_list",
        exePath: "todolist.exe",
        iconPath: "/images/logo.png"
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options : {
          icon: 'images/logo.png'
        }
      },
    }
  ],
};
