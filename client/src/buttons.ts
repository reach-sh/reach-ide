import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';

const REACH_COMPILE_S:string = 'Reach Compile';
const REACH_COMPILE:string = 'reach.compile';
const REACH_RUN_S:string = 'Reach Run';
const REACH_RUN:string = 'reach.run';
const POST_ISSUE_S:string = 'Post Issue';
const POST_ISSUE:string = 'reach.issue';
const CREATE_GIST_S:string = 'Create Gist';
const CREATE_GIST:string = 'reach.gist';

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
		[REACH_COMPILE_S, REACH_COMPILE ],
		[REACH_RUN_S, REACH_RUN],
		[POST_ISSUE_S, POST_ISSUE],
		[CREATE_GIST_S, CREATE_GIST],
	]);
}

export const initButtons = (context: ExtensionContext) => {
	showButtons();
};
