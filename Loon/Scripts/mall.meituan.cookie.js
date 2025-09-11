/**
 * @author: @JoJoJotarou
 * @description: 方式1：美团APP -> 美团买菜 -> 我的 -> 买菜币 -> 去使用 -> 在退回上一级，QX提示成功即可
 * @description: 方式2：美团APP -> 美团买菜 -> 我的 -> 买菜币 -> 左滑一半做推出手势再松手（不要真的左滑退出） -> QX提示成功即可
 * @adapted: 适配Loon代理环境
 */

// 初始化Loon环境变量与基础配置
const scriptName = "美团买菜Token";
const storageKey = "jojo_mall_meituan"; // 数据存储键名
const generalQueryParams = ['tenantId', 'poiId', 'poi', 'bizId', 'utm_medium', 'utm_term', 'uuid', 'app_tag', 'userid'];

// 工具函数：简化Loon环境操作
const LoonUtils = {
  // 获取请求头（兼容大小写）
  getHeader(headers, key) {
    const lowerKey = key.toLowerCase();
    return headers[key] || headers[lowerKey] || "";
  },

  // 持久化存储数据
  setStorage(key, value) {
    return $persistentStore.write(JSON.stringify(value), key);
  },

  // 发送Loon通知
  sendNotify(title, subtitle, content) {
    $notification.post(title, subtitle, content);
  },

  // 日志打印
  log(...args) {
    console.log(`[${scriptName}]`, ...args);
  },

  // 结束脚本
  done() {
    $done();
  }
};

// 主逻辑执行
!(async () => {
  LoonUtils.log("开始获取美团买菜Token...");

  // 1. 获取请求Cookie（兼容请求头大小写）
  const requestHeaders = $request.headers || {};
  const cookie = LoonUtils.getHeader(requestHeaders, "Cookie");
  if (!cookie) {
    throw new Error("未获取到请求Cookie");
  }

  // 2. 解析URL中的query参数（提取目标参数）
  const requestUrl = $request.url;
  const queryMatch = requestUrl.match(/queryTaskListInfoV.\?(.*)/);
  if (!queryMatch || !queryMatch[1]) {
    throw new Error("URL格式错误，未匹配到queryTaskListInfoV相关参数");
  }

  // 提取通用参数（generalQueryParams指定的键）
  const queryParams = queryMatch[1].split("&");
  const filteredParams = queryParams
    .filter(param => {
      const [key] = param.split("=");
      return generalQueryParams.includes(key);
    })
    .join("&");

  // 提取xuuid参数（单独处理，允许为空）
  const xuuidParam = queryParams
    .find(param => param.split("=")[0] === "xuuid") || "";

  // 3. 验证Token是否存在于Cookie中
  if (cookie.toLowerCase().indexOf("token=") === -1) {
    throw new Error("Cookie中未包含token信息");
  }

  // 4. 组装数据并持久化存储
  const storageData = {
    queryStr: filteredParams,
    xuuid: xuuidParam,
    headers: {
      "X-Titans-User": LoonUtils.getHeader(requestHeaders, "X-Titans-User"),
      "T": LoonUtils.getHeader(requestHeaders, "T"),
      "Cookie": cookie,
      "User-Agent": LoonUtils.getHeader(requestHeaders, "User-Agent")
    }
  };

  const saveResult = LoonUtils.setStorage(storageKey, storageData);
  if (!saveResult) {
    throw new Error("数据存储失败，请检查Loon存储权限");
  }

  // 5. 成功通知
  LoonUtils.sendNotify(scriptName, "🟢 获取会话成功", "Token已存储，可用于后续自动化操作");
  LoonUtils.log("Token获取成功，存储数据：", storageData);

})().catch((error) => {
  // 异常处理：捕获所有错误并通知
  const errorMsg = error.message || "未知错误";
  LoonUtils.sendNotify(scriptName, "🔴 获取会话失败", `失败原因：${errorMsg}`);
  LoonUtils.log("获取失败：", errorMsg);
}).finally(() => {
  // 脚本结束（必执行）
  LoonUtils.done();
});
