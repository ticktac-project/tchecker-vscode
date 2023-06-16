# Requirements

- Visual Studio Code  (>= 1.78)
- Node.js (>= 14.17)

# Installing TChecker-VSCode

## Clone the repository:

```
git clone https://github.com/ticktac-project/tchecker-vscode.git
```
This will create a directory tchecker-vscode in the current directory, which will contain the entire extension.

## Install all necessary npm modules:

Run in the cloned folder:
```
npm install
```
This installs all necessary npm modules in both the client and server folder.

## Compile the client and the server:

```
npm run compile
```
This compiles the client and server.

## Open VS Code and run in the Command Palette:

```
Developer: Install Extension from Location
```

Then select the cloned repository.

# Configure the extension

## Detail the TChecker path

In order to use TChecker tools, it is essential to:
- go in VS Code ```Settings```
- search for ```TChecker```
- put the build path in the ```Path``` box
