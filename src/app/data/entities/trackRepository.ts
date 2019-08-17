import { Injectable } from "@angular/core";
import LinvoDB from "linvodb3";
import { remote } from 'electron';
import { Track } from "./track";
import * as Bluebird from "bluebird";

@Injectable({
    providedIn: 'root'
})
export class TrackRepository {
    private trackModel: any;

    constructor() {
        LinvoDB.defaults.store = { db: require("level-js") };
        // LinvoDB.dbPath = remote.app.getPath("userData"); // This is ignored when using level-js
        this.trackModel = new LinvoDB("tracks", {});

        Bluebird.promisifyAll(this.trackModel);
    }

    public async addTrackAsync(): Promise<void> {
        let track: Track = new Track();
        track.path = "/my/path5";
        track.title = "my title 5";

        this.trackModel.saveAsync(track);
    }

    public async getAllTracksAsync(): Promise<Track[]> {
        let allTracks: Track[] = [];

        allTracks = await this.trackModel.findAsync({});

        for (let track of allTracks) {
            console.log("track.path=" + track.path);
        }

        return allTracks;
    }
}