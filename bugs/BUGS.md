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

### **Js** - `doneButton` apears after pressing any key.
- **🐛:** `doneButton` is created after pressing any button

- **🔍** the `else` ran on *every* non-Enter keypress → button appeared immediately, not after 5 clouds.


```js
.
.
.
  thoughtInput.addEventListener("keydown", (event) => {
  // when browser gives me Enter -> div, img, span
  if (event.key === "Enter" && inputCounter < 5) {
    inputCounter++;
.
.
.
  } else❌ { 
      const doneButton = document.getElementById("done-button");
      doneButton.style.display = "block";
  }
.
.
.
```

- **🔧** Just use if instead haha x)...

```js
.
.
.
  thoughtInput.addEventListener("keydown", (event) => {
  // when browser gives me Enter -> div, img, span
  if (event.key === "Enter" && inputCounter < 5) {  
    inputCounter++;
.
.
.
  }
  if (inputCounter === 5)✅ {  
      const doneButton = document.getElementById("done-button");
      doneButton.style.display = "block";
  }
.
.
.
```
💡 `else` triggers on ALL false cases. For independent checks, use a separate `if`.