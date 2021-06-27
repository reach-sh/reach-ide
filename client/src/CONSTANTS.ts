const fs = require('fs');
const url = require('url');

let rootFolder: string;
const REACH_IDE_S:string = 'Reach IDE';
const PATH_SERVER_JOIN:string = 'server';
const PATH_SERVER_OUT:string = 'out';
const PATH_SERVER_JS_S:string = 'server.js';
const FILE_ASSOCIATIONS:string = 'files.associations';
const REACH_FILE_EXT:string = '*.rsh';
const JAVASCRIPT:string = 'javascript';
const SERVER_DEBUG_OPTIONS_NOLAZY:string = '--nolazy';
const REACH_EXECUTABLE_PATH:string ='reachide.executableLocation';
const SERVER_DEBUG_OPTIONS_INSPECT_6009 = '--inspect=6009';
const CANNOT_CREATE_SETTINGS:string = `Could not create .vscode/settings.json:`;
const REACH_PATH:string = './reach';
const REACH_CLIENT_ID:string = 'reachide';
const CREATE_FILESYSTEM_WATCHER_PARAM:string = '**/*.rsh';
const SCHEME:string = 'file';
const JOIN_REACH:string = 'reach';
const WORKSPACE_FOLDERS_DOT:string = '.';
const REACH_COMMANDS:string = 'reach-commands';
const REACH_HELP:string = 'reach-help';
const REACH_DOCS:string = 'reach-docs';
const VSCODE_DOT_EXT:string = '.vscode';
const MKDIR_P:string = 'mkdir -p';

enum CMD_HELPER {
	COMPILE = <any>'compile',
	RUN = <any>'run',
	CLEAN = <any>'clean',
	UPGRADE = <any>'upgrade',
	UPDATE = <any>'update',
	HASHES = <any>'hashes',
	VERSION = <any>'version',
	DOCKER_RESET = <any>'docker-reset',
	DEVNET = <any>'devnet',
	RPC_SERVER = <any>'rpc-server',
	RPC_RUN = <any>'run',
	RPC_REACT= <any>'react',
	SCAFFOLD = <any>'scaffold',
	DOWN = <any>'down',
	INIT = <any>'init'
  }

  enum URL_HELPER {
	DOCS = <any>'docs',
	DOCS_URL = <any>'https://docs.reach.sh/doc-index.html',
	ISSUE = <any>'issue',
	ISSUE_URL = <any>'https://github.com/reach-sh/reach-lang/issues/new',
	DISCORD = <any>'discord',
	DISCORD_URL = <any>'https://discord.gg/2XzY6MVpFH',
	GIST = <any>'gist',
	GIST_URL = <any>'https://gist.github.com/'
}