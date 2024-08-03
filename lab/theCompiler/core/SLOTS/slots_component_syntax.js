
// MyComponent.smq
<script>
  export let name;
  export let age;
</script>

<div>
  <h1>Hello, {name}!</h1>
  <p>You are {age} years old.</p>
</div>


+page.smq

<script>

import MyComponent from './pathToComponent';

</script>




<MyComponent name="John" age="30">

// under the hood - you can use native js attributes to extract attribute names and values into a props object



const element = document.querySelector('MyComponent'); // assume MyComponent is an HTML element

const attributes = element.attributes;

const props = {};
for (const attribute of attributes) {
  props[attribute.name] = attribute.value;
}

console.log(props); // { name: "John", age: "30" }

// now you can pass the props to the componentClass


// Component class
class MyComponent {
  constructor(props) {
    this.props = props;
  }

  render() {
    const { name, age } = this.props;
    return `<div><h1>Hello, ${name}!</h1><p>You are ${age} years old.</p></div>`;
  }
}

// Component instantiation and props passing
const myComponent = new MyComponent(props);
const html = myComponent.render();

console.log(html); // Output: <div><h1>Hello, John!</h1><p>You are 30 years old.</p></div>

