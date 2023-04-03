import { FullScreen, FullScreenOptions } from "../core/fullScreen";
/**
 * 全屏组件指令
 */
export declare const v3FullScreen: {
    /**
     * @param el 指令绑定到的元素。这可以用于直接操作 DOM。
     * @param binding 一个对象，包含以下属性。
     *      value：传递给指令的值。例如在 v-my-directive="1 + 1" 中，值是 2。
     *      oldValue：之前的值，仅在 beforeUpdate 和 updated 中可用。无论值是否更改，它都可用。
     *      arg：传递给指令的参数 (如果有的话)。例如在 v-my-directive:foo 中，参数是 "foo"。
     *      modifiers：一个包含修饰符的对象 (如果有的话)。例如在 v-my-directive.foo.bar 中，修饰符对象是 { foo: true, bar: true }。
     *      instance：使用该指令的组件实例。
     *      dir：指令的定义对象。
     */
    mounted(el: any, binding: {
        value?: FullScreenOptions;
    }): FullScreen;
    unmounted(el: any): void;
};
export declare const useFullScreen: () => void;
