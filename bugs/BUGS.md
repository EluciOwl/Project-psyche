# Bug Log - Project: Psyche

### Symbols used:
- 🐛 bug
- 🔍 cause / examine
- 🔧 fix
- 💡 idea
- 👀 thing to watch
- ⚠️ warning / careful
- ✅ correct
- ❌ wrong

## 2026-06-20
### **Css** - Clouds overflow

- **🐛** Text extends beyond the cloud image
<br>![cloud overflow](bug-images/cloud-overflow.png)</br>

- **🔍** font-size too big for cloud max-width
- **🔧** Reduced font-size + added maxlength to input in thoughts.html + fixed image shape!
<br>![cloud overflow fixed](bug-images/cloud-overflow-fixed.png)</br>
- **💡** font-size, text width, and image size all have to agree. When text overflows, sometimes the fix is a better-shaped img, not more CSS.
---

### **Js** - Uncaught ReferenceError: thoughtText is not defined

- **🐛:** No Cloud is appearing after hitting enter

![uncaught-reference-error](bug-images/uncaught-reference-error.png)

- **🔍** not defined: mismatched variable name -> code below will never run -> no clouds apear after hitting enter!

- **🔧** match the names
```js
// Text create
const thoughtTextCloud = document.createElement("span");
thoughtTextCloud.classList.add("thought-text");
thoughtTextCloud.textContent = thoughtInput.value;
```
- **💡** "not defined" = the variable name doesn't exist (usually a typo or mismatched name). Different from "null" = the element wasn't found on the page.
---

### **Css** - `doneButton` apears after pressing any key.
- **🐛:** `doneButton` is created after pressing any button

- **🔍** the `else`❌ ran on *every* non-Enter keypress → button appeared immediately, not after 4 clouds.

- **🔧** Use if instead to specify the action. `if (inputCounter === 4)✅ `

- 💡 `else` triggers on ALL false cases. For independent checks, use a separate `if`
---
### **Css** - `doneButton` and input field are not adjusted
- **🐛:** `doneButton` pushes the input field to the left.

![done button no push](/bugs/bug-images/done-button-push-text-field.png)

- **🔍** all got `display: flex;` but no one got something like `position: absolute;`

- **🔧:** using `position: absolute;` at `doneButton`.

- **💡:** `position: absolute;` on `doneButton` -> not part of `display: flex;` anymore -> now adjust the rest.

![done button no push](/bugs/bug-images/done-button-no-push.png)
---

### **Css** - adjusted boxes have erratic behavior despite the settings
- **🐛:** Clouds are above the input field.

- **🔍:** `display: flex;`-configs manipulate uncontrolled

- **🔧:** use `border: _px solid _rgb` to understand the positions -> fix.
<br>![done button no push](/bugs/bug-images/use-border.png)</br>

- **💡:** `display: flex` -> `justify-content` and `align-items`, use `top`, `bottom`, `right`, `left`

---

### **Css** - `background` shorthand wipes my settings

- **🐛:** Background stopped using `cover` image showed at wrong size.

- **🔍:** `background: url(...)` is shorthand -> it silently resets `background-size` `-position`, `-repeat` to defaults.

- **🔧:** `background: url(...)` ❌ → `background-image: url(...)` ✅ 

- **💡** A shorthand resets every sub-property it covers, even ones you didn't write. Using long-hand to keep other settings.

---

### **HTML** — screen background only works when id is on `<body>`

- **🐛:** Have to repeat the background settings on every screen, it never worked from `body` alone.

- **🔍:** My `id="screen-1-home"` is defined in a separate `<div>`, not in the `body`.

- **🔧:** `<div id="screen-1-home">`❌ `<body id="screen-1-home">`✅

- **💡:** background doesn't inherit, setting it on `body` won't automatically apply to a child-`<div>` the children would need its own background. Putting the `id` on `<body>` means body itself carries the image, so it fills the viewport.