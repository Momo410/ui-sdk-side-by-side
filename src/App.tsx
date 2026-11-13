import type { ReactNode } from "react"
import { PlainPicker } from "./pickers/PlainPicker"
import { RadixPicker } from "./pickers/RadixPicker"
import { UiSdkPicker } from "./pickers/UiSdkPicker"
import { NormalForm, UiSdkForm } from "./agent/AgentDemo"
import plainCode from "./pickers/PlainPicker.tsx?raw"
import radixCode from "./pickers/RadixPicker.tsx?raw"
import uiSdkCode from "./pickers/UiSdkPicker.tsx?raw"

const tests = [
  { id: "esc", label: "Press Esc to close it" },
  { id: "outside", label: "Click outside to close it" },
  { id: "return", label: "Keyboard goes back to the button after closing" },
  { id: "arrows", label: "Arrow keys move between icons (Tab once to get in)" },
  { id: "fuzzy", label: "Type “idea” and it finds the 💡 lightbulb" },
  { id: "enter", label: "Press Enter to pick the top result" },
  { id: "announce", label: "Blind users hear how many icons match" },
]

type Result = Record<string, boolean>

const columns: {
  key: string
  tag: string
  tagClass: string
  title: string
  kid: string
  picker: ReactNode
  code: string
  results: Result
}[] = [
  {
    key: "plain",
    tag: "No library",
    tagClass: "tag-gray",
    title: "Plain React",
    kid: "You build the toy car yourself, with your own hands.",
    picker: <PlainPicker />,
    code: plainCode,
    results: {
      esc: false,
      outside: false,
      return: false,
      arrows: false,
      fuzzy: false,
      enter: false,
      announce: false,
    },
  },
  {
    key: "radix",
    tag: "Finished parts",
    tagClass: "tag-gray",
    title: "Radix UI",
    kid: "You buy a ready-made box (the popup). The inside you still build by hand.",
    picker: <RadixPicker />,
    code: radixCode,
    results: {
      esc: true,
      outside: true,
      return: true,
      arrows: false,
      fuzzy: false,
      enter: false,
      announce: false,
    },
  },
  {
    key: "uisdk",
    tag: "Behaviour LEGO",
    tagClass: "tag-blue",
    title: "UI SDK",
    kid: "You snap 5 ready-made LEGO pieces together: popup, arrows, search, announcer, focus.",
    picker: <UiSdkPicker />,
    code: uiSdkCode,
    results: {
      esc: true,
      outside: true,
      return: true,
      arrows: true,
      fuzzy: true,
      enter: true,
      announce: true,
    },
  },
]

const lines = (code: string) => code.split("\n").filter((l) => l.trim()).length

const pros = [
  [
    "Build anything",
    "Not just menus and dialogs. A kanban board, a timeline, an emoji picker: you snap the same pieces together.",
  ],
  ["Works everywhere", "Write it once and it runs in React, Vue, Svelte, Solid and plain HTML."],
  [
    "AI-ready",
    "An AI can read and change your page in 2 calls instead of clicking around with screenshots.",
  ],
  ["Made for AI builders", "It ships a skill, so Claude or Codex knows exactly how to use it."],
  [
    "Works for everyone",
    "Keyboard, screen reader and right-to-left languages come built in and tested.",
  ],
]

const cons = [
  ["Brand new beta", "Version 0.1.0-beta.1, released 12 Nov 2026. Things can change or break."],
  [
    "More code to read",
    "Building your own piece takes more lines than Radix. It's written for AI to write, not humans.",
  ],
  ["No paint", "It looks like nothing until you style it (there's an optional default theme)."],
  [
    "Small community",
    "Few tutorials, Stack Overflow answers or examples yet. Radix and shadcn have years of them.",
  ],
  ["React 19 only", "The React package needs React 19 or newer."],
]

const pick = [
  [
    "Just want a nice-looking site, fast",
    "shadcn/ui or MUI",
    "Painted and ready. Copy, paste, done.",
  ],
  [
    "Normal app with menus, dialogs, tabs",
    "Radix UI / Base UI / React Aria",
    "Proven, stable, huge community.",
  ],
  [
    "Custom thing nobody ships (kanban, picker, timeline)",
    "UI SDK",
    "Snap behaviours together instead of hand-coding keyboard and focus.",
  ],
  [
    "You want AI agents to use your app",
    "UI SDK",
    "The agent bridge is the only one of its kind right now.",
  ],
  ["Same component in React and Vue/Svelte", "UI SDK or Ark UI", "Both work across frameworks."],
]

function App() {
  return (
    <main>
      <header className="hero">
        <p className="eyebrow">Explained simply</p>
        <h1>UI SDK, side by side</h1>
        <p className="lede">
          Every button and popup on a website has <b>paint</b> (how it looks) and <b>muscles</b>{" "}
          (what it does when you press keys, click outside, or use a screen reader). Vercel's{" "}
          <a href="https://github.com/vercel-labs/ui">UI SDK</a> is a box of 50+ ready-made muscles.
          No paint. You, or your AI, snap them together.
        </p>
      </header>

      <section>
        <h2>1. The same icon picker, built three ways</h2>
        <p className="sub">
          Same icons, same look. Click each button and try the tests underneath. ✗ doesn't mean it's
          impossible: it means <b>you have to write that part yourself</b>.
        </p>
        <div className="cols">
          {columns.map((c) => {
            const passed = Object.values(c.results).filter(Boolean).length
            return (
              <div key={c.key} className={`card ${c.key === "uisdk" ? "card-accent" : ""}`}>
                <div className="card-head">
                  <span className={`tag ${c.tagClass}`}>{c.tag}</span>
                  <h3>{c.title}</h3>
                  <p className="kid">{c.kid}</p>
                </div>
                <div className="stage">{c.picker}</div>
                <ul className="checks">
                  {tests.map((t) => (
                    <li key={t.id} className={c.results[t.id] ? "yes" : "no"}>
                      <span aria-hidden="true">{c.results[t.id] ? "✓" : "✗"}</span>
                      {t.label}
                    </li>
                  ))}
                </ul>
                <div className="score">
                  <span>
                    <b>{passed}</b>/{tests.length} work for free
                  </span>
                  <span>{lines(c.code)} lines of code</span>
                </div>
                <details>
                  <summary>See the code</summary>
                  <pre className="code">{c.code}</pre>
                </details>
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <h2>2. Can an AI use the page?</h2>
        <p className="sub">
          This is the new idea in UI SDK. Both forms below look the same. The right one is real:
          press the buttons and a scripted AI agent changes it through UI SDK's agent bridge.
        </p>
        <div className="cols cols-2">
          <NormalForm />
          <UiSdkForm />
        </div>
        <div className="bench">
          <p className="bench-title">
            Vercel's own test: Claude Sonnet doing the same settings task
          </p>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Clicking with screenshots</th>
                <th>UI SDK agent bridge</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Steps</td>
                <td>16</td>
                <td className="win">5 (−69%)</td>
              </tr>
              <tr>
                <td>Text read</td>
                <td>39.8k</td>
                <td className="win">6.8k (−83%)</td>
              </tr>
              <tr>
                <td>Time</td>
                <td>41 s</td>
                <td className="win">16 s (−61%)</td>
              </tr>
              <tr>
                <td>Cost</td>
                <td>$0.073</td>
                <td className="win">$0.032 (−56%)</td>
              </tr>
            </tbody>
          </table>
          <p className="src">
            Source: <a href="https://ui-sdk.dev/docs/agents">ui-sdk.dev/docs/agents</a> (median of 3
            runs).
          </p>
        </div>
      </section>

      <section>
        <h2>3. Pros and cons</h2>
        <div className="cols cols-2">
          <div className="card">
            <h3 className="good-h">👍 Why use UI SDK</h3>
            <ul className="pc">
              {pros.map(([t, d]) => (
                <li key={t}>
                  <b>{t}.</b> {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h3 className="bad-h">👎 Why wait</h3>
            <ul className="pc">
              {cons.map(([t, d]) => (
                <li key={t}>
                  <b>{t}.</b> {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>4. So which one should I pick?</h2>
        <div className="table-wrap">
          <table className="pick">
            <thead>
              <tr>
                <th>If you…</th>
                <th>Use</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              {pick.map(([a, b, c]) => (
                <tr key={a}>
                  <td>{a}</td>
                  <td>
                    <b>{b}</b>
                  </td>
                  <td>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="oneline">
          <b>In one line:</b> Radix and shadcn give you finished parts. UI SDK gives your AI the
          LEGO pieces to build <i>any</i> part, in any framework, and lets AI use the finished site
          without clicking around.
        </p>
      </section>

      <footer>
        Not made by Vercel. A learning demo built with{" "}
        <a href="https://github.com/vercel-labs/ui">@ui-sdk/core</a> 0.1.0-beta.1, Radix UI and
        lucide icons. The UI SDK icon picker is adapted from Vercel's Apache-2.0 example.
      </footer>
    </main>
  )
}

export default App
