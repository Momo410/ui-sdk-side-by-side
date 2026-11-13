import { useState } from "react"
import { createAgent } from "@ui-sdk/react/agent"
import { Field, FieldLabel } from "@ui-sdk/react/field"
import { Input } from "@ui-sdk/react/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui-sdk/react/select"
import { Switch, SwitchThumb } from "@ui-sdk/react/switch"

const agent = createAgent()
const regions = ["US East", "Europe", "Asia"]

const screenshotSteps = [
  "Take a screenshot of the page",
  "Find the “Project name” box in the picture",
  "Click it",
  "Select all the old text",
  "Type “Atlas”",
  "Take another screenshot",
  "Find the “Region” dropdown",
  "Click it to open",
  "Take another screenshot",
  "Find “Europe” in the list and click it",
  "Take another screenshot",
  "Find the “Email alerts” checkbox",
  "Click it",
  "Take a screenshot to check it all worked",
]

function NormalForm() {
  const [shown, setShown] = useState(0)

  const play = () => {
    setShown(0)
    screenshotSteps.forEach((_, i) => setTimeout(() => setShown(i + 1), 220 * (i + 1)))
  }

  return (
    <div className="card">
      <div className="card-head">
        <span className="tag tag-gray">Normal website</span>
        <h3>AI has to look and click</h3>
      </div>
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <label className="field">
          <span>Project name</span>
          <input className="input" defaultValue="Apollo" />
        </label>
        <label className="field">
          <span>Region</span>
          <select className="input" defaultValue="US East">
            {regions.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
        <label className="switch-row">
          <input type="checkbox" /> Email alerts
        </label>
      </form>
      <button className="btn" onClick={play}>
        Show how an AI does it
      </button>
      <ol className="steps">
        {screenshotSteps.slice(0, shown).map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      {shown === screenshotSteps.length && (
        <p className="note">
          {screenshotSteps.length} steps, and each screenshot costs time and money. If the layout
          moves, the AI can click the wrong thing.
        </p>
      )}
    </div>
  )
}

function UiSdkForm() {
  const [log, setLog] = useState("")
  const [who, setWho] = useState("")

  const read = () => {
    const entries = agent
      .snapshot()
      .filter((e) => ["Project name", "Region", "Email alerts"].includes(e.label ?? ""))
    setLog(JSON.stringify(entries, null, 2))
  }

  const run = async () => {
    const result = await agent.act({
      steps: [
        { ref: "Project name", action: "setValue", args: ["Atlas"] },
        { ref: "Region", action: "setValue", args: ["Europe"] },
        { ref: "Email alerts", action: "setChecked", args: [true] },
      ],
    })
    setLog(
      JSON.stringify(
        { ok: result.ok, error: result.error?.message, values: result.values },
        null,
        2,
      ),
    )
  }

  return (
    <div className="card card-accent">
      <div className="card-head">
        <span className="tag tag-blue">UI SDK website</span>
        <h3>AI talks to the page directly</h3>
      </div>
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <Field className="field">
          <FieldLabel>Project name</FieldLabel>
          <Input
            className="input"
            defaultValue="Apollo"
            onValueChange={(_v: string, d: { source?: string }) =>
              d.source === "agent" && setWho("Last change made by: AI agent")
            }
          />
        </Field>
        <Field className="field">
          <FieldLabel>Region</FieldLabel>
          <Select defaultValue="US East" items={regions}>
            <SelectTrigger className="input select-trigger">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="select-pop">
              {regions.map((r) => (
                <SelectItem key={r} value={r} className="select-item">
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <label className="switch-row">
          <Switch className="switch">
            <SwitchThumb className="thumb" />
          </Switch>
          Email alerts
        </label>
      </form>
      <div className="row">
        <button className="btn" onClick={read}>
          1. AI reads the page
        </button>
        <button className="btn btn-solid" onClick={run}>
          2. AI makes the changes
        </button>
      </div>
      {who && <p className="note good">{who}</p>}
      {log && <pre className="log">{log}</pre>}
      <p className="note">
        2 calls, no screenshots. The AI asks “what’s on this page?” and gets a list back, then says
        “set Project name to Atlas”. The page knows the change came from the AI, so it can say no to
        risky ones.
      </p>
    </div>
  )
}

export { NormalForm, UiSdkForm }
