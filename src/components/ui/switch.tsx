import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

type SwitchProps = React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
  /** Affiche « activé » / « désactivé » à droite de l'interrupteur. */
  showState?: boolean
}

/**
 * Interrupteur : piste verte quand il est activé, gris foncé quand il est désactivé.
 * Les couleurs sont explicites (et non bg-primary / bg-input) pour rester lisibles
 * sur les cartes grises de la page de configuration.
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, showState = false, ...props }, ref) => {
  const root = (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-700 disabled:cursor-not-allowed disabled:opacity-40",
        "data-[state=checked]:bg-green-600 data-[state=checked]:border-green-500",
        "data-[state=unchecked]:bg-zinc-700 data-[state=unchecked]:border-zinc-500",
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitives.Root>
  )

  if (!showState) return root

  return (
    <span className="inline-flex items-center gap-2 shrink-0">
      {root}
      <span
        aria-hidden="true"
        className={cn(
          "text-xs font-medium w-16",
          props.checked ? "text-green-300" : "text-zinc-300",
          props.disabled && "opacity-50"
        )}
      >
        {props.checked ? "activé" : "désactivé"}
      </span>
    </span>
  )
})
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
