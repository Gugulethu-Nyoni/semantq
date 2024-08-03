Here is the list of Svelte custom syntax elements with actual markup examples:

    Event handlers:
        <button on:click={handleClick()}>Click me!</button>
        <input on:input={handleInput(event)} type="text">
        <div on:mouseover={handleMouseover()}></div>
    Bindings:
        <p>{name}</p> (binds to a variable named name)
        <p>{obj.prop}</p> (binds to an object property)
        <p>{arr[0]}</p> (binds to an array element)
    Conditional statements:
        <div {#if isAdmin}>Admin content{/if}></div>
        <div {#if isAdmin}>Admin content{:else}Regular content{/if}></div>
    Loops:
        <ul>{#each items as item}<li>{item}</li>{/each}</ul>
        <ul>{#each objects as obj}<li>{obj.key}: {obj.value}</li>{/each}</ul>
    Functions:
        <button on:click={doSomething()}>Click me!</button>
        <button on:click={doSomething(arg1, arg2)}>Click me!</button>
    Object literals:
        <div>{{ key: 'value' }}</div>
        <div>{{ key: expression }}</div>
    Array literals:
        <div>[1, 2, 3]</div>
        <div>[expression, expression, expression]</div>
    Template literals:
        <div>`` text ``</div>
        <div>`` text ${expression} text ``</div>
    JS expressions:
        <div>{expression}</div>
        <div>{expression1} {expression2}</div>

Note that these examples are just a few illustrations of how Svelte's custom syntax can be used. The actual markup will vary depending on your specific use case.