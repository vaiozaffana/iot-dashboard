"use client"

import type React from "react"

import { useCallback, useMemo, useEffect, useState } from "react"

// Performance optimization hooks
export function useOptimizedCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T {
  return useCallback(callback, deps)
}

export function useOptimizedMemo<T>(factory: () => T, deps: any[]): T {
  return useMemo(factory, deps)
}

// Debounce hook for performance
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Intersection observer hook for lazy loading
export function useIntersectionObserver(elementRef: React.RefObject<Element>, options?: IntersectionObserverInit) {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [elementRef, options])

  return isIntersecting
}
