import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form"
import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { DynamicTranslate } from '@/components/DynamicTranslate'

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

interface FormLabelProps extends
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  translationKey?: string
  values?: Record<string, any>
}

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  FormLabelProps
>(({ className, translationKey, values, children, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  let labelContent = children;
  if (translationKey) {
    labelContent = (
      <DynamicTranslate translationKey={translationKey} ns="forms" params={values} />
    );
  }

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    >
      {labelContent}
    </Label>
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

interface FormDescriptionProps extends
  React.HTMLAttributes<HTMLParagraphElement> {
  translationKey?: string
  values?: Record<string, any>
}

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  FormDescriptionProps
>(({ className, translationKey, values, children, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  let descriptionContent = children;
  if (translationKey) {
    descriptionContent = (
      <DynamicTranslate translationKey={translationKey} ns="forms" params={values} />
    );
  }

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    >
      {descriptionContent}
    </p>
  )
})
FormDescription.displayName = "FormDescription"

interface FormMessageProps extends
  React.HTMLAttributes<HTMLParagraphElement> {
  translationKey?: string
  values?: Record<string, any>
}

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  FormMessageProps
>(({ className, translationKey, values, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  
  let body = children
  if (error) {
    if (translationKey) {
      body = (
        <DynamicTranslate translationKey={translationKey} ns="forms" params={values} />
      );
    } else {
      body = (
        <DynamicTranslate translationKey={`validation.${error.message}`} ns="forms" params={values} fallback={String(error.message)} />
      );
    }
  }

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
