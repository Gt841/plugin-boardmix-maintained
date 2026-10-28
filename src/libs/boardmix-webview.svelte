<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { pushErrMsg } from "@/libs/api";
    import { store_logged_in } from "@/libs/store";

    export let plugin;
    export let src;
    export let showCookieButton = false;
    

    onMount(async () => {
    });

    onDestroy(() => {});

    let webviewEl: any;

    // 新版 BoardMix（cas-client-bosyun）会把登录态以 BOSYUNCurrent 为键写入
    // localStorage，并删除旧版同名 cookie，因此优先从 localStorage 读取。
    const readTokenFromLocalStorage = async (): Promise<string> => {
        try {
            if (webviewEl?.executeJavaScript) {
                const raw = await webviewEl.executeJavaScript(
                    "localStorage.getItem('BOSYUNCurrent')",
                    true,
                );
                if (raw) {
                    const token = JSON.parse(raw)?.["access_token"];
                    if (token) return token;
                }
            }
        } catch (err) {
            console.warn("boardmix: read token from webview failed", err);
        }

        // 兜底：遍历同一 partition 下任意 boardmix 页面
        try {
            const remote = window.require("@electron/remote");
            const list = remote.webContents?.getAllWebContents?.() ?? [];
            for (const wc of list) {
                let url = "";
                try {
                    url = wc.getURL() || "";
                } catch (err) {
                    continue;
                }
                if (!url.startsWith("https://boardmix.cn")) continue;
                try {
                    const raw = await wc.executeJavaScript(
                        "localStorage.getItem('BOSYUNCurrent')",
                        true,
                    );
                    if (raw) {
                        const token = JSON.parse(raw)?.["access_token"];
                        if (token) return token;
                    }
                } catch (err) {
                    console.warn(
                        "boardmix: read token from webContents failed",
                        err,
                    );
                }
            }
        } catch (err) {
            console.warn("boardmix: enumerate webContents failed", err);
        }
        return "";
    };

    // 兼容旧版：登录态在 cookie 中
    const readTokenFromCookie = async (): Promise<string> => {
        try {
            const ses = window
                .require("@electron/remote")
                .session.fromPartition("persist:boardmix");
            const cookies = await ses.cookies.get({ url: "https://boardmix.cn" });
            const item = cookies.find((c) => c.name == "BOSYUNCurrent");
            if (!item) return "";
            return (
                JSON.parse(decodeURIComponent(item.value))?.["access_token"] ||
                ""
            );
        } catch (err) {
            console.warn("boardmix: read token from cookie failed", err);
            return "";
        }
    };

    let getCookie = async () => {
        let access_token =
            (await readTokenFromLocalStorage()) || (await readTokenFromCookie());

        if (!access_token) {
            pushErrMsg("未获取到 access_token");
            return;
        }

        console.log("获取到了access_token: " + access_token);
        await plugin.saveData("BOARDMIX_CONFIG", {
            access_token: access_token,
        });
        store_logged_in.set(true);
        let refreshTree =
            plugin.myTree.$$.ctx[plugin.myTree.$$.props["refreshTree"]];
        await refreshTree();

        //关闭tab
        plugin.loginTab.then((tab) => {
            tab.close();
        });
    };
</script>

{#if true == showCookieButton}
<button class="cookie_button b3-button"  on:click={getCookie}
>我确认我已经登录了</button
>
{/if}

<webview
    bind:this={webviewEl}
    allowfullscreen
    allowpopups
    style="border: none;width:100%;height:100%;"
    class="fn__flex-column fn__flex fn__flex-1"
    src={src}
    partition="persist:boardmix"
></webview>

<style>
    .cookie_button {
        position: absolute;
    }
</style>
