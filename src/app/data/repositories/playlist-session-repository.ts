/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@angular/core';
import { DatabaseFactory } from '../database-factory';
import { PlaylistSession } from '../../services/playlist-session/playlist-session';
import { PlaylistSessionRepositoryBase } from './playlist-session-repository.base';

@Injectable()
export class PlaylistSessionRepository implements PlaylistSessionRepositoryBase {
    public constructor(private databaseFactory: DatabaseFactory) {}

    public getSessions(): PlaylistSession[] {
        const database: any = this.databaseFactory.create();

        const sessionRows: Record<string, any>[] = database
            .prepare('SELECT PlaylistPath as playlistPath, LoopMode as loopMode, IsShuffled as isShuffled FROM PlaylistSession;')
            .all();
        const trackRows: Record<string, any>[] = database
            .prepare(
                'SELECT PlaylistPath as playlistPath, Path as path, IsPlayed as isPlayed FROM PlaylistSessionTrack ORDER BY PlaylistPath, OrderID;',
            )
            .all();

        const sessions: Map<string, PlaylistSession> = new Map();

        for (const row of sessionRows) {
            sessions.set(row.playlistPath, {
                playlistPath: row.playlistPath,
                trackPaths: [],
                playbackOrder: [],
                playedPaths: [],
                loopMode: row.loopMode,
                isShuffled: row.isShuffled === 1,
            });
        }

        for (const row of trackRows) {
            const session: PlaylistSession | undefined = sessions.get(row.playlistPath);

            if (session != undefined) {
                session.playbackOrder.push(row.path);

                if (row.isPlayed === 1) {
                    session.playedPaths.push(row.path);
                }
            }
        }

        for (const session of sessions.values()) {
            session.trackPaths = [...session.playbackOrder].sort();
        }

        return Array.from(sessions.values());
    }

    public saveSession(session: PlaylistSession): void {
        const database: any = this.databaseFactory.create();
        const played: Set<string> = new Set(session.playedPaths);

        database.exec('BEGIN TRANSACTION;');

        try {
            database.prepare('DELETE FROM PlaylistSessionTrack WHERE PlaylistPath = ?;').run(session.playlistPath);
            database.prepare('DELETE FROM PlaylistSession WHERE PlaylistPath = ?;').run(session.playlistPath);
            database
                .prepare('INSERT INTO PlaylistSession (PlaylistPath, LoopMode, IsShuffled) VALUES (?, ?, ?);')
                .run(session.playlistPath, session.loopMode, session.isShuffled ? 1 : 0);

            const insert: any = database.prepare(
                'INSERT INTO PlaylistSessionTrack (PlaylistPath, Path, OrderID, IsPlayed) VALUES (?, ?, ?, ?);',
            );

            session.playbackOrder.forEach((path: string, orderId: number) => {
                insert.run(session.playlistPath, path, orderId, played.has(path) ? 1 : 0);
            });

            database.exec('COMMIT;');
        } catch (e: unknown) {
            database.exec('ROLLBACK;');
            throw e;
        }
    }

    public deleteSession(playlistPath: string): void {
        const database: any = this.databaseFactory.create();

        database.exec('BEGIN TRANSACTION;');

        try {
            database.prepare('DELETE FROM PlaylistSessionTrack WHERE PlaylistPath = ?;').run(playlistPath);
            database.prepare('DELETE FROM PlaylistSession WHERE PlaylistPath = ?;').run(playlistPath);
            database.exec('COMMIT;');
        } catch (e: unknown) {
            database.exec('ROLLBACK;');
            throw e;
        }
    }
}
