import * as vscode from "vscode";

import { handleWebviewMessage } from "./utils/handleWebviewMessage";
import { getWebviewHtml } from "./utils/getWebviewHtml";

export class HelloWorldPanel {
    public static currentPanel: HelloWorldPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.html = getWebviewHtml(this._panel.webview, this._extensionUri);
        this._panel.webview.onDidReceiveMessage(
            handleWebviewMessage,
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
}

export class IconForgeViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = "iconforge.mainView";
    private _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) { }

    public postTitleAction(
        action: "refresh" | "clearSearch" | "focusSearch" | "switchMode",
        mode?: "icons" | "badges"
    ) {
        this._view?.webview.postMessage({
            command: "titleAction",
            action,
            mode,
        });
    }

    resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this._extensionUri, "dist"),
                vscode.Uri.joinPath(this._extensionUri, "media"),
            ],
        };

        webviewView.webview.html = getWebviewHtml(webviewView.webview, this._extensionUri);
        webviewView.webview.onDidReceiveMessage(handleWebviewMessage);
    }
}
