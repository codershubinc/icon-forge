import * as fs from "fs";
import * as vscode from "vscode";

export class HelloWorldPanel {
    public static currentPanel: HelloWorldPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.html = this._getWebviewContent(this._panel.webview);
        this._panel.webview.onDidReceiveMessage(
            (message) => {
                switch (message.command) {
                    case "insertCode":
                        const editor = vscode.window.activeTextEditor;
                        if (editor) {
                            // Insert the SVG code at the user's cursor
                            editor.edit((editBuilder) => {
                                editBuilder.insert(editor.selection.active, message.text);
                            });
                            vscode.window.showInformationMessage("Asset Inserted!");
                        } else {
                            // Fallback if no file is open
                            vscode.env.clipboard.writeText(message.text);
                            vscode.window.showInformationMessage("Asset copied to clipboard!");
                        }
                        return;
                }
            },
            null,
            this._disposables
        );
    }


    public static render(extensionUri: vscode.Uri) {
        if (HelloWorldPanel.currentPanel) {
            HelloWorldPanel.currentPanel._panel.reveal(vscode.ViewColumn.One);
        } else {
            const panel = vscode.window.createWebviewPanel(
                "icon forge",
                "Icon Forge",
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    localResourceRoots: [
                        vscode.Uri.joinPath(extensionUri, "dist"),
                        vscode.Uri.joinPath(extensionUri, "media"),
                    ],
                }
            );

            HelloWorldPanel.currentPanel = new HelloWorldPanel(panel, extensionUri);
        }
    }

    public dispose() {
        HelloWorldPanel.currentPanel = undefined;

        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private _getWebviewContent(webview: vscode.Webview) {
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "dist", "webview.js")
        );
        const styleUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "dist", "webview.css")
        );
        const nonce = getNonce();

        const htmlPath = vscode.Uri.joinPath(this._extensionUri, "media", "index.html").fsPath;
        return fs
            .readFileSync(htmlPath, "utf8")
            .replace(/\{\{nonce\}\}/g, nonce)
            .replace("{{cspSource}}", webview.cspSource)
            .replace("{{styleUri}}", styleUri.toString())
            .replace("{{scriptUri}}", scriptUri.toString());
    }
}

function getNonce() {
    let text = "";
    const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export class IconForgeViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = "iconforge.mainView";

    constructor(private readonly _extensionUri: vscode.Uri) { }

    resolveWebviewView(webviewView: vscode.WebviewView) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this._extensionUri, "dist"),
                vscode.Uri.joinPath(this._extensionUri, "media"),
            ],
        };

        const scriptUri = webviewView.webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "dist", "webview.js")
        );
        const styleUri = webviewView.webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "dist", "webview.css")
        );
        const nonce = getNonce();

        const htmlPath = vscode.Uri.joinPath(this._extensionUri, "media", "index.html").fsPath;
        webviewView.webview.html = fs
            .readFileSync(htmlPath, "utf8")
            .replace(/\{\{nonce\}\}/g, nonce)
            .replace("{{cspSource}}", webviewView.webview.cspSource)
            .replace("{{styleUri}}", styleUri.toString())
            .replace("{{scriptUri}}", scriptUri.toString());

        webviewView.webview.onDidReceiveMessage((message) => {
            if (message.command === "insertCode") {
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                    editor.edit((editBuilder) => {
                        editBuilder.insert(editor.selection.active, message.text);
                    });
                    vscode.window.showInformationMessage("Asset Inserted!");
                } else {
                    vscode.env.clipboard.writeText(message.text);
                    vscode.window.showInformationMessage("Asset copied to clipboard!");
                }
            }
        });
    }
}
