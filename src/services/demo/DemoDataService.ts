import { SpotifyTrack } from '../spotify/types';

// Preset de chansons populaires équilibrées
const DEMO_TRACKS_PRESET = [
  {
    name: "Flowers",
    artist: "Miley Cyrus",
    playCount: 127,
    duration: "3:20"
  },
  {
    name: "As It Was",
    artist: "Harry Styles",
    playCount: 89,
    duration: "2:47"
  },
  {
    name: "Unholy",
    artist: "Sam Smith & Kim Petras",
    playCount: 76,
    duration: "2:36"
  },
  {
    name: "Kill Bill",
    artist: "SZA",
    playCount: 65,
    duration: "3:33"
  },
  {
    name: "Anti-Hero",
    artist: "Taylor Swift",
    playCount: 58,
    duration: "3:20"
  },
  {
    name: "Cruel Summer",
    artist: "Taylor Swift",
    playCount: 52,
    duration: "2:58"
  },
  {
    name: "Paint The Town Red",
    artist: "Doja Cat",
    playCount: 47,
    duration: "3:51"
  },
  {
    name: "Vampire",
    artist: "Olivia Rodrigo",
    playCount: 43,
    duration: "3:39"
  },
  {
    name: "Seven (feat. Latto)",
    artist: "Jung Kook",
    playCount: 38,
    duration: "3:04"
  },
  {
    name: "What Was I Made For?",
    artist: "Billie Eilish",
    playCount: 35,
    duration: "3:42"
  },
  {
    name: "Greedy",
    artist: "Tate McRae",
    playCount: 32,
    duration: "2:11"
  },
  {
    name: "Strangers",
    artist: "Kenya Grace",
    playCount: 29,
    duration: "2:52"
  },
  {
    name: "Water",
    artist: "Tyla",
    playCount: 27,
    duration: "3:20"
  },
  {
    name: "Snooze",
    artist: "SZA",
    playCount: 24,
    duration: "3:21"
  },
  {
    name: "Lovin On Me",
    artist: "Jack Harlow",
    playCount: 22,
    duration: "2:18"
  },
  {
    name: "Agora Hills",
    artist: "Doja Cat",
    playCount: 19,
    duration: "4:25"
  },
  {
    name: "Monaco",
    artist: "Bad Bunny",
    playCount: 17,
    duration: "4:27"
  },
  {
    name: "Ella Baila Sola",
    artist: "Eslabon Armado",
    playCount: 15,
    duration: "2:46"
  },
  {
    name: "Daylight",
    artist: "David Kushner",
    playCount: 13,
    duration: "3:33"
  },
  {
    name: "Houdini",
    artist: "Dua Lipa",
    playCount: 11,
    duration: "3:05"
  },
  {
    name: "Is It Over Now?",
    artist: "Taylor Swift",
    playCount: 9,
    duration: "3:49"
  },
  {
    name: "Lala",
    artist: "Myke Towers",
    playCount: 7,
    duration: "3:17"
  },
  {
    name: "Used To Be Young",
    artist: "Miley Cyrus",
    playCount: 5,
    duration: "3:47"
  },
  {
    name: "Moonlight",
    artist: "Kali Uchis",
    playCount: 3,
    duration: "3:26"
  },
  {
    name: "Bzrp Music Sessions #53",
    artist: "Shakira & Bizarrap",
    playCount: 2,
    duration: "3:38"
  }
];

export interface DemoTrackInput {
  name: string;
  artist: string;
  playCount: number;
}

export class DemoDataService {
  // Convertir la durée string en millisecondes
  private parseDuration(duration: string): number {
    const [minutes, seconds] = duration.split(':').map(Number);
    return (minutes * 60 + seconds) * 1000;
  }

  // Générer des tracks depuis le preset
  generatePresetTracks(limit: number = 25): SpotifyTrack[] {
    return DEMO_TRACKS_PRESET.slice(0, limit).map((track, index) => ({
      id: `demo-${index}`,
      name: track.name,
      artists: [{ name: track.artist }],
      album: {
        name: "Top Hits 2024",
        images: [
          {
            url: `https://picsum.photos/seed/${track.name}/640/640`,
            height: 640,
            width: 640
          }
        ]
      },
      durationMs: this.parseDuration(track.duration),
      playCount: track.playCount,
      albumArtUrl: `https://picsum.photos/seed/${track.name}/640/640`
    }));
  }

  // Générer des tracks personnalisés
  generateCustomTracks(customTracks: DemoTrackInput[]): SpotifyTrack[] {
    return customTracks.map((track, index) => ({
      id: `custom-${index}`,
      name: track.name,
      artists: [{ name: track.artist }],
      album: {
        name: "Custom Playlist",
        images: [
          {
            url: `https://picsum.photos/seed/${track.name}/640/640`,
            height: 640,
            width: 640
          }
        ]
      },
      durationMs: Math.floor(180000 + Math.random() * 120000), // 3-5 min random
      playCount: track.playCount,
      albumArtUrl: `https://picsum.photos/seed/${track.name}/640/640`
    }));
  }

  // Mixer preset et custom tracks
  mixTracks(customTracks: DemoTrackInput[], totalLimit: number = 25): SpotifyTrack[] {
    const custom = this.generateCustomTracks(customTracks);
    const presetNeeded = Math.max(0, totalLimit - custom.length);
    const preset = this.generatePresetTracks(presetNeeded);

    // Combiner et trier par playCount
    return [...custom, ...preset]
      .sort((a, b) => b.playCount - a.playCount)
      .slice(0, totalLimit);
  }
}

export const demoDataService = new DemoDataService();