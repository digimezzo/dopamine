import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PlayerSwitcherService {
    public switchToFullPlayer(): void {}

    public switchToCoverPlayer(): void {}

    public switchToMiniPlayer(): void {}
}
