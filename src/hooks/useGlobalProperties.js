import { getCurrentInstance, onMounted } from "vue"

export default function(key) {
    onMounted(() => { console.log(`get ${key} plugin`) })
    
    const instance = getCurrentInstance();
    return instance.appContext.config.globalProperties[key];
}
