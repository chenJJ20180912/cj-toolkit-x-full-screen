import { FullScreen } from "./fullScreen";
export interface FullScreenActionListener {
    /**
     * 全屏
     */
    fullScreen(fullScreen: FullScreen): any;
    /**
     * 取消全屏
     */
    cancelFullScreen(fullScreen: FullScreen): any;
}
export declare const eventEmitter: {
    fullScreen(fullScreen: any): void;
    cancelFullScreen(fullScreen: any): void;
};
