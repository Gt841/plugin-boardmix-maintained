import {
    Plugin,
    openTab,
    // getFrontend,
    fetchSyncPost,
    type ITab,
    // IOperation,

} from "siyuan";
import "@/index.scss";
import MyTree from "@/libs/my-tree.svelte";
import BoardmixWebview from "@/libs/boardmix-webview.svelte";
// import SettingExample from "@/libs/setting-example.svelte";
import { canParse } from "@/libs/api";
// import { SettingUtils } from "@/libs/setting-utils";

// const STORAGE_NAME = "menu-config";
// const TAB_TYPE = "boardmix_tab";
const DOCK_TYPE = "dock_tab";

export default class BoardmixPlugin extends Plugin {


    // private isMobile: boolean;
    private blockIconEventBindThis = this.blockIconEvent.bind(this);
    private editorTitleIconEventBindThis = this.editorTitleIconEvent.bind(this);
    private openSiyuanUrlPluginEventBindThis = this.openSiyuanUrlPluginEvent.bind(this);

    // private settingUtils: SettingUtils;
    public myTree: any;
    public loginTab: any;
    public allTab = new Set();
    // tabType -> 已打开的页签，用于去重
    public tabMap = new Map<string, Promise<ITab>>();
    // 已注册过的页签类型，避免重复 addTab
    private registeredTabs = new Set<string>();

    async onload() {
        // this.data[STORAGE_NAME] = { readonlyText: "Readonly" };

        // const frontEnd = getFrontend();
        // this.isMobile = frontEnd === "mobile" || frontEnd === "browser-mobile";

        // 图标的制作参见帮助文档
        this.addIcons(`<symbol id="iconFace" viewBox="0 0 32 32">
<path d="M13.667 17.333c0 0.92-0.747 1.667-1.667 1.667s-1.667-0.747-1.667-1.667 0.747-1.667 1.667-1.667 1.667 0.747 1.667 1.667zM20 15.667c-0.92 0-1.667 0.747-1.667 1.667s0.747 1.667 1.667 1.667 1.667-0.747 1.667-1.667-0.747-1.667-1.667-1.667zM29.333 16c0 7.36-5.973 13.333-13.333 13.333s-13.333-5.973-13.333-13.333 5.973-13.333 13.333-13.333 13.333 5.973 13.333 13.333zM14.213 5.493c1.867 3.093 5.253 5.173 9.12 5.173 0.613 0 1.213-0.067 1.787-0.16-1.867-3.093-5.253-5.173-9.12-5.173-0.613 0-1.213 0.067-1.787 0.16zM5.893 12.627c2.28-1.293 4.040-3.4 4.88-5.92-2.28 1.293-4.040 3.4-4.88 5.92zM26.667 16c0-1.040-0.16-2.040-0.44-2.987-0.933 0.2-1.893 0.32-2.893 0.32-4.173 0-7.893-1.92-10.347-4.92-1.4 3.413-4.187 6.093-7.653 7.4 0.013 0.053 0 0.12 0 0.187 0 5.88 4.787 10.667 10.667 10.667s10.667-4.787 10.667-10.667z"></path>
</symbol>
<symbol id="iconSaving" viewBox="0 0 32 32">
<path d="M20 13.333c0-0.733 0.6-1.333 1.333-1.333s1.333 0.6 1.333 1.333c0 0.733-0.6 1.333-1.333 1.333s-1.333-0.6-1.333-1.333zM10.667 12h6.667v-2.667h-6.667v2.667zM29.333 10v9.293l-3.76 1.253-2.24 7.453h-7.333v-2.667h-2.667v2.667h-7.333c0 0-3.333-11.28-3.333-15.333s3.28-7.333 7.333-7.333h6.667c1.213-1.613 3.147-2.667 5.333-2.667 1.107 0 2 0.893 2 2 0 0.28-0.053 0.533-0.16 0.773-0.187 0.453-0.347 0.973-0.427 1.533l3.027 3.027h2.893zM26.667 12.667h-1.333l-4.667-4.667c0-0.867 0.12-1.72 0.347-2.547-1.293 0.333-2.347 1.293-2.787 2.547h-8.227c-2.573 0-4.667 2.093-4.667 4.667 0 2.507 1.627 8.867 2.68 12.667h2.653v-2.667h8v2.667h2.68l2.067-6.867 3.253-1.093v-4.707z"></path>
</symbol>
<symbol id="boardmix_whiteboard" viewBox="0 0 1024 1024" >
<path d="M828.6875 909.59375H195.3125c-55.78125 0-101.0625-45.375-101.0625-101.0625V215.46875c0-55.78125 45.375-101.0625 101.0625-101.0625h107.8125c18.65625 0 33.65625 15.09375 33.65625 33.65625s-15.09375 33.65625-33.65625 33.65625h-107.8125c-18.5625 0-33.65625 15.09375-33.65625 33.65625v592.96875c0 18.5625 15.09375 33.65625 33.65625 33.65625h633.375c18.5625 0 33.65625-15.09375 33.65625-33.65625v-87.5625c0-18.65625 15.09375-33.65625 33.65625-33.65625s33.65625 15.09375 33.65625 33.65625v87.5625c0.09375 55.875-45.1875 101.25-100.96875 101.25z" fill="#727678" p-id="8772"></path><path d="M445.03625 462.2346875L788.0909375 119.18 940.559375 271.6484375 597.5046875 614.703125zM410.9375 635.5625c0.1875 7.125 6.09375 13.03125 13.21875 13.21875l159-19.78125-152.4375-152.4375-19.78125 159z" fill="#727678" p-id="8773"></path>
</symbol>
<symbol id="boardmix_refresh" viewBox="0 0 24 24">
<path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"></path>
</symbol>
<symbol id="boardmix_login" viewBox="0 0 24 24">
<path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"></path>
</symbol>
<symbol id="boardmix_logout" viewBox="0 0 24 24">
<path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"></path>
</symbol>
`);

        this.addDock({
            config: {
                position: "LeftBottom",
                size: { width: 200, height: 0 },
                icon: "boardmix_whiteboard",
                title: "boardmix",
            },
            data: {
                text: "博思白板"
            },
            type: DOCK_TYPE,
            resize() {
                console.log(DOCK_TYPE + " resize");
            },
            update() {
                console.log(DOCK_TYPE + " update");
            },
            init: (dock) => {
                this.myTree = new MyTree({
                    target: dock.element,
                    props: {
                        app: this.app,
                        plugin: this,
                        treeNodes: []
                    }
                });

                console.log(this.myTree);
            },
            destroy() {
                console.log("destroy dock:", DOCK_TYPE);
            }
        });

        // this.settingUtils = new SettingUtils(this, STORAGE_NAME);

        // try {
        //     this.settingUtils.load();
        // } catch (error) {
        //     console.error("Error loading settings storage, probably empty config json:", error);
        // }


        this.eventBus.on("click-blockicon", this.blockIconEventBindThis);
        this.eventBus.on("click-editortitleicon", this.editorTitleIconEventBindThis);
        this.eventBus.on("open-siyuan-url-plugin", this.openSiyuanUrlPluginEventBindThis);

    }

    onLayoutReady() {
    }

    async onunload() {
    }

    uninstall() {
        console.log("uninstall");
    }


    // async updateCards(options: ICardData) {
    //     options.cards.sort((a: ICard, b: ICard) => {
    //         if (a.blockID < b.blockID) {
    //             return -1;
    //         }
    //         if (a.blockID > b.blockID) {
    //             return 1;
    //         }
    //         return 0;
    //     });
    //     return options;
    // }



    // private eventBusPaste(event: any) {
    //     // 如果需异步处理请调用 preventDefault， 否则会进行默认处理
    //     event.preventDefault();
    //     // 如果使用了 preventDefault，必须调用 resolve，否则程序会卡死
    //     event.detail.resolve({
    //         textPlain: event.detail.textPlain.trim(),
    //     });
    // }


    // private eventBusLog({ detail }: any) {
    //     console.log(detail);
    // }

    private editorTitleIconEvent({ detail }: any) {
        console.log(detail);
        this.addBoardmixMenus(detail, detail.data.rootID);//, detail.data.name
    }

    openSiyuanUrlPluginEvent({ detail }: any) {
        let searchParams = new URL(detail.url).searchParams;
        let pluginParams = [...searchParams.entries()].reduce((a, c) => { a[c[0]] = canParse(c[1]) ? JSON.parse(c[1]) : c[1]; return a }, {})
        console.log(pluginParams);
        this.openBoardMixTab({
            tabType: pluginParams["id"],
            name: pluginParams["name"],
            url: "https://boardmix.cn/app/editor/" + pluginParams["id"],
            showCookieButton: false,
        });
    }

    openBoardMixTab(param: {
        tabType: string;
        name: string;
        url: string;
        showCookieButton?: boolean;
    }): Promise<ITab> {
        const { tabType } = param;

        // 同一个文件只保留一个页签，重复点击时切换到已有页签
        const existing = this.tabMap.get(tabType);
        if (existing) {
            return existing.then((tab) => {
                if (tab?.headElement?.isConnected) {
                    tab.headElement.click();
                    return tab;
                }
                this.tabMap.delete(tabType);
                return this.createBoardMixTab(param);
            });
        }

        const promise = this.createBoardMixTab(param);
        this.tabMap.set(tabType, promise);
        promise.catch(() => this.tabMap.delete(tabType));
        return promise;
    }

    private createBoardMixTab(param: {
        tabType: string;
        name: string;
        url: string;
        showCookieButton?: boolean;
    }): Promise<ITab> {
        const { tabType, name, url, showCookieButton = false } = param;

        if (!this.registeredTabs.has(tabType)) {
            this.registeredTabs.add(tabType);
            const plugin = this;
            this.addTab({
                type: tabType,
                init() {
                    const tabDiv = document.createElement("div");
                    tabDiv.setAttribute(
                        "style",
                        "width:100%;height:100%;position:relative;",
                    );
                    new BoardmixWebview({
                        target: tabDiv,
                        props: {
                            plugin,
                            app: plugin.app,
                            this: plugin,
                            src: url,
                            showCookieButton,
                        },
                    });
                    this.element.appendChild(tabDiv);
                    console.log(this.element);
                },
                beforeDestroy() {
                    console.log("before destroy tab:", tabType);
                },
                destroy() {
                    console.log("destroy tab:", tabType);
                    plugin.tabMap.delete(tabType);
                },
            });
        }

        return openTab({
            app: this.app,
            custom: {
                // 页签上显示博思图标，便于和思源文档页签区分
                icon: "boardmix_whiteboard",
                title: name,
                data: {
                    text: name,
                },
                id: this.name + tabType,
            },
        });
    }

    private addBoardmixMenus(detail, blockId) {
        detail.menu.addItem({
            icon: "boardmix_whiteboard",
            label: "复制块引(in boardmix)",
            click: async () => {
                let resp = await fetchSyncPost("/api/block/getRefText", { id: blockId });
                let refText = resp["data"];
                let copyText = `[${refText}](siyuan://blocks/${blockId})`;
                let copyHtml = `<html>
<body>
<a href="siyuan://blocks/${blockId}"><span>${refText}</span></a>
</body></html>`;
                const type1 = "text/plain";
                const type2 = "text/html";
                let blob1 = new Blob([copyText], { type: type1 });
                let blob2 = new Blob([copyHtml], { type: type2 });
                const data = [
                    new ClipboardItem({ [type1]: blob1, [type2]: blob2 }),
                ];

                navigator.clipboard.write(data).then(
                    () => {
                        /* success */
                    },
                    () => {
                        /* failure */
                    },
                );
            }
        });

        detail.menu.addItem({
            icon: "boardmix_whiteboard",
            label: "复制块web url(in boardmix)",
            click: async () => {
                let copyText = `http://127.0.0.1:6806/stage/build/mobile/?focus=1&editable=1&id=${blockId}`;
                await navigator.clipboard.writeText(copyText)
            }
        });

    }

    private blockIconEvent({ detail }: any) {
        console.log(detail);
        let blockId = detail.blockElements[0].dataset.nodeId;

        this.addBoardmixMenus(detail, blockId);
        // console.log(111);
        // detail.menu.addItem({
        //     iconHTML: "",
        //     label: this.i18n.removeSpace,
        //     click: () => {
        //         const doOperations: IOperation[] = [];
        //         detail.blockElements.forEach((item: HTMLElement) => {
        //             const editElement = item.querySelector('[contenteditable="true"]');
        //             if (editElement) {
        //                 editElement.textContent = editElement.textContent.replace(/ /g, "");
        //                 doOperations.push({
        //                     id: item.dataset.nodeId,
        //                     data: item.outerHTML,
        //                     action: "update"
        //                 });
        //             }
        //         });
        //         detail.protyle.getInstance().transaction(doOperations);
        //     }
        // });
        // console.log(112);
    }
}
