import { EventEmitter } from 'events';

// All logic and storage around songrequests happens in here. To keep things simple,
// we're just storing songrequests in memory. Every time you restart the server, all
// songrequests will be lost. For long term storage, you'd want to look into putting
// these into a database.

export interface SongRequest {
  id: number;
  time: number;
  name: string;
  content: string;
  hasPaid: boolean;
};

class SongRequestsManager extends EventEmitter {
  songRequests: SongRequest[] = [];

  // Add a new songrequest to the list
  addSongRequest(name: string, content: string): SongRequest {
    const songRequest = {
      name,
      content,
      id: Math.floor(Math.random() * 100000000) + 1000,
      time: Date.now(),
      hasPaid: false,
    };
    this.songRequests.push(songRequest);
    return songRequest;
  }

  // Gets a particular songrequest given an ID
  getSongRequest(id: number): SongRequest | undefined {
    return this.songRequests.find(p => p.id === id);
  }

  // Mark a songrequest as paid
  markSongRequestPaid(id: number) {
    let updatedSongRequest;
    this.songRequests = this.songRequests.map(p => {
      if (p.id === id) {
        updatedSongRequest = { ...p, hasPaid: true };
        return updatedSongRequest;
      }
      return p;
    });

    if (updatedSongRequest) {
      this.emit('songRequest', updatedSongRequest);
    }
  }

  // Return songrequests that have been paid for in time order
  getPaidSongRequests() {
    return this.songRequests
      .filter(p => !!p.hasPaid)
      .sort((a, b) => b.time - a.time);
  }
}

export default new SongRequestsManager();
