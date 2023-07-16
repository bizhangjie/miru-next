import {
    ExtensionSettings,
    extensionSettingsDB,
    Extension as ExtensionType,
} from "@/db";
import {
    BangumiWatch,
    Detail,
    FikushonWatch,
    ListItem,
    MangaWatch,
} from "@/types/extension";
import Artplayer from "artplayer";
import request from "umi-request";

export class Extension {
    package = "";
    proxyUrl = "";
    webSite = "";
    name = "";
    version = "";
    lang = "";
    script = "";
    scriptUrl = "";
    author = "";
    license = "";
    description = "";
    type: ExtensionType["type"] = "bangumi";
    nsfw: boolean = false;

    // request(url: string, options?: any) {
    //     if (!options) {
    //         options = {};
    //     }
    //     if (!options.headers) {
    //         options.headers = { "Miru-Url": this.webSite };
    //     }
    //     if (!options.headers["Miru-Url"]) {
    //         options.headers = { ...options.headers, "Miru-Url": this.webSite };
    //     }
    //     const miruProxy = this.proxyUrl + url;
    //     return request(miruProxy, options);
    // }

    request(url: string, options?: any) {
      if (!options) {
        options = {};
      }
      if (!options.headers) {
        options.headers = { "Miru-Url": this.webSite };
      }
      if (!options.headers["Miru-Url"]) {
        options.headers = { ...options.headers, "Miru-Url": this.webSite };
      }
    
      // 动态获取默认的请求头部信息
      const defaultHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
      };
    
      // 将默认的请求头部信息与传入的 options.headers 进行合并
      options.headers = { ...defaultHeaders, ...options.headers };
    
      const miruProxy = this.proxyUrl + url;
      return request(miruProxy, options);
    }

    // 最近更新
    latest(page: number): ListItem[] {
        throw new Error("not implement");
    }

    // 搜索
    search(kw: string, page: number): ListItem[] {
        throw new Error("not implement");
    }

    // 获取详情
    detail(url: string): Detail {
        throw new Error("not implement");
    }

    // 观看
    watch(url: string): BangumiWatch | MangaWatch | FikushonWatch {
        throw new Error("not implement");
    }

    // 检查更新剧集/章节
    checkUpdate(url: string): string {
        throw new Error("not implement");
    }

    // 读取设置
    async getSetting(key: string) {
        const settings = await extensionSettingsDB.getSetting(
            this.package,
            key
        );
        if (settings) {
            return settings.value;
        }
        return "";
    }

    // 自定义播放器
    customPlayer(video: HTMLMediaElement, url: string, art: Artplayer) {
        art.notice.show = "not implement customPlayer";
    }

    // 注册设置
    async registerSetting(settings: {
        title: string;
        key: string;
        type: ExtensionSettings["type"];
        defaultValue: string;
        description?: string;
        options?: {
            label: string;
            value: string;
        }[];
    }) {
        await extensionSettingsDB.addSettings({
            package: this.package,
            ...settings,
            value: settings.defaultValue,
        });
    }

    load() {}
    unload() {}
}
