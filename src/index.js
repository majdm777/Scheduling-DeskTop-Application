const { app, BrowserWindow } = require('electron');
const path = require('node:path');


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();

  }
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
//-----------------------------------------------------------------------------------------
const db = require('./database');
const { ipcMain } = require('electron');
const { resolve } = require('node:dns');
const { scheduler } = require('node:timers/promises');

ipcMain.on('save-schedule', (event, data) => {
    const { name, start, end, Bar, Num_Cor, State, Assigned_Chapters } = data;

    db.run(
        `INSERT INTO schedules 
        (name, start_date, end_date, completion_Bar, Number_Of_Courses, State) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [name, start, end, Bar, Num_Cor, State],
        function (err) {

            if (err) {
                console.log(err);
                event.reply('schedule-saved', { success: false });
                return;
            }

            console.log("✅ Schedule saved");

            // save assigned chapters
            Assigned_Chapters.forEach(ch => {
                db.run(
                    `INSERT INTO Assigned_Chapters (Schedule_Name, DATE, Count) 
                     VALUES (?, ?, ?)`,
                    [name, ch._DATE, ch._Number_Of_Chapters]
                );
            });

            event.reply('schedule-saved', { success: true });
        }
    );
});


ipcMain.on('save-course', (event, data) => {
  const { name, schedule_Name, number_of_chapters } = data;

  db.run(
      `INSERT INTO courses 
      (name, schedule_Name, Number_Of_Chapters, Number_Of_Completed_Chapters, State) 
      VALUES (?, ?, ?, ?, ?)`,
      [name, schedule_Name, number_of_chapters, 0, "Not-Completed"],
      (err) => {
          if (err) console.log(err);
          else console.log("✅ Course saved");
      }
  );
});

ipcMain.on('save-chapter', (event, data) => {
    const { name, date, ForSchedule, ForCourse } = data;

    db.run(
        `INSERT INTO chapters 
        (name, date, ForSchedule, ForCourse, State) 
        VALUES (?, ?, ?, ?, ?)`,
        [name, date, ForSchedule, ForCourse, "Not-Completed"],
        (err) => {
            if (err) console.log(err);
            else console.log("✅ Chapter saved");
        }
    );
});


ipcMain.handle('get-schedules', async () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM schedules", [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
});


ipcMain.handle('get-schedule',async (event , data) =>{
  const name =data;
  return new Promise((resolve,reject) =>{
    db.all("SELECT * FROM schedules WHERE name = ?",[name],(err,schedule)=>{
      if(err) reject(err)
      else resolve(schedule)
    });
  });
});


ipcMain.handle('get-courses', async (event , data)=>{
  const name =data;
  return new Promise((resolve,reject)=>{
    db.all("SELECT * FROM courses WHERE schedule_name = ?",[name],(err,courses)=>{
      if(err) reject(err);
      else resolve(courses);   
    });
  });
});


ipcMain.handle('get-chapters',async (event,data)=>{
  const name = data;
  return new Promise((resolve,reject)=>{
    db.all("SELECT * FROM chapters WHERE ForSchedule = ?",[name],(err,chapters)=>{
      if(err) reject(err);
      else resolve(chapters);   
    });
  });
})

ipcMain.handle('get-assigned-chapters',async (event,data)=>{
  const name = data;
  return new Promise((resolve,reject)=>{
    db.all("SELECT * FROM Assigned_Chapters WHERE Schedule_Name = ?",[name],(err,assigned_chapter)=>{
      if(err) reject(err);
      else resolve(assigned_chapter);   
    });
  });
})

