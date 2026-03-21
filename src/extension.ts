// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { HelloWorldPanel, IconForgeViewProvider } from './webview/init';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "iconforge" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('iconforge.helloWorld', () => {
		HelloWorldPanel.render(context.extensionUri);
	});

	const provider = new IconForgeViewProvider(context.extensionUri);
	vscode.commands.executeCommand('setContext', 'iconforge.activeTab', 'icons');
	const viewProvider = vscode.window.registerWebviewViewProvider(
		IconForgeViewProvider.viewType,
		provider
	);

	const selectTab = async () => {
		const picked = await vscode.window.showQuickPick(
			[
				{ label: 'Icons', description: 'Search and insert icon SVGs', mode: 'icons' as const },
				{ label: 'Badges', description: 'Browse badge templates', mode: 'badges' as const },
			],
			{ placeHolder: 'Select IconForge tab' }
		);

		if (!picked) {
			return;
		}

		provider.postTitleAction('switchMode', picked.mode);
		vscode.commands.executeCommand('setContext', 'iconforge.activeTab', picked.mode);
	};

	const activeIconsTitleCommand = vscode.commands.registerCommand('iconforge.activeTab.icons', selectTab);
	const activeBadgesTitleCommand = vscode.commands.registerCommand('iconforge.activeTab.badges', selectTab);
	const selectTabFromTitleCommand = vscode.commands.registerCommand('iconforge.selectTabFromTitle', selectTab);

	context.subscriptions.push(
		disposable,
		viewProvider,
		activeIconsTitleCommand,
		activeBadgesTitleCommand,
		selectTabFromTitleCommand
	);
}

// This method is called when your extension is deactivated
export function deactivate() { }
