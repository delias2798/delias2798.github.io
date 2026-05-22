export type ScreenMediaMode =
    | 'local'
    | 'youtube-embed'
    | 'youtube-poster'
    | 'placeholder';

export interface ScreenMediaState {
    mode: ScreenMediaMode;
    youtubeVideoId?: string;
}
