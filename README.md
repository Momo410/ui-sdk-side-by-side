# UI SDK, side by side

**Live demo: https://ui-sdk.aiwithmomo.com**

Vercel just released [UI SDK](https://github.com/vercel-labs/ui) (beta). This repo explains it simply by building **the same icon picker three ways**, side by side, so you can feel the difference with your own keyboard.

## What is UI SDK, in one breath?

Every button and popup has **paint** (how it looks) and **muscles** (what it does when you press Esc, use arrow keys, click outside, or use a screen reader). UI SDK is a box of 50+ ready-made muscles with no paint. You, or your AI agent, snap them together to build any component, in React, Vue, Svelte, Solid or plain HTML.

## The demo

| | Plain React | Radix UI | UI SDK |
|---|:-:|:-:|:-:|
| Esc closes it | ✗ | ✓ | ✓ |
| Click outside closes it | ✗ | ✓ | ✓ |
| Focus goes back to the button | ✗ | ✓ | ✓ |
| Arrow keys move between icons | ✗ | ✗ | ✓ |
| “idea” finds the lightbulb (fuzzy search) | ✗ | ✗ | ✓ |
| Enter picks the top result | ✗ | ✗ | ✓ |
| Screen reader hears how many match | ✗ | ✗ | ✓ |

✗ means *you write that part yourself*, not that it's impossible.

It also has a live **AI agent test**: a settings form built with UI SDK components that a scripted agent reads (`agent.snapshot()`) and changes (`agent.act()`) through UI SDK's agent bridge. No screenshots, no clicking.

## Pros and cons (short)

**Use UI SDK when:** you're building something no library ships (kanban, timeline, custom picker), you need the same component in several frameworks, or you want AI agents to use your app.

**Wait or pick Radix / Base UI / shadcn when:** you need stability today (UI SDK is `0.1.0-beta.1`), you want a big community, or you just need normal menus and dialogs fast.

## Run it

```bash
npm install
npm run dev
```

Files worth reading:

- `src/pickers/PlainPicker.tsx`, `RadixPicker.tsx`, `UiSdkPicker.tsx`: the three pickers
- `src/agent/AgentDemo.tsx`: the agent bridge test

## Credits

Not affiliated with Vercel. `src/pickers/UiSdkPicker.tsx` is adapted from Vercel's [icon picker example](https://github.com/vercel-labs/ui/blob/main/examples/core/react/icon-picker.tsx) (Apache-2.0). Icons by [Lucide](https://lucide.dev). Benchmark numbers on the page are from the [UI SDK docs](https://ui-sdk.dev/docs/agents).

MIT licensed.
