// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
console.log("✅ preload is running");

const { contextBridge, ipcRenderer, ipcMain } = require('electron');

contextBridge.exposeInMainWorld('api', {

    saveSchedule: (data) => ipcRenderer.send('save-schedule', data),
    onScheduleSaved: (cb) => ipcRenderer.on('schedule-saved', cb),

    saveCourse: (data) => ipcRenderer.send('save-course', data),
    saveChapter: (data) => ipcRenderer.send('save-chapter', data),
    getSchedules: () => ipcRenderer.invoke('get-schedules'),
    getSchedule : (data) => ipcRenderer.invoke('get-schedule',data),
    getCourses : (data) => ipcRenderer.invoke('get-courses',data),
    getChapters : (data) => ipcRenderer.invoke('get-chapters',data),
    getAssignedChapters : (data) => ipcRenderer.invoke('get-assigned-chapters',data),
    updateChapter : (data) => ipcRenderer.send('update-chapters',data),
    updateCourse : (data) => ipcRenderer.send('update-courses',data),
    updateSchedule : (data) => ipcRenderer.send('update-schedule',data),  
    deleteSchedule : (data) => ipcRenderer.send('delete-schedule',data),
    UpdateAssignedChapters : (data)=> ipcRenderer.send("update-assigned-chapters",data),  
});