import parser from './devs/latest_parser.js';

const template = `
  <div>
    <p>{message}</p>
    @if(showButton)
      <button @click={handleClick}>Click Me</button>
    @endif
  </div>
`;

const result = parser.parse(template);
console.log(result);
