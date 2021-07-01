import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';

const REACH_COMPILE_TEXT : string = 'Reach Compile';
const REACH_COMPILE_CMD : string = 'reach.compile';
const REACH_RUN_TEXT : string = 'Reach Run';
const REACH_RUN_CMD : string = 'reach.run';
const POST_ISSUE_TEXT : string = 'Post Issue';
const POST_ISSUE_CMD : string = 'reach.issue';
const CREATE_GIST_TEXT : string = 'Create Gist';
const CREATE_GIST_CMD : string = 'reach.gist';

let shownButtons = [];

function createButtons(buttons) {
	buttons.forEach(button => {
		const buttonBarItem = vscode.window.createStatusBarItem(1, 0);
		buttonBarItem.text = button[0];
		buttonBarItem.command = button[1];
		buttonBarItem.show();
		shownButtons.push(buttonBarItem);
	});
}

function removeAllButtons() {
	return new Promise<void>((resolve, reject) => {
		shownButtons.forEach(button => button.hide());
		shownButtons = [];
		resolve();
	});
}

function showButtons() {
	createButtons([
		[REACH_COMPILE_TEXT, REACH_COMPILE_CMD ],
		[REACH_RUN_TEXT, REACH_RUN_CMD],
		[POST_ISSUE_TEXT, POST_ISSUE_CMD],
		[CREATE_GIST_TEXT, CREATE_GIST_CMD],
	]);
}

export const initButtons = (context: ExtensionContext) => {
	showButtons();
};
