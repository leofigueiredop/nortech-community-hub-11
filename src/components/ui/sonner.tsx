import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[hsl(var(--toast-background))] group-[.toaster]:text-[hsl(var(--toast-foreground))] group-[.toaster]:border-[hsl(var(--toast-border))] group-[.toaster]:shadow-lg",
          title: "group-[.toast]:text-[hsl(var(--toast-title))] font-medium",
          description: "group-[.toast]:text-[hsl(var(--toast-description))]",
          actionButton:
            "group-[.toast]:bg-[hsl(var(--primary))] group-[.toast]:text-[hsl(var(--primary-foreground))]",
          cancelButton:
            "group-[.toast]:bg-[hsl(var(--muted))] group-[.toast]:text-[hsl(var(--muted-foreground))]",
          error: "group-[.toaster]:bg-[hsl(var(--toast-destructive-background,0_84.2%_60.2%))] group-[.toaster]:text-[hsl(var(--toast-destructive-foreground,0_0%_100%))] group-[.toaster]:border-red-200",
          success: "group-[.toaster]:bg-[hsl(var(--toast-background))] group-[.toaster]:border-green-200",
          warning: "group-[.toaster]:bg-[hsl(var(--toast-background))] group-[.toaster]:border-yellow-200",
          info: "group-[.toaster]:bg-[hsl(var(--toast-background))] group-[.toaster]:border-blue-200",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
