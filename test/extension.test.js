const assert = require('assert');
const vscode = require('vscode');
const path = require('path');

// Get the path of the current extension under test
const extensionDevelopmentPath = path.resolve(__dirname, '../'); // This points to the root of your project

suite('LLM DevMate Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	// Ensure the extension is activated
	test('Extension should be activated', async () => {
		// Activate the extension by loading it from the local path
		const extension = vscode.extensions.all.find(ext => ext.extensionPath === extensionDevelopmentPath);
		assert.ok(extension, 'Extension is not found in the local path');
		await extension.activate();
		assert.ok(extension.isActive, 'Extension is not active');
	});

	// Test command to copy current file content to clipboard
	test('Should execute copyCurrentFileToClipboard command', async () => {
		const command = 'llmDevMate.copyCurrentFileToClipboard';
		const result = await vscode.commands.executeCommand(command);
		assert.strictEqual(result, undefined, 'Command copyCurrentFileToClipboard failed');
	});

	// Test command to count tokens in the current file
	test('Should execute countTokensInFile command', async () => {
		const command = 'llmDevMate.countTokensInFile';
		const result = await vscode.commands.executeCommand(command);
		assert.strictEqual(result, undefined, 'Command countTokensInFile failed');
	});

	// Test command to copy entire repo to clipboard
	test('Should execute copyRepoToClipboard command', async () => {
		const command = 'llmDevMate.copyRepoToClipboard';
		const result = await vscode.commands.executeCommand(command);
		assert.strictEqual(result, undefined, 'Command copyRepoToClipboard failed');
	});
});
