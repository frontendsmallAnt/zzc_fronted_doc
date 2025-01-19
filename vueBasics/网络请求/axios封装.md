# Vue3 Axios请求库封装

本文介绍如何在Vue3后台管理系统中封装一个高质量的Axios请求库。

## 基础配置

### 1. 安装依赖
```bash
pnpm add axios qs
```

### 2. 创建请求实例
```typescript
// src/utils/request/index.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})
```

### 3. 类型定义
```typescript
// src/utils/request/types.ts
export interface Response<T = any> {
  code: number
  message: string
  data: T
}

export interface RequestOptions {
  // 是否显示loading
  loading?: boolean
  // 是否显示错误信息
  showError?: boolean
  // 错误信息提示标题
  errorTitle?: string
  // 是否直接获取响应数据
  direct?: boolean
}
```

## 请求拦截器

```typescript
// 请求拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const userStore = useUserStore()
    const token = userStore.token
    
    // 添加token
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    // 处理loading
    if (config.loading) {
      startLoading()
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
```

## 响应拦截器

```typescript
// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<Response>) => {
    const { code, message, data } = response.data
    
    // 关闭loading
    stopLoading()
    
    // 处理业务错误
    if (code !== 0) {
      if (response.config.showError) {
        ElMessage.error(message)
      }
      return Promise.reject(new Error(message))
    }
    
    return response.config.direct ? data : response.data
  },
  (error) => {
    stopLoading()
    
    // 处理HTTP错误
    if (error.response) {
      handleHttpError(error.response)
    }
    
    return Promise.reject(error)
  }
)
```

## 错误处理

```typescript
// src/utils/request/errorHandler.ts
const handleHttpError = (response: AxiosResponse) => {
  const status = response.status
  
  switch (status) {
    case 401:
      // 未授权，跳转登录
      handleUnauthorized()
      break
    case 403:
      ElMessage.error('没有权限访问该资源')
      break
    case 404:
      ElMessage.error('请求的资源不存在')
      break
    case 500:
      ElMessage.error('服务器内部错误')
      break
    default:
      ElMessage.error('网络错误')
  }
}

const handleUnauthorized = () => {
  const userStore = useUserStore()
  //执行退出逻辑
  userStore.logout()
  //重定向到login页面
  router.push('/login')
}
```

## 请求方法封装

```typescript
// src/utils/request/index.ts
export const request = {
  get<T = any>(
    url: string,
    params?: any,
    options?: RequestOptions
  ): Promise<Response<T>> {
    return service.get(url, { params, ...options })
  },
  
  post<T = any>(
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<Response<T>> {
    return service.post(url, data, options)
  },
  
  put<T = any>(
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<Response<T>> {
    return service.put(url, data, options)
  },
  
  delete<T = any>(
    url: string,
    params?: any,
    options?: RequestOptions
  ): Promise<Response<T>> {
    return service.delete(url, { params, ...options })
  }
}
```

## 取消请求

```typescript
// src/utils/request/cancel.ts
import axios, { Canceler } from 'axios'

// 存储请求标识和取消函数
const pendingMap = new Map<string, Canceler>()

export const getPendingUrl = (config: AxiosRequestConfig) => {
  return [config.method, config.url, JSON.stringify(config.params), JSON.stringify(config.data)].join('&')
}

export class AxiosCancel {
  /**
   * 添加请求
   */
  addPending(config: AxiosRequestConfig) {
    this.removePending(config)
    const url = getPendingUrl(config)
    config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
      if (!pendingMap.has(url)) {
        pendingMap.set(url, cancel)
      }
    })
  }

  /**
   * 移除请求
   */
  removePending(config: AxiosRequestConfig) {
    const url = getPendingUrl(config)
    if (pendingMap.has(url)) {
      const cancel = pendingMap.get(url)
      cancel && cancel()
      pendingMap.delete(url)
    }
  }

  /**
   * 清空所有pending
   */
  removeAllPending() {
    pendingMap.forEach(cancel => {
      cancel && cancel()
    })
    pendingMap.clear()
  }
}
```

## 使用示例

### 1. API定义
```typescript
// src/api/user.ts
import { request } from '@/utils/request'

export interface LoginParams {
  username: string
  password: string
}

export interface UserInfo {
  id: number
  name: string
  avatar: string
}

export const userApi = {
  login(data: LoginParams) {
    return request.post<string>('/auth/login', data, {
      loading: true,
      showError: true
    })
  },
  
  getUserInfo() {
    return request.get<UserInfo>('/user/info')
  }
}
```

### 2. 组件中使用
```vue
<script setup lang="ts">
import { userApi } from '@/api/user'

const handleLogin = async () => {
  try {
    const { data: token } = await userApi.login({
      username: 'admin',
      password: '123456'
    })
    // 处理登录成功
  } catch (error) {
    // 处理错误
  }
}

const getUserInfo = async () => {
  const { data } = await userApi.getUserInfo()
  // 使用用户信息
}
</script>
```

## 高级功能

### 1. 请求重试
```typescript
import axios from 'axios'
import { retry } from '@/utils/request/retry'

// 配置请求重试
service.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config
    
    if (config && config.retryTimes > 0) {
      return retry(service, error)
    }
    return Promise.reject(error)
  }
)
```

### 2. 请求缓存
```typescript
// src/utils/request/cache.ts
const cacheMap = new Map()

export const cacheAdapterEnhancer = (adapter) => {
  return async (config) => {
    const { url, method, params, data } = config
    const id = [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
    
    let response = cacheMap.get(id)
    if (!response || config.forceUpdate) {
      response = await adapter(config)
      cacheMap.set(id, response)
    }
    return response
  }
}
```

### 3. 上传文件
```typescript
export const uploadFile = (
  url: string,
  file: File,
  onProgress?: (progress: number) => void
) => {
  const formData = new FormData()
  formData.append('file', file)
  
  return request.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        onProgress(progress)
      }
    }
  })
}
```

## 最佳实践

1. **统一错误处理**
```typescript
const errorHandler = (error: any) => {
  if (error.response) {
    const { status, data } = error.response
    // 处理不同状态码
    handleHttpError({ status, data })
  } else if (error.request) {
    // 请求发出但未收到响应
    ElMessage.error('网络连接失败，请检查网络')
  } else {
    // 请求配置出错
    ElMessage.error(error.message)
  }
}
```

2. **请求超时处理**
```typescript
service.defaults.timeout = 15000
service.defaults.timeoutErrorMessage = '请求超时，请重试'
```

3. **接口版本控制**
```typescript
const apiVersion = 'v1'
service.defaults.baseURL = `${import.meta.env.VITE_API_URL}/${apiVersion}`
``` 