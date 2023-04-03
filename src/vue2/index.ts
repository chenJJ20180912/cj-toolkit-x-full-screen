import {FullScreen, FullScreenOptions} from "../core/fullScreen";

/**
 * 全屏组件指令
 */
export const v2FullScreen = {
    bind(el, binding: { value?: FullScreenOptions }) {
        const options: FullScreenOptions = binding?.value || {};
        let screenFullInfo: FullScreen = el.__screenFullInfo__;
        if (!screenFullInfo) {
            options.targetEl = el;
            screenFullInfo = new FullScreen(options);
        }
        return screenFullInfo;
    },
    unbind(el) {
        const screenFullInfo: FullScreen = el.__screenFullInfo__;
        if (screenFullInfo) {
            screenFullInfo.destory();
        }
    }
};

/**
 * 混入
 */
export const fullScreenMixin = {
    props: {
        // 是否允许全屏
        fullScreen: {
            type: Boolean,
            default: true
        },
        // 配置项
        fullScreenOptions: {
            // type: FullScreenOptions,
            default: () => {
                return {
                    iconClass: {
                        class: "full-screen-icon",
                        full: "full-screen-icon__full",
                        unFull: "full-screen-icon__un-full"
                    },
                    closeOnEsc: true,// 按下esc 取消全屏
                    closeAllOnEsc: false,// 按esc 取消所有层级的全屏
                    hideIcon: false,// 是否隐藏icon
                    iconContainerClass: "full-screen-icon-container",
                    // createIcon:undefined// 创建全屏图标
                };
            }
        }
    },
    data() {
        return {
            // 全屏组件实例
            screenFullInstance: {}
        };
    },
    methods: {
        /**
         * 初始化全屏实例
         * @private
         */
        __initScreenFullInstance() {
            if (this._screenFull && this.$el) {
                const screenFullOptions = this.__buildScreenFullOptions(
                    this.screenFullOptions
                );
                screenFullOptions.targetEl = screenFullOptions.targetEl || this.$el
                this.screenFullInstance = new FullScreen(
                    screenFullOptions
                );
            }
        },
        /**
         * 构建全屏配置
         * @param screenFullOptions
         * @return {*}
         * @private
         */
        __buildScreenFullOptions(screenFullOptions) {
            return screenFullOptions;
        }
    },
    mounted() {
        this.__initScreenFullInstance();
    },
    beforeDestroy() {
        if (this._screenFull && this.$el) {
            this.screenFullInstance.destory();
            this.screenFullInstance = undefined;
        }
    }
}
