// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
console.log("✅ preload is running");

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {

    saveSchedule: (data) => ipcRenderer.send('save-schedule', data),
    onScheduleSaved: (cb) => ipcRenderer.on('schedule-saved', cb),

    saveCourse: (data) => ipcRenderer.send('save-course', data),
    saveChapter: (data) => ipcRenderer.send('save-chapter', data),
    getSchedules: () => ipcRenderer.invoke('get-schedules'),
});