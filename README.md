An interface for training and evaluating deep learning models, targeting microscopy. 

## Installation

### Windows

Download and run the installer from [here](https://github.com/softmatterlab/DeepTrack-2.0-app/releases/latest/download/DeepTrack.exe).
On first launch, you may encounter a warning that the program is not signed. For now, please disregard this warning as we work on a fix.

#### Known problems

White screen on boot, and ctrl+shift+i shows an error that zeromq could not be found. The solution is to install the vc_redist from here: https://support.microsoft.com/en-us/help/2977003/the-latest-supported-visual-c-downloads. Future versions will install this with the app.

### Mac

Download and run the installer from [here](https://github.com/softmatterlab/DeepTrack-2.0-app/releases/tag/v0.0.1/download/DeepTrack.dmg).
To launch the app, command click it in the and click run. You may encounter a warning that the program is not signed. For now, please disregard this warning as we work on a fix.

### Building from source

Needed: 
    
    Node
    Python>=3.6
    git

Create a folder and in a terminal run

    git clone https://github.com/softmatterlab/DeepTrack-2.0-app .
 
Then run
    
    npm install

followed by

    pip install numpy
    pip install -r requirements.txt
    
Note that numpy needs to be installed first, because scikit-image currently have some issues with installing if it isn't installed first.

One this is done, run, in order,

    npm run build
    npm run build-server

This will create the production version of the app. Now it can be run with

    npm run start-prod
