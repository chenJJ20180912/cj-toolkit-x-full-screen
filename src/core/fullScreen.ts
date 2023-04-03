// z-index的取号器，保证全屏的层级是正确的 逐层显示
import {ActionStack} from "./actionStack";
import {ZIndexProvider} from "./zIndexProvider";
import {eventEmitter, FullScreenActionListener} from "./events";

// z-index 取号器
const zIndexProvider = new ZIndexProvider(10);

// 按下esc的堆栈 全屏之后只能在当前界面操作 不能同时在一个窗口全屏多个菜单，所以共享一个变量是安全的
const escStack = new ActionStack<FullScreen>();

export declare type  FullScreenZIndex = string | number | FullScreenZIndexFn

interface FullScreenZIndexFn {
    (): string | number;
}

export declare interface FullScreenOptions {
    iconClass?: ScreenFullIconClass; // 图标配置
    targetEl?: HTMLElement; // 图标挂载的目标元素
    closeOnEsc?: boolean; // 按esc 取消全屏
    closeAllOnEsc?: boolean; // 按esc 取消所有层级的全屏
    hideIcon?: boolean; // 是否隐藏icon
    autoFullScreen?: boolean; // 自动全屏
    iconContainerClass?: string; // 图标放置的父元素类名
    zIndex?: FullScreenZIndex;// 全屏后容器的层级
    /**
     * 创建全屏图标
     * @param iconStyle 图标的样式
     * @param info 当前的全屏组件对象
     * @return 图标对象
     */
    createIcon?(
        iconStyle: string[],
        info: FullScreen
    ): HTMLElement | undefined; // 创建图标
    actionListeners?: FullScreenActionListener | FullScreenActionListener[];// 全屏事件监听器
}

const defaultFullScreenOptions: FullScreenOptions = {
    iconClass: {
        class: "full-screen-icon",
        full: "full-screen-icon__full",
        unFull: "full-screen-icon__un-full"
    },
    closeOnEsc: true,// 按下esc 取消全屏
    closeAllOnEsc: false,// 按esc 取消所有层级的全屏
    hideIcon: false,// 是否隐藏icon
    iconContainerClass: "full-screen-icon-container",
    createIcon(iconStyle: string[], info: FullScreen): HTMLElement | undefined {
        const {iconContainerClass, targetEl} = info.options;
        let iconEl;
        // 尝试通过iconContainerClass 查找
        if (iconContainerClass) {
            const iconContainerEl =
                targetEl.getElementsByClassName(iconContainerClass);
            if (iconContainerEl && iconContainerEl.length) {
                iconEl = document.createElement("i");
                iconContainerEl[0].appendChild(iconEl);
            }
        }
        if (!iconEl) {
            iconEl = document.createElement("i");
            iconStyle.push(
                "margin-left: 5px;position: absolute;top: 10px;right: 10px;"
            );
            // 将iconEl 直接插入到目标容器的元素上
            targetEl.appendChild(iconEl);
            if (!targetEl.style?.position) {
                targetEl.style.position = "relative";
            }
        }
        return iconEl;
    }
};

export class FullScreen {
    private _iconEl: HTMLElement; // 当前全屏的按钮图标
    private _full = false; // 是否全屏
    private _oldStyle = ""; // 全屏之前目标容器的样式
    private _options?: FullScreenOptions; // 自定义配置
    private _onClickIcon?: any; // 持有icon点击事件函数的对象
    private _listeners: FullScreenActionListener[] = []; // 全屏和取消全屏监听器

    constructor(options: FullScreenOptions = {}) {
        const targetEl = options.targetEl;
        this._options = Object.assign({}, this.defaultFullScreenOptions, options);
        targetEl.classList?.add("full-screen-container");
        if (!options.hideIcon) {
            this._createIcon();
        }
        // 自动全屏
        if (this._options.autoFullScreen) {
            // 自动全屏
            this.fullScreen();
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        targetEl.__fullScreen__ = this;
        // 添加默认的监听器
        this.addDefaultListeners();
        // 添加配置的监听器
        let actionListeners = this.options.actionListeners;
        this.on(actionListeners);
    }

    addDefaultListeners() {
        this.on(eventEmitter);
    }

    /**
     * 创建全屏和取消全屏的图标
     * @private
     */
    private _createIcon() {
        const {iconClass, createIcon} = this.options;
        const iconStyle = ["cursor: pointer"];
        // 创建全屏图标
        let iconEl = createIcon(iconStyle, this);
        iconEl.setAttribute("class", iconClass.class + " " + iconClass.full);
        // 设置图标的样式
        iconEl.setAttribute("style", iconStyle.join(";"));

        this._onClickIcon = () => {
            this.fullScreen();
        };
        // 监听点击全屏事件
        iconEl.addEventListener("click", this._onClickIcon);
        this._iconEl = iconEl;
    }

    /**
     * 销毁上下文
     */
    destory() {
        const {iconEl, targetEl} = this;
        iconEl.removeEventListener("click", this._onClickIcon);
        iconEl.remove();
        if (!escStack.hasNext()) {
            document.removeEventListener("keydown", onKeydownEsc);
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete targetEl.__fullScreen__;
    }

    /**
     * 全屏或者取消全屏
     */
    fullScreen() {
        const {targetEl, full, iconEl} = this;
        const {
            iconClass,
            closeOnEsc = true,
            closeAllOnEsc = false
        } = this.options;
        if (!full) {
            // 全屏
            let zIndex = this.options.zIndex;
            this.oldStyle = targetEl.getAttribute("style");
            const styles = ["position: fixed", "left: 0", "right: 0", "top: 0", "bottom: 0", "width:100%", "height:100%"];
            // 计算层级
            if (zIndex) {
                // 自定义的层级最高
                if (typeof zIndex === "function") {
                    zIndex = zIndex();
                }
            } else {
                // 先尝试获取样式中设置的z-index
                zIndex = targetEl?.style?.zIndex || zIndexProvider.next();
            }
            styles.push("z-index:" + zIndex);
            targetEl.setAttribute("style", styles.join(";"));
            targetEl.classList?.add("full-screen-container__full");
            iconEl?.classList.add(iconClass.unFull);
            iconEl?.classList.remove(iconClass.full);
            this.listeners.forEach((listener) => listener.fullScreen(this));
            // 如果设置了按esc 取消全屏
            if (closeOnEsc) {
                escStack.push(this);
                document.addEventListener("keydown", onKeydownEsc);
            }
        } else {
            // 取消全屏
            targetEl.setAttribute("style", this.oldStyle);
            targetEl.classList?.remove("full-screen-container__full");
            this.listeners.forEach((listener) => listener.cancelFullScreen(this));
            if (closeOnEsc && !escStack.hasNext()) {
                document.removeEventListener("keydown", onKeydownEsc);
            }
            // 逐层关闭
            if (escStack.hasNext() && closeAllOnEsc) {
                onKeydownEsc({code: "Escape"});
            }
            iconEl?.classList.add(iconClass.full);
            iconEl?.classList.remove(iconClass.unFull);
        }
        this.full = !full;
    }

    on(actionListeners: FullScreenActionListener | FullScreenActionListener[] = []) {
        if (!Array.isArray(actionListeners)) {
            actionListeners = [actionListeners];
        }
        actionListeners.forEach(listener => {
            this.listeners.push(listener);
        });

    }

    get defaultFullScreenOptions() {
        return defaultFullScreenOptions;
    }

    get listeners(): FullScreenActionListener[] {
        return this._listeners;
    }

    set listeners(value: FullScreenActionListener[]) {
        this._listeners = value;
    }

    get targetEl(): HTMLElement {
        return this.options.targetEl;
    }

    get iconEl(): HTMLElement {
        return this._iconEl;
    }

    set iconEl(value: HTMLElement) {
        this._iconEl = value;
    }

    get full(): boolean {
        return this._full;
    }

    set full(value: boolean) {
        this._full = value;
    }

    get oldStyle(): string {
        return this._oldStyle;
    }

    set oldStyle(value: string) {
        this._oldStyle = value;
    }

    get options(): FullScreenOptions {
        return this._options;
    }

    set options(value: FullScreenOptions) {
        this._options = value;
    }
}

declare interface ScreenFullIconClass {
    class?: string; // 默认的样式class
    full?: string; //  全屏样式class
    unFull?: string; // 非全屏class
}

// 按下esc之后取消全屏
const onKeydownEsc = function (e: { code: string }) {
    if (e.code === "Escape") {
        const currentFullScreen = escStack.pop();
        if (currentFullScreen) {
            currentFullScreen.fullScreen();
        }
    }
};
