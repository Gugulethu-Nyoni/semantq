/* create code that will write such code */

/*


<script>
    let count = 0;

    function handleClick() {
        count += 1;
    }
</script>

<h2> Hello World </h2> 

<button @click={handleClick}>
    Clicked {count}
    {count === 1 ? 'time' : 'times'}
</button>



*/




class Component {
    constructor() {
        this.count = 0;
    }

    // Lifecycle hook: called when component mounts
    onMount() {
        this.updateUI();
    }

    // Lifecycle hook: called when component updates
    onUpdate() {
        this.updateUI();
    }

    // Lifecycle hook: called when component unmounts
    onUnmount() {
        // Clean up any resources
    }

    handleClick() {
        this.count += 1;
        this.triggerUpdate();
    }

    updateUI() {
        const button = document.querySelector('button');
        button.textContent = `Clicked ${this.count} ${this.count === 1 ? 'time' : 'times'}`;
    }

    // Trigger UI update
    triggerUpdate() {
        this.onUpdate();
    }
}

// Instantiate and mount component
const component = new Component();
component.onMount();

// Example: attach click event listener
const button = document.querySelector('button');
button.addEventListener('click', () => {
    component.handleClick();
});
