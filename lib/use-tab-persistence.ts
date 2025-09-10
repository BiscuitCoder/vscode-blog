import { useState, useEffect, useCallback } from 'react'

interface TabData {
  id: string
  name: string
}

interface PersistedTabState {
  tabs: TabData[]
  activeTabId: string | null
}

const STORAGE_KEY = 'vscode-blog-tabs'

// 从本地存储加载标签状态
const loadPersistedTabs = (): PersistedTabState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as PersistedTabState
      // 验证数据结构
      if (Array.isArray(parsed.tabs) && typeof parsed.activeTabId === 'string') {
        return parsed
      }
    }
  } catch (error) {
    console.warn('Failed to load persisted tabs:', error)
  }
  return { tabs: [], activeTabId: null }
}

// 保存标签状态到本地存储
const savePersistedTabs = (state: PersistedTabState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.warn('Failed to save persisted tabs:', error)
  }
}

export function useTabPersistence() {
  const [persistedState, setPersistedState] = useState<PersistedTabState>(() => loadPersistedTabs())

  // 添加标签
  const addTab = useCallback((tab: TabData) => {
    setPersistedState(current => {
      const newTabs = [...current.tabs]
      // 检查是否已存在
      const existingIndex = newTabs.findIndex(t => t.id === tab.id)
      if (existingIndex === -1) {
        newTabs.push(tab)
      }

      const newState = {
        tabs: newTabs,
        activeTabId: tab.id // 新添加的标签设为活动状态
      }

      savePersistedTabs(newState)
      return newState
    })
  }, [])

  // 移除标签
  const removeTab = useCallback((tabId: string) => {
    setPersistedState(current => {
      const newTabs = current.tabs.filter(tab => tab.id !== tabId)
      let newActiveTabId = current.activeTabId

      // 如果移除的是当前活动标签
      if (current.activeTabId === tabId) {
        if (newTabs.length > 0) {
          // 选择前一个标签，如果没有则选择第一个
          const currentIndex = current.tabs.findIndex(tab => tab.id === tabId)
          if (currentIndex > 0) {
            newActiveTabId = newTabs[currentIndex - 1].id
          } else {
            newActiveTabId = newTabs[0].id
          }
        } else {
          newActiveTabId = null
        }
      }

      const newState = {
        tabs: newTabs,
        activeTabId: newActiveTabId
      }

      savePersistedTabs(newState)
      return newState
    })
  }, [])

  // 设置活动标签
  const setActiveTab = useCallback((tabId: string) => {
    setPersistedState(current => {
      const newState = {
        ...current,
        activeTabId: tabId
      }
      savePersistedTabs(newState)
      return newState
    })
  }, [])

  // 清空所有标签
  const clearAllTabs = useCallback(() => {
    const newState = { tabs: [], activeTabId: null }
    setPersistedState(newState)
    savePersistedTabs(newState)
  }, [])

  // 检查标签是否存在
  const hasTab = useCallback((tabId: string) => {
    return persistedState.tabs.some(tab => tab.id === tabId)
  }, [persistedState.tabs])

  // 获取活动标签
  const getActiveTab = useCallback(() => {
    if (!persistedState.activeTabId) return null
    return persistedState.tabs.find(tab => tab.id === persistedState.activeTabId) || null
  }, [persistedState])

  return {
    // 状态
    tabs: persistedState.tabs,
    activeTabId: persistedState.activeTabId,

    // 方法
    addTab,
    removeTab,
    setActiveTab,
    clearAllTabs,

    // 工具方法
    hasTab,
    getActiveTab,
    hasTabs: persistedState.tabs.length > 0
  }
}
