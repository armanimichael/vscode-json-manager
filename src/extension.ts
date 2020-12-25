// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

function logInfo(msg: string): void {
  vscode.window.showInformationMessage(msg);
}

function logError(msg: string): void {
  vscode.window.showErrorMessage(msg);
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // console.log('Congratulations, your extension "json-manager" is now actived!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'json-manager.removeclonedfields',
    async () => {
      const editor = vscode.window.activeTextEditor;

      const document = editor?.document;
      if (!document) {
        logError('Cannot load file!');
        return;
      }

      const uri = document.uri;
      const fileName = document.fileName;
      logInfo(fileName || '');

      const linesCount = Number(document?.lineCount);

      vscode.workspace.openTextDocument(uri).then(document => {
        const edit = new vscode.WorkspaceEdit();

        const range = new vscode.Range(
          new vscode.Position(0, 0),
          new vscode.Position(linesCount, 0),
        );

        edit.replace(
          uri,
          range,
          JSON.stringify(JSON.parse(document.getText())),
        );

        return vscode.workspace.applyEdit(edit).then(success => {
          if (success) {
            document.save();
            logInfo('File Updated!');
          } else {
            logError('Error!');
          }
        });
      });
    },
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
