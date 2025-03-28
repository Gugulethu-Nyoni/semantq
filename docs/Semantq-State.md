# **Semantq State Management Documentation**  
**Version 1.0**

Semantq’s state management system is designed around **fine-grained reactivity**, **predictable workflows**, and **seamless full-stack sync**. It combines the best of modern patterns (signals, state machines, CRDTs) with a unified API that works across code, low-code, and no-code environments.  


## **Installation & Import Methods**

### **1. NPM Module (Recommended)**
```bash
npm install @semantq/state
```

#### **Import Structure**
```javascript
// Core Reactivity
import { pulse, reState } from "@semantq/state/reactivity";

// State Machines
import { motive } from "@semantq/state/machines";

// Async/Streams
import { flow } from "@semantq/state/streams";

// Server Sync
import { sync } from "@semantq/state/sync";

// Debugging
import { trace } from "@semantq/state/debug";
```

---

### **2. Script Tag Usage**
#### **A. Standard HTML Script Tag**

In your index.html you can import state this way: 
```html
<script src="https://cdn.semantq.dev/state@1.0/core.js"></script>
<script>
  const { pulse, reState } = SemantqState;
</script>
```

In your components or +pages you can import state this way:



#### **B. Semantq Custom Script Tag**
```html
@script
  // Import specific modules (tree-shaking compatible)
  const { motive, flow } = await import("@semantq/state/machines");
  const { sync } = await import("@semantq/state/sync");
@end
```

---

## **Usage Examples**

### **1. Basic Setup (NPM)**
```javascript
// main.js
import { pulse } from "@semantq/state/reactivity";

const count = pulse(0);
```

### **2. Component Usage (Script Tag)**
```html
@script
  const user = pulse({ name: "Alex" });
  const isAdmin = reState(() => user.value.role === "admin");
@end

<div>
  <h1>Welcome, {user.name}!</h1>
  
  @if(isAdmin)
    <AdminPanel />
  @endif
</div>
```

---

## **Module Structure**
| Module Path                  | Exports                          | Use Case                     |
|------------------------------|----------------------------------|-----------------------------|
| `@semantq/state/reactivity`  | `pulse`, `reState`               | Core reactivity             |
| `@semantq/state/machines`    | `motive`                         | State machines              |
| `@semantq/state/streams`     | `flow`, `surge`                  | Async/event streams         |
| `@semantq/state/sync`        | `sync` (CRDT/REST)               | Server/real-time sync       |
| `@semantq/state/debug`       | `trace`, `annotate`              | Debugging/AI metadata       |

---

## **Advanced Import Patterns**

### **1. Dynamic Imports (Code Splitting)**
```javascript
const { motive } = await import("@semantq/state/machines");
```

### **2. Node.js/SSR Usage**
```javascript
// server.js
import { sync } from "@semantq/state/sync";
const dbState = sync.api("/data");
```

---
<!--
## **CDN Availability**
All modules are available via CDN with semver versioning:
```html
<script src="https://cdn.semantq.dev/state@1.0/reactivity.js"></script>
<script src="https://cdn.semantq.dev/state@1.0/machines.js"></script>
```

---

## **TypeScript Support**
Types are included in the package:
```typescript
import type { Pulse } from "@semantq/state/reactivity";
```

---
-->
**Next Steps**:  
- [Explore Module APIs](https://semantq.dev/docs/state/imports)  
- [Try the Interactive Tutorial](https://semantq.dev/learn/state-management)  








---

## **Core Concepts**  
### **1. `pulse` (Reactive State)**  
**What it is**: The atomic unit of state. Automatically tracks dependencies and updates only what’s needed.  
**Use Case**: Local component state, form inputs, UI toggles.  

```html
<script>
  // Declare a pulse
  const counter = pulse(0);
</script>

<button @click={() => counter.set(counter.value + 1)}>
  Clicks: {counter}
</button>
```

**Key Methods**:  
- `.set(value)` – Update the pulse.  
- `.beat(callback)` – Subscribe to changes.  
- `.throb(ms)` – Debounce updates (e.g., for search inputs).  

---

### **2. `reState` (Derived State)**  
**What it is**: Computed state that reacts to `pulse` changes.  
**Use Case**: Filtered lists, formatted dates, expensive calculations.  

```html
<script>
  const todos = pulse([{ text: "Learn Semantq", done: false }]);
  const doneCount = reState(() => todos.value.filter(t => t.done).length);
</script>

<span>{doneCount} completed</span>
```

---

### **3. `motive` (State Machines)**  
**What it is**: Explicit state transitions for complex workflows (auth, checkout flows).  
**Use Case**: Multi-step forms, game logic, API lifecycle.  

```html
<script>
  const auth = motive({
    states: ["login", "authenticated", "error"],
    transitions: {
      login: "login → authenticated",
      fail: "login → error"
    }
  });
</script>

@if(auth.is("login"))
  <LoginForm @submit={() => auth.transition("login")} />
@endif
```

---

### **4. `flow` (Async Streams)**  
**What it is**: Handles promises, WebSockets, or user events as reactive streams.  
**Use Case**: API calls, real-time chat, drag-and-drop.  

```html
<script>
  const posts = flow.fromFetch("/api/posts");
</script>

@if(posts.loading)
  <Spinner />
@else
  <ul>
    @each(post in posts.value)
      <li>{post.title}</li>
    @endeach
  </ul>
@endif
```

---

### **5. `sync` (Server/CRDT State)**  
**What it is**: Bi-directional sync with backend or conflict-resistant distributed state.  
**Use Case**: Collaborative editing, offline-first apps.  

```html
<script>
  const doc = sync.crdt("document-id"); // Real-time collaboration
  const profile = sync.api("/profile"); // REST/GraphQL
</script>

<input type="text" value={doc.value.title} 
       @input={(e) => doc.set({ ...doc.value, title: e.target.value })} />
```

---

## **State Scoping & Lifecycle**  
### **Global vs. Local State**  
- **Local**: Scoped to a component (e.g., `pulse` inside `<script>`).  
- **Global**: Shared via `model` (low-code) or `root` (code-first):  

```html
<script>
  // Global state (shared across components)
  const user = model("user", { name: "Alice" });
</script>

<header>Welcome, {user.name}!</header>
```

---

## **Integration with Semantq Syntax**  
### **1. Logic Blocks + State**  
```html
@if(user.isAdmin)
  <AdminDashboard />
@else
  <GuestMessage />
@endif
```

### **2. Dynamic Attributes**  
```html
<input type="text" value={searchQuery} 
       disabled={!isOnline} 
       @input={(e) => searchQuery.set(e.target.value)} />
```

### **3. Lists with `@each`**  
```html
<ul>
  @each(todo in todos.value)
    <li class={todo.done ? "completed" : ""}>
      {todo.text}
    </li>
  @endeach
</ul>
```

---

## **Advanced Patterns**  
### **1. AI-Ready State**  
Add metadata for LLM-assisted debugging:  
```js
const cart = model("cart", { items: [] })
  .annotate({ 
    description: "Stores user cart items",
    rules: ["Max 10 items"]
  });
```

### **2. Time-Travel Debugging**  
```js
trace.record(cart); // Debug state history
```

### **3. Edge-Compatible Sync**  
```js
const edgeCache = sync.edge("/data"); // Works in Cloudflare Workers
```

---

## **Conceptual Foundations**  
Semantq’s state management draws from:  
1. **Reactive Programming**  
   - [*The Introduction to Reactive Programming* (André Staltz)](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)  
   - [*Deprecating the Observer Pattern* (ACM Paper, 2010)](https://dl.acm.org/doi/10.1145/1869459.1869484)  

2. **State Machines**  
   - [*Statecharts: A Visual Formalism for Complex Systems* (David Harel, 1987)](https://www.sciencedirect.com/science/article/pii/0167642387900359)  

3. **CRDTs (Conflict-Free Replicated Data Types)**  
   - [*A Comprehensive Study of CRDTs* (arXiv, 2021)](https://arxiv.org/abs/2006.02752)  

4. **Fine-Grained Reactivity**  
   - [*SolidJS: The True Next-Gen Reactivity* (Ryan Carniato)](https://dev.to/ryansolid/a-hands-on-introduction-to-fine-grained-reactivity-3ndf)  

---

## **Why Semantq State?**  
1. **Unified** – Same API for client, server, and distributed state.  
2. **Reactive** – No wasted renders (faster than React/Vue).  
3. **Scalable** – From small widgets to real-time collaborative apps.  
4. **Future-Proof** – Built for AI, edge computing, and beyond.  

---

**Next Steps**:  
- [Try the Tutorial](https://semantq.dev/learn)  
- [Explore the API](https://semantq.dev/docs/state)  
