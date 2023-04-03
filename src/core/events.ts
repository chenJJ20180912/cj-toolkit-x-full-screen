import {FullScreen} from "./fullScreen";

export interface FullScreenActionListener {
    /**
     * 全屏
     */
    fullScreen(fullScreen: FullScreen);

    /**
     * 取消全屏
     */
    cancelFullScreen(fullScreen: FullScreen);
}

export const eventEmitter = {
    fullScreen(fullScreen) {
        const {targetEl} = fullScreen;
        // 创建事件
        const event = new CustomEvent("fullScreen", {
            detail: fullScreen
        });
        // 触发对象可以是任何元素或其他事件目标
        targetEl.dispatchEvent(event);
    },
    cancelFullScreen(fullScreen) {
        const {targetEl} = fullScreen;
        // 创建事件
        const event = new CustomEvent("cancelFullScreen", {
            detail: fullScreen
        });
        // 触发对象可以是任何元素或其他事件目标
        targetEl.dispatchEvent(event);
    }
};
