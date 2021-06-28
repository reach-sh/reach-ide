/* --------------------------------------------------------------------------------------------
 * Copyright for portions from https://github.com/microsoft/vscode-extension-samples/tree/master/lsp-sample
 * are held by (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *
 * Copyright (c) 2020 Eric Lau. All rights reserved.
 * Licensed under the Eclipse Public License v2.0
 *
 * Copyright (c) 2021 Reach Platform, Inc. All rights reserved.
 * Licensed under the Eclipse Public License v2.0
 * ------------------------------------------------------------------------------------------ */

import * as path from 'path';
import { workspace, ExtensionContext, commands, window, env, ViewColumn, Uri, WorkspaceFolder } from 'vscode';
import { exec } from 'child_process';
import { initButtons } from './buttons';
import {CONSTANTS} from './CONSTANTS';
import {CMD_HELPER,URL_HELPER} from './ENUMS';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind,
} from 'vscode-languageclient';
import { CommandsTreeDataProvider, DocumentationTreeDataProvider, HelpTreeDataProvider } from './CommandsTreeDataProvider';

let client: LanguageClient;
let terminal;
let rootFolder: string;

const SETTINGS_ROOT:string = `${rootFolder}${path.sep}${CONSTANTS.VS_CODE_SETTING_JSON}`;

export function activate(context: ExtensionContext) {
	// The server is implemented in node
	let serverModule = context.asAbsolutePath(
		path.join(CONSTANTS.PATH_SERVER_JOIN, CONSTANTS.PATH_SERVER_OUT, CONSTANTS.PATH_SERVER_JS_S)
	);
	// The debug options for the server
	// --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
	let debugOptions = { execArgv: [CONSTANTS.SERVER_DEBUG_OPTIONS_NOLAZY, CONSTANTS.SERVER_DEBUG_OPTIONS_INSPECT_6009] };

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	let serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		}
	};

	terminal = window.createTerminal({ name: CONSTANTS.REACH_IDE_S });
	const reachExecutablePath = workspace.getConfiguration().get(CONSTANTS.REACH_EXECUTABLE_PATH) as string;
	const wf = workspace.workspaceFolders[0].uri.path || CONSTANTS.WORKSPACE_FOLDERS_DOT;
	const reachPath = (reachExecutablePath === CONSTANTS.REACH_PATH)
		? path.join(wf, CONSTANTS.JOIN_REACH)
		: reachExecutablePath;
	registerCommands(context, reachPath);


	// Options to control the language client
	let clientOptions: LanguageClientOptions = {
		// Register the server for Reach .rsh documents
		documentSelector: [
			{
			  pattern: CONSTANTS.CREATE_FILESYSTEM_WATCHER_PARAM,
			  scheme: CONSTANTS.SCHEME
			}
		],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher(CONSTANTS.CREATE_FILESYSTEM_WATCHER_PARAM)
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		CONSTANTS.REACH_CLIENT_ID,
		CONSTANTS.REACH_IDE_S,
		serverOptions,
		clientOptions
	);

	// Start the client. This will also launch the server
	client.start();

	initButtons(context);

	// Inject association for .rsh file type
	if (workspace.workspaceFolders !== undefined) {
		rootFolder = CONSTANTS.url.fileURLToPath( workspace.workspaceFolders[0].uri.toString() );
	}
	associateRshFiles();

	window.registerTreeDataProvider(CONSTANTS.REACH_COMMANDS, new CommandsTreeDataProvider());
	window.registerTreeDataProvider(CONSTANTS.REACH_HELP, new HelpTreeDataProvider());
	window.registerTreeDataProvider(CONSTANTS.REACH_DOCS, new DocumentationTreeDataProvider());
}

const commandHelper = (context, reachPath) => (label) => {
	const disposable = commands.registerCommand(`${CONSTANTS.JOIN_REACH}.${label}`, () => {
		terminal.show();
		terminal.sendText(`${reachPath}${label}`);
	});
	context.subscriptions.push(disposable);
};

const urlHelper = (context, label, url) => {
	const disposable = commands.registerCommand(`${CONSTANTS.JOIN_REACH}.${label}`, () => {
		env.openExternal(Uri.parse(url));
	});
	context.subscriptions.push(disposable);
};

function registerCommands(context: ExtensionContext, reachPath: string) {
	const cmdHelper = commandHelper(context, reachPath);
	
	for (const value in CMD_HELPER) {
		cmdHelper(value);
	}
	
	urlHelper(context, URL_HELPER.DOCS, URL_HELPER.DOCS_URL);
	urlHelper(context, URL_HELPER.ISSUE, URL_HELPER.ISSUE_URL);
	urlHelper(context, URL_HELPER.DISCORD, URL_HELPER.DISCORD_URL);
	urlHelper(context, URL_HELPER.GIST, URL_HELPER.GIST_URL);

}

function associateRshFiles() {
	exec(`${CONSTANTS.MKDIR_P}${rootFolder}${path.sep}${CONSTANTS.VSCODE_DOT_EXT}`, (error: { message: any; }, stdout: any, stderr: any) => {
		if (error) {
			console.error(`${CONSTANTS.CANNOT_CREATE_SETTINGS}${error.message}`);
			return;
		}
		if (stderr) {
			console.error(`${CONSTANTS.CANNOT_CREATE_SETTINGS}${stderr}`);
			return;
		}
		injectRshFileAssocation();
	});
}

function injectRshFileAssocation() {
	const settingsFile:string = SETTINGS_ROOT;

	CONSTANTS.fs.readFile(settingsFile, function (err: any, content: string) {
		let parseJson: { [x: string]: { [x: string]: string; }; };
		try {
			parseJson = JSON.parse(content);
		} catch {
			parseJson = {};
		}
		let fileAssoc = parseJson[CONSTANTS.FILE_ASSOCIATIONS];
		if (fileAssoc === undefined) {
			parseJson[CONSTANTS.FILE_ASSOCIATIONS] = { REACH_FILE_EXT: CONSTANTS.JAVASCRIPT };
		} else {
			parseJson[CONSTANTS.FILE_ASSOCIATIONS][CONSTANTS.REACH_FILE_EXT] = CONSTANTS.JAVASCRIPT;
		}
		CONSTANTS.fs.writeFile(settingsFile, JSON.stringify(parseJson), function (err: any) {
			if (err) {
				console.error(`${CONSTANTS.CANNOT_CREATE_SETTINGS}${err}`);
				return;
			}
		});
	});
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
