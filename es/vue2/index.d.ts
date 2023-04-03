import { FullScreen, FullScreenOptions } from "../core/fullScreen";
/**
 * 全屏组件指令
 */
export declare const v2FullScreen: {
    bind(el: any, binding: {
        value?: FullScreenOptions;
    }): FullScreen;
    unbind(el: any): void;
};
/**
 * 混入
 */
export declare const fullScreenMixin: {
    props: {
        fullScreen: {
            type: BooleanConstructor;
            default: boolean;
        };
        fullScreenOptions: {
            default: () => {
                iconClass: {
                    class: string;
                    full: string;
                    unFull: string;
                };
                closeOnEsc: boolean;
                closeAllOnEsc: boolean;
                hideIcon: boolean;
                iconContainerClass: string;
            };
        };
    };
    data(): {
        screenFullInstance: {};
    };
    methods: {
        /**
         * 初始化全屏实例
         * @private
         */
        __initScreenFullInstance(): void;
        /**
         * 构建全屏配置
         * @param screenFullOptions
         * @return {*}
         * @private
         */
        __buildScreenFullOptions(screenFullOptions: any): any;
    };
    mounted(): void;
    beforeDestroy(): void;
};
