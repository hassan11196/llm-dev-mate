const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { encoding_for_model } = require('tiktoken'); // TikToken for tokenization
const ignore = require('ignore');

// Function to dynamically import clipboardy (since it is an ES Module)
async function getClipboardy() {
	// Dynamically import clipboardy and access the default export
	const clipboardyModule = await import('clipboardy');
	return clipboardyModule.default;
}

// Function to get the currently selected model from the user configuration
function getSelectedModel() {
	const config = vscode.workspace.getConfiguration('llmDevMate');
	return config.get('selectedModel', 'gpt-3.5-turbo'); // Default to 'gpt-3.5-turbo' if not configured
}

// Function to get token count for a given text using the selected model
function getTokenCount(text) {
	const model = getSelectedModel();
	const enc = encoding_for_model(model);
	const tokens = enc.encode(text);
	return tokens.length;
}

// Function to load and parse .gitignore
function loadGitignore(workspacePath) {
	const gitignorePath = path.join(workspacePath, '.gitignore');
	if (fs.existsSync(gitignorePath)) {
		const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
		return ignore().add(gitignoreContent);
	}
	return ignore(); // Return an empty ignore instance if no .gitignore found
}

// Command to copy the entire repo (excluding .gitignore files) to clipboard
async function copyRepoToClipboard() {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (workspaceFolders) {
		let repoContent = ''; // Store the content of the entire repo here
		for (const folder of workspaceFolders) {
			const ig = loadGitignore(folder.uri.fsPath); // Load .gitignore
			const files = await vscode.workspace.findFiles(new vscode.RelativePattern(folder, '**/*'));

			for (const file of files) {
				const relativePath = path.relative(folder.uri.fsPath, file.fsPath);

				// Skip ignored files
				if (ig.ignores(relativePath)) {
					continue;
				}

				const document = await vscode.workspace.openTextDocument(file);
				const text = document.getText();
				repoContent += `\n\n// File: ${relativePath}\n` + text; // Add file content and its relative path to repoContent
			}
		}

		// Dynamically import clipboardy and copy the content to the clipboard
		const clipboardy = await getClipboardy();
		try {
			await clipboardy.write(repoContent);
			vscode.window.showInformationMessage('Entire repository copied to clipboard (excluding .gitignore files).');
		}
		catch (error) {
			vscode.window.showErrorMessage('Failed to copy repository to clipboard.', error);
		}

	}
}



// Function to get the base directory (project/repo name)
function getBaseDirectoryName() {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (workspaceFolders) {
		const workspaceFolder = workspaceFolders[0]; // Assuming the first workspace folder
		return path.basename(workspaceFolder.uri.fsPath); // Return the base directory name
	}
	return null;
}

// Command to copy current file content and its relative path to clipboard
async function copyCurrentFileToClipboard() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage('No active editor. Please open a file.');
		return;
	}

	const document = editor.document;
	const workspaceFolders = vscode.workspace.workspaceFolders;

	if (!workspaceFolders) {
		vscode.window.showErrorMessage('No workspace folder open.');
		return;
	}

	// Get the base directory name (repo or project name)
	const baseDirName = getBaseDirectoryName();

	for (const folder of workspaceFolders) {
		const relativePath = path.relative(folder.uri.fsPath, document.uri.fsPath);
		const text = document.getText();

		// Add the base directory name, relative path, and file content
		const contentToCopy = `// Project: ${baseDirName}\n// File: ${relativePath}\n${text}`;

		// Dynamically import clipboardy and copy the content to the clipboard
		try {
			const clipboardy = await getClipboardy();
			await clipboardy.write(contentToCopy);
			vscode.window.showInformationMessage(`File content copied to clipboard (Project: ${baseDirName}, File: ${relativePath}).`);
		} catch (error) {
			vscode.window.showErrorMessage(`Failed to copy to clipboard: ${error.message}`);
		}
		break;
	}
}

// Command to count tokens in the whole repository, excluding .gitignore files
async function countTokensInRepo() {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (workspaceFolders) {
		let totalTokenCount = 0;
		for (const folder of workspaceFolders) {
			const ig = loadGitignore(folder.uri.fsPath);
			const files = await vscode.workspace.findFiles(new vscode.RelativePattern(folder, '**/*'));

			for (const file of files) {
				const relativePath = path.relative(folder.uri.fsPath, file.fsPath);

				// Skip ignored files
				if (ig.ignores(relativePath)) {
					continue;
				}

				const document = await vscode.workspace.openTextDocument(file);
				const text = document.getText();
				totalTokenCount += getTokenCount(text);
			}
		}
		vscode.window.showInformationMessage(`Total token count for repository (excluding .gitignore files): ${totalTokenCount}`);
	}
}

// Command to count tokens in the current file
function countTokensInFile() {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const document = editor.document;
		const text = document.getText();
		const tokenCount = getTokenCount(text);
		vscode.window.showInformationMessage(`Token count for current file: ${tokenCount}`);
	}
}

// Command to count tokens in the current selection
function countTokensInSelection() {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const selection = editor.selection;
		const text = editor.document.getText(selection);
		const tokenCount = getTokenCount(text);
		vscode.window.showInformationMessage(`Token count for selection: ${tokenCount}`);
	}
}

// Register all commands
function activate(context) {
	context.subscriptions.push(vscode.commands.registerCommand('llmDevMate.countTokensInRepo', countTokensInRepo));
	context.subscriptions.push(vscode.commands.registerCommand('llmDevMate.countTokensInFile', countTokensInFile));
	context.subscriptions.push(vscode.commands.registerCommand('llmDevMate.countTokensInSelection', countTokensInSelection));
	context.subscriptions.push(vscode.commands.registerCommand('llmDevMate.copyRepoToClipboard', copyRepoToClipboard)); // Register new command
	context.subscriptions.push(vscode.commands.registerCommand('llmDevMate.copyCurrentFileToClipboard', copyCurrentFileToClipboard)); // Register new command
}

// Deactivate the extension
function deactivate() { }

module.exports = {
	activate,
	deactivate
};
