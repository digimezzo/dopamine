import { Injectable } from '@angular/core';
import { Logger } from '../../common/logger';
import { AudioOutputDeviceModel } from './audio-output-device.model';

@Injectable({ providedIn: 'root' })
export class AudioOutputDeviceService {
    public constructor(private logger: Logger) {}

    public async getAudioOutputDevicesAsync(): Promise<AudioOutputDeviceModel[]> {
        try {
            // Device labels are only populated once media permissions have been granted. Electron
            // apps are trusted by default, so labels are typically available without extra prompts.
            const devices: MediaDeviceInfo[] = await navigator.mediaDevices.enumerateDevices();

            // Chromium adds synthetic 'default'/'communications' pseudo-devices that duplicate our own "system default" option.
            return devices
                .filter((device) => device.kind === 'audiooutput' && device.deviceId !== 'default' && device.deviceId !== 'communications')
                .map((device) => new AudioOutputDeviceModel(device.deviceId, device.label || device.deviceId));
        } catch (e: unknown) {
            this.logger.error(e, 'Could not get audio output devices', 'AudioOutputDeviceService', 'getAudioOutputDevicesAsync');

            return [];
        }
    }
}
