const customTitlebar = require('custom-electron-titlebar');
const { join } = require('path');

window.addEventListener('DOMContentLoaded', () => {
    new customTitlebar.Titlebar({
        backgroundColor: customTitlebar.Color.fromHex('#111827'),
        shadow: true,
        icon: './favicon.ico',
    });
});
