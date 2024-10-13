# LLM DevMate

**LLM DevMate** is a Visual Studio Code extension designed to assist developers by providing utilities to work with Large Language Models (LLMs). This extension enables users to:

- Calculate the number of tokens in the current file, selection, or entire repository.
- Copy the content of the current file, including its relative path, to the clipboard.
- Copy the entire repository (excluding files in `.gitignore`) to the clipboard, along with the relative paths of the files.

## Features

1. **Count Tokens in Current File**  
   This command allows you to count the number of tokens in the currently open file. This is especially useful when working with LLMs where token limits are important.

2. **Count Tokens in Selection**  
   If you only want to count the tokens in a specific selection, this command will calculate the token count for the selected text within the file.

3. **Count Tokens in Entire Repository**  
   This feature will calculate the number of tokens for all files in the repository, excluding files listed in `.gitignore`.

4. **Copy Current File to Clipboard**  
   Copy the entire content of the currently open file, along with its relative path in the project, to the clipboard.

5. **Copy Entire Repository to Clipboard**  
   Copy the content of all files in the repository, excluding files in `.gitignore`, along with their relative paths to the clipboard. This is useful for preparing large prompts or input for LLMs.

## Installation

1. Clone the repository or download the files to your local machine.
2. Open the project in Visual Studio Code.
3. Run the extension in a VS Code development environment by pressing `F5`.

## Commands

Here are the available commands in **LLM DevMate**:

- `LLM DevMate: Count Tokens in Current File`: Count tokens in the currently open file.
- `LLM DevMate: Count Tokens in Selection`: Count tokens in the currently selected text.
- `LLM DevMate: Count Tokens in Repo`: Count tokens in the entire repository (excluding `.gitignore` files).
- `LLM DevMate: Copy Current File to Clipboard`: Copy the content of the current file along with its relative path to the clipboard.
- `LLM DevMate: Copy Repo to Clipboard`: Copy the entire repository content, excluding `.gitignore` files, to the clipboard.

These commands can be executed through the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) or by right-clicking in the editor.

## Usage

### Counting Tokens

1. Open a file or select a portion of the file.
2. Use the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and type:
   - `LLM DevMate: Count Tokens in Current File` for the entire file.
   - `LLM DevMate: Count Tokens in Selection` for a specific selection.
   - `LLM DevMate: Count Tokens in Repo` for the entire repository.

### Copying Files to Clipboard

- To copy the content of the current file to the clipboard, including the file’s relative path, use the command `LLM DevMate: Copy Current File to Clipboard`.
- To copy the content of the entire repository to the clipboard, excluding files listed in `.gitignore`, use the command `LLM DevMate: Copy Repo to Clipboard`.

## Configuration

The extension supports token calculation for different models. You can configure which LLM model to use for token counting in your VS Code settings. By default, **GPT-3.5 Turbo** is used, but other models like **GPT-4** can be selected.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
