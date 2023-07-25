import { getCurrentInstance, onMounted } from "vue"

export default function(key) {
    onMounted(() => { console.log(`get ${key} plugin`) })
    // 使用自定义插件
    const instance = getCurrentInstance();
    return instance.appContext.config.globalProperties[key];
}
