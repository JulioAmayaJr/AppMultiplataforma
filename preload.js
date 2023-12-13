const { invoke } = require('@tauri-apps/api/tauri');

window.api = {
  os: {
    homedir: () => invoke('os.homedir'),
  },
  path: {
    join: (...args) => invoke('path.join', { args }),
  },
  Toastify: {
    toast: (options) => invoke('Toastify.toast', { options }),
  },
  ipcRenderer: {
    send: (channel, data) => invoke('ipcRenderer.send', { channel, data }),
    on: (channel, func) => {
      invoke('ipcRenderer.on', { channel }).then((listener) => {
        listener((event, ...args) => func(...args));
      });
    },
  },
};
