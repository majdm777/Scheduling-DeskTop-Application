const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'study.db'));

db.serialize(() => {

    db.run(`CREATE TABLE IF NOT EXISTS schedules (
        name TEXT PRIMARY KEY,
        start_date TEXT,
        end_date TEXT,
        completion_Bar INTEGER,
        Number_Of_Courses INTEGER,
        State TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        schedule_Name TEXT,
        Number_Of_Chapters INTEGER,
        Number_Of_Completed_Chapters INTEGER,
        State TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS chapters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        date TEXT,
        ForSchedule TEXT,
        ForCourse TEXT,
        State TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Assigned_Chapters(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Schedule_Name TEXT,
        DATE TEXT,
        Count INTEGER
    )`);

});

module.exports = db;