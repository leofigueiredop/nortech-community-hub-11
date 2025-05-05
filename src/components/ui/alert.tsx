import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface AlertProps extends
  React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof alertVariants> {
  titleKey?: string
  descriptionKey?: string
  titleValues?: Record<string, any>
  descriptionValues?: Record<string, any>
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, titleKey, descriptionKey, titleValues, descriptionValues, children, ...props }, ref) => {
    const { t } = useTranslation()
    
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Alert.displayName = "Alert"

interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  translationKey?: string
  values?: Record<string, any>
}

const AlertTitle = React.forwardRef<HTMLParagraphElement, AlertTitleProps>(
  ({ className, translationKey, values, children, ...props }, ref) => {
    const { t } = useTranslation()
    
    return (
      <h5
        ref={ref}
        className={cn("mb-1 font-medium leading-none tracking-tight", className)}
        {...props}
      >
        {translationKey ? t(translationKey, values) : children}
      </h5>
    )
  }
)
AlertTitle.displayName = "AlertTitle"

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  translationKey?: string
  values?: Record<string, any>
}

const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, translationKey, values, children, ...props }, ref) => {
    const { t } = useTranslation()
    
    return (
      <div
        ref={ref}
        className={cn("text-sm [&_p]:leading-relaxed", className)}
        {...props}
      >
        {translationKey ? t(translationKey, values) : children}
      </div>
    )
  }
)
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
