import parser from './devs/latest_parser.js';

const template = `
 <div>
  <slot let:name let:age>
    <p>{name} is {age} years old.</p>
  </slot>
</div>
`;

const result = parser.parse(template);
console.log(JSON.stringify(result,null,2));
