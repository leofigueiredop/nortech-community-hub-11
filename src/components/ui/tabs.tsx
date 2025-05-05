import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"
import { safeTranslate } from "@/lib/i18n"
import { TranslationProps, AriaLabelProps } from "@/types/translations"

const Tabs = TabsPrimitive.Root

interface TabsListProps extends
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
  AriaLabelProps {}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, ariaLabel, ...props }, ref) => {
  const { t } = useTranslation()
  
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className
      )}
      aria-label={ariaLabel || safeTranslate(t, 'ui.tabs.aria.tabList')}
      {...props}
    />
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

interface TabsTriggerProps extends
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
  TranslationProps {}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, translationKey, values, children, ...props }, ref) => {
  const { t } = useTranslation()
  
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        className
      )}
      aria-label={safeTranslate(t, 'ui.tabs.aria.tab')}
      {...props}
    >
      {translationKey ? safeTranslate(t, translationKey, values) : children}
    </TabsPrimitive.Trigger>
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

interface TabsContentProps extends
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>,
  TranslationProps {}

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, translationKey, values, children, ...props }, ref) => {
  const { t } = useTranslation()
  
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      aria-label={safeTranslate(t, 'ui.tabs.aria.tabPanel')}
      {...props}
    >
      {translationKey ? safeTranslate(t, translationKey, values) : children}
    </TabsPrimitive.Content>
  )
})
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
