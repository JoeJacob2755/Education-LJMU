// Modules to control application life and create native browser window
// require('@electron/remote').initialize();
const { app, BrowserWindow, Tray, nativeImage } = require('electron');
const path = require('path');
const url = require('url');

exports.fs = require('fs');

console.log('Electron started');

function createWindow() {
    console.log('creating window');
    // Create the browser window.

    // let tray = new Tray();

    const mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        titleBarStyle: 'hidden',
        icon: nativeImage.createFromPath(path.join(__dirname, 'favicon.ico')),
        frame: process.platform === 'darwin',
        title: 'DeepTrack 2.0',
        // icon: path.join(__dirname, 'favicon16@4x.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            webSecurity: false,
            enableRemoteModule: true,
        },
    });

    // Start the python server
    try {
        createPyProc();
    } catch (error) {
        console.log("Couldn't start python server.");
    }

    // and load the index.html of the app.
    const startUrl =
        process.env.ELECTRON_START_URL ||
        url.format({
            pathname: path.join(__dirname, '../build/index.html'),
            protocol: 'file:',
            slashes: true,
        });

    mainWindow.loadURL(startUrl);
}

let python_process = null;

const createPyProc = () => {
    python_process = start_server();

    exports.logger = () => {
        return python_process;
    };

    exports.restart_server = () => {
        python_process.kill();
        start_server();
    };
};

const start_server = () => {
    let path_to_python_dir = path.join(__dirname, '..', 'python');

    // When in production, the path to the python files is slightly different. This corrects this.
    // In development, this command does nothing.
    path_to_python_dir = path_to_python_dir.replace('app.asar', 'app.asar.unpacked');

    // The root working directory of the pythonn file
    // let root = path.resolve(__dirname + '/../').replace('app.asar', 'app.asar.unpacked');

    // const path_to_exe_file = path.join(path_to_python_dir, "dist", "server", "server")
    return path_to_python_dir;

    // Start the python server
    // if (process.platform === 'win32') {
    //     return require('child_process').spawn(path_to_exe_file + ".exe", ['-u'], { cwd: root });
    // } else {
    //     return require('child_process').spawn(path_to_exe_file, ['-u'], { cwd: root });
    // }
};

const exitPyProc = () => {
    python_process.kill();
    python_process = null;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('will-quit', exitPyProc);
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
