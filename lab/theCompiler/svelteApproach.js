<script>
    let count = 0;
    
    function increment() {
        count += 1;
    }
</script>

<button on:click={increment}>
    Clicked {count} {count === 1 ? 'time' : 'times'}
</button>



// typical transpiled code 


let count = 0;

function increment() {
    count += 1;
}

// Svelte-generated reactive declaration to update the DOM when count changes
let _count;
let _mounted = false;

function update() {
    if (_mounted) {
        document.querySelector("button").textContent = "Clicked " + _count + (_count === 1 ? ' time' : ' times');
    }
}

function _set(count) {
    if (_count !== count) {
        _count = count;
        update();
    }
}

// Svelte-generated lifecycle methods
export function create_fragment(ctx) {
    let button;

    return {
        c() {
            button = document.createElement("button");
            button.textContent = "Clicked 0 times";
            button.addEventListener("click", increment);
        },
        m(target, anchor) {
            target.insertBefore(button, anchor);
        },
        p: noop,
        i: noop,
        o: noop,
        d(detaching) {
            if (detaching) {
                button.parentNode.removeChild(button);
            }
            button.removeEventListener("click", increment);
        }
    };
}

export default function App(options) {
    if (!_mounted) {
        const fragment = create_fragment();
        fragment.c();
        fragment.m(options.target);
        _mounted = true;
    }

    _set(count);
}
