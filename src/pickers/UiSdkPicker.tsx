// Adapted from vercel-labs/ui examples/core/react/icon-picker.tsx (Apache-2.0).
import { useState } from "react"
import {
  announce,
  createChange,
  createPopup,
  createRovingFocus,
  definePrimitive,
  popupContent,
  popupState,
  popupTrigger,
  selects,
  spatialMove,
} from "@ui-sdk/core"
import { popoverPreset } from "@ui-sdk/core/popover"
import { fuzzyScore } from "@ui-sdk/core/text-match"
import { createParts } from "@ui-sdk/react/primitive"
import { byName, icons } from "../icons"

type PickerOptions = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  value?: string
  onValueChange?: (value: string) => void
}

type PickerState = ReturnType<typeof popupState> & {
  value: string | null
  query: string
  stop: string | null
  focused: string | null
  highlighted: string | null
}

const iconPicker = definePrimitive({
  name: "icon-picker",
  options: {
    open: "boolean",
    defaultOpen: "boolean",
    onOpenChange: "callback",
    value: "string",
    onValueChange: "callback",
  },
  state: (options: PickerOptions): PickerState => ({
    ...popupState(options),
    value: options.value ?? null,
    query: "",
    stop: null,
    focused: null,
    highlighted: null,
  }),
  sync: (options) => ({
    ...(options.open === undefined ? {} : { open: options.open }),
    ...(options.value === undefined ? {} : { value: options.value }),
  }),
  api: (context) => {
    const { store } = context
    const popup = createPopup(context, { preset: popoverPreset })
    const change = createChange(context)
    let searched = false

    const highlightBest = () =>
      store.set({
        highlighted: store.get().query.trim() ? (roving.items()[0]?.key ?? null) : null,
      })

    const roving = createRovingFocus<PickerState, { value: string }>(context, {
      slot: "icon",
      key: "stop",
      move: spatialMove(),
      onItemsChange: () => {
        if (!searched) return
        const count = roving.items().length
        highlightBest()
        announce(count === 0 ? "No icons found" : count === 1 ? "1 icon" : `${count} icons`)
      },
    })

    let wasOpen = store.get().open
    store.subscribe(() => {
      const { open, value } = store.get()
      if (open === wasOpen) return
      wasOpen = open
      if (!open) return
      searched = false
      store.set({ query: "", stop: value, highlighted: null })
    })

    const api = {
      ...popup,
      roving,
      setFocused: (icon: string | null) => store.set({ focused: icon }),
      search(query: string) {
        searched = true
        store.set({ query })
        requestAnimationFrame(highlightBest)
      },
      pick(icon: string, event?: Event) {
        change("value", icon, { reason: "item-press", event })
        popup.close({ reason: "item-press", event })
      },
      searchKeydown(event: KeyboardEvent) {
        const first = roving.items()[0]
        if (event.key === "ArrowDown" && first) {
          event.preventDefault()
          roving.focus(first.key)
        } else if (event.key === "Enter" && first && store.get().query.trim()) {
          event.preventDefault()
          api.pick(first.key, event)
        }
      },
      iconKeydown(event: KeyboardEvent, el: HTMLElement) {
        const typing =
          event.key.length === 1 &&
          event.key !== " " &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.altKey
        if (typing) (context.element("search") as HTMLInputElement | null)?.focus()
        else roving.keydown(event, el)
      },
    }
    return api
  },
  slots: (slot) => ({
    trigger: popupTrigger(slot),
    content: popupContent(slot),
    search: slot({
      attrs: (state) => ({ type: "search", value: state.query, autocomplete: "off" }),
      on: {
        input: (event, { api }) => api.search((event.target as HTMLInputElement).value),
        keydown: (event, { api }) => api.searchKeydown(event),
      },
    }),
    grid: slot<{}, { query: string }>({
      attrs: () => ({ role: "group" }),
      state: (state) => ({ query: state.query }),
    }),
    icon: slot<{ value: string }>({
      props: { value: "string" },
      selects: selects({ stop: ({ key }) => [key, null] }),
      attrs: (state, part) => ({
        type: "button",
        tabindex: part.api.roving.tabIndex(state, part),
        "aria-pressed": String(state.value === part.key),
        "data-highlighted":
          state.focused === null && state.highlighted === part.key ? "" : undefined,
      }),
      press: ({ api, key }, event) => api.pick(key, event),
      on: {
        keydown: (event, { el, api }) => api.iconKeydown(event, el!),
        focus: (_event, { api, key }) => api.setFocused(key),
        blur: (_event, { api }) => api.setFocused(null),
      },
      bind: (el, part) => part.api.roving.bind(el, part),
    }),
  }),
  agent: { actions: ["pick", "setOpen"] },
})

const parts = createParts(iconPicker, {
  trigger: "button",
  content: "div",
  search: "input",
  grid: "div",
  icon: "button",
})

function search(query: string) {
  if (!query.trim()) return icons
  return icons
    .map((entry) => ({
      entry,
      score: Math.max(fuzzyScore(entry.name, query), fuzzyScore(entry.keywords, query) * 0.9),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ entry }) => entry)
}

function UiSdkPicker() {
  const [value, setValue] = useState<string | null>(null)
  const Picked = value ? byName.get(value)!.icon : null

  return (
    <div className="picker">
      <parts.Root value={value ?? undefined} onValueChange={(next: string) => setValue(next)}>
        <parts.Trigger className="trigger">
          {Picked ? (
            <>
              <Picked /> {value}
            </>
          ) : (
            "Pick an icon"
          )}
        </parts.Trigger>
        <parts.Content className="pop" sideOffset={6} aria-label="Choose an icon">
          <parts.Search className="search" aria-label="Search icons" placeholder="Search icons…" />
          <parts.Grid className="grid" aria-label="Icons">
            {({ query }: { query: string }) => {
              const results = search(query)
              if (results.length === 0) return <p className="hint">No icons found.</p>
              return results.map(({ name, icon: Icon }) => (
                <parts.Icon key={name} className="icon" value={name} aria-label={name}>
                  <Icon />
                </parts.Icon>
              ))
            }}
          </parts.Grid>
        </parts.Content>
      </parts.Root>
    </div>
  )
}

export { UiSdkPicker }
