const customTitlebar = require('custom-electron-titlebar');
const { join } = require('path');

const { Menu, MenuItem, BrowserWindow } = require('electron').remote;

const menu = new Menu();

menu.append(
    new MenuItem({
        label: 'File',
        submenu: [
            {
                label: 'New file',
                accelerator: 'CmdOrCtrl+N',
                click: () => {
                    BrowserWindow.getFocusedWindow().webContents.send('new-file');
                },
            },
            {
                label: 'Open file',
                accelerator: 'CmdOrCtrl+O',
                click: () => {
                    BrowserWindow.getFocusedWindow().webContents.send('open-file');
                },
            },
            {
                label: 'Project',
                type: 'separator',
            },
            {
                label: 'New project',
                accelerator: 'CmdOrCtrl+Shift+N',
                click: () => {
                    BrowserWindow.getFocusedWindow().webContents.send('new-project');
                },
            },
            {
                label: 'Open project',
                accelerator: 'CmdOrCtrl+Shift+O',
                click: () => {
                    BrowserWindow.getFocusedWindow().webContents.send('open-project');
                },
            },
        ],
    }),
);

menu.append(
    new MenuItem({
        role: 'viewMenu',
    }),
);

Menu.setApplicationMenu(menu);

window.addEventListener('DOMContentLoaded', () => {
    new customTitlebar.Titlebar({
        backgroundColor: customTitlebar.Color.fromHex('#111827'),
        shadow: true,
        menu: menu,
        icon: './favicon.ico',
    });
});
