import * as fs from "fs";
import * as vscode from "vscode";

import { getNonce } from "./getNonce";

export function getWebviewHtml(webview: vscode.Webview, extensionUri: vscode.Uri) {
    const scriptUri = webview.asWebviewUri(
        vscode.Uri.joinPath(extensionUri, "dist", "webview.js")
    );
    const styleUri = webview.asWebviewUri(
        vscode.Uri.joinPath(extensionUri, "dist", "webview.css")
    );
    const nonce = getNonce();
    const htmlPath = vscode.Uri.joinPath(extensionUri, "media", "index.html").fsPath;

    return fs
        .readFileSync(htmlPath, "utf8")
        .replace(/\{\{nonce\}\}/g, nonce)
        .replace("{{cspSource}}", webview.cspSource)
        .replace("{{styleUri}}", styleUri.toString())
        .replace("{{scriptUri}}", scriptUri.toString());
}