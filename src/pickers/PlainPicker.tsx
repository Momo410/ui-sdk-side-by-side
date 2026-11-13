import { useState } from "react"
import { byName, icons } from "../icons"

function PlainPicker() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const Picked = value ? byName.get(value)!.icon : null

  const results = icons.filter((entry) => entry.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="picker">
      <button className="trigger" onClick={() => setOpen(!open)}>
        {Picked ? (
          <>
            <Picked /> {value}
          </>
        ) : (
          "Pick an icon"
        )}
      </button>

      {open && (
        <div className="pop">
          <input
            className="search"
            placeholder="Search icons…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="grid">
            {results.length === 0 && <p className="hint">No icons found.</p>}
            {results.map(({ name, icon: Icon }) => (
              <button
                key={name}
                className="icon"
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
        </div>
      )}
    </div>
  )
}

export { PlainPicker }
