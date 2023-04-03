import { FullScreenActionListener } from "./events";
export declare type FullScreenZIndex = string | number | FullScreenZIndexFn;
interface FullScreenZIndexFn {
    (): string | number;
}
export declare interface FullScreenOptions {
    iconClass?: ScreenFullIconClass;
    targetEl?: HTMLElement;
    closeOnEsc?: boolean;
    closeAllOnEsc?: boolean;
    hideIcon?: boolean;
    autoFullScreen?: boolean;
    iconContainerClass?: string;
    zIndex?: FullScreenZIndex;
    /**
     * 创建全屏图标
     * @param iconStyle 图标的样式
     * @param info 当前的全屏组件对象
     * @return 图标对象
     */
    createIcon?(iconStyle: string[], info: FullScreen): HTMLElement | undefined;
    actionListeners?: FullScreenActionListener | FullScreenActionListener[];
}
export declare class FullScreen {
    private _iconEl;
    private _full;
    private _oldStyle;
    private _options?;
    private _onClickIcon?;
    private _listeners;
    constructor(options?: FullScreenOptions);
    addDefaultListeners(): void;
    /**
     * 创建全屏和取消全屏的图标
     * @private
     */
    private _createIcon;
    /**
     * 销毁上下文
     */
    destory(): void;
    /**
     * 全屏或者取消全屏
     */
    fullScreen(): void;
    on(actionListeners?: FullScreenActionListener | FullScreenActionListener[]): void;
    get defaultFullScreenOptions(): FullScreenOptions;
    get listeners(): FullScreenActionListener[];
    set listeners(value: FullScreenActionListener[]);
    get targetEl(): HTMLElement;
    get iconEl(): HTMLElement;
    set iconEl(value: HTMLElement);
    get full(): boolean;
    set full(value: boolean);
    get oldStyle(): string;
    set oldStyle(value: string);
    get options(): FullScreenOptions;
    set options(value: FullScreenOptions);
}
declare interface ScreenFullIconClass {
    class?: string;
    full?: string;
    unFull?: string;
}
export {};
