import * as vscode from "vscode";

type WebviewMessage = {
    command: string;
    text?: string;
    fileName?: string;
};

async function copyAsset(text: string) {
    await vscode.env.clipboard.writeText(text);
    vscode.window.showInformationMessage("Asset copied to clipboard!");
}

async function insertAsset(text: string) {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        await copyAsset(text);
        return;
    }

    await editor.edit((editBuilder) => {
        editBuilder.insert(editor.selection.active, text);
    });
    vscode.window.showInformationMessage("Asset Inserted!");
}

async function downloadAsset(text: string, fileName: string) {
    const activeEditorUri = vscode.window.activeTextEditor?.document.uri;
    const activeWorkspaceUri = activeEditorUri
        ? vscode.workspace.getWorkspaceFolder(activeEditorUri)?.uri
        : undefined;
    const workspaceUri = activeWorkspaceUri ?? vscode.workspace.workspaceFolders?.[0]?.uri;
    const defaultUri = workspaceUri
        ? vscode.Uri.joinPath(workspaceUri, fileName)
        : undefined;

    const targetUri = await vscode.window.showSaveDialog({
        defaultUri,
        filters: {
            SVG: ["svg"],
        },
        saveLabel: "Download Icon",
    });

    if (!targetUri) {
        return;
    }

    await vscode.workspace.fs.writeFile(targetUri, Buffer.from(text, "utf8"));
    vscode.window.showInformationMessage(`Icon saved to ${targetUri.fsPath}`);
}

export async function handleWebviewMessage(message: WebviewMessage) {
    switch (message.command) {
        case "insertCode":
            await insertAsset(message.text ?? "");
            return;
        case "copyCode":
            await copyAsset(message.text ?? "");
            return;
        case "downloadCode":
            await downloadAsset(message.text ?? "", message.fileName ?? "icon.svg");
            return;
        default:
            return;
    }
}