import { useState } from "react"
import * as Popover from "@radix-ui/react-popover"
import { byName, icons } from "../icons"

function RadixPicker() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const Picked = value ? byName.get(value)!.icon : null

  const results = icons.filter((entry) => entry.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setQuery("")
      }}
    >
      <Popover.Trigger className="trigger">
        {Picked ? (
          <>
            <Picked /> {value}
          </>
        ) : (
          "Pick an icon"
        )}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="pop" sideOffset={6} align="start" aria-label="Choose an icon">
          <input
            className="search"
            placeholder="Search icons…"
            aria-label="Search icons"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="grid">
            {results.length === 0 && <p className="hint">No icons found.</p>}
            {results.map(({ name, icon: Icon }) => (
              <button
                key={name}
                className="icon"
                aria-label={name}
                aria-pressed={value === name}
                onClick={() => {
                  setValue(name)
                  setOpen(false)
                  setQuery("")
                }}
              >
                <Icon />
              </button>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export { RadixPicker }
