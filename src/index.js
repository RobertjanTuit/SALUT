/* eslint-disable no-cond-assign */
/* eslint-disable no-case-declarations */
/* eslint-disable no-new */
import { Program } from './core/Program.js';
import { SoundSwitchClient } from './modules/SoundSwitchClient.js';
import { status } from './stores.js';
import ProgramTerminal from './core/ProgramTerminal.js';
import { VirtualDJServer } from './modules/VirtualDJServer.js';
import { VirtualDJSoundSwitchBridge } from './modules/VirtualDJSoundSwitchBridge.js';
import { SongCatalog } from './songs/SongCatalog.js';
import { ResolumeOSCCLient } from './modules/ResolumeOSC.js';
import config from 'config';
import quitOnSrcChange from './core/quitOnSrcChange.js';
import { ProcessManager } from './core/ProcessManager.js';
import { ResolumeWebClient } from './modules/ResolumeWebClient.js';
import { SoundSwitchMidiController, VirtualDJMidi as VirtualDJMidiController } from './modules/VirtualDJMidiController.js';
import { Logger } from './core/Logger.js';
import termkit from 'terminal-kit';
export const term = termkit.terminal;

const appsConfig = config.get('apps');
const settings = config.get('settings');

const soundSwitchMidiController = new SoundSwitchMidiController({ midiDeviceName: appsConfig.soundSwitch.midiDeviceName, midiMappings: appsConfig.soundSwitch.midiMappings, midiDebugNote: appsConfig.soundSwitch.midiDebugNote });
const soundSwitchClient = new SoundSwitchClient(status, { port: appsConfig.soundSwitch.port, host: appsConfig.soundSwitch.host });

const virtualDJServer = new VirtualDJServer(status, { port: appsConfig.virtualDJ.port, host: appsConfig.virtualDJ.host });

const virtualDJMidiController = new VirtualDJMidiController({ midiDeviceName: appsConfig.virtualDJ.midiDeviceName, midiMappings: appsConfig.virtualDJ.midiMappings, midiDebugNote: appsConfig.virtualDJ.midiDebugNote });

const virtualDJSoundSwitchBridge = new VirtualDJSoundSwitchBridge(status, soundSwitchClient, virtualDJServer);

const resolumeOSCCLient = new ResolumeOSCCLient({ port: appsConfig.resolume.oscPort, host: appsConfig.resolume.oscHost });
const resolumeWebClient = new ResolumeWebClient({ port: appsConfig.resolume.webPort, host: appsConfig.resolume.webHost });

const programTerminal = new ProgramTerminal();
const songCatalog = new SongCatalog({ reloadOnChange: appsConfig.virtualDJ.databaseReloadOnChange });
const processManager = new ProcessManager({ appsConfig, virtualDJMidiController, virtualDJServer });

const program = new Program({ resolumeWebClient, processManager, appsConfig, virtualDJServer, soundswitchClient: soundSwitchClient, virtualDJSoundSwitchBridge, songCatalog, programTerminal, resolumeOSCCLient });
// console.log(JSON.stringify(appsConfig.virtualDJ.midiMappings, null, 2));
program.start();

// DEBUG
// soundSwitchClient.connect();
// virtualDJServer.start();
// setInterval(() => {
//  while (Logger.logLines && Logger.logLines.length) {
//    term(Logger.logLines.shift() + '\n');
//  }
// }, 1000);
// END DEBUG

quitOnSrcChange(settings, program, async () => {
  if (appsConfig.virtualDJ.killOnReloadQuit) {
    await processManager.killProcess('virtualDJ');
  }
});

if (appsConfig.virtualDJ.startOnLaunch) {
  processManager.startProcess('virtualDJ', true);
}
