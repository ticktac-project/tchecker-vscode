# Requirements

- Visual Studio Code  (>= 1.78)
- Node.js (>= 14.17)
- TChecker (>= v0.6)

# How to install TChecker VS Code extension

## Install an official release

The easiest way to install TChecker VS Code extension is to download and install an official release from the [GitHub release page](https://github.com/ticktac-project/tchecker-vscode/releases). Download one of the release `.vsix` file (the most recent is probably the best choice), then install the extension running the command `code --install-extension tchecker-vscode-0.1.0.vsix` from a terminal (replacing `tchecker-vscode-0.1.0.vsix` with actual name of the downloaded file).

Please, read the instructions on how to configure the extension below.

## Installation from the source code

- first, clone the repository:
```
git clone https://github.com/ticktac-project/tchecker-vscode.git
```
This will create a directory `tchecker-vscode` in the current directory, which will contain the entire extension.

- then, install all necessary npm modules running the command below inside directory `tchecker-vscode`.
```
npm install
```

- next, compile the source code (again, within directory `tchecker-vscode`):
```
npm run compile
```

- finally, manually install the extension with `Developer: Install Extension from Location` from the Command Palette of VS Code, selecting the cloned repository `tchecker-vscode`.

# Configure the extension

From the activity bar, select `Extensions`. Then, from the contextual menu of the `TChecker VSCode` extension, choose `Extension Settings`.

This extension requires access to [TChecker](https://github.com/ticktac-project/tchecker) tools. Set `Path` to a directory containing TChecker tools `tck-syntax`, `tck-reach`, `tck-liveness` and `tck-simulate`.

Then, requirement `Tck-simulate` allows to define the command that is used to launch the simulation. Run `tck-simulate -h` from a terminal to see available options. The default value `tck-simulate -i` runs the interactive simulation (which is likely what you want).

Finally, the last option `Tck-syntax` permits to define the command used for syntax checking. Running `tck-synax -h` from a terminal will list all the available options. The default command `tck-syntax -c` runs syntax verification (which is what is expected).
